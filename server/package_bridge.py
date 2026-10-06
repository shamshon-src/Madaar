"""Adapt the delivered curated corpus to the existing web game's service contract.

No model calls, new religious content, game rewards or board movement are generated here.
Answer keys stay in the server's temporary question store.
"""
import re
import time
import uuid
from threading import RLock
from typing import Any
from fastapi import HTTPException
from pydantic import BaseModel, Field
from app.main import app
from app.services.cards import build
from app.services.retrieval import EVIDENCE
from app.services.evaluation import evaluate
from learner_support import adapt_card, correct_answer, feedback_text, expanded_explanation

for middleware in app.user_middleware:
    origins = middleware.kwargs.get("allow_origins", [])
    origins.extend(["http://localhost:5500", "http://127.0.0.1:5501", "http://localhost:5501", "http://127.0.0.1:5600", "http://localhost:5600"])

DOMAINS = {"worship": "worship", "transactions": "transactions", "belief": "aqeedah", "history": "seerah", "quran": "quran", "ethics": "ethics"}
CATEGORIES = {value: key for key, value in DOMAINS.items()}
APPROVED = [entry for entry in EVIDENCE if entry.get("approved")]
QUESTIONS: dict[tuple[str, str], dict] = {}
LOCK = RLock()
TTL = 6 * 60 * 60

class Request(BaseModel):
    topic: str = Field(default="", max_length=200)
    topicCategory: str = "worship"
    language: str = "ar"
    type: str = "know"
    sessionId: str = Field(default="local", max_length=100)
    questionId: str = Field(default="", max_length=100)
    requestId: str = Field(default="", max_length=200)
    category: int = 0
    newLearner: bool = False
    player: int = Field(default=0, ge=0, le=3)
    text: str = Field(default="", max_length=4000)
    choice: int = -1
    more: bool = False
    difficulty: int | None = Field(default=None, ge=1, le=3)
    timedOut: bool = False

def normal(value):
    return re.sub(r"\s+", " ", re.sub(r"[\u064b-\u065f\u0670\u0640]", "", value).translate(str.maketrans("أإآٱى", "ااااي"))).strip()

def evidence(request):
    return next((entry for entry in APPROVED if normal(entry["topic"]) == normal(request.topic) and entry["domain"] == DOMAINS.get(request.topicCategory)), None)

def settings(request):
    return {"domain": DOMAINS.get(request.topicCategory), "topic": request.topic, "language": request.language,
            "ageGroup": "8-16" if request.category == 0 else "16+", "knowledgeProfile": "new_to_islam" if request.newLearner else "prior_knowledge"}

def require_arabic(request):
    if request.language != "ar":
        raise HTTPException(409, "The supplied package has no approved English questions yet. Switch to Arabic to try its content.")

def source(entry):
    return {"label": f'{entry["source_title"]} · {entry["reference"]}', "url": entry["source_url"]}

def evidence_detail(entry):
    return {"text": entry['text'], "source": source(entry)}

def suggestions(request):
    return [entry["topic"] for entry in APPROVED if entry["domain"] == DOMAINS.get(request.topicCategory)]

def stored(request):
    with LOCK:
        item = QUESTIONS.get((request.sessionId, request.questionId))
    if not item or time.time() - item["created"] > TTL:
        raise HTTPException(404, "انتهت صلاحية السؤال أو أُعيد تشغيل الخدمة؛ اسحب بطاقة جديدة.")
    return item

@app.get("/api/ai/health")
def bridge_health():
    return {"status": "ok", "provider": "supplied-curated-package", "modelConnected": False, "languages": ["ar"],
            "topics": [{"topic": entry["topic"], "category": CATEGORIES[entry["domain"]]} for entry in APPROVED]}

@app.post("/api/ai/validateTopic")
def validate_topic(request: Request):
    entry = evidence(request)
    return {"available": bool(entry), "topic": entry["topic"] if entry else request.topic, "category": request.topicCategory, "suggestions": suggestions(request)}

@app.post("/api/ai/catalogue")
def catalogue(request: Request):
    return bridge_health()

@app.post("/api/ai/suggestTopics")
def suggest_topics(request: Request):
    return {"suggestions": suggestions(request)}

@app.post("/api/ai/generateQuestion")
def generate_question(request: Request):
    require_arabic(request)
    entry = evidence(request)
    if not entry:
        return {"unavailable": True, "suggestions": suggestions(request)}
    if request.type not in {"know", "explore", "analyze"}:
        raise HTTPException(422, "نوع البطاقة غير صالح.")
    key = (request.sessionId, request.requestId)
    now = time.time()
    with LOCK:
        for qkey in list(QUESTIONS):
            if now - QUESTIONS[qkey]["created"] > TTL:
                del QUESTIONS[qkey]
        if request.requestId:
            existing = next((item for item in QUESTIONS.values() if item["requestKey"] == key and item["entry"]["id"] == entry["id"] and item["card"]["type"] == request.type), None)
            if existing:
                return existing["public"]
        sequence = sum(item["session"] == request.sessionId for item in QUESTIONS.values())
        cfg = settings(request)
        card = build({**cfg, "topic": entry["topic"]}, request.type, request.difficulty or 1, sequence)
        card, profile = adapt_card(card, entry, cfg, request.difficulty)
        public = {"id": str(uuid.uuid4()), "type": request.type, "topic": entry["topic"], "mock": False,
                  "provider": "supplied-curated-package", "text": entry["text"] + "\n\n" + card["prompt"],
                  "options": card.get("choices") or [], "source": source(entry),
                  "evidence": evidence_detail(entry), "learnerProfile": profile,
                  "difficulty": card['adaptiveDifficulty']}
        QUESTIONS[(request.sessionId, public["id"])] = {"session": request.sessionId, "requestKey": key, "created": now, "entry": entry, "card": card, "public": public, "settings": settings(request)}
    return public

@app.post("/api/ai/evaluateAnswer")
def evaluate_answer(request: Request):
    item = stored(request)
    card, entry = item["card"], item["entry"]
    cfg = item['settings']
    if request.timedOut:
        grade, explanation, referral = 0, 'انتهى الوقت دون إجابة مكتملة.', False
    elif card["type"] == "analyze":
        cfg = item["settings"]
        result = evaluate(request.text, card["prompt"], entry, cfg["ageGroup"], cfg["knowledgeProfile"], "ar")
        grade = result["score"]
        explanation = result["rationale"] + "\n" + card["explanation"]
        referral = result.get("refusalReason") in {"personal_fatwa", "sensitive_dispute"}
    else:
        if request.choice not in range(len(card["choices"])):
            raise HTTPException(422, "اختر إجابة صالحة.")
        grade = {"know": 1, "explore": 2}[card["type"]] if request.choice == card["correctChoiceIndex"] else 0
        explanation, referral = card["explanation"], False
    explanation = feedback_text(grade, {'know': 1, 'explore': 2, 'analyze': 3}[card['type']], entry, cfg) + '\n' + explanation
    return {"questionId": request.questionId, "type": card["type"], "grade": grade, "steps": grade,
            "correctAnswer": correct_answer(card, entry), "evidence": evidence_detail(entry),
            "explanation": explanation, "source": source(entry), "needsReferral": referral, "mock": False}

@app.post("/api/ai/getHint")
def get_hint(request: Request):
    stored(request)
    return {"text": "ارجع إلى الدليل المرفق: ما المعنى الذي يذكره، وكيف يوجّه التصرف في الحالة؟", "mock": False}

@app.post("/api/ai/simplify")
def simplify(request: Request):
    item = stored(request)
    cfg, entry = item["settings"], item["entry"]
    # Related passages are for further reading, never presented as direct proof of this answer.
    related = [other for other in APPROVED if other['domain'] == entry['domain'] and other['id'] != entry['id']]
    return {"text": expanded_explanation(item['card'], entry, cfg, request.more),
            "source": source(entry), "evidence": evidence_detail(entry),
            "relatedEvidence": [{**evidence_detail(other), 'topic': other['topic'], 'explanation': other['simple']}
                                for other in related[:3 if request.more else 2]],
            "mock": False}

@app.post("/api/ai/getKnowledge")
def get_knowledge(request: Request):
    require_arabic(request)
    entry = evidence(request)
    if not entry:
        raise HTTPException(404, "لا توجد ومضة معرفة في الحزمة لهذا الموضوع.")
    return {"text": entry["simple"], "source": source(entry), "mock": False}

@app.post("/api/ai/askFalak")
def ask_falak(request: Request):
    text="This package does not include a Falak chat service. Consult the official fatwa authority for questions requiring a fatwa." if request.language=='en' else "هذه الحزمة لا تحتوي على محادثة مع فلك. للأسئلة التي تحتاج إلى فتوى، ارجع إلى جهة الإفتاء الرسمية."
    return {"text": text, "needsReferral": True, "mock": False}

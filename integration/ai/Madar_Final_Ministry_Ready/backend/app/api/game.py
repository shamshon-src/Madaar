from typing import Any,Literal
from fastapi import APIRouter,HTTPException
from pydantic import BaseModel,Field
from app.services.cards import build
from app.services.retrieval import retrieve
from app.services.evaluation import evaluate
from app.services.safety import classify_input
from app.services.adaptation import simplify_item
from app.core.config import settings as cfg
router=APIRouter(prefix="/game",tags=["game"])
class CardRequest(BaseModel): settings:dict[str,Any];card_type:Literal["know","explore","analyze"];adaptive_difficulty:int=Field(default=1,ge=1,le=3);sequence:int=0
class EvalRequest(BaseModel): settings:dict[str,Any];card:dict[str,Any];answer:str
class SimplifyRequest(BaseModel): settings:dict[str,Any];card:dict[str,Any]
class SafetyRequest(BaseModel): input:str;question:str=""
@router.post("/card")
def card(p:CardRequest):
 try:return build(p.settings,p.card_type,p.adaptive_difficulty,p.sequence)
 except ValueError as e:raise HTTPException(404,str(e))
@router.post("/evaluate")
def eval_answer(p:EvalRequest):
 hits=retrieve(p.card.get("topic",""),topic=p.card.get("topic"),top_k=1)
 if not hits:raise HTTPException(404,"No approved evidence found")
 return evaluate(p.answer,p.card.get("prompt",""),hits[0],p.settings.get("ageGroup","8-16"),p.settings.get("knowledgeProfile","prior_knowledge"),p.settings.get("language","ar"))
@router.post("/simplify")
def simplify(p:SimplifyRequest):
 hits=retrieve(p.card.get("topic",""),topic=p.card.get("topic"),top_k=1)
 if not hits:raise HTTPException(404,"No approved evidence found")
 return simplify_item(hits[0],p.settings.get("ageGroup","8-16"),p.settings.get("knowledgeProfile","prior_knowledge"),p.settings.get("language","ar"))
@router.post("/safety-check")
def safety(p:SafetyRequest):return classify_input(p.input,p.question)
@router.get("/official-referral")
def referral():return {"name":"الرئاسة العامة للبحوث العلمية والإفتاء","url":cfg.official_ifta_url}

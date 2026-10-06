import re
from rapidfuzz.fuzz import ratio
OFFENSIVE=[r"\bغبي\b",r"\bحقير\b",r"\bقذر\b",r"\bidiot\b",r"\bstupid\b"]
INJECTION=[r"ignore previous",r"ignore all",r"system prompt",r"developer message",r"jailbreak",r"give me .* points",r"اعطني .* نقاط",r"غي.?ر .* درج",r"تجاهل .* تعليمات",r"pretend you are",r"تقمص .* نبي",r"تحدث بلسان .* نبي"]
FATWA=[r"\bأنا\b.*\b(فعلت|طلقت|أفطرت|صمت|صليت|حلفت|جامعت)\b",r"\bهل\b.*\b(صيامي|صلاتي|زواجي|طلاقي|حجي|وضوئي)\b",r"ما الحكم إذا فعلت",r"what is the ruling if i"]
SENSITIVE=[r"طلاق",r"تكفير",r"دماء",r"جناية",r"نزاع أسري",r"قتل",r"divorce",r"takfir"]
REDLINES=[r"الله .* ناقص",r"الربا .* حلال",r"الله ليس .* واحد",r"النبي .* كاذب"]
REJECT=[r"السؤال غير صحيح",r"غير واقعي",r"أرفض السؤال",r"the question is wrong"]
PLAT=["الدين يسر","النية طيبة","الله غفور رحيم","religion is easy"]
def classify_input(text,question=""):
 t=(text or "").strip(); low=t.lower()
 if not t or re.fullmatch(r"[\W_]+",t) or low in {"asdfg","لا أعلم","ما أدري","i don't know","idk"}: return {"allowed":False,"category":"blank_or_nonsense","message":"لم يتم تقديم تحليل للمسألة؛ طالع الشرح والإسناد ثم واصل تقدمك."}
 if question and ratio(low,question.strip().lower())>=82:return {"allowed":False,"category":"echoing","message":"الإجابة تكرار لنص السؤال؛ استخرج الحكم والعلة وأعد صياغتهما بأسلوبك."}
 if any(x in low for x in PLAT) and len(t.split())<=8:return {"allowed":False,"category":"platitude","message":"الجواب عام جدًا؛ ركّز على موضع الخلل والحكم أو الأثر المباشر للحالة."}
 for p in REJECT:
  if re.search(p,low,re.I):return {"allowed":False,"category":"rejection_premise","message":"المطلوب تحليل الحالة المعروضة استنادًا إلى معطياتها."}
 for p in OFFENSIVE:
  if re.search(p,low,re.I):return {"allowed":False,"category":"offensive","message":"تم رصد مدخل غير ملائم لقواعد المنصة."}
 for p in INJECTION:
  if re.search(p,low,re.I):return {"allowed":False,"category":"prompt_injection","message":"تم رصد مدخل غير ملائم لقواعد المنصة."}
 for p in FATWA:
  if re.search(p,low,re.I):return {"allowed":False,"category":"personal_fatwa","message":"المسائل الفردية والفتاوى الخاصة تتطلب الرجوع للجهات الشرعية المؤهلة."}
 for p in SENSITIVE:
  if re.search(p,low,re.I):return {"allowed":False,"category":"sensitive_dispute","message":"هذه المسألة تحتاج جهة شرعية مؤهلة؛ أوقفنا التقييم الآلي لهذه الإجابة."}
 for p in REDLINES:
  if re.search(p,low,re.I):return {"allowed":False,"category":"theological_redline","message":"المعنى الوارد يخالف أصلًا قطعيًا في نطاق المنصة؛ لا تُمنح نقاط ويُعرض التصحيح بهدوء من المصدر المعتمد."}
 return {"allowed":True,"category":"educational","message":None}

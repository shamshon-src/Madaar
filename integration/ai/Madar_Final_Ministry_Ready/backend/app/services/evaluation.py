from app.services.safety import classify_input
from app.services.adaptation import profile_rules
def evaluate(answer,question,evidence,age_group,knowledge_profile,language):
 s=classify_input(answer,question)
 if not s["allowed"]:return {"score":0,"steps":0,"rationale":s["message"],"matchedElements":[],"missingElements":evidence.get("required",[]),"refusal":True,"refusalReason":s["category"]}
 low=answer.lower();matched=[];missing=[]
 for i,group in enumerate(evidence.get("keywords",[])[:2]):
  label=evidence.get("required",["element1","element2"])[i]; ok=any(k.lower() in low for k in group); (matched if ok else missing).append(label)
 n=len(matched)
 if n>=2:score=3;rat="استوفت الإجابة العنصرين المطلوبين مع ربط سليم."
 elif n==1:score=2;rat="استوفت الإجابة عنصرًا رئيسيًا واحدًا بشكل صحيح."
 elif len(answer.split())>=4:score=1;rat="توجد محاولة مرتبطة بالموضوع لكنها لم تستوفِ أي عنصر كامل."
 else:score=0;rat="الإجابة لا تستوفي عناصر التحليل الموضوعي."
 return {"score":score,"steps":score,"rationale":rat,"matchedElements":matched,"missingElements":missing,"refusal":False,"refusalReason":None,"calibration":profile_rules(age_group,knowledge_profile,language)}

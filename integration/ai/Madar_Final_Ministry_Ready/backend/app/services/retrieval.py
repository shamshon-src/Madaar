import json,re
from pathlib import Path
DATA=Path(__file__).resolve().parents[1]/"data"
EVIDENCE=json.loads((DATA/"curated_evidence.json").read_text(encoding="utf-8"))
CATALOG=json.loads((DATA/"source_catalog.json").read_text(encoding="utf-8"))
def toks(s): return {x for x in re.sub(r"[^\w\u0600-\u06FF]+"," ",s.lower()).split() if len(x)>1}
def retrieve(query,domain=None,topic=None,top_k=5):
 q=toks(query); rows=[]
 for e in EVIDENCE:
  if not e.get("approved"): continue
  score=(12 if topic and e["topic"]==topic else 0)+(5 if domain and e["domain"]==domain else 0)+len(q & toks(" ".join([e["topic"],e["text"],e["reference"],e["simple"],e["deep"]])))
  if score>0: rows.append((score,e))
 rows.sort(key=lambda x:x[0],reverse=True)
 return [e for _,e in rows[:top_k]]
def catalog(): return CATALOG

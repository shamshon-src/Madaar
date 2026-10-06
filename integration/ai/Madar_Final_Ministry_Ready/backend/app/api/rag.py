from fastapi import APIRouter
from pydantic import BaseModel
from app.services.retrieval import retrieve
router=APIRouter(prefix="/rag",tags=["rag"])
class Search(BaseModel):query:str;domain:str|None=None;topic:str|None=None;top_k:int=5
@router.post("/search")
def search(p:Search):
 hits=retrieve(p.query,p.domain,p.topic,p.top_k)
 return {"mode":"curated-local-rag","count":len(hits),"results":[{"id":x["id"],"topic":x["topic"],"text":x["text"],"reference":x["reference"],"source_title":x["source_title"],"source_url":x["source_url"]} for x in hits]}

from fastapi import APIRouter
from app.services.retrieval import catalog
router=APIRouter(prefix="/sources",tags=["sources"])
@router.get("/catalog")
def source_catalog():return {"sources":catalog(),"policy":"Only reviewed/approved material is eligible for production retrieval."}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.game import router as game_router
from app.api.rag import router as rag_router
from app.api.sources import router as sources_router
app=FastAPI(title="MADAR Ministry-Ready API",version="5.0.0",description="Adaptive, source-grounded educational game with safety guardrails.")
app.add_middleware(CORSMiddleware,allow_origins=[settings.frontend_origin,"http://localhost:3000","http://127.0.0.1:3000"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
@app.get("/")
def root():return {"app":"MADAR","version":"5.0.0","docs":"/docs"}
@app.get("/health")
def health():return {"status":"ok","mode":"ministry-ready-demo","curated_rag":True}
@app.get("/system/architecture")
def architecture():return {"learning":["DOK1 Know","DOK2 Explore","DOK3 Analyze","adaptive difficulty"],"retrieval":"approved curated corpus locally; pgvector production schema supplied","safety":["eligibility","echoing","platitudes","rejection premise","offensive","prompt injection","fatwa escalation","theological redline"],"persona":"Falak educational guide; no religious roleplay","translation_policy":"primary religious texts are never machine-translated"}
app.include_router(game_router);app.include_router(rag_router);app.include_router(sources_router)

# MADAR V4 — Full Project
A complete, standalone demo project for the "Madar" educational game.

## What is included
- Next.js + React + TypeScript frontend
- FastAPI backend
- Adaptive Difficulty Engine
- DOK 1 / DOK 2 / DOK 3 learning cards
- Objective analysis rubric (0–3)
- Safety guardrails
- Personal-fatwa escalation UI
- Source upload + PDF extraction
- RAG-ready architecture
- PostgreSQL + pgvector Docker Compose
- OpenAI integration hooks through environment variables
- Local demo mode that runs without OpenAI credits

## 1. Requirements
Install:
- Python 3.12
- Node.js 20+
- Docker Desktop (recommended for PostgreSQL/pgvector)
- VS Code

## 2. Run the backend
Open a terminal in:
`backend`

Windows:
```bat
py -3.12 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Backend:
http://127.0.0.1:8000

Swagger:
http://127.0.0.1:8000/docs

## 3. Run the frontend
Open another terminal in:
`frontend`

```bat
npm install
copy .env.local.example .env.local
npm run dev
```

Frontend:
http://localhost:3000

## 4. Optional PostgreSQL + pgvector
From the project root:
```bat
docker compose up -d
```

## 5. Demo mode
The project runs without OpenAI billing.
In demo mode:
- cards are generated from a curated local demo corpus;
- DOK 3 analysis uses an objective rule engine;
- safety checks run locally.

## 6. Production RAG
When OpenAI or another embedding provider is enabled:
1. upload reviewed sources;
2. extract pages/chunks;
3. create embeddings;
4. store vectors in pgvector;
5. retrieve approved chunks only;
6. generate educational wording inside the retrieved context;
7. validate citation/source/page before display.

## AI Safety Boundary
The LLM must not be treated as a religious source.
Primary religious texts and approved translations must be retrieved from a curated corpus.
Personal fatwas and sensitive individual cases are escalated to qualified official guidance.

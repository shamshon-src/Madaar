# MADAR V5 Architecture

Learner Profile
→ Input Eligibility / Guardrails
→ Adaptive Learning State
→ DOK Card Orchestrator
→ Approved Curated Retrieval
→ Card + Evidence + Citation
→ Answer
→ Guardrails
→ Objective Rubric 0–3
→ Falak Explanation
→ Adaptive State Update

## Evidence boundary
- The LLM is not a religious source.
- Primary religious text is retrieved from reviewed storage only.
- English primary text must come from an approved bilingual corpus; the application does not synthesize a translation.

## Production RAG
Metadata Filter (domain/topic/language/review_status)
→ Embedding
→ pgvector/HNSW
→ Approved chunks
→ constrained generation
→ citation validation
→ UI

## Escalation
Personal fatwa / divorce / takfir / blood / complex dispute
→ evaluation locked at 0 for that input
→ official guidance modal
→ game remains usable

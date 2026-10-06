# مَدار — Ministry Ready

نسخة عرض نهائية مستقلة، مبنية على ملفي مواصفات الذكاء الاصطناعي ومنهجية المراجع.

## تعمل بدون OpenAI
المسار التجريبي يستخدم Curated Local RAG، لذلك يمكن عرض المشروع حتى بدون رصيد API.

## ملفات مهمة للجنة التقنية
- `COMPLIANCE_MATRIX_AR.md`
- `ARCHITECTURE.md`
- `DEPLOYMENT_AR.md`
- `backend/app/data/source_catalog.json`
- `backend/app/data/curated_evidence.json`
- `supabase/schema.sql`

## تشغيل Backend
```bat
cd backend
py -3.12 -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload
```

## تشغيل Frontend
```bat
cd frontend
npm install --fetch-timeout=120000 --fetch-retries=5
copy .env.local.example .env.local
npm run dev
```

- App: http://localhost:3000
- API docs: http://127.0.0.1:8000/docs

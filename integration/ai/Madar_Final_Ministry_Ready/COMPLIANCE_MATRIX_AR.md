# مصفوفة المطابقة مع متطلبات مَدار

## الفئات والتكيّف
- 8–16 / 16+: مطبق في الإعداد.
- معرفة سابقة / أتعلم الإسلام حديثًا: مطبق.
- Difficulty Adaptive: Mastery + correct/wrong streaks + رفع/خفض DOK.
- التعثر: يفعّل التبسيط، و«بسّط لي» يكيّف الشرح حسب الفئة.

## البطاقات
- «اعرف»: DOK1، 3 خيارات، إجابة واحدة صحيحة، +1 نقطة/خطوة، إسناد.
- «استكشف»: DOK2، تدوير متوازن برمجيًا بين Textual Deduction / Case Scenario / Classification، +2.
- «حلل»: DOK3، metadata يدور بين 4 أنماط تحليلية، إجابة قصيرة، 0–3.
- Rubric: عنصر السبب/الخلل + عنصر النتيجة/الأثر.

## اللغة
- عربي/إنجليزي في الواجهة.
- Transliteration يظهر في دعم فَلَك للمستخدم الإنجليزي الجديد.
- النص الديني الأولي لا يترجم آليًا: إذا لا توجد ترجمة معتمدة في corpus الإنجليزي يُحجب النص بدل اختلاق ترجمة.

## عدم أهلية الإدخال
- Blank/Nonsense.
- Echoing للسؤال.
- Platitudes.
- Rejection of premise.
- Offensive input.
- Prompt Injection/Jailbreak patterns.

## السلامة الشرعية
- Personal Fatwa escalation.
- Sensitive case escalation.
- Theological redline patterns تعطي 0 ولا تكافئ الإجابة.
- فَلَك مرشد تعليمي فقط، ولا توجد وظيفة Roleplay ديني.
- رابط الإحالة إلى الموقع الرسمي للرئاسة العامة للبحوث العلمية والإفتاء.

## RAG والمصادر
- Curated Local RAG يعمل فعليًا دون API عبر `POST /rag/search`.
- evidence المحلي لا يُسترجع إلا إذا `approved=true`.
- كل بطاقة تحتوي Source + Reference + URL + primaryText للعربية.
- كتالوج المصادر المحددة في ملف المنهجية موجود في `backend/app/data/source_catalog.json`.
- Production schema يحتوي `review_status`, page/reference, vector(1536), HNSW.

## الحد الفاصل المهم
الحزمة تتضمن Corpus تجريبيًا مُراجعًا صغيرًا لعرض المنظومة، وليس نسخًا كاملة من الكتب والمواقع الخارجية. كتالوج المصادر ومسار Production موجودان لإدخال المواد بعد المراجعة الشرعية/اللغوية ووفق حقوق استخدامها. هذا هو السلوك الصحيح بدل نسخ مصادر خارجية كاملة داخل المشروع دون مراجعة.

(() => {
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const config = () => {
    const base = window.MadaarServiceConfig;
    let override = read('madaarProviderOverride', null);
    // Migrate the former local bridge address saved before its port changed.
    if (base?.provider === 'supplied-curated-package' && override?.mode === 'remote' &&
        /^http:\/\/(?:127\.0\.0\.1|localhost):8000\/api\/ai\/?$/.test(override.apiBaseUrl || '')) {
      override = { ...override, apiBaseUrl: base.apiBaseUrl };
      try { localStorage.setItem('madaarProviderOverride', JSON.stringify(override)); } catch {}
    }
    const selected = override && ['mock','remote'].includes(override.mode) ? { ...base, ...override } : base;
    return { ...selected, ...(selected?.mode === 'mock' ? read('madaarTestService', {}) : {}), mode: selected?.mode };
  };
  const maxGrade = { know: 1, explore: 2, analyze: 3 };
  const samples = {
    worship: ['الصيام', 'في النموذج التجريبي: رمضان شهر الصيام، والنصح يكون بلطف.', 'رمضان', 'النصح بلطف'],
    transactions: ['الأمانة', 'في النموذج التجريبي: الأمانة تحفظ الحقوق، والغش يضر بالثقة.', 'الأمانة', 'حفظ الحقوق'],
    belief: ['أركان الإيمان', 'في النموذج التجريبي: يدرس المتعلم أركان الإيمان، ثم يشرحها بلغته.', 'أركان الإيمان', 'شرح المعنى'],
    history: ['السيرة النبوية', 'في النموذج التجريبي: يرتب المتعلم أحداث السيرة، ثم يربط الحدث بسياقه.', 'السيرة النبوية', 'ربط الحدث بسياقه'],
    quran: ['علوم القرآن', 'في النموذج التجريبي: يقرأ المتعلم المعنى، ثم يرجع إلى التفسير المعتمد لفهمه.', 'التفسير المعتمد', 'فهم المعنى'],
    ethics: ['الرفق', 'في النموذج التجريبي: يختار المتعلم الرفق عند النصح، ويراعي حق الآخرين.', 'الرفق', 'مراعاة الحقوق']
  };
  const normalize = text => String(text || '').normalize('NFKC').replace(/[ًٌٍَُِّْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').trim().toLowerCase();
  const sampleQuestion = request => {
    const entry = samples[request.topicCategory] || samples.worship;
    const type = request.type || 'know';
    const count = read('madaarMockQuestionCounter', 0) + 1;
    localStorage.setItem('madaarMockQuestionCounter', JSON.stringify(count));
    const prepared = window.MadaarQuestionBank?.create(window.MadaarTopics?.find(request.topic)?.topic || request.topic || entry[0],type,count,request.language);
    if (prepared) return prepared;
    const question = {
      id: `mock-${count}`, type, topic: request.topic || entry[0], mock: true,
      text: type === 'analyze' ? `${entry[1]} وضّح الفكرتين في جملة أو جملتين، وبيّن العلاقة بينهما.` : type === 'explore' ? `${entry[1]} أي تصرف يطبق المعنى؟` : `${entry[1]} ما المفهوم المذكور في المادة؟`,
      options: type === 'analyze' ? [] : type === 'explore' ? [entry[3], 'تجاهل المعنى', 'الاعتماد على التخمين'] : [entry[2], 'مفهوم غير مذكور', 'لا تتوفر معلومة في النص'],
      pattern: type === 'analyze' ? 'تحليل نموذج تجريبي' : 'فهم مادة تجريبية',
      source: { label: 'الإسناد غير متاح في المحاكاة؛ هذه مادة اختبار معدة مسبقًا.', url: null },
      explanation: `${entry[1]} الإجابة النموذجية تربط «${entry[2]}» بـ«${entry[3]}».`,
      hint: 'استخرج المفهوم الرئيس من النص، ثم اربطه بالفعل أو النتيجة المذكورة.',
      modelAnswer: `${entry[2]} يرتبط بـ${entry[3]} لأن فهم المعنى يوجه التطبيق.`,
      rubric: [entry[2], entry[3]], correctIndex: 0
    };
    // Cycle option positions deterministically to exercise every answer control.
    if (type !== 'analyze') { const index = count % 3; [question.options[0], question.options[index]] = [question.options[index], question.options[0]]; question.correctIndex = index; }
    return question;
  };
  async function mock(method, request) {
    const settings = config();
    await new Promise(resolve => setTimeout(resolve, settings.scenario === 'slow' ? 1800 : 160));
    if (settings.scenario === 'failure') throw Error('تعذّر الوصول إلى خدمة المحاكاة. لم يتغير الرصيد أو الدور.');
    if (settings.scenario === 'timeout') throw Error('انتهت مهلة الخدمة. يمكنك إعادة المحاولة دون خسارة الدور.');
    if (settings.scenario === 'invalid') return { invalid: true };
    if (method === 'generateQuestion') {
      if (settings.scenario === 'unavailable' || (request.topic && window.MadaarTopics && !window.MadaarTopics.find(request.topic))) return { unavailable: true, suggestions: ['الصيام', 'الرفق', 'الأمانة'] };
      return sampleQuestion(request);
    }
    const question = request.question;
    if (method === 'evaluateAnswer') {
      let grade = question.type === 'analyze' ? 0 : Number(request.choice) === question.correctIndex ? maxGrade[question.type] : 0;
      let explanation = question.explanation;
      if (question.type === 'analyze') {
        const text = normalize(request.text);
        const injection = /تجاهل.*تعليمات|ignore.*instruction|اعطني.*نقاط|امنحني.*نقاط/i.test(text);
        const hits = question.rubric.filter(term => text.includes(normalize(term))).length;
        grade = hits === 2 ? 3 : hits === 1 ? 2 : /فهم|معن|تعلم|understand|meaning|learn/i.test(text) ? 1 : 0;
        if (['grade0','grade1','grade2','grade3'].includes(settings.scenario)) grade = Number(settings.scenario.slice(-1));
        if (injection || !text || /^(لا اعلم|لا ادري|مدري|i (?:do not|don't) know|i am not sure)$/i.test(text)) grade = 0;
        if (injection) explanation = 'تم رصد مدخل غير صالح للعبة.';
        else if (!grade) explanation = 'لم يتم تقديم تحليل للمسألة؛ طالع الشرح والإسناد المرفق لترسيخ المعلومة واصل تقدمك';
      }
      if(request.timedOut)grade=0;
      return { questionId: question.id, type: question.type, grade, steps: grade, correct: grade === maxGrade[question.type], explanation, source: question.source,
        correctAnswer:question.type==='analyze'?question.modelAnswer:question.options[question.correctIndex],
        evidence:{text:question.text.split('\n')[0],source:question.source},needsReferral: settings.scenario === 'referral', mock: true };
    }
    if (method === 'getKnowledge') {
      const entry=window.MadaarQuestionBank?.create(request.topic,'know',1,request.language);
      return {text:entry?.text.split('\n')[0] || 'اربط ما تتعلمه بتطبيقه، واسأل أهل الاختصاص عند الحاجة.',source:entry?.source,mock:true};
    }
    if (method === 'getHint') return { text: question.hint, mock: true };
    if (method === 'simplify') return { text: [question.explanation,question.modelAnswer,request.more?question.hint:''].filter(Boolean).join('\n\n'),source: question.source,evidence:{text:question.text.split('\n')[0],source:question.source},relatedEvidence:[],mock:true };
    if (method === 'askFalak') return { text: 'هذه إجابة تجريبية لفَلَك. جرّب الرجوع إلى شرح السؤال أو الاستفسار من الجهة الرسمية؛ لا تصدر المحاكاة حكمًا شخصيًا.', needsReferral: true, mock: true };
    throw Error('وظيفة الخدمة غير مدعومة.');
  }
  async function remote(method, request) {
    const settings = config();
    if (!settings.apiBaseUrl) throw Error('عنوان خدمة AI غير مضبوط. راجع service-config.js.');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), settings.timeoutMs || 10000);
    try {
      // Evaluation secrets and provider credentials remain on the server.
      const payload = { ...request };
      if (request.question) { payload.questionId = request.question.id; delete payload.question; }
      const response = await fetch(`${settings.apiBaseUrl.replace(/\/$/, '')}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
      if (!response.ok) {let detail;try{const body=await response.json();detail=typeof body.detail==='string'?body.detail:body.error;}catch{}throw Error(detail||'تعذّر تنفيذ طلب خدمة AI. لم تتغير النقاط؛ أعد المحاولة.');}
      return await response.json();
    } catch (error) { throw Error(error.name === 'AbortError' ? 'انتهت مهلة خدمة AI؛ أعد المحاولة.' : error instanceof TypeError ? request.language==='en'?'The local AI server is unavailable. Run Start-Madaar-AI.ps1, then retry.':'الخادم المحلي غير متاح. شغّل Start-Madaar-AI.ps1 ثم أعد المحاولة.' : error.message); }
    finally { clearTimeout(timeout); }
  }
  function validate(method, result, request) {
    if (!result || typeof result !== 'object') throw Error('استجابة الخدمة غير صالحة.');
    if(result.source?.url && !/^https?:\/\//i.test(result.source.url)) throw Error('رابط الإسناد غير صالح.');
    if (method === 'generateQuestion' && !result.unavailable) {
      if (!result.id || result.type !== request.type || typeof result.text !== 'string' || !result.text.trim() || (result.type !== 'analyze' && (!Array.isArray(result.options) || result.options.length !== 3 || result.options.some(x => typeof x !== 'string')))) throw Error('السؤال المستلم غير صالح؛ لم يبدأ الدور.');
    } else if (method === 'evaluateAnswer') {
      const max = maxGrade[request.question.type];
      if (result.questionId !== request.question.id || result.type !== request.question.type || !Number.isInteger(result.grade) || result.grade < 0 || result.grade > max || (result.type !== 'analyze' && ![0,max].includes(result.grade)) || result.steps !== result.grade || typeof result.explanation !== 'string') throw Error('نتيجة التقييم خارج حدود البطاقة؛ لم تُحتسب نقاط.');
    } else if (['getKnowledge','getHint','simplify','askFalak'].includes(method) && (typeof result.text !== 'string'||!result.text.trim())) throw Error('استجابة المساعدة غير صالحة.');
    return result;
  }
  const service = { getConfig: config, context: () => ({ ...read('madaarSetup', {}), language: localStorage.getItem('madaarLanguage') || 'ar', sessionId: read('madaarGameState', {}).sessionId || 'local', player: read('madaarGameState', {}).currentPlayer || 0, performance: read('madaarGameState', {}).history || [] }) };
  for (const method of ['generateQuestion','evaluateAnswer','getKnowledge','getHint','simplify','askFalak']) service[method] = async request => {
    if(!['mock','remote'].includes(config().mode))throw Error('وضع الخدمة غير معروف؛ اختر mock أو remote.');
    if (config().mode==='mock' && method === 'generateQuestion' && request.topic && window.MadaarTopics && !window.MadaarTopics.find(request.topic)) return { unavailable: true, suggestions: window.MadaarTopics.suggestions(request.topicCategory) };
    return validate(method, await (config().mode === 'remote' ? remote : mock)(method, request), request);
  };
  service.getReferralDirectory = async () => [{ name:'الرئاسة العامة للبحوث العلمية والإفتاء — السعودية', url:'https://alifta.gov.sa/ar/home', verifiedAt:'2026-10-05' }];
  service.getSupportedTopics=async()=>config().mode==='remote'?remote('catalogue',{}):{topics:Object.entries(window.MadaarTopics?.groups||{}).flatMap(([category,topics])=>topics.map(topic=>({topic,category})))};
  service.suggestTopics=async request=>config().mode==='remote'?remote('suggestTopics',request):{suggestions:window.MadaarTopics.suggestions(request.topicCategory)};
  service.validateTopic=async request=>{if(config().mode==='remote')return remote('validateTopic',request);const match=window.MadaarTopics.find(request.topic);return{available:!!match,topic:match?.topic,category:match?.category,suggestions:window.MadaarTopics.suggestions(request.topicCategory)};};
  window.MadaarAI = service;
})();

/* Authored reading-comprehension fixtures; not a fatwa or an AI-generated source. */
(() => {
  const lessons = {
    'الوضوء':['الطهارة','ترتيب الخطوات','يربط الدرس الوضوء بالطهارة، ويشجع على تعلم ترتيب الخطوات بدل التخمين.'],
    'الصلاة':['الصلاة','فهم المعاني','يربط الدرس الصلاة بفهم المعاني، ويشجع على التعلم بهدوء بدل الاستعجال.'],
    'الصيام':['الصيام','الصبر','يربط الدرس الصيام بالصبر، ويشجع على ضبط النفس وحسن التعامل.'],
    'الزكاة':['الزكاة','التكافل','يربط الدرس الزكاة بالتكافل، ويشجع على فهم أثر مساعدة المحتاجين.'],
    'الحج':['الحج','ترتيب المناسك','يربط الدرس الحج بتعلم ترتيب المناسك، ويشجع على السؤال عند عدم الفهم.'],
    'البيع والشراء':['الصدق','وضوح المعلومات','يربط الدرس البيع والشراء بالصدق ووضوح المعلومات بين الطرفين.'],
    'الأمانة في المعاملات':['الأمانة','حفظ الحقوق','يربط الدرس الأمانة في المعاملات بحفظ الحقوق والوفاء بما تم الاتفاق عليه.'],
    'الربا':['التعلم','الرجوع إلى المختص','يشجع درس الربا على التعلم والرجوع إلى المختص قبل الحكم على معاملة شخصية.'],
    'حفظ الحقوق':['الأمانة','حفظ الحقوق','يربط الدرس الأمانة بحفظ الحقوق، ويشجع على إعادة الحقوق إلى أصحابها.'],
    'الصدق في التجارة':['الصدق','وضوح المعلومات','يربط الدرس الصدق في التجارة بوضوح المعلومات وعدم إخفاء العيوب.'],
    'التوحيد':['التوحيد','فهم المعنى','يدعو الدرس إلى تعلم التوحيد وفهم المعنى قبل الانتقال إلى أسئلة أعمق.'],
    'أركان الإيمان':['أركان الإيمان','شرح المعنى','يربط الدرس تعلم أركان الإيمان بالقدرة على شرح المعنى بلغة المتعلم.'],
    'الإيمان بالملائكة':['الإيمان بالملائكة','التعلم من النص','يربط الدرس الإيمان بالملائكة بالتعلم من النص، ويشجع على تجنب التخمين.'],
    'الإيمان باليوم الآخر':['الإيمان باليوم الآخر','المسؤولية','يربط الدرس الإيمان باليوم الآخر بالمسؤولية والتفكير في أثر الأعمال.'],
    'أسماء الله الحسنى':['أسماء الله الحسنى','فهم المعاني','يربط الدرس تعلم أسماء الله الحسنى بفهم المعاني، بدل الاكتفاء بحفظ الكلمات.'],
    'الهجرة النبوية':['الهجرة النبوية','ترتيب الأحداث','يربط الدرس الهجرة النبوية بترتيب الأحداث وفهم سياقها.'],
    'غزوة بدر':['غزوة بدر','فهم السياق','يربط الدرس دراسة غزوة بدر بفهم السياق قبل استخلاص الدروس.'],
    'صلح الحديبية':['صلح الحديبية','ربط النتائج بالأحداث','يربط الدرس صلح الحديبية بربط النتائج بالأحداث بدل قراءتها منفصلة.'],
    'فتح مكة':['فتح مكة','ترتيب الأحداث','يربط الدرس فتح مكة بترتيب الأحداث وفهم العلاقات بينها.'],
    'السيرة النبوية':['السيرة النبوية','ربط الحدث بسياقه','يربط الدرس دراسة السيرة النبوية بربط الحدث بسياقه واستخلاص الدروس.'],
    'تفسير سورة الفاتحة':['التفسير','فهم المعنى','يربط الدرس قراءة التفسير بفهم المعنى، ويشجع على السؤال عن الكلمات غير الواضحة.'],
    'أسباب النزول':['أسباب النزول','فهم السياق','يربط الدرس تعلم أسباب النزول بفهم السياق والرجوع إلى مصادر موثوقة.'],
    'جمع القرآن':['جمع القرآن','ترتيب المعلومات','يربط الدرس دراسة جمع القرآن بترتيب المعلومات والتحقق من المصدر.'],
    'قصص القرآن':['قصص القرآن','استخلاص الدروس','يربط الدرس دراسة قصص القرآن باستخلاص الدروس وفهم المعاني.'],
    'آداب تلاوة القرآن':['تلاوة القرآن','الإنصات','يربط الدرس تلاوة القرآن بالإنصات والتعلم بهدوء واحترام.'],
    'علوم القرآن':['التفسير','فهم المعنى','يربط الدرس الرجوع إلى التفسير بفهم المعنى، ويشجع على التحقق من المعلومة.'],
    'بر الوالدين':['بر الوالدين','حسن التعامل','يربط الدرس بر الوالدين بحسن التعامل والكلام اللطيف والمساعدة.'],
    'صلة الرحم':['صلة الرحم','التواصل','يربط الدرس صلة الرحم بالتواصل والسؤال عن الأقارب وحسن التعامل معهم.'],
    'الرفق':['الرفق','النصح بلطف','يربط الدرس الرفق بالنصح بلطف، ويشجع على تجنب التجريح.'],
    'الأمانة':['الأمانة','حفظ الحقوق','يربط الدرس الأمانة بحفظ الحقوق وإعادة الأشياء إلى أصحابها.'],
    'آداب الحوار':['الإنصات','احترام الآخرين','يربط الدرس آداب الحوار بالإنصات واحترام الآخرين دون مقاطعة أو تجريح.']
  };
  window.MadaarQuestionBank={lessons,create(topic,type,count,language='ar'){
    const entry=lessons[topic];if(!entry)return null;
    let [concept,action,text]=entry;
    const english=language==='en',t=value=>window.MadaarI18n?.translate(value)||value;
    if(english){concept=t(concept);action=t(action);text=`In this lesson on “${t(topic)}”, connect ${concept.toLowerCase()} to ${action.toLowerCase()}. Read carefully and explain how the two ideas relate.`;}
    const analyze=type==='analyze',explore=type==='explore',alternate=count%2===0;
    const correct=explore?`أربط ${concept} بـ${action}`:alternate?action:concept;
    const question={id:`bank-${count}`,type,topic,mock:true,text:`${text}\n${analyze?'اشرح العلاقة بين الفكرتين في جملة أو جملتين، واذكر تطبيقًا لهما.':explore?'أي تصرف يطبق ما تعلمته من النص؟':alternate?'ما الفكرة التي يرتبط بها المفهوم في النص؟':'ما المفهوم الرئيس الذي يتحدث عنه النص؟'}`,options:analyze?[]:[correct,explore?'أتجاهل المعنى وأعتمد على التخمين':'التخمين دون قراءة النص',explore?'أحفظ الكلمات دون محاولة فهمها':'معلومة لم يتناولها النص'],pattern:analyze?'تحليل وتطبيق':explore?'تطبيق المعنى':'فهم النص',source:{label:'نص تدريبي مُعد مسبقًا لاختبار اللعب؛ ليس فتوى أو إسنادًا من خدمة AI.',url:null},explanation:`الإجابة تربط «${concept}» بـ«${action}». ${text}`,hint:`ابحث في النص عن العلاقة بين «${concept}» والفكرة المرتبطة به.`,modelAnswer:`يرتبط مفهوم ${concept} بـ${action}؛ أطبق هذا المعنى عند التعلم والتعامل مع الآخرين.`,rubric:[concept,action],correctIndex:0};
    if(!analyze){const index=count%3;[question.options[0],question.options[index]]=[question.options[index],question.options[0]];question.correctIndex=index;}
    if(english){
      question.text=`${text}\n${analyze?'Explain the relationship between the two ideas in one or two sentences, and give an application.':explore?'Which action applies what you learned from the text?':alternate?'Which idea is connected to the concept in the text?':'What is the main concept in this text?'}`;
      question.options=analyze?[]:[explore?`Connect ${concept.toLowerCase()} to ${action.toLowerCase()}`:alternate?action:concept,explore?'Ignore the meaning and rely on guessing':'Guessing without reading the text',explore?'Memorize words without trying to understand them':'Information not mentioned in the text'];
      if(!analyze){const index=count%3;[question.options[0],question.options[index]]=[question.options[index],question.options[0]];question.correctIndex=index;}
      question.explanation=`The answer connects “${concept}” to “${action}”. ${text}`;
      question.hint=`Look for the connection between “${concept}” and the related idea in the text.`;
      question.modelAnswer=`${concept} connects to ${action}; I apply this when learning and interacting with others.`;
      question.pattern=analyze?'Analysis and application':explore?'Apply the meaning':'Understand the text';
      question.source.label='Prepared practice text for testing gameplay; not a fatwa or an AI source citation.';
    }
    return question;
  }};
})();

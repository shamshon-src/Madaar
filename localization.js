(() => {
  const dictionary={
    'محتوى الحزمة المرفقة':'Supplied package content','الحزمة المرفقة (خادم محلي)':'Supplied package (local server)',
    'لا تحتوي الحزمة على موضوع متاح في هذا القسم حاليًا.':'The package currently has no available topics in this category.',
    'الحزمة المرفقة متصلة بخادم محلي؛ لا تُستخدم المحاكاة تلقائيًا عند فشله.':'The supplied package uses a local server; it does not silently fall back to mock mode on failure.',
    'الطهارة':'Purification','الصدق':'Truthfulness','الوفاء بالعقود':'Honoring contracts','أسماء الله وصفاته':'Allah’s names and attributes','الهجرة':'Migration','التواضع':'Humility',
"الخلايا الخاصة على الرقعة":"Special board cells",
"تُفعَّل المساعدات عند الوقوف عليها، وتُعرض التحديات فورًا مع خياراتها المحددة. تبقى الآثار المكتسبة بجانب اسم اللاعب حتى استخدامها. الخلايا كلها ملوّنة مؤقتًا للاختبار؛ تتغير أماكنها بعد إكمال دورة فعلية وبعد خروج جميع اللاعبين من البداية.":"Helpers activate on landing, and challenges appear immediately with their prescribed choices. Earned effects stay beside the player until used. All tiles are temporarily colored for testing. Locations change only after a real completed lap and after every player has left the start.",
"دعني أشرح لك اللعبة!":"Let me explain the game!",
"اختر اللغة والقسم والموضوع ونمط اللعب.":"Choose your language, category, topic and game mode.",
"فَلَك يجهّز ومضة المعرفة…":"Falak is preparing a knowledge flash…",
"محاكاة على جهاز واحد: السؤال نفسه لجميع المشاركين، وأول إجابة نهائية تحسم الجولة.":"Single-device simulation: the same question for all participants. The first final answer settles the round.",
"محاولة ثانية مجانية عند أول خطأ لاحق؛ تُستخدم مرة واحدة.":"One free second attempt on your first later mistake; used once.",
"سؤال «اعرف» لجميع الواقفين على الخلية خلال 15 ثانية؛ الفائز يحصل على نقطتين.":"A Know question for everyone on the tile in 15 seconds; the winner earns two points.",
"الخلايا المشتركة":"Shared cells",
"مصباح":"Lamp",
"يمنحك مصباحًا فور الوقوف عليه. يُستخدم مرة واحدة لعرض تلميح أثناء السؤال.":"Earn a lamp immediately on landing. Use it once for a question hint.",
"مضاعفة ×٢":"Double ×2",
"تضاعف نقاط إجابتك الصحيحة العادية التالية، ولا تضاعف الحركة. تختفي بعد استخدامها.":"Double the points of your next correct ordinary answer, without doubling movement. Consumed after use.",
"محطة الأمان":"Safety Station",
"تبقى معك حتى أول خطأ في سؤال عادي؛ تمنحك محاولة ثانية للسؤال نفسه، وتُستخدم مرة واحدة.":"Keep protection until your first wrong ordinary answer. Retry the same question once.",
"محطة المعرفة":"Knowledge Station",
"تعرض فور الوقوف عليها ومضة مرتبطة بموضوعك، دون نقاط أو حركة إضافية.":"Immediately displays a flash of knowledge about your topic, without extra points or movement.",
"خلايا اللعب الفردي":"Solo cells",
"سباق الثواني":"Race Against Time",
"تحدٍّ ببطاقة «اعرف» خلال 15 ثانية. الإجابة الصحيحة تمنح نقطتين دون حركة إضافية.":"A Know challenge with 15 seconds. A correct answer earns two points without extra movement.",
"التحدي الكبير":"Big Challenge",
"اختر الاستمرار بسؤال عادي، أو خوض بطاقة «حلّل» لكسب 3 نقاط عند الإجابة المكتملة، دون حركة إضافية.":"Continue with an ordinary question or take an Analyze challenge for three points on a full answer, without extra movement.",
"سلسلة الإتقان":"Mastery Streak",
"تبدأ من الأسئلة العادية التالية: إجابتان مكتملتان متتاليتان تمنحان 3 نقاط إضافية. تنتهي المكافأة عند تحقيقها أو عند إجابة غير مكتملة.":"Starting with the next ordinary questions, two consecutive full answers earn three bonus points. The effect ends on completion or an incomplete answer.",
"خلايا اللعب الجماعي":"Multiplayer cells",
"اختر أن تجيب أنت أو اللاعب المتأخر عن بطاقة «حلّل». يحصل المجيب على 3 نقاط عند الإجابة المكتملة دون حركة إضافية.":"You or the trailing player answers an Analyze card. A full answer earns that player three points, without extra movement.",
"تحدي المنافسين":"Rival Challenge",
"اختر منافسًا للإجابة عن بطاقة «اعرف» نفسها خلال 15 ثانية. أول إجابة صحيحة تكسب نقطة؛ أول إجابة خاطئة تنهي المواجهة.":"Choose a rival for the same Know question in 15 seconds. The first correct answer earns one point; the first wrong answer ends the contest.",
"خلية الفريق":"Team Cell",
"اختر زميلًا للإجابة معك. يحصل كل منكما على نقاط البطاقة كاملة عند النجاح، ويتحرك صاحب الدور فقط.":"Choose a teammate. Each earns the full card reward on success; only the turn owner moves.",
"حلبة المناظرة":"Debate Arena",
"عند اجتماع لاعبين أو ثلاثة أو أربعة على الخلية نفسها، يشارك الجميع في بطاقة «اعرف» خلال 15 ثانية. أول إجابة صحيحة تكسب نقطتين دون حركة إضافية؛ أول إجابة خاطئة تنهي المناظرة.":"When two, three or four players share a tile, all answer the same Know question in 15 seconds. The first correct answer earns two points without extra movement; the first wrong answer ends the debate.",
    'مَدَار':'Madaar','مدار':'Madaar','شعار مدار':'Madaar logo','التنقل':'Navigation','اللغة':'Language','المسلمون الجدد':'New Muslims','من مختلف الأعمار':'All ages','الصيام':'Fasting','الصلاة':'Prayer','الوضوء':'Ablution','الزكاة':'Zakat','الحج':'Hajj','التوحيد':'Monotheism','الأمانة':'Trustworthiness','الرفق':'Gentleness','بر الوالدين':'Kindness to parents','الهجرة النبوية':'The Prophet’s migration','غزوة بدر':'Battle of Badr','فتح مكة':'Conquest of Makkah','السيرة النبوية':'Prophetic biography','البيع والشراء':'Buying and selling',
    'تسجيل الدخول':'Log in','تسجيل الخروج':'Log out','البريد الإلكتروني':'Email','كلمة المرور':'Password','إظهار':'Show','إخفاء':'Hide','دخول':'Log in','أو':'or','رجوع':'Back','اللعب السريع':'Quick play','أهلًا بك في مَدَار':'Welcome to Madaar','خطوة بسيطة وتبدأ رحلتك.':'One simple step to start your journey.','ادخل بحسابك، أو ابدأ اللعب مباشرة.':'Use your account or start playing right away.','ابدأ رحلتك دون تسجيل الدخول.':'Start your journey without logging in.','دخول الحساب تجريبي حاليًا إلى حين ربط خدمة الحسابات.':'Account login is a preview until the account service is connected.','أدخل بريدك الإلكتروني':'Enter your email','أدخل كلمة المرور':'Enter your password','أنا فَلَك، رفيقك في الرحلة!':'I am Falak, your companion on this journey!','هل أنت مستعد لنتعلم ونلعب معًا؟':'Ready to learn and play together?','كل سؤال بداية لمعرفة جديدة.':'Every question is the start of something new.','فَلَك، رفيقك في مدار':'Falak, your Madaar companion','فلك يشجعك':'Falak cheering you on','فلك يفكر':'Falak thinking','أهلًا بك! أنا فلك، سأرافقك في رحلتك.':'Welcome! I am Falak, and I will join you on your journey.',
    'حجم الخط':'Text size','عادي':'Normal','كبير':'Large','أكبر':'Larger','☾ غامق':'☾ Dark','☀ فاتح':'☀ Light','تبديل النمط الفاتح والغامق':'Toggle light and dark theme',
    'الخطة البديلة':'Alternative plan','إعداد اللعبة':'Game setup','تجهيز التجربة':'Prepare a test','نمط اللعب':'Game mode','فردي':'Solo','جماعي محلي':'Local multiplayer','عدد اللاعبين':'Number of players','هدف النقاط':'Target score','القسم':'Category','فقه العبادات':'Worship','المعاملات':'Transactions','العقيدة':'Belief','السيرة والتاريخ':'Biography and history','علوم القرآن':'Quran studies','الآداب والأخلاق':'Manners and ethics',
    'سيناريو اللعبة':'Game scenario','لعبة من البداية':'New game','الحصول على مصباح':'Earn a lamp','استخدام تلميح':'Use a hint','مضاعفة النقاط دون مضاعفة الحركة':'Double points without doubling movement','الأمان ومحاولة ثانية':'Safety and a second attempt','دورة كاملة والفوز عند 20':'Complete a lap and win at 20','التعاون — مكافأة كاملة لكل مشارك':'Teamwork: full reward for each participant','فوز مشترك بالتعاون':'Shared team victory','سلسلة الإتقان':'Mastery streak','سباق الثواني':'Speed challenge','التحدي الكبير':'Grand challenge','توجيه التحدي للأقل نقاطًا':'Challenge the lowest scoring player','المبارزة (+1)':'Duel (+1)','تصادم لاعبين — حلبة المناظرة (+2)':'Player collision: debate arena (+2)','محطة المعرفة':'Knowledge station','استجابة خدمة AI':'AI service response','نجاح عادي':'Normal success','انتظار تحميل بطيء':'Slow loading','فشل الخدمة':'Service failure','انتهاء مهلة الخدمة':'Service timeout','استجابة غير صالحة':'Invalid response','موضوع غير متاح':'Unavailable topic','حاجة إلى المختص':'Expert referral','حلل — صفر':'Analyze: zero','حلل — نقطة واحدة':'Analyze: one point','حلل — نقطتان':'Analyze: two points','حلل — ثلاث نقاط':'Analyze: three points','لعبة جديدة تبدأ دون نقاط أو مصابيح.':'A new game with no points or lamps.','ابدئي التجربة':'Start test','استئناف التجربة الحالية':'Resume current test','حالة الخدمة':'Service status','الخطة البديلة تعمل دون مفاتيح أو اتصال خارجي.':'The alternative plan works without keys or an external connection.','المزود':'Provider','الخطة البديلة (محاكاة)':'Alternative plan (simulation)','خدمة AI الحقيقية':'Live AI service','عنوان الوسيط الخلفي':'Backend proxy URL','حفظ اختيار الخدمة':'Save provider','ما الذي تختبره الخطة؟':'What can you test?','كيف أجرب الإجابات؟':'How do I test answers?',
    'الأسئلة الجاهزة تعمل تلقائيًا داخل بطاقات الموقع. يمكنك بدء لعبة عادية من إعداد اللعبة، أو استخدام هذه اللوحة لتجهيز حالة خاصة ثم تجربتها على الرقعة نفسها.':'Prepared questions appear automatically in the game cards. Start a regular game from setup, or use this panel to prepare a special case on the same board.',
    'الأسئلة والدرجات والتلميحات معدة للتجربة. تقييم «حلل» محاكاة بالمطابقة التجريبية؛ الإسناد غير متاح. يمكنك كتابة الإجابة النموذجية أو جزء منها، أو اختيار درجة من القائمة لاختبار عرض النتائج.':'Questions, grades and hints are prepared for testing. Analyze uses simple text matching; source attribution is unavailable. Enter the model answer or part of it, or choose a grade to test results.',
    'المنافسة هنا على جهاز واحد. اللعب الحقيقي بين أجهزة مختلفة والحسابات المشتركة يحتاجان خدماتهما المستقلة؛ تبديل AI وحده لا يفعّلهما.':'Competition is simulated on one device. Multiplayer across devices and shared accounts require separate services; changing the AI provider does not enable them.',
    'في اعرف واستكشف، اختاري البديل الذي يطابق النص لإجابة صحيحة، أو أحد البديلين الآخرين لتجربة الخطأ. في حلل، اربطي الفكرتين المذكورتين في النص للحصول على الإجابة الكاملة، أو اذكري فكرة واحدة لتجربة النقاط الجزئية، أو اكتبي «لا أعلم» لتجربة عدم الإجابة. يعرض الشرح العلاقة المطلوبة بعد الإجابة.':'In Know and Explore, choose the option matching the text for a correct answer, or another option to test an incorrect answer. In Analyze, connect both ideas for full credit, mention one for partial credit, or enter “I do not know” to test no answer. The explanation appears after submission.',
    'اسأل مختص':'Ask an expert','أعتذر، لا أستطيع الإجابة عن سؤالك بثقة.':'Sorry, I cannot answer your question with confidence.','أنا فَلَك، أساعدك في التعلّم من المحتوى المتاح لدي. إذا كان سؤالك خارج هذا المحتوى أو يحتاج إلى فتوى، فالرجوع إلى مختص هو الخطوة المناسبة.':'I am Falak. I help you learn from the available content. If your question falls outside it or requires a fatwa, please consult a qualified expert.','المملكة العربية السعودية':'Saudi Arabia','الرئاسة العامة للبحوث العلمية والإفتاء':'General Presidency of Scholarly Research and Ifta','الرئاسة العامة للبحوث العلمية والإفتاء — السعودية':'General Presidency of Scholarly Research and Ifta — Saudi Arabia','دار الإفتاء السعودية مرجع جيد لطرح سؤالك الشرعي.':'Saudi Arabia’s Ifta authority is a useful reference for your religious question.','زيارة الموقع الرسمي للإفتاء':'Visit the official Ifta website','يفتح الموقع الرسمي في نافذة جديدة، ويمكنك طرح سؤالك هناك.':'The official website opens in a new tab, where you can ask your question.','اكتب موضوعًا آخر':'Enter another topic',
    'أسئلة جاهزة للتجربة':'Prepared practice questions','خدمة AI':'AI service','تحميل السؤال…':'Loading question…','فَلَك يجهّز السؤال…':'Falak is preparing your question…','تلميح · مصباح واحد':'Hint · one lamp','تم عرض التلميح':'Hint shown','لا توجد مصابيح متاحة.':'No lamps are available.','تأكيد الإجابة':'Submit answer','العودة للرقعة':'Back to board','جاري التقييم…':'Evaluating…','اختر إجابة للمتابعة.':'Choose an answer to continue.','اكتب إجابتك في جملة أو جملتين':'Write your answer in one or two sentences','إجابتك':'Your answer','طالع الشرح ثم واصل تقدمك':'Read the explanation, then continue','شرح الإجابة':'Answer explanation','انتهى الوقت دون إجابة مكتملة.':'Time ran out before an answer was submitted.','انتهت هذه الجلسة؛ لن تُحتسب نتيجة متأخرة.':'This session has ended; late answers will not be scored.','محاكاة على جهاز واحد: السؤال نفسه للطرفين، وأول إجابة نهائية تحسم الجولة.':'One-device simulation: both players see the same question, and the first final answer decides the round.',
    'نص تدريبي مُعد مسبقًا لاختبار اللعب؛ ليس فتوى أو إسنادًا من خدمة AI.':'Prepared practice text for testing gameplay; not a fatwa or an AI source citation.','تم رصد مدخل غير صالح للعبة.':'An invalid game input was detected.','لم يتم تقديم تحليل للمسألة؛ طالع الشرح والإسناد المرفق لترسيخ المعلومة واصل تقدمك':'No analysis was provided. Read the explanation and source, then continue.',
    'ستظهر هنا الخلايا التي يكشفها اللاعبون.':'Tiles revealed by players will appear here.','متوسط':'Intermediate','البداية':'Start','؟':'?','تجربة الغرف حاليًا على هذا الجهاز؛ مشاركة اللعب بين أجهزة مختلفة تنتظر ربط خدمة الغرف.':'Rooms are currently simulated on this device. Playing across devices awaits the room service.',
    'لكي تكون كل الأسئلة والإجابات موثوقة، فلك ما يولّد أسئلة إلا من المصادر المعتمدة. جرّب موضوعًا قريبًا، أو اطرح سؤالك لدى الجهة المختصة.':'Falak uses approved sources for reliable questions and answers. Try a related topic, or consult the relevant authority.',
    'أركان الإيمان':'Articles of faith','الإيمان بالملائكة':'Belief in angels','الإيمان باليوم الآخر':'Belief in the Last Day','أسماء الله الحسنى':'The beautiful names of Allah','الأمانة في المعاملات':'Trustworthiness in transactions','حفظ الحقوق':'Protecting rights','الصدق في التجارة':'Honesty in trade','تفسير سورة الفاتحة':'Interpretation of Al-Fatihah','أسباب النزول':'Reasons for revelation','جمع القرآن':'Compilation of the Quran','قصص القرآن':'Quranic stories','آداب تلاوة القرآن':'Quran recitation manners','آداب الحوار':'Dialogue manners','صلة الرحم':'Family ties','الربا':'Riba','صلح الحديبية':'Treaty of Hudaybiyyah',
    'الطهارة':'Purification','ترتيب الخطوات':'Ordering the steps','فهم المعاني':'Understanding meanings','الصبر':'Patience','التكافل':'Mutual support','ترتيب المناسك':'Ordering the rituals','الصدق':'Honesty','وضوح المعلومات':'Clear information','التعلم':'Learning','الرجوع إلى المختص':'Consulting an expert','فهم المعنى':'Understanding the meaning','شرح المعنى':'Explaining the meaning','التعلم من النص':'Learning from the text','المسؤولية':'Responsibility','ترتيب الأحداث':'Ordering events','فهم السياق':'Understanding the context','ربط النتائج بالأحداث':'Connecting results to events','ربط الحدث بسياقه':'Connecting an event to its context','التفسير':'Interpretation','ترتيب المعلومات':'Organizing information','استخلاص الدروس':'Learning lessons','تلاوة القرآن':'Quran recitation','الإنصات':'Listening','حسن التعامل':'Kind treatment','التواصل':'Keeping in touch','النصح بلطف':'Gentle advice','احترام الآخرين':'Respecting others',
    'تعذّر الوصول إلى خدمة المحاكاة. لم يتغير الرصيد أو الدور.':'The simulation service could not be reached. Points and turns are unchanged.','انتهت مهلة الخدمة. يمكنك إعادة المحاولة دون خسارة الدور.':'The service timed out. Retry without losing your turn.','تعذّر تنفيذ طلب خدمة AI. لم تتغير النقاط؛ أعد المحاولة.':'The AI request failed. Points are unchanged; please retry.','انتهت مهلة خدمة AI؛ أعد المحاولة.':'The AI service timed out; please retry.','استجابة الخدمة غير صالحة.':'Invalid service response.','السؤال المستلم غير صالح؛ لم يبدأ الدور.':'The question is invalid; the turn has not started.','نتيجة التقييم خارج حدود البطاقة؛ لم تُحتسب نقاط.':'The grade is outside this card’s limits; no points were awarded.','استجابة المساعدة غير صالحة.':'Invalid help response.','رابط الإسناد غير صالح.':'Invalid source URL.','وظيفة الخدمة غير مدعومة.':'Unsupported service method.','وضع الخدمة غير معروف؛ اختر mock أو remote.':'Unknown service mode; choose mock or remote.','عنوان خدمة AI غير مضبوط. راجع service-config.js.':'The AI URL is missing. Check service-config.js.',
    'اكتب موضوعًا أو اختر موضوعًا عشوائيًا.':'Enter a topic or choose a random topic.','أدخل رمزًا مكوّنًا من 4 أحرف أو أرقام.':'Enter a code with four letters or numbers.','انسحب لاعب، وتستمر الجولة لبقية المتنافسين.':'A player withdrew; the remaining players continue.',
    'التخمين دون قراءة النص':'Guessing without reading the text','معلومة لم يتناولها النص':'Information not mentioned in the text','أتجاهل المعنى وأعتمد على التخمين':'Ignore the meaning and rely on guessing','أحفظ الكلمات دون محاولة فهمها':'Memorize words without trying to understand them'
  };
  Object.assign(dictionary,{
    'تعلّم أكثر، واسأل أهل الاختصاص':'Learn more and ask qualified specialists',
    'لا تتردد في التعلّم أكثر عن دينك وطرح ما يشغلك من أسئلة. وللحصول على إجابة موثوقة، اسأل أهل العلم والمتخصصين، خاصةً في المسائل التي تحتاج إلى فتوى.':'Keep learning about your faith and asking your questions. Seek reliable answers from qualified scholars and specialists, especially for matters requiring a fatwa.',
    'اسأل أهل العلم فيما يشغلك.':'Ask qualified scholars about your questions.',
    'أنا فَلَك، أرافقك في تعلّم المفاهيم الأساسية. لا تتردد في طلب المعرفة، وللأسئلة التي تحتاج إلى فتوى أو توجيه شرعي متخصص، ارجع إلى أهل العلم المؤهلين.':'I am Falak, your companion in learning the basics. Keep seeking knowledge, and consult qualified scholars for questions requiring a fatwa or specialized religious guidance.',
    'هل أنت مستعد لنتعلم ونلعب معًا؟':'Are you ready to learn and play together?',
    'خذ وقتك، وفكّر قبل أن تختار.':'Take your time and think before choosing.',
    'هل أصبح الشرح أوضح؟':'Is the explanation clearer now?',
    'خصص رحلتك قبل أن تبدأ.':'Customize your journey before you begin.',
    'أصغر':'Smaller','صغير':'Small',
    'بسّط لي؛ لم أفهم السؤال لأتمكن من الإجابة عليه':'Simplify it for me; I did not understand the question well enough to answer it.',
    'بسّط لي أكثر':'Simplify it further','اسأل مختصًا':'Ask a specialist',
    'اسحب بطاقة لتتحرك على الرقعة.':'Draw a card to move around the board.',
    'محطة الأمان':'Safety station','توقفت اللعبة الجماعية':'Multiplayer game paused','بقي لاعب واحد. يمكنك بدء لعبة فردية أو العودة للرئيسية.':'One player remains. Start a solo game or return home.','الدخول إلى لعبة فردية':'Start a solo game','توقفت اللعبة الجماعية بعد الانسحاب. بقي لاعب واحد ويمكنه بدء لعبة فردية.':'Multiplayer paused after a withdrawal. The remaining player can start a solo game.','متابعة اللعبة':'Resume game',
    'اسحب بطاقة وأجب عن سؤال من الموضوع المختار.':'Draw a card and answer a question on your selected topic.',
    'حصلت على مصباح مجاني للتلميحات في هذه الجولة.':'You earned a free lamp for hints in this round.',
    'تتضاعف نقاط إجابتك الصحيحة التالية.':'Your next correct answer earns double points.',
    'محاولة ثانية مجانية عند الخطأ في السؤال التالي.':'A free second attempt if your next answer is wrong.',
    'ومضة معرفية مرتبطة بموضوع رحلتك.':'A short insight related to your topic.',
    'أجب عن سؤال «اعرف» خلال 15 ثانية لتكسب نقطتين إضافيتين.':'Answer a Know question within 15 seconds to earn two bonus points.',
    'اختر سؤالًا عاديًا أو تحدَّ نفسك ببطاقة «حلل» مقابل 3 نقاط.':'Choose a regular question or an Analyze challenge worth three points.',
    'أجب عن سؤالين متتاليين إجابة صحيحة لتحصل على 3 نقاط إضافية.':'Answer two consecutive questions correctly to earn three bonus points.',
    'اختر من يخوض بطاقة «حلل»: أنت أو اللاعب المتأخر.':'Choose who answers the Analyze card: you or the trailing player.',
    'اختر منافسًا للإجابة عن السؤال السريع نفسه؛ الأسرع الصحيح يكسب نقطة.':'Choose a rival for the same quick question; the first correct answer earns one point.',
    'اختر زميلًا؛ يحصل كل مشارك على نقاط البطاقة كاملة، ويتحرك صاحب الدور فقط.':'Choose a teammate. Both receive full card points; only the current player moves.',
    'التعلّم يزداد رسوخًا حين تربط المعرفة بتطبيقها.':'Learning lasts longer when you connect knowledge to its application.',
    'السؤال الجيد بداية طريق الفهم.':'A good question is the first step toward understanding.',
    'المحطة تمنحك محاولة ثانية مجانية. اختر بطاقة وحاول مجددًا.':'This station gives you a free second attempt. Draw a card and try again.',
    'اكتملت سلسلة الإتقان: +3 نقاط.':'Mastery streak completed: +3 points.',
    'أُغلقت الخلايا وأُعيد خلطها.':'The tiles were hidden and shuffled again.',
    'حلبة المناظرة':'Debate arena','سؤال اعرف للطرفين خلال 15 ثانية؛ الفائز يحصل على نقطتين.':'Both players answer a Know question within 15 seconds; the winner earns two points.',
    'وقف على خلية عادية.':'Landed on a regular tile.','اختر أحد الإجراءين في اللوحة الجانبية لإكمال الدور.':'Choose an action in the side panel to complete your turn.',
    'هذه إجابة تجريبية لفَلَك. جرّب الرجوع إلى شرح السؤال أو الاستفسار من الجهة الرسمية؛ لا تصدر المحاكاة حكمًا شخصيًا.':'This is a practice response from Falak. Review the question explanation or consult the official authority; the simulation does not give personal rulings.',
    'إعادة المحاولة':'Retry','رحلتك':'Your journey','تجربة':'Practice','سؤال':'Question','إجابة مكتملة!':'Complete answer!','الإسناد غير متاح.':'Source attribution is unavailable.',
    'يمكنك الرجوع إلى جهة الإفتاء السعودية الرسمية. فتح الموقع لا يرسل سؤالك أو بياناتك تلقائيًا.':'You can consult the official Saudi Ifta authority. Opening the website does not automatically send your question or data.',
    'استفسار لفلك':'Question for Falak','استفسار لفَلَك حول المادة التعليمية':'Ask Falak about the learning material','اسأل فَلَك':'Ask Falak',
    'أجيبي اعرف صحيحًا للهبوط على خلية المصباح.':'Answer Know correctly to land on the lamp tile.',
    'مصباح واحد جاهز؛ افتحي بطاقة ثم جرّبي زر التلميح.':'One lamp is ready. Open a card and try the hint button.',
    'رصيد 6 ومضاعفة فعالة. اعرف الصحيح يعطي نقطتين وخطوة واحدة.':'Six points with a multiplier active. A correct Know answer earns two points and one step.',
    'رصيد 6 مع الأمان والمضاعفة. اخطئي أولًا ثم صححي: يصبح الرصيد 8 ويتحرك اللاعب خطوة واحدة.':'Six points with safety and a multiplier. Answer incorrectly, then correctly: the score becomes eight and the player moves one step.',
    'موضع 22 ورصيد 16. استكشف الصحيح يكمل الدورة: نقطتان +3 للدورة =21، ثم الفوز.':'Position 22, score 16. A correct Explore answer completes the lap: two points plus three lap points equals 21 and victory.',
    'رصيد المشاركين 14 و13. اعرف الصحيح يعطي نقطة كاملة لكل منهما.':'The players have 14 and 13 points. A correct Know answer gives each one a full point.',
    'رصيد المشاركين 18 و18، والهدف 20. استكشف الصحيح يحقق فوزًا مشتركًا.':'Both players have 18 points; the target is 20. A correct Explore answer gives a shared victory.',
    'أثر الإتقان فعّال. سؤالان عاديان مكتملان يمنحان +3 إضافية.':'Mastery is active. Two fully correct regular answers earn three bonus points.',
    'اعرف خلال 15 ثانية، ومكافأة الحدث نقطتان دون حركة إضافية.':'Know within 15 seconds; earn two event points without extra movement.',
    'تحدي حلل: الإجابة المكتملة تمنح ثلاث نقاط دون حركة إضافية.':'Analyze challenge: a complete answer earns three points without extra movement.',
    'اختاري صاحب الدور أو الأقل نقاطًا للإجابة؛ المكافأة للمجيب.':'Choose the current or lowest scoring player to answer; that player receives the reward.',
    'السؤال نفسه للطرفين. أول إجابة صحيحة تمنح نقطة؛ أول إجابة خاطئة تنهي الجولة بلا مكافأة.':'Both players get the same question. The first correct answer earns one point; the first incorrect answer ends the challenge without a reward.',
    'لاعبان عند موضع الوصول نفسه؛ تظهر حلبة المناظرة بمكافأة نقطتين.':'Two players share the landing position; a debate arena appears with a two-point reward.',
    'محطة معرفة تعرض ومضة تجريبية دون نقاط أو حركة إضافية.':'A knowledge station shows a practice insight without points or extra movement.',
    'خدمة AI الحقيقية محددة؛ لن نرجع إلى المحاكاة عند فشلها.':'The live AI service is selected; failures will not fall back to simulation.',
    'في التشغيل الحقيقي عدّلي service-config.js لتغيير المزود.':'In production, edit service-config.js to change the provider.',
    'حُفظ اختيار الخدمة. يطبق على الأسئلة التالية.':'Provider saved. It applies to the next questions.',
    'نتائج السيناريوهات المصطنعة متاحة في المحاكاة فقط.':'Forced scenario outcomes are available only in simulation.',
    'حالة اختبار:':'Test case:',
    'كشفت خلية · تعاون':'Revealed tile · Teamwork','كشفت خلية · تحدٍ':'Revealed tile · Challenge','كشفت خلية · أمان':'Revealed tile · Safety','كشفت خلية · إنجاز':'Revealed tile · Achievement','كشفت خلية · مساعدة':'Revealed tile · Help','كشفت خلية · بطاقة':'Revealed tile · Card',
    '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ﴾':'Meaning: Believers, fasting is prescribed for you as it was for those before you, so that you may become mindful of Allah.'
  });
  let language=localStorage.getItem('madaarLanguage')==='en'?'en':'ar';
  const hasArabic=value=>/[\u0600-\u06ff]/.test(value);
  function translate(value){
    const maps=window.MadaarTranslationMaps;
    if(dictionary[value])return dictionary[value];if(maps?.arabicToEnglish.has(value))return maps.arabicToEnglish.get(value);
    let turn=value.match(/^الدور (التالي|الحالي): (.+)$/);if(turn)return `${turn[1]==='التالي'?'Next turn':'Current turn'}: ${translate(turn[2])}`;
    let m=value.match(/^روبوت فَلَك في حالة (.+)$/);if(m)return `Falak robot: ${m[1]}`;
    m=value.match(/^أول من يبلغ (\d+) (?:نقطة|points) يفوز\.$/);if(m)return `The first player to reach ${m[1]} points wins.`;
    m=value.match(/^ألوان اللاعب (\d+)$/);if(m)return `Player ${m[1]} colors`;
    m=value.match(/^أعتذر، موضوع «(.+)» غير متاح لدي حاليًا$/);if(m)return `Sorry, “${translate(m[1])}” is not currently available.`;
    m=value.match(/^حتى (\d+) نقاط$/);if(m)return `Up to ${m[1]} points`;
    m=value.match(/^(\d+) نقاط · (\d+) خطوات$/);if(m)return `${m[1]} points · ${m[2]} steps`;
    m=value.match(/^(\d+) دورة · (\d+) 💡$/);if(m)return `${m[1]} laps · ${m[2]} 💡`;
    m=value.match(/^(.+) · تجربة$/);if(m)return `${translate(m[1])} · Practice`;
    m=value.match(/^الفائزون: (.+)$/);if(m)return `Winners: ${translate(m[1])}`;
    m=value.match(/^مستواك في (.+)$/);if(m)return `Your level in ${translate(m[1])}`;
    m=value.match(/^(\d+) نقطة$/);if(m)return `${m[1]} points`;
    let result=value;
    result=result.replace(/إجابة صحيحة: \+(\d+) نقطة\./g,'Correct answer: +$1 points.')
      .replace(/أجاب الفريق صحيحًا: (.+?) و(.+?) حصلا على (\d+) نقطة لكل منهما\./g,(_,a,b,n)=>`Team answer correct: ${translate(a)} and ${translate(b)} earned ${n} points each.`)
      .replace(/(.+?) أجاب صحيحًا وحصل على (\d+) نقاط\./g,(_,name,n)=>`${translate(name)} answered correctly and earned ${n} points.`)
      .replace(/مكافأة إكمال الدورة: \+(\d+) نقاط\./g,'Lap bonus: +$1 points.')
      .replace(/كشف «(.+?)»\./g,(_,name)=>`Revealed “${translate(name)}”.`)
      .replace(/هبطت على (.+?)\./g,(_,name)=>`Landed on ${translate(name)}.`)
      .replace(/اللاعب\s*(\d+)/g,'Player $1');
    const pairs=[...Object.entries(dictionary),...(maps?[...maps.arabicToEnglish]:[])].filter(([ar])=>hasArabic(ar)).sort((a,b)=>b[0].length-a[0].length);
    for(const [ar,en] of pairs){const escaped=ar.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');result=result.replace(new RegExp(`(?<![\\u0621-\\u064a])${escaped}(?![\\u0621-\\u064a])`,'g'),()=>en);}
    return result.replace(/لاعب\s*(\d+)/g,'Player $1').replace(/الPlayer/g,'Player').replace(/،/g,',').replace(/؟/g,'?').replace(/؛/g,';');
  }
  function render(container){
    if(language!=='en'||!container)return;
    const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);let node;
    while(node=walker.nextNode()){
      if(node.parentElement.closest('script,style,.language-toggle,[data-user-content]'))continue;
      const value=node.nodeValue.trim();if(hasArabic(value)){const en=translate(value);if(en!==value)node.nodeValue=node.nodeValue.replace(value,en);}
    }
    const elements=container.nodeType===1?[container,...container.querySelectorAll('*')]:[];
    for(const element of elements)for(const attribute of ['placeholder','aria-label','alt','title']){const value=element.getAttribute(attribute);if(value&&hasArabic(value)){const translated=translate(value);if(translated!==value)element.setAttribute(attribute,translated);}}
  }
  window.MadaarI18n={translate,render,dictionary,message:value=>localStorage.getItem('madaarLanguage')==='en'?translate(value):value};
  document.addEventListener('DOMContentLoaded',()=>{
    const bank=window.MadaarQuestionBank;
    if(bank)for(const topic of Object.keys(bank.lessons))for(const type of ['know','explore','analyze'])for(const count of [1,2,3]){
      const ar=bank.create(topic,type,count,'ar'),en=bank.create(topic,type,count,'en');
      for(const field of ['text','explanation','hint','modelAnswer','pattern'])dictionary[ar[field]]=en[field];
      ar.options.forEach((option,index)=>dictionary[option]=en.options[index]);
      dictionary[bank.lessons[topic][2]]=en.text.split('\n')[0];
    }
    language=localStorage.getItem('madaarLanguage')==='en'?'en':'ar';document.documentElement.lang=language;document.documentElement.dir=language==='en'?'ltr':'rtl';document.body.dir=document.documentElement.dir;
    document.querySelectorAll('[dir]').forEach(element=>element.dir=document.documentElement.dir);
    if(language==='en')document.title=translate(document.title);
    render(document.body);
    new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')render(record.target.parentElement);else if(record.type==='attributes')render(record.target);else for(const node of record.addedNodes)if(node.nodeType===1)render(node);else if(node.nodeType===3)render(node.parentElement);}}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','alt','title']});
  });
})();

Object.assign(window.MadaarI18n.dictionary,{
  "إجابة خاطئة": "Incorrect answer",
  "إجابة صحيحة!": "Correct answer!",
  "إجابة جزئية": "Partial answer",
  "اضغط «التالي» لمتابعة دورك.": "Press Next to continue your turn.",
  "اشرح لي الإجابة": "Explain the answer",
  "فَلَك يجهّز الشرح…": "Falak is preparing the explanation…",
  "محاولة ثانية": "Second attempt",
  "هل أنت مستعد؟": "Are you ready?",
  "تعذّر تحميل البطاقة.": "Unable to load the card.",
  "تعذّر عرض البطاقة. أعد المحاولة.": "Unable to display the card. Please retry.",
  "ضوء يساعدك": "A light to guide you",
  "حصلت على مصباح. استخدمه لطلب تلميح أثناء الإجابة عن سؤال.": "You earned a lamp. Use it for a hint while answering a question.",
  "تلميح واحد": "One hint",
  "يُستخدم مرة واحدة": "Used once",
  "فرصة لمضاعفة النقاط": "A chance to double points",
  "تتضاعف نقاط السؤال العادي التالي؛ تبقى خطوات الحركة كما هي.": "Double the points of the next ordinary question; movement stays the same.",
  "النقاط ×٢": "Points ×2",
  "الحركة كما هي": "Movement unchanged",
  "درع يحمي محاولتك": "A shield for your attempt",
  "تحتفظ بالحماية حتى أول خطأ في سؤال عادي، ثم تعيد السؤال مرة واحدة.": "Keep protection until your first mistake on an ordinary question, then retry it once.",
  "حتى أول خطأ": "Until the first mistake",
  "محاولة إضافية": "Extra attempt",
  "استخدمت محطة الأمان لحمايتك. يمكنك الآن إعادة السؤال نفسه.": "The Safety Station protected you. You can now retry the same question.",
  "وقفة لاكتشاف معنى جديد": "A moment to discover a new idea",
  "ومضة معرفية من موضوع رحلتك، دون نقاط أو حركة إضافية.": "A flash of knowledge on your topic, with no extra points or movement.",
  "تعلّم واكتشف": "Learn and discover",
  "ومضة معرفية": "Knowledge flash",
  "تحدَّ الزمن": "Race against time",
  "أجب عن بطاقة «اعرف» خلال 15 ثانية. النجاح يمنح نقطتين دون حركة إضافية.": "Answer a Know card in 15 seconds. Success earns two points without extra movement.",
  "اعرف · 15 ثانية": "Know · 15 seconds",
  "مكافأة نقطتين": "Two-point reward",
  "ارتقِ بتحليلك": "Take your analysis further",
  "اختر بطاقة «حلّل»: الإجابة المكتملة تمنح 3 نقاط دون حركة إضافية، أو تابع بسؤال عادي.": "Choose an Analyze card: a full answer earns three points without extra movement, or continue with an ordinary question.",
  "مكافأة 3 نقاط": "Three-point reward",
  "اختر من يخوض التحدي": "Choose who takes the challenge",
  "اختر نفسك أو اللاعب الأقل نقاطًا لبطاقة «حلّل». المجيب يربح 3 نقاط عند الإجابة المكتملة، دون حركة إضافية.": "You or the lowest-scoring player takes an Analyze card. A full answer earns that player three points without extra movement.",
  "المكافأة للمجيب": "Reward for the answering player",
  "من يسبق إلى الإجابة؟": "Who answers first?",
  "اختر منافسًا لبطاقة «اعرف» خلال 15 ثانية. أول إجابة صحيحة تكسب نقطة؛ أول إجابة خاطئة تنهي المواجهة.": "Choose a rival for a Know card in 15 seconds. The first correct answer earns a point; the first wrong answer ends the contest.",
  "مكافأة نقطة": "One-point reward",
  "الخلية تجمع المنافسين": "The tile brings rivals together",
  "يشارك جميع اللاعبين الواقفين على الخلية في بطاقة «اعرف» خلال 15 ثانية. أول إجابة صحيحة تكسب نقطتين؛ أول إجابة خاطئة تنهي المناظرة.": "Everyone on the tile joins a Know card in 15 seconds. The first correct answer earns two points; the first wrong answer ends the debate.",
  "جميع الواقفين على الخلية": "Everyone on this tile",
  "معًا نحو الإجابة": "Find the answer together",
  "اختر زميلًا للإجابة معك. يحصل كل منكما على نقاط البطاقة كاملة، ويتحرك صاحب الدور فقط.": "Choose a teammate. Each earns the full card reward; only the turn owner moves.",
  "تعاون": "Teamwork",
  "مكافأة كاملة لكل مشارك": "Full reward for each participant",
  "واصل سلسلة نجاحك": "Keep your success streak",
  "إجابتان مكتملتان متتاليتان في الأسئلة العادية تمنحان 3 نقاط إضافية. تنتهي السلسلة عند الإجابة غير المكتملة.": "Two consecutive full answers on ordinary questions earn three bonus points. An incomplete answer ends the streak.",
  "نجاحان متتاليان": "Two consecutive successes",
  "مصابيح متاحة": "Available lamps",
  "متابعة بسؤال عادي": "Continue with an ordinary question",
  "ابدأ التحدي": "Start challenge",
  "ابدأ التحدي مع": "Start challenge with",
  "ابدأ التعاون مع": "Start teamwork with"
});

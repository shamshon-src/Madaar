(() => {
  const screen = document.body.dataset.screen || "";
  const falakStates = ["idle", "thinking", "explaining", "success", "error"];
  let falakResetTimer = 0;
  let activeFalakState = "idle";
  function applyFalakState(root, state) {
    root.querySelectorAll(".falak-bot").forEach((robot) => {
      falakStates.forEach((name) => {
        robot.classList.remove(`state-${name}`, `bot-${name}`);
      });
      robot.classList.add(`state-${state}`, `bot-${state}`);
      robot.setAttribute("aria-label", `روبوت فَلَك في حالة ${state}`);
    });
  }
  function setFalakState(state, resetAfter = 0) {
    if (!falakStates.includes(state)) return;
    window.clearTimeout(falakResetTimer);
    activeFalakState = state;
    applyFalakState(document, state);
    document.querySelectorAll("iframe").forEach((frame) => {
      if (frame.contentDocument) applyFalakState(frame.contentDocument, state);
    });
    if (resetAfter > 0 && state !== "idle") {
      falakResetTimer = window.setTimeout(() => setFalakState("idle"), resetAfter);
    }
  }
  function mountFalakImages(root = document) {
    if (!(root instanceof Element || root instanceof Document)) return;
    const images = [];
    if (root instanceof HTMLImageElement && /(?:^|\/)falak(?:[_-][^/]*)?\.(?:png|svg)$/i.test(root.getAttribute("src") || "")) images.push(root);
    images.push(...root.querySelectorAll('img[src*="falak" i]'));
    images.forEach((image) => {
      if (!/(?:^|\/)falak(?:[_-][^/]*)?\.(?:png|svg)$/i.test(image.getAttribute("src") || "")) return;
      const robot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      robot.setAttribute("class", `falak-bot state-${activeFalakState} bot-${activeFalakState}`);
      robot.setAttribute("viewBox", "0 0 1007 940");
      robot.setAttribute("role", "img");
      robot.setAttribute("aria-label", "روبوت فَلَك");
      robot.setAttribute("focusable", "false");
      if (image.hasAttribute("style")) robot.setAttribute("style", image.getAttribute("style"));
      if (image.hasAttribute("class")) robot.classList.add(...image.classList);
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "images/falak-bot.svg#falak");
      use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "images/falak-bot.svg#falak");
      robot.append(use);
      image.replaceWith(robot);
    });
  }
  window.MadaarFalak = { setState: setFalakState };
  document.addEventListener("load", (event) => {
    const frame = event.target;
    if (frame instanceof HTMLIFrameElement && frame.contentDocument) {
      applyFalakState(frame.contentDocument, activeFalakState);
    }
  }, true);
  const languageKey = "madaarLanguage";
  const arabicToEnglish = new Map(Object.entries({
    "موضوع عشوائي من القسم المحدد": "Random topic from the selected category",
    "تنتهي اللعبة عند الوصول إلى الهدف أو تجاوزه.": "The game ends when the target is reached or exceeded.",
    "20 نقطة": "20 points",
    "50 نقطة": "50 points",
    "مَدَار": "Madaar", "مدار": "Madaar", "كيف ألعب": "How to Play", "English": "العربية", "العربية": "Arabic",
    "انضم إلى غرفة": "Join a Room", "الخروج من اللعبة": "Exit Game", "العودة للرقعة": "Back to Board", "الرئيسية": "Home",
    "انطلق في": "Start your", "مدار المعرفة": "Knowledge Journey", "اختر موضوعًا، واسحب البطاقات، واكتشف أسرار الرقعة مع فلك. كل إجابة تقرّبك من الفهم، وكل دورة تقرّبك من الفوز.": "Choose a topic, draw a card, and explore the board with Falak. Every answer brings you closer to understanding and victory.",
    "ابدأ اللعب": "Start Playing", "كيف ألعب؟": "How to Play", "رحلة فردية": "Solo Journey", "محطات تتدرج معك خطوة بخطوة": "Progress through guided stages", "اللعب مع من حولك": "Play Together", "رقعة واحدة للأسرة أو الفصل": "One board for family or class", "غرفة مع أصدقائك": "Play with Friends", "تنافسوا عن بُعد برمز الغرفة": "Compete remotely with a room code",
    "إعداد اللعبة": "Game Setup", "خصّص رحلتك قبل أن تبدأ.": "Customize your journey before you begin.", "الفئة": "Age Group", "الناشئة": "Youth", "أقل من 16 عامًا": "Under 16", "الشباب والبالغون": "Adults", "16 عامًا فأكثر": "16 and over", "أتعلم الإسلام حديثًا": "I am new to learning about Islam", "تقدّم لك المفاهيم الأساسية بلغة ميسّرة وبالتدريج بعيدًا عن الخلافات.": "Learn key concepts gradually in clear language, away from disputed matters.",
    "ما الموضوع الذي تريد تعلّمه؟": "What would you like to learn about?", "أو اختر من القائمة": "Or choose from the list", "اختر موضوعًا": "Choose a topic", "اكتب موضوعًا، مثل: الصيام، بر الوالدين، غزوة بدر": "Type a topic, e.g. fasting, kindness to parents, or Badr", "أو اختر القسم": "Or choose a category", "موضوع عشوائي عبر الذكاء الاصطناعي": "Random AI topic", "اقتراح موضوع": "Suggest a topic", "سنولّد الأسئلة من المصادر المعتمدة. إذا لم تتوفر مصادر كافية عن موضوعك، سنقترح عليك موضوعات قريبة.": "Questions come from trusted sources. If there are not enough sources, we will suggest related topics.",
    "نمط اللعب": "Game Mode", "فردي": "Solo", "لاعب، وحدك بأسلوبك": "A personal solo journey", "جماعي على جهاز واحد": "Local multiplayer", "رقعة لوحية للأسرة أو الفصل": "One board for family or class", "تنافسي عن بُعد": "Online competition", "غرفة برمز مع أصدقائك": "A room code for friends", "التالي": "Next", "اكتب أي موضوع يخطر ببالك، وأنا أجهّز لك الأسئلة!": "Choose a subject and I will prepare your questions!", "اختر مجالًا أو اكتب أي موضوع يخطر ببالك، وسأجهز لك الأسئلة!": "Choose a category or type a subject and I will prepare your questions!", "أنت من يحدد خياراتك، ولا يستنتج النظام أي معلومة شخصية أو دينية عنك.": "You choose what to share. The system does not infer personal or religious information about you.",
    "اللاعبون": "Players", "لعب جماعي على جهاز واحد: يتناوب اللاعبون في كل دور.": "Take turns playing together on one device.", "تناوبوا على الجهاز، وكل واحد يلعب دوره!": "Take turns on one device, one player at a time!", "اللاعب ١": "Player 1", "اللاعب ٢": "Player 2", "اكتب الاسم": "Enter a name", "إضافة لاعب": "Add Player", "حتى ٤ لاعبين على الجهاز نفسه.": "Up to 4 players on this device.", "النقاط المطلوبة للفوز": "Points to Win", "ابدأ اللعب": "Start Game", "الموضوع": "Topic", "الفئة: الناشئة": "Age group: Youth", "ابدأ الجولة": "Start Round",
    "رجوع": "Back",
    "غرفة تنافسية": "Online Room", "العب مع أصدقائك عن بُعد، كل واحد من جهازه.": "Play remotely with friends, each on their own device.", "رمز غرفتك": "Your Room Code", "شارك الرمز مع أصدقائك لينضموا": "Share this code so friends can join", "مشاركة الرمز": "Share Code", "تم نسخ الرمز": "Code Copied", "اللاعبون في الغرفة": "Players in Room", "المضيف": "Host", "جاهز": "Ready", "بانتظار انضمام لاعبين...": "Waiting for players to join...", "أو انضم إلى غرفة برمزها": "Or join a room with a code", "اكتب رمز الغرفة": "Enter room code", "انضمام": "Join", "أدخل رمزًا مكوّنًا من 4 أحرف أو أرقام.": "Enter a 4-character or 4-digit code.",
    "الرقعة الجماعية": "Game Board", "سحبت بطاقة!": "Card Drawn!", "بداية الجولة": "Round Start", "لنبدأ الرحلة!": "Let’s Begin!", "كل الخلايا مغطاة الآن. اسحب بطاقة وأجب، ثم تقدّم لتكشف ما تخفيه الخلايا.": "Tiles are covered. Draw a card, answer, and advance to reveal what is hidden.", "اسحب بطاقة": "Draw a Card", "اسحب من أي رزمة": "Draw from any deck", "اكشف الخانة": "Reveal tile", "رزمة اعرف": "Know deck", "رزمة استكشف": "Explore deck", "رزمة حلل": "Analyze deck", "دورك الآن": "Your Turn", "أول من يبلغ 30 نقطة يفوز.": "First to reach 30 points wins.", "← البداية": "← Start", "رزمة البطاقات": "Card Deck", "مستوى البطاقة يظهر عشوائيًا: اعرف، أو استكشف، أو حلل": "Card level is random: Know, Explore, or Analyze",
    "رحلتي في الصيام": "My Fasting Journey", "كل محطة بطاقة، والمستوى يرتفع كلما تقدّمت.": "Each stop brings a card; levels increase as you advance.", "النقاط": "Points", "المحطات": "Stops", "مستواك": "Your Level", "محطتك التالية!": "Your Next Stop!", "ابدأ المحطة": "Start Stop", "رحلتك الفردية": "Your Solo Journey", "المصابيح": "Hints", "الدورة": "Round", "السجل": "Activity Log", "وصلت إلى محطة ٤ في رحلتك.": "You reached stop 4.", "بطاقة استكشف بانتظار إجابتك.": "An Explore card is waiting for your answer.",
    "بطاقة «اعرف»": "Know Card", "بطاقة «استكشف»": "Explore Card", "بطاقة «حلل»": "Analyze Card", "المستوى ١ • الصيام": "Level 1 • Fasting", "المستوى ٢ • الصيام": "Level 2 • Fasting", "المستوى ٣ • الصيام": "Level 3 • Fasting", "+ خطوة": "+1 point", "+ خطوتان": "+2 points", "+ ٣ خطوات": "+3 points", "+ ٤ نقاط": "+2 points", "+10 نقاط": "+10 points", "تأكيد الإجابة": "Submit Answer", "أرسل الإجابة": "Send Answer", "العودة للرقعة": "Back to Board", "بسّط لي السؤال": "Simplify this question", "تلميح": "Hint", "إجابتك": "Your Answer", "اكتب إجابتك بأسلوبك...": "Write your answer in your own words...", "يقيّم الذكاء الاصطناعي معنى إجابتك، لا مطابقة كلماتها.": "AI evaluates meaning, not exact wording.", "ما الشهر الذي فرض الله صيامه على المسلمين؟": "Which month did God prescribe for Muslims to fast?", "شعبان": "Sha'ban", "رمضان": "Ramadan", "شوال": "Shawwal", "ذو الحجة": "Dhul Hijjah", "الموقف": "Scenario", "اختر التصرف وسببه معًا.": "Choose both the action and its reason.", "يذكّره بلطف إنه صائم": "Gently remind them they are fasting",     "لأن التذكير بالمعروف من التعاون على الخير": "Because kind reminders are a form of helping one another do good.",
    "صديقك صائم، وشاف زميله يأكل ناسيًا في نهار رمضان. ما التصرف الأقرب لهدي الإسلام؟": "Your friend is fasting and sees a classmate eating by mistake during Ramadan. What action best follows Islamic guidance?", "يسكت ويتركه يكمل": "Stay quiet and let them continue", "لأن الناسي ما عليه شي": "Because someone who forgets is not at fault", "يوبّخه قدام الناس": "Reprimand them in public", "حتى لا يتكرر": "So it will not happen again", "استنبط فائدتين من مشروعية الصيام في حياة المسلم.": "Infer two benefits of fasting in a Muslim’s life.", "بسّط لي السؤال": "Simplify the question",
    "فلك يقرأ إجابتك...": "Falak is reviewing your answer...", "يقارن معنى إجابتك بالمصادر المعتمدة، ما ياخذ إلا ثواني.": "Comparing your answer with trusted sources. This takes a few seconds.", "استرجاع النصوص من المصادر المعتمدة": "Retrieving trusted source texts", "مقارنة معنى إجابتك بالإجابة النموذجية": "Comparing your answer with the model answer", "تجهيز الشرح والدليل": "Preparing an explanation and evidence", "عرض النتيجة": "View Result",
    "إجابة صحيحة": "Correct Answer", "أحسنت! إجابتك صحيحة في معناها": "Well done! Your answer is correct in meaning", "تقييم إجابتك": "Your Answer Review", "ما أصبت فيه": "What you got right", "ما يمكن إضافته": "What could be added", "الشرح": "Explanation", "الدليل": "Evidence", "متابعة اللعب": "Continue Playing", "بسّط لي": "Simplify", "اسأل المختص": "Ask an Expert", "إجابة غير صحيحة": "Incorrect Answer", "إجابتك قريبة! ينقصها شي بسيط": "Your answer is close; it needs a little more", "الصواب": "Correct Answer", "لا تقدّم هذه المرة": "No progress this time", "لا تقدّم": "No progress", "إجابة جزئية": "Partially Correct",
    "خانة خاصة": "Special Tile", "وقفت على «مضاعفة ×٢»!": "You landed on Double Points!", "وقفت على «مصباح»!": "You landed on a Hint!", "نقاط سؤالك التالي تُحسب ضعفًا.": "Your next question is worth double points.", "متابعة": "Continue", "نهاية الجولة": "Round Complete", "انتهت الجولة!": "Round Complete!", "الفائز: لاعب ١": "Winner: Player 1", "الفائز:": "Winner:", "30 نقطة": "30 points", "22 نقطة": "22 points", "ملخص تقدّمك": "Your Progress Summary", "اعرف": "Know", "استكشف": "Explore", "حلل": "Analyze", "مستواك في الحج": "Your level in Hajj", "مستواك في رحلتك": "Your level in this journey", "العب مرة أخرى": "Play Again", "اكتب موضوعًا آخر": "Choose Another Topic", "الموضوع غير متاح حاليًا": "Topic Not Available", "ما لقينا مصادر معتمدة كافية عن «الموضوع المكتوب»": "We could not find enough trusted sources for this topic", "مواضيع قريبة متاحة": "Related Topics Available", "القرآن الكريم": "The Quran", "السيرة النبوية": "Prophetic Biography", "بر الوالدين": "Kindness to Parents",
    "كيف ألعب؟": "How to Play", "أربع خطوات وتبدأ رحلتك في مَدَار.": "Four steps to begin your Madaar journey.", "خليني أشرح لك اللعبة!": "Let me explain the game!", "اختر إعداداتك": "Choose Your Settings", "اللغة، والفئة، واكتب الموضوع اللي تبغاه، ونمط اللعب.": "Choose a language, age group, topic, and game mode.", "اسحب بطاقة وأجب": "Draw a Card and Answer", "يولّد فلك السؤال حسب مستواك من المصادر المعتمدة.": "Falak generates questions for your level from trusted sources.", "تقدّم على الرقعة": "Advance on the Board", "كلما ارتفع مستوى البطاقة زادت خطواتك.": "Higher-level cards move you farther across the board.", "اجمع النقاط وفُز": "Collect Points and Win", "أول من يبلغ النقاط المحددة يفوز بالجولة.": "The first player to reach the target score wins the round.", "مستويات البطاقات": "Card Levels", "تقدّم خطوة": "Move one space", "تقدّم خطوتان": "Move two spaces", "تقدّم ٣ خطوات": "Move three spaces", "اختيار من متعدد لترسيخ المفاهيم والتعريفات.": "Multiple choice reinforces key concepts and definitions.", "اختيار بين مواقف عملية: التصرف وسببه.": "Choose an action and its reason in a practical scenario.", "إجابة مفتوحة بأسلوبك يقيّم فلك معناها.": "Write an open response; Falak evaluates its meaning.", "الخانات الخاصة على الرقعة": "Special Board Tiles", "مكافأة": "Bonus", "نقاط إضافية مباشرة.": "Earn extra points immediately.", "مضاعفة ×٢": "Double Points ×2", "نقاط سؤالك التالي تنحسب ضعف.": "Your next question's points are doubled.", "تحدٍّ ذكي": "Smart Challenge", "سؤال من مستوى أعلى بخطوات أكثر.": "Answer a higher-level question to move farther.", "بطاقة": "Card", "اسحب بطاقة من أي رزمة.": "Draw a card from any deck.", "فلك يشرح": "Falak explains", "فهمت، لنبدأ": "Got it, let's start",
    "تهانينا": "Congratulations", "مشاركة": "Share", "رمز الغرفة": "Room Code", "الفئة: الشباب والبالغون": "Age group: Adults", "اكتب أي موضوع يخطر ببالك، وأنا أجهّز لك الأسئلة!": "Choose a topic and I will prepare your questions!", "ما الموضوع الذي تريد تعلّمه؟": "What would you like to learn about?", "الخانة": "Tile", "الجماعي": "Group", "تفاصيل قواعد اللعب الفردي ستضاف لاحقاً.": "Detailed solo rules will be added later."
  }));
  const englishToArabic = new Map([...arabicToEnglish].map(([arabic, english]) => [english, arabic]));
  window.MadaarTranslationMaps = {arabicToEnglish,englishToArabic};
  for (const [arabic, english] of [
    ["+1 نقطة", "+1 point"], ["+2 نقطة", "+2 points"], ["+3 نقطة", "+3 points"], ["+ 2 نقاط", "+2 points"],
    ["نقطة واحدة • 25 ثانية", "1 point • 25 seconds"], ["2 نقاط • 40 ثانية", "2 points • 40 seconds"],
    ["3 نقاط • 1:30 دقيقة", "3 points • 1:30 minutes"]
  ]) {
    arabicToEnglish.set(arabic, english);
    englishToArabic.set(english, arabic);
  }
  const topicNames = {
    "الوضوء": "Ablution", "الصلاة": "Prayer", "الصيام": "Fasting", "الزكاة": "Zakat", "الحج": "Hajj",
    "البيع والشراء": "Buying and Selling", "الأمانة في المعاملات": "Honesty in Transactions", "الربا": "Usury", "حفظ الحقوق": "Respecting Rights", "الصدق في التجارة": "Honesty in Trade",
    "التوحيد": "Monotheism", "أركان الإيمان": "Articles of Faith", "الإيمان بالملائكة": "Belief in Angels", "الإيمان باليوم الآخر": "Belief in the Hereafter", "أسماء الله الحسنى": "Names of God",
    "الهجرة النبوية": "The Hijra", "غزوة بدر": "Battle of Badr", "صلح الحديبية": "Treaty of Hudaybiyyah", "فتح مكة": "Conquest of Mecca", "السيرة النبوية": "Prophetic Biography",
    "تفسير سورة الفاتحة": "Tafsir of Al-Fatiha", "أسباب النزول": "Revelation Context", "جمع القرآن": "Compilation of the Quran", "قصص القرآن": "Quranic Stories", "آداب تلاوة القرآن": "Quran Recitation Etiquette",
    "بر الوالدين": "Kindness to Parents", "صلة الرحم": "Maintaining Family Ties", "الرفق": "Kindness", "الأمانة": "Trustworthiness", "آداب الحوار": "Conversation Etiquette"
  };
  for (const [arabic, english] of Object.entries(topicNames)) {
    arabicToEnglish.set(arabic, english);
    englishToArabic.set(english, arabic);
  }
  for (const [arabic, english] of Object.entries({
    "اختر القسم": "Choose a category",
    "كل الأقسام": "All Categories",
    "فقه العبادات": "Worship Jurisprudence",
    "فقه المعاملات المالية والأخلاقية": "Financial and Ethical Transactions",
    "أصول العقيدة وأركان الإيمان": "Beliefs and Articles of Faith",
    "السيرة النبوية والتاريخ": "Prophetic Biography and History",
    "التفسير وعلوم القرآن": "Quranic Exegesis and Studies",
    "الآداب والأخلاق": "Manners and Ethics",
    "موضوع عشوائي عبر الذكاء الاصطناعي": "Random AI Topic",
    "إغلاق الدرج": "Close Drawer",
    "انسحاب": "Withdraw",
    "انسحب لاعب، وتستمر الجولة لبقية المتنافسين.": "A player withdrew. The round continues for the others.",
    "تفاصيل قواعد اللعب الفردي ستضاف لاحقاً.": "Detailed solo rules will be added later."
  })) {
    arabicToEnglish.set(arabic, english);
    englishToArabic.set(english, arabic);
  }
  for (const [arabic, english] of Object.entries({
    "مدار - البداية": "Madaar - Home", "مدار - كيف ألعب": "Madaar - How to Play", "مدار - الإعداد والتخصيص": "Madaar - Game Setup", "مدار - اللاعبون": "Madaar - Players", "مدار - غرفة تنافسية": "Madaar - Online Room", "مدار - الرقعة الجماعية": "Madaar - Game Board", "مدار - الرحلة الفردية": "Madaar - Solo Journey", "مدار - نهاية الجولة": "Madaar - Round Complete", "مدار - بطاقة اعرف": "Madaar - Know Card", "مدار - بطاقة استكشف": "Madaar - Explore Card", "مدار - بطاقة حلل": "Madaar - Analyze Card", "مدار - جاري التقييم": "Madaar - Evaluating", "مدار - إجابة صحيحة": "Madaar - Correct Answer", "مدار - إجابة تحتاج إضافة": "Madaar - Partial Answer", "مدار - خانة خاصة": "Madaar - Special Tile", "مدار - الموضوع غير متاح": "Madaar - Topic Unavailable", "مدار - اسأل المختص": "Madaar - Ask an Expert", "مدار - بسط لي": "Madaar - Simplify",
    "للأسئلة الدقيقة أو اللي ما تغطيها المصادر المتاحة.": "For detailed questions not covered by available sources.", "البطاقة المرتبطة • حلل": "Linked card • Analyze", "سؤالك": "Your question", "البريد الإلكتروني لاستلام الرد (اختياري)": "Email for the reply (optional)", "اكتب سؤالك هنا...": "Write your question here...", "إرسال السؤال": "Send Question", "العودة إلى اللعبة": "Return to Game", "سؤال جميل! بنوصله لمختص شرعي، وكمّل لعبك لين يجيك الرد.": "Good question! We will send it to a specialist. Keep playing while you wait.",
    "ما الموضوع الذي تريد تعلمه؟": "What topic would you like to learn about?", "ما التصرف الأقرب لهدي الإسلام؟": "What action best follows Islamic guidance?", "لاعب 1 (أنت)": "Player 1 (You)", "شرح": "Explanation", "المصدر": "Source", "إجابة نموذجية": "Model Answer", "تحتاج إجابتك إلى إضافة": "Your answer needs one more point", "فلك يحتفل": "Falak celebrates", "فلك يفكر": "Falak is thinking", "اختر موضوعاً": "Choose a topic", "اكتب إجابتك": "Write your answer"
  })) {
    arabicToEnglish.set(arabic, english);
    englishToArabic.set(english, arabic);
  }
  for (const [arabic, english] of Object.entries({
    "بسّط لي": "Simplify",
    "وقفت على «مصباح»!": "You landed on the Lamp tile!",
    "استخدم المصباح لتحصل على تلميح يساعدك في الإجابة.": "Use the lamp to get a hint that helps you answer.",
    "وقفت على «مضاعفة ×٢»!": "You landed on Double Points ×2!",
    "نقاط سؤالك التالي تُحسب ضعفًا.": "Your next question's points are doubled.",
    "وقفت على «التحدي الكبير»!": "You landed on the Big Challenge!",
    "أجب عن سؤال من مستوى أعلى لتتقدم أكثر.": "Answer a higher-level question to advance farther.",
    "وقفت على «المبارزة»!": "You landed on the Duel!",
    "تحدَّ لاعبًا آخر في سؤال سريع.": "Challenge another player to a quick question.",
    "وقفت على «حلبة المناظرة»!": "You landed on Debate Arena!",
    "اعرض حجتك واستمع إلى الرأي الآخر باحترام.": "Share your argument and respectfully listen to another point of view.",
    "وقفت على «التعاون»!": "You landed on Cooperation!",
    "تعاونوا للوصول إلى الإجابة معًا.": "Work together to reach the answer.",
    "وقفت على «محطة أمان»!": "You landed on a Safe Stop!",
    "توقف آمن يمنحك فرصة لترتيب خطوتك التالية.": "A safe stop gives you time to plan your next move.",
    "وقفت على «محاولة ثانية»!": "You landed on a Second Chance!",
    "لديك فرصة أخرى للإجابة والتقدم.": "You have another chance to answer and advance.",
    "وقفت على «محطة المعرفة»!": "You landed on a Knowledge Stop!",
    "أجب عن سؤال إضافي واكسب تقدمًا.": "Answer an extra question to gain progress.",
    "وقفت على «مكافأة»!": "You landed on a Bonus!",
    "أضف نقاطًا إلى رصيدك.": "Add points to your score.",
    "فلك يشرح لك بأسلوب أسهل": "Falak explains it more simply.",
    "تخيّل الصيام تمرينًا للنفس: مثل ما الرياضة تقوّي جسمك، الصيام يقوّي صبرك وإرادتك.": "Think of fasting as an exercise for the soul: just as exercise strengthens the body, fasting strengthens patience and willpower.",
    "مثال من الحياة": "A real-life example",
    "لما تصوم وتشوف الأكل قدامك وتصبر، أنت تتدرب على التحكم بنفسك.": "When you fast, see food, and choose to wait, you practice self-control.",
    "مبني على نفس المصدر: سورة البقرة، الآية 183": "Based on the same source: Surah Al-Baqarah, verse 183.",
    "هل أصبح الشرح أوضح؟": "Is it clearer now?",
    "بسّط لي أكثر": "Simplify further",
    "نعم، فهمت": "Yes, I understand",
    "إغلاق": "Close",
    "ذكرت أن الصيام يعلّم الصبر ويقوّي الإرادة.": "You mentioned that fasting teaches patience and strengthens willpower.",
    "ذكرت أن الصيام عبادة يؤجر عليها المسلم.": "You mentioned that fasting is an act of worship rewarded by God.",
    "الصيام يذكّر بحال المحتاجين ويبعث على التكافل.": "Fasting reminds us of those in need and encourages solidarity.",
    "الحكمة الأساسية من الصيام هي تحقيق التقوى، وهي ما نص عليه الدليل.": "The main purpose of fasting is to nurture piety, as stated in the evidence.",
    "شُرع الصيام لتحقيق التقوى، وفيه تهذيب للنفس وتعويد على الصبر.": "Fasting was prescribed to nurture piety, discipline the soul, and teach patience.",
    "سورة البقرة، الآية 183": "Surah Al-Baqarah, verse 183",
    "[قاعدة الإجابة الجزئية]": "[Partial Answer Rule]"
  })) {
    arabicToEnglish.set(arabic, english);
    englishToArabic.set(english, arabic);
  }
  const originalDocumentTitle = document.title;
  for (const [arabic, english] of Object.entries({
    "قواعد اللعب حسب النمط": "Rules by Game Mode",
    "أدخل أسماء اللاعبين وألوان بيدقهم وحدد نقاط الفوز.": "Enter player names and pawn colors, then set the target score.",
    "يتناوب اللاعبون على سحب بطاقة والإجابة في دورهم.": "Players take turns drawing a card and answering.",
    "اعرف: نقطة خلال 25 ثانية، استكشف: نقطتان خلال 40 ثانية، حلل: 3 نقاط خلال 1:30 دقيقة.": "Know: 1 point in 25 seconds; Explore: 2 points in 40 seconds; Analyze: 3 points in 1:30 minutes.",
    "أول لاعب يبلغ هدف النقاط يفوز، ويمكن لبقية الجولة الاستمرار إذا انسحب لاعب.": "The first to reach the target score wins. The round continues if a player withdraws.",
    "تسير في مسار فردي باستخدام البطاقات والتلميحات. تفاصيل قواعد هذا النمط ستُستكمل عند تزويدنا بها.": "Play solo on the shared board using cards and special tiles.",
    "حركة الرقعة والخلايا الخاصة": "Board Movement and Special Tiles",
    "تبدأ الخلايا الـ٢٣ مخفية، وتُكشف الخلية عند هبوط بيدقك عليها. أول لاعب يكمل دورة يعيد إخفاء الخلايا وخلطها. كل دورة كاملة تمنح صاحبها ٣ نقاط إضافية.": "All 23 tiles start hidden and are revealed when a pawn lands on them. The first completed lap hides and reshuffles the tiles. Every completed lap earns 3 bonus points.",
    "أصفر · مساعدة": "Yellow · Boost",
    "المصباح يمنح تلميحًا مجانيًا واحدًا لهذه الجولة. المضاعفة تجعل نقاط إجابتك الصحيحة التالية ضعفًا.": "The lamp grants one free hint for this round. The multiplier doubles the points from your next correct answer.",
    "أزرق فاتح · أمان": "Light blue · Safe",
    "المحطة تمنح محاولة ثانية مجانية عند الخطأ في السؤال التالي. محطة المعرفة تعرض ومضة مرتبطة بالموضوع.": "The station grants one free retry after a wrong answer to your next question. The Knowledge Station shows a fact related to the topic.",
    "أحمر · تحدٍّ فردي": "Red · Solo Challenge",
    "سباق الثواني: بطاقة «اعرف» خلال ١٥ ثانية ومكافأة نقطتين. التحدي الكبير: سؤال «حلل» مقابل ٣ نقاط.": "Speed Run: answer a Know card within 15 seconds for 2 bonus points. Big Challenge: answer an Analyze card for 3 points.",
    "أخضر · إتقان فردي": "Green · Solo Mastery",
    "فعّل سلسلة الإتقان؛ إجابتان صحيحتان متتاليتان تمنحان ٣ نقاط إضافية.": "Activate the streak; two consecutive correct answers grant 3 bonus points.",
    "أحمر · تحدٍّ جماعي": "Red · Multiplayer Challenge",
    "التحدي الكبير يختار اللاعب أو المتأخر لخوض سؤال «حلل» على ٣ نقاط. في المبارزة، الأسرع من إجابتين صحيحتين يفوز بنقطة.": "Choose yourself or the trailing player for a 3-point Analyze challenge. In a duel, the faster correct answer wins 1 point.",
    "أخضر · تعاون جماعي": "Green · Team Up",
    "اختر زميلًا للإجابة معك، ثم تُقسم نقاط السؤال بالتساوي عند الإجابة الصحيحة.": "Choose a teammate to answer with you; split the question points equally for a correct answer.",
    "تسير على الرقعة نفسها وتستخدم البطاقات والخلايا الخاصة، وكل دورة كاملة تمنحك 3 نقاط إضافية.": "Play on the shared board with cards and special tiles; every completed lap earns 3 bonus points.",
    "كل الخلايا مخفية. اسحب بطاقة لتبدأ رحلتك.": "All tiles are hidden. Draw a card to begin your journey.",
    "خلية مخفية": "Hidden tile",
    "اسحب بطاقة اعرف": "Draw a Know card", "اسحب بطاقة استكشف": "Draw an Explore card", "اسحب بطاقة حلل": "Draw an Analyze card",
    "إعادة المحاولة ببطاقة اعرف": "Retry with a Know card", "إعادة المحاولة ببطاقة استكشف": "Retry with an Explore card", "إعادة المحاولة ببطاقة حلل": "Retry with an Analyze card",
    "ابدأ سباق الثواني (15 ثانية)": "Start the Speed Run (15 seconds)",
    "استمرار عادي": "Continue normally", "تابع بسؤال عادي": "Continue with a regular question",
    "اختر التحدي الكبير: حلل مقابل 3 نقاط": "Choose the Big Challenge: Analyze for 3 points",
    "استخدم مصباحًا مجانيًا للتلميح": "Use a free lamp for a hint",
    "بطاقة": "Card", "مصباح": "Lamp", "مضاعفة ×٢": "Multiplier ×2", "محطة الأمان": "Retry Station",
    "محطة المعرفة": "Knowledge Station", "سباق الثواني": "Speed Run", "التحدي الكبير": "Big Challenge",
    "سلسلة الإتقان": "Mastery Streak", "تحدي المنافسين": "Duel", "خلية الفريق": "Team Up",
    "الإجابة تحتاج إلى مراجعة؛ لا نقاط أو حركة هذه المرة.": "Review needed; no points or movement this time.",
    "بطاقة: اسحب بطاقة وأجب عن سؤال من الموضوع المختار.": "Card: Draw a card and answer a question about your chosen topic.",
    "مصباح: حصلت على مصباح مجاني للتلميحات في هذه الجولة.": "Lamp: You earned one free hint for this round.",
    "مضاعفة ×٢: تتضاعف نقاط إجابتك الصحيحة التالية.": "Multiplier ×2: Your next correct answer is worth double points.",
    "محطة الأمان: تمنح محاولة ثانية مجانية عند الخطأ في السؤال القادم.": "Retry Station: Get one free retry if you miss your next question.",
    "سباق الثواني: أجب عن سؤال «اعرف» خلال 15 ثانية لتكسب نقطتين إضافيتين.": "Speed Run: Answer a Know question within 15 seconds for 2 bonus points.",
    "التحدي الكبير: اختر سؤالًا عاديًا أو تحدَّ نفسك ببطاقة «حلل» مقابل 3 نقاط.": "Big Challenge: Continue normally or answer an Analyze card for 3 points.",
    "سلسلة الإتقان: أجب عن سؤالين متتاليين إجابة صحيحة لتحصل على 3 نقاط إضافية.": "Mastery Streak: Answer two consecutive questions correctly to earn 3 bonus points.",
    "تحدي المنافسين: اختر منافسًا للإجابة عن السؤال السريع نفسه؛ الأسرع الصحيح يكسب نقطة.": "Duel: Choose an opponent to answer the same quick question; the faster correct answer earns 1 point.",
    "خلية الفريق: اختر زميلًا، واقسما نقاط السؤال بالتساوي عند الإجابة الصحيحة.": "Team Up: Choose a teammate and split the question points equally for a correct answer.",
    "استُخدم مصباح مجاني؛ لم تُخصم أي نقاط.": "A free lamp was used; no points were deducted.",
    "لا يتوفر مصباح مجاني في هذا الدور.": "No free lamp is available this turn.",
    "اسحب بطاقة عشوائية": "Draw a random card",
    "مستوى البطاقة عشوائي: اعرف أو استكشف أو حلل": "Card level is random: Know, Explore, or Analyze",
    "بطاقات عشوائية": "Random cards",
    "اختر إجابة للمتابعة.": "Choose an answer to continue.",
    "حتى ٤ لاعبين على الجهاز نفسه. اختر لونًا مختلفًا لكل بيدق.": "Up to 4 players on this device. Choose a different color for each pawn.",
    "اختر لونًا مختلفًا لكل لاعب قبل بدء اللعب.": "Choose a different color for each player before starting.",
    "رجوع": "Back",
    "لاعب ١": "Player 1", "لاعب ٢": "Player 2", "لاعب 1": "Player 1", "لاعب 2": "Player 2", "لون اللاعب": "Player color"
  })) {
    arabicToEnglish.set(arabic, english);
    englishToArabic.set(english, arabic);
  }
  const westernize = (value) => value.replace(/[٠-٩۰-۹]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".includes(digit) ? String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)) : String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
  let language = localStorage.getItem(languageKey) === "en" ? "en" : "ar";
  const soundKey = "madaarSoundMuted";
  let soundMuted = localStorage.getItem(soundKey) === "true";
  let soundContext;
  let soundButton;
  let warnedAboutAudio = false;
  const soundPatterns = {
    click: [[520, 0.045, "sine"]],
    open: [[440, 0.11, "sine"], [660, 0.13, "sine"], [880, 0.17, "sine"]],
    tile: [[392, 0.12, "triangle"], [784, 0.13, "sine"], [1046, 0.24, "sine"]],
    success: [[523, 0.11, "sine"], [659, 0.12, "sine"], [784, 0.2, "sine"]],
    error: [[220, 0.11, "triangle"], [185, 0.13, "triangle"]],
    timeUp: [[740, 0.08, "sine"], [540, 0.12, "sine"]]
  };

  function updateSoundButton() {
    if (!soundButton) return;
    const actionLabel = soundMuted
      ? language === "en" ? "Unmute sound" : "تفعيل الصوت"
      : language === "en" ? "Mute sound" : "كتم الصوت";
    const stateLabel = soundMuted
      ? language === "en" ? "Sound muted" : "الصوت مكتوم"
      : language === "en" ? "Sound on" : "الصوت يعمل";
    soundButton.textContent = soundMuted ? "🔇" : "🔊";
    soundButton.title = actionLabel;
    soundButton.setAttribute("aria-label", stateLabel);
    soundButton.setAttribute("aria-pressed", String(soundMuted));
  }

  function createSoundButton(host, floating = false) {
    soundButton = document.createElement("button");
    soundButton.type = "button";
    soundButton.className = `sound-toggle${floating ? " sound-toggle-floating" : ""}`;
    soundButton.addEventListener("click", () => {
      soundMuted = !soundMuted;
      localStorage.setItem(soundKey, String(soundMuted));
      updateSoundButton();
      if (!soundMuted) playSound("click");
    });
    host.append(soundButton);
    updateSoundButton();
  }

  function playSound(kind) {
    if (soundMuted || !soundPatterns[kind]) return;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      if (!warnedAboutAudio) console.warn("Web Audio API is not supported; game sounds are unavailable.");
      warnedAboutAudio = true;
      return;
    }
    soundContext = soundContext || new AudioContextConstructor();
    if (soundContext.state === "suspended") {
      soundContext.resume().catch((error) => console.warn("Could not resume the game audio context.", error));
    }
    const startedAt = soundContext.currentTime;
    soundPatterns[kind].forEach(([frequency, duration, waveform], index) => {
      const startAt = startedAt + index * 0.13;
      const oscillator = soundContext.createOscillator();
      const gain = soundContext.createGain();
      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      if (kind === "open" || kind === "success") {
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.06, startAt + duration);
      }
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.045, startAt + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(soundContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.01);
    });
  }

  window.MadaarAudio = {
    play: playSound,
    isMuted: () => soundMuted
  };

  function translateDynamicText(value) {
    const soloArabic = value.match(/^رحلتي الفردية: (.+) • فردي$/);
    const soloEnglish = value.match(/^My Solo Journey: (.+) • Solo$/);
    if (language === "en" && soloArabic) return `My Solo Journey: ${topicNames[soloArabic[1]] || soloArabic[1]} • Solo`;
    if (language === "ar" && soloEnglish) return `رحلتي الفردية: ${[...Object.entries(topicNames)].find(([, english]) => english === soloEnglish[1])?.[0] || soloEnglish[1]} • فردي`;
    if (language === "en") {
      let match = value.match(/^\+ ?(\d+) نقاط?$/);
      if (match) return `+${match[1]} points`;
      match = value.match(/^\+ ?(\d+) خطوات?$/);
      if (match) return `+${match[1]} steps`;
      match = value.match(/^النقاط: (\d+) · المصابيح المجانية: (\d+)$/);
      if (match) return `Points: ${match[1]} · Free lamps: ${match[2]}`;
      match = value.match(/^(.+) · (\d+) دورة$/);
      if (match) return `${match[1]} · ${match[2]} laps`;
      match = value.match(/^إجابة صحيحة: \+(\d+) نقطة\.$/);
      if (match) return `Correct answer: +${match[1]} points.`;
      match = value.match(/^فاز (.+) بالمبارزة وحصل على نقطة\.$/);
      if (match) return `${match[1]} won the duel and earned a point.`;
      match = value.match(/^أتحدى بنفسي \(\+3 نقاط\)$/);
      if (match) return "I challenge myself (+3 points)";
      match = value.match(/^أوجّه التحدي إلى (.+)$/);
      if (match) return `Send the challenge to ${match[1]}`;
      match = value.match(/^تحدَّ (.+) في مبارزة سريعة$/);
      if (match) return `Duel ${match[1]} in a quick question`;
      match = value.match(/^تعاون مع (.+)$/);
      if (match) return `Team up with ${match[1]}`;
      match = value.match(/^أجب أولاً (.+)، ثم مرّر الجهاز إلى (.+)\.$/);
      if (match) return `First, ${match[1]} answers; then pass the device to ${match[2]}.`;
      match = value.match(/^الآن دور (.+) للإجابة عن السؤال نفسه\.$/);
      if (match) return `Now ${match[1]} answers the same question.`;
      match = value.match(/^محطة المعرفة: من موضوع «(.+)» — (.+)$/);
      if (match) {
        const fact = match[2] === "التعلّم يزداد رسوخًا حين تربط المعرفة بتطبيقها."
          ? "Learning lasts when you connect knowledge to practice."
          : "A good question is the beginning of understanding.";
        return `Knowledge Station: About ${topicNames[match[1]] || match[1]} — ${fact}`;
      }
    } else {
      let match = value.match(/^\+(\d+) points$/);
      if (match) return `+${match[1]} نقاط`;
      match = value.match(/^\+(\d+) steps$/);
      if (match) return `+${match[1]} خطوات`;
      match = value.match(/^Points: (\d+) · Free lamps: (\d+)$/);
      if (match) return `النقاط: ${match[1]} · المصابيح المجانية: ${match[2]}`;
      match = value.match(/^(.+) · (\d+) laps$/);
      if (match) return `${match[1]} · ${match[2]} دورة`;
      match = value.match(/^Correct answer: \+(\d+) points\.$/);
      if (match) return `إجابة صحيحة: +${match[1]} نقطة.`;
      match = value.match(/^(.+) won the duel and earned a point\.$/);
      if (match) return `فاز ${match[1]} بالمبارزة وحصل على نقطة.`;
      match = value.match(/^I challenge myself \(\+3 points\)$/);
      if (match) return "أتحدى بنفسي (+3 نقاط)";
      match = value.match(/^Send the challenge to (.+)$/);
      if (match) return `أوجّه التحدي إلى ${match[1]}`;
      match = value.match(/^Duel (.+) in a quick question$/);
      if (match) return `تحدَّ ${match[1]} في مبارزة سريعة`;
      match = value.match(/^Team up with (.+)$/);
      if (match) return `تعاون مع ${match[1]}`;
      match = value.match(/^First, (.+) answers; then pass the device to (.+)\.$/);
      if (match) return `أجب أولاً ${match[1]}، ثم مرّر الجهاز إلى ${match[2]}.`;
      match = value.match(/^Now (.+) answers the same question\.$/);
      if (match) return `الآن دور ${match[1]} للإجابة عن السؤال نفسه.`;
      match = value.match(/^Knowledge Station: About (.+) — (.+)$/);
      if (match) {
        const topic = [...Object.entries(topicNames)].find(([, english]) => english === match[1])?.[0] || match[1];
        const fact = match[2] === "Learning lasts when you connect knowledge to practice."
          ? "التعلّم يزداد رسوخًا حين تربط المعرفة بتطبيقها."
          : "السؤال الجيد بداية طريق الفهم.";
        return `محطة المعرفة: من موضوع «${topic}» — ${fact}`;
      }
    }
    const pattern = language === "en" ? /^الموضوع: (.+) • (فردي|جماعي|تنافسي)$/ : /^Topic: (.+) • (Solo|Group|Competitive)$/;
    const match = value.match(pattern);
    if (!match) return value;
    const [topic, mode] = match.slice(1);
    const modes = language === "en"
      ? { فردي: "Solo", جماعي: "Group", تنافسي: "Competitive" }
      : { Solo: "فردي", Group: "جماعي", Competitive: "تنافسي" };
    const translatedTopic = language === "en"
      ? topicNames[topic] || topic
      : [...Object.entries(topicNames)].find(([, english]) => english === topic)?.[0] || topic;
    return language === "en"
      ? `Topic: ${translatedTopic} • ${modes[mode]}`
      : `الموضوع: ${translatedTopic} • ${modes[mode]}`;
  }

  function changeLanguage(nextLanguage) {
    language = nextLanguage;
    if (localStorage.getItem(languageKey) !== language) localStorage.setItem(languageKey, language);
    location.reload();
  }

  function translateContent(root) {
    const forward = language === "en" ? arabicToEnglish : englishToArabic;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim() || node.parentElement.closest("script,style,svg,.language-toggle")) continue;
      const key = node.nodeValue.trim();
      const westernDigitKey = key.replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
      const translated = forward.get(key) || (language === "en" ? arabicToEnglish.get(westernDigitKey) : undefined);
      let value = translated
        ? node.nodeValue.replace(key, translated)
        : node.nodeValue.replace(key, translateDynamicText(key));
      value = westernize(value);
      if (value !== node.nodeValue) node.nodeValue = value;
    }
    root.querySelectorAll("input[placeholder],textarea[placeholder],[aria-label],img[alt]").forEach((element) => {
      for (const attribute of ["placeholder", "aria-label", "alt"]) {
        if (!element.hasAttribute(attribute)) continue;
        const value = westernize(forward.get(element.getAttribute(attribute)) || element.getAttribute(attribute));
        if (value !== element.getAttribute(attribute)) element.setAttribute(attribute, value);
      }
    });
    root.querySelectorAll(".topic-suggestion[data-topic-value]").forEach((element) => {
      const topic = element.dataset.topicValue;
      const label = language === "en" ? topicNames[topic] || topic : topic;
      element.textContent = language === "en" ? `Random suggestion: ${label}` : `اقتراح عشوائي: ${label}`;
    });
  }

  function clearSession() {
    window.MadaarSession?.clearGame();
    for (const key of ["madaarSetup", "madaarPlayers", "madaarPlayerColors", "madaarPlayerScores", "madaarTargetScore", "madaarAnswer", "madaarRoomCode", "madaarGameState", "madaarPendingTurn", "madaarPendingTilePulse"]) localStorage.removeItem(key);
    location.href = "Main.html";
  }

  function makeLanguageButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-toggle";
    button.addEventListener("click", () => changeLanguage(language === "ar" ? "en" : "ar"));
    return button;
  }

  function updateLanguageButtons() {
    document.querySelectorAll(".language-toggle").forEach((button) => {
      button.textContent = language === "ar" ? "English" : "Arabic";
      button.setAttribute("aria-label", language === "ar" ? "Switch to English" : "Switch to Arabic");
      button.lang = language === "ar" ? "en" : "ar";
    });
    document.querySelectorAll("input.player-color").forEach((input, index) => {
      input.setAttribute("aria-label", language === "ar" ? `لون اللاعب ${index + 1}` : `Player ${index + 1} color`);
    });
  }

  function attachLanguageToggle(nav) {
    if (!nav) return null;
    const old = [...nav.querySelectorAll("a")].find((anchor) => anchor.textContent.trim() === "English");
    const toggle = makeLanguageButton();
    if (old) old.replaceWith(toggle);
    else nav.append(toggle);
    return toggle;
  }

  function closeDrawer() { location.href = "Board.html"; }

  function addDrawerControls() {}

  function addDrawerBackground(app, panel) {
    const frame = document.querySelector("iframe.feedback-backdrop") || document.createElement("iframe");
    frame.className = "feedback-backdrop";
    frame.src = "Board.html?overlay=card";
    frame.title = "Game Board";
    frame.setAttribute("aria-hidden", "true");
    if (!frame.isConnected) document.body.prepend(frame);
    app.classList.add("screen-board-overlay");
    let main = app.querySelector("main");
    if (!main) {
      main = document.createElement("main");
      app.replaceChildren(main);
    } else {
      [...app.children].forEach((child) => { if (child !== main) child.remove(); });
    }
    main.classList.add("screen-board-overlay-main");
    main.replaceChildren(panel);
    panel.classList.add("screen-card-panel");
  }

  if (screen === "simplify" || screen === "expert" || screen === "feedback") {
    const app = document.querySelector("body > div");
    const panel = screen === "feedback" ? app.querySelector("main > div:first-child") : app.querySelector("section");
    addDrawerBackground(app, panel);
  }

  const app = document.querySelector("body > div");
  const header = app?.querySelector("header");
  const nav = header?.querySelector("nav");
  if (screen === 'home') attachLanguageToggle(nav);
  else nav?.querySelectorAll('a').forEach(link => { if (link.textContent.trim() === 'English') link.remove(); });
  if (["card", "checking", "special", "feedback", "simplify", "expert"].includes(screen)) {
    createSoundButton(document.body, true);
  } else if (nav && !nav.querySelector(".sound-toggle")) {
    createSoundButton(nav);
    nav.prepend(soundButton);
  }
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest(".sound-toggle, .journey-submit")) return;
    if (target.closest(".journey-hint")) setFalakState("explaining", 3000);
    const link = target.closest("a[href]");
    if (link && /Simplify\.html/i.test(link.getAttribute("href"))) setFalakState("explaining", 3000);
    if (link && /(?:CardKnow|CardExplore|CardAnalyze|SpecialTile)\.html/i.test(link.getAttribute("href"))) {
      playSound("open");
      return;
    }
    if (link && /(?:FeedbackCorrect|FeedbackPartial|Checking)\.html/i.test(link.getAttribute("href"))) return;
    if (target.closest("button, a[href], [role='button']")) playSound("click");
  }, true);
  const backDestinations = {
    guide: "Main.html",
    setup: "Main.html",
    players: "Setup.html",
    journey: "Board.html",
    room: "Main.html",
    card: "Board.html",
    checking: "Board.html",
    special: "Board.html",
    feedback: "Board.html"
  };
  if (nav && backDestinations[screen] && !nav.querySelector(".page-back")) {
    const back = document.createElement("a");
    back.className = "page-back";
    back.href = backDestinations[screen];
    back.textContent = "رجوع";
    back.setAttribute("aria-label", language === "en" ? "Back" : "رجوع");
    nav.prepend(back);
  }
  if (screen === "guide") {
    const legacyTileGuide = [...document.querySelectorAll("main > section")].find((section) => {
      const heading = section.querySelector("h2")?.textContent.trim();
      return heading === "الخانات الخاصة على الرقعة" || heading === "Special Board Tiles";
    });
    legacyTileGuide?.remove();
    const soloGuide = [...document.querySelectorAll("main article")].find((article) => {
      const heading = article.querySelector("h3")?.textContent.trim();
      return heading === "رحلة فردية" || heading === "Solo Journey";
    });
    if (soloGuide?.querySelector("p")) soloGuide.querySelector("p").textContent = "تسير على الرقعة نفسها وتستخدم البطاقات والخلايا الخاصة، وكل دورة كاملة تمنحك 3 نقاط إضافية.";
  }
  if (screen === "simplify" && new URLSearchParams(location.search).has("freeLamp")) {
    const used = window.MadaarGame?.consumeHint();
    const notice = document.createElement("p");
    notice.className = "free-hint-notice";
    notice.textContent = used ? "استُخدم مصباح مجاني؛ لم تُخصم أي نقاط." : "لا يتوفر مصباح مجاني في هذا الدور.";
    app.querySelector(".screen-card-panel")?.append(notice);
    history.replaceState(null, "", location.pathname);
  }

  mountFalakImages();
  const specialTile = new URLSearchParams(location.search).get("tile");
  const initialFalakState = {
    card: "thinking",
    checking: "thinking",
    simplify: "explaining",
    expert: "explaining",
    setup: "explaining",
    unavailable: "thinking",
    feedback: document.body.dataset.result === "correct" ? "success" : "error",
    special: ["knowledge", "lamp"].includes(specialTile) ? "explaining" : "idle"
  }[screen] || (document.querySelector('.board-intro[data-tile-type="knowledge"]') ? "explaining" : "idle");
  setFalakState(initialFalakState, ["explaining", "success", "error"].includes(initialFalakState)
    ? 2400
    : screen === "checking" ? 4000 : 0);

  if (screen === "simplify" || screen === "expert") addDrawerControls(app?.querySelector(".screen-card-panel"));

  const gameScreens = ["board", "journey", "players", "room", "card", "checking", "special", "feedback"];
  if (nav && screen === 'home' && window.MadaarSession) {
    const account = document.createElement('a');
    const signedIn = window.MadaarSession.get();
    account.href = 'Login.html';
    account.className = 'account-action';
    account.textContent = 'تسجيل الدخول';
    account.style.cssText = 'min-height:44px;padding:0 14px;border:1px solid currentColor;border-radius:12px;display:inline-flex;align-items:center;text-decoration:none;font-size:14px';
    nav.prepend(account);
  }
  if (nav && ['board','journey'].includes(screen) && !new URLSearchParams(location.search).has('overlay')) {
    const exit = document.createElement("button");
    exit.type = "button";
    exit.className = "exit-game";
    exit.textContent = "الخروج من اللعبة";
    exit.addEventListener("click", clearSession);
    nav.prepend(exit);
  }

  if (["card", "checking", "special"].includes(screen)) {
    const panel = app?.querySelector(".screen-card-panel");
    addDrawerControls(panel);
    if (screen === "card") {
      const cardHeading = panel?.querySelector("section > div:first-child span:first-child")?.textContent || document.title;
      if (cardHeading.includes("حلل")) document.body.dataset.cardType = "analyze";
      const type = cardHeading.includes("حلل") ? "analyze" : cardHeading.includes("استكشف") ? "explore" : "know";
      const query = new URLSearchParams(location.search);
      const config = { know: [1, query.has("speedrun") || query.has("duel") ? 15 : 25], explore: [2, 40], analyze: [3, 90] }[type];
      const banner = panel?.querySelector("section > div:first-child");
      if (banner && !banner.querySelector(".card-timer")) {
        const score = banner.querySelector(":scope > span:last-child");
        if (score) score.textContent = `+${config[0]} نقطة`;
        const timer = document.createElement("span");
        timer.className = "card-timer";
        timer.textContent = `${Math.floor(config[1] / 60)}:${String(config[1] % 60).padStart(2, "0")}`;
        banner.append(timer);
        let remaining = config[1];
        const tick = setInterval(() => {
          if (timer.dataset.duelSecond === "true") return;
          remaining -= 1;
          if (!timer.isConnected || remaining < 0) { clearInterval(tick); return; }
          timer.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
          if (remaining === 0) {
            timer.classList.add("timer-expired");
            playSound("timeUp");
            setFalakState("error", 1600);
          }
        }, 1000);
      }
    }
  }

  if (screen === "feedback") addDrawerControls(app?.querySelector("main > div:first-child"));

  if (screen === "journey") {
    const timer = document.querySelector(".journey-timer");
    const cardPoints = document.querySelector(".journey-question header small");
    if (cardPoints) cardPoints.textContent = "+ 2 نقاط";
    let remaining = 40;
    const updateTimer = () => {
      if (!timer?.isConnected || remaining < 0) return;
      timer.textContent = `◴ 0:${String(remaining).padStart(2, "0")}`;
      if (remaining === 0) {
        timer.classList.add("timer-expired");
        playSound("timeUp");
      }
      remaining -= 1;
      window.setTimeout(updateTimer, 1000);
    };
    updateTimer();
  }

  if (screen === "board" && !new URLSearchParams(location.search).has('overlay')) {
    const section = document.querySelector("main > div:first-child > section:first-child");
    [...section.querySelectorAll(":scope > div")].forEach((card) => {
      const number = card.querySelector("span");
      const inputButton = document.createElement("button");
      inputButton.type = "button";
      inputButton.className = "withdraw-player";
      inputButton.textContent = "انسحاب";
      inputButton.addEventListener("click", () => {
        let names = window.MadaarGame ? window.MadaarGame.getState().names.slice() : JSON.parse(localStorage.getItem("madaarPlayers") || "[\"لاعب 1\",\"لاعب 2\"]");
        const currentCards = [...section.querySelectorAll(":scope > div")];
        const currentIndex = currentCards.indexOf(card);
        if (currentIndex < 0) return;
        const gameHandledWithdrawal = Boolean(window.MadaarGame?.removePlayer(currentIndex));
        names.splice(currentIndex, 1);
        const colors = JSON.parse(localStorage.getItem("madaarPlayerColors") || "[]");
        colors.splice(currentIndex, 1);
        localStorage.setItem("madaarPlayerColors", JSON.stringify(colors));
        const scores = JSON.parse(localStorage.getItem("madaarPlayerScores") || "[]");
        if (!scores.length) {
          scores.push(...currentCards.map((playerCard) => Number.parseInt(playerCard.querySelectorAll("span")[2]?.textContent || "0", 10) || 0));
        }
        if (!gameHandledWithdrawal) scores.splice(currentIndex, 1);
        localStorage.setItem("madaarPlayerScores", JSON.stringify(scores));
        if (!names.length) { clearSession(); return; }
        localStorage.setItem("madaarPlayers", JSON.stringify(names));
        card.remove();
        const notice = document.createElement("p");
        notice.className = "withdraw-notice";
        notice.textContent = "انسحب لاعب، وتستمر الجولة لبقية المتنافسين.";
        section.append(notice);
        if (gameHandledWithdrawal) {
          window.MadaarGame.getState().lastMessage = notice.textContent;
          window.MadaarGame.persist();
          localStorage.setItem('madaarWithdrawal',JSON.stringify({remaining:names.length}));
          if(names.length>=2){window.MadaarAIUI.cancelCard?.();window.MadaarPlay.open('Board.html');}
          else location.href='Main.html';
        }
      });
      card.append(inputButton);
      if (number) number.setAttribute("aria-hidden", "true");
    });
  }

  if (screen === "players") {
    document.querySelector("a[href='Board.html']")?.addEventListener("click", () => {
      localStorage.removeItem("madaarPlayerScores");
    });
  }

  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.body.dir = document.documentElement.dir;
  document.body.querySelectorAll("[dir]").forEach((element) => { element.dir = document.documentElement.dir; });
  document.title = language === "en" ? arabicToEnglish.get(originalDocumentTitle) || originalDocumentTitle : originalDocumentTitle;
  translateContent(document.body);
  updateLanguageButtons();

  document.addEventListener("keydown", (event) => {
    const radio = event.target.closest?.("[role='radio']");
    if (!radio || !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
    const group = radio.parentElement;
    const options = [...group.querySelectorAll("[role='radio']")];
    const currentIndex = options.indexOf(radio);
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = options[(currentIndex + direction + options.length) % options.length];
    event.preventDefault();
    next.click();
    next.focus();
  });

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") translateContent(record.target.parentElement);
      else for (const node of record.addedNodes) if (node.nodeType === Node.ELEMENT_NODE) {
        translateContent(node);
        mountFalakImages(node);
      }
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true });
  window.addEventListener("storage", (event) => {
    if (event.key === languageKey && (event.newValue === "ar" || event.newValue === "en")) changeLanguage(event.newValue);
  });
  document.addEventListener("input", (event) => {
    const input = event.target;
    if (input instanceof HTMLInputElement && input.type !== "color") {
      const value = westernize(input.value);
      if (value !== input.value) input.value = value;
    }
  });
})();

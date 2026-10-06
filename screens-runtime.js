(() => {
  const screen = document.body.dataset.screen;
  const language = localStorage.getItem("madaarLanguage") === "en" ? "en" : "ar";
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.body.dir = document.documentElement.dir;
  document.body.querySelectorAll("[dir]").forEach((element) => { element.dir = document.documentElement.dir; });
  if (!["card", "checking", "special"].includes(screen)) return;

  const backdrop = document.createElement("iframe");
  backdrop.className = "screen-board-backdrop";
  backdrop.src = "Board.html?overlay=card";
  backdrop.title = "الرقعة";
  backdrop.setAttribute("aria-hidden", "true");
  document.body.prepend(backdrop);

  const app = document.querySelector("body > div");
  app.classList.add("screen-board-overlay");
  app.querySelector("header")?.remove();

  const main = app.querySelector("main");
  main.classList.add("screen-board-overlay-main");
  if (screen === "card") {
    const panel = main.firstElementChild;
    panel.classList.add("screen-card-panel");
    panel.children[1]?.remove();
  } else {
    main.querySelector("section")?.classList.add("screen-card-panel");
  }

  if (screen === "special") {
    const specialTiles = {
      lamp: ["مصباح", "استخدم المصباح لتحصل على تلميح يساعدك في الإجابة.", "M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4z"],
      double: ["مضاعفة ×٢", "نقاط سؤالك التالي تُحسب ضعفًا.", "M12 5v14M5 12h14"],
      challenge: ["التحدي الكبير", "أجب عن سؤال من مستوى أعلى لتتقدم أكثر.", "M13 2L4 14h7l-1 8 9-12h-7l1-8z"],
      duel: ["المبارزة", "تحدَّ لاعبًا آخر في سؤال سريع.", "M6 4l12 16M18 4L6 20"],
      debate: ["حلبة المناظرة", "اعرض حجتك واستمع إلى الرأي الآخر باحترام.", "M4 5h16v11H9l-5 4z"],
      cooperate: ["التعاون", "تعاونوا للوصول إلى الإجابة معًا.", "M12 5v14M5 12h14"],
      safe: ["محطة أمان", "توقف آمن يمنحك فرصة لترتيب خطوتك التالية.", "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"],
      retry: ["محاولة ثانية", "لديك فرصة أخرى للإجابة والتقدم.", "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"],
      knowledge: ["محطة المعرفة", "أجب عن سؤال إضافي واكسب تقدمًا.", "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"],
      bonus: ["مكافأة", "أضف نقاطًا إلى رصيدك.", "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"]
    };
    const tile = specialTiles[new URLSearchParams(location.search).get("tile")] || specialTiles.double;
    const heading = main.querySelector("h1");
    const description = main.querySelector("p");
    const path = main.querySelector("svg path");
    if (heading) heading.textContent = `وقفت على «${tile[0]}»!`;
    if (description) description.textContent = tile[1];
    if (path) path.setAttribute("d", tile[2]);
  }

  if (screen === "card") window.MadaarAIUI.mountCard(main);
  if (screen === "checking") window.MadaarAIUI.mountChecking(main);
})();

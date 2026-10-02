export type Locale = "ar" | "en";
export type Copy = Record<Locale, string>;
export type CardType = "know" | "explore" | "analyze";
export type Audience = "under16" | "adult" | "newMuslim";
export type Topic = "pillars" | "prophetic" | "values" | "worship";
export type GameMode = "solo" | "local" | "remote";
export type CellKind =
  | "start"
  | "ordinary"
  | "provision"
  | "double"
  | "elevation"
  | "peer"
  | "cooperation"
  | "station"
  | "review"
  | "debate";
export type AnswerGrade = "correct" | "partial" | "incorrect";

export interface QuestionCard {
  id: string;
  kind: CardType;
  topic: Topic;
  prompt: Copy;
  options?: Copy[];
  correctOption?: number;
  answerKeywords?: Record<Locale, string[]>;
  hint: Copy;
  explanation: Copy;
  source: Copy;
  rewardPoints: number;
  moveSpaces: number;
}

export interface PlayerSetup {
  id: string;
  name: string;
  color: string;
}

export interface GameSetup {
  locale: Locale;
  audience: Audience;
  topic: Topic;
  mode: GameMode;
  scoreLimit: number;
  durationSeconds: number;
  players: PlayerSetup[];
}

export interface Player extends PlayerSetup {
  score: number;
  position: number;
  laps: number;
  hints: number;
  impact: number;
  multiplierReady: boolean;
  challengeBonus: number;
}

export interface BoardCell {
  index: number;
  kind: CellKind;
  title: Copy;
  detail: Copy;
  row: number;
  col: number;
}

export interface TurnReceipt {
  playerId: string;
  cardId: string;
  grade: AnswerGrade;
  points: number;
  movement: number;
  landedCell: BoardCell | null;
  effect: Copy | null;
}

export interface GameState {
  setup: GameSetup;
  players: Player[];
  currentPlayerIndex: number;
  turnCount: number;
  winnerId: string | null;
  lastTurn: TurnReceipt | null;
}

export const PLAYER_COLORS = [
  "#4C2FCC",
  "#1DBD6B",
  "#F2A51A",
  "#C32635",
  "#20204B",
  "#4C9FCE",
] as const;

export const CARD_TYPES: CardType[] = ["know", "explore", "analyze"];

const copy = (ar: string, en: string): Copy => ({ ar, en });

const cellDetails: Record<CellKind, { title: Copy; detail: Copy }> = {
  start: {
    title: copy("نقطة الانطلاق", "Starting point"),
    detail: copy("ابدأ رحلتك المعرفية", "Begin your learning journey"),
  },
  ordinary: {
    title: copy("مسار المعرفة", "Knowledge path"),
    detail: copy("واصل التقدّم مع كل إجابة", "Keep moving with each answer"),
  },
  provision: {
    title: copy("الزّاد", "Provision"),
    detail: copy("اكسب تلميحًا تستخدمه لاحقًا", "Earn a hint to use later"),
  },
  double: {
    title: copy("المضاعفة", "Double"),
    detail: copy("ضاعف نقاط بطاقتك القادمة", "Double your next card's points"),
  },
  elevation: {
    title: copy("تحدّي الارتقاء", "Rise challenge"),
    detail: copy("مكافأة إضافية عند الإجابة الصحيحة", "A bonus on your next correct answer"),
  },
  peer: {
    title: copy("تحدّي النظراء", "Peer challenge"),
    detail: copy("منافسة معرفية قصيرة", "A short knowledge challenge"),
  },
  cooperation: {
    title: copy("المعاونة", "Helping hand"),
    detail: copy("اكسب نقاط أثر بالتعاون", "Earn impact points through cooperation"),
  },
  station: {
    title: copy("المحطّة", "The station"),
    detail: copy("استراحة قصيرة قبل مواصلة الرحلة", "A short pause before continuing"),
  },
  review: {
    title: copy("استراحة المعرفة", "Knowledge break"),
    detail: copy("تذكير ومراجعة لما تعلّمته", "Review what you have learned"),
  },
  debate: {
    title: copy("حلبة المناظرة", "Debate arena"),
    detail: copy("فرصة لمكافأة إضافية", "An opportunity for an extra reward"),
  },
};

const cellKinds: CellKind[] = [
  "start",
  "ordinary",
  "ordinary",
  "provision",
  "ordinary",
  "double",
  "ordinary",
  "peer",
  "ordinary",
  "review",
  "ordinary",
  "elevation",
  "ordinary",
  "cooperation",
  "ordinary",
  "debate",
  "ordinary",
  "station",
  "ordinary",
  "ordinary",
];

const perimeter: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [5, 5],
  [5, 4],
  [5, 3],
  [5, 2],
  [5, 1],
  [5, 0],
  [4, 0],
  [3, 0],
  [2, 0],
  [1, 0],
];

export const BOARD_CELLS: BoardCell[] = perimeter.map(([row, col], index) => ({
  index,
  kind: cellKinds[index],
  title: cellDetails[cellKinds[index]].title,
  detail: cellDetails[cellKinds[index]].detail,
  row,
  col,
}));

export const QUESTION_BANK: Record<CardType, QuestionCard[]> = {
  know: [
    {
      id: "know-praise",
      kind: "know",
      topic: "values",
      prompt: copy(
        "ما السورة التي تبدأ بقول الله تعالى: «الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ»؟",
        "Which surah begins with “All praise is for Allah—Lord of all worlds”?",
      ),
      options: [
        copy("سورة الفاتحة", "Al-Fatiha"),
        copy("سورة الإخلاص", "Al-Ikhlas"),
        copy("سورة الفلق", "Al-Falaq"),
        copy("سورة الناس", "An-Nas"),
      ],
      correctOption: 0,
      hint: copy("هي السورة الأولى في المصحف.", "It is the first surah in the Quran."),
      explanation: copy(
        "تبدأ سورة الفاتحة بحمد الله رب العالمين، وهي أول سورة في المصحف.",
        "Surah Al-Fatiha begins with praise of Allah, Lord of all worlds, and is the first surah in the Quran.",
      ),
      source: copy("القرآن الكريم، سورة الفاتحة: ٢", "The Quran, Al-Fatiha 1:2"),
      rewardPoints: 2,
      moveSpaces: 1,
    },
    {
      id: "know-ihsan",
      kind: "know",
      topic: "values",
      prompt: copy(
        "ما الخُلُق الذي قرنه القرآن بالعدل في قوله تعالى: «إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَ...»؟",
        "Which quality is paired with justice in the verse “Indeed, Allah commands justice and …”?",
      ),
      options: [
        copy("الإحسان", "Excellence (ihsan)"),
        copy("التفاخر", "Boasting"),
        copy("العزلة", "Isolation"),
        copy("التسرّع", "Haste"),
      ],
      correctOption: 0,
      hint: copy("تبدأ الكلمة بهمزة وصل وتنتهي بالنون.", "The word begins with “excellence” and is a virtue."),
      explanation: copy(
        "تذكر الآية العدل والإحسان معًا، وتحث على الإحسان إلى الآخرين.",
        "The verse names justice and ihsan together and encourages doing good to others.",
      ),
      source: copy("القرآن الكريم، سورة النحل: ٩٠", "The Quran, An-Nahl 16:90"),
      rewardPoints: 2,
      moveSpaces: 1,
    },
  ],
  explore: [
    {
      id: "explore-reconcile",
      kind: "explore",
      topic: "values",
      prompt: copy(
        "اختلف صديقان في مشروع مشترك. أي تصرّف يساعدهما على الإصلاح بعد أن تسمع من كليهما؟",
        "Two friends disagree on a shared project. After hearing both sides, what would help them make peace?",
      ),
      options: [
        copy("أساعدهما على التفاهم والإنصاف", "Help them understand each other and be fair"),
        copy("أنشر الخلاف بين بقية الأصدقاء", "Spread the disagreement to other friends"),
        copy("ألوم أحدهما قبل أن أسمع منه", "Blame one of them before hearing their side"),
        copy("أطلب منهما تجاهل المشكلة", "Ask them to ignore the problem"),
      ],
      correctOption: 0,
      hint: copy("فكّر في الإصلاح والعدل بين الطرفين.", "Think about reconciliation and fairness to both people."),
      explanation: copy(
        "الإصلاح بين الناس والعدل عند الاختلاف من المعاني التي تؤكدها الآيات.",
        "Reconciliation and fairness during disagreement are both emphasized in the Quran.",
      ),
      source: copy("القرآن الكريم، سورة الحجرات: ٩–١٠", "The Quran, Al-Hujurat 49:9–10"),
      rewardPoints: 3,
      moveSpaces: 2,
    },
    {
      id: "explore-help",
      kind: "explore",
      topic: "values",
      prompt: copy(
        "نسي زميلك جزءًا من عمل المجموعة. ما أفضل طريقة للمعاونة دون أن تحرمه فرصة التعلّم؟",
        "A classmate forgot part of a group task. How can you help without taking away their chance to learn?",
      ),
      options: [
        copy("أشرح له الفكرة وأعمل معه على إنجازها", "Explain the idea and work through it together"),
        copy("أنجز الجزء عنه دون أن أخبره", "Do the part for them without telling them"),
        copy("أتركه يواجه المشكلة وحده", "Leave them to face the problem alone"),
        copy("أخبر الجميع بخطئه", "Tell everyone about their mistake"),
      ],
      correctOption: 0,
      hint: copy("المعاونة تجمع بين التعاون وحفظ فرصة التعلّم.", "Good help combines cooperation with preserving a chance to learn."),
      explanation: copy(
        "التعاون على الخير يكون بالمساندة، مع تشجيع الشخص على أداء دوره.",
        "Cooperation in good means offering support while encouraging the person to do their part.",
      ),
      source: copy("القرآن الكريم، سورة المائدة: ٢", "The Quran, Al-Ma'idah 5:2"),
      rewardPoints: 3,
      moveSpaces: 2,
    },
  ],
  analyze: [
    {
      id: "analyze-help",
      kind: "analyze",
      topic: "values",
      prompt: copy(
        "كيف تساعد صديقًا أخطأ في واجبه بطريقة تعلّمه الاعتماد على نفسه؟ اكتب خطوة عملية.",
        "How could you help a friend who made a mistake on an assignment while helping them learn to work independently? Give one practical step.",
      ),
      answerKeywords: {
        ar: ["أشرح", "أساعد", "أفهم", "أرشده", "أوجهه", "معه", "مصدر", "أدله"],
        en: ["explain", "help", "guide", "show", "source", "together", "understand"],
      },
      hint: copy("فكّر في شرح الفكرة أو إرشاده إلى مصدر، ثم تركه ينجز بنفسه.", "Consider explaining the idea or pointing to a source, then letting them finish it."),
      explanation: copy(
        "الإجابة القوية تجمع بين المساندة والتوجيه، وتترك للصديق فرصة المحاولة والتعلّم.",
        "A strong answer offers support and guidance while leaving room for the friend to try and learn.",
      ),
      source: copy("القرآن الكريم، سورة المائدة: ٢", "The Quran, Al-Ma'idah 5:2"),
      rewardPoints: 4,
      moveSpaces: 3,
    },
    {
      id: "analyze-kindness",
      kind: "analyze",
      topic: "values",
      prompt: copy(
        "اكتب ردًا قصيرًا ولطيفًا تقوله لشخص أخطأ، واذكر كيف تحافظ على كرامته.",
        "Write a short, kind response to someone who made a mistake, and say how you would preserve their dignity.",
      ),
      answerKeywords: {
        ar: ["برفق", "بلطف", "أحترم", "أحفظ", "أكلمه", "نصيحة", "خاص", "هدوء"],
        en: ["kind", "gently", "respect", "dignity", "privately", "advice", "calm"],
      },
      hint: copy("اختر كلمات هادئة، واجعل النصيحة على انفراد.", "Use calm words and offer advice privately."),
      explanation: copy(
        "النصيحة اللطيفة والخاصة تساعد على حفظ الكرامة وتقبّل التوجيه.",
        "Kind, private advice can preserve dignity and make guidance easier to accept.",
      ),
      source: copy("القرآن الكريم، سورة طه: ٤٤", "The Quran, Ta-Ha 20:44"),
      rewardPoints: 4,
      moveSpaces: 3,
    },
  ],
};

export function getCopy(value: Copy, locale: Locale): string {
  return value[locale];
}

export function getCardForTurn(kind: CardType, turnCount: number): QuestionCard {
  const cards = QUESTION_BANK[kind];
  return cards[turnCount % cards.length];
}

export function createGame(setup: GameSetup): GameState {
  const players = setup.players.map((player, index) => ({
    ...player,
    name: player.name.trim() || (setup.locale === "ar" ? `لاعب ${index + 1}` : `Player ${index + 1}`),
    score: 0,
    position: 0,
    laps: 0,
    hints: 0,
    impact: 0,
    multiplierReady: false,
    challengeBonus: 0,
  }));

  return {
    setup: { ...setup, players: setup.players.map((player) => ({ ...player })) },
    players,
    currentPlayerIndex: 0,
    turnCount: 0,
    winnerId: null,
    lastTurn: null,
  };
}

export function getCurrentPlayer(state: GameState): Player {
  return state.players[state.currentPlayerIndex];
}

function normalizeText(value: string, locale: Locale): string {
  const lower = value.toLocaleLowerCase();
  return locale === "ar"
    ? lower
        .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .trim()
    : lower.trim();
}

export function evaluateAnswer(card: QuestionCard, response: string, locale: Locale): AnswerGrade {
  if (card.options && card.correctOption !== undefined) {
    return Number(response) === card.correctOption ? "correct" : "incorrect";
  }
  const normalized = normalizeText(response, locale);
  if (normalized.length < 4 || !card.answerKeywords) return "incorrect";
  const matches = card.answerKeywords[locale].filter((keyword) =>
    normalized.includes(normalizeText(keyword, locale)),
  ).length;
  if (matches >= 2) return "correct";
  if (matches === 1) return "partial";
  return "incorrect";
}

function cellEffect(
  kind: CellKind,
  player: Player,
): { player: Player; message: Copy | null; bonusPoints: number } {
  switch (kind) {
    case "provision":
      return {
        player: { ...player, hints: player.hints + 1 },
        message: copy("حصلت على تلميح جديد.", "You gained a new hint."),
        bonusPoints: 0,
      };
    case "double":
      return {
        player: { ...player, multiplierReady: true },
        message: copy("بطاقتك التالية تمنحك نقاطًا مضاعفة.", "Your next card earns double points."),
        bonusPoints: 0,
      };
    case "elevation":
      return {
        player: { ...player, challengeBonus: player.challengeBonus + 2 },
        message: copy("أُضيفت نقطتان مكافأة إلى إجابتك الصحيحة التالية.", "Two bonus points await your next correct answer."),
        bonusPoints: 0,
      };
    case "peer":
      return {
        player: { ...player, challengeBonus: player.challengeBonus + 1 },
        message: copy(
          "مكافأة تحدّي النظراء: نقطة إضافية عند إجابة صحيحة لاحقة.",
          "Peer challenge bonus: one extra point on a future correct answer.",
        ),
        bonusPoints: 0,
      };
    case "cooperation":
      return {
        player: { ...player, impact: player.impact + 2 },
        message: copy("أضفت نقطتي أثر إلى رصيد المعاونة.", "You added two impact points for helping."),
        bonusPoints: 0,
      };
    case "review":
      return {
        player: { ...player, hints: player.hints + 1 },
        message: copy("مراجعة سريعة: حصلت على تلميح إضافي.", "Quick review: you gained an extra hint."),
        bonusPoints: 0,
      };
    case "debate":
      return {
        player: { ...player },
        message: copy("مكافأة حلبة المناظرة: +١ نقطة.", "Debate arena reward: +1 point."),
        bonusPoints: 1,
      };
    case "station":
      return {
        player: { ...player },
        message: copy("استراحة قصيرة. دورك القادم مستمر.", "A short rest. Your next turn is ready."),
        bonusPoints: 0,
      };
    default:
      return { player, message: null, bonusPoints: 0 };
  }
}

export function resolveTurn(
  state: GameState,
  card: QuestionCard,
  grade: AnswerGrade,
): GameState {
  if (state.winnerId || state.players.length === 0) return state;

  const activeIndex = state.currentPlayerIndex;
  const activePlayer = state.players[activeIndex];
  const basePoints =
    grade === "correct"
      ? card.rewardPoints
      : grade === "partial"
        ? Math.max(1, Math.floor(card.rewardPoints / 2))
        : 0;
  const challengePoints = grade === "correct" ? activePlayer.challengeBonus : 0;
  const multiplier = activePlayer.multiplierReady ? 2 : 1;
  const awarded = (basePoints + challengePoints) * multiplier;
  const scoreAfterAnswer = Math.min(
    state.setup.scoreLimit,
    activePlayer.score + awarded,
  );
  const movement = grade === "correct" ? card.moveSpaces : 1;
  const nextPosition = (activePlayer.position + movement) % BOARD_CELLS.length;
  const completedLaps =
    activePlayer.laps + Math.floor((activePlayer.position + movement) / BOARD_CELLS.length);
  const landedCell = BOARD_CELLS[nextPosition];
  const steppedPlayer: Player = {
    ...activePlayer,
    score: scoreAfterAnswer,
    position: nextPosition,
    laps: completedLaps,
    multiplierReady: false,
    challengeBonus: grade === "correct" ? 0 : activePlayer.challengeBonus,
  };
  const effectResult = cellEffect(landedCell.kind, steppedPlayer);
  const finalScore = Math.min(state.setup.scoreLimit, effectResult.player.score + effectResult.bonusPoints);
  const winnerId = finalScore >= state.setup.scoreLimit ? activePlayer.id : null;
  const finalPlayer = { ...effectResult.player, score: finalScore };
  const players = state.players.map((player, index) =>
    index === activeIndex ? finalPlayer : player,
  );

  return {
    ...state,
    players,
    currentPlayerIndex: winnerId ? activeIndex : (activeIndex + 1) % players.length,
    turnCount: state.turnCount + 1,
    winnerId,
    lastTurn: {
      playerId: activePlayer.id,
      cardId: card.id,
      grade,
      points: finalScore - activePlayer.score,
      movement,
      landedCell,
      effect: effectResult.message,
    },
  };
}

export function useHint(state: GameState): GameState {
  if (state.winnerId) return state;
  const player = getCurrentPlayer(state);
  if (player.hints <= 0) return state;
  return {
    ...state,
    players: state.players.map((item, index) =>
      index === state.currentPlayerIndex ? { ...item, hints: item.hints - 1 } : item,
    ),
  };
}
(() => {
  const stateKey = "madaarGameState";
  const pendingKey = "madaarPendingTurn";
  const tileCatalog = {
    card: { label: "بطاقة", type: "card", color: "#0b3b70", description: "اسحب بطاقة وأجب عن سؤال من الموضوع المختار." },
    lamp: { label: "مصباح", type: "lamp", color: "#f0a92a", description: "حصلت على مصباح مجاني للتلميحات في هذه الجولة." },
    multiplier: { label: "مضاعفة ×٢", type: "multiplier", color: "#f0a92a", description: "تتضاعف نقاط إجابتك الصحيحة التالية." },
    retry: { label: "محطة الأمان", type: "retry", color: "#9bd7f3", description: "محاولة ثانية مجانية عند أول خطأ لاحق؛ تُستخدم مرة واحدة." },
    knowledge: { label: "محطة المعرفة", type: "knowledge", color: "#9bd7f3", description: "ومضة معرفية مرتبطة بموضوع رحلتك." },
    speed: { label: "سباق الثواني", type: "speed", color: "#d94a52", description: "أجب عن سؤال «اعرف» خلال 15 ثانية لتكسب نقطتين إضافيتين." },
    bigSolo: { label: "التحدي الكبير", type: "bigSolo", color: "#d94a52", description: "اختر سؤالًا عاديًا أو تحدَّ نفسك ببطاقة «حلل» مقابل 3 نقاط." },
    streak: { label: "سلسلة الإتقان", type: "streak", color: "#22a866", description: "أجب عن سؤالين متتاليين إجابة صحيحة لتحصل على 3 نقاط إضافية." },
    super: { label: "التحدي الكبير", type: "super", color: "#d94a52", description: "اختر من يخوض بطاقة «حلل»: أنت أو اللاعب المتأخر." },
    duel: { label: "تحدي المنافسين", type: "duel", color: "#d94a52", description: "اختر منافسًا للإجابة عن السؤال السريع نفسه؛ الأسرع الصحيح يكسب نقطة." },
    team: { label: "خلية الفريق", type: "team", color: "#22a866", description: "اختر زميلًا؛ يحصل كل مشارك على نقاط البطاقة كاملة، ويتحرك صاحب الدور فقط." }
  };
  const shuffle = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  };
  const readJson = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.error(`Could not read ${key}.`, error);
      return fallback;
    }
  };
  const setup = readJson("madaarSetup", {});
  const solo = Number(setup.mode) === 0;
  const players = readJson("madaarPlayers", []);
  const names = solo ? [players[0] || "اللاعب 1"] : players.length ? players.slice(0, 4) : ["لاعب 1", "لاعب 2"];
  const scoreSeed = solo ? [0] : [0, 0];
  // Temporary trial requested by the project owner. Set false to restore the approved distribution.
  const allColoredTrial = false;
  const createTileSet = () => {
    const special = solo
      ? ["lamp", "multiplier", "retry", "knowledge", "speed", "bigSolo", "streak"]
      : ["lamp", "multiplier", "retry", "knowledge", "super", "duel", "team"];
    return shuffle(allColoredTrial?Array.from({length:23},(_,index)=>special[index%special.length]):[...Array(23 - special.length).fill("card"), ...special]);
  };

  function loadState() {
    const saved = readJson(stateKey, null);
    if (saved && Array.isArray(saved.names) && saved.names.length) {
      saved.names = names;
      saved.scores = names.map((_, index) => Number(saved.scores?.[index]) || 0);
      saved.progress = names.map((_, index) => Number(saved.progress?.[index]) || 0);
      saved.laps = names.map((_, index) => Number(saved.laps?.[index]) || 0);
      saved.boosts = names.map((_, index) => ({
        lamps: Number(saved.boosts?.[index]?.lamps) || 0,
        multiplier: Boolean(saved.boosts?.[index]?.multiplier),
        retry: Boolean(saved.boosts?.[index]?.retry),
        streakActive: Boolean(saved.boosts?.[index]?.streakActive),
        streak: Number(saved.boosts?.[index]?.streak) || 0
      }));
      if (!Array.isArray(saved.tiles) || saved.tiles.length !== 23) saved.tiles = createTileSet();
      if (!Array.isArray(saved.revealedTiles)) saved.revealedTiles = [];
      if (!Array.isArray(saved.history)) saved.history = [];
      saved.currentPlayer = Math.min(Number(saved.currentPlayer) || 0, names.length - 1);
      return saved;
    }
    return {
      sessionId: crypto.randomUUID(),
      names,
      scores: names.map((_, index) => Number(readJson("madaarPlayerScores", scoreSeed)[index]) || 0),
      progress: names.map(() => 0),
      laps: names.map(() => 0),
      boosts: names.map(() => ({ lamps: 0, multiplier: false, retry: false, streakActive: false, streak: 0 })),
      currentPlayer: 0,
      tiles: createTileSet(),
      revealedTiles: [],
      history: [],
      firstLapReset: false,
      knowledgeSeen: 0,
      lastMessage: "كل الخلايا مخفية. اسحب بطاقة لتبدأ رحلتك.",
      turnMessage: ""
    };
  }

  let state = loadState();
  if(allColoredTrial&&state.coloredCellTrialVersion!==1){state.tiles=createTileSet();state.coloredCellTrialVersion=1;}
  if(!allColoredTrial&&state.coloredCellTrialVersion){state.tiles=createTileSet();delete state.coloredCellTrialVersion;}
  // All players share one physical board. Changing the active player must not change it.
  state.playerTiles=state.names.map(()=>state.tiles);
  function switchPlayer(next){state.currentPlayer=next;}
  const persist = () => {
    state.playerTiles=state.names.map(()=>state.tiles);
    localStorage.setItem(stateKey, JSON.stringify(state));
    localStorage.setItem("madaarPlayerScores", JSON.stringify(state.scores));
  };
  persist();
  const getState = () => state;
  const getTile = (index) => tileCatalog[state.tiles[index]] || tileCatalog.card;
  const getPending = () => readJson(pendingKey, null);
  const prepareTurn = (turn) => { if (!state.finished && !state.pausedForSolo) localStorage.setItem(pendingKey, JSON.stringify({ ...turn, id: crypto.randomUUID() })); };

  function land(index) {
    const tile = getTile(index);
    const player = state.currentPlayer;
    let message = `${tile.label}: ${tile.description}`;
    if (tile.type === "lamp") state.boosts[player].lamps += 1;
    if (tile.type === "multiplier") state.boosts[player].multiplier = true;
    if (tile.type === "retry") state.boosts[player].retry = true;
    if (tile.type === "knowledge") {
      state.knowledgeSeen += 1;
      message = `${tile.label}: من موضوع «${setup.topic || setup.topicList || "الصيام"}» — ${state.knowledgeSeen % 2 ? "التعلّم يزداد رسوخًا حين تربط المعرفة بتطبيقها." : "السؤال الجيد بداية طريق الفهم."}`;
    }
    if (tile.type === "streak") state.boosts[player].streakActive = true;
    state.lastMessage = message;
    return { ...tile, message, player, index };
  }

  function resolveTurn(result) {
    const pending = getPending();
    if (!pending) return null;
    if (state.finished || state.pausedForSolo) { localStorage.removeItem(pendingKey); return null; }
    if (result?.serviceResult && result.turnId !== pending.id) return null;
    if (pending.processed) return null;
    const player = Math.min(Number.isInteger(pending.player) ? pending.player : state.currentPlayer, state.names.length - 1);
    const limits = { know: 1, explore: 2, analyze: 3 };
    const evaluated = result?.serviceResult;
    const maximum = limits[pending.type];
    const grade = evaluated ? result.grade : Boolean(result?.correct) ? Number(pending.points) || 0 : 0;
    if (evaluated && (!Number.isInteger(grade) || grade < 0 || grade > maximum || (pending.type !== 'analyze' && ![0,maximum].includes(grade)))) return null;
    localStorage.removeItem(pendingKey);
    state.lastLanding = null;
    state.actionPending = false;
    const correct = evaluated ? grade > 0 : Boolean(result?.correct);
    const fullCorrect = evaluated ? grade === maximum : correct;
    const boost = state.boosts[player];
    let score = correct ? evaluated ? pending.extraChallenge && !['normal','team'].includes(pending.challenge) && pending.type === 'analyze' ? fullCorrect ? 3 : 0 : grade : Number(pending.points) || 0 : 0;
    if (pending.challenge === 'speed') score = 0;
    if (correct && boost.multiplier && !pending.extraChallenge && !pending.duel) {
      score *= 2;
      boost.multiplier = false;
    }
    let message = correct ? `إجابة صحيحة: +${score} نقطة.` : "الإجابة تحتاج إلى مراجعة؛ لا نقاط أو حركة هذه المرة.";
    if (!correct && boost.retry && !pending.isRetry && !pending.duel && !pending.extraChallenge) {
      boost.retry = false;
      state.awaitingRetry = true;
      state.currentPlayer = player;
      state.lastMessage = "المحطة تمنحك محاولة ثانية مجانية. اختر بطاقة وحاول مجددًا.";
      state.turnMessage = message;
      persist();
      return { retry: true, player, message: state.lastMessage };
    }
    if (pending.isRetry) { boost.retry = false; state.awaitingRetry = false; }
    if (correct && pending.speedRun) score += 2;
    if (fullCorrect && pending.streakChallenge && boost.streakActive && !pending.extraChallenge && !pending.duel) {
      boost.streak += 1;
      if (boost.streak >= 2) {
        score += 3;
        boost.streak = 0;
        boost.streakActive = false;
        message += " اكتملت سلسلة الإتقان: +3 نقاط.";
      }
    } else if (!fullCorrect && boost.streakActive && !pending.extraChallenge && !pending.duel) {
      boost.streak = 0;
      boost.streakActive = false;
    }
    if (correct) message = message.replace(/^إجابة صحيحة: \+\d+ نقطة\./, `إجابة صحيحة: +${score} نقطة.`);
    if (correct) {
      const partner = Number.isInteger(pending.partner) ? pending.partner : -1;
      const duelWinner = Number.isInteger(pending.duelWinner) ? pending.duelWinner : -1;
      if (pending.duel && duelWinner >= 0) {
        score = pending.arena ? 2 : 1;
        message = `فاز ${state.names[duelWinner]} بالمبارزة وحصل على نقطة.`;
      }
      if (partner >= 0 && partner < state.names.length && partner !== player) {
        state.scores[player] += score;
        state.scores[partner] += score;
        message = `أجاب الفريق صحيحًا: ${state.names[player]} و${state.names[partner]} حصلا على ${score} نقطة لكل منهما.`;
      } else {
        const target = duelWinner >= 0 ? duelWinner : Number.isInteger(pending.targetPlayer) ? pending.targetPlayer : player;
        state.scores[target] += score;
        if (target !== player && !pending.duel) message = `${state.names[target]} أجاب صحيحًا وحصل على ${score} نقاط.`;
      }
      const before = state.progress[player];
      const movement = evaluated ? pending.extraChallenge && !['normal','team'].includes(pending.challenge) ? 0 : grade : Number(pending.steps) || 0;
      const after = before + movement;
      const completedLaps = Math.floor(after / 24) - Math.floor(before / 24);
      state.progress[player] = after;
      if (completedLaps > 0) {
        state.laps[player] += completedLaps;
        state.scores[player] += completedLaps * 3;
        if(state.progress.every(progress=>progress>0))state.pendingLapShuffle=true;
        message += ` مكافأة إكمال الدورة: +${completedLaps * 3} نقاط.`;
      }
      const landingIndex = after % 24 === 0 ? -1 : after % 24 - 1;
      const reachedTarget = state.scores.some(value => value >= Number(setup.targetScore || localStorage.getItem('madaarTargetScore') || 30));
      if (reachedTarget) state.finished = true;
      let landed = !reachedTarget && movement > 0 && landingIndex >= 0 ? land(landingIndex) : null;
      if (!solo && landed) {
        const participants = state.progress.map((value,index)=>value>0 && value%24===after%24 ? index : -1).filter(index=>index>=0);
        if (participants.length>1) landed = { ...landed, type:'arena', label:'حلبة المناظرة', description:'سؤال «اعرف» لجميع الواقفين على الخلية خلال 15 ثانية؛ الفائز يحصل على نقطتين.', opponent:participants.find(index=>index!==player), participants };
      }
      if (landed) {
        localStorage.setItem("madaarPendingTilePulse", JSON.stringify({
          player,
          index: landingIndex,
          progress: state.progress[player]
        }));
        if (!state.revealedTiles.includes(landingIndex)) state.revealedTiles.push(landingIndex);
        state.history.push({
          player,
          tile: landed.label,
          type: landed.type,
          message: landed.type === "card" ? "وقف على خلية عادية." : `كشف «${landed.label}».`
        });
        state.history = state.history.slice(-12);
      }
      if (landed) message += ` هبطت على ${landed.label}.`;
      state.lastMessage = landed?.message || message;
      state.turnMessage = message;
      if (landed) state.lastLanding = landed;
      const needsChoice = landed && ["speed", "bigSolo", "super", "duel", "team", "arena"].includes(landed.type);
      state.actionPending = Boolean(needsChoice);
      if (needsChoice) message += " اختر أحد الإجراءين في اللوحة الجانبية لإكمال الدور.";
    } else {
      state.lastMessage = message;
      state.turnMessage = message;
      state.boosts[player].streak = 0;
    }
    if (state.pendingLapShuffle && !state.finished && !state.actionPending) {
      let shuffled=createTileSet();
      const previous=state.tiles;
      if(shuffled.every((type,index)=>type===previous[index]))shuffled=shuffled.slice(1).concat(shuffled[0]);
      const occupied=state.progress[player]%24-1;
      if(occupied>=0){const match=shuffled.indexOf(previous[occupied]);if(match>=0)[shuffled[occupied],shuffled[match]]=[shuffled[match],shuffled[occupied]];}
      state.tiles=shuffled;
      state.playerTiles=state.names.map(()=>state.tiles);
      state.pendingLapShuffle=false;
      state.revealedTiles=[];
    }
    if (!solo && !pending.extraChallenge && !state.actionPending) switchPlayer((player + 1) % state.names.length);
    if (pending.extraChallenge && !state.actionPending) {
      if (!solo) switchPlayer((player + 1) % state.names.length);
    }
    persist();
    return { retry: false, player, correct, message, landing: state.lastLanding || null };
  }

  function consumeHint(player = state.currentPlayer) {
    if (state.finished) return false;
    if (!state.boosts[player]?.lamps) return false;
    state.boosts[player].lamps -= 1;
    persist();
    return true;
  }

  function removePlayer(index) {
    if (!Number.isInteger(index) || index < 0 || index >= state.names.length) return false;
    for (const key of ['madaarPendingTurn','madaarAnswer','madaarActiveQuestion','madaarLastResult']) localStorage.removeItem(key);
    state.names.splice(index, 1);
    state.playerTiles.splice(index,1);
    state.scores.splice(index, 1);
    state.progress.splice(index, 1);
    state.laps.splice(index, 1);
    state.boosts.splice(index, 1);
    state.actionPending=false;
    state.awaitingRetry=false;
    state.lastLanding=null;
    if (state.names.length) {
      state.currentPlayer = Math.min(state.currentPlayer > index ? state.currentPlayer - 1 : state.currentPlayer, state.names.length - 1);
      if (state.names.length < 2) {
        if(!solo)state.pausedForSolo=true;
        state.actionPending = false;
        state.lastLanding = null;
      }
      persist();
    }
    return state.names.length > 0;
  }

  function useLanding(index) {
    const tile = getTile(index);
    state.lastLanding = { ...tile, index, player: state.currentPlayer };
    state.lastMessage = tile.description;
    persist();
    return state.lastLanding;
  }

  function drawFromTile(tileIndex, type, options = {}) {
    if(state.finished||state.pausedForSolo||!['know','explore','analyze'].includes(type))return false;
    const player = state.currentPlayer;
    const boosts = state.boosts[player];
    const isRetry = Boolean(options.retry && state.awaitingRetry);
    if (options.retry && !isRetry) return false;
    const extraChallenge = Boolean(options.extraChallenge);
    prepareTurn({
      type,
      player,
      steps: extraChallenge ? 0 : type === "know" ? 1 : type === "explore" ? 2 : 3,
      points: options.duel ? 0 : extraChallenge
        ? Number.isFinite(options.challengePoints) ? options.challengePoints : 3
        : type === "know" ? 1 : type === "explore" ? 2 : 3,
      partner: Number.isInteger(options.partner) ? options.partner : -1,
      targetPlayer: Number.isInteger(options.targetPlayer) ? options.targetPlayer : player,
      duelOpponent: Number.isInteger(options.duelOpponent) ? options.duelOpponent : -1,
      participants: Array.isArray(options.participants) ? [...new Set(options.participants)].filter(index=>Number.isInteger(index)&&index>=0&&index<state.names.length) : [player, options.duelOpponent].filter(index=>Number.isInteger(index)&&index>=0&&index<state.names.length),
      duelWinner: Number.isInteger(options.duelWinner) ? options.duelWinner : -1,
      duel: Boolean(options.duel),
      speedRun: Boolean(options.speedRun),
      retry: Boolean(options.retry),
      streakChallenge: boosts.streakActive,
      isRetry,
      extraChallenge
      ,challenge: options.challenge || null,
      arena: Boolean(options.arena)
    });
    return true;
  }

  function testLanding(index){
    if(!window.MadaarCellTest||!Number.isInteger(index)||index < -1||index>22)return false;
    for(const key of ['madaarPendingTurn','madaarAnswer','madaarActiveQuestion'])localStorage.removeItem(key);
    state.progress[state.currentPlayer]=index+1;state.laps[state.currentPlayer]=0;state.finished=false;state.pausedForSolo=false;state.awaitingRetry=false;
    state.lastLanding=index<0?null:land(index);
    state.actionPending=Boolean(state.lastLanding&&['speed','bigSolo','super','duel','team','arena'].includes(state.lastLanding.type));
    persist();return true;
  }
  window.MadaarGame = { getState, getTile, getPending, prepareTurn, resolveTurn, consumeHint, removePlayer, useLanding, drawFromTile, persist, testLanding };
})();

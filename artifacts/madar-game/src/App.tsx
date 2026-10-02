import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowLeft, ArrowRight, BookOpen, CircleHelp, Clock3, Compass, Crown, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import {
  BOARD_CELLS, CARD_TYPES, PLAYER_COLORS, getCopy, getCardForTurn, createGame,
  getCurrentPlayer, evaluateAnswer, resolveTurn, useHint,
  type Audience, type GameMode, type GameSetup, type GameState, type Locale,
  type PlayerSetup, type QuestionCard, type Topic, type AnswerGrade, type CardType,
} from '@/game/engine';

const queryClient = new QueryClient();

function Home() {
  const [locale, setLocale] = useState<Locale>('ar');
  const [screen, setScreen] = useState<'intro' | 'setup' | 'game' | 'results'>('intro');
  const [audience, setAudience] = useState<Audience>('under16');
  const [topic, setTopic] = useState<Topic>('values');
  const [mode, setMode] = useState<Exclude<GameMode, 'remote'>>('local');
  const [names, setNames] = useState(['ليان', 'عمر']);
  const [target, setTarget] = useState(20);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [duration, setDuration] = useState(900);
  const [game, setGame] = useState<GameState | null>(null);
  const [answer, setAnswer] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [turnFeedback, setTurnFeedback] = useState<{ card: QuestionCard; grade: AnswerGrade; playerName: string } | null>(null);
  const [remaining, setRemaining] = useState(0);
  const isArabic = locale === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  const text = useMemo(() => ({
    introEyebrow: isArabic ? 'لعبة تعلّم جماعية' : 'A shared learning game',
    title: isArabic ? 'تعلّم يدور،\nوأثر يبقى.' : 'Learning that\nkeeps moving.',
    intro: isArabic ? 'رحلة معرفية حول مسار واحد. اسأل، فكّر، واكتشف مع كل دور.' : 'One shared path for curious minds. Ask, reflect, and discover together, one turn at a time.',
    start: isArabic ? 'ابدأ رحلتك' : 'Start your journey',
    how: isArabic ? 'كيف تلعبون؟' : 'How to play',
    guideTitle: isArabic ? 'المعرفة لا تقف عند خانة' : 'Every turn moves the learning forward',
    guideDesc: isArabic ? 'أجب عن بطاقة، تقدّم على المسار، واجمع النقاط. أول من يبلغ الهدف يفوز.' : 'Answer a card, move along the path, and earn points. The first to reach the target wins.',
    steps: isArabic ? ['اختر بطاقة', 'فكّر وأجب', 'تقدّم واجمع'] : ['Draw a card', 'Think it through', 'Move and earn'],
    stepDesc: isArabic ? ['معرفة، استكشاف، أو تحليل.', 'بعض الأسئلة لها خيارات، وبعضها مساحة للتعبير.', 'الخانات الخاصة تضيف مفاجآت للمسار.'] : ['Know, Explore, or Analyze.', 'Some questions have choices; others invite your own words.', 'Special spaces add a twist to the journey.'],
    setup: isArabic ? 'جهّزوا جلستكم' : 'Set up your table',
    setupDesc: isArabic ? 'خصصوا اللعبة للأشخاص والموضوع الذي يهمكم.' : 'Shape the game for your people and the topic that matters to them.',
    audience: isArabic ? 'لمن نلعب؟' : 'Who is playing?',
    topic: isArabic ? 'مسار الموضوع' : 'Learning topic',
    mode: isArabic ? 'طريقة اللعب' : 'Play mode',
    players: isArabic ? 'أسماء اللاعبين' : 'Player names',
    target: isArabic ? 'هدف النقاط' : 'Score target',
    timer: isArabic ? 'مؤقّت اختياري' : 'Optional session timer',
    launch: isArabic ? 'ابدأوا اللعب' : 'Begin the game',
    audienceNames: isArabic ? ['دون ١٦', 'بالغون', 'مسلمون جدد'] : ['Under 16', 'Adults', 'New Muslims'],
    topicNames: isArabic ? ['القيم والأخلاق', 'أركان الإسلام', 'السيرة النبوية', 'العبادات'] : ['Values & character', 'Pillars of Islam', 'Prophetic life', 'Worship'],
    modeNames: isArabic ? ['فردي', 'محلي — مرّروا الجهاز'] : ['Solo', 'Local — pass the device'],
    comingSoon: isArabic ? 'الموضوع المتاح حاليًا هو القيم والأخلاق.' : 'Values & character is the only topic available in this demo.',
    audienceNote: isArabic ? 'المحتوى لا يتكيّف تلقائيًا مع الفئة في هذه النسخة.' : 'Content does not adapt automatically to the selected audience yet.',
    remoteTitle: isArabic ? 'اللعب عن بُعد غير متاح' : 'Remote play is not available',
    remoteText: isArabic ? 'هذه النسخة مصممة للعب الفردي أو حول جهاز واحد. لا يوجد اتصال عن بُعد بعد.' : 'This version is for solo play or sharing one device. There is no remote connection yet.',
    tip: isArabic ? 'اللعب المحلي يعني تمرير الجهاز إلى اللاعب التالي بعد كل دور.' : 'Local play means passing the device to the next player after each turn.',
    player: isArabic ? 'لاعب' : 'Player',
    gameLabel: isArabic ? 'رحلة المعرفة' : 'The learning journey',
    yourTurn: isArabic ? 'الدور الآن' : 'UP NOW',
    targetReached: isArabic ? 'أول من يبلغ الهدف يفوز' : 'Reach the target to win',
    hints: isArabic ? 'تلميحات' : 'Hints',
    useHint: isArabic ? 'استخدم تلميحًا' : 'Use a hint',
    noHint: isArabic ? 'لا توجد تلميحات متاحة' : 'No hints available',
    submit: isArabic ? 'أرسل الإجابة' : 'Submit answer',
    next: isArabic ? 'متابعة الدور' : 'Continue',
    correct: isArabic ? 'إجابة موفّقة' : 'Well answered',
    partial: isArabic ? 'بداية جيدة' : 'A thoughtful start',
    incorrect: isArabic ? 'فرصة للتعلّم' : 'A chance to learn',
    winner: isArabic ? 'أحسنتم يا أهل المدار' : 'A brilliant journey',
    wins: isArabic ? 'هو الفائز في هذه الجولة' : 'wins this round',
    playAgain: isArabic ? 'جولة جديدة' : 'Play another round',
    backSetup: isArabic ? 'تعديل الإعدادات' : 'Edit setup',
    back: isArabic ? 'العودة' : 'Back',
    score: isArabic ? 'النقاط' : 'points',
    session: isArabic ? 'الجلسة' : 'Session',
    timerDone: isArabic ? 'انتهى المؤقّت — يمكنكم مواصلة اللعب' : 'Timer ended — you can keep playing',
  }), [isArabic]);

  useEffect(() => {
    if (screen !== 'game' || !game || !game.setup.durationSeconds || game.winnerId || remaining <= 0) return;
    const interval = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [screen, game, remaining]);

  const begin = () => {
    const activeNames = mode === 'solo' ? names.slice(0, 1) : names;
    const players: PlayerSetup[] = activeNames.map((name, index) => ({
      id: `player-${index + 1}`,
      name: name.trim() || `${text.player} ${index + 1}`,
      color: PLAYER_COLORS[index],
    }));
    const setup: GameSetup = { locale, audience, topic, mode, scoreLimit: target, durationSeconds: timerEnabled ? duration : 0, players };
    const nextGame = createGame(setup);
    setGame(nextGame);
    setRemaining(timerEnabled ? duration : 0);
    setAnswer('');
    setHintVisible(false);
    setTurnFeedback(null);
    setScreen('game');
  };

  const restart = () => {
    setGame(null); setTurnFeedback(null); setScreen('setup');
  };

  const activeCard = game ? getCardForTurn(CARD_TYPES[game.turnCount % CARD_TYPES.length], game.turnCount) : null;
  const displayedCard = turnFeedback?.card ?? activeCard;
  const displayedPlayer = game
    ? turnFeedback && game.lastTurn
      ? game.players.find((player) => player.id === game.lastTurn?.playerId) ?? getCurrentPlayer(game)
      : getCurrentPlayer(game)
    : null;
  const displayedTurn = game ? (turnFeedback ? game.turnCount : game.turnCount + 1) : 0;
  const submitAnswer = () => {
    if (!game || !activeCard || turnFeedback || game.winnerId) return;
    const grade = evaluateAnswer(activeCard, answer, locale);
    const playerName = getCurrentPlayer(game).name;
    const nextGame = resolveTurn(game, activeCard, grade);
    setGame(nextGame);
    setTurnFeedback({ card: activeCard, grade, playerName });
    setAnswer('');
    setHintVisible(false);
    if (nextGame.winnerId) setScreen('results');
  };
  const revealHint = () => {
    if (!game || !activeCard || getCurrentPlayer(game).hints < 1) return;
    setGame(useHint(game));
    setHintVisible(true);
  };
  const continueGame = () => { setTurnFeedback(null); setAnswer(''); };
  const updateName = (index: number, value: string) => setNames((current) => current.map((name, i) => i === index ? value : name));
  const addPlayer = () => { if (names.length < 6) setNames((current) => [...current, '']); };
  const removePlayer = (index: number) => setNames((current) => current.filter((_, i) => i !== index));
  const localeText = (value: { ar: string; en: string }) => value[locale];
  const minuteClock = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className="app-shell" dir={direction} lang={locale}>
      <header className="topbar">
        <div className="brand" aria-label="مدار">
          <img src="/brand/madar-mark.png" className="official-mark" alt="" />
          <span>مَدار</span>
        </div>
        <button className="language" onClick={() => setLocale(isArabic ? 'en' : 'ar')} data-testid="button-toggle-language" aria-label={isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}>
          {isArabic ? 'English' : 'العربية'}
        </button>
      </header>

      {screen === 'intro' && <main className="page-wrap fade-in">
        <section className="intro">
          <div className="intro-copy">
            <div className="eyebrow">{text.introEyebrow} · مَدار</div>
            <h1>{text.title.split('\n').map((line, index) => <span key={line}>{index > 0 && <><br /><span>{line}</span></>}{index === 0 && line}</span>)}</h1>
            <p>{text.intro}</p>
            <div className="intro-actions">
              <button className="intro-action" onClick={() => setScreen('setup')} data-testid="button-start-journey">{text.start} {isArabic ? <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginInlineStart: 8 }} /> : <ArrowRight size={16} style={{ verticalAlign: 'middle', marginInlineStart: 8 }} />}</button>
              <a className="intro-secondary" href="#guide-heading" data-testid="link-how-to-play">{text.how}</a>
            </div>
          </div>
          <div className="intro-orbit" aria-hidden="true"><div className="orbit-core"><Sparkles size={26} /></div></div>
          <img src="/brand/falk-assistant.png" className="falk-hero" alt="" />
        </section>
        <section className="guide-grid" aria-labelledby="guide-heading">
          <div className="guide-panel">
            <div className="eyebrow">{text.how}</div><h2 id="guide-heading">{text.guideTitle}</h2><p style={{ margin: '0', color: '#746e83', lineHeight: 1.65, fontSize: 14 }}>{text.guideDesc}</p>
            <div className="steps">{text.steps.map((step, index) => <div className="step" key={step}><b>0{index + 1} / 03</b><strong>{step}</strong><span>{text.stepDesc[index]}</span></div>)}</div>
          </div>
          <div className="guide-panel">
            <div className="eyebrow">{isArabic ? 'ثلاثة أنواع من البطاقات' : 'Three ways to learn'}</div>
            <h2>{isArabic ? 'من الإجابة إلى التأمّل' : 'From recall to reflection'}</h2>
            <div className="card-type-row">
              <span className="pill"><BookOpen size={14} />{isArabic ? 'اعرف' : 'Know'}</span>
              <span className="pill explore"><Compass size={14} />{isArabic ? 'استكشف' : 'Explore'}</span>
              <span className="pill analyze"><Sparkles size={14} />{isArabic ? 'حلّل' : 'Analyze'}</span>
            </div>
            <p style={{ color: '#746e83', lineHeight: 1.7, fontSize: 14, marginBottom: 0 }}>{isArabic ? 'المحتوى مختار ومصادره ظاهرة. تقييم «حلّل» إرشادي محلي، وليس ذكاءً اصطناعيًا.' : 'Content is curated with visible sources. Analyze uses a simple local rubric, not AI.'}</p>
          </div>
        </section>
      </main>}

      {screen === 'setup' && <main className="page-wrap fade-in">
        <div className="section-heading"><div><div className="eyebrow">{isArabic ? 'قبل الانطلاق' : 'Before you set off'}</div><h1 className="section-title" style={{ fontSize: 38 }}>{text.setup}</h1><p>{text.setupDesc}</p></div><button className="subtle-btn" onClick={() => setScreen('intro')} data-testid="button-back-intro">{text.back}</button></div>
        <SetupForm
          isArabic={isArabic} audience={audience} setAudience={setAudience} topic={topic} setTopic={setTopic} mode={mode} setMode={setMode}
          names={names} updateName={updateName} addPlayer={addPlayer} removePlayer={removePlayer} target={target} setTarget={setTarget}
          timerEnabled={timerEnabled} setTimerEnabled={setTimerEnabled} duration={duration} setDuration={setDuration}
          text={text} begin={begin}
        />
      </main>}

      {screen === 'game' && game && activeCard && displayedCard && displayedPlayer && <main className="page-wrap game-page fade-in">
        <div className="game-top">
          <div><div className="eyebrow">{text.gameLabel} · {game.setup.topic === 'values' ? text.topicNames[0] : text.topicNames[['pillars','prophetic','worship'].indexOf(game.setup.topic)+1]}</div><h1>{isArabic ? 'كل دور خطوة جديدة' : 'One turn. One more step.'}</h1><p>{text.targetReached} · {isArabic ? `الهدف ${game.setup.scoreLimit} نقطة` : `${game.setup.scoreLimit}-point target`}</p></div>
          <div className="game-actions">
            {game.setup.durationSeconds > 0 && <span className="meta-chip" style={{ background: remaining ? '#e8e1f9' : '#eee3d6', color: '#50486b', padding: '10px 12px' }} data-testid="status-session-timer"><Clock3 size={14} style={{ verticalAlign: 'middle', marginInlineEnd: 6 }} />{remaining ? minuteClock(remaining) : text.timerDone}</span>}
            <button className="subtle-btn" onClick={restart} data-testid="button-end-game">{text.backSetup}</button>
          </div>
        </div>
        <div className="game-layout">
          <Board game={game} locale={locale} turnNumber={displayedTurn} />
          <div className="game-side">
            <section className="turn-card">
              <div className="turn-head">
                <div className="active-player"><span className="active-avatar" style={{ background: displayedPlayer.color }}>{displayedPlayer.name.slice(0, 1)}</span><span>{displayedPlayer.name}</span></div>
                <span className="turn-index">{text.yourTurn} · {displayedTurn}</span>
              </div>
              <div className={`pill ${displayedCard.kind}`} style={{ marginBottom: 14 }}>
                {displayedCard.kind === 'know' ? <BookOpen size={14} /> : displayedCard.kind === 'explore' ? <Compass size={14} /> : <Sparkles size={14} />}
                {cardLabel(displayedCard.kind, isArabic)}
              </div>
              <h2 className="card-prompt" data-testid="text-question-prompt">{localeText(displayedCard.prompt)}</h2>
              {!turnFeedback && (displayedCard.options ? <div className="answer-options">{displayedCard.options.map((option, index) => <button type="button" className={`answer-option ${answer === String(index) ? 'selected' : ''}`} onClick={() => setAnswer(String(index))} key={`${displayedCard.id}-option-${index}`} data-testid={`option-answer-${index}`}><span className="option-key">{String.fromCharCode(65 + index)}</span>{localeText(option)}</button>)}</div> : <textarea className="text-input answer-textarea" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={isArabic ? 'اكتب إجابتك هنا…' : 'Write your answer here…'} data-testid="input-answer" />)}
              {!turnFeedback && <div className="hint-row">
                <button className="hint-button" onClick={revealHint} disabled={getCurrentPlayer(game).hints < 1} data-testid="button-use-hint"><Lightbulb size={15} />{text.useHint} <span>({getCurrentPlayer(game).hints})</span></button>
                {getCurrentPlayer(game).hints === 0 && <span>{text.noHint}</span>}
              </div>}
              {hintVisible && <div className="hint-copy" data-testid="text-hint">{localeText(displayedCard.hint)}</div>}
              {!turnFeedback && <button className="primary-btn" onClick={submitAnswer} disabled={!answer.trim()} style={{ width: '100%' }} data-testid="button-submit-answer">{text.submit} <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginInlineStart: 6 }} /></button>}
              {turnFeedback && <Feedback feedback={turnFeedback} game={game} locale={locale} text={text} continueGame={continueGame} />}
            </section>
            <Leaderboard game={game} locale={locale} text={text} />
          </div>
        </div>
      </main>}

      {screen === 'results' && game && <main className="page-wrap result-screen fade-in">
        <section className="result-card">
          <div className="winner-badge"><Crown size={33} /></div>
          <div className="eyebrow" style={{ color: '#aaa0cc', position: 'relative' }}>{text.winner}</div>
          <h1>{game.players.find((player) => player.id === game.winnerId)?.name}</h1>
          <p>{text.wins}</p>
          <div className="result-score">{game.players.find((player) => player.id === game.winnerId)?.score} <span style={{ fontSize: 16 }}>{text.score}</span></div>
          <div className="final-rankings">{[...game.players].sort((a, b) => b.score - a.score).map((player, index) => <div className="final-row" key={player.id} data-testid={`result-player-${player.id}`}><span>{index + 1}. {player.name}</span><strong>{player.score} / {game.setup.scoreLimit}</strong></div>)}</div>
          <div className="results-actions"><button className="primary-btn" onClick={restart} data-testid="button-play-again"><RotateCcw size={15} style={{ verticalAlign: 'middle', marginInlineEnd: 6 }} />{text.playAgain}</button><button className="secondary-light" onClick={() => setScreen('intro')} data-testid="button-results-home">{isArabic ? 'الصفحة الرئيسية' : 'Home'}</button></div>
          {turnFeedback && <div style={{ position: 'relative', marginTop: 22, color: '#d7d0e4', fontSize: 12 }}>{localeText(turnFeedback.card.source)}</div>}
        </section>
      </main>}
    </div>
  );
}

function SetupForm(props: {
  isArabic: boolean; audience: Audience; setAudience: (value: Audience) => void; topic: Topic; setTopic: (value: Topic) => void;
  mode: Exclude<GameMode, 'remote'>; setMode: (value: Exclude<GameMode, 'remote'>) => void;
  names: string[]; updateName: (index: number, value: string) => void; addPlayer: () => void; removePlayer: (index: number) => void;
  target: number; setTarget: (value: number) => void; timerEnabled: boolean; setTimerEnabled: (value: boolean) => void;
  duration: number; setDuration: (value: number) => void; text: Record<string, any>; begin: () => void;
}) {
  const { isArabic, audience, setAudience, topic, setTopic, mode, setMode, names, updateName, addPlayer, removePlayer, target, setTarget, timerEnabled, setTimerEnabled, duration, setDuration, text, begin } = props;
  const ar = isArabic;
  const audienceOptions: [Audience, string][] = [['under16', text.audienceNames[0]], ['adult', text.audienceNames[1]], ['newMuslim', text.audienceNames[2]]];
  const topics: [Topic, string, boolean][] = [['values', text.topicNames[0], true], ['pillars', text.topicNames[1], false], ['prophetic', text.topicNames[2], false], ['worship', text.topicNames[3], false]];
  return <div className="setup-card">
    <div className="form-block"><span className="field-label">{text.audience}</span><div className="choice-row">{audienceOptions.map(([value, label]) => <button className={`choice ${audience === value ? 'selected' : ''}`} onClick={() => setAudience(value)} key={value} data-testid={`choice-audience-${value}`}>{label}</button>)}</div><span className="setup-note">{text.audienceNote}</span></div>
    <div className="form-block"><span className="field-label">{text.topic}</span><div className="choice-row">{topics.map(([value, label, available]) => <button className={`choice ${topic === value ? 'selected' : ''}`} onClick={() => available && setTopic(value)} disabled={!available} title={!available ? text.comingSoon : undefined} key={value} data-testid={`choice-topic-${value}`}>{label}{!available ? ' · …' : ''}</button>)}</div><span className="setup-note">{text.comingSoon}</span></div>
    <div className="form-block"><span className="field-label">{text.mode}</span><div className="choice-row">
      <button className={`choice ${mode === 'solo' ? 'selected' : ''}`} onClick={() => setMode('solo')} data-testid="choice-mode-solo">{ar ? 'فردي' : 'Solo'}</button>
      <button className={`choice ${mode === 'local' ? 'selected' : ''}`} onClick={() => setMode('local')} data-testid="choice-mode-local">{ar ? 'محلي — مرّروا الجهاز' : 'Local — pass the device'}</button>
    </div>
    <div className="remote-note"><strong>{text.remoteTitle}</strong>{text.remoteText}</div>
    </div>
    <div className="form-block"><span className="field-label">{text.players}</span><div className="player-fields">{names.slice(0, mode === 'solo' ? 1 : 6).map((name, index) => <div className="player-input-row" key={`name-${index}`}><span className="color-dot" style={{ background: PLAYER_COLORS[index] }} /><input className="text-input" value={name} onChange={(event) => updateName(index, event.target.value)} aria-label={`${text.player} ${index + 1}`} data-testid={`input-player-name-${index + 1}`} />{mode === 'local' && names.length > 2 && <button className="remove-player" onClick={() => removePlayer(index)} aria-label="Remove player" data-testid={`button-remove-player-${index + 1}`}>×</button>}</div>)}
      {mode === 'local' && names.length < 6 && <button className="add-player" onClick={addPlayer} data-testid="button-add-player">+ {ar ? 'إضافة لاعب' : 'Add a player'}</button>}
    </div></div>
    <div className="form-block"><label className="field-label" htmlFor="score-target">{text.target}</label><div className="slider-line"><select id="score-target" className="select-input" value={target} onChange={(event) => setTarget(Number(event.target.value))} data-testid="input-score-target"><option value={20}>20 {ar ? 'نقطة' : 'points'}</option><option value={30}>30 {ar ? 'نقطة' : 'points'}</option><option value={50}>50 {ar ? 'نقطة' : 'points'}</option></select></div><span className="setup-note">{ar ? 'لا تنتهي الجولة عند إكمال لفة؛ الهدف وحده ينهيها.' : 'A lap never ends the game; reaching the target does.'}</span></div>
    <div className="form-block"><span className="field-label">{text.timer}</span><label className="timer-toggle"><input type="checkbox" checked={timerEnabled} onChange={(event) => setTimerEnabled(event.target.checked)} data-testid="input-timer-toggle" />{ar ? 'إظهار مؤقّت للجلسة' : 'Show a session timer'}</label>{timerEnabled && <select className="select-input" value={duration} onChange={(event) => setDuration(Number(event.target.value))} data-testid="select-timer-duration"><option value={600}>{ar ? '١٠ دقائق' : '10 minutes'}</option><option value={900}>{ar ? '١٥ دقيقة' : '15 minutes'}</option><option value={1800}>{ar ? '٣٠ دقيقة' : '30 minutes'}</option></select>}<span className="setup-note">{ar ? 'المؤقّت لا ينهي اللعبة؛ أكملوا حتى يبلغ أحدكم الهدف.' : 'The timer does not end the game. Play on until someone reaches the target.'}</span></div>
    <div className="setup-footer"><div className="setup-note"><CircleHelp size={14} style={{ verticalAlign: 'middle', marginInlineEnd: 5 }} />{text.tip}</div><button className="primary-btn" onClick={begin} data-testid="button-begin-game">{text.launch} {ar ? <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginInlineStart: 5 }} /> : <ArrowRight size={16} style={{ verticalAlign: 'middle', marginInlineStart: 5 }} />}</button></div>
  </div>;
}

function Board({ game, locale, turnNumber }: { game: GameState; locale: Locale; turnNumber: number }) {
  const textLocale = locale;
  return <div className="board-wrap" aria-label={locale === 'ar' ? 'مسار اللعبة ذو عشرين خانة' : '20-cell game board'} data-testid="game-board">
    <div className="board">{BOARD_CELLS.map((cell) => <div className="cell" key={cell.index} style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }} data-kind={cell.kind} data-testid={`board-cell-${cell.index}`} title={`${getCopy(cell.title, textLocale)} — ${getCopy(cell.detail, textLocale)}`}>
      <span className="cell-no">{String(cell.index + 1).padStart(2, '0')}</span><span className="kind-label">{cell.kind === 'ordinary' ? (locale === 'ar' ? 'مسار' : 'PATH') : getCopy(cell.title, textLocale)}</span>
      <div className="cell-marker">{game.players.filter((player) => player.position === cell.index).map((player) => <span className="token" key={player.id} style={{ background: player.color }} title={player.name} />)}</div>
    </div>)}
      <div className="center-panel"><img src="/brand/madar-mark.png" className="board-mark" alt="" /><strong>مَدار</strong><span>{locale === 'ar' ? 'عشرون محطة، ورحلة لا تنتهي عند دورة كاملة.' : 'Twenty spaces. A journey that keeps going beyond one lap.'}</span><span>{locale === 'ar' ? `الدور ${turnNumber}` : `TURN ${turnNumber}`}</span></div>
    </div>
  </div>;
}

function Leaderboard({ game, locale, text }: { game: GameState; locale: Locale; text: Record<string, any> }) {
  return <section className="leaderboard" data-testid="game-leaderboard">
    <div className="leader-head"><strong>{locale === 'ar' ? 'لوحة الترتيب' : 'Scoreboard'}</strong><span className="target-note">{locale === 'ar' ? `الهدف ${game.setup.scoreLimit}` : `Target ${game.setup.scoreLimit}`}</span></div>
    {[...game.players].sort((a, b) => b.score - a.score).map((player, index) => <div className="leader-row" key={player.id} data-testid={`score-row-${player.id}`}>
      <span className="rank">{String(index + 1).padStart(2, '0')}</span><span className="leader-name"><span className="color-dot" style={{ background: player.color }} />{player.name}</span><span className="leader-score" data-testid={`score-value-${player.id}`}>{player.score}<small> / {game.setup.scoreLimit}</small></span><div className="progress-track"><div className="progress-fill" style={{ transform: `scaleX(${Math.min(1, player.score / game.setup.scoreLimit)})` }} /></div>
    </div>)}
    <div className="turn-meta"><span className="meta-chip">{locale === 'ar' ? 'الدور' : 'Turns'} · {game.turnCount}</span><span className="meta-chip">{locale === 'ar' ? 'الأثر' : 'Impact'} · {game.players.reduce((sum, player) => sum + player.impact, 0)}</span></div>
  </section>;
}

function Feedback({ feedback, game, locale, text, continueGame }: { feedback: { card: QuestionCard; grade: AnswerGrade; playerName: string }; game: GameState; locale: Locale; text: Record<string, any>; continueGame: () => void }) {
  const labels: Record<AnswerGrade, string> = { correct: text.correct, partial: text.partial, incorrect: text.incorrect };
  const awarded = game.lastTurn?.points ?? 0;
  return <div className={`feedback-card ${feedback.grade}`} data-testid="answer-feedback">
    <div className="feedback-title">{labels[feedback.grade]} · {feedback.playerName}{awarded > 0 ? ` · +${awarded}` : ''}</div>
    <div className="feedback-copy">{getCopy(feedback.card.explanation, locale)}</div>
    <div className="feedback-source" data-testid="text-answer-source">{getCopy(feedback.card.source, locale)}</div>
    {game.lastTurn?.effect && <div className="feedback-copy" style={{ marginTop: 9 }}>{getCopy(game.lastTurn.effect, locale)}</div>}
    <button className="primary-btn" onClick={continueGame} style={{ width: '100%', marginTop: 15 }} data-testid="button-continue-turn">{text.next} <ArrowLeft size={15} style={{ verticalAlign: 'middle', marginInlineStart: 6 }} /></button>
  </div>;
}

function cardLabel(kind: CardType, arabic: boolean) {
  if (kind === 'know') return arabic ? 'اعرف' : 'Know';
  if (kind === 'explore') return arabic ? 'استكشف' : 'Explore';
  return arabic ? 'حلّل' : 'Analyze';
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

(() => {
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const api = window.MadaarAI;
  const queryParams=()=>window.MadaarPlay?.query||new URLSearchParams(location.search);
  const navigate=target=>window.MadaarPlay?window.MadaarPlay.open(target):location.assign(target);
  const store = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const make = (tag, text, className) => { const element = document.createElement(tag); if (text) element.textContent = text; if (className) element.className = className; return element; };
  function reviewExplanation(text) {
    const seen = new Set();
    return String(text || '').split(/\r?\n/).filter(line => {
      const key = line.trim().replace(/\s+/g, ' ');
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).join('\n');
  }
  function appendEvidence(parent, evidence, fallback) {
    if(evidence?.text)parent.append(make('blockquote',evidence.text,'answer-evidence'));
    const source=evidence?.source||fallback;
    if(source?.label)parent.append(make('p',source.label,'simplify-source'));
    if(source?.url && /^https?:\/\//i.test(source.url)){
      const link=make('a','فتح المصدر');link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';parent.append(link);
    }
  }
  function status(parent) { const element = make('p', api.getConfig().provider === 'english-practice' ? 'English practice simulation · prepared questions, not live AI' : api.getConfig().mode === 'mock' ? 'أسئلة جاهزة للتجربة' : api.getConfig().provider==='supplied-curated-package'?'محتوى الحزمة المرفقة':'خدمة AI'); element.className = 'ai-service-status'; parent.append(element); return element; }
  function errorBox(parent, error, retry) { const box = make('div', '', 'ai-service-error'); box.setAttribute('role','alert'); box.append(make('p',error.message)); const button=make('button','إعادة المحاولة'); button.type='button'; button.onclick=()=>{box.remove();retry();}; box.append(button); parent.append(box); }
  function saveResult(question, result, options = {}) {
    const game = window.MadaarGame;
    const live=read('madaarGameState',{});
    if(live.finished || live.pausedForSolo || live.sessionId !== game.getState().sessionId)return false;
    if(!game.drawFromTile(-1, question.type, { ...options, challenge: queryParams().get("challenge") }))return false;
    const pending=game.getPending();
    const answer={ ...result, correct: result.grade > 0, fullCorrect: result.grade === {know:1,explore:2,analyze:3}[question.type], points: result.grade, steps: result.steps, type: question.type, questionId: question.id, turnId: pending?.id, speedRun: Boolean(options.speedRun), duelWinner: options.duelWinner ?? -1, serviceResult:true };
    const outcome=game.resolveTurn(answer);if(!outcome)return false;
    store('madaarAnswer',answer);
    store('madaarTurnReview',{sessionId:game.getState().sessionId,questionId:question.id,player:outcome.player,landing:outcome.landing||null,retry:outcome.retry,finished:!!game.getState().finished});
    store('madaarTurnView',{sessionId:game.getState().sessionId,phase:'review'});
    window.MadaarBoard?.refresh({deferEnd:true,keepPanel:true,reviewPlayer:outcome.player});
    return true;
  }
  async function mountCard(main) {
    if(window.MadaarGame?.getState().pausedForSolo){navigate('Board.html');return;}
    const section=main.querySelector('.screen-card-panel > section');
    if(!section) return;
    const banner=section.firstElementChild;
    const title=banner.querySelector('span');
    const type=window.MadaarPlay?.cardType||(document.title.includes('حلل')?'analyze':document.title.includes('استكشف')?'explore':'know');
    document.body.dataset.cardType=type;
    const maxBadge=banner.querySelector(':scope>span:last-child');if(maxBadge)maxBadge.textContent=`حتى ${{know:1,explore:2,analyze:3}[type]} نقاط`;
    const topicLabel=banner.querySelector('div>span:nth-child(2)');if(topicLabel)topicLabel.textContent=`${api.context().topic||'رحلتك'} · ${api.getConfig().mode==='mock'?'تجربة':'سؤال'}`;
    const timer=make('span','تحميل السؤال…','card-timer'); timer.dataset.countdown='true'; banner.append(timer);
    const player=api.context().currentPlayerIndex??window.MadaarGame.getState().currentPlayer;
    const colors=read('madaarPlayerColors',[]),color=colors[player]||['#8b5cf6','#f59e0b','#22c55e','#387db1'][player];
    const turn=make('div',window.MadaarGame.getState().names[player],'card-player-turn');turn.style.setProperty('--player-color',color);banner.append(turn);section.style.setProperty('--player-color',color);banner.style.flexWrap='wrap';
    const content=section.children[1]; content.replaceChildren();
    const query=queryParams(), game=window.MadaarGame;
    if(game.getState().awaitingRetry){const current=read('madaarActiveQuestion',null);if(current&&current.type!==type){navigate({know:'CardKnow.html',explore:'CardExplore.html',analyze:'CardAnalyze.html'}[current.type]+'?retry=1');return;}query.set('retry','1');}
    let question, choice=-1, busy=false, finished=false, expired=false, interval, deadline;
    window.MadaarAIUI.cancelCard=()=>{finished=true;clearInterval(interval);};
    let textarea, controls, answers, hint, prompt;
    const timeLimit=query.has('speedrun')||query.has('duel')?15:{know:25,explore:40,analyze:90}[type];
    const challenge=query.get('challenge');
    const options={extraChallenge:Boolean(challenge),challengePoints:challenge==='speed'?0:challenge==='normal'||challenge==='team'?{know:1,explore:2,analyze:3}[type]:3,retry:query.has('retry'),speedRun:query.has('speedrun'),partner:query.has('teamup')?Number(query.get('teamup')):-1,targetPlayer:query.has('target')?Number(query.get('target')):game.getState().currentPlayer,duel:query.has('duel'),duelOpponent:query.has('duel')?Number(query.get('duel')):-1,arena:query.has('arena')};
    function finish(result, duelWinner) {
      if(finished)return;finished=true;clearInterval(interval);
      if(!saveResult(question,result,duelWinner===undefined?options:{...options,duelWinner})){content.replaceChildren(make('p','انتهت هذه الجلسة؛ لن تُحتسب نتيجة متأخرة.'));return;}
      window.MadaarAudio?.play(result.grade>0?'success':'error');
      window.MadaarFalak?.setState(result.grade>0?'success':'error',1000);
      navigate(result.grade==={know:1,explore:2,analyze:3}[type]?'FeedbackCorrect.html':'FeedbackPartial.html');
    }
    async function evaluate(text, selectedChoice) {
      return api.evaluateAnswer({ ...api.context(), question, text, choice:selectedChoice, requestId:`${question.id}-${options.targetPlayer}` });
    }
    function startTimer() {
      deadline=Date.now()+timeLimit*1000;
      timer.textContent=`${Math.floor(timeLimit/60)}:${String(timeLimit%60).padStart(2,'0')}`;
      interval=setInterval(()=>{
        if(finished||busy)return;
        const left=Math.max(0,Math.ceil((deadline-Date.now())/1000)); timer.textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;
        if(!left){expired=true;busy=true;clearInterval(interval);timer.classList.add('timer-expired');
          api.evaluateAnswer({...api.context(),question,timedOut:true,choice:-1,text:''}).then(result=>finish(result,-1)).catch(error=>{
            errorBox(content,error,()=>{expired=false;busy=false;startTimer();});
          });}
      },200);
    }
    async function load() {
      content.replaceChildren(make('p','فَلَك يجهّز السؤال…'));timer.textContent='تحميل السؤال…';
      try {
        const current=read('madaarActiveQuestion',null);
        question=options.retry&&current?.type===type?current:await api.generateQuestion({...api.context(),type,requestId:crypto.randomUUID()});
        if(finished)return;
        if(question.unavailable){localStorage.removeItem('madaarRejectedTopic');store('madaarTopicSuggestions',question.suggestions||[]);location.href='TopicUnavailable.html';return;}
        store('madaarActiveQuestion',question);
        content.replaceChildren();prompt=make('h1',question.text,'game-question-text');prompt.dataset.fontBase='16';prompt.style.setProperty('--base-font','16px');content.append(prompt);status(content);
        if(type==='analyze') { textarea=make('textarea');textarea.placeholder='اكتب إجابتك في جملة أو جملتين';textarea.setAttribute('aria-label','إجابتك');content.append(textarea); }
        else { answers=make('div','','ai-answer-options'); question.options.forEach((text,index)=>{const button=make('button',text,'ai-answer');button.type='button';button.setAttribute('aria-pressed','false');button.onclick=()=>{choice=index;[...answers.children].forEach((el,i)=>el.setAttribute('aria-pressed',String(i===index)));};answers.append(button);});content.append(answers); }
        hint=make('button','تلميح · مصباح واحد','ai-hint');hint.type='button';hint.disabled=!game.getState().boosts[game.getState().currentPlayer].lamps;content.append(hint);
        hint.onclick=async()=>{hint.disabled=true;const savedHint=read(`madaarHint-${question.id}`,null);try{const result=savedHint||await api.getHint({...api.context(),question});if(!savedHint&&!game.consumeHint())throw Error('لا توجد مصابيح متاحة.');store(`madaarHint-${question.id}`,result);window.MadaarBoard?.updateEffects();content.insertBefore(make('p',result.text,'ai-hint-text'),hint);hint.textContent='تم عرض التلميح';}catch(error){errorBox(content,error,()=>{hint.disabled=false;hint.click();});hint.disabled=false;}};
        controls=make('div','','ai-card-actions');const submit=make('button','تأكيد الإجابة','ai-submit');submit.type='button';controls.append(submit);content.append(controls);
        const dueling=query.has('duel');
        if(dueling) {
          answers?.remove();controls.remove();hint.remove();
          const fighters=options.arena ? game.getState().lastLanding?.participants || [game.getState().currentPlayer,options.duelOpponent] : [game.getState().currentPlayer,options.duelOpponent];
          options.participants=fighters;
          content.append(make('p','محاكاة على جهاز واحد: السؤال نفسه لجميع المشاركين، وأول إجابة نهائية تحسم الجولة.'));
          const arena=make('div','','ai-duel-options');
          fighters.forEach(player=>{const group=make('section');group.append(make('h2',game.getState().names[player]));question.options.forEach((text,index)=>{const button=make('button',text,'ai-answer');button.onclick=async()=>{if(busy||finished)return;busy=true;try{const result=await evaluate('',index);finish(result,result.grade>0?player:-1);}catch(error){busy=false;deadline=Date.now()+timeLimit*1000;errorBox(content,error,()=>button.click());}};group.append(button);});arena.append(group);});content.append(arena);
        }
        submit.onclick=async()=>{
          if(busy||finished||expired)return;
          if(type!=='analyze'&&choice<0){let notice=content.querySelector('[role="alert"]');if(!notice){notice=make('p','اختر إجابة للمتابعة.');notice.setAttribute('role','alert');content.append(notice);}return;}
          busy=true;submit.disabled=true;const remaining=deadline-Date.now();timer.textContent='جاري التقييم…';
          try{const result=await evaluate(textarea?.value||'',choice);finish(result);}catch(error){busy=false;submit.disabled=false;deadline=Date.now()+Math.max(remaining,1000);errorBox(content,error,()=>submit.click());}
        };
        startTimer();
      } catch(error){content.replaceChildren();errorBox(content,error,load);status(content);}
    }
    await load();window.addEventListener('pagehide',()=>clearInterval(interval));
  }
  async function mountChecking(main) {
    const parent=main.querySelector('section')||main;
    const question=read('madaarActiveQuestion',null),answer=read('madaarAnswer',{});
    if(!question)return;
    try{const result=await api.evaluateAnswer({...api.context(),question,text:answer.text||'',requestId:question.id});saveResult(question,result);location.replace(result.grade===3?'FeedbackCorrect.html':'FeedbackPartial.html');}catch(error){errorBox(parent,error,()=>mountChecking(main));}
  }
  async function mountFeedback(targetPanel) {
    const question=read('madaarActiveQuestion',null),answer=read('madaarAnswer',{});
    if(!question||!answer.serviceResult)return;
    const panel=targetPanel||document.querySelector('.screen-card-panel');if(!panel)return;
    panel.replaceChildren();panel.classList.add('feedback-clean','turn-review');
    const header=make('div','','feedback-summary');const falak=make('img');falak.src=answer.grade>0?'images/falak_correct.png':'images/falak_thinking.png';falak.alt='فلك';
    header.append(falak,make('h1',answer.grade===0?'إجابة خاطئة':answer.fullCorrect?'إجابة صحيحة!':'إجابة جزئية'),make('p','اضغط «التالي» لمتابعة دورك.','review-caption'));
    const actions=make('div','','ai-card-actions');
    const next=make('button','التالي','ai-submit review-next');next.type='button';next.onclick=()=>window.MadaarPlay?window.MadaarPlay.afterReview():navigate('Board.html');
    const simplify=Object.assign(make('a','بسّط لي','simplify-button'),{href:'Simplify.html'});simplify.title='اشرح لي الإجابة';
    const miniFalak=make('img');miniFalak.src='images/falak-bot.svg';miniFalak.alt='';simplify.prepend(miniFalak);
    const explanation=make('section','','feedback-explanation answer-simplification');
    explanation.append(make('h2','مراجعة الإجابة'),make('p',reviewExplanation(answer.explanation)));
    if(!answer.fullCorrect && answer.correctAnswer){explanation.append(make('h2',question.type==='analyze'?'عناصر الإجابة المكتملة':'الإجابة الصحيحة'),make('p',answer.correctAnswer,'correct-answer-text'));}
    explanation.append(make('h2','الدليل'));
    appendEvidence(explanation,answer.evidence||question.evidence,answer.source||question.source);
    actions.append(next,simplify);panel.append(header,explanation,actions);
  }
  async function mountSimplify(targetPanel) {
    const question=read('madaarActiveQuestion',null),answer=read('madaarAnswer',{});if(!question||!answer.serviceResult||answer.questionId!==question.id)return;
    const panel=targetPanel||document.querySelector('.screen-card-panel');if(!panel)return;
    panel.replaceChildren();panel.classList.remove('turn-review');panel.classList.add('feedback-clean');
    const section=make('section','','answer-simplification'),heading=make('h2','شرح الإجابة'),text=make('p','فَلَك يجهّز الشرح…');section.append(heading,text);panel.append(section);
    const next=make('button','التالي','ai-submit review-next');next.onclick=()=>window.MadaarPlay?window.MadaarPlay.afterReview():navigate('Board.html');panel.append(next);
    const more=queryParams().has('more');
    const load=async()=>{try{
      const result=await api.simplify({...api.context(),question,more});if(!section.isConnected)return;
      text.textContent=result.text;
      section.querySelector('.expanded-evidence')?.remove();
      const evidence=make('div','','expanded-evidence');evidence.append(make('h2','دليل الإجابة'));
      appendEvidence(evidence,result.evidence||answer.evidence||question.evidence,result.source||answer.source);
      if(result.relatedEvidence?.length){
        evidence.append(make('h2','أدلة ومراجع ذات صلة للتوسع'),make('p','المقاطع التالية تتناول موضوعات مرتبطة؛ دليل إجابة السؤال هو النص المعروض أعلاه.'));
        for(const item of result.relatedEvidence){const related=make('section');related.append(make('h3',item.topic||''));appendEvidence(related,item);if(item.explanation)related.append(make('p',item.explanation));evidence.append(related);}
      }else evidence.append(make('p','لا تتوفر مقاطع إضافية موثقة لهذا الموضوع في الحزمة الحالية.'));
      section.append(evidence);
      if(more)localStorage.setItem('madaarSimplifyMoreUsed',question.id);
      if(localStorage.getItem('madaarSimplifyMoreUsed')!==question.id){const extra=Object.assign(make('a','بسّط لي أكثر','simplify-button'),{href:'Simplify.html?more=1'});panel.append(extra);}
    }catch(error){if(section.isConnected)errorBox(section,error,load);}};
    await load();
  }
  window.MadaarAIUI={mountCard,mountChecking,mountFeedback,mountSimplify,mountExpert};
  async function mountExpert() {
    const section=document.querySelector('.screen-card-panel');if(!section)return;
    [...section.children].forEach(element=>{if(!element.classList.contains('drawer-controls')&&element.tagName!=='H1')element.remove();});
    section.append(make('p','يمكنك الرجوع إلى جهة الإفتاء السعودية الرسمية. فتح الموقع لا يرسل سؤالك أو بياناتك تلقائيًا.'));
    const directories=await api.getReferralDirectory();
    for(const entry of directories){const link=make('a',entry.name,'ai-referral-link');link.href=entry.url;link.target='_blank';link.rel='noopener noreferrer';section.append(link);}
    const input=make('textarea');input.setAttribute('aria-label','استفسار لفلك');input.placeholder='استفسار لفَلَك حول المادة التعليمية';section.append(input);
    const ask=make('button','اسأل فَلَك','ai-submit');ask.type='button';section.append(ask);const answer=make('p');answer.setAttribute('aria-live','polite');section.append(answer);
    ask.onclick=async()=>{if(!input.value.trim())return;ask.disabled=true;try{const result=await api.askFalak({...api.context(),text:input.value,question:read('madaarActiveQuestion',null)});answer.textContent=result.text;}catch(error){errorBox(section,error,()=>ask.click());}finally{ask.disabled=false;}};
  }
  document.addEventListener('DOMContentLoaded',()=>{if(document.body.dataset.screen==='feedback')mountFeedback();if(document.body.dataset.screen==='simplify')mountSimplify();});
  document.addEventListener('DOMContentLoaded',()=>{if(document.body.dataset.screen==='expert')mountExpert();});
})();

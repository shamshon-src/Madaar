(() => {
  const api=window.MadaarOnline,seat=api?.seat();let mode;try{mode=Number(JSON.parse(localStorage.getItem('madaarSetup')||'{}').mode);}catch{return;}if(mode!==2||!seat)return;
  const board=window.MadaarBoard,panel=board?.panel;if(!panel)return;
  const say=(ar,en)=>localStorage.getItem('madaarLanguage')==='en'?en:ar;
  let room,lastVersion=-1,questionId,timer,busy=false,onlineReady=false,stop,clockOffset=0;
  window.MadaarAIUI.cancelCard?.();window.MadaarGame.resolveTurn=()=>null;
  const make=(tag,text,cls)=>{const node=document.createElement(tag);node.textContent=text||'';if(cls)node.className=cls;return node;};
  function notice(error){let node=document.querySelector('.online-error');if(!node){node=make('p','','online-error');node.setAttribute('role','alert');panel.before(node);}node.textContent=window.MadaarFirebase.errorMessage(error);panel.querySelectorAll('button,input,textarea').forEach(element=>element.disabled=true);onlineReady=false;}
  async function action(kind,data={}){if(busy||!onlineReady)return;busy=true;const requestId=crypto.randomUUID();try{const result=await api.call(kind,{code:seat.code,requestId,...data});if(result.room)render(result.room);return result;}catch(error){notice(error);}finally{busy=false;}}
  function hydrate(value){localStorage.setItem('madaarSetup',JSON.stringify(value.setup));localStorage.setItem('madaarPlayers',JSON.stringify(value.members.map(m=>m.name)));localStorage.setItem('madaarPlayerColors',JSON.stringify(value.members.map(m=>m.color)));localStorage.setItem('madaarGameState',JSON.stringify(value.game));localStorage.removeItem('madaarPendingTurn');Object.assign(window.MadaarGame.getState(),value.game);
    const players=document.querySelector('main>div:first-child>section:first-child'),cards=[...players.querySelectorAll(':scope>div')];while(cards.length>value.members.length)cards.pop().remove();while(cards.length<value.members.length){const card=cards[0].cloneNode(true);players.insertBefore(card,players.querySelector('p'));cards.push(card);}cards.forEach((card,index)=>{const spans=card.querySelectorAll('span');spans[0].textContent=String(index+1);spans[0].style.backgroundColor=value.members[index].color;spans[1].textContent=value.members[index].name;card.querySelectorAll('.withdraw-player').forEach(button=>button.hidden=index!==value.me);});
    board.refresh({deferEnd:true,keepPanel:true,reviewPlayer:value.owner});panel.classList.add('inline-game-panel','screen-card-panel');}
  function button(text,kind,data){const node=make('button',text,'ai-submit');node.type='button';node.onclick=()=>action(kind,data);return node;}
  function waiting(){return make('p',say('انتظر متابعة الدور من صاحبه.','Waiting for the turn owner to continue.'));}
  async function explain(){try{const value=await api.call('help',{code:seat.code,kind:'simplify'});const box=make('div','','answer-simplification');box.append(make('p',value.text));if(value.source?.label)box.append(make('small',value.source.label));panel.append(box);}catch(error){notice(error);}}
  function render(value){
    if(value.version<lastVersion)return;
    clockOffset=(value.serverTime||Date.now())-Date.now();
    const recovered=!onlineReady;onlineReady=true;document.querySelector('.online-error')?.remove();
    if(value.version===lastVersion&&!recovered)return;lastVersion=value.version;room=value;
    hydrate(value);
    if(value.phase==='question'&&questionId===value.question.id&&panel.querySelector('.online-question')){panel.querySelectorAll('button,input,textarea').forEach(element=>element.disabled=false);return;}
    questionId=null;clearInterval(timer);panel.replaceChildren();panel.classList.remove('turn-review','cell-stage','feedback-clean');
    document.querySelectorAll('.board-grid a').forEach(link=>{link.inert=true;link.setAttribute('aria-disabled','true');});
    const colors=value.members.map(m=>m.color);panel.style.setProperty('--player-color',colors[value.owner]||colors[value.me]);
    if(value.phase==='finished'){location.href='End.html';return;}
    if(value.phase==='paused'){panel.append(make('h2',say('بقي لاعب واحد','One player remains')),make('p',say('توقفت اللعبة الجماعية. يمكنك بدء لعبة فردية.','The group game is paused. You can start a solo game.')));const solo=button(say('ابدأ لعبة فردية','Start solo game'));solo.onclick=async()=>{await api.leave();window.MadaarSession.startSolo();};panel.append(solo);return;}
    if(value.phase==='ready'){
      const box=make('div','','turn-draw-ready'),turn=make('p',say('الدور الحالي: ','Current turn: ')+value.members[value.game.currentPlayer].name,'next-player-turn');turn.style.setProperty('--player-color',colors[value.game.currentPlayer]);const image=make('img');image.src='images/falak-bot.svg';image.alt=say('فلك','Falak');box.append(turn,image);box.append(value.me===value.owner?button(say('اسحب بطاقة','Draw a card'),'draw'):waiting());panel.append(box);
    }else if(value.phase==='review'){
      panel.classList.add('turn-review');const maximum={know:1,explore:2,analyze:3}[value.result.type];const image=make('img');image.src='images/falak-bot.svg';image.alt=say('فلك','Falak');image.className='online-review-falak';panel.append(image,make('h2',value.result.grade===maximum?say('إجابة صحيحة!','Correct answer!'):value.result.grade?say('إجابة جزئية','Partially correct'):say('إجابة خاطئة','Incorrect answer')));
      const simplify=button(say('بسّط لي','Explain simply'));simplify.classList.add('simplify-button');simplify.onclick=()=>{simplify.disabled=true;explain();};const actions=make('div','','online-review-actions');actions.append(simplify,value.me===value.owner?button(say('التالي','Next'),'next'):waiting());panel.append(actions);
    }else if(value.phase==='cell'){
      const landing=value.review?.retry?{type:'retry',player:value.owner,activated:true}:value.review?.landing||value.game.lastLanding;
      let actions=null;if(value.game.actionPending&&value.me===value.owner){actions=make('div');const link=(text,data)=>{const a=make('a',text);const query=new URLSearchParams();if(data.target!==undefined)query.set(landing.type==='team'?'teamup':landing.type==='duel'?'duel':'target',data.target);a.href='Board.html?'+query;a.onclick=event=>{event.preventDefault();action('draw',data);};actions.append(a);};
        if(['duel','team'].includes(landing.type))value.members.forEach((member,index)=>{if(index!==value.owner)link(say('ابدأ التحدي مع: ','Start challenge with: ')+member.name,{target:index});});
        else if(landing.type==='super'){const last=value.game.scores.indexOf(Math.min(...value.game.scores));[...new Set([value.owner,last])].forEach(index=>link(say('ابدأ التحدي: ','Start challenge: ')+value.members[index].name,{target:index}));}
        else link(say('ابدأ التحدي','Start challenge'),{});
      }
      window.MadaarCellCards.mount(panel,landing,actions,()=>action('next'));
      if(value.me!==value.owner){panel.querySelectorAll('button,a').forEach(node=>node.remove());panel.append(waiting());}
    }else if(value.phase==='question')showQuestion(value);
  }
  function showQuestion(value){
    const q=value.question;questionId=q.id;const box=make('section','','online-question'),banner=make('div','','card-player-turn');banner.style.setProperty('--player-color',value.members[value.owner].color);banner.append(make('strong',say('الدور الحالي: ','Current turn: ')+value.members[value.owner].name));
    const clock=make('span','','card-timer');banner.append(clock);box.append(banner,make('h1',q.text,'game-question-text'),make('small',say('أسئلة تدريبية من الخطة البديلة؛ يقيّمها الخادم.','Prepared practice questions; evaluated by the server.')));panel.append(box);
    const allowed=value.allowed.includes(value.me);let selected=-1,input;
    if(allowed){if(q.type==='analyze'){input=make('textarea');input.maxLength=3000;input.setAttribute('aria-label',say('إجابتك','Your answer'));box.append(input);}else{const options=make('div','','ai-answer-options');q.options.forEach((text,index)=>{const option=make('button',text,'ai-answer');option.onclick=()=>{selected=index;[...options.children].forEach((node,i)=>node.setAttribute('aria-pressed',String(i===index)));};options.append(option);});box.append(options);}
      const submit=button(say('تأكيد الإجابة','Confirm answer'));submit.onclick=()=>{if(q.type!=='analyze'&&selected<0)return;action('answer',{questionId:q.id,choice:selected,text:input?.value||''});};box.append(submit);
      if(value.game.boosts[value.me]?.lamps){const hint=button(say('تلميح · مصباح واحد','Hint · one lamp'));hint.onclick=async()=>{const result=await action('hint');if(result?.text){box.append(make('p',result.text));hint.remove();}};box.append(hint);}
    }else box.append(make('p',say('السؤال للمشارك المحدد؛ يمكنك متابعة الدور.','This question is for the selected participant. You can watch the turn.')));
    let expired=false;const tick=()=>{const seconds=Math.max(0,Math.ceil((value.deadline-Date.now()-clockOffset)/1000));clock.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;if(!seconds&&!expired&&onlineReady&&!busy){expired=true;action('timeout',{questionId:q.id}).then(()=>{if(room?.phase==='question')expired=false;});}};tick();timer=setInterval(tick,200);
  }
  document.addEventListener('click',event=>{
    const exit=event.target.closest('.exit-game,.withdraw-player');if(exit){event.preventDefault();event.stopImmediatePropagation();if(busy)return;busy=true;api.leave().then(()=>{stop?.();clearInterval(timer);MadaarSession.clearGame();location.href='Main.html';}).catch(error=>{busy=false;notice(error);});return;}
    const link=event.target.closest('.board-grid a');if(link){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  // Cell knowledge uses the room's prepared source during this AI-independent test phase.
  window.MadaarAI.getKnowledge=async()=>({text:say('اربط المعرفة بتطبيقها، واستفد من مراجعة إجاباتك.','Connect knowledge to practice and learn from reviewing your answers.'),source:{label:say('نص تدريبي','Practice text')}});
  panel.replaceChildren(make('p',say('جاري الاتصال بالغرفة…','Connecting to room…')));
  stop=api.subscribe(seat.code,render,notice);window.addEventListener('pagehide',()=>{stop();clearInterval(timer);});
})();

(() => {
  if(new URLSearchParams(location.search).has('overlay')||!window.MadaarBoard)return;
  const board=window.MadaarBoard,panel=board.panel,templates=new Map();let revision=0;
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  const make=(tag,text,cls)=>{const node=document.createElement(tag);node.textContent=text||'';if(cls)node.className=cls;return node;};
  const state=()=>window.MadaarGame.getState();
  const routes=new Set(['Board.html','CardKnow.html','CardExplore.html','CardAnalyze.html','FeedbackCorrect.html','FeedbackPartial.html','Simplify.html','AskExpert.html']);
  const feedbackFiles=new Set(['FeedbackCorrect.html','FeedbackPartial.html']);
  const controller={query:new URLSearchParams(),cardType:null,phase:'ready'};
  function review(){const value=read('madaarTurnReview',null);return value?.sessionId===state().sessionId?value:null;}
  function phase(value){controller.phase=value;localStorage.setItem('madaarTurnView',JSON.stringify({sessionId:state().sessionId,phase:value}));}
  function lock(){document.querySelectorAll('.board-grid a').forEach(link=>{link.inert=controller.phase!=='ready'||state().pausedForSolo;link.setAttribute('aria-disabled',String(link.inert));});}
  function prepare(){delete document.body.dataset.cardType;panel.classList.add('screen-card-panel','inline-game-panel');panel.classList.remove('feedback-clean','turn-review','cell-stage');panel.scrollTop=0;}
  controller.ready=()=>{
    ++revision;window.MadaarAIUI.cancelCard?.();controller.query=new URLSearchParams();controller.cardType=null;
    if(state().finished){location.assign('End.html');return;}
    phase('ready');board.refresh();prepare();
    if(state().pausedForSolo){lock();return;}
    panel.replaceChildren();const ready=make('div','','turn-draw-ready'),turn=make('p',`الدور الحالي: ${state().names[state().currentPlayer]}`,'next-player-turn');
    const colors=read('madaarPlayerColors',[]);turn.style.setProperty('--player-color',colors[state().currentPlayer]||'#8b5cf6');
    const falak=make('img');falak.src='images/falak-bot.svg';falak.alt='فلك';
    const heading=make('h2',state().awaitingRetry?'محاولة ثانية':'هل أنت مستعد؟');
    const draw=make('button','اسحب بطاقة','ai-submit draw-card');draw.onclick=()=>controller.drawNext();
    ready.append(turn,falak,heading,draw);panel.append(ready);lock();
  };
  controller.cell=()=>{
    ++revision;window.MadaarAIUI.cancelCard?.();const current=review();
    const landing=current?.retry?{type:'retry',player:current.player,activated:true}:current?.landing||state().lastLanding;
    if(!landing||landing.type==='card'){controller.ready();return;}
    board.refresh({deferEnd:true,reviewPlayer:current?.player??landing.player});
    const actions=state().actionPending?board.landingActions():null;
    phase('cell');prepare();panel.classList.add('cell-stage');lock();
    window.MadaarCellCards.mount(panel,landing,actions,controller.ready);
  };
  controller.afterReview=()=>{
    if(state().finished){location.assign('End.html');return;}
    const value=review();
    if(value?.retry||value?.landing&&value.landing.type!=='card')controller.cell();else controller.ready();
  };
  controller.drawNext=()=>{
    if(state().actionPending){controller.cell();return;}
    if(state().awaitingRetry){const question=read('madaarActiveQuestion',{});controller.open(({know:'CardKnow.html',explore:'CardExplore.html',analyze:'CardAnalyze.html'}[question.type]||'CardKnow.html')+'?retry=1');return;}
    controller.open(['CardKnow.html','CardExplore.html','CardAnalyze.html'][Math.floor(Math.random()*3)]);
  };
  controller.open=async target=>{
    const url=new URL(target,location.href),file=url.pathname.split('/').pop();
    if(!routes.has(file)){location.assign(target);return;}
    if(file==='Board.html'){controller.ready();return;}
    const token=++revision;window.MadaarAIUI.cancelCard?.();controller.query=url.searchParams;controller.cardType=null;
    try{
      if(feedbackFiles.has(file)){
        phase('review');board.refresh({deferEnd:true,reviewPlayer:review()?.player});prepare();lock();
        await window.MadaarAIUI.mountFeedback(panel);return;
      }
      if(file==='Simplify.html'){
        phase('simplify');prepare();lock();await window.MadaarAIUI.mountSimplify(panel);return;
      }
      if(!templates.has(file))templates.set(file,fetch(url.pathname).then(response=>{if(!response.ok)throw Error('تعذّر تحميل البطاقة.');return response.text();}));
      const markup=await templates.get(file);if(token!==revision)return;
      const doc=new DOMParser().parseFromString(markup,'text/html'),content=doc.querySelector('main section')||doc.querySelector('section');
      if(!content)throw Error('تعذّر تحميل البطاقة.');prepare();
      if(file.startsWith('Card')){
        phase('question');lock();board.showPlayer(state().currentPlayer);
        controller.cardType={'CardKnow.html':'know','CardExplore.html':'explore','CardAnalyze.html':'analyze'}[file];
        panel.replaceChildren(document.importNode(content,true));
        await window.MadaarAIUI.mountCard(document.querySelector('main'));
      }else{panel.replaceChildren(...[...content.childNodes].map(node=>document.importNode(node,true)));await window.MadaarAIUI.mountExpert();}
    }catch(error){
      if(token!==revision)return;templates.delete(file);prepare();panel.replaceChildren();
      const text=make('p','تعذّر عرض البطاقة. أعد المحاولة.'),retry=make('button','إعادة المحاولة','ai-submit');retry.onclick=()=>controller.open(target);panel.append(text,retry);
    }
  };
  window.MadaarPlay=controller;
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||link.target==='_blank')return;
    const url=new URL(link.href,location.href);if(url.origin===location.origin&&routes.has(url.pathname.split('/').pop())){event.preventDefault();controller.open(url.href);}
  });
  window.addEventListener('pagehide',()=>window.MadaarAIUI.cancelCard?.());
  const initialView=new URLSearchParams(location.search).get('view'),saved=read('madaarTurnView',{});
  if(initialView){history.replaceState(null,'','Board.html');controller.open(initialView);}
  else if(saved.sessionId===state().sessionId&&review()&&['review','simplify'].includes(saved.phase))controller.open('FeedbackCorrect.html');
  else if(saved.sessionId===state().sessionId&&saved.phase==='cell'||state().actionPending)controller.cell();
  else controller.ready();
})();

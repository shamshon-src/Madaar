document.addEventListener('DOMContentLoaded', () => {
  const screen=document.body.dataset.screen;
  document.querySelectorAll('a[href="AskExpert.html"]').forEach(link=>link.remove());
  if(screen==='home'){
    const help=document.querySelector('main a[href="HowToPlay.html"]');
    if(help){const section=document.createElement('section');section.className='home-expert-section';const heading=document.createElement('h2');heading.textContent='تعلّم أكثر، واسأل أهل الاختصاص';const text=document.createElement('p');text.textContent='لا تتردد في التعلّم أكثر عن دينك وطرح ما يشغلك من أسئلة. وللحصول على إجابة موثوقة، اسأل أهل العلم والمتخصصين، خاصةً في المسائل التي تحتاج إلى فتوى.';const expert=help.cloneNode(false);expert.href='AskExpert.html';expert.className='home-expert-link';expert.textContent='اسأل مختصًا';section.append(heading,text,expert);document.querySelector('main').append(section);}
  }
  const floating=[...document.querySelectorAll('.theme-floating,.font-size-floating')];
  if(floating.length){const toolbar=document.createElement('nav');toolbar.className='game-display-toolbar';toolbar.append(...floating);document.body.prepend(toolbar);}
  if(['card','checking','special','feedback'].includes(screen)){
    const tools=document.createElement('nav');tools.className='game-session-actions';
    const exit=document.createElement('button');exit.className='exit-game';exit.textContent='الخروج من اللعبة';exit.onclick=()=>{window.MadaarSession.clearGame();location.href='Main.html';};tools.append(exit);
    const state=window.MadaarGame?.getState();
    if(state&&state.names.length>1&&!state.finished){
      const withdraw=document.createElement('button');withdraw.className='withdraw-player';withdraw.textContent='انسحاب';
      withdraw.onclick=()=>{const index=state.currentPlayer;const colors=JSON.parse(localStorage.getItem('madaarPlayerColors')||'[]');colors.splice(index,1);window.MadaarGame.removePlayer(index);localStorage.setItem('madaarPlayers',JSON.stringify(state.names));localStorage.setItem('madaarPlayerColors',JSON.stringify(colors));localStorage.setItem('madaarWithdrawal',JSON.stringify({remaining:state.names.length}));location.href='Main.html';};tools.append(withdraw);
    }
    document.body.append(tools);
  }
  const helpLinks=[...document.querySelectorAll('a[href="HowToPlay.html"]')];
  const heroHelp=screen==='home'?document.querySelector('main a[href="HowToPlay.html"]'):null;
  helpLinks.forEach(link=>{if(link!==heroHelp)link.remove();});
  if(screen==='home')document.querySelector('header a[href="Room.html"]')?.remove();
  if(screen==='home'&&localStorage.getItem('madaarWithdrawal')&&localStorage.getItem('madaarGameState')){
    const state=JSON.parse(localStorage.getItem('madaarGameState'));const panel=document.createElement('section');panel.className='withdrawal-return';const text=document.createElement('p');text.textContent=state.pausedForSolo?'توقفت اللعبة الجماعية بعد الانسحاب. بقي لاعب واحد ويمكنه بدء لعبة فردية.':'انسحب لاعب، وتستمر الجولة لبقية المتنافسين.';const button=document.createElement('button');button.className='ai-submit';button.textContent=state.pausedForSolo?'الدخول إلى لعبة فردية':'متابعة اللعبة';button.onclick=()=>{localStorage.removeItem('madaarWithdrawal');if(state.pausedForSolo)window.MadaarSession.startSolo();else location.href='Board.html';};panel.append(text,button);document.querySelector('main')?.prepend(panel);
  }
  document.querySelectorAll('header a[href="AlternativePlan.html"]').forEach(link=>link.remove());
  if(new URLSearchParams(location.search).has('overlay'))document.querySelectorAll('header nav button,header nav a').forEach(element=>element.remove());
  if(!['home','board','journey'].includes(screen))document.querySelectorAll('.sound-toggle').forEach(button=>button.remove());
  if(screen!=='home')document.querySelectorAll('.language-toggle').forEach(button=>button.remove());
  document.querySelectorAll('.drawer-controls').forEach(element=>element.remove());
  if(document.body.classList.contains('login-page')&&window.MadaarSession?.get()){
    const logout=document.createElement('button');logout.type='button';logout.className='preview-secondary';logout.textContent='تسجيل الخروج';logout.onclick=()=>window.MadaarSession.logout();document.querySelector('.preview-header nav')?.prepend(logout);
  }
});

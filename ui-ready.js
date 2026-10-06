(() => {
  const root=document.documentElement;
  root.classList.add('ui-preparing');
  const file=location.pathname.split('/').pop();
  const inlineViews=['CardKnow.html','CardExplore.html','CardAnalyze.html','FeedbackCorrect.html','FeedbackPartial.html','Simplify.html'];
  if(inlineViews.includes(file)&&localStorage.getItem('madaarGameState')){
    location.replace('Board.html?view='+encodeURIComponent(file+location.search));
  }
  root.lang=localStorage.getItem('madaarLanguage')==='en'?'en':'ar';
  root.dir=root.lang==='en'?'ltr':'rtl';
  const style=document.createElement('style');style.textContent='html.ui-preparing body{visibility:hidden!important}';document.head.append(style);
  const fallback=setTimeout(()=>root.classList.remove('ui-preparing'),4000);
  document.addEventListener('DOMContentLoaded',()=>{
    const reveal=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{root.classList.remove('ui-preparing');clearTimeout(fallback);}));
    const frame=document.querySelector('iframe.screen-board-backdrop,iframe.feedback-backdrop');
    if(frame){
      const waitForBoard=()=>{if(frame.contentDocument?.body&&frame.contentDocument.readyState!=='loading'){frame.dispatchEvent(new Event('madaar-frame-ready'));reveal();}else if(root.classList.contains('ui-preparing'))setTimeout(waitForBoard,50);};
      waitForBoard();
    }else reveal();
  });
})();

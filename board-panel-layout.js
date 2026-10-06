document.addEventListener('DOMContentLoaded',()=>{
  const frame=document.querySelector('iframe.screen-board-backdrop,iframe.feedback-backdrop'),panel=document.querySelector('.screen-card-panel');
  if(!frame||!panel)return;
  document.body.classList.add('board-panel-page');
  function arrange(){
    const doc=frame.contentDocument;if(!doc?.body)return;
    doc.body.style.setProperty('min-height','0','important');doc.body.querySelector(':scope>div')?.style.setProperty('min-height','0','important');
    const placeholder=doc.querySelector('main > div:first-child > section:last-child');if(!placeholder)return;
    placeholder.style.display='';placeholder.style.visibility='hidden';placeholder.style.minHeight=panel.offsetHeight+'px';
    const rect=placeholder.getBoundingClientRect();
    panel.style.setProperty('--panel-top',(rect.top+frame.getBoundingClientRect().top+scrollY)+'px');panel.style.setProperty('--panel-left',rect.left+'px');panel.style.setProperty('--panel-width',rect.width+'px');
    const height=Math.max(innerHeight,doc.body.scrollHeight,rect.top+panel.offsetHeight+32);
    if(Math.abs(parseFloat(frame.style.height||'0')-height)>1)frame.style.height=height+'px';
  }
  frame.addEventListener('load',()=>{const doc=frame.contentDocument;doc.addEventListener('click',event=>{if(event.target.closest('a,button')){event.preventDefault();event.stopImmediatePropagation();}},true);new ResizeObserver(arrange).observe(doc.body);arrange();});
  new ResizeObserver(arrange).observe(panel);window.addEventListener('resize',arrange);if(frame.contentDocument?.readyState==='complete')arrange();
  frame.addEventListener('madaar-frame-ready',arrange);
});

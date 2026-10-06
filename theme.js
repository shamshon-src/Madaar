(() => {
  let selected; try { selected=localStorage.getItem('madaarTheme'); } catch {}
  selected=selected==='dark'?'dark':'light';
  const root=document.documentElement;
  root.dataset.theme=selected;
  function rgb(value){const match=value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);return match&&Number(match[4]??1)>0.1?match.slice(1,4).map(Number):null;}
  function mark(element){
    if(element.closest('svg')||element.matches('img,video,canvas')||element.dataset.themeMarked)return;
    const style=getComputedStyle(element),bg=rgb(style.backgroundColor),fg=rgb(style.color);
    if(bg){const [r,g,b]=bg;
      if(Math.min(r,g,b)>175)element.dataset.themeSurface=Math.max(r,g,b)-Math.min(r,g,b)<15?'paper':'soft';
      else if(b>r&&b>g&&r<55&&g<100)element.dataset.themeSurface='navy';
      else if(g>r*1.3&&g>b*1.2)element.dataset.themeSurface='green';
      else if(r>170&&g>100&&b<100)element.dataset.themeSurface='gold';
    }
    if(fg){const [r,g,b]=fg;if(Math.max(r,g,b)<170)element.dataset.themeText='ink';else if(Math.min(r,g,b)>175)element.dataset.themeText='white';}
    element.dataset.themeMarked='true';
  }
  function scan(container){if(container.nodeType!==1)return;mark(container);container.querySelectorAll('*').forEach(mark);}
  document.addEventListener('DOMContentLoaded',()=>{
    // Record authored light colors once; theme rules do not alter layout or artwork.
    root.dataset.theme='light';scan(document.body);root.dataset.theme=selected;
    if(!new URLSearchParams(location.search).has('overlay')){
      const button=document.createElement('button');button.type='button';button.className='theme-toggle';
      const update=()=>{const dark=selected==='dark',english=root.lang==='en';button.textContent=dark?(english?'☀ Light':'☀ فاتح'):(english?'☾ Dark':'☾ غامق');button.setAttribute('aria-label',english?'Toggle color theme':'تبديل النمط الفاتح والغامق');button.setAttribute('aria-pressed',String(dark));};
      update();button.addEventListener('click',()=>{selected=selected==='dark'?'light':'dark';root.dataset.theme=selected;try{localStorage.setItem('madaarTheme',selected);}catch{}update();});
      const nav=document.querySelector('body > div > header nav, .preview-header nav, header nav');
      if(nav)nav.append(button);else{button.classList.add('theme-floating');document.body.append(button);}
    }
    new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)scan(node);}).observe(document.body,{childList:true,subtree:true});
  });
  window.addEventListener('storage',event=>{if(event.key==='madaarTheme'){selected=event.newValue==='dark'?'dark':'light';root.dataset.theme=selected;const button=document.querySelector('.theme-toggle');if(button){button.textContent=selected==='dark'?'☀ فاتح':'☾ غامق';button.setAttribute('aria-pressed',String(selected==='dark'));}}});
})();

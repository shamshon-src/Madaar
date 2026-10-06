(() => {
  window.MadaarServiceConfig={...window.MadaarServiceConfig,mode:'mock'};
  const game=window.MadaarGame,grid=document.querySelector('.board-grid'),cells=[...grid.querySelectorAll(':scope>.board-revealed')];
  const box=document.createElement('section');box.className='solo-cell-test-tools';
  const title=document.createElement('h1');title.textContent='اختبار خلايا اللعب الفردي';const text=document.createElement('p');text.textContent='انقر على خلية في الرقعة، أو اخترها من القائمة للوقوف عليها وتفعيل أثرها. هذه تجربة مستقلة لا تغيّر بيانات لعبتك الأساسية.';
  const label=document.createElement('label');label.textContent='اختر الخلية ';const select=document.createElement('select');select.setAttribute('aria-label','اختر الخلية');label.append(select);
  if(new URLSearchParams(location.search).has('colored'))title.textContent=game.getState().names.length>1?'معاينة الخلايا الملونة — اللعب الجماعي':'معاينة الخلايا الملونة — اللعب الفردي';
  const refreshChoices=()=>{const state=game.getState(),position=state.progress[state.currentPlayer]%24-1;select.replaceChildren(new Option('البداية','-1'));cells.forEach((_,index)=>select.append(new Option(`${index+1} — ${game.getTile(index).label}`,String(index))));select.value=String(position);};
  const jump=index=>{window.MadaarAIUI.cancelCard?.();if(game.testLanding(index)){window.MadaarPlay.open('Board.html');refreshChoices();}};
  select.onchange=()=>jump(Number(select.value));cells.forEach((cell,index)=>{cell.setAttribute('role','button');cell.tabIndex=0;cell.style.cursor='pointer';cell.onclick=()=>jump(index);cell.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();jump(index);}};});
  const reset=document.createElement('button');reset.textContent='إعادة ضبط التجربة';reset.onclick=()=>{for(const key of Object.keys(sessionStorage))if(key.startsWith(window.MadaarCellTestPrefix))sessionStorage.removeItem(key);location.reload();};
  const back=document.createElement('a');back.href='AlternativePlan.html';back.textContent='الخطة البديلة';box.append(title,text,label,reset,back);document.querySelector('main').before(box);refreshChoices();
  new MutationObserver(refreshChoices).observe(grid,{childList:true,subtree:true});
})();

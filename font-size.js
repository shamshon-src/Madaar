(() => {
  const sizes={smaller:.8,small:.9,normal:1,large:1.2,larger:1.4},root=document.documentElement;
  let choice='normal';try{choice=localStorage.getItem('madaarFontSize')||'normal';}catch{}if(!sizes[choice])choice='normal';
  function apply(){root.dataset.fontSize=choice;root.style.setProperty('--font-scale',sizes[choice]);}
  function mark(node){
    if(node.nodeType!==1||node.closest('svg')||node.matches('script,style,img,iframe')||node.dataset.fontBase)return;
    const measured=parseFloat(getComputedStyle(node).fontSize);
    const parent=node.parentElement;
    const inherited=choice!=='normal'&&parent?.dataset.fontBase&&Math.abs(measured-parseFloat(getComputedStyle(parent).fontSize))<.1;
    const base=inherited?Number(parent.dataset.fontBase):measured;
    node.dataset.fontBase=String(base);node.style.setProperty('--base-font',base+'px');
  }
  document.addEventListener('DOMContentLoaded',()=>{
    root.dataset.fontSize='normal';document.body.querySelectorAll('*').forEach(mark);apply();
    if(!new URLSearchParams(location.search).has('overlay')){
      const label=document.createElement('label');label.className='font-size-control';label.append('حجم الخط ');
      const select=document.createElement('select');select.setAttribute('aria-label','حجم الخط');
      for(const [value,text] of [['smaller','أصغر'],['small','صغير'],['normal','عادي'],['large','كبير'],['larger','أكبر']]){const option=new Option(text,value);select.append(option);}select.value=choice;
      select.onchange=()=>{choice=select.value;apply();try{localStorage.setItem('madaarFontSize',choice);}catch{}};label.append(select);
      const nav=document.querySelector('body>div>header nav,.preview-header nav,header nav');if(nav)nav.append(label);else{label.classList.add('font-size-floating');document.body.append(label);}
    }
    new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1){mark(node);node.querySelectorAll('*').forEach(mark);}}).observe(document.body,{subtree:true,childList:true});
  });
  window.addEventListener('storage',event=>{if(event.key==='madaarFontSize'){choice=sizes[event.newValue]?event.newValue:'normal';apply();const select=document.querySelector('.font-size-control select');if(select)select.value=choice;}});
})();

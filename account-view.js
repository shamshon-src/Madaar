(() => {
  document.addEventListener('DOMContentLoaded',()=>{const link=document.querySelector('.account-action');if(link)link.textContent=window.MadaarI18n.message(window.MadaarSession.get()?.mode==='account'?'ملفي المحلي':'احفظ اسمك');});
})();

(() => {
  const api=window.MadaarFirebase;if(!api)return;const say=(ar,en)=>localStorage.getItem('madaarLanguage')==='en'?en:ar;
  async function refresh(){
    if(!api.config().firebase?.apiKey)return;
    try{const {auth}=await api.initialize();const link=document.querySelector('.account-action');if(link)link.textContent=auth.currentUser&&!auth.currentUser.isAnonymous?say('حسابي','My account'):say('تسجيل الدخول','Sign in');
      if(!document.body.classList.contains('login-page')||!auth.currentUser||auth.currentUser.isAnonymous)return;
      let summary=document.querySelector('.account-summary');if(summary)return;summary=document.createElement('section');summary.className='account-summary preview-panel';summary.append(Object.assign(document.createElement('h2'),{textContent:say('بيانات حسابك','Your account')}));document.querySelector('.preview-layout').before(summary);
      const logout=document.createElement('button');logout.className='preview-secondary';logout.textContent=say('تسجيل الخروج','Sign out');logout.onclick=()=>MadaarSession.logout();summary.append(logout);
      try{const data=await api.readAccount(),name=document.createElement('p');name.textContent=data.profile?.displayName||auth.currentUser.displayName||auth.currentUser.email;summary.prepend(name);const results=Object.values(data.results||{}).sort((a,b)=>b.finishedAt-a.finishedAt).slice(0,10);const list=document.createElement('ul');if(!results.length){const note=document.createElement('p');note.textContent=say('لم تُحفظ نتائج ألعاب أونلاين لهذا الحساب بعد.','No online game results saved for this account yet.');summary.append(note);}for(const result of results){const row=document.createElement('li');row.textContent=`${window.MadaarI18n?.translate(result.topic)||result.topic} · ${result.score} ${say('نقطة','points')} · ${new Date(result.finishedAt).toLocaleDateString(localStorage.getItem('madaarLanguage')==='en'?'en':'ar')}`;list.append(row);}summary.append(list);}catch(error){summary.append(Object.assign(document.createElement('p'),{textContent:api.errorMessage(error)}));}
    }catch{/* Explicit errors appear in the login controls; never switch providers silently. */}
  }
  window.addEventListener('madaar-auth-change',refresh);document.addEventListener('DOMContentLoaded',refresh);
})();

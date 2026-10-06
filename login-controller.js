(() => {
  const localForm=document.getElementById('login-preview-form'),localInput=document.getElementById('account');
  localInput.value=window.MadaarSession.profile()?.displayName||'';
  localForm.addEventListener('submit',event=>{event.preventDefault();try{window.MadaarSession.saveProfile({displayName:localInput.value});location.href='Main.html';}catch(error){document.getElementById('login-status').textContent=error.message;}});
  document.querySelector('.preview-quick').addEventListener('click',event=>{event.preventDefault();window.MadaarSession.start('guest');location.href='Main.html';});
})();

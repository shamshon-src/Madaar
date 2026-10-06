/* Authentication is separate from game state. Local guests remain playable without keys. */
(() => {
  const key = 'madaarSession';
  const gameKeys = ['madaarSetup','madaarPlayers','madaarPlayerColors','madaarPlayerScores','madaarTargetScore','madaarAnswer','madaarRoomCode','madaarGameState','madaarPendingTurn','madaarPendingTilePulse','madaarActiveQuestion','madaarLastResult','madaarRejectedTopic','madaarTopicSuggestions','madaarTurnReview','madaarTurnView'];
  window.MadaarSession = {
    startSolo() { const setup=JSON.parse(localStorage.getItem('madaarSetup')||'{}'),names=JSON.parse(localStorage.getItem('madaarPlayers')||'[]'),colors=JSON.parse(localStorage.getItem('madaarPlayerColors')||'[]');window.MadaarOnline?.detachForLocalPlay();this.clearGame();localStorage.removeItem('madaarWithdrawal');localStorage.setItem('madaarSetup',JSON.stringify({...setup,mode:0}));localStorage.setItem('madaarTargetScore',String(setup.targetScore||30));localStorage.setItem('madaarPlayers',JSON.stringify(names.slice(0,1)));localStorage.setItem('madaarPlayerColors',JSON.stringify(colors.slice(0,1)));location.href='Board.html'; },
    profile: () => {try{return JSON.parse(localStorage.getItem('madaarLocalProfile')||'null');}catch{return null;}},
    saveProfile(values) {const previous=this.profile()||{},displayName=String(values.displayName??previous.displayName??'').trim().slice(0,60);if(!displayName)throw Error('أدخل اسمك أولًا.');const profile={...previous,...values,displayName};localStorage.setItem('madaarLocalProfile',JSON.stringify(profile));localStorage.setItem('madaarLocalSignedIn','true');sessionStorage.setItem(key,JSON.stringify({mode:'account',mock:true,displayName}));return profile;},
    get: () => { try {const current=JSON.parse(sessionStorage.getItem(key)||'null');if(current?.mock===true)return current;if(localStorage.getItem('madaarLocalSignedIn')==='true'){const profile=JSON.parse(localStorage.getItem('madaarLocalProfile')||'null');if(profile)return {mode:'account',mock:true,displayName:profile.displayName};}return null;} catch { return null; } },
    start: mode => sessionStorage.setItem(key, JSON.stringify({mode, mock:true})),
    clearGame: () => {gameKeys.forEach(name => localStorage.removeItem(name));localStorage.removeItem('madaarWithdrawal');},
    async logout() {this.clearGame();localStorage.removeItem('madaarLocalSignedIn');sessionStorage.removeItem('madaarOnlineSeat');sessionStorage.removeItem('madaarOnlineLocalToken');sessionStorage.removeItem(key);location.href='Login.html';}
  };
  sessionStorage.removeItem('madaarOnlineSeat');sessionStorage.removeItem('madaarOnlineLocalToken');
  try{const setup=JSON.parse(localStorage.getItem('madaarSetup')||'{}');if(Number(setup.mode)===2)window.MadaarSession.clearGame();}catch{}
})();

/* Authentication is separate from game state. Local guests remain playable without keys. */
(() => {
  const key = 'madaarSession';
  const gameKeys = ['madaarSetup','madaarPlayers','madaarPlayerColors','madaarPlayerScores','madaarTargetScore','madaarAnswer','madaarRoomCode','madaarGameState','madaarPendingTurn','madaarPendingTilePulse','madaarActiveQuestion','madaarLastResult','madaarRejectedTopic','madaarTopicSuggestions','madaarTurnReview','madaarTurnView'];
  window.MadaarSession = {
    startSolo() { const setup=JSON.parse(localStorage.getItem('madaarSetup')||'{}'),names=JSON.parse(localStorage.getItem('madaarPlayers')||'[]'),colors=JSON.parse(localStorage.getItem('madaarPlayerColors')||'[]');window.MadaarOnline?.detachForLocalPlay();this.clearGame();localStorage.removeItem('madaarWithdrawal');localStorage.setItem('madaarSetup',JSON.stringify({...setup,mode:0}));localStorage.setItem('madaarTargetScore',String(setup.targetScore||30));localStorage.setItem('madaarPlayers',JSON.stringify(names.slice(0,1)));localStorage.setItem('madaarPlayerColors',JSON.stringify(colors.slice(0,1)));location.href='Board.html'; },
    get: () => { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } },
    start: mode => sessionStorage.setItem(key, JSON.stringify({mode, mock:true})),
    clearGame: () => {gameKeys.forEach(name => localStorage.removeItem(name));localStorage.removeItem('madaarWithdrawal');},
    async logout() { try{if(window.MadaarOnline?.seat())await window.MadaarOnline.leave();await window.MadaarFirebase?.logout();this.clearGame();sessionStorage.removeItem('madaarOnlineSeat');sessionStorage.removeItem('madaarOnlineLocalToken');sessionStorage.removeItem(key);location.href='Login.html';}catch(error){window.alert(window.MadaarFirebase.errorMessage(error));} }
  };
  if(window.MadaarFirebaseConfig?.firebase?.apiKey)window.MadaarFirebase.initialize().catch(()=>{});
})();

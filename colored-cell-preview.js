(() => {
  const game=window.MadaarGame,s=game.getState(),group=Number(JSON.parse(localStorage.getItem('madaarSetup')).mode)!==0;
  const types=group?['lamp','multiplier','retry','knowledge','super','duel','team']:['lamp','multiplier','retry','knowledge','speed','bigSolo','streak'];
  s.tiles=Array.from({length:23},(_,i)=>types[i%types.length]);s.playerTiles=s.names.map(()=>s.tiles);game.persist();
})();

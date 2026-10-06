const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(require('path').join(__dirname,'../game-engine.js'),'utf8').replace('const allColoredTrial = true;','const allColoredTrial = false;');
function game(mode=0,target=20,count=2){const map=new Map([['madaarSetup',JSON.stringify({mode,targetScore:target})],['madaarPlayers',JSON.stringify(Array.from({length:count},(_,i)=>'P'+i))]]);const context={localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)},window:{},console,crypto:require('crypto').webcrypto};vm.runInNewContext(code,context);const g=context.window.MadaarGame;g.getState().tiles.fill('card');return g;}
function answer(g,type,grade,options={}){g.drawFromTile(0,type,options);const pending=g.getPending();return g.resolveTurn({serviceResult:true,type,grade,steps:grade,turnId:pending.id,correct:grade>0});}
let g=game();answer(g,'know',1);assert.equal(g.getState().scores[0],1);assert.equal(g.getState().progress[0],1);assert.equal(g.resolveTurn({correct:true}),null);
for(const grade of [0,1,2,3]){g=game();answer(g,'analyze',grade);assert.equal(g.getState().scores[0],grade);assert.equal(g.getState().progress[0],grade);}
g=game();g.getState().scores[0]=6;g.getState().boosts[0].multiplier=true;g.getState().boosts[0].retry=true;assert(answer(g,'know',0).retry);assert(g.getState().awaitingRetry);assert(!g.getState().boosts[0].retry);answer(g,'know',1,{retry:true});assert.equal(g.getState().scores[0],8);assert.equal(g.getState().progress[0],1);assert(!g.getState().boosts[0].retry);
g=game();g.getState().scores[0]=16;g.getState().progress[0]=22;g.getState().tiles[0]='speed';answer(g,'explore',2);assert.equal(g.getState().scores[0],21);assert.equal(g.getState().progress[0],24);assert(g.getState().finished);assert(!g.getState().actionPending);
g=game(1);g.getState().scores=[14,13];answer(g,'analyze',3,{partner:1,extraChallenge:true,challenge:'team'});assert.deepEqual(Array.from(g.getState().scores),[17,16]);assert.deepEqual(Array.from(g.getState().progress),[3,0]);
g=game(1);g.getState().scores=[18,18];answer(g,'explore',2,{partner:1,extraChallenge:true,challenge:'team'});assert.deepEqual(Array.from(g.getState().scores),[20,20]);assert(g.getState().finished);
g=game();g.getState().boosts[0].streakActive=true;answer(g,'know',1);answer(g,'know',1);assert.equal(g.getState().scores[0],5);
g=game();answer(g,'know',1,{extraChallenge:true,challenge:'speed',challengePoints:0,speedRun:true});assert.equal(g.getState().scores[0],2);
// Speed event rewards 2 only, without the ordinary card reward.
g=game(1);answer(g,'know',1,{duel:true,duelWinner:1,extraChallenge:true,arena:true});assert.equal(g.getState().scores[1],2);
g=game(1,30,4);for(let i=0;i<4;i++)answer(g,'know',0);assert.equal(g.getState().currentPlayer,0);
g=game(1,50,3);let before=Array.from(g.getState().tiles);answer(g,'know',0);assert.deepEqual(Array.from(g.getState().tiles),before);assert.equal(g.getState().currentPlayer,1);assert.equal(g.getState().tiles,g.getState().playerTiles[1]);
// A real lap cannot shuffle while another player has never left the start.
g.getState().progress=[0,23,1];answer(g,'know',1);assert.deepEqual(Array.from(g.getState().tiles),before);
g.getState().progress=[1,1,23];answer(g,'know',1);assert.notDeepEqual(Array.from(g.getState().tiles),before);
for(const tiles of g.getState().playerTiles.slice(0,1)){const counts=tiles.reduce((out,t)=>(out[t]=(out[t]||0)+1,out),{});assert.equal(counts.card,16);for(const [type,count]of Object.entries(counts))if(type!=='card')assert.equal(count,1);}
g.removePlayer(0);assert(!g.getState().pausedForSolo);g.removePlayer(0);assert(g.getState().pausedForSolo);g.drawFromTile(0,'know');assert.equal(g.getPending(),null);
g=game(0,50);g.getState().tiles[0]='lamp';answer(g,'know',1);assert.equal(g.getState().lastLanding.type,'lamp');assert.equal(g.getTile(0).type,'lamp');assert.equal(g.getState().boosts[0].lamps,1);
g=game(0,50);g.getState().progress[0]=23;g.getState().tiles[1]='retry';answer(g,'analyze',3);assert.equal(g.getState().lastLanding.type,'retry');assert(g.getState().boosts[0].retry);
console.log('Rules passed: stable shared board, no shuffle at initial start or ordinary turn, lap shuffle only after everyone departs, rewards, challenges and withdrawal');
g=game(0,100);g.getState().boosts[0].retry=true;answer(g,'know',1);answer(g,'know',1);assert(g.getState().boosts[0].retry);assert(answer(g,'know',0).retry);answer(g,'know',0,{retry:true});assert(!g.getState().boosts[0].retry);assert(!answer(g,'know',0).retry);
g=game(0,100);g.getState().boosts[0].streakActive=true;answer(g,'know',0);assert(!g.getState().boosts[0].streakActive);
for(const count of [2,3,4]){g=game(1,100,count);g.getState().progress=Array.from({length:count},(_,i)=>i?1:0);answer(g,'know',1);assert.equal(g.getState().lastLanding.type,'arena');assert.equal(g.getState().lastLanding.participants.length,count);assert(g.getState().actionPending);}
console.log('New rules passed: safety survives success, single retry, streak consumption, and 2–4 participant collisions');
g=game(1,100,3);g.getState().tiles[0]='duel';answer(g,'know',1,{partner:1,extraChallenge:true,challenge:'team'});assert(g.getState().actionPending);assert.equal(g.getState().lastLanding.type,'duel');assert.equal(g.getState().currentPlayer,0);
g=game(0,100);g.getState().tiles[0]='knowledge';answer(g,'know',1,{extraChallenge:true,challenge:'normal'});assert.equal(g.getState().lastLanding.type,'knowledge');
console.log('Chained landing passed: team and ordinary continuation keep the newly reached cell event');

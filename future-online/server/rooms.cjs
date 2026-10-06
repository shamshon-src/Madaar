const crypto=require('node:crypto');const {engine,question,grade,topics}=require('./rules.cjs');
class RoomError extends Error{constructor(message,status=409){super(message);this.status=status;}}
const must=(test,message,status)=>{if(!test)throw new RoomError(message,status);};
const clone=value=>JSON.parse(JSON.stringify(value));
function createRoom(uid,input,now=Date.now()){
  const setup=input.setup||{};must(topics.includes(setup.topic),'اختر موضوعًا من أسئلة الخطة البديلة لتجربة الأونلاين.');
  return {version:1,host:uid,members:[member(uid,input,now)],capacity:[2,3,4].includes(input.capacity)?input.capacity:2,setup:{mode:2,topic:setup.topic,topicCategory:String(setup.topicCategory||'worship'),targetScore:[20,30,50].includes(Number(setup.targetScore))?Number(setup.targetScore):30,language:setup.language==='en'?'en':'ar',category:Number(setup.category)||0,newLearner:!!setup.newLearner},phase:'waiting',questionCount:0,createdAt:now,updatedAt:now,events:{},attempts:[]};
}
function member(uid,input,now){const colors=['#8b5cf6','#f59e0b','#22c55e','#387db1'];return {uid,name:String(input.name||'').trim().slice(0,60)||'لاعب',color:colors.includes(input.color)?input.color:colors[0],joinedAt:now};}
function index(room,uid){const i=room.members.findIndex(member=>member.uid===uid);must(i>=0,'لست عضوًا في هذه الغرفة.',403);return i;}
function owner(room){return room.phase==='review'||room.phase==='cell'?room.review?.player??room.game.currentPlayer:room.game?.currentPlayer;}
function publicRoom(room,uid,code){const i=index(room,uid);const q=room.question?clone(room.question):null;if(q)for(const key of['correctIndex','rubric','modelAnswer','explanation','hint'])delete q[key];return {code,version:room.version,phase:room.phase,setup:room.setup,capacity:room.capacity,host:room.host===uid,me:i,owner:owner(room),members:room.members.map(({name,color})=>({name,color})),game:room.game||null,question:room.phase==='question'?q:null,deadline:room.deadline||null,serverTime:Date.now(),allowed:room.allowed||[],review:room.review||null,result:room.result||null,contentProvider:'prepared-server-test-bank',updatedAt:room.updatedAt};}
function finishQuestion(room,input,actor,now){
  const e=engine(room),pending=e.game.getPending(),q=room.question;
  const value=now>=room.deadline?0:grade(q,input);
  if(pending.duel){pending.duelWinner=value>0?actor:-1;e.game.prepareTurn(pending);}
  const turn=e.game.getPending(),result={serviceResult:true,turnId:turn.id,type:q.type,grade:value,steps:value,questionId:q.id};
  const outcome=e.game.resolveTurn(result);must(outcome,'تعذر إكمال الدور.');e.save();
  room.result={...result,correct:value>0,fullCorrect:value==={know:1,explore:2,analyze:3}[q.type]};
  room.review={player:outcome.player,landing:outcome.landing||null,retry:outcome.retry,questionId:q.id};room.phase='review';
  room.attempts.push({uid:room.members[actor].uid,ownerUid:room.members[outcome.player].uid,type:q.type,grade:value,questionId:q.id,at:now});
  if(room.game.finished&&!room.finalResults){const best=Math.max(...room.game.scores);room.finalResults=room.members.map((member,index)=>({uid:member.uid,sessionId:room.game.sessionId,topic:room.setup.topic,score:room.game.scores[index],won:room.game.scores[index]===best,rank:1+room.game.scores.filter(score=>score>room.game.scores[index]).length,finishedAt:now,contentProvider:'prepared-server-test-bank',verifiedBy:'madaar-online-server'}));}
}
function draw(room,options,now){
  const e=engine(room),s=e.game.getState(),landing=s.lastLanding;
  let type,turn={};
  if(s.awaitingRetry){type=room.question.type;turn.retry=true;}
  else if(s.actionPending){
    must(room.phase==='cell','راجع الإجابة وبطاقة الخلية أولًا.');const target=Number(options.target);
    turn.extraChallenge=true;
    switch(landing.type){
      case 'speed':type='know';turn={...turn,challenge:'speed',speedRun:true,challengePoints:0};break;
      case 'bigSolo':type=options.normal?['know','explore','analyze'][crypto.randomInt(3)]:'analyze';turn.challenge=options.normal?'normal':'bigSolo';break;
      case 'super':{const last=room.game.scores.indexOf(Math.min(...room.game.scores));must(target===s.currentPlayer||target===last,'اختر صاحب الدور أو اللاعب المتأخر.');type='analyze';turn.challenge='super';turn.targetPlayer=target;break;}
      case 'team':case 'duel':must(Number.isInteger(target)&&target>=0&&target<room.members.length&&target!==s.currentPlayer,'اختر لاعبًا آخر.');type=landing.type==='duel'?'know':['know','explore','analyze'][crypto.randomInt(3)];turn.challenge=landing.type;if(landing.type==='team')turn.partner=target;else{turn.duel=true;turn.duelOpponent=target;turn.participants=[s.currentPlayer,target];}break;
      case 'arena':type='know';turn={...turn,challenge:'arena',arena:true,duel:true,participants:landing.participants,duelOpponent:landing.opponent};break;
      default:throw new RoomError('تحدي غير مدعوم.');
    }
  }else{must(room.phase==='ready','أكمل الدور الحالي أولًا.');type=['know','explore','analyze'][crypto.randomInt(3)];}
  e.game.drawFromTile(-1,type,turn);e.save();
  if(!turn.retry)room.question=question(room,type);room.question.language=room.setup.language;
  room.allowed=turn.duel?turn.participants:turn.partner>=0?[s.currentPlayer,turn.partner]:[turn.targetPlayer??s.currentPlayer];
  room.deadline=now+(turn.duel||turn.speedRun?15:{know:25,explore:40,analyze:90}[type])*1000;
  room.hintUsers=[];room.phase='question';room.result=null;
}
function apply(room,uid,action,input={},now=Date.now()){
  room.events||={};room.attempts||=[];
  // Idempotency includes caller identity; one member cannot reuse another's event.
  const requestKey=crypto.createHash('sha256').update(uid+':'+String(input.requestId||'')).digest('hex');
  if(input.requestId&&room.events[requestKey])return room;
  if(action==='join'){
    if(!room.members.some(member=>member.uid===uid)){must(room.phase==='waiting','بدأت الغرفة؛ لا يمكن الانضمام الآن.');must(room.members.length<room.capacity,'الغرفة ممتلئة.');const next=member(uid,input,now);if(room.members.some(member=>member.color===next.color))next.color=['#8b5cf6','#f59e0b','#22c55e','#387db1'].find(color=>!room.members.some(m=>m.color===color));room.members.push(next);}
  }else{
    const actor=index(room,uid);
    if(action==='start'){must(room.host===uid,'بدء اللعبة للمضيف فقط.',403);must(room.phase==='waiting'&&room.members.length===room.capacity,'انتظر اكتمال العدد المختار.');const e=engine(room);e.save();room.phase='ready';}
    else if(action==='leave'){
      room.members.splice(actor,1);if(room.host===uid)room.host=room.members[0]?.uid||null;
      if(room.game){const copy=clone(room);copy.members.splice(actor,0,{uid,name:room.game.names[actor]});const e=engine(copy);e.game.removePlayer(actor);e.save();room.game=copy.game;room.pending=null;room.phase=room.game.finished?'finished':room.members.length<2?'paused':'ready';room.question=null;room.review=null;room.result=null;}
      if(!room.members.length)room.phase='closed';
    }
    else if(action==='draw'){must(actor===owner(room),'انتظر دورك لسحب البطاقة.',403);must(!room.game?.finished&&!room.game?.pausedForSolo,'انتهت اللعبة أو توقفت.');draw(room,input,now);}
    else if(action==='answer'){must(room.phase==='question'&&input.questionId===room.question.id,'السؤال انتهى أو تغيّر.');must(room.allowed.includes(actor),'لا يمكنك الإجابة في هذا الدور.',403);finishQuestion(room,input,actor,now);}
    else if(action==='timeout'){must(room.phase==='question'&&input.questionId===room.question.id&&now>=room.deadline,'لم ينته وقت السؤال.');finishQuestion(room,{},actor,now);}
    else if(action==='next'){
      must(actor===owner(room),'متابعة الدور لصاحبه فقط.',403);
      if(room.phase==='review'){if(room.game.finished)room.phase='finished';else if(room.review.retry||room.review.landing&&room.review.landing.type!=='card')room.phase='cell';else room.phase='ready';}
      else if(room.phase==='cell'){must(!room.game.actionPending,'ابدأ تحدي الخلية أولًا.');room.phase='ready';}else throw new RoomError('لا توجد مراجعة للمتابعة.');
    }
    else if(action==='hint'){must(room.phase==='question'&&room.allowed.includes(actor),'التلميح للمشارك في السؤال فقط.',403);must(now<room.deadline,'انتهى وقت السؤال.');must(!room.hintUsers.includes(actor),'استُخدم التلميح لهذا السؤال.');const e=engine(room);must(e.game.consumeHint(actor),'لا يوجد مصباح متاح.');e.save();room.hintUsers.push(actor);}
    else throw new RoomError('عملية غير مدعومة.',400);
  }
  if(input.requestId){room.events[requestKey]=now;const keys=Object.keys(room.events);if(keys.length>500)delete room.events[keys[0]];}
  room.version++;room.updatedAt=now;return room;
}
function help(room,uid,kind){index(room,uid);must(room.question,'لا يوجد سؤال.');if(kind==='hint'){must(room.hintUsers?.includes(index(room,uid)),'اطلب التلميح أولًا.');return {text:room.question.hint};}must(['review','cell','ready','finished'].includes(room.phase),'الشرح متاح بعد الإجابة فقط.');return {text:room.question.modelAnswer,source:room.question.source};}
module.exports={RoomError,createRoom,apply,publicRoom,help};

const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {RoomError,createRoom,apply,publicRoom,help}=require('./rooms.cjs');
function readEnv(){const file=path.join(__dirname,'.env');if(fs.existsSync(file))for(const line of fs.readFileSync(file,'utf8').split(/\r?\n/)){const match=line.match(/^([A-Z_]+)=(.*)$/);if(match&&!process.env[match[1]])process.env[match[1]]=match[2];}}
function createServer(settings={}){
  const backend=settings.backend||process.env.ONLINE_BACKEND||'local',rooms=new Map(),sessions=new Map(),locks=new Map(),originList=[...(process.env.ALLOWED_ORIGINS||'').split(',').map(value=>value.trim()).filter(Boolean),'http://127.0.0.1:5500','http://localhost:5500','http://127.0.0.1:5600','http://localhost:5600'];let db,auth;
  if(!['local','firebase'].includes(backend))throw Error('ONLINE_BACKEND must be local or firebase.');
  if(backend==='firebase'&&(!process.env.FIREBASE_PROJECT_ID||!process.env.FIREBASE_DATABASE_URL))throw Error('Set FIREBASE_PROJECT_ID and FIREBASE_DATABASE_URL in server/online/.env.');
  if(backend==='firebase'){const {initializeApp,applicationDefault}=require('firebase-admin/app'),{getDatabase}=require('firebase-admin/database'),{getAuth}=require('firebase-admin/auth');initializeApp({credential:applicationDefault(),projectId:process.env.FIREBASE_PROJECT_ID,databaseURL:process.env.FIREBASE_DATABASE_URL});db=getDatabase();auth=getAuth();}
  async function user(req){const token=(req.headers.authorization||'').replace(/^Bearer /,'');if(backend==='local'){const uid=sessions.get(token);if(!uid)throw new RoomError('جلسة اختبار الغرف غير صالحة.',401);return uid;}try{return (await auth.verifyIdToken(token,true)).uid;}catch{throw new RoomError('سجّل الدخول مجددًا للاتصال بالغرفة.',401);}}
  async function read(code){const room=backend==='local'?rooms.get(code):(await db.ref(`onlinePrivate/${code}`).get()).val();if(!room)throw new RoomError('الغرفة غير موجودة.',404);return room;}
  async function mutate(code,uid,action,input){
    if(backend==='local'){const task=(locks.get(code)||Promise.resolve()).catch(()=>{}).then(async()=>{const room=JSON.parse(JSON.stringify(await read(code)));apply(room,uid,action,input);rooms.set(code,room);return room;});locks.set(code,task);try{return await task;}finally{if(locks.get(code)===task)locks.delete(code);}}
    const transaction=await db.ref(`onlinePrivate/${code}`).transaction(room=>{if(!room)throw new RoomError('الغرفة غير موجودة.',404);return apply(room,uid,action,input);},undefined,false);return transaction.snapshot.val();
  }
  async function saveResults(room){
    if(backend!=='firebase'||!room.finalResults)return;
    const updates={};
    room.finalResults.forEach(({uid,...result})=>{const session=result.sessionId;updates[`users/${uid}/results/${session}`]=result;
      updates[`users/${uid}/progress/${crypto.createHash('sha256').update(room.setup.topic).digest('hex')}/${session}`]={topic:room.setup.topic,attempts:room.attempts.filter(attempt=>attempt.uid===uid),at:result.finishedAt};});
    await db.ref().update(updates);
  }
  const server=http.createServer(async(req,res)=>{
    const origin=req.headers.origin;if(origin&&!originList.includes(origin)){res.writeHead(403);res.end();return;}if(origin)res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Authorization,Content-Type');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Cache-Control','no-store');
    if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
    const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
    try{
      const url=new URL(req.url,'http://localhost'),route=url.pathname.replace(/^\/api\/online/,'');
      if(route==='/health'){send(200,{ok:true,backend,verifiedIdentity:backend==='firebase',contentProvider:'prepared-server-test-bank'});return;}
      let input={};if(req.method==='POST'){let body='';for await(const chunk of req){body+=chunk;if(body.length>32768)throw new RoomError('الطلب أكبر من الحد المسموح.',413);}try{input=JSON.parse(body||'{}');}catch{throw new RoomError('طلب غير صالح.',400);}}
      if(route==='/local-session'&&backend==='local'&&req.method==='POST'){const token=crypto.randomBytes(32).toString('hex'),uid=crypto.randomUUID();sessions.set(token,uid);send(200,{token,uid,local:true});return;}
      const uid=await user(req);
      if(route==='/create'&&req.method==='POST'){
        const room=createRoom(uid,input);let code;
        for(let count=0;count<20;count++){code=String(crypto.randomInt(100000,1000000));if(backend==='local'){if(rooms.has(code))continue;rooms.set(code,room);break;}const result=await db.ref(`onlinePrivate/${code}`).transaction(value=>value?undefined:room);if(result.committed)break;code=null;}
        if(!code)throw new RoomError('تعذر حجز رقم غرفة؛ أعد المحاولة.');send(200,{room:publicRoom(room,uid,code)});return;
      }
      const code=String(input.code||url.searchParams.get('code')||'');if(!/^\d{6}$/.test(code))throw new RoomError('أدخل رقم غرفة من ستة أرقام.',400);
      if(route==='/room'&&req.method==='GET'){const room=await read(code);const view=publicRoom(room,uid,code);await saveResults(room);send(200,{room:view});return;}
      if(route==='/help'&&req.method==='POST'){send(200,help(await read(code),uid,input.kind));return;}
      const actions=['join','start','draw','answer','timeout','next','hint','leave'];const action=route.slice(1);if(!actions.includes(action)||req.method!=='POST')throw new RoomError('مسار غير موجود.',404);
      if(typeof input.requestId!=='string'||input.requestId.length>100)throw new RoomError('معرف الحدث مطلوب.',400);
      if(input.text?.length>3000)throw new RoomError('الإجابة طويلة جدًا.',400);
      const room=await mutate(code,uid,action,input);await saveResults(room);
      send(200,action==='leave'?{left:true}:{room:publicRoom(room,uid,code),...(action==='hint'?help(room,uid,'hint'):{})});
    }catch(error){if(!(error instanceof RoomError))console.error('Online operation failed:',error.code||error.name);send(error.status||500,{error:error instanceof RoomError?error.message:'تعذر إكمال طلب الغرفة. راجع إعدادات الخادم.'});}
  });return {server,rooms,sessions};
}
if(require.main===module){readEnv();const {server}=createServer();server.listen(Number(process.env.PORT)||5700,process.env.HOST||'127.0.0.1',()=>console.log('Madaar online server is ready on port '+(process.env.PORT||5700)+' ('+(process.env.ONLINE_BACKEND||'local')+')'));}
module.exports={createServer};

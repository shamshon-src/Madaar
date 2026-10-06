const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {createServer}=require('../server/online/server.cjs');
function client(base,options={}){
  const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  const window={MadaarFirebaseConfig:{onlineMode:options.mode||'local',onlineApiBaseUrl:base},MadaarFirebase:{token:options.token||(()=>Promise.resolve('test'))}};
  const context={window,sessionStorage:storage,localStorage:storage,location:{href:'http://127.0.0.1:5600/Room.html',hostname:options.hostname||'127.0.0.1'},URL,AbortController,crypto:require('node:crypto').webcrypto,Error,TypeError,clearTimeout,setTimeout:options.fast?(fn=>setTimeout(fn,20)):setTimeout,fetch:(url,init)=>fetch(url,{...init,headers:{...init.headers,Origin:'http://127.0.0.1:5600'}})};
  vm.runInNewContext(fs.readFileSync(require.resolve('../online-service.js'),'utf8'),context);return window.MadaarOnline;
}
test('Two client sessions create, join, start and read the same room from port 5600',async()=>{
  const {server}=createServer({backend:'local'});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{const base=`http://127.0.0.1:${server.address().port}/api/online`,host=client(base),guest=client(base);
    const created=await host.call('create',{name:'Host',capacity:2,setup:{topic:'الصيام',targetScore:20}});assert.match(created.room.code,/^\d{6}$/);
    await guest.call('join',{code:created.room.code,name:'Guest'});const started=await host.call('start',{code:created.room.code});assert.equal(started.room.phase,'ready');
    const viewed=await guest.call('room',{code:created.room.code});assert.equal(viewed.room.members.length,2);assert.equal(viewed.room.game.sessionId,started.room.game.sessionId);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
test('Authentication that never completes releases the request with a timeout',async()=>{
  const api=client('http://127.0.0.1:5700/api/online',{mode:'firebase',token:()=>new Promise(()=>{}),fast:true});
  await assert.rejects(api.call('create'),/مهلة الدخول/);
});
test('A published page explains why a loopback room server cannot be shared',async()=>{
  await assert.rejects(client('http://127.0.0.1:5700/api/online',{hostname:'madaar-web-game.web.app'}).call('create'),/HTTPS مشترك/);
});

(() => {
  let localToken=sessionStorage.getItem('madaarOnlineLocalToken');
  const config=()=>window.MadaarFirebaseConfig||{};
  async function token(signal){
    if(config().onlineMode==='local'){
      if(!localToken){const response=await fetch(config().onlineApiBaseUrl.replace(/\/$/,'')+'/local-session',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal});if(!response.ok)throw Error('خادم اختبار الغرف غير متاح.');localToken=(await response.json()).token;sessionStorage.setItem('madaarOnlineLocalToken',localToken);}return localToken;
    }
    return window.MadaarFirebase.token();
  }
  async function call(action,input={}){
    const base=config().onlineApiBaseUrl?.replace(/\/$/,'');if(!base)throw Error('أضف عنوان خادم الغرف في firebase-config.js.');
    const endpoint=new URL(base,location.href),localHost=/^(localhost|127\.0\.0\.1|\[::1\])$/;
    if(!localHost.test(location.hostname)&&localHost.test(endpoint.hostname))throw Error('خادم الغرف مضبوط على جهاز محلي. يلزم عنوان HTTPS مشترك في firebase-config.js للعب بين أجهزة مختلفة.');
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
    try{
      const authorization=await Promise.race([token(controller.signal),new Promise((_,reject)=>controller.signal.addEventListener('abort',()=>reject(Object.assign(new Error('timeout'),{name:'AbortError'})),{once:true}))]);
      const get=action==='room',response=await fetch(base+'/'+action+(get?'?code='+encodeURIComponent(input.code):''),{method:get?'GET':'POST',headers:{Authorization:'Bearer '+authorization,'Content-Type':'application/json'},...(get?{}:{body:JSON.stringify({requestId:crypto.randomUUID(),...input})}),signal:controller.signal});
      if(response.status===403&&!response.headers.get('Content-Type')?.includes('application/json'))throw Error('عنوان الموقع غير مسموح في خادم الغرف. أضفه إلى ALLOWED_ORIGINS ثم أعد تشغيل الخادم.');
      const data=await response.json();if(!response.ok)throw Error(data.error||'تعذر الاتصال بالغرفة.');return data;
    }catch(error){if(error.name==='AbortError'||error instanceof TypeError)throw Error('تعذر الاتصال بخادم الغرف أو انتهت مهلة الدخول. شغّل خادم الغرف ثم أعد المحاولة.');throw error;}finally{clearTimeout(timer);}
  }
  const seat=()=>{try{return JSON.parse(sessionStorage.getItem('madaarOnlineSeat')||'null');}catch{return null;}};
  function remember(code){sessionStorage.setItem('madaarOnlineSeat',JSON.stringify({code}));localStorage.setItem('madaarRoomCode',code);}
  function subscribe(code,onRoom,onError){let stopped=false,timer;async function tick(){if(stopped)return;try{const data=await call('room',{code});if(!stopped)onRoom(data.room);}catch(error){if(!stopped)onError(error);}finally{if(!stopped)timer=setTimeout(tick,1000);}}tick();return()=>{stopped=true;clearTimeout(timer);};}
  function clear(){sessionStorage.removeItem('madaarOnlineSeat');localStorage.removeItem('madaarRoomCode');}
  function detachForLocalPlay(){const current=seat();clear();if(current)call('leave',{code:current.code}).catch(()=>{});}
  window.MadaarOnline={call,seat,remember,subscribe,detachForLocalPlay,async leave(){const current=seat();if(current)await call('leave',{code:current.code});clear();},clear};
})();

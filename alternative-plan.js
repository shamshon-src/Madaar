(() => {
  const $=id=>document.getElementById(id);
  const descriptions={normal:'لعبة جديدة تبدأ دون نقاط أو مصابيح.',lamp:'أجيبي اعرف صحيحًا للهبوط على خلية المصباح.',hint:'مصباح واحد جاهز؛ افتحي بطاقة ثم جرّبي زر التلميح.',multiplier:'رصيد 6 ومضاعفة فعالة. اعرف الصحيح يعطي نقطتين وخطوة واحدة.',retry:'رصيد 6 مع الأمان والمضاعفة. اخطئي أولًا ثم صححي: يصبح الرصيد 8 ويتحرك اللاعب خطوة واحدة.',lap:'موضع 22 ورصيد 16. استكشف الصحيح يكمل الدورة: نقطتان +3 للدورة =21، ثم الفوز.',team:'رصيد المشاركين 14 و13. اعرف الصحيح يعطي نقطة كاملة لكل منهما.',sharedwin:'رصيد المشاركين 18 و18، والهدف 20. استكشف الصحيح يحقق فوزًا مشتركًا.',streak:'أثر الإتقان فعّال. سؤالان عاديان مكتملان يمنحان +3 إضافية.',speed:'اعرف خلال 15 ثانية، ومكافأة الحدث نقطتان دون حركة إضافية.',bigSolo:'تحدي حلل: الإجابة المكتملة تمنح ثلاث نقاط دون حركة إضافية.',super:'اختاري صاحب الدور أو الأقل نقاطًا للإجابة؛ المكافأة للمجيب.',duel:'السؤال نفسه للطرفين. أول إجابة صحيحة تمنح نقطة؛ أول إجابة خاطئة تنهي الجولة بلا مكافأة.',arena:'لاعبان عند موضع الوصول نفسه؛ تظهر حلبة المناظرة بمكافأة نقطتين.',knowledge:'محطة معرفة تعرض ومضة تجريبية دون نقاط أو حركة إضافية.'};
  function update(){const scenario=$('test-game').value;const multi=['team','sharedwin','super','duel','arena'].includes(scenario);if(multi)$('test-mode').value='1';if(['speed','bigSolo','streak'].includes(scenario))$('test-mode').value='0';$('test-count').disabled=$('test-mode').value==='0';$('scenario-details').textContent=descriptions[scenario];}
  $('test-game').onchange=update;$('test-mode').onchange=update;update();
  const config=window.MadaarAI.getConfig();$('provider-mode').value=config.mode;$('provider-url').value=config.apiBaseUrl||'';$('provider-status').textContent=config.mode==='mock'?'الخطة البديلة تعمل دون مفاتيح أو اتصال خارجي.':'الحزمة المرفقة متصلة بخادم محلي؛ لا تُستخدم المحاكاة تلقائيًا عند فشله.';
  $('save-provider').onclick=()=>{localStorage.setItem('madaarProviderOverride',JSON.stringify({mode:$('provider-mode').value,apiBaseUrl:$('provider-url').value}));localStorage.setItem('madaarTestService',JSON.stringify({scenario:'normal'}));$('provider-notice').textContent='حُفظ اختيار الخدمة. يطبق على الأسئلة التالية.';};
  $('scenario-form').onsubmit=event=>{
    event.preventDefault();update();const scenario=$('test-game').value,mode=Number($('test-mode').value),count=mode===0?1:Number($('test-count').value);
    const provider=window.MadaarAI.getConfig();if(provider.mode==='remote'&&$('test-service').value!=='normal'){ $('scenario-details').textContent='نتائج السيناريوهات المصطنعة متاحة في المحاكاة فقط.';return; }
    const target=['lap','sharedwin'].includes(scenario)?20:Number($('test-target').value);
    for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(/^madaar(?:Setup|Players|PlayerColors|PlayerScores|TargetScore|GameState|Pending|Answer|ActiveQuestion|Hint-|MockQuestionCounter)/.test(key))localStorage.removeItem(key);}
    localStorage.setItem('madaarTestService',JSON.stringify({...provider,scenario:$('test-service').value}));
    localStorage.setItem('madaarSetup',JSON.stringify({mode,targetScore:target,topicCategory:$('test-category').value,topic:{worship:'الصيام',transactions:'الأمانة',belief:'أركان الإيمان',history:'السيرة النبوية',quran:'علوم القرآن',ethics:'الرفق'}[$('test-category').value],category:0,newLearner:false}));
    const names=Array.from({length:count},(_,i)=>`لاعب ${i+1}`);localStorage.setItem('madaarPlayers',JSON.stringify(names));localStorage.setItem('madaarPlayerColors',JSON.stringify(['#22cc66','#f0a92a','#e34d59','#387db1'].slice(0,count)));localStorage.setItem('madaarTargetScore',String(target));
    const state={sessionId:crypto.randomUUID(),names,scores:names.map(()=>0),progress:names.map(()=>0),laps:names.map(()=>0),boosts:names.map(()=>({lamps:0,multiplier:false,retry:false,streakActive:false,streak:0})),currentPlayer:0,tiles:Array(23).fill('card'),revealedTiles:[],history:[],firstLapReset:false,knowledgeSeen:0,lastMessage:'حالة اختبار: '+descriptions[scenario],turnMessage:''};
    if(scenario==='lamp')state.tiles[0]='lamp';
    if(scenario==='hint')state.boosts[0].lamps=1;
    if(['multiplier','retry'].includes(scenario)){state.scores[0]=6;state.boosts[0].multiplier=true;state.boosts[0].retry=scenario==='retry';}
    if(scenario==='lap'){state.scores[0]=16;state.progress[0]=22;}
    if(scenario==='streak')state.boosts[0].streakActive=true;
    if(scenario==='arena')state.progress[1]=1;
    if(['team','sharedwin'].includes(scenario)){state.scores[0]=scenario==='team'?14:18;state.scores[1]=scenario==='team'?13:18;}
    if(['team','sharedwin','speed','bigSolo','super','duel','knowledge'].includes(scenario)){
      const type=scenario==='sharedwin'?'team':scenario;state.lastLanding={type,index:0,player:0,label:descriptions[scenario],description:descriptions[scenario],color:'#0a3f70'};state.actionPending=type!=='knowledge';state.tiles[0]=type;state.revealedTiles=[0];
    }
    localStorage.setItem('madaarGameState',JSON.stringify(state));
    location.href=/^grade[0-3]$/.test($('test-service').value)?'CardAnalyze.html':scenario==='lap'?'CardExplore.html':scenario==='sharedwin'?'CardExplore.html?teamup=1&challenge=team':['lamp','hint','multiplier','retry','arena'].includes(scenario)?'CardKnow.html':'Board.html';
  };
})();

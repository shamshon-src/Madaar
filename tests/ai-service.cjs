const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const map=new Map(),context={localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,String(v))},window:{MadaarServiceConfig:{mode:'mock'}},setTimeout,clearTimeout,AbortController,fetch:async()=>{throw Error('offline')}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../ai-service.js'),'utf8'),context);
(async()=>{const api=context.window.MadaarAI;
context.window.MadaarServiceConfig={mode:'remote',provider:'supplied-curated-package',apiBaseUrl:'http://127.0.0.1:8001/api/ai'};
for(const host of ['localhost','127.0.0.1']){
map.set('madaarProviderOverride',JSON.stringify({mode:'remote',apiBaseUrl:`http://${host}:8000/api/ai`}));
assert.equal(api.getConfig().apiBaseUrl,'http://127.0.0.1:8001/api/ai');
assert.equal(JSON.parse(map.get('madaarProviderOverride')).apiBaseUrl,'http://127.0.0.1:8001/api/ai');
}
map.set('madaarProviderOverride',JSON.stringify({mode:'remote',apiBaseUrl:'https://example.com/api/ai'}));
assert.equal(api.getConfig().apiBaseUrl,'https://example.com/api/ai');
map.set('madaarProviderOverride',JSON.stringify({mode:'mock',apiBaseUrl:'http://localhost:8000/api/ai'}));
assert.equal(api.getConfig().mode,'mock');
map.delete('madaarProviderOverride');context.window.MadaarServiceConfig={mode:'mock'};
for(const category of ['worship','transactions','belief','history','quran','ethics'])for(const type of ['know','explore','analyze']){const question=await api.generateQuestion({type,topicCategory:category});const result=await api.evaluateAnswer({question,choice:question.correctIndex,text:question.modelAnswer});assert.equal(result.grade,{know:1,explore:2,analyze:3}[type]);}
for(const scenario of ['failure','timeout','invalid']){map.set('madaarTestService',JSON.stringify({scenario}));await assert.rejects(()=>api.generateQuestion({type:'know'}));}
map.set('madaarProviderOverride',JSON.stringify({mode:'remote',apiBaseUrl:'/api/ai'}));await assert.rejects(()=>api.generateQuestion({type:'know'}),/offline/);assert.equal(api.getConfig().mode,'remote');
console.log('AI service: six categories, three card types, failures, timeout, invalid response, remote without silent fallback passed');
})().catch(e=>{console.error(e);process.exitCode=1});

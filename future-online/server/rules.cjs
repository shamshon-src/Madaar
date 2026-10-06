const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const appRoot=path.resolve(__dirname,'../..');
const engineSource=fs.readFileSync(path.join(appRoot,'game-engine.js'),'utf8');
const bankSource=fs.readFileSync(path.join(appRoot,'question-bank.js'),'utf8');
const dictionary={};
for(const file of['localization.js','app-ui.js'])for(const match of fs.readFileSync(path.join(appRoot,file),'utf8').matchAll(/"([^"\n]+)":\s*"([^"\n]+)"/g))dictionary[match[1]]=match[2];
const bankContext={window:{MadaarI18n:{translate:text=>dictionary[text]||text}}};vm.runInNewContext(bankSource,bankContext);const bank=bankContext.window.MadaarQuestionBank;
function engine(room){
  const values=new Map(Object.entries({madaarSetup:JSON.stringify(room.setup),madaarPlayers:JSON.stringify(room.members.map(member=>member.name)),madaarTargetScore:String(room.setup.targetScore)}));
  if(room.game)values.set('madaarGameState',JSON.stringify(room.game));if(room.pending)values.set('madaarPendingTurn',JSON.stringify(room.pending));
  const localStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  const context={window:{},localStorage,crypto:{randomUUID:()=>crypto.randomUUID()},console};vm.runInNewContext(engineSource,context);
  return {game:context.window.MadaarGame,save(){room.game=JSON.parse(values.get('madaarGameState'));room.pending=JSON.parse(values.get('madaarPendingTurn')||'null');}};
}
function question(room,type){const q=bank.create(room.setup.topic,type,++room.questionCount,room.setup.language);if(!q)throw Error('الموضوع غير متاح في أسئلة اختبار الأونلاين.');q.id=crypto.randomUUID();return JSON.parse(JSON.stringify(q));}
function grade(q,input){if(q.type!=='analyze')return Number.isInteger(input.choice)&&input.choice===q.correctIndex?{know:1,explore:2}[q.type]:0;const text=String(input.text||'').normalize('NFKC').toLowerCase();const keywords=q.rubric.map(k=>q.language==='en'?dictionary[k]||k:k);const count=keywords.filter(key=>text.includes(key.toLowerCase())).length;return count===2?3:count===1?2:text.trim().split(/\s+/).length>=4?1:0;}
module.exports={engine,question,grade,topics:Object.keys(bank.lessons)};

const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const context={window:{}};for(const file of ['topic-catalog.js','question-bank.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
const {MadaarTopics:topics,MadaarQuestionBank:bank}=context.window;
let count=0;for(const topic of [...Object.values(topics.groups).flat(),'علوم القرآن'])for(const type of ['know','explore','analyze']){
 const q=bank.create(topic,type,++count);assert(q&&q.topic===topic);assert(q.modelAnswer.includes(q.rubric[0])&&q.modelAnswer.includes(q.rubric[1]));if(type!=='analyze'){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.equal(q.correctIndex,count%3);assert(q.explanation.includes(q.rubric[0]));}
}
assert.equal(bank.create('نص عشوائي','know',1),null);console.log(`Question bank: ${count} topic/card combinations, distinct answer choices, answer models, unknown topic rejection passed`);

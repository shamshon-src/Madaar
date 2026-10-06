const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');

test('English practice provides questions, answers, grading and help; Arabic retains its service', async () => {
  const values = new Map([['madaarLanguage', 'en']]);
  let remoteCalls = 0;
  const context = {
    window: { addEventListener() {} }, document: { title: '', addEventListener() {} }, crypto: require('node:crypto').webcrypto,
    localStorage: { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, String(value)) },
    setTimeout: callback => setTimeout(callback, 0), clearTimeout, AbortController,
    fetch: async () => { remoteCalls++; throw Error('offline'); }
  };
  vm.createContext(context);
  for (const file of ['localization.js', 'service-config.js', 'topic-catalog.js', 'question-bank.js', 'ai-service.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
  }
  const ui = fs.readFileSync(path.join(__dirname, '..', 'app-ui.js'), 'utf8');
  vm.runInContext(ui.slice(ui.indexOf('const languageKey'), ui.indexOf('const westernize')), context);
  const api = context.window.MadaarAI;
  assert.equal(api.getConfig().provider, 'english-practice');
  assert.equal(api.getConfig().mode, 'mock');
  for (const [category, topics] of Object.entries(context.window.MadaarTopics.groups)) {
    for (const topic of topics) {
    assert((await api.validateTopic({ topic, topicCategory: category })).available);
    for (const type of ['know', 'explore', 'analyze']) {
      const request = { topic, topicCategory: category, type, language: 'en' };
      const q = await api.generateQuestion(request);
      assert.equal(q.mock, true);
      assert.doesNotMatch(q.text, /[\u0621-\u064a]/);
      for (const option of q.options) assert.doesNotMatch(option, /[\u0621-\u064a]/);
      const result = await api.evaluateAnswer({ ...request, question: q, choice: q.correctIndex, text: q.modelAnswer });
      assert.equal(result.grade, { know: 1, explore: 2, analyze: 3 }[type]);
      assert.doesNotMatch(result.correctAnswer, /[\u0621-\u064a]/);
      for (const method of ['getHint', 'simplify']) {
        assert.doesNotMatch((await api[method]({ ...request, question: q })).text, /[\u0621-\u064a]/);
      }
    }
    }
  }
  assert.equal(remoteCalls, 0);
  values.set('madaarLanguage', 'ar');
  assert.equal(api.getConfig().mode, 'remote');
  await assert.rejects(() => api.generateQuestion({ type: 'know', language: 'ar' }), /offline/);
  assert.equal(api.getConfig().mode, 'remote');
  values.set('madaarLanguage', 'en');
  values.set('madaarProviderOverride', JSON.stringify({ mode: 'remote', apiBaseUrl: 'https://example.com/api/ai' }));
  assert.equal(api.getConfig().mode, 'remote');
  values.delete('madaarProviderOverride');
  context.window.MadaarServiceConfig.englishPractice = false;
  assert.equal(api.getConfig().mode, 'remote');
});

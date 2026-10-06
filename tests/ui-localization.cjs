const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

function runtime(language) {
  const callbacks = [];
  const context = {
    window: { addEventListener() {} },
    localStorage: { getItem: () => language },
    document: { addEventListener: (event, callback) => callbacks.push(callback) }
  };
  vm.createContext(context);
  vm.runInContext(read('localization.js'), context);
  return { context, callbacks };
}

test('Local profile page has English translations for visible text and accessible labels', () => {
  // Login.html does not load app-ui.js: the shared dictionary must stand alone.
  const { context } = runtime('en');
  const html = read('Login.html').replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/g, '');
  const values = [
    ...html.split(/<[^>]*>/),
    ...[...html.matchAll(/(?:placeholder|aria-label|alt)="([^"]+)"/g)].map(match => match[1])
  ];
  for (const value of values.map(value => value.trim()).filter(value => /[\u0621-\u064a]/.test(value))) {
    assert.doesNotMatch(context.window.MadaarI18n.message(value), /[\u0621-\u064a]/, value);
  }
});

for (const language of ['ar', 'en']) {
  test(`Account button and profile validation follow ${language}`, () => {
    const { context, callbacks } = runtime(language);
    const link = {};
    let account = false;
    context.document.querySelector = () => link;
    context.window.MadaarSession = { get: () => account ? { mode: 'account' } : null };
    vm.runInContext(read('account-view.js'), context);
    const render = callbacks.at(-1);
    render();
    assert.equal(link.textContent, language === 'en' ? 'Save your name' : 'احفظ اسمك');
    account = true;
    render();
    assert.equal(link.textContent, language === 'en' ? 'My local profile' : 'ملفي المحلي');

    let submit;
    const status = {};
    const elements = {
      'account': {},
      'login-preview-form': { addEventListener: (event, callback) => { submit = callback; } },
      'login-status': status
    };
    context.document.getElementById = id => elements[id];
    context.document.querySelector = () => ({ addEventListener: () => {} });
    context.window.MadaarSession.profile = () => null;
    context.window.MadaarSession.saveProfile = () => { throw Error('أدخل اسمك أولًا.'); };
    vm.runInContext(read('login-controller.js'), context);
    submit({ preventDefault() {} });
    assert.equal(status.textContent, language === 'en' ? 'Enter your name first.' : 'أدخل اسمك أولًا.');
  });
}

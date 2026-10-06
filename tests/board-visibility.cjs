const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');

function element() {
  const classes = new Set();
  return {
    dataset: {}, children: [], attributes: {},
    style: { gridRowStart: '7', gridColumnStart: '3', setProperty() {} },
    classList: { toggle(name, on) { on ? classes.add(name) : classes.delete(name); }, add() {}, contains: name => classes.has(name) },
    replaceChildren(...children) { this.children = children; },
    append(child) { this.children.push(child); },
    setAttribute(name, value) { this.attributes[name] = value; },
    querySelector() { return this.label ||= {}; }
  };
}

function board(positions) {
  const html = fs.readFileSync(path.join(__dirname, '../Board.html'), 'utf8');
  const source = html.slice(html.indexOf('function showCell('), html.indexOf('function renderPawns('));
  const cells = Array.from({ length: 23 }, element);
  const context = {
    cells, landingPositions: positions, state: { currentPlayer: 0 },
    game: { getTile: () => ({ type: 'lamp', color: '#f0a92a', label: 'Lamp' }) },
    tileEdge: () => 'bottom', tileIcons: { lamp: '' },
    document: { createElement: element, createTextNode: text => ({ textContent: text }) }
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return { cells, move(positions) { context.landingPositions = positions; }, render() { cells.forEach((_, index) => context.showCell(index)); } };
}

test('Tiles start covered, reveal on landing, and cover again after departure', () => {
  const b = board([-1]);
  b.render();
  assert(b.cells.every(cell => cell.classList.contains('board-hidden')));
  b.move([0]); b.render();
  assert(b.cells[0].classList.contains('board-revealed'));
  assert.equal(b.cells[0].dataset.tileType, 'lamp');
  b.move([3]); b.render();
  assert(b.cells[0].classList.contains('board-hidden'));
  assert.equal(b.cells[0].dataset.tileType, undefined);
  assert.notEqual(b.cells[0].attributes['aria-label'], 'Lamp');
  assert(b.cells[1].classList.contains('board-hidden'));
  assert(b.cells[2].classList.contains('board-hidden'));
  assert(b.cells[3].classList.contains('board-revealed'));
  b.move([-1]); b.render();
  assert(b.cells.every(cell => cell.classList.contains('board-hidden')));
});

test('A shared cell stays revealed until the last player leaves, including reload', () => {
  const b = board([4, 4]); b.render();
  b.move([7, 4]); b.render();
  assert(b.cells[4].classList.contains('board-revealed'));
  assert(b.cells[7].classList.contains('board-revealed'));
  b.move([7, 8]); b.render();
  assert(b.cells[4].classList.contains('board-hidden'));
  const reloaded = board([7, 8]); reloaded.render();
  assert(reloaded.cells[4].classList.contains('board-hidden'));
  assert(reloaded.cells[7].classList.contains('board-revealed'));
  assert(reloaded.cells[8].classList.contains('board-revealed'));
});

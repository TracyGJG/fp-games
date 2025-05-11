import readline from 'readline';

import { adjust, id, k, map, pipe, rep } from './base.js';
import Snake from './snake.js';

map((p) => (global[p] = base[p]));

// Mutable state
let State = Snake.initialState();

// Matrix operations
const Matrix = {
  make: (table) => rep(rep('.')(table.cols))(table.rows),
  set: (val) => (pos) => adjust(pos.y)(adjust(pos.x)(k(val))),
  addSnake: (state) => pipe(...map(Matrix.set('#'))(state.snake)),
  addApple: (state) => Matrix.set('O')(state.apple),
  addCrash: (state) => (state.snake.length == 0 ? map(map(k('X'))) : id),
  toString: (xsxs) => xsxs.map((xs) => xs.join(' ')).join('\r\n'),
  fromState: (state) =>
    pipe(
      Matrix.make,
      Matrix.addSnake(state),
      Matrix.addApple(state),
      Matrix.addCrash(state)
    )(state),
};

// Key events
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
const KEY_MAPPINGS = [
  ['NORTH', ['W', 'K', 'UP']],
  ['WEST', ['A', 'H', 'LEFT']],
  ['SOUTH', ['S', 'J', 'DOWN']],
  ['EAST', ['D', 'L', 'RIGHT']],
];
process.stdin.on('keypress', (_str, key) => {
  if (key.ctrl && key.name === 'c') process.exit();
  const keyMap = KEY_MAPPINGS.find(([_key, codes]) =>
    codes.includes(key.name.toUpperCase())
  );
  keyMap && (State = Snake.enqueue(State, Snake[keyMap[0]]));
});

// Game loop
const show = () =>
  console.log(`\x1Bc${Matrix.toString(Matrix.fromState(State))}`);
const step = () => (State = Snake.next(State));

// Main
setInterval(() => {
  step();
  show();
}, 100);

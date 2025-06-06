import readline from 'readline';

import { initialState, enqueue, next } from './tetris.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { CLI_KEY_MAPPINGS: KEY_MAPPINGS, ESCAPE, FRAME_DELAY, NEW_LINE } = CONSTANTS;

const clear = (..._) => `\x1Bc${_.join(NEW_LINE)}`;

// Mutable state
let state = initialState();
let timer;

// Game loop update
function update() {
  state = next(state);
  if (state.gameOver) {
    clearInterval(timer);
    console.log('     Game Over\n');
    process.exit();
  }
  console.log(clear(state.rendering));
}

// Key events
(() => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (_, key) => {
    if (key.name === ESCAPE) {
      clearInterval(timer);
      process.exit();
    }
    const action = KEY_MAPPINGS.find(([_, codes]) =>
      codes.includes(key.name?.toUpperCase())
    )?.[0];
    state = enqueue(state, action);
  });
})();

// Main
timer = setInterval(update, FRAME_DELAY);
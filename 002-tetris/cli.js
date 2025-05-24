import readline from 'readline';

import { present } from './matrix.js';

import { initialState, enqueue, next } from './tetris.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { CLI_KEY_MAPPINGS: KEY_MAPPINGS, FRAME_DELAY } = CONSTANTS;

// Mutable state
let state = initialState();
let timer;

// Game loop update
function update() {
  state = next(state);
  if (!present(state)) {
    clearInterval(timer);
    process.exit();
  }
}

// Key events
(() => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (_str, key) => {
    if (key.name === 'escape') process.exit();

    const action = KEY_MAPPINGS.find(([_key, codes]) =>
      codes.includes(key.name.toUpperCase())
    )?.[0];
    state = enqueue(state, action);
  });
})();

// Main
timer = setInterval(update, FRAME_DELAY);

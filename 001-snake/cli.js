import readline from 'readline';

import { present } from './matrix.js';

import { initialState, enqueue, next } from './snake.js';

import CONSTANTS from './constants.json' with { type: 'json' };

const { CLI_KEY_MAPPINGS: KEY_MAPPINGS, FRAME_RATE } = CONSTANTS;

// Mutable state
let state = initialState();

// Game loop update
function update() {
  console.log(present(state));
  state = next(state);
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
setInterval(update, FRAME_RATE);

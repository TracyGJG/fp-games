import { initialState, enqueue, next } from './tetris.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { WEB_KEY_MAPPINGS: KEY_MAPPINGS, FRAME_RATE, COLOURS, COLS, ROWS, BASE_HEIGHT } = CONSTANTS;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Mutable state
let state = initialState();

// Position helpers
const x = (c) => Math.round((c * canvas.width) / COLS);
const y = (r) => Math.round((r * (canvas.height - BASE_HEIGHT)) / ROWS);
const CELL_WIDTH = x(1);
const CELL_HEIGHT = y(1);

// Game loop draw
const draw = () => {
  // clear
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // base
  ctx.fillStyle = COLOURS.base;
  ctx.fillRect(0, canvas.height - BASE_HEIGHT, canvas.width, BASE_HEIGHT);
};


// Game loop update
const step = (t1 = 0) => (t2) => {
  if (t2 - t1 > FRAME_RATE) {
    state = next(state);
    draw();
    window.requestAnimationFrame(step(t2));
  } else {
    window.requestAnimationFrame(step(t1));
  }
};

// Key events
window.addEventListener('keydown', (e) => {
  const keyMap = KEY_MAPPINGS.find(([_key, codes]) =>
    codes.includes(e.key.toUpperCase())
  );
  keyMap && (state = enqueue(state, Tetris[keyMap[0]]));
});

// Main
// draw();
window.requestAnimationFrame(step(0));

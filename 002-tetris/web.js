// import { isFinished } from './matrix.js';

// import { initialState, enqueue, next } from './tetris.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { COLS, ROWS,
  WEB_KEY_MAPPINGS: KEY_MAPPINGS, 
  FRAME_DELAY, COLOURS,
  BASE_HEIGHT, BLOCK_COLOURS } = CONSTANTS;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CELL_INSET = 2;

// Mutable state
let state = {
  board: [
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
    [ 4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 5, 5, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 5, 5, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 6, 6, 6, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 6, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 7, 0, 0, 0],
    [ 0, 0, 0, 0, 7, 7, 7, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 0],
    [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
  ]
}


// Position helpers
const x = (c) => Math.round((c * canvas.width) / COLS);
const y = (r) => Math.round((r * (canvas.height - BASE_HEIGHT)) / ROWS);
const CELL_WIDTH = x(1);
const CELL_HEIGHT = y(1);

function drawBlock(x, y, typeNum) {
  const _x = x * CELL_WIDTH + CELL_INSET;
  const _y = y * CELL_HEIGHT + CELL_INSET;

  ctx.fillStyle = BLOCK_COLOURS[typeNum].fill;
  ctx.fillRect(_x + 1, _y + 1, CELL_WIDTH - (3 * CELL_INSET), CELL_HEIGHT - (3 * CELL_INSET));

  ctx.strokeStyle = BLOCK_COLOURS[typeNum].border;
  ctx.beginPath();
  ctx.rect(_x, _y, CELL_WIDTH - (2 * CELL_INSET), CELL_HEIGHT - (2 * CELL_INSET));
  ctx.stroke();
}

// Game loop draw
const draw = () => {
  // clear
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, canvas.width, (canvas.height - BASE_HEIGHT));

  // base
  ctx.fillStyle = COLOURS.base;
  ctx.fillRect(0, canvas.height - BASE_HEIGHT, canvas.width, BASE_HEIGHT);

  // blocks
  state.board.forEach((r, i) => {
    r.forEach((c, j) => c && drawBlock(j, i, c - 1))
  });
};

/*
// Game loop update
const update = (t1 = 0) => (t2) => {
  if (isFinished(state)) {
    console.log('GAME OVER');
  } else {
    if (t2 - t1 > FRAME_DELAY) {
      state = next(state);
      draw();
      window.requestAnimationFrame(update(t2));
    } else {
      window.requestAnimationFrame(update(t1));
    }
  }
};

// Key events
window.addEventListener('keydown', (e) => {
  const action = KEY_MAPPINGS.find(([_key, codes]) =>
    codes.includes(e.key.toUpperCase())
  )?.[0];
  state = enqueue(state, action);
});

// Main
window.requestAnimationFrame(update());
*/

draw();

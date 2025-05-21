import { isFinished } from './matrix.js';

import { initialState, enqueue, next } from './tetris.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { COLS, ROWS, 
  WEB_KEY_MAPPINGS: KEY_MAPPINGS, 
  FRAME_RATE, COLOURS, 
  BLOCK_COLOURS, BASE_HEIGHT } = CONSTANTS;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Mutable state
let state = initialState();

// Position helpers
const x = (c) => Math.round((c * canvas.width) / COLS);
const y = (r) => Math.round((r * (canvas.height - BASE_HEIGHT)) / ROWS);
const CELL_WIDTH = x(1);
const CELL_HEIGHT = y(1);

function drawBlock(x, y, typeNum) {
  const OFFSET = 2;
  const _x = x * CELL_WIDTH + OFFSET;
  const _y = y * CELL_HEIGHT + OFFSET;

  ctx.fillStyle = BLOCK_COLOURS[typeNum].fill;
  ctx.fillRect(_x + 1, _y + 1, CELL_WIDTH - (3 * OFFSET), CELL_HEIGHT - (3 * OFFSET));

  ctx.strokeStyle = BLOCK_COLOURS[typeNum].border;
  ctx.beginPath();
  ctx.rect(_x, _y, CELL_WIDTH - (2 * OFFSET), CELL_HEIGHT - (2 * OFFSET));
  ctx.stroke();
}

// Game loop draw
const draw = () => {
  // clear
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // base
  ctx.fillStyle = COLOURS.base;
  ctx.fillRect(0, canvas.height - BASE_HEIGHT, canvas.width, BASE_HEIGHT);

  // blocks
  // drawBlock(0, 0, 0);
  // drawBlock(0, 1, 1);
  // drawBlock(1, 0, 2);
  // drawBlock(1, 1, 3);
  // drawBlock(2, 2, 4);
  // drawBlock(3, 3, 5);
  // drawBlock(4, 4, 6);
  // drawBlock(5, 5, 0);
  // drawBlock(6, 6, 1);
  // drawBlock(7, 7, 2);
  // drawBlock(8, 8, 3);
  // drawBlock(9, 9, 4);
  // drawBlock(8, 10, 5);
  // drawBlock(7, 11, 6);
  // drawBlock(6, 12, 0);
  // drawBlock(5, 13, 1);
  // drawBlock(4, 14, 2);
  // drawBlock(3, 15, 3);
  // drawBlock(2, 16, 4);
  // drawBlock(1, 17, 5);
  // drawBlock(0, 18, 6);
  // drawBlock(1, 19, 0);
  // drawBlock(2, 20, 1);
  // drawBlock(3, 21, 2);

  console.log(JSON.stringify(state.board));

  state.board.forEach((r, i) => {
    r.forEach((c, j) => c && drawBlock(j, i, c - 1))
  });
};


// Game loop update
const update = (t1 = 0) => (t2) => {
  if (isFinished(state)) {
    console.log('GAME OVER');
  } else {
    if (t2 - t1 > FRAME_RATE) {
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
// draw();
window.requestAnimationFrame(
  update(0)
);

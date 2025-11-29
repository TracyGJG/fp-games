import { initialState, enqueue, next } from './tetris.js';

import CONSTANTS from './constants.json' with { type: 'json' };

const {
  COLS,
  ROWS,
  WEB_KEY_MAPPINGS: KEY_MAPPINGS,
  FRAME_DELAY,
  COLOURS,
  BASE_HEIGHT,
  BLOCK_COLOURS,
} = CONSTANTS;

const domScore = document.querySelector('h1');
const domGameOver = document.querySelector('h2');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CELL_INSET = 2;
const IS_LANDSCAPE = window.matchMedia("orientation: landscape").matches;

// Mutable state
let state = initialState();

// Position helpers
const x = (c) => Math.round((c * canvas.width) / COLS);
const y = (r) => Math.round((r * (canvas.height - BASE_HEIGHT)) / ROWS);
const CELL_WIDTH = x(1);
const CELL_HEIGHT = y(1);
const X_OFFSET = x(0.5);
const Y_OFFSET = y(0.5);

function drawBlock(x, y, typeNum) {
  const _typeNum = Math.min(typeNum, 7);
  const _x = x * CELL_WIDTH + CELL_INSET;
  const _y = y * CELL_HEIGHT + CELL_INSET;

  ctx.fillStyle = BLOCK_COLOURS[_typeNum].fill;
  ctx.fillRect(
    _x + 1,
    _y + 1,
    CELL_WIDTH - 3 * CELL_INSET,
    CELL_HEIGHT - 3 * CELL_INSET
  );

  ctx.strokeStyle = BLOCK_COLOURS[_typeNum].border;
  ctx.beginPath();
  ctx.rect(_x, _y, CELL_WIDTH - 2 * CELL_INSET, CELL_HEIGHT - 2 * CELL_INSET);
  ctx.stroke();
}

// Game loop draw
const draw = () => {
  // clear
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height - BASE_HEIGHT);

  // finish line
  ctx.fillStyle = COLOURS.finish;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < COLS; col++) {
      ctx.fillRect(
        col * CELL_WIDTH + (row % 2) * X_OFFSET,
        row * Y_OFFSET,
        X_OFFSET,
        Y_OFFSET
      );
    }
  }

  // base
  ctx.fillStyle = COLOURS.base;
  ctx.fillRect(0, canvas.height - BASE_HEIGHT, canvas.width, BASE_HEIGHT);

  // player
  const { x, y, piece } = state.player;
  piece.forEach((row, i) => {
    row.forEach((col, j) => {
      col && drawBlock(j + x, i + y, col - 1);
    });
  });

  // blocks
  state.board.forEach((r, i) => {
    r.forEach((col, j) => col > 0 && drawBlock(j, i, col - 1));
  });

  // Score
  domScore.innerText = `Score: ${state.score}`;
};

// Game loop update
const update =
  (t1 = 0) =>
  (t2) => {
    if (t2 - t1 > FRAME_DELAY) {
      state = next(state);
      if (state.gameOver) {
        domGameOver.removeAttribute('hidden');
      } else {
        draw();
        window.requestAnimationFrame(update(t2));
      }
    } else {
      window.requestAnimationFrame(update(t1));
    }
  };

// Key events
window.addEventListener('keydown', (e) => {
  const action = KEY_MAPPINGS.find(([_key, codes]) =>
    codes.includes(e.key.toUpperCase())
  )?.[0];
  state = enqueue(state, action);
});

if (!IS_LANDSCAPE) {
  const controls = document.getElementsByClassName('controls')[0];
  controls.addEventListener('click', (evt) => {
    if (evt.target.tagName === 'BUTTON') {
      state = enqueue(state, evt.target.dataset.direction);
    }
  });
}

// Main Timer
window.requestAnimationFrame(update());

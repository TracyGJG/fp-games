import { initialState, enqueue, next } from './snake.js';

import CONSTANTS from './constants.json' with { type: 'json' };

const {
  COLS,
  ROWS,
  WEB_KEY_MAPPINGS: KEY_MAPPINGS,
  FRAME_DELAY,
  COLOURS,
  INITIAL_LIVES,
} = CONSTANTS;

const domLives = document.querySelector('#lives');
const domScore = document.querySelector('#score');
const domGameOver = document.querySelector('h2');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const FULL_CIRCLE = 2 * Math.PI;
const IS_LANDSCAPE = window.matchMedia("(orientation: landscape)").matches;


// Mutable state
let state = initialState();

// Position helpers
const x = (c) => Math.round((c * canvas.width) / (IS_LANDSCAPE ? COLS : ROWS));
const y = (r) => Math.round((r * canvas.height) / (IS_LANDSCAPE ? ROWS : COLS));
const CELL_WIDTH = x(1);
const CELL_HEIGHT = y(1);
const X_OFFSET = x(0.5);
const Y_OFFSET = y(0.5);

// Game loop draw
const draw = () => {
  // clear
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw snake
  ctx.fillStyle = COLOURS.snake;
  state.snake.map((p) => ctx.fillRect(x(p.x), y(p.y), CELL_WIDTH, CELL_HEIGHT));

  // draw apples
  ctx.fillStyle = COLOURS.apple;
  ctx.beginPath();
  ctx.ellipse(
    x(state.apple.x) + X_OFFSET,
    y(state.apple.y) + Y_OFFSET,
    X_OFFSET,
    Y_OFFSET,
    FULL_CIRCLE,
    0,
    FULL_CIRCLE
  );
  ctx.fill();

  // add crash
  if (!state.snake.length) {
    ctx.fillStyle = COLOURS.crash;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // add header
  const lives = 'X'.repeat(state.lives).padStart(INITIAL_LIVES, '_');
  domLives.innerText = `Lives: ${lives}`;
  const score = `${state.score}`.padStart(6, '0');
  domScore.innerText = `Score: ${score}`;
  return state.lives;
};

// Game loop update
const update =
  (t1 = 0) =>
  (t2) => {
    if (t2 - t1 > FRAME_DELAY) {
      state = next(state);
      if (draw()) {
        window.requestAnimationFrame(update(t2));
      } else {
        domGameOver.removeAttribute('hidden');
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

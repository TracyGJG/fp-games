import Snake from './snake.js';
import CONSTANTS from './constants.json' with { type: 'json' };

const { WEB_KEY_MAPPINGS: KEY_MAPPINGS, FRAME_RATE, COLOURS } = CONSTANTS;
const FULL_CIRCLE = 2 * Math.PI;

const { initialState, enqueue, next } = Snake;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// Mutable state
let state = initialState();
// Position helpers
const x = (c) => Math.round((c * canvas.width) / state.cols);
const y = (r) => Math.round((r * canvas.height) / state.rows);
const X_OFFSET = x(0.5);
const Y_OFFSET = y(0.5);
const CELL_WIDTH = x(1);
const CELL_HEIGHT = y(1);

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
};

// Game loop update
const step = (t1) => (t2) => {
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
  keyMap && (state = enqueue(state, Snake[keyMap[0]]));
});

// Main
draw();
window.requestAnimationFrame(step(0));

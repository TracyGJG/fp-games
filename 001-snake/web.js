import Snake from './snake.js';

const { EAST, NORTH, SOUTH, WEST, initialState, enqueue, next } = Snake;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Mutable state
let state = initialState();

// Position helpers
const x = (c) => Math.round((c * canvas.width) / state.cols);
const y = (r) => Math.round((r * canvas.height) / state.rows);
const X_OFFSET = x(0.5);
const Y_OFFSET = y(0.5);
const FULL_CIRCLE = 2 * Math.PI;

// Game loop draw
const draw = () => {
  // clear
  ctx.fillStyle = 'rgb(35,35,35)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw snake
  ctx.fillStyle = 'rgb(0,200,50)';
  state.snake.map((p) => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)));

  // draw apples
  ctx.fillStyle = 'rgb(255,50,0)';
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
  if (state.snake.length == 0) {
    ctx.fillStyle = 'rgb(0,0, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

// Game loop update
const step = (t1) => (t2) => {
  if (t2 - t1 > 100) {
    state = next(state);
    draw();
    window.requestAnimationFrame(step(t2));
  } else {
    window.requestAnimationFrame(step(t1));
  }
};

// Key events
const KEY_MAPPINGS = [
  [NORTH, ['W', 'H', 'ARROWUP']],
  [WEST, ['A', 'J', 'ARROWLEFT']],
  [SOUTH, ['S', 'K', 'ARROWDOWN']],
  [EAST, ['D', 'L', 'ARROWRIGHT']],
];
window.addEventListener('keydown', (e) => {
  const keyMap = KEY_MAPPINGS.find(([_key, codes]) =>
    codes.includes(e.key.toUpperCase())
  );
  keyMap && (state = enqueue(state, keyMap[0]));
});

// Main
draw();
window.requestAnimationFrame(step(0));

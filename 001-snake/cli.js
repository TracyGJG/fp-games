import readline from 'readline';
import Snake from './snake.js';
import Matrix from './matrix.js';
import CONSTANTS from './constants.json' with { type: 'json' };

const { CLI_KEY_MAPPINGS: KEY_MAPPINGS, FRAME_RATE } = CONSTANTS;


// Mutable state
let State = Snake.initialState();

// Game loop update
function update() {
  console.log(`\x1Bc${Matrix.toString(Matrix.fromState(State))}`);
  State = Snake.next(State);
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
    State = Snake.enqueue(State, action);
  });
})();

// Main
setInterval(update, FRAME_RATE);

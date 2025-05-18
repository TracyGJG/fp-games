import CONSTANTS from './constants.json' with { type: 'json' };

// Initial state
const initialState = () => ({
  cols: 10,
  rows: 18,
});

const enqueue = () => {};
const next = () => {};

const Tetris = { initialState, enqueue, next};
export default Tetris;
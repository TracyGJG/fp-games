import { adjust, id, k, map, pipe, rep } from './base.js';

import CONSTANTS from './constants.json' with { type: 'json' };

const { EMPTY, NEW_LINE, APPLE, BACKGROUND, CRASH, SNAKE, INITIAL_LIVES } = CONSTANTS;

const chars = (_) => `\x1B[1;${_}`;

const _APPLE = chars(APPLE);
const _CRASH = chars(CRASH);
const _SNAKE = chars(SNAKE);
const _BACKGROUND = chars(BACKGROUND);

const make = ({cols, rows}) => rep(rep(_BACKGROUND)(cols))(rows);
const setValue = (val) => (pos) => adjust(pos.y)(adjust(pos.x)(k(val)));
const addSnake = (state) => pipe(...map(setValue(_SNAKE))(state.snake));
const addApple = (state) => setValue(_APPLE)(state.apple);
const addCrash = (state) =>
  state.snake.length ? id : map(map(k(_CRASH)));

const matrixToString = (xsxs) => xsxs.map((xs) => xs.join(EMPTY)).join(NEW_LINE);
const matrixFromState = (state) =>
  pipe(
    make,
    addSnake(state),
    addApple(state),
    addCrash(state)
  )(state);

export default (state) => {
  const lives = 'X'.repeat(state.lives).padStart(INITIAL_LIVES, '_');
  const score = `${state.score}`.padStart(6, '0');
  return `Lives: ${lives}${'  '.repeat(28)}Score: ${score}
${matrixToString(matrixFromState(state))}`;
};
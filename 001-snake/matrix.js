import { adjust, id, k, map, pipe, rep } from './base.js';

import CONSTANTS from './constants.json' with { type: 'json' };

const { NEW_LINE, APPLE, BACKGROUND, CRASH, SNAKE } = CONSTANTS;

const chars = (_) => `\x1B[1;${_}`;
const clear = (_) => `\x1Bc${_}`;

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

export const matrixToString = (xsxs) => xsxs.map((xs) => clear(xs.join('')).join(NEW_LINE));
export const matrixFromState = (state) =>
    pipe(
      make,
      addSnake(state),
      addApple(state),
      addCrash(state)
    )(state);

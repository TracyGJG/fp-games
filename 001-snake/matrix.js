import { adjust, id, k, map, pipe, rep } from './base.js';

import CONSTANTS from './constants.json' with { type: 'json' };

const { NEW_LINE, APPLE, CELL, CRASH, SNAKE } = CONSTANTS;

const chars = (_) => `\x1B[1;${_}`;
const clear = (_) => `\x1Bc${_}`;

const _APPLE = chars(APPLE);
const _CELL = chars(CELL);
const _CRASH = chars(CRASH);
const _SNAKE = chars(SNAKE);

const make = ({cols, rows}) => rep(rep(_CELL)(cols))(rows);
const _toString = (xsxs) => xsxs.map((xs) => xs.join('')).join(NEW_LINE);
const _set = (val) => (pos) => adjust(pos.y)(adjust(pos.x)(k(val)));
const addSnake = (state) => pipe(...map(_set(_SNAKE))(state.snake));
const addApple = (state) => _set(_APPLE)(state.apple);
const addCrash = (state) =>
    state.snake.length ? id : map(map(k(_CRASH)));
const fromState = (state) =>
    pipe(
      make,
      addSnake(state),
      addApple(state),
      addCrash(state)
    )(state);
  
export const present = (state) => {
  const isFinished = false;
  console.log(clear(_toString(fromState(state))));
  isFinished && console.log('GAME OVER');
  return isFinished;
};
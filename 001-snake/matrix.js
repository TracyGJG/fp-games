import { adjust, id, k, map, pipe, rep } from './base.js';
import CONSTANTS from './constants.json' with { type: 'json' };

const { NEW_LINE, APPLE, CELL, CRASH, SNAKE, SPACE } = CONSTANTS;

const chars = (_) => `\x1B[1;${_}`;

const Matrix = {
  make: ({cols, rows}) => rep(rep(chars(CELL))(cols))(rows),
  toString: (xsxs) => xsxs.map((xs) => xs.join(SPACE)).join(NEW_LINE),
  set: (val) => (pos) => adjust(pos.y)(adjust(pos.x)(k(val))),
  addSnake: (state) => pipe(...map(Matrix.set(chars(SNAKE)))(state.snake)),
  addApple: (state) => Matrix.set(chars(APPLE))(state.apple),
  addCrash: (state) =>
    state.snake.length ? id: map(map(k(chars(CRASH)))),
  fromState: (state) =>
    pipe(
      Matrix.make,
      Matrix.addSnake(state),
      Matrix.addApple(state),
      Matrix.addCrash(state)
    )(state),
};

export default Matrix;

import {
  append,
  dropFirst,
  dropLast,
  merge,
  mod,
  pointEq,
  prop,
  rnd,
  rndPos,
  spec,
} from './base.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { COLS, ROWS, MOVES, NON_SNAKE } = CONSTANTS;

// Predicates
const willEat = (state) => pointEq(nextHead(state))(state.apple);
const willCrash = (state) => state.snake.find(pointEq(nextHead(state)));
const validMove = (move) => (state) => move &&
  ((state.moves[0].x + MOVES[move].x) || (state.moves[0].y + MOVES[move].y));

// Next values based on state
const nextMoves = (state) =>
  state.moves.length > 1 ? dropFirst(state.moves) : state.moves;
const nextApple = (state) => (willEat(state) ? rndPos(state) : state.apple);
const nextHead = (state) => {
  const modAxis = (axis, coord) =>
    mod(state[axis])(state.snake[0][coord] + state.moves[0][coord]);
  return state.snake.length
    ? {
        x: modAxis('cols', 'x'),
        y: modAxis('rows', 'y'),
      }
    : rndPos(state);
};
const nextSnake = (state) =>
  willCrash(state)
    ? NON_SNAKE
    : [nextHead(state)].concat(
        willEat(state) ? state.snake : dropLast(state.snake)
      );
const initialMove = () => {
  const moves = Object.keys(MOVES);
  return [MOVES[moves[Math.floor(Math.random() * moves.length)]]];
};

// Initial state
export const initialState = () => ({
  cols: COLS,
  rows: ROWS,
  moves: initialMove(),
  snake: NON_SNAKE,
  apple: { x: rnd(0)(COLS), y: rnd(0)(ROWS) },
});

// Update state
export const next = spec({
  rows: prop('rows'),
  cols: prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple,
});

export const enqueue = (state, move) => validMove(move)(state)
  ? merge(state)({ moves: append(state.moves)(MOVES[move]) })
  : state;

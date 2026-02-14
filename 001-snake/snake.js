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

import Matrix from './matrix.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { MOVES, NON_SNAKE, INITIAL_LIVES, INITIAL_SCORE, POINTS } = CONSTANTS;
let _cols;
let _rows;
let points = 10;

// Predicates
const willEat = (state) => pointEq(nextHead(state))(state.apple);
const willCrash = (state) => state.snake.find(pointEq(nextHead(state)));
const validMove = (move) => (state) =>
  move &&
  (state.moves[0].x + MOVES[move].x || state.moves[0].y + MOVES[move].y);

// Next values based on state
const nextMoves = (state) =>
  state.moves.length > 1 ? dropFirst(state.moves) : state.moves;
const nextApple = (state) => {
  if (willEat(state)) {
    state.snake.length > _rows && (points = POINTS.LOW);
    state.snake.length > _cols && (points = POINTS.MED);
    state.snake.length > _cols + _rows && (points = POINTS.HIGH);
    state.score += points;
    return rndPos(state);
  }
  return state.apple;
};
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
const nextSnake = (state) => {
  if (willCrash(state)) {
    state.lives -= 1;
    points = POINTS.INC;
    console.log(`nextSnake ${state.lives}\n`);
    return NON_SNAKE;
  } else {
    return [nextHead(state)].concat(
      willEat(state) ? state.snake : dropLast(state.snake),
    );
  }
};
const initialMove = () => {
  const moves = Object.keys(MOVES);
  return [MOVES[moves[Math.floor(Math.random() * moves.length)]]];
};

// Initial state
export const initialState = (longSide, shortSide) => {
  _cols = longSide;
  _rows = shortSide;

  return {
    score: INITIAL_SCORE,
    lives: INITIAL_LIVES,
    cols: _cols,
    rows: _rows,
    moves: initialMove(),
    snake: NON_SNAKE,
    apple: { x: rnd(0)(_cols), y: rnd(0)(_rows) },
  };
};

// Update state
export const next = spec({
  rows: prop('rows'),
  cols: prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple,
  score: prop('score'),
  lives: prop('lives'),
  rendering: Matrix,
});

export const enqueue = (state, move) =>
  validMove(move)(state)
    ? merge(state)({ moves: append(state.moves)(MOVES[move]) })
    : state;

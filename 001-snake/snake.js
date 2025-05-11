import {
  dropFirst,
  dropLast,
  merge,
  mod,
  prop,
  rnd,
  spec,
} from './base.js';
import CONSTANTS from './constants.json' with { type: 'json' };

const { NORTH, EAST, SOUTH, WEST, INITIAL_MOVE, NON_SNAKE } = CONSTANTS;

// Point operations
const pointEq = (p1) => (p2) => p1.x == p2.x && p1.y == p2.y;

// Booleans
const willEat = (state) => pointEq(nextHead(state))(state.apple);
const willCrash = (state) => state.snake.find(pointEq(nextHead(state)));
const validMove = (move) => (state) =>
  state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0;

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

// Randomness
const rndPos = (table) => ({
  x: rnd(0)(table.cols - 1),
  y: rnd(0)(table.rows - 1),
});

// Initial state
const initialState = (cols= 40, rows = 28) => ({
  cols,
  rows,
  moves: INITIAL_MOVE,
  snake: NON_SNAKE,
  apple: { x: rnd(0)(cols), y: rnd(0)(rows) },
});

const next = spec({
  rows: prop('rows'),
  cols: prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple,
});

const enqueue = (state, move) =>
  validMove(move)(state)
    ? merge(state)({ moves: state.moves.concat([move]) })
    : state;

const Snake = { NORTH, EAST, SOUTH, WEST, initialState, enqueue, next };
export default Snake;

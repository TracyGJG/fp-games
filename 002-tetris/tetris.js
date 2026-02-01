import {
  add,
  all,
  any,
  both,
  concat,
  eq,
  find,
  filter,
  flip,
  gt,
  id,
  ifelse,
  k,
  lt,
  map,
  not,
  pipe,
  prop,
  rep,
} from './general.js';

import Matrix from './matrix.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const {
  COLS,
  ROWS,
  ROW_SCORE,
  MOVES,
  WAIT,
  CONDENCE,
  HEIGHT,
  INITIAL_SCORE,
  WIDTH,
} = CONSTANTS;

const movePlayer = (f) => (s) => {
  if (isAnimating(s)) return s;
  let pre = Matrix.mountBoard(s.player)(s.board);
  let post = Matrix.mountBoard(f(s.player))(s.board);
  let valid = Matrix.combine(pre) === Matrix.combine(post);
  return { ...s, player: valid ? f(s.player) : s.player };
};
const Moves = {
  moveLeft: movePlayer(Matrix.movePlayer(MOVES.LEFT)),
  moveRight: movePlayer(Matrix.movePlayer(MOVES.RIGHT)),
  moveDown(s) {
    if (isAnimating(s)) return s;
    let s2 = movePlayer(Matrix.movePlayer(MOVES.DOWN))(s);
    return s2.player === s.player
      ? {
          ...s,
          score: s.score + s.player.points,
          board: Matrix.mountBoard(s.player)(s.board),
          player: Matrix.makePlayer(),
        }
      : s2;
  },
  rotate(s) {
    if (isAnimating(s)) return s;
    return {
      ...s,
      player: find(
        (f) =>
          Matrix.combine(Matrix.mountBoard(f(s.player))(s.board)) ==
          Matrix.combine(Matrix.mountBoard(s.player)(s.board)),
      )([
        Matrix.rotatePlayer,
        pipe(Matrix.movePlayer(MOVES.RIGHT), Matrix.rotatePlayer),
        pipe(Matrix.movePlayer(MOVES.LEFT), Matrix.rotatePlayer),
        pipe(Matrix.movePlayer(MOVES.RIGHT2), Matrix.rotatePlayer),
        pipe(Matrix.movePlayer(MOVES.LEFT2), Matrix.rotatePlayer),
        id,
      ])(s.player),
    };
  },
};
const swipeCompleteRows = (s) => ({
  ...s,
  board: s.board.map(
    ifelse(all(both(flip(gt)(0))(flip(lt)(10))))(k(CONDENCE))(id),
  ),
});
const clearBoard = (s) => {
  let remains = filter(any(not(eq(-1))))(s.board);
  const isClear = !Math.max(...remains.flat());
  let count = s.board.length - remains.length;
  s.score += ROW_SCORE[count] * (isClear ? 2 : 1);
  let newlines = rep(Matrix.row(0)(remains))(count);
  let board = concat(newlines)(remains);
  return { ...s, board };
};
const isAnimating = pipe(prop('board'), any(any(flip(gt)(9))));
const animatePieces = (s) => ({
  ...s,
  board: map(
    map(
      pipe(
        ifelse(flip(gt)(WIDTH))(add(1))(id),
        ifelse(flip(gt)(HEIGHT))(k(-1))(id),
      ),
    ),
  )(s.board),
});
const timeToMove = (s) => !(s.time % s.wait);
const nextTimeFrame = (s) => ({ ...s, time: s.time + 1 });
const maybeMoveDown = ifelse(isAnimating)(id)(
  ifelse(timeToMove)(Moves.moveDown)(id),
);
const endOfGame = Matrix.gameFinished;

const renderBoard = (s) => {
  const score = `${s.score}`.padStart(6, ' ');
  return { ...s, rendering: `   Score:  ${score}\n${Matrix.rendering(s)}` };
};

export const initialState = k({
  score: INITIAL_SCORE,
  time: 0,
  wait: WAIT,
  board: Matrix.makeGame(ROWS)(COLS),
  player: Matrix.makePlayer(),
});

export const next = pipe(
  animatePieces,
  nextTimeFrame,
  maybeMoveDown,
  clearBoard,
  swipeCompleteRows,
  endOfGame,
  renderBoard,
);

export const enqueue = (state, action) =>
  action ? Moves[action](state) : state;

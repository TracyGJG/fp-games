import {
  add,
  all,
  any,
  append,
  both,
  concat,
  eq,
  flip,
  filter,
  find,
  gt,
  id,
  ifelse,
  join,
  k,
  lt,
  map,
  mapi,
  mirror,
  not,
  pipe,
  prop,
  reduce,
  rep,
  transpose,
} from './general.js';

import { chars, clear, pieceToStr, randPieces } from './matrix.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { COLS, CONDENCE, EMPTY, INITIAL_POSITION, MOVES, NEW_LINE, ROWS, WAIT } = CONSTANTS;


const swipe = (s) => ({
  ...s,
  board: s.board.map(
    ifelse(all(both(flip(gt)(0))(flip(lt)(10))))(
      k(CONDENCE)
    )(id)
  ),
});
const validMove = (move, _state) => !!move;


const sumMatricies = pipe(map(reduce(add)(0)), reduce(add)(0));
const matrixToString = (x) => pipe(map(join(EMPTY)), join(NEW_LINE))(x);
const prepareBase = (m) => append(prepareRow(chars('base'))(m))(m);
const prepareRow = (x) => (m) => rep(x)(m[0].length);
const rotateMatrix = pipe(transpose, mirror);
const makeMatrix = (rows) => (cols) => rep(rep(0)(cols))(rows);
const mountMatrix = (f) => (pos) => (m1) => (m2) =>
  mapi(
    (row) => (y) =>
      mapi(
        (_val) => (x) =>
          y >= pos.y &&
          y - pos.y < m1.length &&
          x >= pos.x &&
          x - pos.x < m1[0].length
            ? f(m1[y - pos.y][x - pos.x])(m2[y][x])
            : m2[y][x]
      )(row)
  )(m2);


const movePlayer = (d) => (p) => ({
  ...p,
  x: p.x + (d.x || 0),
  y: p.y + (d.y || 0),
});
const makePlayer = () => ({ ...INITIAL_POSITION, piece: randPieces() });
const rotatePlayer = (p) => ({ ...p, piece: rotateMatrix(p.piece) });


const State = {};
State.toMatrix = (s) => mountBoard(s.player)(s.board);
State.make = k({
  time: 0,
  board: makeMatrix(ROWS)(COLS),
  player: makePlayer(),
});
State.movePlayer = (f) => (s) => {
  if (State.isAnimating(s)) return s;
  let pre = mountBoard(s.player)(s.board);
  let post = mountBoard(f(s.player))(s.board);
  let valid = sumMatricies(pre) == sumMatricies(post);
  return { ...s, player: valid ? f(s.player) : s.player };
};
State.moveLeft = State.movePlayer(movePlayer({ x: -1 }));
State.moveRight = State.movePlayer(movePlayer({ x: 1 }));
State.moveDown = (s) => {
  if (State.isAnimating(s)) return s;
  let s2 = State.movePlayer(movePlayer({ y: 1 }))(s);
  return s2.player != s.player
    ? s2
    : {
        ...s,
        board: mountBoard(s.player)(s.board),
        player: makePlayer(),
      };
};
State.rotate = (s) =>
  State.isAnimating(s)
    ? s
    : {
        ...s,
        player: find(
          (f) =>
            sumMatricies(mountBoard(f(s.player))(s.board)) ==
            sumMatricies(mountBoard(s.player)(s.board))
        )([
          rotatePlayer,
          pipe(movePlayer(MOVES.RIGHT), rotatePlayer),
          pipe(movePlayer(MOVES.LEFT), rotatePlayer),
          pipe(movePlayer(MOVES.RIGHT2), rotatePlayer),
          pipe(movePlayer(MOVES.LEFT2), rotatePlayer),
          id,
        ])(s.player),
      };
State.clear = (s) => {
  let remains = filter(any(not(eq(-1))))(s.board);
  let count = s.board.length - remains.length;
  let newlines = rep(prepareRow(0)(remains))(count);
  let board = concat(newlines)(remains);
  return { ...s, board };
};
State.isAnimating = pipe(prop('board'), any(any(flip(gt)(9))));
State.animate = (s) => ({
  ...s,
  board: map(
    map(pipe(ifelse(flip(gt)(7))(add(1))(id), ifelse(flip(gt)(30))(k(-1))(id)))
  )(s.board),
});
State.timeToMove = (s) => !(s.time % WAIT);
State.nextTime = (s) => ({ ...s, time: s.time + 1 });
State.maybeMoveDown = ifelse(State.isAnimating)(id)(
  ifelse(State.timeToMove)(State.moveDown)(id)
);
State.next = pipe(
  State.animate,
  State.nextTime,
  State.maybeMoveDown,
  State.clear,
  swipe
);

const mountBoard = (p) => mountMatrix((o) => (n) => n != 0 ? n : o)(p)(p.piece);

export const frameIsFull = (state) => state.board.every(row => /[1-7]/.test(row.join()));
export const present = (state) => {
  const isFinished = frameIsFull(state);
  console.log(
    clear(
      pipe(
        State.toMatrix,
        map(map(pieceToStr)),
        prepareBase,
        matrixToString
      )(state)
    )
  );
  isFinished && console.log('GAME OVER');
  return isFinished;
};


export const initialState = State.make;
export const next = State.next;
export const enqueue = (state, move) => 
  validMove(state, move) ? State[move](state) : state;
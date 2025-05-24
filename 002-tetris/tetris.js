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

import { makeMatrix, mountBoard, 
  makePlayer, movePlayer, rotatePlayer, 
  matrixRow, combineMatricies } from './matrix.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { CONDENCE } = CONSTANTS;

const Tetris = {};
Tetris.make = k({
  time: 0,
  wait: 15,
  board: makeMatrix(22)(10),
  player: makePlayer(),
});
Tetris.movePlayer = (f) => (s) => {
  if (Tetris.isAnimating(s)) return s;
  let pre = mountBoard(s.player)(s.board);
  let post = mountBoard(f(s.player))(s.board);
  let valid = combineMatricies(pre) === combineMatricies(post);
  return { ...s, player: valid ? f(s.player) : s.player };
};
Tetris.moveLeft = Tetris.movePlayer(movePlayer({ x: -1 }));
Tetris.moveRight = Tetris.movePlayer(movePlayer({ x: 1 }));
Tetris.moveDown = (s) => {
  if (Tetris.isAnimating(s)) return s;
  let s2 = Tetris.movePlayer(movePlayer({ y: 1 }))(s);
  return s2.player === s.player
    ? {
        ...s,
        board: mountBoard(s.player)(s.board),
        player: makePlayer(),
      }
    : s2;
};
Tetris.rotate = (s) =>
  Tetris.isAnimating(s)
    ? s
    : {
        ...s,
        player: find(
          (f) =>
            combineMatricies(mountBoard(f(s.player))(s.board)) ==
            combineMatricies(mountBoard(s.player)(s.board))
        )([
          rotatePlayer,
          pipe(movePlayer({ x: 1 }), rotatePlayer),
          pipe(movePlayer({ x: -1 }), rotatePlayer),
          pipe(movePlayer({ x: 2 }), rotatePlayer),
          pipe(movePlayer({ x: -2 }), rotatePlayer),
          id,
        ])(s.player),
      };
Tetris.swipe = (s) => ({
  ...s,
  board: s.board.map(
    ifelse(all(both(flip(gt)(0))(flip(lt)(10))))(k(CONDENCE))(id)
  ),
});
Tetris.clear = (s) => {
  let remains = filter(any(not(eq(-1))))(s.board);
  let count = s.board.length - remains.length;
  let newlines = rep(matrixRow(0)(remains))(count);
  let board = concat(newlines)(remains);
  return { ...s, board };
};
Tetris.isAnimating = pipe(prop('board'), any(any(flip(gt)(9))));
Tetris.animate = (s) => ({
  ...s,
  board: map(
    map(pipe(ifelse(flip(gt)(7))(add(1))(id), ifelse(flip(gt)(30))(k(-1))(id)))
  )(s.board),
});
Tetris.timeToMove = (s) => !(s.time % s.wait);
Tetris.nextTime = (s) => ({ ...s, time: s.time + 1 });
Tetris.maybeMoveDown = ifelse(Tetris.isAnimating)(id)(
  ifelse(Tetris.timeToMove)(Tetris.moveDown)(id)
);
Tetris.next = pipe(
  Tetris.animate,
  Tetris.nextTime,
  Tetris.maybeMoveDown,
  Tetris.clear,
  Tetris.swipe
);

export const initialState = Tetris.make;

export const next = Tetris.next;

export const enqueue = (state, action) =>
  action ? Tetris[action](state) : state;

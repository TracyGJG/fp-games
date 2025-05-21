import {
  add,
  all,
  any,
  both,
  concat,
  eq,
  flip,
  filter,
  find,
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

import { makeMatrix, mount, randPieces, rotate, row, sum } from './matrix.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { CONDENCE, INITIAL_POSITION, MOVES } = CONSTANTS;

const movePlayer = (d) => (p) => ({
  ...p,
  x: p.x + (d.x || 0),
  y: p.y + (d.y || 0),
});
const makePlayer = () => ({ ...INITIAL_POSITION, piece: randPieces() });
const rotatePlayer = (p) => ({ ...p, piece: rotate(p.piece) });

const Tetris = {};
Tetris.movePlayer = (f) => (s) => {
  if (Tetris.isAnimating(s)) return s;
  let pre = mount(s.player)(s.board);
  let post = mount(f(s.player))(s.board);
  let valid = sum(pre) == sum(post);
  return { ...s, player: valid ? f(s.player) : s.player };
};
Tetris.moveLeft = Tetris.movePlayer(movePlayer(MOVES.LEFT));
Tetris.moveRight = Tetris.movePlayer(movePlayer(MOVES.RIGHT));
Tetris.moveDown = (s) => {
  if (Tetris.isAnimating(s)) return s;
  let s2 = Tetris.movePlayer(movePlayer(MOVES.DOWN))(s);
  return s2.player != s.player
    ? s2
    : {
        ...s,
        board: mount(s.player)(s.board),
        player: makePlayer(),
      };
};
Tetris.rotate = (s) =>
  Tetris.isAnimating(s)
    ? s
    : {
        ...s,
        player: find(
          (f) =>
            sum(mount(f(s.player))(s.board)) == sum(mount(s.player)(s.board))
        )([
          rotatePlayer,
          pipe(movePlayer(MOVES.RIGHT), rotatePlayer),
          pipe(movePlayer(MOVES.LEFT), rotatePlayer),
          pipe(movePlayer(MOVES.RIGHT2), rotatePlayer),
          pipe(movePlayer(MOVES.LEFT2), rotatePlayer),
          id,
        ])(s.player),
      };
Tetris.quitApp = () => process.exit();
Tetris.swipe = (s) => ({
  ...s,
  board: s.board.map(
    ifelse(all(both(flip(gt)(0))(flip(lt)(10))))(
      k(CONDENCE)
    )(id)
  ),
});
Tetris.clear = (s) => {
  let remains = filter(any(not(eq(-1))))(s.board);
  let count = s.board.length - remains.length;
  let newlines = rep(row(0)(remains))(count);
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

// Initial state
export const initialState = k({
  time: 0,
  wait: 15,
  board: makeMatrix(22)(10),
  player: makePlayer(),
});

export const next = pipe(
  Tetris.animate,
  Tetris.nextTime,
  Tetris.maybeMoveDown,
  Tetris.clear,
  Tetris.swipe
);

export const enqueue = (state, action) =>
  action ? Tetris[action](state) : state;

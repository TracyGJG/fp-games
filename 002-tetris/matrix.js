import {
  add,
  append,
  join,
  map,
  mapi,
  mirror,
  pipe,
  reduce,
  rep,
  transpose,
} from './general.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { BLOCKS, CHAR_COLOURS, CHARS, EMPTY, NEW_LINE, PIECES } = CONSTANTS;

const clear = (_) => `\x1Bc${_}`;

const frameIsFull = (state) =>
  state.board.every((row) => /[1-7]/.test(row.join()));

const applyColour = (colCode) => (char) => `\x1b[${colCode}m${char}\x1b[0m`;
const Color = Object.entries(CHAR_COLOURS).reduce((cols, [col, code]) => ({...cols, 
  [col]: applyColour(code)
}), {});

const chars = (type, colour) => colour ? Color[colour](CHARS[type].repeat(2)) : CHARS[type].repeat(2);
const pieceToString = (n) => n > 7 ? chars('swipe') : chars(...BLOCKS[(9 + n)  % 9]);

const pick = (xs) => xs[Math.floor(Math.random() * xs.length)];
const randomPiece = () => pick(Object.values(PIECES));

const rotateMatrix = pipe(transpose, mirror);
const mountMatrix = (f) => (pos) => (m1) => (m2) =>
  mapi(
    (row) => (y) =>
      mapi(
        (_) => (x) =>
          y >= pos.y &&
          y - pos.y < m1.length &&
          x >= pos.x &&
          x - pos.x < m1[0].length
            ? f(m1[y - pos.y][x - pos.x])(m2[y][x])
            : m2[y][x]
      )(row)
  )(m2);

const toMatrix = (s) => mountBoard(s.player)(s.board);

const combine = pipe(map(reduce(add)(0)), reduce(add)(0));
const toString = (x) => pipe(map(join(EMPTY)), join(NEW_LINE))(x);
const row = (x) => (m) => rep(x)(m[0].length);
const frame = (m) => append(row(CHARS.base.repeat(2))(m))(m);
const makeGame = (rows) => (cols) => rep(rep(0)(cols))(rows);

const movePlayer = (d) => (p) => ({
  ...p,
  x: p.x + (d.x || 0),
  y: p.y + (d.y || 0),
});
const makePlayer = () => ({ x: 3, y: 0, piece: randomPiece() });
const rotatePlayer = (p) => ({ ...p, piece: rotateMatrix(p.piece) });

const mountBoard = (p) => mountMatrix((o) => (n) => n || o)(p)(p.piece);

const present = (state) => {
  const rendering = pipe(
    toMatrix,
    map(map(pieceToString)),
    frame,
    toString
  )(state);
  const _isFinished = frameIsFull(state);
  if (!frameIsFull(state)) {
    console.log(clear(rendering));
    // console.log(clear(''));
    // console.table(state.board);
    _isFinished && console.log(`GAME OVER${NEW_LINE}`);
  }
  return _isFinished;
};

export default {
    combine,
    frameIsFull,
    makeGame,
    makePlayer,
    mountBoard,
    movePlayer,
    present,
    rotatePlayer,
    row,
};
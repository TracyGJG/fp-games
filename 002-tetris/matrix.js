
import {
  add,
  append,
  join,
  map,
  mapi,
  mirror,
  pipe,
  rep,
  transpose,
  reduce,
} from './general.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { BLOCKS, CHAR_COLOURS, CHARS, EMPTY, NEW_LINE, PIECES } = CONSTANTS;

const clear = (_) => `\x1Bc${_}`;

const isFinished = (state) =>
  state.board.every((row) => /[1-7]/.test(row.join()));

export const present = (state, matrixString) => {
  const _isFinished = isFinished(state);
  if (!isFinished(state)) {
    console.log(clear(matrixString));
    _isFinished && console.log(`GAME OVER${NEW_LINE}`);
  }
  return _isFinished;
};

const applyColour = (colCode) => (char) => colCode ? `\x1b[${colCode}m${char}\x1b[0m` : s;
const Color = Object.entries(CHAR_COLOURS).reduce((cols, [col, code]) => ({...cols, 
  [col]: applyColour(code)
}), {});

const chars = (type, colour) => colour ? Color[colour](CHARS[type].repeat(2)) : CHARS[type].repeat(2);
export const pieceToString = (n) => n > 7 ? chars('swipe') : chars(...BLOCKS[(9 + n)  % 9]);

const pick = (xs) => xs[Math.floor(Math.random() * xs.length)];
const randomPiece = () => pick(Object.values(PIECES));

export const combineMatricies = pipe(map(reduce(add)(0)), reduce(add)(0));
export const matrixToString = (x) => pipe(map(join(EMPTY)), join(NEW_LINE))(x);
export const matrixRow = (x) => (m) => rep(x)(m[0].length);
export const matrixFrame = (m) => append(matrixRow(CHARS.base.repeat(2))(m))(m);
const rotateMatrix = pipe(transpose, mirror);
export const makeMatrix = (rows) => (cols) => rep(rep(0)(cols))(rows);
export const mountMatrix = (f) => (pos) => (m1) => (m2) =>
  mapi(
    (row) => (y) =>
      mapi(
        (val) => (x) =>
          y >= pos.y &&
          y - pos.y < m1.length &&
          x >= pos.x &&
          x - pos.x < m1[0].length
            ? f(m1[y - pos.y][x - pos.x])(m2[y][x])
            : m2[y][x]
      )(row)
  )(m2);

export const movePlayer = (d) => (p) => ({
  ...p,
  x: p.x + (d.x || 0),
  y: p.y + (d.y || 0),
});
export const makePlayer = () => ({ x: 3, y: 0, piece: randomPiece() });
export const rotatePlayer = (p) => ({ ...p, piece: rotateMatrix(p.piece) });

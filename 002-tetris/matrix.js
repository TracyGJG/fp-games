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
const { BLOCKS, CHARS, CHAR_COLOURS, EMPTY, NEW_LINE, PIECES } = CONSTANTS;

const clear = (_) => `\x1Bc${_}`;

const applyColour = (colCode) => (s) => colCode ? `\x1b[${colCode}m${s}\x1b[0m` : s;
const Color = Object.entries(CHAR_COLOURS).reduce((cols, [col, code]) => ({...cols, 
  [col]: applyColour(code)
}), {});

const chars = (type, colour) => colour ? Color[colour](CHARS[type].repeat(2)) : CHARS[type].repeat(2);
const pieceToStr = (n) => n > 7 ? chars('swipe') : chars(...BLOCKS[(9 + n)  % 9]);
export const randPieces = () => pick(Object.values(PIECES));

export const sum = pipe(map(reduce(add)(0)), reduce(add)(0));
export const matrixToStr = (x) => pipe(
  map(join(EMPTY)), 
  join(NEW_LINE))(x);
export const row = (x) => (m) => rep(x)(m[0].length);
const frame = (m) => append(row(CHARS.base.repeat(2))(m))(m);
export const rotate = pipe(transpose, mirror);
export const makeMatrix = (cols, rows) => rep(rep(0)(cols))(rows);
const _mount = (f) => (pos) => (m1) => (m2) =>
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
export const mount = (p) => _mount((o) => (n) => n != 0 ? n : o)(p)(p.piece);
const pick = (xs) => xs[Math.floor(Math.random() * xs.length)];

const toMatrix = (s) => mount(s.player)(s.board);

export const isFinished = (state) => state.board.every(row => /[1-7]/.test(row.join()));
export const present = (state) => {
  const _isFinished = isFinished(state);
  console.log(clear(pipe(
        toMatrix,
        map(map(pieceToStr)),
        frame,
        matrixToStr
      )(state)));
  _isFinished && console.log('GAME OVER');
  return _isFinished;
};
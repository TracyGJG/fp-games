import CONSTANTS from './constants.json' with { type: 'json' };
const { BLOCKS, CHAR_COLOURS, CHARS, PIECES } = CONSTANTS;

export const clear = (_) => `\x1Bc${_}`;

const applyColour = (colCode) => (s) => colCode ? `\x1b[${colCode}m${s}\x1b[0m` : s;
const COLOURS = Object.entries(CHAR_COLOURS).reduce((cols, [col, code]) => ({...cols, 
  [col]: applyColour(code)
}), {});

export const chars = (type, colour) => colour ? COLOURS[colour](CHARS[type].repeat(2)) : CHARS[type].repeat(2);
export const pieceToStr = (n) => n > 7 ? chars('swipe') : chars(...BLOCKS[(9 + n)  % 9]);

const pick = (xs) => xs[Math.floor(Math.random() * xs.length)];
export const randPieces = () => pick(Object.values(PIECES));
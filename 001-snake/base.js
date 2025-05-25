const adjust = (n) => (f) => (xs) => mapi((x) => (i) => i === n ? f(x) : x)(xs);
const append =
  (a) =>
  (...e) =>
    [...a, ...e];
const dropFirst = (xs) => xs.slice(1);
const dropLast = (xs) => xs.slice(0, xs.length - 1);
const id = (x) => x;
const k = (x) => (y) => x;
const map = (f) => (xs) => xs.map(f);
const mapi = (f) => (xs) => xs.map((x, i) => f(x)(i));
const merge = (o1) => (o2) => Object.assign({}, o1, o2);
const mod = (x) => (y) => (y + x) % x;
const objOf = (k) => (v) => ({ [k]: v });
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, f) => f(acc), x);
const pointEq =
  ({ x: x1, y: y1 }) =>
  ({ x: x2, y: y2 }) =>
    x1 === x2 && y1 === y2;
const prop = (k) => (o) => o[k];
const range = (n) => (m) => [...Array(m - n)].map((_, i) => n + i);
const rep = (c) => (n) => map(k(c))(range(0)(n));
const rnd = (min) => (max) => Math.floor(Math.random() * max) + min;
const rndPos = ({ cols, rows }) => ({
  x: rnd(0)(Math.floor(cols) - 1),
  y: rnd(0)(Math.floor(rows) - 1),
});
const spec = (o) => (x) =>
  Object.keys(o)
    .map((k) => objOf(k)(o[k](x)))
    .reduce((acc, o) => Object.assign(acc, o));

export {
  adjust,
  append,
  dropFirst,
  dropLast,
  id,
  k,
  map,
  merge,
  mod,
  objOf,
  pipe,
  pointEq,
  prop,
  range,
  rep,
  rnd,
  rndPos,
  spec,
};

// General functions
const add = (x) => (y) => x + y;
const all = (f) => pipe(map(f), reduce(and)(true));
const and = (x) => (y) => x && y;
const any = (f) => pipe(map(f), reduce(or)(false));
const append = (x) => (xs) => [...xs, x];
const both = (f) => (g) => (x) => f(x) && g(x);
const concat = (x1) => (x2) => x1.concat(x2);
const eq = (x) => (y) => x === y;
const filter = (f) => (xs) => xs.filter(f);
const find = (f) => (xs) => xs.find(f);
const flip = (f) => (x) => (y) => f(y)(x);
const gt = (x) => (y) => x > y;
const id = (x) => x;
const ifelse = (c) => (t) => (f) => (x) => c(x) ? t(x) : f(x);
const join = (s) => (xs) => xs.join(s);
const k = (x) => (_) => x;
const lt = (x) => (y) => x < y;
const map = (f) => (xs) => xs.map(f);
const mapi = (f) => (xs) => xs.map((x, i) => f(x)(i));
const mirror = (xsxs) => xsxs.map((xs) => xs.reverse());
const not = (f) => (x) => !f(x);
const or = (x) => (y) => x || y;
const pipe = (...fs) => (x) => fs.reduce((acc, f) => f(acc), x);
const prop = (p) => (o) => o[p];
const transpose = (xsxs) => xsxs[0].map((_, i) => xsxs.map((row) => row[i]));
const range = (min) => (max) => [...Array(max).keys()].map((_, i) => i + min);
const reduce = (f) => (z) => (xs) => xs.reduce((acc, x) => f(acc)(x), z);
const rep = (c) => (n) => map(k(c))(range(0)(n));

export {
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
};

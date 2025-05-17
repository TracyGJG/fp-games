import readline from 'readline';
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
} from './base.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { CHAR_COLOURS, Pieces } = CONSTANTS;

const applyColour = (colCode) => (s) => colCode ? `\x1b[${colCode}m${s}\x1b[0m` : s;
const Color = Object.entries(CHAR_COLOURS).reduce((cols, [col, code]) => ({...cols, 
  [col]: applyColour(code)
}), {});

const Piece = {};
Piece.rand = () => Random.pick(Object.values(Pieces));
Piece.toStr = (n) => {
  switch (n) {
    case 0:
      return '  ';
    case 1:
      return Color.cyan('▓▓');
    case 2:
      return Color.yellow('▓▓');
    case 3:
      return Color.magenta('▓▓');
    case 4:
      return Color.green('▓▓');
    case 5:
      return Color.red('▓▓');
    case 6:
      return Color.blue('▓▓');
    case 7:
      return Color.white('▓▓');
    case -1:
      return '  ';
    default:
      return '░░';
  }
};

const Matrix = {};
Matrix.sum = pipe(map(reduce(add)(0)), reduce(add)(0));
Matrix.toStr = (x) => pipe(map(join(' ')), join('\r\n'))(x);
Matrix.row = (x) => (m) => rep(x)(m[0].length);
Matrix.frame = (m) => append(Matrix.row('▔▔')(m))(m);
Matrix.rotate = pipe(transpose, mirror);
Matrix.make = (rows) => (cols) => rep(rep(0)(cols))(rows);
Matrix.mount = (f) => (pos) => (m1) => (m2) =>
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

const Random = {};
Random.pick = (xs) => xs[Math.floor(Math.random() * xs.length)];

const Player = {};
Player.move = (d) => (p) => ({
  ...p,
  x: p.x + (d.x || 0),
  y: p.y + (d.y || 0),
});
(Player.make = () => ({ x: 3, y: 0, piece: Piece.rand() })),
  (Player.rotate = (p) => ({ ...p, piece: Matrix.rotate(p.piece) }));

const State = {};
State.toMatrix = (s) => Board.mount(s.player)(s.board);
State.make = k({
  time: 0,
  wait: 15,
  board: Matrix.make(22)(10),
  player: Player.make(),
});
State.movePlayer = (f) => (s) => {
  if (State.isAnimating(s)) return s;
  let pre = Board.mount(s.player)(s.board);
  let post = Board.mount(f(s.player))(s.board);
  let valid = Matrix.sum(pre) == Matrix.sum(post);
  return { ...s, player: valid ? f(s.player) : s.player };
};
State.moveLeft = State.movePlayer(Player.move({ x: -1 }));
State.moveRight = State.movePlayer(Player.move({ x: 1 }));
State.moveDown = (s) => {
  if (State.isAnimating(s)) return s;
  let s2 = State.movePlayer(Player.move({ y: 1 }))(s);
  return s2.player != s.player
    ? s2
    : {
        ...s,
        board: Board.mount(s.player)(s.board),
        player: Player.make(),
      };
};
State.rotate = (s) =>
  State.isAnimating(s)
    ? s
    : {
        ...s,
        player: find(
          (f) =>
            Matrix.sum(Board.mount(f(s.player))(s.board)) ==
            Matrix.sum(Board.mount(s.player)(s.board))
        )([
          Player.rotate,
          pipe(Player.move({ x: 1 }), Player.rotate),
          pipe(Player.move({ x: -1 }), Player.rotate),
          pipe(Player.move({ x: 2 }), Player.rotate),
          pipe(Player.move({ x: -2 }), Player.rotate),
          id,
        ])(s.player),
      };
State.swipe = (s) => ({
  ...s,
  board: s.board.map(
    ifelse(all(both(flip(gt)(0))(flip(lt)(10))))(
      k([10, 12, 14, 16, 18, 18, 16, 14, 12, 10])
    )(id)
  ),
});
State.clear = (s) => {
  let remains = filter(any(not(eq(-1))))(s.board);
  let count = s.board.length - remains.length;
  let newlines = rep(Matrix.row(0)(remains))(count);
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
State.timeToMove = (s) => s.time % s.wait == 0;
State.nextTime = (s) => ({ ...s, time: s.time + 1 });
State.maybeMoveDown = ifelse(State.isAnimating)(id)(
  ifelse(State.timeToMove)(State.moveDown)(id)
);
State.next = pipe(
  State.animate,
  State.nextTime,
  State.maybeMoveDown,
  State.clear,
  State.swipe
);

const Board = {};
Board.mount = (p) => Matrix.mount((o) => (n) => n != 0 ? n : o)(p)(p.piece);
Board.valid = (b1) => (b2) => Matrix.sum(b1) == Matrix.sum(b2);

// Key events
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (_str, key) => {
  if (key.ctrl && key.name === 'c') process.exit();
  switch (key.name.toUpperCase()) {
    case 'LEFT':
      STATE = State.moveLeft(STATE);
      break;
    case 'RIGHT':
      STATE = State.moveRight(STATE);
      break;
    case 'DOWN':
      STATE = State.moveDown(STATE);
      break;
    case 'UP':
      STATE = State.rotate(STATE);
      break;
  }
});

// Game loop
let STATE = State.make();
const step = () => (STATE = State.next(STATE));
const show = () =>
  console.log(
    '\x1Bc' +
      pipe(
        State.toMatrix,
        map(map(Piece.toStr)),
        Matrix.frame,
        Matrix.toStr
      )(STATE)
  );
setInterval(() => {
  step();
  show();
}, 30);

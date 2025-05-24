import readline from 'readline';

import {
  add,
  all,
  any,
  append,
  both,
  concat,
  eq,
  find,
  filter,
  flip,
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
  rep,
  transpose,
  reduce,
} from './general.js';

import { initialState, enqueue, next } from './tetris.js';

import CONSTANTS from './constants.json' with { type: 'json' };
const { CLI_KEY_MAPPINGS: KEY_MAPPINGS, FRAME_DELAY, PIECES } = CONSTANTS;


const clear = (_) => `\x1Bc${_}`;

// const applyColour = (colCode) => (s) => colCode ? `\x1b[${colCode}m${s}\x1b[0m` : s;
// const Color = Object.entries(CHAR_COLOURS).reduce((cols, [col, code]) => ({...cols, 
//   [col]: applyColour(code)
// }), {});

// const chars = (type, colour) => colour ? Color[colour](CHARS[type].repeat(2)) : CHARS[type].repeat(2);
// const pieceToStr = (n) => n > 7 ? chars('swipe') : chars(...BLOCKS[(9 + n)  % 9]);

// const pick = (xs) => xs[Math.floor(Math.random() * xs.length)];
// export const randPieces = () => pick(Object.values(PIECES));



const Color = {};
Color.black = (s) => `\x1b[30m${s.repeat(2)}\x1b[0m`;
Color.red = (s) => `\x1b[31m${s.repeat(2)}\x1b[0m`;
Color.green = (s) => `\x1b[32m${s.repeat(2)}\x1b[0m`;
Color.yellow = (s) => `\x1b[33m${s.repeat(2)}\x1b[0m`;
Color.blue = (s) => `\x1b[34m${s.repeat(2)}\x1b[0m`;
Color.magenta = (s) => `\x1b[35m${s.repeat(2)}\x1b[0m`;
Color.cyan = (s) => `\x1b[36m${s.repeat(2)}\x1b[0m`;
Color.white = (s) => `\x1b[37m${s.repeat(2)}\x1b[0m`;

const Piece = {};
Piece.rand = () => Random.pick(Object.values(PIECES));
Piece.toStr = (n) => {
  switch (n) {
    case 0:
      return '  ';
      break;
    case 1:
      return Color.cyan('▓');
      break;
    case 2:
      return Color.yellow('▓');
      break;
    case 3:
      return Color.magenta('▓');
      break;
    case 4:
      return Color.green('▓');
      break;
    case 5:
      return Color.red('▓');
      break;
    case 6:
      return Color.blue('▓');
      break;
    case 7:
      return Color.white('▓');
      break;
    case -1:
      return '  ';
      break;
    default:
      return '░░';
      break;
  }
};

const Matrix = {};
Matrix.sum = pipe(map(reduce(add)(0)), reduce(add)(0));
Matrix.toStr = (x) => pipe(map(join('')), join('\r\n'))(x);
Matrix.row = (x) => (m) => rep(x)(m[0].length);
Matrix.frame = (m) => append(Matrix.row('▔▔')(m))(m);
Matrix.rotate = pipe(transpose, mirror);
Matrix.make = (rows) => (cols) => rep(rep(0)(cols))(rows);
Matrix.mount = (f) => (pos) => (m1) => (m2) =>
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

const Random = {};
Random.pick = (xs) => xs[Math.floor(Math.random() * xs.length)];

const Player = {};
Player.move = (d) => (p) => ({
  ...p,
  x: p.x + (d.x || 0),
  y: p.y + (d.y || 0),
});
Player.make = () => ({ x: 3, y: 0, piece: Piece.rand() });
Player.rotate = (p) => ({ ...p, piece: Matrix.rotate(p.piece) });

const Tetris = {};
Tetris.toMatrix = (s) => Board.mount(s.player)(s.board);
Tetris.make = k({
  time: 0,
  wait: 15,
  board: Matrix.make(22)(10),
  player: Player.make(),
});
Tetris.movePlayer = (f) => (s) => {
  if (Tetris.isAnimating(s)) return s;
  let pre = Board.mount(s.player)(s.board);
  let post = Board.mount(f(s.player))(s.board);
  let valid = Matrix.sum(pre) == Matrix.sum(post);
  return { ...s, player: valid ? f(s.player) : s.player };
};
Tetris.moveLeft = Tetris.movePlayer(Player.move({ x: -1 }));
Tetris.moveRight = Tetris.movePlayer(Player.move({ x: 1 }));
Tetris.moveDown = (s) => {
  if (Tetris.isAnimating(s)) return s;
  let s2 = Tetris.movePlayer(Player.move({ y: 1 }))(s);
  return s2.player != s.player
    ? s2
    : {
        ...s,
        board: Board.mount(s.player)(s.board),
        player: Player.make(),
      };
};
Tetris.rotate = (s) =>
  Tetris.isAnimating(s)
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
Tetris.swipe = (s) => ({
  ...s,
  board: s.board.map(
    ifelse(all(both(flip(gt)(0))(flip(lt)(10))))(
      k([10, 12, 14, 16, 18, 18, 16, 14, 12, 10])
    )(id)
  ),
});
Tetris.clear = (s) => {
  let remains = filter(any(not(eq(-1))))(s.board);
  let count = s.board.length - remains.length;
  let newlines = rep(Matrix.row(0)(remains))(count);
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
Tetris.timeToMove = (s) => s.time % s.wait == 0;
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

const Board = {};
Board.mount = (p) => Matrix.mount((o) => (n) => n != 0 ? n : o)(p)(p.piece);
Board.valid = (b1) => (b2) => Matrix.sum(b1) == Matrix.sum(b2);




// Mutable state
let state = initialState(Tetris);
let timer;

// Game loop update
function update() {
  state = next(state);

  console.log(clear(
      pipe(
        Tetris.toMatrix,
        map(map(Piece.toStr)),
        Matrix.frame,
        Matrix.toStr
      )(state)
    )
  );

  // if (!present(state)) {
  //   clearInterval(timer);
  //   process.exit();
  // }
}

// Key events
(() => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.name === 'escape') process.exit();

    const action = KEY_MAPPINGS.find(([_key, codes]) =>
      codes.includes(key.name.toUpperCase())
    )?.[0];
    state = enqueue(state, action);
  });
})();

// Main
timer = setInterval(update, FRAME_DELAY);

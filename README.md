## Classic games rewritten in simple functional style.

Support material for the screencast series
[Game Development with Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PLrhzvIcii6GOfRvsaVVdYSRjRhPWgAIKc).

Part One: Describes the overall structure and the mechanics of the (snake) games 'engine'.
Part Two: Discusses use of the engine through a Command Line Interface (CLI).
Part Three: Covers how a web (browser-based) user interface can utilise the engine.

## Revisions

In addition to the Snake game (001) there is a Tetric game (002) but the code is contained in a single file and it only supports the CLI presentation.

### Snake Game

1. Convert the Common JS module system, and the web bypass code, for the ES6 module syntax usable in both environments.
2. Extract constant values into a JSON file and import it into the engine (snake.js) file.
3. Extract the matrix manipulation operations fro the CLI version into their own file (matrix.js).
4. The CLI version is revised to use extended ASCII graphics (like the Tetris game) in place of the simple ASCII characters.
5. ASCII escape sequences have also been used to apply colour.
6. Generalised the `append` function and included it in the base.js file.

```js
// a: source and target array
// es: an array of elements (using the ES6 rest and spread syntax) to be appended
const append =
  (a) =>
  (...es) =>
    [...a, ...es];
```

### Tetris Game

1. Renamed the `main.js` file to `tetris.js` to form the basis of the games engine.
2. Extract the 'General functions' into their own `general.js` file.
3. Create a `cli.js` file along similar line to that used for the snake game.
4. Duplicate the web CSS and HTML files from the snake games and created a blank `web.js` file.
5. Change the canvas dimensions from 800x600 to 300x680 (10x by 22x + 20 for the base, where x = 30px).
6. Extract constant values into a JSON file and import it into the engine (tetris.js) file.

## Adding scoring and Game Over

### Snake Game

The score can be calculated by how long the player lasts as indicated by the length of the snake (10 points for each additional segment/apple). The constraints of the play area can also be factored in to recognise the skill required to avoid 'catching your tail'. When the length of the snake exceeds height of the area the point per apple will increase to 20. When the length exceeds to width, apples will be worth 30 points and when the length exceeds the width plus height each apple will be worth 50 points. The player will be given three lives, after which the game will be over.

### Tetris

The score will be calculated based on two factors:

- How many rows have been completed, increasing in value according to how many are cleared in a turn. One row = 100 points, 2 rows = 250 points, 3 rows = 500 and 4 rows = 1000 points. Plus, if there are no pieces left is the rows are cleared there will be an additional 1000 points, irrespective of how many rows are cleared.
- There will be points awarded for each piece settled based on the complexity of the piece (its rotation symmetry.)
  - O = 10 points
  - I = 20 points
  - S = 20 points
  - Z = 20 points
  - J = 40 points
  - L = 40 points
  - T = 40 points

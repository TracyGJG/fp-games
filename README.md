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
4. The CLI version is revised to use extended ASCII graphics (like the Tetris game) in place of the simple ASCII characters. Also, ASCII escape sequences have been used to apply colour.
5. Generalised the `append` function and included it in the base.js file.

```js
// a: source and target array
// es: an array of elements (using the rest syntax) to be appended
const append =
  (a) =>
  (...es) =>
    a.concat(es);
```

### Tetris Game

1. Renamed the `main.js` file to `tetris.js` to form the basis of the games engine.
2. Extract the 'General functions' into their own `general.js` file.
3. Duplicate the web CSS and HTML files from the snake games and created a blank `web.js` file.
4. Change the canvas dimensions from 800x600 to 300x680 (10x by 22x + 20 for the base).

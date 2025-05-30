## Classic games rewritten in simple functional style.

Support material for the screencast series
[Game Development with Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PLrhzvIcii6GOfRvsaVVdYSRjRhPWgAIKc) by Dr Christopher Okhravi.

Part One: Describes the overall structure and the mechanics of the (snake) games 'engine'.

Part Two: Discusses use of the engine through a Command Line Interface (CLI).

Part Three: Covers how a web (browser-based) user interface can utilise the engine.

## Revisions

In addition to the Snake game (001) there is a Tetris implementation (002) but the code is contained in a single file and it only supports the CLI presentation.

### Snake Game

1. Convert the Common JS module system, and the web bypass code, for the ES6 module syntax usable in both environments.
2. Extract constant values into a JSON file and import it into the engine (snake.js) file.
3. Extract the matrix manipulation operations fro the CLI version into their own file (matrix.js).
4. The CLI version is revised to use extended ASCII graphics (like the Tetris game) in place of the simple ASCII characters, and ASCII escape sequences have also been used to apply colour.
5. Generalised the `append` function and included it in the base.js file.

```js
// a: source and target array
// es: an array of elements (using the ES6 rest and spread syntax) to be appended
const append =
  (a) =>
  (...es) =>
    [...a, ...es];
```

I was also able to simplify the `mod` function, able to correclty calculate the modulus when given a negative value.

```js
const mod = (x) => (y) => ((y % x) + x) % x;
```

Instead of the above, the following function can be used.

```js
const mod = (x) => (y) => (y + x) % x;
```

### Tetris Game

1. Renamed the `main.js` file to `tetris.js` to form the basis of the games engine.
2. Extract the 'General functions' into their own `general.js` file.
3. Extract constant values into a JSON file and import it into the engine (tetris.js) file.
4. Create a `cli.js` file along similar line to that used for the snake game.
5. Duplicate the web CSS and HTML files from the snake games and created a blank `web.js` file.
6. Change the canvas dimensions from 800x600 to 300x680 (10x by 22x + 20 for the base, where x = 30px).
7. Define the 'finish line' as a checkered area at the top of the board and determine when the game of over.

## Adding scoring and lives

### Snake Game

The score can be calculated by how long the player lasts as indicated by the length of the snake (10 points for each additional segment/apple). The constraints of the play area can also be factored in to recognise the skill required to avoid 'catching your tail'. When the length of the snake exceeds height of the area the point per apple will increase to 20. When the length exceeds to width, apples will be worth 30 points and when the length exceeds the width plus height each apple will be worth 50 points.

### Tetris

The score will be calculated based on two factors:

1. How many rows have been completed, increasing in value according to how many are cleared by adding a single piece.

| Rows | Points |
| :--: | :----: |
|  1   |  100   |
|  2   |  250   |
|  3   |  500   |
|  4   |  1000  |

Plus, if there are no pieces left on the board after the rows have been cleared, the bonus will be doubled.

2. Points will also be awarded for each piece settled based on its complexity (its rotation symmetry.)

| Piece |   Shape    | Rotational Symmetry | Points |
| :---: | :--------: | :-----------------: | :----: |
|   O   |   Square   |          4          |   10   |
|   I   |    Line    |          2          |   20   |
|   S   | Right-left |          2          |   20   |
|   Z   | Left-right |          2          |   20   |
|   J   | Left bend  |          0          |   40   |
|   L   | Right bend |          0          |   40   |
|   T   |     -      |          0          |   40   |

## How the games work - general mechanics

Both the Snake game and Tetris comprise of a pair of User Interfaces (or Application User Interfaces AUIs if you will), one for the terminal (cli.js that uses Node.js) and the other for any web browser (web.html, web.js and web.css.) In addition there are two files one for the game logic (snake.js and tetris.js respectively) and another for matrix manipulation (matrix.js), which is the structure both games employ for their state management. There are some ancillary files: constants.json in which there are some game-specific constant values, and base.js/general.js that contain some (FP) utility functions. This section will concentrate on the inteaction between the AUI and the game logic but will not go in depth into the individual game logic.

The AUIs are responsible for presenting the user output and capturing the user input. In this respect both games have very similar web and terminal implementations. Side-by-side inspection of the web and terminal AUIs will also reveal a common structure, which is not surprising given their role and how they both have to interactive/interface with the game logic module.

### Main game loop
It is quite conventional for the main game loop to be infinate (never ending) and for the conditions within the game to result in termination. In this respect both games in this project and their AUIs follow this pattern but the different AUIs (web v terminal) employ slightly different mechanisms. The CLI version uses the `setInterval` call to envoke the `update` function on a regular basis. The web version employs the `window.requestAnimarionFrame` method to synchronise repainting of the canvas, but both execute an `update` call-back function. Many games do not require user input to cause an update to the game state, the passage of time is sufficient, and this is true for both the Snake and Tetris games.

### Game state management
As the game starts an `initialiseState` call is made to the game logic module (GLM). This prepares the initial state model and returns a reference to it. The GML also exposes `next` and `enqueue` functions. The `next` function is used to prompt the GLM in to refreshing the state model prior to a rendering refresh (or termination) and is frequently executed by the `update` function. The AUI monitors interaction from the user (primarily keyboard input) and translates it into an action (when it can) before issuing an `enqueue` call to instigate an update to the game state. 

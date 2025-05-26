# Tetris

The game Tetris implemented with functional style in JavaScript without libraries.

## Rules

- Use arrow keys, wasd, or hjkl to control the pieces.
- Make as many complete rows (no gaps) as you can and avoid filling the frame.
- Press Escape to quit (in terminal).

## Files

### Current

```mermaid
flowchart LR
    game --> web
    game --> cli
    matrix --> web
    matrix --> cli
    matrix --> game
    general --> game
    general --> matrix

game([tetris.js])
general([general.js])
matrix([matrix.js])
cli([Terminal])
web([Browser])
```

### Desired

```mermaid
flowchart LR
    game --> web
    game --> cli
    matrix --> game
    general --> game
    general --> matrix

game([tetris.js])
general([general.js])
matrix([matrix.js])
cli([Terminal])
web([Browser])
```

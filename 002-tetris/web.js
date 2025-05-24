import CONSTANTS from './constants.json' with { type: 'json' };
const { COLS, ROWS,
  WEB_KEY_MAPPINGS: KEY_MAPPINGS, 
  FRAME_DELAY, COLOURS,
  BASE_HEIGHT, BLOCK_COLOURS } = CONSTANTS;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
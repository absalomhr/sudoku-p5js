// Global variables
// Size of the squares of the board
const sqr_sz = 30;
// Colors used in the design of the board
const board_bg_color_dark = "rgb(152,72,61)";
const board_bg_color_light = "rgb(222, 198, 148)";
const outline_color = "rgb(85,43,38)";
const line_color = "rgb(13, 12, 12)";
const extra_color = "rgb(172, 243, 157)";
const focus_color = "rgb(156, 108, 153)";
// Game functionality variables
let user_piece = 0;

let p5_board = new p5(board_sketch, "board-section");
let p5_bar = new p5(bar_sketch, "bar-section");
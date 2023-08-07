import initFieldData from "./initFieldData.js";

const board = document.querySelector("#board");
const resetBtn = document.querySelector("#reset");
const width = 10;
const height = 10;
const bombs = 10;
const [newGame, reset] = initFieldData(board, width, height, bombs);
newGame(width, height, bombs);
resetBtn.addEventListener("click", reset);
document.addEventListener("contextmenu", (e) => e.preventDefault());

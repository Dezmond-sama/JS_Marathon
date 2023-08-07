import initFieldData from "./initFieldData.js";

const board = document.querySelector("#board");
const resetBtn = document.querySelector("#reset");
const width = 10;
const height = 10;
const bombs = 10;
const [fieldData, linkedData, reset] = initFieldData(
    board,
    width,
    height,
    bombs
);
resetBtn.addEventListener("click", reset);

import initFieldData from "./initFieldData.js";

const board = document.querySelector("#board");
const resetBtn = document.querySelector("#reset");
const scrTemplates = document.querySelector("#screens");
const width = 10;
const height = 10;
const bombs = 10;
const [newGame, reset] = initFieldData(board, width, height, bombs);
newGame(width, height, bombs);
resetBtn.addEventListener("click", reset);
document.addEventListener("contextmenu", (e) => e.preventDefault());
board.addEventListener("gameover", (e) => {
    console.log(e);
    const className = e.detail.win ? "win" : "loose";
    const gameoverScreen = scrTemplates.content
        .querySelector(`.${className}`)
        .cloneNode(true);
    board.append(gameoverScreen);
    setTimeout(() => {
        gameoverScreen.classList.remove("hidden");
    }, 0);
});

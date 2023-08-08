import { intToTimeString } from "./helpers.js";
import initFieldData from "./initFieldData.js";

const board = document.querySelector("#board");
const timer = document.querySelector("#timer");
const resetBtn = document.querySelector("#reset");
const scrTemplates = document.querySelector("#screens");
const width = 10;
const height = 10;
const bombs = 10;
let interval = undefined;
let time = 0;

const [newGame, reset] = initFieldData(board, width, height, bombs);
newGame(width, height, bombs);
resetBtn.addEventListener("click", () => {
    resetTimer();
    reset();
});
document.addEventListener("contextmenu", (e) => e.preventDefault());
board.addEventListener("gameover", (e) => {
    clearInterval(interval);
    const className = e.detail.win ? "win" : "loose";
    const gameoverScreen = scrTemplates.content
        .querySelector(`.${className}`)
        .cloneNode(true);
    board.append(gameoverScreen);
    setTimeout(() => {
        gameoverScreen.classList.remove("hidden");
    }, 0);
});
const resetTimer = () => {
    clearInterval(interval);
    time = 0;
    timer.innerHTML = intToTimeString(0);
};
board.addEventListener("gamestart", (e) => {
    resetTimer();
    interval = setInterval(updateTimer, 1000);
});

const updateTimer = () => {
    time++;
    timer.innerHTML = intToTimeString(time);
};

resetTimer();

import { intToTimeString } from "./helpers.js";
import initFieldData from "./initFieldData.js";

const board = document.querySelector("#board");
const timer = document.querySelector("#timer");
const flags = document.querySelector("#flags");
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
    resetGameData();
    reset();
});
document.addEventListener("contextmenu", (e) => e.preventDefault());
board.addEventListener("gameover", ({ detail }) => {
    clearInterval(interval);
    const className = detail.win ? "win" : "loose";
    const gameoverScreen = scrTemplates.content
        .querySelector(`.${className}`)
        .cloneNode(true);
    board.append(gameoverScreen);
    setTimeout(() => {
        gameoverScreen.classList.remove("hidden");
    }, 0);
});
const resetGameData = () => {
    flags.innerHTML = `0/${bombs}`;
    clearInterval(interval);
    time = 0;
    timer.innerHTML = intToTimeString(0);
};

board.addEventListener("gamestart", (e) => {
    resetGameData();
    interval = setInterval(updateTimer, 1000);
});

board.addEventListener("changestate", ({ detail }) => {
    flags.innerHTML = `${detail.states?.protected || 0}/${bombs}`;
});

const updateTimer = () => {
    time++;
    timer.innerHTML = intToTimeString(time);
};

resetGameData();

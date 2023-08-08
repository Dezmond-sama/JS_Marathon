import { intToTimeString } from "./helpers.js";
import initFieldData from "./initFieldData.js";

const board = document.querySelector("#board");
const timer = document.querySelector("#timer");
const flags = document.querySelector("#flags");
const resetBtn = document.querySelector("#reset");
const newgameBtn = document.querySelector("#newgame");
const newgameSelectors = document.querySelector("#newgameItems");
const scrTemplates = document.querySelector("#screens");
let width = 10;
let height = 10;
let bombs = 10;
let interval = undefined;
let time = 0;

const [newGame, reset] = initFieldData(board);
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

newgameBtn.addEventListener("click", (e) => {
    e.target
        .closest(".dropdown-menu-container")
        ?.querySelector(".dropdown-menu")
        ?.classList.toggle("visible");
});
newgameSelectors.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-width")) {
        width = +e.target.getAttribute("data-width") || width;
        height = +e.target.getAttribute("data-height") || height;
        bombs = +e.target.getAttribute("data-bombs") || bombs;
        newGame(width, height, bombs);
    }
});

// Закройте выпадающее меню, если пользователь щелкает за его пределами
window.addEventListener("click", (event) => {
    if (event.target.classList.contains("dropdown-button")) return;
    const dropdowns = document.querySelectorAll(".dropdown-menu");
    dropdowns.forEach((dd) => {
        dd.classList.remove("visible");
    });
});

document.body.addEventListener("mousedown", (e) => {
    if (e.button === 1) {
        e.preventDefault();
        return false;
    }
});

resetGameData();

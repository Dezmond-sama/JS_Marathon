const startBtn = document.querySelector(".start");
const resetBtn = document.querySelectorAll(".reset");
const screens = document.querySelectorAll(".screen");
const timeBtnList = document.querySelector(".time-list");
const timer = document.querySelector("#time");
const scoreBoard = document.querySelector("#score");
const board = document.querySelector("#board");
const minCircleDiameter = 20;
const maxCircleDiameter = 80;

let interval = undefined;
let time = 0;
let gameScore = 0;

const getRandomInt = (fromValue, toValue) =>
    ~~(fromValue + Math.random() * (toValue - fromValue + 1));

const setActiveScreen = (index) => {
    screens.forEach((s, i) =>
        i < index ? s.classList.add("up") : s.classList.remove("up")
    );
};

const startGame = () => {
    timer.parentNode.classList.remove("hide");
    scoreBoard.parentNode.classList.remove("hide");

    gameScore = 0;
    setScore(gameScore);
    setTime(time);

    setActiveScreen(2);
    clearBoard();
    createRandomCircle();
    interval = setInterval(updateTimer, 1000);
};

const gameOver = () => {
    timer.parentNode.classList.add("hide");
    scoreBoard.parentNode.classList.add("hide");
    board.innerHTML = `<h2>Total score: <span class="primary">${gameScore}</span></h2>`;
};

const createRandomCircle = () => {
    const { width, height } = board.getBoundingClientRect();
    const circle = document.createElement("div");
    const diameter = getRandomInt(minCircleDiameter, maxCircleDiameter);

    circle.classList.add("circle");
    let colorVariant = 1;
    if (
        diameter <
        minCircleDiameter + (maxCircleDiameter - minCircleDiameter) / 4
    ) {
        colorVariant = 3;
    } else if (
        diameter <
        minCircleDiameter + (maxCircleDiameter - minCircleDiameter) / 2
    ) {
        colorVariant = 2;
    }

    circle.classList.add(`circle-color-${colorVariant}`);
    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    const x = getRandomInt(5, 95);
    const y = getRandomInt(5, 95);
    circle.style.left = `${x}%`;
    circle.style.top = `${y}%`;

    board.append(circle);
};

const updateTimer = () => {
    --time;
    setTime(time);
    if (time <= 0) {
        clearInterval(interval);
        interval = undefined;
        gameOver();
    }
};

const setTime = (time) => {
    const minutes = ("0" + ~~(time / 60)).slice(-2);
    const seconds = ("0" + (time % 60)).slice(-2);
    timer.innerHTML = `${minutes}:${seconds}`;
};

const setScore = (score) => (scoreBoard.innerHTML = `${score}`);

const clearBoard = () => (board.innerHTML = "");

//===============================

startBtn.addEventListener("click", (event) => {
    event.preventDefault();
    setActiveScreen(1);
});

resetBtn.forEach((btn) =>
    btn.addEventListener("click", (event) => {
        event.preventDefault();
        clearInterval(interval);
        setActiveScreen(0);
    })
);

timeBtnList.addEventListener("click", (event) => {
    if (!event.target.classList.contains("time-btn")) {
        return;
    }
    time = +event.target.getAttribute("data-seconds");
    startGame();
});

board.addEventListener("click", ({ target }) => {
    if (target.classList.contains("circle")) {
        setScore(++gameScore);
        target.remove();
        createRandomCircle();
    }
});

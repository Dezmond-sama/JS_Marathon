import { getCoords, getNeighboursClosure } from "./helpers.js";
import states, { getState, setState } from "./states.js";

const initFieldData = (board) => {
    let fieldWidth, fieldHeight, fieldBombs;
    let isRunning, isGameover;

    let mouseDownCell;
    let fieldData;
    let linkedData;
    let getNeighbours;

    let closedCells;

    const openCell = ({ target }) => {
        if (isGameover) return;
        const cell = target.closest(".cell");
        if (!cell.classList.contains("closed")) return; //To prevent recursion loop
        if (getState(cell) === "protected") return;
        const [x, y] = getCoords(cell);
        if (!isRunning) {
            isRunning = true;
            initBombs(x, y);
        }
        cell.classList.remove("closed");
        closedCells--;
        if (fieldData[y][x] === -1) {
            cell.innerHTML = `<div class="bomb"></div>`;
            gameover();
            return;
        }
        let neighbourBombs = 0;
        const neighbours = getNeighbours(x, y);
        for (const [neighbourX, neighbourY] of neighbours) {
            if (fieldData[neighbourY][neighbourX] === -1) neighbourBombs++;
        }
        cell.innerHTML = neighbourBombs
            ? `<span class="digit--${neighbourBombs}">${neighbourBombs}</span>`
            : ``;
        if (neighbourBombs === 0) {
            for (const [neighbourX, neighbourY] of neighbours) {
                openCell({ target: linkedData[neighbourY][neighbourX] });
            }
        }
    };

    const changeState = ({ target }) => {
        const cell = target.closest(".cell");
        if (!cell.classList.contains("closed")) return; //Already opened
        const [x, y] = getCoords(cell);
        const state = getState(cell);
        setState(cell, states[state]?.next ?? "");
    };

    const openNeighbours = (cell) => {
        if (cell.classList.contains("closed")) return; //function only for opened cells
        console.log(cell);
        const [x, y] = getCoords(cell);
    };

    const initBombs = (clickX, clickY) => {
        let counter = fieldBombs;
        let iterations = 10; //to prevent infinite loop
        while (counter > 0) {
            let x = Math.floor(Math.random() * fieldWidth);
            let y = Math.floor(Math.random() * fieldHeight);
            if ((x != clickX || y != clickY) && fieldData[y][x] === 0) {
                fieldData[y][x] = -1;
                linkedData[y][x].setAttribute("data-value", -1);
                counter--;
                iterations = 10;
            } else {
                iterations--;
            }
        }
    };

    const createCell = (row, cellData, x, y) => {
        const cell = document.createElement("div");

        cell.classList.add("cell", "closed", "cell-box");
        cell.setAttribute("data-coord-x", x);
        cell.setAttribute("data-coord-y", y);
        cell.setAttribute("data-value", cellData);
        cell.setAttribute("data-state", states.default);
        cell.addEventListener("click", openCell);
        cell.addEventListener("contextmenu", changeState);
        cell.addEventListener("mousedown", ({ button }) => {
            console.log(button);
            if (button === 1) {
                mouseDownCell = cell;
            }
        });
        cell.addEventListener("mouseup", ({ button }) => {
            if (button === 1 && cell === mouseDownCell) {
                openNeighbours(cell);
            }
            mouseDownCell = undefined;
        });
        cell.innerHTML = states[states.default]?.html ?? "";
        row.appendChild(cell);
        return cell;
    };

    const createRow = (board, rowData, y) => {
        const row = document.createElement("div");
        row.classList.add("row");
        board.appendChild(row);
        return rowData.map((cell, x) => createCell(row, cell, x, y));
    };

    const newGame = (width, height, bombs) => {
        fieldWidth = width;
        fieldHeight = height;
        closedCells = width * height;
        fieldBombs = bombs;
        isRunning = false;
        isGameover = false;
        getNeighbours = getNeighboursClosure(width, height);
        fieldData = Array(fieldHeight)
            .fill(0)
            .map((_) => Array(fieldWidth).fill(0));

        board.innerHTML = "";
        linkedData = fieldData.map((row, y) => createRow(board, row, y));
    };

    const reset = () => {
        if (!fieldData) return;
        isRunning = false;
        isGameover = false;
        fieldData = fieldData.map((row) => row.map((_) => 0));
        linkedData.forEach((row) =>
            row.forEach((cell) => {
                cell.setAttribute("data-value", 0);
                cell.classList.add("closed");
                cell.setAttribute("data-state", states.default);
                cell.innerHTML = states[states.default]?.html ?? "";
            })
        );
        closedCells = fieldWidth * fieldHeight;
    };

    const gameover = () => {
        isRunning = false;
        isGameover = true;
    };

    return [newGame, reset];
};

export default initFieldData;

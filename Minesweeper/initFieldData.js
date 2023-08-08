import { getCoords, getNeighboursClosure } from "./helpers.js";
import states, { getState, setState } from "./states.js";

const initFieldData = (board) => {
    let fieldWidth, fieldHeight, fieldBombs;
    let isRunning, isGameover;

    let mouseDownCell;
    let fieldData;
    let domData;
    let getNeighbours;
    let currentStates = {};

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
            gameover(false);
            return;
        }
        if (closedCells - fieldBombs === 0) {
            gameover(true);
        }
        let neighbourBombs = fieldData[y][x];
        const neighbours = getNeighbours(x, y);
        cell.innerHTML = neighbourBombs
            ? `<span class="digit--${neighbourBombs}">${neighbourBombs}</span>`
            : ``;
        if (neighbourBombs === 0) {
            for (const [neighbourX, neighbourY] of neighbours) {
                openCell({ target: domData[neighbourY][neighbourX] });
            }
        }
    };

    const changeState = ({ target }) => {
        const cell = target.closest(".cell");
        if (!cell.classList.contains("closed")) return; //Already opened
        const [x, y] = getCoords(cell);
        let state = getState(cell);
        currentStates[state] = (currentStates[state] || 0) - 1;
        state = states[state]?.next ?? "";
        setState(cell, state);
        currentStates[state] = (currentStates[state] || 0) + 1;
        board.dispatchEvent(
            new CustomEvent("changestate", {
                detail: { states: currentStates },
            })
        );
    };

    const openNeighbours = (cell) => {
        if (cell.classList.contains("closed")) return; //function only for opened cells
        const [x, y] = getCoords(cell);
        const neighbours = getNeighbours(x, y);
        let flagCounter = 0;
        for (const [neighbourX, neighbourY] of neighbours) {
            if (states[getState(domData[neighbourY][neighbourX])]?.protected)
                flagCounter++;
        }
        if (fieldData[y][x] !== flagCounter) return;

        for (const [neighbourX, neighbourY] of neighbours) {
            openCell({ target: domData[neighbourY][neighbourX] });
        }
    };

    const initBombs = (clickX, clickY) => {
        let counter = fieldBombs;
        let iterations = 10; //to prevent infinite loop
        while (counter > 0) {
            let x = Math.floor(Math.random() * fieldWidth);
            let y = Math.floor(Math.random() * fieldHeight);
            if ((x != clickX || y != clickY) && fieldData[y][x] !== -1) {
                fieldData[y][x] = -1;
                for (const [neighbourX, neighbourY] of getNeighbours(x, y)) {
                    if (fieldData[neighbourY][neighbourX] !== -1)
                        fieldData[neighbourY][neighbourX]++;
                }
                domData[y][x].setAttribute("data-value", -1);
                counter--;
                iterations = 10;
            } else {
                iterations--;
            }
        }
        board.dispatchEvent(new CustomEvent("gamestart"));
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

    const fillDomData = () => {
        board.innerHTML = "";
        domData = fieldData.map((row, y) => createRow(board, row, y));
        closedCells = fieldWidth * fieldHeight;
        currentStates[states.default] = closedCells;
    };

    const newGame = (width, height, bombs) => {
        fieldWidth = width;
        fieldHeight = height;
        fieldBombs = bombs;
        isRunning = false;
        isGameover = false;
        getNeighbours = getNeighboursClosure(width, height);
        fieldData = Array(fieldHeight)
            .fill(0)
            .map((_) => Array(fieldWidth).fill(0));
        fillDomData();
    };

    const reset = () => {
        if (!fieldData) return;
        isRunning = false;
        isGameover = false;
        fieldData = fieldData.map((row) => row.map((_) => 0));
        currentStates = {};
        fillDomData();
    };

    const gameover = (isWin) => {
        isRunning = false;
        isGameover = true;
        board.dispatchEvent(
            new CustomEvent("gameover", { detail: { win: isWin } })
        );
    };

    return [newGame, reset];
};

export default initFieldData;

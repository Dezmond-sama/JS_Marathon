import { getCoords, getNeighboursClosure } from "./helpers.js";
import states, { findStateByShort, getState, setState } from "./states.js";

const initFieldData = (board) => {
    let fieldWidth, fieldHeight, fieldBombs;
    let isRunning, isGameover;

    let mouseDownCell;
    let fieldData;
    let domData;
    let getNeighbours;
    let currentStates = {};

    let closedCells;
    const setCellInnerHTML = (cell, value) => {
        if (value >= 0) {
            cell.innerHTML = value
                ? `<span class="digit--${value}">${value}</span>`
                : ``;
        } else if (value === -1) {
            cell.innerHTML = `<div class="bomb"></div>`;
        }
    };
    const openCell = (cell, save) => {
        if (isGameover) return;
        if (!cell.classList.contains("closed")) return; //To prevent recursion loop
        if (getState(cell) === "protected") return;
        const [x, y] = getCoords(cell);
        if (!isRunning) {
            isRunning = true;
            initBombs(x, y);
        }
        cell.classList.remove("closed");
        closedCells--;
        setCellInnerHTML(cell, fieldData[y][x]);
        if (fieldData[y][x] === -1) {
            gameover(false);
            return;
        }
        if (closedCells - fieldBombs === 0) {
            gameover(true);
            return;
        }
        const neighbours = getNeighbours(x, y);
        if (fieldData[y][x] === 0) {
            for (const [neighbourX, neighbourY] of neighbours) {
                openCell(domData[neighbourY][neighbourX], false);
            }
        }
        if (save) saveDataToLocalStore();
    };

    const changeState = (cell) => {
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
        saveDataToLocalStore();
    };

    const updateCurrentStates = () => {
        currentStates = {};
        domData.forEach((row) =>
            row.forEach((elem) => {
                const state = getState(elem);
                currentStates[state] = (currentStates[state] || 0) + 1;
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
            openCell(domData[neighbourY][neighbourX], false);
        }
        if (isRunning) saveDataToLocalStore();
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

    const createCell = (row, cellData, x, y, state) => {
        const cell = document.createElement("div");

        cell.classList.add("cell", "cell-box");
        cell.setAttribute("data-coord-x", x);
        cell.setAttribute("data-coord-y", y);
        cell.setAttribute("data-value", cellData);
        cell.innerHTML = states[state ?? states.default]?.html ?? "";
        if (state) {
            if (state === "o") {
                cell.setAttribute("data-state", states.default);
                setCellInnerHTML(cell, cellData);
            } else {
                cell.setAttribute("data-state", state);
                cell.classList.add("closed");
            }
        } else {
            cell.setAttribute("data-state", states.default);
            cell.classList.add("closed");
        }
        cell.addEventListener("click", () => openCell(cell, true));
        cell.addEventListener("contextmenu", () => changeState(cell));
        cell.addEventListener("mousedown", ({ button }) => {
            if (button === 1) {
                mouseDownCell = cell;
            }
        });
        cell.addEventListener("mouseup", (e) => {
            if (e.button === 1 && cell === mouseDownCell) {
                openNeighbours(cell);
            }
            mouseDownCell = undefined;
        });
        row.appendChild(cell);
        return cell;
    };

    const createRow = (board, rowData, y, rowStates) => {
        const row = document.createElement("div");
        row.classList.add("row");
        board.appendChild(row);
        if (rowStates) {
            return rowData.map((cell, x) =>
                createCell(row, cell, x, y, rowStates[x])
            );
        } else {
            return rowData.map((cell, x) => createCell(row, cell, x, y));
        }
    };

    const fillDomData = (statesData) => {
        board.innerHTML = "";
        closedCells = fieldWidth * fieldHeight;
        if (statesData) {
            domData = fieldData.map((row, y) =>
                createRow(board, row, y, statesData[y])
            );
            const opened = statesData.reduce(
                (total, row) =>
                    total +
                    row.reduce((inRow, elem) => {
                        if (elem === "o") return inRow + 1;
                        else return inRow;
                    }, 0),
                0
            );
            closedCells -= opened;
        } else {
            domData = fieldData.map((row, y) => createRow(board, row, y));
        }
        currentStates[states.default] = closedCells;
    };

    const newGame = (width, height, bombs, clear) => {
        fieldWidth = width;
        fieldHeight = height;
        fieldBombs = bombs;
        isRunning = false;
        isGameover = false;
        getNeighbours = getNeighboursClosure(width, height);
        if (clear || !loadDataFromLocalStore()) {
            fieldData = Array(fieldHeight)
                .fill(0)
                .map((_) => Array(fieldWidth).fill(0));
            saveDataToLocalStore();
            fillDomData();
        }
    };

    const reset = () => {
        if (!fieldData) return;
        isRunning = false;
        isGameover = false;
        fieldData = fieldData.map((row) => row.map((_) => 0));
        currentStates = {};
        clearDataFromLocalStore();
        fillDomData();
    };

    const gameover = (isWin) => {
        isRunning = false;
        isGameover = true;
        clearDataFromLocalStore();
        board.dispatchEvent(
            new CustomEvent("gameover", { detail: { win: isWin } })
        );
    };

    const saveDataToLocalStore = () => {
        localStorage.setItem("fieldData", fieldData);
        localStorage.setItem(
            "fieldStates",
            domData?.map((row) =>
                row.map((elem) =>
                    elem.classList.contains("closed")
                        ? states[getState(elem)]?.short
                        : "o"
                )
            )
        );
    };

    const clearDataFromLocalStore = () => {
        localStorage.removeItem("fieldData");
        localStorage.removeItem("fieldStates");
    };

    const loadDataFromLocalStore = () => {
        let bombs = 0;
        const savedData = localStorage
            .getItem("fieldData")
            ?.split(",")
            .map((value) => {
                const res = +value;
                if (res === -1) bombs++;
                return res;
            });
        const savedStates = localStorage
            .getItem("fieldStates")
            ?.split(",")
            .map((value) => findStateByShort(value));
        if (
            savedData &&
            savedStates &&
            savedData.length === savedStates.length &&
            savedData.length === fieldWidth * fieldHeight &&
            bombs === fieldBombs
        ) {
            isRunning = true;
            fieldData = [];
            const statesData = [];
            while (savedData.length) {
                fieldData.push(savedData.splice(0, fieldWidth));
                statesData.push(savedStates.splice(0, fieldWidth));
            }
            fillDomData(statesData);
            board.dispatchEvent(new CustomEvent("gamestart"));
            updateCurrentStates();
            board.dispatchEvent(
                new CustomEvent("changestate", {
                    detail: { states: currentStates },
                })
            );
            return true;
        } else {
            clearDataFromLocalStore();
        }
        return false;
    };

    return [newGame, reset];
};

export default initFieldData;

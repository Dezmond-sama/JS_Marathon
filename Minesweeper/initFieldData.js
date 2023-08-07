const initFieldData = (board, width, height, bombs) => {
    let isRunning = false;
    let isGameover = false;

    const neighbours = (x, y) => {
        return Array(9)
            .fill([x - 1, y - 1])
            .map((elem, i) => [elem[0] + (i % 3), elem[1] + ~~(i / 3)])
            .filter((elem) => elem[0] >= 0 && elem[1] >= 0)
            .filter((elem) => elem[0] < width && elem[1] < height)
            .filter((elem) => elem[0] != x || elem[1] != y);
    };

    const getCoords = (cell) => {
        const x = +cell.getAttribute("data-coord-x");
        const y = +cell.getAttribute("data-coord-y");
        return [x, y];
    };
    const getState = (cell) => cell.getAttribute("data-state");
    const setState = (cell, state) => {
        console.log("setState", state);
        cell.setAttribute("data-state", state);
        switch (state) {
            case "protected":
                cell.innerHTML = `<div class="flag"></div>`;
                break;
            case "question":
                cell.innerHTML = "?";
                break;

            default:
                cell.innerHTML = "";
                break;
        }
    };
    const cellClicked = ({ target }) => {
        if (isGameover) return;
        const cell = target.closest(".cell");
        if (getState(cell) === "protected") return;
        const [x, y] = getCoords(cell);
        if (!isRunning) {
            isRunning = true;
            initBombs(x, y);
        }
        cell.classList.remove("closed");
        if (fieldData[y][x] === -1) {
            cell.innerText = "*";
            gameover();
            return;
        }
        let neighbourBombs = 0;
        for (const [neighbourX, neighbourY] of neighbours(x, y)) {
            if (fieldData[neighbourY][neighbourX] === -1) neighbourBombs++;
        }
        cell.innerText = neighbourBombs || "";
    };

    const cellRightClicked = ({ target }) => {
        const cell = target.closest(".cell");
        if (!cell.classList.contains("closed")) return; //Already opened
        const [x, y] = getCoords(cell);
        const state = getState(cell);
        switch (state) {
            case "protected":
                setState(cell, "question");
                break;
            case "question":
                setState(cell, "standard");
                break;
            default:
                setState(cell, "protected");
                break;
        }
    };
    const initBombs = (clickX, clickY) => {
        let counter = bombs;
        let iterations = 10; //to prevent infinite loop
        while (counter > 0) {
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
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
        cell.setAttribute("data-state", "standard");
        cell.addEventListener("click", cellClicked);
        cell.addEventListener("contextmenu", cellRightClicked);
        row.appendChild(cell);
        return cell;
    };

    const createRow = (board, rowData, y) => {
        const row = document.createElement("div");
        row.classList.add("row");
        board.appendChild(row);
        return rowData.map((cell, x) => createCell(row, cell, x, y));
    };

    const fieldData = Array(height)
        .fill(0)
        .map((_) => Array(width).fill(0));

    const linkedData = fieldData.map((row, y) => createRow(board, row, y));

    const reset = () => {
        isRunning = false;
        isGameover = false;
        Array.prototype.map((row) => row.map((_) => 0), fieldData);
        linkedData.forEach((row) =>
            row.forEach((cell) => {
                cell.setAttribute("data-value", 0);
                cell.classList.add("closed");
                cell.innerHTML = "";
            })
        );
    };

    const gameover = () => {
        isRunning = false;
        isGameover = true;
    };

    return [fieldData, linkedData, reset];
};

export default initFieldData;

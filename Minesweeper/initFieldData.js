const initFieldData = (board, width, height, bombs) => {
    let isRunning = false;

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

    const cellClicked = ({ target }) => {
        const [x, y] = getCoords(target);
        if (!isRunning) {
            isRunning = true;
            initBombs(x, y);
        }
        target.classList.remove("closed");
        if (fieldData[y][x] === -1) {
            gameover();
            return;
        }
        console.log(neighbours(x, y));
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
        cell.addEventListener("click", cellClicked);
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
        Array.prototype.map((row) => row.map((_) => 0), fieldData);
        linkedData.forEach((row) =>
            row.forEach((cell) => {
                cell.setAttribute("data-value", 0);
                cell.classList.add("closed");
            })
        );
    };

    const gameover = () => {
        isRunning = false;
    };

    return [fieldData, linkedData, reset];
};

export default initFieldData;

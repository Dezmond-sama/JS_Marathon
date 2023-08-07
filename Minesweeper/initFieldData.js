const initFieldData = (board, width, height, bombs) => {
    let isRunning = false;

    const cellClicked = ({ target }) => {
        const x = +target.getAttribute("data-coord-x");
        const y = +target.getAttribute("data-coord-y");
        if (!isRunning) {
            isRunning = true;
            initBombs(x, y);
        }
        target.classList.remove("closed");
    };

    const initBombs = (clickX, clickY) => {
        console.log(clickX, clickY, bombs);
        let counter = bombs;
        while (counter > 0) {
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            if ((x != clickX || y != clickY) && fieldData[y][x] === 0) {
                fieldData[y][x] = -1;
                linkedData[y][x].setAttribute("data-value", -1);
                counter--;
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
    return [fieldData, linkedData, reset];
};

export default initFieldData;

const board = document.querySelector("#board");
const width = 10;
const height = 10;

const fieldData = Array(height)
    .fill(0)
    .map((_) => Array(width).fill(0));

const createCell = (row, cellData) => {
    const cell = document.createElement("div");
    cell.classList.add("cell", "cell-box");
    cell.setAttribute("data-value", cellData);
    row.appendChild(cell);
};

const createRow = (board, rowData) => {
    const row = document.createElement("div");
    row.classList.add("row");
    rowData.forEach((cell) => {
        createCell(row, cell);
    });
    board.appendChild(row);
};
fieldData.forEach((row) => {
    createRow(board, row);
});

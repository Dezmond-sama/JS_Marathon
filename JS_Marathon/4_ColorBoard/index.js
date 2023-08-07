const CELLS_COUNT = 500;

const board = document.querySelector("#board");

const setColor = (element, color) => {
    element.style.backgroundColor = color;
    if (color) {
        element.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`;
    } else {
        element.style.boxShadow = null;
    }
};

const resetColor = (element) => {
    setColor(element, null); // reset to CSS value
};

const getRandomColor = () => {
    const r = ~~(50 + Math.random() * 156);
    const g = ~~(50 + Math.random() * 156);
    const b = ~~(50 + Math.random() * 156);
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
};

const makeCell = () => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("mouseenter", () => setColor(cell, getRandomColor()));
    cell.addEventListener("mouseleave", () => resetColor(cell));
    return cell;
};

for (let i = 0; i < CELLS_COUNT; i++) {
    board.append(makeCell());
}

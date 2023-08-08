export const getNeighboursClosure = (width, height) => {
    return (x, y) =>
        Array(9)
            .fill([x - 1, y - 1])
            .map((elem, i) => [elem[0] + (i % 3), elem[1] + ~~(i / 3)])
            .filter((elem) => elem[0] >= 0 && elem[1] >= 0)
            .filter((elem) => elem[0] < width && elem[1] < height)
            .filter((elem) => elem[0] != x || elem[1] != y);
};

export const getCoords = (cell) => {
    const x = +cell.getAttribute("data-coord-x");
    const y = +cell.getAttribute("data-coord-y");
    return [x, y];
};

export const intToTimeString = (time) => {
    const minutes = ("0" + ~~(time / 60)).slice(-2);
    const seconds = ("0" + (time % 60)).slice(-2);
    return `${minutes}:${seconds}`;
};

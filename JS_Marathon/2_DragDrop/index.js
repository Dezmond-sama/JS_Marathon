let dragged = null;
let shift = [0, 0];

const dragable = document.querySelectorAll(".item");
const dropPositions = document.querySelectorAll(".placeholder");

const dragstart = ({ target }) => {
    dragged = target;
    target.classList.add("drag");
    setTimeout(() => target.classList.add("hidden"), 0);
};
const dragend = ({ target }) => {
    dragged = null;
    target.classList.remove("drag", "hidden");
};
const dragenter = ({ target }) => {
    let placeholder = target.closest(".placeholder");
    placeholder.classList.add("draghover");
};
const dragleave = (event) => {
    //dragleave also invokes on hovering over child elements, because of this, the selection does not work correctly
    //the solution found on the Internet with the counter helps, but when moving the mouse quickly, the counter gets lost, so another solution is needed
    let placeholder = event.target.closest(".placeholder");
    placeholder.classList.remove("draghover");
};
const dragover = (event) => {
    event.preventDefault();
};
const dragdrop = ({ target }) => {
    let placeholder = target.closest(".placeholder");
    placeholder.classList.remove("draghover");
    if (dragged) {
        placeholder.append(dragged);
    }
};

const getCoords = (e) => {
    const touch = e.touches[0] || e.changedTouches[0];
    const x = touch.pageX;
    const y = touch.pageY;
    return [x, y];
};
const touchstart = (e) => {
    const target = e.target;
    const [touchX, touchY] = getCoords(e);
    target.classList.add("drag");
    const { x, y } = target.getBoundingClientRect();
    shift = [touchX - x, touchY - y];
};
const touchmove = (e) => {
    const target = e.target;
    const [touchX, touchY] = getCoords(e);
    target.style.left = `${touchX - shift[0]}px`;
    target.style.top = `${touchY - shift[1]}px`;
};
const touchend = (e) => {
    const target = e.target;
    target.style.left = "";
    target.style.top = "";
    target.classList.remove("drag");
};
const touchdrop = (e) => {
    const dragged = e.target;
    if (!dragged || !dragged.classList.contains("item")) return;
    const target = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
    );
    let placeholder = target.closest(".placeholder");
    if (!placeholder) return;
    placeholder.classList.remove("draghover");
    placeholder.appendChild(dragged);
};

dragable.forEach((elem) => {
    elem.addEventListener("dragstart", dragstart);
    elem.addEventListener("dragend", dragend);

    elem.addEventListener("touchstart", touchstart);
    elem.addEventListener("touchmove", touchmove);
    elem.addEventListener("touchend", touchend);
});

dropPositions.forEach((elem) => {
    elem.addEventListener("dragleave", dragleave);
    elem.addEventListener("dragenter", dragenter);
    elem.addEventListener("dragover", dragover);
    elem.addEventListener("drop", dragdrop);

    elem.addEventListener("touchend", touchdrop);
});

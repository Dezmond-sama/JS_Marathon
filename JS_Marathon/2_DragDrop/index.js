let dragged = null;

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

dragable.forEach((elem) => {
    elem.addEventListener("dragstart", dragstart);
    elem.addEventListener("dragend", dragend);
});

dropPositions.forEach((elem) => {
    elem.addEventListener("dragleave", dragleave);
    elem.addEventListener("dragenter", dragenter);
    elem.addEventListener("dragover", dragover);
    elem.addEventListener("drop", dragdrop);
});

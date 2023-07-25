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
    //dragleave срабатывает и при наведении на дочерние элементы, из-за этого выделение не работает корректно
    //решение со сцетчиком помогает, но при быстром перемещении мыши счетчик сбивается, поэтому нужно другое решение
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

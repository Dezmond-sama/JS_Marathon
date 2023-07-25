const dragable = document.querySelector(".item");
const dropPositions = document.querySelectorAll(".placeholder");

const dragstart = ({ target }) => {
    target.classList.add("drag");
    setTimeout(() => target.classList.add("hidden"), 0);
};
const dragend = ({ target }) => {
    target.classList.remove("drag", "hidden");
};
const dragenter = ({ target }) => {
    target.classList.add("draghover");
};
const dragleave = ({ target }) => {
    target.classList.remove("draghover");
};
const dragover = (event) => {
    event.preventDefault();
};
const dragdrop = ({ target }) => {
    target.classList.remove("draghover");
    console.log("dragdrop");
};

dragable.addEventListener("dragstart", dragstart);
dragable.addEventListener("dragend", dragend);

dropPositions.forEach((elem) => {
    elem.addEventListener("dragleave", dragleave);
    elem.addEventListener("dragenter", dragenter);
    elem.addEventListener("dragover", dragover);
    elem.addEventListener("drop", dragdrop);
});

const upBtn = document.querySelector(".up-button");
const downBtn = document.querySelector(".down-button");
const sidebar = document.querySelector(".sidebar");
const mainSlide = document.querySelector(".main-slide");
const container = document.querySelector(".container");
const slideCount = sidebar.querySelectorAll("div").length;

sidebar.style.top = `-${(slideCount - 1) * 100}vh`;

let currentSlideIndex = 0;

const changeSlide = (direction) => {
    if (direction === "up") {
        currentSlideIndex++;
    } else if (direction === "down") {
        currentSlideIndex--;
    }
    currentSlideIndex = (slideCount + currentSlideIndex) % slideCount;

    const height = container.clientHeight;
    mainSlide.style.transform = `translateY(-${currentSlideIndex * height}px)`;
    //mainSlide.style.transform = `translateY(-${currentSlideIndex * 100}vh)`;
    sidebar.style.transform = `translateY(${currentSlideIndex * height}px)`;
};

upBtn.addEventListener("click", () => changeSlide("up"));
downBtn.addEventListener("click", () => changeSlide("down"));
window.addEventListener("resize", () => changeSlide()); // We need to recalculate height on resize or use 'vh'

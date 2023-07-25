const slides = document.querySelectorAll(".slide");
const clearActive = (elems) => {
    elems?.forEach((elem) => elem.classList.remove("active"));
};
slides.forEach((slide, index, allSlides) => {
    slide.addEventListener("click", () => {
        clearActive(allSlides);
        slide.classList.add("active");
    });
});

const states = {
    standard: { next: "protected", html: `` },
    protected: { next: "question", html: `<div class="flag"></div>` },
    question: { next: "standard", html: `?` },
    default: "standard",
};

export const getState = (cell) => cell.getAttribute("data-state");
export const setState = (cell, state) => {
    cell.setAttribute("data-state", state);
    cell.innerHTML = states[state]?.html ?? "";
};
export default states;

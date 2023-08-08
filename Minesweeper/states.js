const states = {
    standard: { next: "protected", html: ``, protected: false, short: "s" },
    protected: {
        next: "question",
        html: `<div class="flag"></div>`,
        protected: true,
        short: "p",
    },
    question: { next: "standard", html: `?`, protected: false, short: "?" },
    default: "standard",
};

export const getState = (cell) => cell.getAttribute("data-state");
export const setState = (cell, state) => {
    cell.setAttribute("data-state", state);
    cell.innerHTML = states[state]?.html ?? "";
};
export const findStateByShort = (short) => {
    for (const st in states) {
        if (states[st]?.short === short) return st;
    }
    return short;
};
export default states;

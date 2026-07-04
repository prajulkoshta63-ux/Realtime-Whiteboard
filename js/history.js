// ======================
// HISTORY SYSTEM
// ======================

let history = [];
let redoHistory = [];

// Save Current Canvas
function saveState() {

    history.push(canvas.toDataURL());

    // New drawing ke baad Redo clear
    redoHistory = [];

}

// Undo
function undo() {

    if (history.length <= 1) return;

    // Last state ko Redo me bhejo
    redoHistory.push(history.pop());

    let img = new Image();

    img.src = history[history.length - 1];

    img.onload = function () {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

    };

}

// Redo
function redo() {

    if (redoHistory.length === 0) return;

    let state = redoHistory.pop();

    history.push(state);

    let img = new Image();

    img.src = state;

    img.onload = function () {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

    };

}

// Save Blank Canvas
window.onload = () => {

    saveState();

};
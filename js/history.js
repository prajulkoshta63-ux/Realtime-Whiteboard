// ======================
// HISTORY SYSTEM
// ======================

let history = [];
let redoHistory = [];

// Save Current Canvas
function saveState() {
  history.push(JSON.stringify(shapes));

  // New drawing ke baad Redo clear
  redoHistory = [];
}

// Undo
function undo() {
  console.log("Undo:", history.length);
  if (history.length <= 1) return;

  redoHistory.push(history.pop());

  shapes = JSON.parse(history[history.length - 1]);

  selectedShape = null;

  requestRender();
}

// Redo
function redo() {
  console.log("Redo:", redoHistory.length);
  if (redoHistory.length === 0) return;

  const state = redoHistory.pop();

  history.push(state);

  shapes = JSON.parse(state);

  selectedShape = null;

  requestRender();
}

// ======================================
// PAGE LOAD
// ======================================

window.onload = () => {
  loadFromLocalStorage();

  history.push(JSON.stringify(shapes));

  drawAllShapes();
};
// ======================================
// SAVE TO LOCAL STORAGE
// ======================================

function saveToLocalStorage() {
  localStorage.setItem("whiteboard", JSON.stringify(shapes));
}
// ======================================
// LOAD FROM LOCAL STORAGE
// ======================================

function loadFromLocalStorage() {
  const data = localStorage.getItem("whiteboard");

  if (!data) return;

  shapes = JSON.parse(data);

  drawAllShapes();
}

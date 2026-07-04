const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

ctx.lineWidth = 3;
ctx.strokeStyle = "black";
ctx.lineCap = "round";

// Color Picker
const colorPicker = document.getElementById("colorPicker");

// Brush Size
const brushSize = document.getElementById("brushSize");
const fontSizeInput = document.getElementById("fontSize");
// Default Values
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSize.value;

// Change Color
colorPicker.addEventListener("input", () => {
    ctx.strokeStyle = colorPicker.value;
});

// Change Brush Size
brushSize.addEventListener("input", () => {
    ctx.lineWidth = brushSize.value;
});
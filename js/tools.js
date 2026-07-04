// Current active tool
let currentTool = "pencil";

// Buttons
const pencilBtn = document.getElementById("pencil");
const rectangleBtn = document.getElementById("rectangle");
const circleBtn = document.getElementById("circle");
const lineBtn = document.getElementById("line");
const eraserBtn = document.getElementById("eraser");

// Pencil
pencilBtn.addEventListener("click", () => {

    currentTool = "pencil";

    // Original settings
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;

    console.log("Pencil Selected");

});

// Rectangle
rectangleBtn.addEventListener("click", () => {
    currentTool = "rectangle";
    console.log("Rectangle Selected");
});

// Circle
circleBtn.addEventListener("click", () => {
    currentTool = "circle";
    console.log("Circle Selected");
});

// Line
lineBtn.addEventListener("click", () => {
    currentTool = "line";
    console.log("Line Selected");
});

// Eraser
eraserBtn.addEventListener("click", () => {
    currentTool = "eraser";

    // Eraser settings
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;

    console.log("Eraser Selected");
});
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const textBtn = document.getElementById("text");
// Text Tool
textBtn.addEventListener("click", () => {

    currentTool = "text";

    //setActiveButton(textBtn);

    console.log("Text Selected");

});
const selectBtn = document.getElementById("select");

selectBtn.addEventListener("click", () => {

    currentTool = "select";

    //setActiveButton(selectBtn);

    console.log("Select Tool");

});
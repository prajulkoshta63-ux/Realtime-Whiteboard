// Current active tool
let currentTool = "pencil";

// Buttons
const pencilBtn = document.getElementById("pencil");
const rectangleBtn = document.getElementById("rectangle");
const circleBtn = document.getElementById("circle");
const lineBtn = document.getElementById("line");
const eraserBtn = document.getElementById("eraser");
const bringFrontBtn = document.getElementById("bringFront");

const panBtn = document.getElementById("pan");
// Pencil
pencilBtn.addEventListener("click", () => {
  currentTool = "pencil";

  setActiveToolButton(pencilBtn);
  // Original settings
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = brushSize.value;

  console.log("Pencil Selected");
});

// Rectangle
rectangleBtn.addEventListener("click", () => {
  currentTool = "rectangle";
   setActiveToolButton(rectangleBtn);
  console.log("Rectangle Selected");
});

// Circle
circleBtn.addEventListener("click", () => {
  currentTool = "circle";
  setActiveToolButton(circleBtn);
  console.log("Circle Selected");
});

// Line
lineBtn.addEventListener("click", () => {
  currentTool = "line";
  setActiveToolButton(lineBtn);
  console.log("Line Selected");
});

// Eraser
eraserBtn.addEventListener("click", () => {
  currentTool = "eraser";
  setActiveToolButton(selectBtn);

  console.log("Eraser Selected");
});
// Pan
panBtn.addEventListener("click", () => {
  currentTool = "pan";

  setActiveToolButton(panBtn);
  console.log("Pan Selected");
});
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const textBtn = document.getElementById("text");
const imageInput = document.getElementById("imageInput");
const imageBtn = document.getElementById("image");
const exportPNGBtn = document.getElementById("exportPNG");
// Undo
undoBtn.addEventListener("click", () => {
  undo();
});

// Redo
redoBtn.addEventListener("click", () => {
  redo();
});

console.log("PNG Event Listener Attached", exportPNGBtn);
// Text Tool
textBtn.addEventListener("click", () => {
  currentTool = "text";

  setActiveToolButton(textBtn);
  //setActiveButton(textBtn);

  console.log("Text Selected");
});
imageBtn.addEventListener("click", () => {
  currentTool = "image";

  setActiveToolButton(imageBtn);
  imageInput.click();

  console.log("Image Tool");
});
const selectBtn = document.getElementById("select");
const toolButtons = [
  selectBtn,
  pencilBtn,
  rectangleBtn,
  circleBtn,
  lineBtn,
  eraserBtn,
  textBtn,
  imageBtn,
  panBtn,
];

function setActiveToolButton(activeBtn) {
  toolButtons.forEach((btn) => btn.classList.remove("active-tool"));

  activeBtn.classList.add("active-tool");
}

selectBtn.addEventListener("click", () => {
  currentTool = "select";

  //setActiveButton(selectBtn);

  console.log("Select Tool");
});
bringFrontBtn.addEventListener("click", () => {
  bringToFront();
});
const sendBackBtn = document.getElementById("sendBack");
const bringForwardBtn = document.getElementById("bringForward");
const sendBackwardBtn = document.getElementById("sendBackward");

sendBackBtn.addEventListener("click", () => {
  sendToBack();
});
bringForwardBtn.addEventListener("click", () => {
  bringForward();
});

sendBackwardBtn.addEventListener("click", () => {
  sendBackward();
});
fillColor.addEventListener("input", () => {
  if (!selectedShape) return;

  if (selectedShape.type === "rectangle" || selectedShape.type === "circle") {
    selectedShape.fillColor = fillColor.value;

    drawAllShapes();
  }
});

fillShape.addEventListener("change", () => {
  if (!selectedShape) return;

  if (selectedShape.type === "rectangle" || selectedShape.type === "circle") {
    selectedShape.fill = fillShape.checked;

    drawAllShapes();

    saveState();
  }
});
imageInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();

    img.onload = function () {

      console.log("Image Source:", img.src);
      shapes.push({
        type: "image",

        visible: true,
        locked: false,
        groupId: null,

        x: 100,
        y: 100,

        width: img.width,
        height: img.height,

        rotation: 0,
        src: img.src,
      });

      drawAllShapes();
      updateLayersPanel();
      saveState();
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

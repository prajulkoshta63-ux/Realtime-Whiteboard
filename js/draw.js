// ===========================
// DRAW.JS
// ===========================

// All Shapes
let shapes = [];

// Drawing Status
let drawing = false;

// Mouse Start Position
let startX = 0;
let startY = 0;

// Canvas Snapshot
let snapshot = null;

// Selection
let selectedShape = null;
let isDragging = false;

let dragOffsetX = 0;
let dragOffsetY = 0;


// ===========================
// Mouse Down
// ===========================

canvas.onmousedown = function (e) {

    startX = e.offsetX;
    startY = e.offsetY;
   // ===========================
// Mouse Up
// ===========================

canvas.onmouseup = function (e) {

    // Stop Dragging
    if (currentTool === "select") {

        isDragging = false;
        selectedShape = null;

        saveState();

        return;
    }

    // Stop Drawing
    drawing = false;

    // Rectangle Save
    if (currentTool === "rectangle") {

        shapes.push({

            type: "rectangle",

            x: startX,
            y: startY,

            width: e.offsetX - startX,
            height: e.offsetY - startY,

            color: colorPicker.value,
            lineWidth: brushSize.value

        });

        drawAllShapes();

    }

    saveState();

};


// ===========================
// Mouse Leave
// ===========================

canvas.onmouseleave = function () {

    drawing = false;

    isDragging = false;

};
    // ===========================
// Mouse Move
// ===========================

canvas.onmousemove = function (e) {

    // -------------------------
    // Move Selected Rectangle
    // -------------------------
    if (currentTool === "select" && isDragging && selectedShape) {

        selectedShape.x = e.offsetX - dragOffsetX;
        selectedShape.y = e.offsetY - dragOffsetY;

        drawAllShapes();

        return;
    }

    if (!drawing) return;

    // -------------------------
    // Pencil
    // -------------------------
    if (currentTool === "pencil" || currentTool === "eraser") {

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

    }

    // -------------------------
    // Rectangle Preview
    // -------------------------
    if (currentTool === "rectangle") {

        ctx.putImageData(snapshot, 0, 0);

        const width = e.offsetX - startX;
        const height = e.offsetY - startY;

        ctx.strokeRect(startX, startY, width, height);

    }

    // -------------------------
    // Line Preview
    // -------------------------
    if (currentTool === "line") {

        ctx.putImageData(snapshot, 0, 0);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

    }

    // -------------------------
    // Circle Preview
    // -------------------------
    if (currentTool === "circle") {

        ctx.putImageData(snapshot, 0, 0);

        const radius = Math.sqrt(
            Math.pow(e.offsetX - startX, 2) +
            Math.pow(e.offsetY - startY, 2)
        );

        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();

    }

};
    // -------------------------
    // TEXT TOOL
    // -------------------------
    if (currentTool === "text") {

        const text = prompt("Enter Text");

        if (text) {

            ctx.fillStyle = colorPicker.value;
            ctx.font = `${fontSizeInput.value}px Arial`;

            ctx.fillText(text, startX, startY);

            saveState();

        }

        return;
    }

    // -------------------------
    // SELECT TOOL
    // -------------------------
    if (currentTool === "select") {

        selectedShape = getShapeAt(startX, startY);

        if (selectedShape) {

            isDragging = true;

            dragOffsetX = startX - selectedShape.x;
            dragOffsetY = startY - selectedShape.y;

        }

        return;
    }

    // -------------------------
    // DRAW START
    // -------------------------

    drawing = true;

    snapshot = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.beginPath();
    ctx.moveTo(startX, startY);

};
// ===========================
// Draw All Shapes
// ===========================

function drawAllShapes() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let shape of shapes) {

        ctx.strokeStyle = shape.color || "#000";
        ctx.lineWidth = shape.lineWidth || 2;

        if (shape.type === "rectangle") {

            ctx.strokeRect(
                shape.x,
                shape.y,
                shape.width,
                shape.height
            );

        }

    }

}


// ===========================
// Get Shape At Mouse Position
// ===========================

function getShapeAt(x, y) {

    for (let i = shapes.length - 1; i >= 0; i--) {

        const shape = shapes[i];

        if (shape.type === "rectangle") {

            const left = Math.min(shape.x, shape.x + shape.width);
            const right = Math.max(shape.x, shape.x + shape.width);
            const top = Math.min(shape.y, shape.y + shape.height);
            const bottom = Math.max(shape.y, shape.y + shape.height);

            if (
                x >= left &&
                x <= right &&
                y >= top &&
                y <= bottom
            ) {
                return shape;
            }
        }
    }

    return null;

}
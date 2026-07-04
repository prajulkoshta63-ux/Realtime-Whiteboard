// ======================================
// DRAW.JS
// Professional Whiteboard
// Part 1
// ======================================

// ---------- Shapes ----------
let shapes = [];

// ---------- Drawing ----------
let drawing = false;
let startX = 0;
let startY = 0;
let snapshot = null;

// ---------- Selection ----------
let selectedShape = null;
let isDragging = false;

let dragOffsetX = 0;
let dragOffsetY = 0;

// ======================================
// MOUSE DOWN
// ======================================

canvas.onmousedown = function (e) {

    startX = e.offsetX;
    startY = e.offsetY;

    // -----------------------
    // TEXT TOOL
    // -----------------------
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

    // -----------------------
    // SELECT TOOL
    // -----------------------
    if (currentTool === "select") {

        selectedShape = getShapeAt(startX, startY);

        if (selectedShape) {

            isDragging = true;

            dragOffsetX = startX - selectedShape.x;
            dragOffsetY = startY - selectedShape.y;

            drawAllShapes();
        }

        return;
    }

    // -----------------------
    // START DRAWING
    // -----------------------
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
// ======================================
// MOUSE MOVE
// ======================================

canvas.onmousemove = function (e) {

    // -----------------------
    // Move Selected Shape
    // -----------------------
    if (currentTool === "select" && isDragging && selectedShape) {

        selectedShape.x = e.offsetX - dragOffsetX;
        selectedShape.y = e.offsetY - dragOffsetY;

        drawAllShapes();

        return;
    }

    if (!drawing) return;

    // -----------------------
    // Pencil / Eraser
    // -----------------------
    if (currentTool === "pencil" || currentTool === "eraser") {

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        return;
    }

    // -----------------------
    // Rectangle Preview
    // -----------------------
    ctx.putImageData(snapshot, 0, 0);

    if (currentTool === "rectangle") {

        ctx.strokeRect(
            startX,
            startY,
            e.offsetX - startX,
            e.offsetY - startY
        );
    }

    // -----------------------
    // Line Preview
    // -----------------------
    if (currentTool === "line") {

        ctx.beginPath();

        ctx.moveTo(startX, startY);

        ctx.lineTo(e.offsetX, e.offsetY);

        ctx.stroke();
    }

    // -----------------------
    // Circle Preview
    // -----------------------
    if (currentTool === "circle") {

        const radius = Math.sqrt(
            (e.offsetX - startX) ** 2 +
            (e.offsetY - startY) ** 2
        );

        ctx.beginPath();

        ctx.arc(
            startX,
            startY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

};

// ======================================
// MOUSE UP
// ======================================

canvas.onmouseup = function (e) {

    if (currentTool === "select") {

        isDragging = false;

        saveState();

        return;
    }

    drawing = false;

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

    }

    saveState();

};

// ======================================
// MOUSE LEAVE
// ======================================

canvas.onmouseleave = function () {

    drawing = false;

    isDragging = false;

};
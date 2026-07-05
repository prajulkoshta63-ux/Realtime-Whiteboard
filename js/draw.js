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
// Resize
let isResizing = false;
const HANDLE_SIZE = 8;
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

    // Circle Handle
    if (
        selectedShape.type === "circle" &&
        isCircleHandle(selectedShape, startX, startY)
    ) {

        console.log("Circle Resize");

        isResizing = true;

    }

    // Rectangle Handle
    else if (
        selectedShape.type === "rectangle" &&
        isBottomRightHandle(selectedShape, startX, startY)
    ) {

        console.log("Rectangle Resize");

        isResizing = true;

    }

    // Drag
    else {

        isDragging = true;

        dragOffsetX = startX - selectedShape.x;
        dragOffsetY = startY - selectedShape.y;

    }

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
   // Resize Selected Shape
   // -------------------------
     if (currentTool === "select" && isResizing && selectedShape) {

    // Rectangle Resize
    if (selectedShape.type === "rectangle") {

        selectedShape.width = e.offsetX - selectedShape.x;
        selectedShape.height = e.offsetY - selectedShape.y;

    }

    // Circle Resize
    else if (selectedShape.type === "circle") {

        const dx = e.offsetX - selectedShape.x;
        const dy = e.offsetY - selectedShape.y;

        selectedShape.radius = Math.sqrt(dx * dx + dy * dy);

    }

    drawAllShapes();

    return;

}
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
        isResizing = false;

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
    if (currentTool === "circle") {

         const radius = Math.sqrt(
         Math.pow(e.offsetX - startX, 2) +
         Math.pow(e.offsetY - startY, 2)
        );

        shapes.push({

         type: "circle",

         x: startX,
         y: startY,
 
         radius: radius,
 
         color: colorPicker.value,
         lineWidth: brushSize.value

        });

    }
    drawAllShapes();

    saveState();

};

// ======================================
// MOUSE LEAVE
// ======================================

canvas.onmouseleave = function () {

    drawing = false;

    isDragging = false;

};
// ======================================
// DRAW ALL SHAPES
// ======================================

function drawAllShapes() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let shape of shapes) {

        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.lineWidth;

        if (shape.type === "rectangle") {

            ctx.strokeRect(
                shape.x,
                shape.y,
                shape.width,
                shape.height
            );

            // Selected Border
            if (shape === selectedShape) {

               ctx.save();

               ctx.strokeStyle = "blue";
               ctx.lineWidth = 2;

               ctx.strokeRect(
                  shape.x - 3,
                  shape.y - 3,
                  shape.width + 6,
                  shape.height + 6
             );

                 ctx.restore();

                // Draw Handles
                drawResizeHandles(shape);

            }

        }
        if (shape.type === "circle")
             {

             ctx.beginPath();

             ctx.arc(
             shape.x,
             shape.y,
             shape.radius,
             0,
            Math.PI * 2
             );

             ctx.stroke();
            }
         // Selected Border
         if (shape === selectedShape) {
  
             ctx.save();

             ctx.strokeStyle = "blue";
             ctx.lineWidth = 2;

             ctx.beginPath();

             ctx.arc(
                 shape.x,
                 shape.y,
                 shape.radius + 4,
                 0,
                 Math.PI * 2
                );

             ctx.stroke();

             ctx.restore();

       

            }
           // Circle Resize Handle
           ctx.fillStyle = "blue";

           ctx.fillRect(
               shape.x + shape.radius - 4,
               shape.y - 4,
               HANDLE_SIZE,
               HANDLE_SIZE
            );


    }
}




// ======================================
// GET SHAPE AT POSITION
// ======================================

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

           if (shape.type === "circle") {

            const dx = x - shape.x;
            const dy = y - shape.y;

            const distance = Math.sqrt(dx * dx + dy * dy);
 
             if (distance <= shape.radius) {

                 return shape;

                }

            }
    }

    return null;

}
// ======================================
// DRAW RESIZE HANDLES
// ======================================

function drawResizeHandles(shape) {

    HANDLE_SIZE

    ctx.save();

    ctx.fillStyle = "blue";

    // Top Left
    ctx.fillRect(shape.x - 4, shape.y - 4, size, size);

    // Top Right
    ctx.fillRect(shape.x + shape.width - 4, shape.y - 4, size, size);

    // Bottom Left
    ctx.fillRect(shape.x - 4, shape.y + shape.height - 4, size, size);

    // Bottom Right
    ctx.fillRect(
        shape.x + shape.width - 4,
        shape.y + shape.height - 4,
        size,
        size
    );

    ctx.restore();

}
function isBottomRightHandle(shape, x, y) {

    return (

        x >= shape.x + shape.width - 6 &&
        x <= shape.x + shape.width + 6 &&
        y >= shape.y + shape.height - 6 &&
        y <= shape.y + shape.height + 6

    );

}
// ======================================
// CIRCLE RESIZE HANDLE
// ======================================

function isCircleHandle(shape, x, y) {

    return (

        x >= shape.x + shape.radius - 6 &&
        x <= shape.x + shape.radius + 6 &&
        y >= shape.y - 6 &&
        y <= shape.y + 6

    );

}
// ======================================
// START DRAWING
// ======================================

function startDrawing() {

    startDrawing();

}
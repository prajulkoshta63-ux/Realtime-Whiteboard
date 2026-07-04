// All shapes will be stored here
let shapes = [];

// Selected shape
let selectedShape = null;
let offsetX = 0;
let offsetY = 0;
// Dragging status
let isDragging = false;
let drawing = false;

let startX = 0;
let startY = 0;
let snapshot = null;


// Mouse Down
canvas.onmousedown = function (e) {

    // Text Tool
    if (currentTool === "text") {

        const text = prompt("Enter your text:");

        if (text) {

            
            const fontSize = fontSizeInput.value;
            ctx.fillStyle = colorPicker.value;
            const fontFamily = prompt("Font Family (Arial, Times New Roman, Verdana):", "Arial");

            ctx.font = `${fontSize}px ${fontFamily}`;

            ctx.fillText(text, e.offsetX, e.offsetY);

            saveState();
        }

        return;
    }
// Select Tool
 if (currentTool === "select") {

    selectedShape = getShapeAt(e.offsetX, e.offsetY);

    if (selectedShape) {

        isDragging = true;

        offsetX = e.offsetX - selectedShape.x;
        offsetY = e.offsetY - selectedShape.y;

        console.log("Selected:", selectedShape);

    } else {

        console.log("No Shape Selected");

    }

    return;
};

// Mouse Move
canvas.onmousemove = function (e) {
    // Move Selected Shape
 if (currentTool === "select" && isDragging && selectedShape) {

    selectedShape.x = e.offsetX - offsetX;
    selectedShape.y = e.offsetY - offsetY;

    drawAllShapes();

    return;
}
    if (!drawing) return;

    // Pencil
    // Pencil + Eraser
    if (currentTool === "pencil" || currentTool === "eraser") {

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

}

    // Rectangle Preview
    if (currentTool === "rectangle") {

        ctx.putImageData(snapshot, 0, 0);

        const width = e.offsetX - startX;
        const height = e.offsetY - startY;

        ctx.strokeRect(startX, startY, width, height);

    }
    // Line Preview
 if (currentTool === "line") {

    ctx.putImageData(snapshot, 0, 0);

    ctx.beginPath();

    ctx.moveTo(startX, startY);

    ctx.lineTo(e.offsetX, e.offsetY);

    ctx.stroke();

}
 // Circle Preview
 if (currentTool === "circle") {

    // Purana canvas restore karo
    ctx.putImageData(snapshot, 0, 0);

    // Radius calculate karo
    const radius = Math.sqrt(
        Math.pow(e.offsetX - startX, 2) +
        Math.pow(e.offsetY - startY, 2)
    );

    // Circle draw karo
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();

}



};

// Mouse Up
// Mouse Up
canvas.onmouseup = function (e) {

    console.log("Mouse Up");

    if (currentTool === "rectangle") {

        console.log("Rectangle Saved");

        shapes.push({
            
            type: "rectangle",
            x: startX,
            y: startY,
            width: e.offsetX - startX,
            height: e.offsetY - startY
        });
        drawAllShapes();
        console.log(shapes);
    }

    drawing = false;
    isDragging = false;
    selectedShape = null;
    saveState();
};


// Mouse Leave
canvas.onmouseleave = function () {

    drawing = false;

};

function getShapeAt(x, y) {

    for (let i = shapes.length - 1; i >= 0; i--) {

        let shape = shapes[i];

        if (
            shape.type === "rectangle" &&
            x >= shape.x &&
            x <= shape.x + shape.width &&
            y >= shape.y &&
            y <= shape.y + shape.height
        ) {
            return shape;
        }
    }

    return null;
}
function drawAllShapes() {

    // Canvas clear karo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Har shape draw karo
    for (let shape of shapes) {

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



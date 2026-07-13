// ======================================
// DRAW ALL SHAPES
// =====================================
function renderShapes(renderCtx, showSelection = true)  {
  if (!shapes || shapes.length === 0) return;
  for (let i = 0; i < shapes.length; i++) {
  const shape = shapes[i];
    // Invalid / deleted shape
    if (!shape || typeof shape !== "object") continue;

    if (shape.visible === false) continue;

  

    switch (shape.type) {
      case "rectangle":
        drawRectangle(shape, renderCtx, showSelection);
        break;

      case "circle":
        drawCircle(shape, renderCtx, showSelection);
        break;

      case "line":
        drawLine(shape, renderCtx, showSelection);
        break;

      case "pencil":
        drawPencil(shape, renderCtx );
        break;

      case "text":
        drawText(shape, renderCtx, showSelection);
        break;

      case "image":
        drawImageShape(shape, renderCtx, showSelection);
        break;
    }
  }
}
function drawAllShapes() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (showGrid) {
    drawGrid();
  }

  ctx.setTransform(camera.scale, 0, 0, camera.scale, camera.x, camera.y);
  renderShapes(ctx);

  if (isSelecting) {
    ctx.save();

    ctx.strokeStyle = "dodgerblue";
    ctx.setLineDash([6, 6]);

    ctx.strokeRect(
      selectionBox.x,
      selectionBox.y,
      selectionBox.width,
      selectionBox.height,
    );

    ctx.restore();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// ======================================
// DRAW RECTANGLE
// ======================================

 function drawRectangle(shape, renderCtx = ctx, showSelection = true){
  renderCtx.save();

  renderCtx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);

  renderCtx.rotate(shape.rotation);

  renderCtx.strokeStyle = shape.color;
  renderCtx.lineWidth = shape.lineWidth;

  if (shape.fill) {
    renderCtx.fillStyle = shape.fillColor;
    renderCtx.fillRect(
      -shape.width / 2,
      -shape.height / 2,
      shape.width,
      shape.height,
    );
  }

  renderCtx.strokeRect(
    -shape.width / 2,
    -shape.height / 2,
    shape.width,
    shape.height,
  );

  renderCtx.restore();

  // Selection box abhi purani hi rehne do
  if (showSelection && selectedShapes.includes(shape)) {
    ctx.save();

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    ctx.strokeRect(shape.x - 3, shape.y - 3, shape.width + 6, shape.height + 6);

    ctx.restore();

    drawResizeHandles(shape);
    // Rotation Handle
    ctx.save();

    ctx.fillStyle = "red";

    ctx.beginPath();

    ctx.arc(shape.x + shape.width / 2, shape.y - 25, 6, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();
  }
}
// ======================================
// DRAW CIRCLE
// ======================================

 function drawCircle(shape, renderCtx = ctx, showSelection = true){
  renderCtx.strokeStyle = shape.color;
  renderCtx.lineWidth = shape.lineWidth;

  renderCtx.beginPath();
  renderCtx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);

  if (shape.fill) {
    renderCtx.fillStyle = shape.fillColor;
    renderCtx.fill();
  }

  renderCtx.stroke();

  if (showSelection && selectedShapes.includes(shape)) {
    ctx.save();

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(shape.x, shape.y, shape.radius + 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "blue";
    ctx.fillRect(
      shape.x + shape.radius - 4,
      shape.y - 4,
      HANDLE_SIZE,
      HANDLE_SIZE,
    );

    ctx.restore();
  }
}
// ======================================
// DRAW LINE
// ======================================

function drawLine(shape, renderCtx = ctx, showSelection = true) {
  renderCtx.strokeStyle = shape.color;
  renderCtx.lineWidth = shape.lineWidth;

  renderCtx.beginPath();
  renderCtx.moveTo(shape.x1, shape.y1);
  renderCtx.lineTo(shape.x2, shape.y2);
  renderCtx.stroke();

  if (showSelection && selectedShapes.includes(shape)) {
    ctx.save();

    ctx.fillStyle = "blue";

    // Start Handle
    ctx.fillRect(shape.x1 - 4, shape.y1 - 4, 8, 8);

    // End Handle
    ctx.fillRect(shape.x2 - 4, shape.y2 - 4, 8, 8);

    ctx.restore();
  }
}
// ======================================
// DRAW PENCIL
// ======================================

function drawPencil(shape, renderCtx = ctx) {
  console.log("DRAW PENCIL", shape);
  console.log(shape.points);
  renderCtx.strokeStyle = shape.color;
  renderCtx.lineWidth = shape.lineWidth;

  renderCtx.beginPath();

  renderCtx.moveTo(shape.points[0].x, shape.points[0].y);

  for (let i = 1; i < shape.points.length; i++) {
    renderCtx.lineTo(shape.points[i].x, shape.points[i].y);
  }

  renderCtx.stroke();
}
function drawImageShape(shape, renderCtx = ctx, showSelection = true){
  if (!shape.image) {
    shape.image = new Image();

    shape.image.onload = function () {
      requestRender();
    };

    shape.image.src = shape.src;

    return;
  }

  console.log("Image =", shape.image);
  console.log("Src =", shape.src);

  if (!(shape.image instanceof HTMLImageElement)) {
    return;
  }

  renderCtx.drawImage(shape.image, shape.x, shape.y, shape.width, shape.height);

  if (showSelection && selectedShapes.includes(shape)) {
    ctx.save();

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    ctx.strokeRect(shape.x - 3, shape.y - 3, shape.width + 6, shape.height + 6);

    ctx.restore();

    drawResizeHandles(shape);
  }
}
// ======================================
// DRAW TEXT
// ======================================

 function drawText(shape, renderCtx = ctx, showSelection = true) {
  renderCtx.save();

  renderCtx.fillStyle = shape.color;
  renderCtx.font = `${shape.fontSize}px ${shape.fontFamily}`;

  renderCtx.fillText(shape.text, shape.x, shape.y);

  if (showSelection && selectedShapes.includes(shape)) {
    const width = ctx.measureText(shape.text).width;
    const height = shape.fontSize;

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    ctx.strokeRect(shape.x - 4, shape.y - height - 4, width + 8, height + 8);
  }

  renderCtx.restore();
}
// ======================================
// DRAW GRID
// ======================================

function drawGrid() {
  const gridSize = 50;

  ctx.save();

  ctx.setTransform(camera.scale, 0, 0, camera.scale, camera.x, camera.y);

  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1 / camera.scale;

  const left = -camera.x / camera.scale;
  const top = -camera.y / camera.scale;

  const right = left + canvas.width / camera.scale;
  const bottom = top + canvas.height / camera.scale;

  // Vertical Lines
  for (
    let x = Math.floor(left / gridSize) * gridSize;
    x <= right;
    x += gridSize
  ) {
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }

  // Horizontal Lines
  for (
    let y = Math.floor(top / gridSize) * gridSize;
    y <= bottom;
    y += gridSize
  ) {
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
  }

  ctx.restore();
}

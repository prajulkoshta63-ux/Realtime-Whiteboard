canvas.onmousedown = function (e) {
  // ======================
  // PAN START
  // ======================

  if (e.button === 1) {
    isPanning = true;

    panStartX = e.clientX;
    panStartY = e.clientY;

    return;
  }
  const mouse = getMousePosition(e);

  startX = mouse.x;
  startY = mouse.y;
  // ======================
  // PAN TOOL
  // ======================

  if (currentTool === "pan") {
    isPanning = true;

    panStartX = e.clientX;
    panStartY = e.clientY;

    return;
  }
  // -----------------------
  // TEXT TOOL
  // -----------------------
  if (currentTool === "text") {
    const text = prompt("Enter Text");

    if (text) {
      shapes.push({
        type: "text",
        visible: true,
        locked: false,
        groupId: null,

        text: text,

        x: startX,
        y: startY,

        rotation: 0,
        color: colorPicker.value,

        fontSize: Number(fontSizeInput.value),

        fontFamily: "Arial",
      });

      drawAllShapes();

      updateLayersPanel();
      saveState();
    }

    return;
  }

  // -----------------------
  // ERASER TOOL
  // -----------------------
  if (currentTool === "eraser") {
    const mouse = getMousePosition(e);

    const shape = getShapeAt(mouse.x, mouse.y);

    if (!shape) {
      return;
    }

    console.log("Shape to delete:", shape);

    const index = shapes.indexOf(shape);

    if (index !== -1) {
      shapes.splice(index, 1);
    }

    selectedShape = null;
    selectedShapes = [];

    drawAllShapes();
    updateLayersPanel();

    saveState();
    saveToLocalStorage();

    return;
  }
  // -----------------------
  // SELECT TOOL
  // -----------------------
  if (currentTool === "select") {
    // -----------------------
    // GROUP RESIZE
    // -----------------------

    if (selectedShapes.length > 1) {
      groupBounds = getGroupBounds();

      if (isGroupResizeHandle(startX, startY)) {
        isGroupResizing = true;

        groupResizeStart = {
          mouseX: startX,
          mouseY: startY,

          bounds: {
            ...groupBounds,
          },

          shapes: JSON.parse(JSON.stringify(selectedShapes)),
        };

        return;
      }
    }
    selectedShape = getShapeAt(startX, startY);

    // Blank area -> Selection Box
    if (!selectedShape) {
      isSelecting = true;

      selectionBox.x = startX;
      selectionBox.y = startY;
      selectionBox.width = 0;
      selectionBox.height = 0;

      selectedShapes = [];

      drawAllShapes();

      return;
    }

    // ======================
    // SHIFT MULTI SELECT
    // ======================
    if (e.shiftKey) {
      if (selectedShape) {
        if (selectedShapes.includes(selectedShape)) {
          selectedShapes = selectedShapes.filter((s) => s !== selectedShape);
        } else {
          selectedShapes.push(selectedShape);
        }
      }

      drawAllShapes();
      updateLayersPanel();

      return;
    }

    // ======================================
    // NORMAL / GROUP SELECT
    // ======================================

    if (!e.shiftKey) {
      if (selectedShape && selectedShape.groupId) {
        selectedShapes = shapes.filter(
          (s) => s.groupId === selectedShape.groupId,
        );
      } else if (
        selectedShape &&
        !(selectedShapes.length > 1 && selectedShapes.includes(selectedShape))
      ) {
        selectedShapes = [selectedShape];
      } else if (!selectedShape) {
        selectedShapes = [];
      }
    }
    // ======================
    // NORMAL SELECT
    // ======================
    // Normal click => sirf ek shape select hogi
    // if (!e.shiftKey) {
    // if (
    //  !(
    //   selectedShapes.length > 1 &&
    //  selectedShape &&
    //   selectedShapes.includes(selectedShape)
    // )
    //) {
    // selectedShapes = [];

    //     if (selectedShape) {
    //     selectedShapes.push(selectedShape);
    // }
    //  }
    // }
    // ======================
    // NOTHING SELECTED
    // ======================
    if (!selectedShape) {
      drawAllShapes();
      updateLayersPanel();

      return;
    }

    if (
      selectedShape &&
      selectedShape.type === "rectangle" &&
      isRotationHandle(selectedShape, startX, startY)
    ) {
      isRotating = true;
      console.log("ROTATE START");
      return;
    }
    // ======================
    // FILL SETTINGS
    // ======================
    if (selectedShape.type === "rectangle" || selectedShape.type === "circle") {
      fillShape.checked = selectedShape.fill;
      fillColor.value = selectedShape.fillColor;
    }

    // ======================
    // START DRAG
    // ======================
    isDragging = true;

    dragStartMouseX = startX;
    dragStartMouseY = startY;

    dragStartPositions = [];

    for (let shape of selectedShapes) {
      if (
        shape.type === "rectangle" ||
        shape.type === "circle" ||
        shape.type === "text" ||
        shape.type === "image"
      ) {
        dragStartPositions.push({
          shape,
          x: shape.x,
          y: shape.y,
        });
      } else if (shape.type === "line") {
        dragStartPositions.push({
          shape,
          x1: shape.x1,
          y1: shape.y1,
          x2: shape.x2,
          y2: shape.y2,
        });
      } else if (shape.type === "pencil") {
        dragStartPositions.push({
          shape,
          points: JSON.parse(JSON.stringify(shape.points)),
        });
      }
    }

    // ======================
    // RESIZE
    // ======================

    if (
      selectedShape.type === "circle" &&
      isCircleHandle(selectedShape, startX, startY)
    ) {
      isDragging = false;
      isResizing = true;
    } else if (
      (selectedShape.type === "rectangle" || selectedShape.type === "image") &&
      isBottomRightHandle(selectedShape, startX, startY)
    ) {
      isDragging = false;
      isResizing = true;
    } else if (selectedShape.type === "line") {
      activeLineHandle = getLineHandle(selectedShape, startX, startY);

      if (activeLineHandle) {
        isDragging = false;
        isResizing = true;
      }
    }

    drawAllShapes();
    updateLayersPanel();

    return;
  }

  // -----------------------
  // START DRAWING
  // -----------------------

  drawing = true;

  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Pencil Object
  if (currentTool === "pencil") {
    currentStroke = {
      type: "pencil",
      visible: true,
      locked: false,

      points: [
        {
          x: startX,
          y: startY,
        },
      ],

      color: colorPicker.value,

      lineWidth: brushSize.value,
    };
  }

  ctx.beginPath();
  ctx.moveTo(startX, startY);
};
// ======================================
// MOUSE MOVE
// ======================================

canvas.onmousemove = function (e) {
  // -----------------------
  // Pan Canvas
  // -----------------------
  if (isPanning) {
    let dx = e.clientX - panStartX;
    let dy = e.clientY - panStartY;

    camera.x += dx;
    camera.y += dy;

    panStartX = e.clientX;
    panStartY = e.clientY;

    requestRender();

    return;
  }
  // -----------------------
  // Resize Selected Shape
  // -------------------------
  const mouse = getMousePosition(e);
  // ======================================
  // GROUP RESIZE
  // ======================================

  if (isGroupResizing && groupResizeStart) {
    const sx = groupResizeStart.bounds.width;
    const sy = groupResizeStart.bounds.height;

    let scaleX = (mouse.x - groupResizeStart.bounds.x) / sx;
    let scaleY = (mouse.y - groupResizeStart.bounds.y) / sy;

    if (scaleX < 0.1) scaleX = 0.1;
    if (scaleY < 0.1) scaleY = 0.1;

    for (let i = 0; i < selectedShapes.length; i++) {
      const shape = selectedShapes[i];
      const old = groupResizeStart.shapes[i];

      if (shape.type === "rectangle" || shape.type === "image") {
        shape.x =
          groupResizeStart.bounds.x +
          (old.x - groupResizeStart.bounds.x) * scaleX;

        shape.y =
          groupResizeStart.bounds.y +
          (old.y - groupResizeStart.bounds.y) * scaleY;

        shape.width = old.width * scaleX;
        shape.height = old.height * scaleY;
      } else if (shape.type === "circle") {
        shape.x =
          groupResizeStart.bounds.x +
          (old.x - groupResizeStart.bounds.x) * scaleX;

        shape.y =
          groupResizeStart.bounds.y +
          (old.y - groupResizeStart.bounds.y) * scaleY;

        shape.radius = old.radius * Math.min(scaleX, scaleY);
      }
    }

    drawAllShapes();
    return;
  }
  // ======================
  // Selection Box
  // ======================

  if (isSelecting) {
    selectionBox.width = mouse.x - selectionBox.x;
    selectionBox.height = mouse.y - selectionBox.y;

    requestRender();

    return;
  }
  // -----------------------
  // Line Resize
  // -----------------------
  if (
    currentTool === "select" &&
    isResizing &&
    selectedShape &&
    selectedShape.type === "line"
  ) {
    if (activeLineHandle === "start") {
      selectedShape.x1 = mouse.x;
      selectedShape.y1 = mouse.y;
    } else if (activeLineHandle === "end") {
      selectedShape.x2 = mouse.x;
      selectedShape.y2 = mouse.y;
    }

    requestRender();

    return;
  }
  if (currentTool === "select" && isResizing && selectedShape) {
    // Rectangle Resize
    if (selectedShape.type === "rectangle" || selectedShape.type === "image") {
      selectedShape.width = mouse.x - selectedShape.x;
      selectedShape.height = mouse.y - selectedShape.y;
    }

    // Circle Resize
    else if (selectedShape.type === "circle") {
      const dx = mouse.x - selectedShape.x;
      const dy = mouse.y - selectedShape.y;

      selectedShape.radius = Math.sqrt(dx * dx + dy * dy);
    }

    requestRender();

    return;
  }
  if (isRotating && selectedShape) {
    console.log("ROTATING");
    const cx = selectedShape.x + selectedShape.width / 2;
    const cy = selectedShape.y + selectedShape.height / 2;

    selectedShape.rotation = Math.atan2(mouse.y - cy, mouse.x - cx);

    requestRender();
    return;
  }
  // -----------------------
  // GROUP MOVE
  // -----------------------
  if (isDragging && selectedShapes.length > 0) {
    console.log("GROUP DRAG RUNNING", selectedShapes.length);
    const dx = mouse.x - dragStartMouseX;
    const dy = mouse.y - dragStartMouseY;

    for (let item of dragStartPositions) {
      const shape = item.shape;

      if (
        shape.type === "rectangle" ||
        shape.type === "circle" ||
        shape.type === "text" ||
        shape.type === "image"
      ) {
        shape.x = item.x + dx;
        shape.y = item.y + dy;
      } else if (shape.type === "line") {
        shape.x1 = item.x1 + dx;
        shape.y1 = item.y1 + dy;

        shape.x2 = item.x2 + dx;
        shape.y2 = item.y2 + dy;
      } else if (shape.type === "pencil") {
        for (let i = 0; i < shape.points.length; i++) {
          shape.points[i].x = item.points[i].x + dx;
          shape.points[i].y = item.points[i].y + dy;
        }
      }
    }

    requestRender();
    return;
  }
  if (!drawing) return;

  // -----------------------
  // Pencil / Eraser
  // -----------------------
  if (currentTool === "pencil") {
    currentStroke.points.push({
      x: mouse.x,
      y: mouse.y,
    });

    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();

    return;
  }

  // Eraser

  // -----------------------
  // Rectangle Preview
  // -----------------------
  ctx.putImageData(snapshot, 0, 0);

  if (currentTool === "rectangle") {
    ctx.beginPath();

    ctx.rect(startX, startY, mouse.x - startX, mouse.y - startY);

    if (fillShape.checked) {
      ctx.fillStyle = fillColor.value;
      ctx.fill();
    }

    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.stroke();
  }
  // -----------------------
  // Line Preview
  // -----------------------
  if (currentTool === "line") {
    ctx.beginPath();

    ctx.moveTo(startX, startY);

    ctx.lineTo(mouse.x, mouse.y);

    ctx.stroke();
  }
  // -----------------------
  // Circle Preview
  // -----------------------
  if (currentTool === "circle") {
    const radius = Math.sqrt((mouse.x - startX) ** 2 + (mouse.y - startY) ** 2);

    ctx.beginPath();

    ctx.arc(startX, startY, radius, 0, Math.PI * 2);

    if (fillShape.checked) {
      ctx.fillStyle = fillColor.value;
      ctx.fill();
    }

    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.stroke();
  }
};

// ======================================
// MOUSE UP
// ======================================

canvas.onmouseup = function (e) {
  // -----------------------
  // Stop Pan
  // -----------------------
  if (isPanning) {
    isPanning = false;
    return;
  }
  const mouse = getMousePosition(e);
  // ======================
  // Finish Selection Box
  // ======================

  if (isSelecting) {
    isSelecting = false;

    const selectionLeft = Math.min(
      selectionBox.x,
      selectionBox.x + selectionBox.width,
    );
    const selectionRight = Math.max(
      selectionBox.x,
      selectionBox.x + selectionBox.width,
    );

    const selectionTop = Math.min(
      selectionBox.y,
      selectionBox.y + selectionBox.height,
    );
    const selectionBottom = Math.max(
      selectionBox.y,
      selectionBox.y + selectionBox.height,
    );

    selectedShapes = [];

    for (let shape of shapes) {
      let shapeLeft, shapeRight, shapeTop, shapeBottom;

      if (shape.type === "rectangle" || shape.type === "image") {
        shapeLeft = Math.min(shape.x, shape.x + shape.width);
        shapeRight = Math.max(shape.x, shape.x + shape.width);
        shapeTop = Math.min(shape.y, shape.y + shape.height);
        shapeBottom = Math.max(shape.y, shape.y + shape.height);
      } else if (shape.type === "circle") {
        shapeLeft = shape.x - shape.radius;
        shapeRight = shape.x + shape.radius;
        shapeTop = shape.y - shape.radius;
        shapeBottom = shape.y + shape.radius;
      } else if (shape.type === "line") {
        shapeLeft = Math.min(shape.x1, shape.x2);
        shapeRight = Math.max(shape.x1, shape.x2);
        shapeTop = Math.min(shape.y1, shape.y2);
        shapeBottom = Math.max(shape.y1, shape.y2);
      } else if (shape.type === "text") {
        ctx.save();
        ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;

        const w = ctx.measureText(shape.text).width;

        ctx.restore();

        shapeLeft = shape.x;
        shapeRight = shape.x + w;
        shapeTop = shape.y - shape.fontSize;
        shapeBottom = shape.y;
      } else if (shape.type === "pencil") {
        shapeLeft = Infinity;
        shapeRight = -Infinity;
        shapeTop = Infinity;
        shapeBottom = -Infinity;

        for (let p of shape.points) {
          if (p.x < shapeLeft) shapeLeft = p.x;
          if (p.x > shapeRight) shapeRight = p.x;
          if (p.y < shapeTop) shapeTop = p.y;
          if (p.y > shapeBottom) shapeBottom = p.y;
        }
      }

      if (
        shapeLeft >=
          Math.min(selectionBox.x, selectionBox.x + selectionBox.width) &&
        shapeRight <=
          Math.max(selectionBox.x, selectionBox.x + selectionBox.width) &&
        shapeTop >=
          Math.min(selectionBox.y, selectionBox.y + selectionBox.height) &&
        shapeBottom <=
          Math.max(selectionBox.y, selectionBox.y + selectionBox.height)
      ) {
        selectedShapes.push(shape);
      }
    }

    drawAllShapes();

    drawAllShapes();

    console.log("Selected Shapes:", selectedShapes.length);
    return;
  }
  if (currentTool === "select") {
    isDragging = false;
    isResizing = false;
    isRotating = false;

    activeLineHandle = null;

    isGroupResizing = false;
    groupResizeStart = null;
    saveState();

    return;
  }
  drawing = false;
  // -----------------------
  // Save Pencil Stroke
  // -----------------------
  if (currentTool === "pencil") {
    console.log("POINT COUNT =", currentStroke?.points?.length);
    console.log(currentStroke);

    shapes.push(currentStroke);

    currentStroke = null;

    drawAllShapes();
    updateLayersPanel();
    saveState();

    return;
  }
  if (currentTool === "rectangle") {
    shapes.push({
      type: "rectangle",

      visible: true,
      locked: false,
      groupId: null,

      x: startX,
      y: startY,

      width: mouse.x - startX,
      height: mouse.y - startY,
      rotation: 0,

      color: colorPicker.value,
      lineWidth: brushSize.value,
      fill: fillShape.checked,

      fillColor: fillColor.value,
    });
  }
  if (currentTool === "circle") {
    const radius = Math.sqrt(
      Math.pow(mouse.x - startX, 2) + Math.pow(mouse.y - startY, 2),
    );

    shapes.push({
      type: "circle",
      visible: true,
      locked: false,
      groupId: null,

      x: startX,
      y: startY,

      radius: radius,

      rotation: 0,
      color: colorPicker.value,
      lineWidth: brushSize.value,
      fill: fillShape.checked,

      fillColor: fillColor.value,
    });
  }
  if (currentTool === "line") {
    shapes.push({
      type: "line",

      visible: true,
      locked: false,
      groupId: null,
      x1: startX,
      y1: startY,

      x2: mouse.x,
      y2: mouse.y,

      rotation: 0,
      color: colorPicker.value,
      lineWidth: brushSize.value,
    });
  }
  drawAllShapes();

  updateLayersPanel();
  saveState();
};

// ======================================
// MOUSE LEAVE
// ======================================

canvas.onmouseleave = function () {
  drawing = false;

  isDragging = false;
  isPanning = false;
};

// ======================================
// START DRAWING
// ======================================

function startDrawing() {
  drawing = true;

  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
}

// ======================================
// DRAW ALL SHAPES
// SCREEN → WORLD
// ======================================

function getMousePosition(e) {
  return {
    x: (e.offsetX - camera.x) / camera.scale,
    y: (e.offsetY - camera.y) / camera.scale,
  };
}
// ======================================
// ZOOM CANVAS
// ======================================

function zoomCanvas(e) {
  console.log("ZOOM EVENT");

  e.preventDefault();

  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  const worldX = (mouseX - camera.x) / camera.scale;
  const worldY = (mouseY - camera.y) / camera.scale;

  const zoom = e.deltaY < 0 ? 1.1 : 0.9;

  camera.scale *= zoom;
  console.log("Camera =", camera);

  if (camera.scale < 0.2) camera.scale = 0.2;
  if (camera.scale > 5) camera.scale = 5;

  camera.x = mouseX - worldX * camera.scale;
  camera.y = mouseY - worldY * camera.scale;
  console.log(camera);
  drawAllShapes();
}
canvas.addEventListener("wheel", zoomCanvas);

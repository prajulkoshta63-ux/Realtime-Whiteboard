// ==========================================
// Layers Panel
// ==========================================

shapes.forEach((shape, index) => {

    console.log(index, shape);

    if (!shape) {
        console.log("NULL SHAPE FOUND");
        return;
    }
});
function updateLayersPanel() {
  const layersList = document.getElementById("layersList");

  if (!layersList) return;

  layersList.innerHTML = "";

  if (shapes.length === 0) {
    layersList.innerHTML = "<p>No Layers</p>";
    return;
  }

  shapes.forEach((shape, index) => {
    if (!shape) return;
    const layer = document.createElement("div");

    layer.className = "layer-item";
    layer.draggable = true;
    if (selectedShape === shape) {
      layer.classList.add("active");
    }

    const eyeBtn = document.createElement("span");
    const lockBtn = document.createElement("span");

    lockBtn.textContent = shape.locked ? "🔒" : "🔓";

    lockBtn.style.float = "right";
    lockBtn.style.marginRight = "10px";
    lockBtn.style.cursor = "pointer";

    eyeBtn.textContent = shape.visible === false ? "🙈" : "👁";

    eyeBtn.style.float = "right";

    layer.innerHTML = `${index + 1}. ${shape.name || shape.type}`;

    eyeBtn.onclick = function (e) {
      e.stopPropagation();

      shape.visible = !shape.visible;

      drawAllShapes();

      updateLayersPanel();
    };

    lockBtn.onclick = function (e) {
      e.stopPropagation();

      shape.locked = !shape.locked;

      updateLayersPanel();
    };

    layer.appendChild(lockBtn);

    layer.appendChild(eyeBtn);

    layer.onclick = function () {
      selectedShape = shape;

      selectedShapes = [shape];

      selectedLayerIndex = index;

      drawAllShapes();
    };
    layer.ondblclick = function (e) {
      e.stopPropagation();

      const newName = prompt("Layer Name", shape.name || shape.type);

      if (newName === null) return;

      shape.name = newName.trim() || shape.type;

      updateLayersPanel();

      saveState();
    };
    layer.onmousedown = function (e) {
      isLayerDragging = true;

      draggedLayerIndex = index;
      layer.classList.add("dragging");
      document.body.style.cursor = "grabbing";

      e.preventDefault();
    };
    layer.ondragstart = function (e) {
      draggedLayer = index;

      e.dataTransfer.setData("text/plain", index);

      layer.style.opacity = "0.5";
    };
    layer.ondragend = function () {
      layer.style.opacity = "1";
    };

    layer.ondragend = function () {
      layer.style.opacity = "1";
    };

    layer.ondrop = function () {
      if (draggedLayer === null || dragOverLayer === null) return;

      const draggedShape = shapes[draggedLayer];

      // Purani position se remove
      shapes.splice(draggedLayer, 1);

      // Nayi position par insert
      shapes.splice(dragOverLayer, 0, draggedShape);

      // Variables reset
      draggedLayer = null;
      dragOverLayer = null;

      drawAllShapes();

      updateLayersPanel();
      selectedShape = draggedShape;
      selectedShapes = [draggedShape];

      selectedLayerIndex = shapes.indexOf(draggedShape);

      saveState();
    };

    layersList.appendChild(layer);
  });
}
function bringLayerForward(shape) {
  const index = shapes.indexOf(shape);

  if (index === -1 || index === shapes.length - 1) return;

  [shapes[index], shapes[index + 1]] = [shapes[index + 1], shapes[index]];

  drawAllShapes();

  updateLayersPanel();

  saveState();
}

function moveLayer(fromIndex, toIndex) {
  if (fromIndex === toIndex) return;

  const movedShape = shapes[fromIndex];

  shapes.splice(fromIndex, 1);

  shapes.splice(toIndex, 0, movedShape);

  selectedShape = movedShape;
  selectedShapes = [movedShape];
  selectedLayerIndex = toIndex;

  drawAllShapes();

  updateLayersPanel();

  // saveState();
}
// ======================================
// BRING TO FRONT (Multi Selection)
// ======================================

function bringToFront() {

  if (selectedShapes.length === 0) return;

  // Selected shapes ko current order me save karo
  const movingShapes = shapes.filter(shape =>
    selectedShapes.includes(shape)
  );

  // Baaki shapes
  const remainingShapes = shapes.filter(shape =>
    !selectedShapes.includes(shape)
  );

  // End me selected shapes add karo
  shapes = [...remainingShapes, ...movingShapes];

  drawAllShapes();
  updateLayersPanel();
  saveState();
}
// ======================================
// SEND TO BACK (Multi Selection)
// ======================================

function sendToBack() {

  if (selectedShapes.length === 0) return;

  // Selected shapes ko current order me save karo
  const movingShapes = shapes.filter(shape =>
    selectedShapes.includes(shape)
  );

  // Baaki shapes
  const remainingShapes = shapes.filter(shape =>
    !selectedShapes.includes(shape)
  );

  // Beginning me selected shapes add karo
  shapes = [...movingShapes, ...remainingShapes];

  drawAllShapes();
  updateLayersPanel();
  saveState();
}
// ======================================
// BRING FORWARD (Multi Selection)
// ======================================

function bringForward() {

  if (selectedShapes.length === 0) return;

  // End se start ki taraf loop
  for (let i = shapes.length - 2; i >= 0; i--) {

    const current = shapes[i];
    const next = shapes[i + 1];

    // Selected object ke aage agar selected object nahi hai
    if (
      selectedShapes.includes(current) &&
      !selectedShapes.includes(next)
    ) {
      [shapes[i], shapes[i + 1]] = [shapes[i + 1], shapes[i]];
    }
  }

  drawAllShapes();
  updateLayersPanel();
  saveState();
}
// ======================================
// SEND BACKWARD (Multi Selection)
// ======================================

function sendBackward() {

  if (selectedShapes.length === 0) return;

  // Start se end ki taraf loop
  for (let i = 1; i < shapes.length; i++) {

    const current = shapes[i];
    const previous = shapes[i - 1];

    // Selected object ke piche agar selected object nahi hai
    if (
      selectedShapes.includes(current) &&
      !selectedShapes.includes(previous)
    ) {
      [shapes[i], shapes[i - 1]] = [shapes[i - 1], shapes[i]];
    }
  }

  drawAllShapes();
  updateLayersPanel();
  saveState();
}
document.addEventListener("mouseup", () => {
  isLayerDragging = false;

  draggedLayerIndex = -1;
  draggedLayer = null;
  dragOverLayer = null;

  saveState();
  document.querySelectorAll(".layer-item").forEach((layer) => {
    document.body.style.cursor = "default";
    layer.classList.remove("dragging");
  });
});
document.addEventListener("mousemove", (e) => {
  if (!isLayerDragging) return;

  console.log("Dragging Layer :", draggedLayerIndex);
  const layerItems = document.querySelectorAll(".layer-item");

  layerItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();

    if (e.clientY > rect.top && e.clientY < rect.bottom) {
      if (index !== draggedLayerIndex) {
        moveLayer(draggedLayerIndex, index);

        draggedLayerIndex = index;
      }
    }
  });
});

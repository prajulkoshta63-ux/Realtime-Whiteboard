// ======================================
// DELETE SELECTED SHAPES
// ======================================

document.addEventListener("keydown", function (e) {
  if (e.key !== "Delete") return;

  if (selectedShapes.length > 0) {
    const shapesToDelete = new Set();

    for (const shape of selectedShapes) {
      if (shape.groupId) {
        shapes
          .filter((s) => s.groupId === shape.groupId)
          .forEach((s) => shapesToDelete.add(s));
      } else {
        shapesToDelete.add(shape);
      }
    }

    shapes = shapes.filter((shape) => !shapesToDelete.has(shape));

    selectedShapes = [];
    selectedShape = null;

    drawAllShapes();
    updateLayersPanel();

    saveState();
    saveToLocalStorage();

    console.log("Deleted Selected Shapes");
  }
});

// ======================================
// COPY SELECTED SHAPE (Ctrl + C)
// ======================================

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key.toLowerCase() === "c" && selectedShapes.length > 0) {
    e.preventDefault();

    copiedShapes = [];

    for (let shape of selectedShapes) {
      const copy = JSON.parse(JSON.stringify(shape));

      delete copy.image;

      copiedShapes.push(copy);
    }

    console.log("Copied", copiedShapes.length, "Shapes");
  }
});
// ======================================
// PASTE SHAPE (Ctrl + V)
// ======================================
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key.toLowerCase() === "v" && copiedShapes.length > 0) {
    e.preventDefault();

    selectedShapes = [];

    for (let shape of copiedShapes) {
      const newShape = JSON.parse(JSON.stringify(shape));

      delete newShape.image;

      if (
        newShape.type === "rectangle" ||
        newShape.type === "circle" ||
        newShape.type === "text" ||
        newShape.type === "image"
      ) {
        newShape.x += 20;
        newShape.y += 20;
      } else if (newShape.type === "line") {
        newShape.x1 += 20;
        newShape.y1 += 20;

        newShape.x2 += 20;
        newShape.y2 += 20;
      } else if (newShape.type === "pencil") {
        for (let p of newShape.points) {
          p.x += 20;
          p.y += 20;
        }
      }

      shapes.push(newShape);
      selectedShapes.push(newShape);
    }

    selectedShape = selectedShapes[0] || null;

    drawAllShapes();
    updateLayersPanel();

    saveState();
    saveToLocalStorage();

    console.log("Pasted", selectedShapes.length, "Shapes");
  }
});
// ======================================
// SELECT ALL (Ctrl + A)
// ======================================

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key.toLowerCase() === "a") {
    e.preventDefault();

    selectedShapes = [...shapes];

    if (selectedShapes.length > 0) {
      selectedShape = selectedShapes[0];
    } else {
      selectedShape = null;
    }

    drawAllShapes();
    updateLayersPanel();

    console.log("Selected", selectedShapes.length, "shapes");
  }
});

// ======================================
// MULTI CUT (Ctrl + X)
// ======================================

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key.toLowerCase() === "x" && selectedShapes.length > 0) {
    e.preventDefault();

    copiedShapes = [];

    for (let shape of selectedShapes) {
      const copy = JSON.parse(JSON.stringify(shape));

      delete copy.image;

      copiedShapes.push(copy);
    }

    shapes = shapes.filter((shape) => !selectedShapes.includes(shape));

    selectedShapes = [];
    selectedShape = null;

    drawAllShapes();

    updateLayersPanel();

    saveState();
    saveToLocalStorage();

    console.log("Cut", copiedShapes.length, "Shapes");
  }
});
// ======================================
// MULTI DUPLICATE (Ctrl + D)
// ======================================

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key.toLowerCase() === "d" && selectedShapes.length > 0) {
    e.preventDefault();

    const duplicates = [];

    for (let shape of selectedShapes) {
      const duplicate = JSON.parse(JSON.stringify(shape));

      delete duplicate.image;

      if (
        duplicate.type === "rectangle" ||
        duplicate.type === "circle" ||
        duplicate.type === "text" ||
        duplicate.type === "image"
      ) {
        duplicate.x += 20;
        duplicate.y += 20;
      } else if (duplicate.type === "line") {
        duplicate.x1 += 20;
        duplicate.y1 += 20;

        duplicate.x2 += 20;
        duplicate.y2 += 20;
      } else if (duplicate.type === "pencil") {
        for (let point of duplicate.points) {
          point.x += 20;
          point.y += 20;
        }
      }

      shapes.push(duplicate);

      duplicates.push(duplicate);
    }

    selectedShapes = duplicates;
    selectedShape = duplicates[0] || null;

    drawAllShapes();

    updateLayersPanel();

    saveState();
    saveToLocalStorage();

    console.log("Duplicated", duplicates.length, "Shapes");
  }
});
document.addEventListener("keydown", function (e) {
  if (selectedShapes.length === 0) return;

  let dx = 0;
  let dy = 0;

  switch (e.key) {
    case "ArrowLeft":
      dx = -1;
      break;

    case "ArrowRight":
      dx = 1;
      break;

    case "ArrowUp":
      dy = -1;
      break;

    case "ArrowDown":
      dy = 1;
      break;

    default:
      return;
  }

  e.preventDefault();

  for (let shape of selectedShapes) {
    if (
      shape.type === "rectangle" ||
      shape.type === "circle" ||
      shape.type === "text" ||
      shape.type === "image"
    ) {
      shape.x += dx;
      shape.y += dy;
    } else if (shape.type === "line") {
      shape.x1 += dx;
      shape.y1 += dy;

      shape.x2 += dx;
      shape.y2 += dy;
    } else if (shape.type === "pencil") {
      for (let p of shape.points) {
        p.x += dx;
        p.y += dy;
      }
    }
  }

  drawAllShapes();
});

// ======================================
// MOVE SELECTED SHAPES (Arrow Keys)
// ======================================

/*document.addEventListener("keydown", function (e) {
  let dx = 0;
  let dy = 0;

  switch (e.key) {
    case "ArrowLeft":
      dx = -1;
      break;

    case "ArrowRight":
      dx = 1;
      break;

    case "ArrowUp":
      dy = -1;
      break;

    case "ArrowDown":
      dy = 1;
      break;

    default:
      return;
  }

  e.preventDefault();

  // Shift + Arrow = Fast Move
  if (e.shiftKey) {
    dx *= 10;
    dy *= 10;
  }

  for (let shape of selectedShapes) {
    if (
      shape.type === "rectangle" ||
      shape.type === "circle" ||
      shape.type === "text" ||
      shape.type === "image"
    ) {
      shape.x += dx;
      shape.y += dy;
    } else if (shape.type === "line") {
      shape.x1 += dx;
      shape.y1 += dy;

      shape.x2 += dx;
      shape.y2 += dy;
    } else if (shape.type === "pencil") {
      for (let p of shape.points) {
        p.x += dx;
        p.y += dy;
      }
    }
  }

  drawAllShapes();
  saveToLocalStorage();
});*/
// ======================================
// GROUP (Ctrl + G)
// ======================================

document.addEventListener("keydown", function (e) {
  if (!(e.ctrlKey && e.key.toLowerCase() === "g") || e.shiftKey) return;

  e.preventDefault();

  if (selectedShapes.length < 2) {
    alert("Select at least 2 shapes to group.");
    return;
  }

  const groupId = "group_" + Date.now();

  for (const shape of selectedShapes) {
    shape.groupId = groupId;
  }

  saveState();
  saveToLocalStorage();

  console.log("Group Created :", groupId);
});
// ======================================
// UNGROUP (Ctrl + Shift + G)
// ======================================

document.addEventListener("keydown", function (e) {
  if (!(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "g")) return;

  e.preventDefault();

  if (selectedShapes.length === 0) return;

  let ungrouped = 0;

  for (const shape of selectedShapes) {
    if (shape.groupId !== null) {
      shape.groupId = null;
      ungrouped++;
    }
  }

  saveState();
  saveToLocalStorage();

  console.log("Ungrouped:", ungrouped, "Shapes");
});
// ======================================
// SAVE (Ctrl + S)
// ======================================

document.addEventListener("keydown", function (e) {
  if (!(e.ctrlKey && e.key.toLowerCase() === "s")) return;

  e.preventDefault();

  saveBtn.click();
});
// ======================================
// OPEN PROJECT (Ctrl + O)
// ======================================

document.addEventListener("keydown", function (e) {
  if (!(e.ctrlKey && e.key.toLowerCase() === "o")) return;

  e.preventDefault();

  openProjectBtn.click();
});
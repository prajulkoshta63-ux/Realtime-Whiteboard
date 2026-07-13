// ======================================
// GET SHAPE AT POSITION
// ======================================

function getShapeAt(x, y) {
  console.log("Total Shapes:", shapes.length);
  console.log("Mouse:", x, y);
  const HIT = 6;
  console.log("Total Shapes:", shapes.length);

  for (let i = shapes.length - 1; i >= 0; i--) {
    console.log("Shape", i, shapes[i]);
  }
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    

    // Invalid object
    if (!shape || typeof shape !== "object") continue;

    console.log("Shape =", shape);
    console.log("Type =", shape.type);

    console.log("Checking:", shape.type, shape.groupId);

    // Missing type
    if (!shape.type) continue;

    // Hidden shape
    if (shape.visible === false) continue;

    // Locked shape (eraser/selection ignore)
    if (shape.locked === true) continue;

    console.log("Current Type:", shape.type);
    switch (shape.type) {
      case "rectangle": {
        const HIT = 6;

        const left = Math.min(shape.x, shape.x + shape.width) - HIT;
        const right = Math.max(shape.x, shape.x + shape.width) + HIT;
        const top = Math.min(shape.y, shape.y + shape.height) - HIT;
        const bottom = Math.max(shape.y, shape.y + shape.height) + HIT;

        console.log({
          left,
          right,
          top,
          bottom,
          mouseX: x,
          mouseY: y,
        });
        if (x >= left && x <= right && y >= top && y <= bottom) {
          return shape;
        }

        break;
      }

      case "circle": {
        const dx = x - shape.x;
        const dy = y - shape.y;

        if (Math.sqrt(dx * dx + dy * dy) <= shape.radius + HIT) {
          return shape;
        }

        break;
      }

      case "line":
        {
          const distance = pointToLineDistance(
            x,
            y,
            shape.x1,
            shape.y1,
            shape.x2,
            shape.y2,
          );

          if (distance <= 12 + HIT) {
            return shape;
          }

          break;
        }

        console.log(shape);
      case "pencil": {
        if (!Array.isArray(shape.points) || shape.points.length === 0) break;

        for (const p of shape.points) {
          const dx = x - p.x;
          const dy = y - p.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          console.log("Mouse:", x, y, " Point:", p.x, p.y, " Dist:", distance);

          if (distance <= 15) {
            console.log("PENCIL FOUND");
            return shape;
          }
        }

        break;
      }
      case "text": {
        ctx.save();

        ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;

        const width = ctx.measureText(shape.text).width;
        const height = shape.fontSize;

        ctx.restore();

        if (
          x >= shape.x - HIT &&
          x <= shape.x + width + HIT &&
          y >= shape.y - height - HIT &&
          y <= shape.y + HIT
        ) {
          return shape;
        }

        break;
      }

      case "image": {
        if (
          x >= shape.x - HIT &&
          x <= shape.x + shape.width + HIT &&
          y >= shape.y - HIT &&
          y <= shape.y + shape.height + HIT
        ) {
          return shape;
        }

        break;
      }
    }
  }

  return null;
}

// ======================================
// DRAW RESIZE HANDLES
// ======================================

function drawResizeHandles(shape) {
  const HANDLE_SIZE = 8;

  ctx.save();

  ctx.fillStyle = "blue";

  // Bottom Right Handle
  ctx.fillRect(
    shape.x + shape.width - 4,
    shape.y + shape.height - 4,
    HANDLE_SIZE,
    HANDLE_SIZE,
  );
}

function isBottomRightHandle(shape, x, y) {
  return (
    x >= shape.x + shape.width - 6 &&
    x <= shape.x + shape.width + 6 &&
    y >= shape.y + shape.height - 6 &&
    y <= shape.y + shape.height + 6
  );
}
function isGroupResizeHandle(x, y) {
  if (!groupBounds) return false;

  return (
    x >= groupBounds.x + groupBounds.width - 6 &&
    x <= groupBounds.x + groupBounds.width + 6 &&
    y >= groupBounds.y + groupBounds.height - 6 &&
    y <= groupBounds.y + groupBounds.height + 6
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
function pointToLineDistance(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;

  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  return Math.sqrt(dx * dx + dy * dy);
}
function getLineHandle(shape, x, y) {
  const size = 8;

  // Start Handle
  if (
    x >= shape.x1 - size &&
    x <= shape.x1 + size &&
    y >= shape.y1 - size &&
    y <= shape.y1 + size
  ) {
    return "start";
  }

  // End Handle
  if (
    x >= shape.x2 - size &&
    x <= shape.x2 + size &&
    y >= shape.y2 - size &&
    y <= shape.y2 + size
  ) {
    return "end";
  }

  return null;
}
function getGroupBounds() {
  if (selectedShapes.length === 0) return null;

  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (let shape of selectedShapes) {
    let l, r, t, b;

    if (shape.type === "rectangle" || shape.type === "image") {
      l = Math.min(shape.x, shape.x + shape.width);
      r = Math.max(shape.x, shape.x + shape.width);
      t = Math.min(shape.y, shape.y + shape.height);
      b = Math.max(shape.y, shape.y + shape.height);
    } else if (shape.type === "circle") {
      l = shape.x - shape.radius;
      r = shape.x + shape.radius;
      t = shape.y - shape.radius;
      b = shape.y + shape.radius;
    } else if (shape.type === "line") {
      l = Math.min(shape.x1, shape.x2);
      r = Math.max(shape.x1, shape.x2);
      t = Math.min(shape.y1, shape.y2);
      b = Math.max(shape.y1, shape.y2);
    } else if (shape.type === "text") {
      ctx.save();
      ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;

      const w = ctx.measureText(shape.text).width;

      ctx.restore();

      l = shape.x;
      r = shape.x + w;
      t = shape.y - shape.fontSize;
      b = shape.y;
    } else if (shape.type === "pencil") {
      l = Infinity;
      r = -Infinity;
      t = Infinity;
      b = -Infinity;

      for (let p of shape.points) {
        l = Math.min(l, p.x);
        r = Math.max(r, p.x);

        t = Math.min(t, p.y);
        b = Math.max(b, p.y);
      }
    }

    left = Math.min(left, l);
    right = Math.max(right, r);
    top = Math.min(top, t);
    bottom = Math.max(bottom, b);
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}
function isRotationHandle(shape, x, y) {

    const hx = shape.x + shape.width / 2;
    const hy = shape.y - 25;

    const dx = x - hx;
    const dy = y - hy;

    return Math.sqrt(dx * dx + dy * dy) <= 8;
}
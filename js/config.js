// ---------- Shapes ----------
let shapes = [];

// ---------- Drawing ----------
let drawing = false;
let startX = 0;
let startY = 0;
let snapshot = null;
let activeLineHandle = null;

// ---------- Selection ----------
let selectedShape = null;
let copiedShape = null;
let isDragging = false;
let currentStroke = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// ---------- Resize ----------
let isResizing = false;
const HANDLE_SIZE = 8;
// ---------- Camera ----------
let camera = {
  x: 0,
  y: 0,
  scale: 1,
};
// ---------- Pan ----------
let offsetX = 0;
let offsetY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
// ---------- Multi Selection ----------
let selectedShapes = [];
let isMultiDragging = false;
// ---------- Multi Drag ----------
let dragStartShapes = [];
// ---------- Layers ----------
let selectedLayerIndex = -1;
// ---------- Layer Drag ----------
let draggedLayer = null;
let dragOverLayer = null;
// ---------- Layer Mouse Drag ----------
let isLayerDragging = false;
let draggedLayerIndex = -1;
let copiedShapes = [];
let isSelecting = false;

let selectionBox = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
// ---------- Group Resize ----------
let groupBounds = null;
let isGroupResizing = false;
let groupResizeHandle = null;
let groupResizeStart = null;
let panStart = {
  x: 0,
  y: 0,
};
let dragStartMouseX = 0;
let dragStartMouseY = 0;

let dragStartPositions = [];
// ---------- Groups ----------
let groups = [];
let groupCounter = 1;
let isRotating = false;
let showGrid = true;
let exportScale = 2;
let isExporting = false;
let renderPending = false;
function requestRender() {
  if (renderPending) return;

  renderPending = true;

  requestAnimationFrame(() => {
    try {
      drawAllShapes();
    } finally {
      renderPending = false;
    }
  });
}
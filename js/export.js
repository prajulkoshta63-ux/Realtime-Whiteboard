const exportBtn = document.getElementById("exportBtn");

const exportDialog = document.getElementById("exportDialog");

const cancelExport = document.getElementById("cancelExport");

const confirmExport = document.getElementById("confirmExport");

console.log("export.js loaded");
//alert(cancelExport);
const exportFormatSelect = document.getElementById("exportFormat");
const exportResolutionSelect = document.getElementById("exportResolution");
const exportBackgroundSelect = document.getElementById("exportBackground");
const exportFileNameInput = document.getElementById("exportFileName");

console.log("exportBtn =", exportBtn);
console.log("exportDialog =", exportDialog);
console.log("cancelExport =", cancelExport);
confirmExport.addEventListener("click", () => {
  const settings = getExportSettings();

  console.log("Export Settings:", settings);

  exportDialog.classList.add("hidden");
  startExport(settings);
});

exportBtn.addEventListener("click", () => {
  console.log("Before:", exportDialog.className);

  exportDialog.classList.remove("hidden");

  console.log("After:", exportDialog.className);
});

cancelExport.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  console.log("Before:", exportDialog.className);

  exportDialog.classList.add("hidden");

  console.log("After:", exportDialog.className);
});
function getExportSettings() {
  return {
    format: exportFormatSelect.value,
    resolution: Number(exportResolutionSelect.value),
    background: exportBackgroundSelect.value,
    fileName: exportFileNameInput.value.trim() || "whiteboard",
  };
}
function startExport(settings) {
  console.log("Starting Export...", settings);

  switch (settings.format) {
    case "png":
      console.log("PNG Export Selected");

      exportCanvasAsPNG(settings);

      break;
    case "jpg":
      console.log("JPG Export Selected");

      exportCanvasAsJPG(settings);

      break;
    case "svg":
      console.log("SVG Export Selected");

      exportCanvasAsSVG(settings);

      break;

    case "pdf":
  console.log("PDF Export Selected");

  exportCanvasAsPDF(settings);

  break;
    default:
      console.warn("Format not implemented:", settings.format);
      break;
  }
}
// ======================================
// DOWNLOAD IMAGE
// ======================================

function downloadImage(dataURL, fileName) {
//  alert("downloadImage called");
  const link = document.createElement("a");

  link.download = fileName;
  link.href = dataURL;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// ======================================
// EXPORT PNG
// ======================================

function exportPNG() {
 // alert("exportPNG called");
  console.time("PNG Export");

  try {
    console.log("Export Started");

    const dataURL = canvas.toDataURL("image/png");

    downloadImage(dataURL, "whiteboard.png");
    console.log(dataURL.substring(0, 30));

    console.log("Export Success");
  } catch (err) {
    console.error("Export Error:", err);
  }

  console.timeEnd("PNG Export");
}
exportPNGBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  exportCanvasAsPNG();
});
function renderForExport(exportCtx, background = "white") {
  exportCtx.save();

  exportCtx.setTransform(1, 0, 0, 1, 0, 0);
if (background === "white") {
  exportCtx.fillStyle = "#ffffff";
  exportCtx.fillRect(0, 0, exportCtx.canvas.width, exportCtx.canvas.height);
}
  

  renderShapes(exportCtx, false);

  exportCtx.restore();
}
function exportCanvasAsPNG(settings) {
  const scale = settings?.resolution ?? exportScale;

  const background = settings?.background ?? "white";

  const fileName = `${settings?.fileName ?? "whiteboard"}.png`;
  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");

  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;

  exportCtx.scale(scale, scale);
  

  renderForExport(exportCtx, settings.background);
  const imageData = exportCanvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageData;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function exportCanvasAsJPG(settings) {
  function escapeSVG(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
  console.log("JPG Export Started", settings);

  const scale = settings?.resolution ?? exportScale;

  const background = settings?.background ?? "white";
  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");

  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;

  exportCtx.scale(scale, scale);
  renderForExport(exportCtx, background);
  const fileName = `${settings?.fileName ?? "whiteboard"}.jpg`;

  const imageData = exportCanvas.toDataURL("image/jpeg", 0.92);

  const link = document.createElement("a");

  link.href = imageData;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function exportCanvasAsSVG(settings) {
  console.log("SVG Export Started", settings);

  const width = canvas.width;
  const height = canvas.height;
  const background = settings?.background ?? "transparent";

  let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${width}"
     height="${height}"
     viewBox="0 0 ${width} ${height}">
`;

if (background === "white") {
  svg += `
    <rect
      x="0"
      y="0"
      width="${width}"
      height="${height}"
      fill="#ffffff"
    />
  `;
}
  shapes.forEach((shape) => {
    if (shape.type === "rectangle") {
      svg += `
      <rect
        x="${shape.x}"
        y="${shape.y}"
        width="${shape.width}"
        height="${shape.height}"
        fill="${shape.fillColor || "none"}"
        stroke="${shape.color || "black"}"
        stroke-width="${shape.lineWidth || 1}"
      />
    `;
    }
    if (shape.type === "circle") {
      svg += `
    <circle
      cx="${shape.x}"
      cy="${shape.y}"
      r="${shape.radius}"
      fill="${shape.fillColor || "none"}"
      stroke="${shape.color || "black"}"
      stroke-width="${shape.lineWidth || 1}"
    />
  `;
    }
    if (shape.type === "line") {
      svg += `
    <line
      x1="${shape.x1}"
      y1="${shape.y1}"
      x2="${shape.x2}"
      y2="${shape.y2}"
      stroke="${shape.color || "black"}"
      stroke-width="${shape.lineWidth || 1}"
    />
  `;
    }
    if (shape.type === "pencil") {
      const points = shape.points
        .map((point) => `${point.x},${point.y}`)
        .join(" ");

      svg += `
    <polyline
      points="${points}"
      fill="none"
      stroke="${shape.color || "black"}"
      stroke-width="${shape.lineWidth || 1}"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  `;
    }
    if (shape.type === "text") {
      svg += `
    <text
      x="${shape.x}"
      y="${shape.y}"
      fill="${shape.color || "black"}"
      font-size="${shape.fontSize || 16}px"
    >
      ${escapeSVG(shape.text)}
    </text>
  `;
    }
    if (shape.type === "image") {
      svg += `
    <image
      href="${shape.src}"
      x="${shape.x}"
      y="${shape.y}"
      width="${shape.width}"
      height="${shape.height}"
    />
  `;
    }
  });
  svg += `</svg>`;
  const fileName = `${settings?.fileName ?? "whiteboard"}.svg`;

  const blob = new Blob([svg], {
    type: "image/svg+xml",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
function exportCanvasAsPDF(settings) {
  console.log("PDF Export Started", settings);

  const scale = settings?.resolution ?? exportScale;

  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");

  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;

  exportCtx.scale(scale, scale);

  renderForExport(exportCtx, "white");
  const { jsPDF } = window.jspdf;

const pdf = new jsPDF({
  orientation: "landscape",
  unit: "px",
  format: [exportCanvas.width, exportCanvas.height]
});

console.log("PDF Instance Created", pdf);
const imageData = exportCanvas.toDataURL("image/png");

pdf.addImage(
  imageData,
  "PNG",
  0,
  0,
  exportCanvas.width,
  exportCanvas.height
);

console.log("Image Added To PDF");
const fileName = `${settings?.fileName ?? "whiteboard"}.pdf`;

pdf.save(fileName);

console.log("PDF Export Completed");
}
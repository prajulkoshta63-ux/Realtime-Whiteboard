const saveBtn = document.getElementById("saveBtn");
const openProjectBtn = document.getElementById("openProjectBtn");
const projectFileInput = document.getElementById("projectFileInput");
openProjectBtn.addEventListener("click", () => {
  projectFileInput.click();
});
projectFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  console.log("Project File Selected:", file.name);
  const reader = new FileReader();

  reader.onload = () => {
    try {
      const projectData = JSON.parse(reader.result);
      if (!projectData.version) {
        alert("Old whiteboard file detected");
      }

      console.log("Loaded Project:", projectData);

      shapes = projectData.shapes || [];
      localStorage.setItem("whiteboard", JSON.stringify(shapes));

      shapes.forEach((shape) => {
        if (shape.type === "image") {
          shape.image = null;
        }
      });
     requestRender();
    } catch (error) {
      console.error("Invalid Project File:", error);
      alert("Invalid whiteboard file");
    }
  };
  reader.readAsText(file);
});
saveBtn.addEventListener("click", () => {
  localStorage.setItem("whiteboard", JSON.stringify(shapes));

  alert("Whiteboard Saved Successfully!");
  saveProjectFile();
});
function saveProjectFile() {
  const projectData = {
    version: 1,
    shapes: shapes,
  };
  const file = new Blob([JSON.stringify(projectData)], {
    type: "application/json",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(file);
  link.download = `${exportFileNameInput.value.trim() || "whiteboard"}.whiteboard`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
}
window.addEventListener("load", () => {
  const savedData = localStorage.getItem("whiteboard");

  if (!savedData) return;

  shapes = JSON.parse(savedData);

  for (const shape of shapes) {
    if (shape.type === "image") {
      shape.image = null;
    }
  }
  drawAllShapes();
});

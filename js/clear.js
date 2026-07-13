const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
  const confirmClear = confirm(
    "Are you sure you want to clear the whiteboard?",
  );

  if (!confirmClear) return;

  shapes = [];

  selectedShape = null;

  drawAllShapes();

  // Delete saved whiteboard
  localStorage.removeItem("whiteboard");

  saveState();

  alert("Whiteboard Cleared Successfully!");
});

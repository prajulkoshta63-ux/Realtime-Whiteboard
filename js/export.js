const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", () => {

    const link = document.createElement("a");

    link.download = "whiteboard.png";

    link.href = canvas.toDataURL("image/png");

    link.click();

});
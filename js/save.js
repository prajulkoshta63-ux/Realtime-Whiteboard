const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", () => {

    localStorage.setItem("whiteboard", canvas.toDataURL());

    alert("Whiteboard Saved Successfully!");

});
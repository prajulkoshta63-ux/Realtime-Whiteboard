const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {

    const confirmClear = confirm("Are you sure you want to clear the whiteboard?");

    if (!confirmClear) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    saveState();

});
const canvas = document.getElementById("canvas");
const canvasContainer = document.getElementById("canvasContainer");

// Controls
const addBoxButton = document.getElementById("addBoxButton");
const addCircleButton = document.getElementById("addCircleButton");
const boxControls = document.getElementById("boxControls");
const circleControls = document.getElementById("circleControls");
const shapeColorInput = document.getElementById("shapeColor");
const boxHeightInput = document.getElementById("boxHeight");
const boxWidthInput = document.getElementById("boxWidth");
const circleRadiusInput = document.getElementById("circleRadius");
const deleteButton = document.getElementById("deleteButton");
const controls = document.querySelector(".controls");


let selectedShape = [];

// Add Event Listeners
addBoxButton.addEventListener("click", () => addShape("box"));
addCircleButton.addEventListener("click", () => addShape("circle"));

boxHeightInput.addEventListener("input", () => {
  if (selectedShape && selectedShape.classList.contains("box")) {
    selectedShape.style.height = `${boxHeightInput.value}px`;
  }
});

boxWidthInput.addEventListener("input", () => {
  if (selectedShape && selectedShape.classList.contains("box")) {
    selectedShape.style.width = `${boxWidthInput.value}px`;
  }
});

circleRadiusInput.addEventListener("input", () => {
  if (selectedShape && selectedShape.classList.contains("circle")) {
    const radius = circleRadiusInput.value;
    selectedShape.style.height = `${radius * 2}px`;
    selectedShape.style.width = `${radius * 2}px`;
  }
});

shapeColorInput.addEventListener("input", () => {
  if (selectedShape) selectedShape.style.backgroundColor = shapeColorInput.value;
});

deleteButton.addEventListener("click", () => {
  if (selectedShape) {
    selectedShape.remove();
    selectedShape = null;
    updateControlsVisibility();
  }
});

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function addShape(type) {
  const shape = document.createElement("div");
  shape.className = type === "box" ? "box" : "circle";
  shape.style.backgroundColor = getRandomColor();
  shape.style.top = "50px";
  shape.style.left = "50px";

  if (type === "box") {
    shape.style.height = "100px";
    shape.style.width = "100px";
  } else if (type === "circle") {
    shape.style.height = "100px";
    shape.style.width = "100px";
    shape.style.borderRadius = "50%";
  }

  shape.addEventListener("mousedown", startDrag);
  shape.addEventListener("click", () => selectShape(shape));
  canvas.appendChild(shape);
}

function selectShape(shape) {
  selectedShape = shape;

  if (shape.classList.contains("box")) {
    boxControls.style.display = "block";
    circleControls.style.display = "none";
    boxHeightInput.value = parseInt(shape.style.height);
    boxWidthInput.value = parseInt(shape.style.width);
  } else if (shape.classList.contains("circle")) {
    circleControls.style.display = "block";
    boxControls.style.display = "none";
    circleRadiusInput.value = parseInt(shape.style.height) / 2;
  }

  shapeColorInput.value = rgbToHex(shape.style.backgroundColor);
  deleteButton.style.display = "block";
}

function updateControlsVisibility() {
  boxControls.style.display = "none";
  circleControls.style.display = "none";
  deleteButton.style.display = "none";
}

let offsetX, offsetY, dragging = false;

function startDrag(e) {
  dragging = true;
  selectedShape = e.target;
  offsetX = e.offsetX;
  offsetY = e.offsetY;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
  if (!dragging || !selectedShape) return;
  selectedShape.style.top = `${e.clientY - offsetY}px`;
  selectedShape.style.left = `${e.clientX - offsetX}px`;
}

function stopDrag() {
  dragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}

function rgbToHex(rgb) {
  const result = rgb
    .match(/\d+/g)
    .map((num) => parseInt(num).toString(16).padStart(2, "0"))
    .join("");
  return `#${result}`;
}


let controlsDragging = false;
let controlsOffsetX = 0;
let controlsOffsetY = 0;

// Enable dragging for the control panel
controls.addEventListener("mousedown", (e) => {
  if (!e.target.closest("input, button, select, label")) {
    controlsDragging = true;
    controls.classList.add("dragging");
    controlsOffsetX = e.offsetX;
    controlsOffsetY = e.offsetY;
    document.addEventListener("mousemove", dragControls);
    document.addEventListener("mouseup", stopDragControls);
  }
});

function dragControls(e) {
  if (!controlsDragging) return;
  const newLeft = e.clientX - controlsOffsetX;
  const newTop = e.clientY - controlsOffsetY;

  controls.style.left = `${newLeft}px`;
  controls.style.top = `${newTop}px`;
}

function stopDragControls() {
  controlsDragging = false;
  controls.classList.remove("dragging");
  document.removeEventListener("mousemove", dragControls);
  document.removeEventListener("mouseup", stopDragControls);
}

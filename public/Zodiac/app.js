const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
const pollutionSlider = document.getElementById('pollutionSlider');
const starCountDisplay = document.getElementById('starCountDisplay');
const hoverTooltip = document.getElementById('hoverTooltip');
const tooltipTitle = document.getElementById('tooltipTitle');
const tooltipRegion = document.getElementById('tooltipRegion');
const mythModal = document.getElementById('mythModal');
const modalTitle = document.getElementById('modalTitle');
const modalZodiac = document.getElementById('modalZodiac');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

let stars = [];
let constellationStars = [];
let hoveredConstellation = null;
let activeConstellation = null;
let maxStars = parseInt(pollutionSlider.value, 10);
let camera = {
  x: 0,
  y: 0,
  scale: 1,
};
let isDragging = false;
let hasDragged = false;
const DRAG_THRESHOLD = 5;

let dragStart = {
  x: 0,
  y: 0,
  cameraX: 0,
  cameraY: 0,
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
  initConstellations();
}

function initStars() {
  stars = [];

  for (let i = 0; i < maxStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * canvas.width * 2.2,
      y: (Math.random() - 0.5) * canvas.height * 2.2,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      twinkleSpeed: 0.005 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function initConstellations() {
  constellationStars = constellationData.map((constellation) => ({
    ...constellation,
    points: constellation.points.map((point) => ({
      ...point,
      x: (point.x - 0.5) * canvas.width * 1.4,
      y: (point.y - 0.5) * canvas.height * 1.4,
    })),
  }));
}

function worldToScreen(worldX, worldY) {
  return {
    x: (worldX - camera.x) * camera.scale + canvas.width / 2,
    y: (worldY - camera.y) * camera.scale + canvas.height / 2,
  };
}

function screenToWorld(screenX, screenY) {
  return {
    x: (screenX - canvas.width / 2) / camera.scale + camera.x,
    y: (screenY - canvas.height / 2) / camera.scale + camera.y,
  };
}

function getHoveredConstellation(mouseX, mouseY) {
  for (const constellation of constellationStars) {
    for (const point of constellation.points) {
      const screenPoint = worldToScreen(point.x, point.y);
      const distance = Math.hypot(
        mouseX - screenPoint.x,
        mouseY - screenPoint.y
      );

      if (distance <= 18 / camera.scale) {
        return constellation;
      }
    }
  }

  return null;
}

function drawConstellation(constellation, isActive = false) {
  ctx.save();
  ctx.lineWidth = isActive ? 2.4 : 1.2;
  ctx.strokeStyle = isActive
    ? constellation.color
    : 'rgba(148, 163, 184, 0.32)';
  ctx.shadowColor = constellation.color;
  ctx.shadowBlur = isActive ? 14 : 6;

  constellation.connections.forEach(([startIndex, endIndex]) => {
    const start = constellation.points[startIndex];
    const end = constellation.points[endIndex];
    const startScreen = worldToScreen(start.x, start.y);
    const endScreen = worldToScreen(end.x, end.y);

    ctx.beginPath();
    ctx.moveTo(startScreen.x, startScreen.y);
    ctx.lineTo(endScreen.x, endScreen.y);
    ctx.stroke();
  });

  constellation.points.forEach((point) => {
    const screenPoint = worldToScreen(point.x, point.y);
    ctx.beginPath();
    ctx.fillStyle = isActive ? '#ffffff' : constellation.color;
    ctx.arc(
      screenPoint.x,
      screenPoint.y,
      (isActive ? point.radius + 1.2 : point.radius) * camera.scale,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  ctx.restore();
}

function updateTooltip(mouseX, mouseY, constellation) {
  if (!constellation) {
    hoverTooltip.classList.add('hidden');
    hoverTooltip.setAttribute('aria-hidden', 'true');
    canvas.style.cursor = 'default';
    return;
  }

  tooltipTitle.textContent = constellation.name;
  tooltipRegion.textContent = constellation.region;
  hoverTooltip.style.left = `${mouseX}px`;
  hoverTooltip.style.top = `${mouseY}px`;
  hoverTooltip.classList.remove('hidden');
  hoverTooltip.setAttribute('aria-hidden', 'false');
  canvas.style.cursor = 'pointer';
}

function clampCameraScale(nextScale) {
  return Math.min(2.4, Math.max(0.45, nextScale));
}

function handlePointerMove(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  if (isDragging) {
    const moveDistance = Math.hypot(mouseX - dragStart.x, mouseY - dragStart.y);

    if (moveDistance > DRAG_THRESHOLD) {
      hasDragged = true;
    }

    const worldStart = screenToWorld(dragStart.x, dragStart.y);
    const worldCurrent = screenToWorld(mouseX, mouseY);

    camera.x = dragStart.cameraX + (worldStart.x - worldCurrent.x);
    camera.y = dragStart.cameraY + (worldStart.y - worldCurrent.y);
  }

  hoveredConstellation = getHoveredConstellation(mouseX, mouseY);
  updateTooltip(mouseX, mouseY, hoveredConstellation);
}

function handlePointerLeave() {
  isDragging = false;
  hoveredConstellation = null;
  updateTooltip(0, 0, null);
}

function handlePointerDown(event) {
  isDragging = true;
  hasDragged = false;

  dragStart = {
    x: event.clientX,
    y: event.clientY,
    cameraX: camera.x,
    cameraY: camera.y,
  };

  canvas.setPointerCapture?.(event.pointerId);
}
function handlePointerUp(event) {
  isDragging = false;
  canvas.releasePointerCapture?.(event.pointerId);
}

function handleWheel(event) {
  event.preventDefault();

  const worldBeforeZoom = screenToWorld(event.clientX, event.clientY);
  const zoomFactor = event.deltaY < 0 ? 1.08 : 0.92;
  camera.scale = clampCameraScale(camera.scale * zoomFactor);
  camera.x =
    worldBeforeZoom.x - (event.clientX - canvas.width / 2) / camera.scale;
  camera.y =
    worldBeforeZoom.y - (event.clientY - canvas.height / 2) / camera.scale;
}

function openConstellationModal(constellation) {
  if (!constellation) {
    return;
  }

  activeConstellation = constellation;
  modalTitle.textContent = constellation.name;
  modalZodiac.textContent = constellation.region;
  modalBody.textContent = constellation.lore;
  mythModal.classList.remove('hidden');
  mythModal.setAttribute('aria-hidden', 'false');
}

function closeConstellationModal() {
  activeConstellation = null;
  mythModal.classList.add('hidden');
  mythModal.setAttribute('aria-hidden', 'true');
}

function handleCanvasClick() {
  if (hasDragged) {
    hasDragged = false;
    return;
  }

  if (hoveredConstellation) {
    openConstellationModal(hoveredConstellation);
  }
}

function handleModalBackdropClick(event) {
  if (event.target === mythModal) {
    closeConstellationModal();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    star.phase += star.twinkleSpeed;
    const dynamicAlpha = Math.abs(Math.sin(star.phase));
    const screenStar = worldToScreen(star.x, star.y);

    ctx.beginPath();
    ctx.arc(
      screenStar.x,
      screenStar.y,
      star.radius * camera.scale,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = `rgba(255, 255, 255, ${dynamicAlpha})`;
    ctx.fill();
  });

  constellationStars.forEach((constellation) => {
    const isActive =
      hoveredConstellation && hoveredConstellation.id === constellation.id;
    drawConstellation(constellation, isActive);
  });

  requestAnimationFrame(animate);
}

pollutionSlider.addEventListener('input', (event) => {
  maxStars = parseInt(event.target.value, 10);
  starCountDisplay.textContent = `Stars: ${maxStars}`;
  initStars();
});

window.addEventListener('resize', resizeCanvas);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerleave', handlePointerLeave);
window.addEventListener('pointerup', handlePointerUp);
canvas.addEventListener('pointerdown', handlePointerDown);
canvas.addEventListener('wheel', handleWheel, { passive: false });
canvas.addEventListener('click', handleCanvasClick);
closeModal.addEventListener('click', closeConstellationModal);
mythModal.addEventListener('click', handleModalBackdropClick);

resizeCanvas();
animate();

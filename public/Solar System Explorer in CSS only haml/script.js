/* ======================================================
   SOLAR SYSTEM EXPLORER
   Drag + Zoom + Planet Focus + Controls
====================================================== */

const camera = document.querySelector(".camera");
const universe = document.querySelector(".universe");
const planets = document.querySelectorAll(".planet");
const orbitContainers = document.querySelectorAll(".orbit-container");
const orbitLines = document.querySelectorAll(".orbit");
const labels = document.querySelectorAll(".label");

let zoom = 1;
let translateX = 0;
let translateY = 0;

let isDragging = false;
let startX = 0;
let startY = 0;

let paused = false;

/* ==========================
   UPDATE CAMERA
========================== */

function updateCamera() {
    camera.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${zoom})`;
}

updateCamera();

/* ==========================
   DRAG WHOLE SOLAR SYSTEM
========================== */

camera.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    camera.style.cursor = "grabbing";
});

window.addEventListener("mousemove", e => {
    if (!isDragging) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    updateCamera();
});

window.addEventListener("mouseup", () => {
    isDragging = false;
    camera.style.cursor = "grab";
});

/* ==========================
   MOUSE WHEEL ZOOM
========================== */

window.addEventListener(
    "wheel",
    e => {

        e.preventDefault();

        if (e.deltaY < 0) {
            zoom += 0.05;
        } else {
            zoom -= 0.05;
        }

        zoom = Math.max(0.3, Math.min(5, zoom));

        updateCamera();

        const slider = document.getElementById("zoomSlider");
        if (slider) slider.value = zoom * 100;

    },
    { passive: false }
);

/* ==========================
   SLIDER ZOOM
========================== */

const zoomSlider = document.getElementById("zoomSlider");

if (zoomSlider) {

    zoomSlider.addEventListener("input", () => {

        zoom = zoomSlider.value / 100;

        updateCamera();

    });

}

/* ==========================
   PLANET CLICK FOCUS
========================== */

planets.forEach(planet => {

    planet.addEventListener("click", () => {

        const rect = planet.getBoundingClientRect();
        const viewport = document.querySelector(".viewport");

        const cx = viewport.clientWidth / 2;
        const cy = viewport.clientHeight / 2;

        translateX += cx - rect.left - rect.width / 2;
        translateY += cy - rect.top - rect.height / 2;

        zoom = 2.5;

        if (zoomSlider)
            zoomSlider.value = 250;

        updateCamera();

        updateInfoPanel(planet.dataset.name);

    });

});


/* ==========================
   INFO PANEL DATA
========================== */

const data = {

    Mercury: {
        type: "Rocky Planet",
        radius: "2439 km",
        distance: "57.9 million km",
        moons: "0"
    },

    Venus: {
        type: "Rocky Planet",
        radius: "6051 km",
        distance: "108.2 million km",
        moons: "0"
    },

    Earth: {
        type: "Habitable Planet",
        radius: "6371 km",
        distance: "149.6 million km",
        moons: "1"
    },

    Mars: {
        type: "Rocky Planet",
        radius: "3389 km",
        distance: "227.9 million km",
        moons: "2"
    },

    Jupiter: {
        type: "Gas Giant",
        radius: "69911 km",
        distance: "778.5 million km",
        moons: "95"
    },

    Saturn: {
        type: "Gas Giant",
        radius: "58232 km",
        distance: "1.43 billion km",
        moons: "146"
    },

    Uranus: {
        type: "Ice Giant",
        radius: "25362 km",
        distance: "2.87 billion km",
        moons: "27"
    },

    Neptune: {
        type: "Ice Giant",
        radius: "24622 km",
        distance: "4.5 billion km",
        moons: "14"
    }

};

function updateInfoPanel(name) {

    if (!data[name]) return;

    document.getElementById("planetName").textContent = name;
    document.getElementById("planetType").textContent = data[name].type;
    document.getElementById("planetRadius").textContent = data[name].radius;
    document.getElementById("planetDistance").textContent = data[name].distance;
    document.getElementById("planetMoons").textContent = data[name].moons;

}


/* ==========================
   SEARCH
========================== */

const searchBtn = document.getElementById("searchBtn");

searchBtn?.addEventListener("click", () => {

    const value = document
        .getElementById("planetSearch")
        .value
        .trim()
        .toLowerCase();

    planets.forEach(planet => {

        if (
            planet.dataset.name &&
            planet.dataset.name.toLowerCase() === value
        ) {

            planet.click();

            planet.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(1.7)" },
                    { transform: "scale(1)" }
                ],
                {
                    duration: 1000
                }
            );

        }

    });

});


/* ==========================
   PAUSE / PLAY
========================== */

document.getElementById("pauseBtn")
    ?.addEventListener("click", () => {

        paused = true;

        orbitContainers.forEach(el => {
            el.style.animationPlayState = "paused";
        });

    });

document.getElementById("playBtn")
    ?.addEventListener("click", () => {

        paused = false;

        orbitContainers.forEach(el => {
            el.style.animationPlayState = "running";
        });

    });


/* ==========================
   ORBIT SHOW/HIDE
========================== */

let orbitVisible = true;

document.getElementById("toggleOrbitBtn")
    ?.addEventListener("click", () => {

        orbitVisible = !orbitVisible;

        orbitLines.forEach(line => {

            line.style.opacity =
                orbitVisible ? ".25" : "0";

        });

    });


/* ==========================
   LABELS SHOW/HIDE
========================== */

let labelsVisible = true;

document.getElementById("toggleLabelsBtn")
    ?.addEventListener("click", () => {

        labelsVisible = !labelsVisible;

        labels.forEach(label => {

            label.style.opacity =
                labelsVisible ? "1" : "0";

        });

    });


/* ==========================
   2D / 3D VIEW
========================== */

let is3D = false;

document.getElementById("viewToggleBtn")
    ?.addEventListener("click", () => {

        is3D = !is3D;

        if (is3D) {

            universe.style.transform +=
                " rotateX(70deg)";

        } else {

            universe.style.transform =
                "";

            updateCamera();

        }

    });


/* ==========================
   DARK / LIGHT MODE
========================== */

document.getElementById("themeBtn")
    ?.addEventListener("click", () => {

        document.body.classList.toggle("light-theme");

    });


/* ==========================
   REDUCED MOTION
========================== */

document.getElementById("reduceMotion")
    ?.addEventListener("change", e => {

        orbitContainers.forEach(el => {

            el.style.animationDuration =
                e.target.checked ? "0s" : "";

        });

    });


/* ==========================
   MODAL
========================== */

const modal = document.querySelector(".planet-modal");
const modalName = document.getElementById("modalPlanetName");
const modalDescription = document.getElementById("modalPlanetDescription");

document.getElementById("moreInfoBtn")
    ?.addEventListener("click", () => {

        const name =
            document.getElementById("planetName").textContent;

        modal.style.display = "flex";
        modalName.textContent = name;

        modalDescription.textContent =
            `${name} is one of the fascinating bodies in our Solar System.`;

    });

document.querySelector(".close-modal")
    ?.addEventListener("click", () => {

        modal.style.display = "none";

    });


/* ==========================
   ESC CLOSE MODAL
========================== */

window.addEventListener("keydown", e => {

    if (e.key === "Escape")
        modal.style.display = "none";

});


/* ==========================
   STARFIELD GENERATION
========================== */

const starfield = document.querySelector(".starfield");

for (let i = 0; i < 250; i++) {

    const star = document.createElement("span");

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 5 + "s";

    starfield.appendChild(star);

}
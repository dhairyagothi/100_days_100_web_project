const cursor = document.querySelector(".cursor");
const glow = document.querySelector(".galaxy-glow");
const canvas = document.querySelector("#stars");
const ctx = canvas.getContext("2d");
const cursorDesign = document.querySelector("#cursor-design");
const themeDesign = document.querySelector("#theme-design");
const controls = document.querySelectorAll(".magnetic-control");
const customSelects = document.querySelectorAll(".custom-select");

const themes = {
    galaxy: {
        sparkle: ["255, 216, 74", "87, 216, 255", "255, 122, 217"],
        stars: ["255, 255, 255", "255, 216, 74", "87, 216, 255"]
    },
    aurora: {
        sparkle: ["125, 255, 202", "142, 167, 255", "255, 142, 230"],
        stars: ["235, 255, 248", "125, 255, 202", "142, 167, 255"]
    },
    neon: {
        sparkle: ["255, 43, 214", "0, 245, 255", "182, 255, 0"],
        stars: ["255, 255, 255", "0, 245, 255", "255, 43, 214"]
    },
    firefly: {
        sparkle: ["223, 255, 116", "77, 255, 138", "255, 189, 89"],
        stars: ["250, 255, 205", "223, 255, 116", "77, 255, 138"]
    }
};

let width = window.innerWidth;
let height = window.innerHeight;
let targetX = width / 2;
let targetY = height / 2;
let cursorX = targetX;
let cursorY = targetY;
let isPointerActive = false;
const particles = [];
const stars = [];
const starCount = 260;

document.body.dataset.cursor = cursorDesign.value;
document.body.dataset.theme = themeDesign.value;

function getTheme() {
    return themes[themeDesign.value] || themes.galaxy;
}

function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function closeCustomSelects(activeSelect) {
    customSelects.forEach((select) => {
        if (select === activeSelect) {
            return;
        }

        select.classList.remove("is-open");
        select.querySelector(".select-trigger").setAttribute("aria-expanded", "false");
    });
}

function syncCustomSelect(customSelect, value, label) {
    const trigger = customSelect.querySelector(".select-trigger");
    const options = customSelect.querySelectorAll(".select-option");

    trigger.querySelector("span").textContent = label;

    options.forEach((option) => {
        const isSelected = option.dataset.value === value;

        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-selected", String(isSelected));
    });
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    stars.length = 0;
    const theme = getTheme();

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.35 + 0.25,
            speed: Math.random() * 0.35 + 0.08,
            alpha: Math.random() * 0.45 + 0.2,
            twinkle: Math.random() * Math.PI * 2,
            color: Math.random() > 0.52 ? getRandomColor(theme.stars) : "255, 255, 255"
        });
    }
}

function createSparkle(x, y, burstVelocity) {
    if (particles.length > 180) {
        particles.shift();
    }

    const theme = getTheme();

    particles.push({
        x,
        y,
        vx: burstVelocity ? burstVelocity.x : (Math.random() - 0.5) * 2.8,
        vy: burstVelocity ? burstVelocity.y : (Math.random() - 0.5) * 2.8,
        size: burstVelocity ? Math.random() * 4.8 + 1.6 : Math.random() * 3.2 + 1,
        life: 1,
        color: getRandomColor(theme.sparkle),
        glitter: burstVelocity ? true : Math.random() > 0.45
    });
}

function createClickBurst(x, y) {
    for (let i = 0; i < 42; i++) {
        const angle = (Math.PI * 2 * i) / 42;
        const speed = Math.random() * 4.5 + 2.5;

        createSparkle(
            x + Math.cos(angle) * 8,
            y + Math.sin(angle) * 8,
            {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            }
        );
    }
}

function drawStars() {
    for (const star of stars) {
        const pullX = (targetX - width / 2) * 0.012;
        const pullY = (targetY - height / 2) * 0.012;

        star.x += pullX * star.speed;
        star.y += pullY * star.speed;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        star.twinkle += 0.035;
        const alpha = star.alpha + Math.sin(star.twinkle) * 0.18;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${star.color}, ${Math.max(0.08, alpha)})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.size > 1.2 && alpha > 0.42) {
            ctx.fillStyle = `rgba(${star.color}, ${alpha * 0.45})`;
            ctx.fillRect(star.x - star.size * 2.5, star.y - 0.35, star.size * 5, 0.7);
            ctx.fillRect(star.x - 0.35, star.y - star.size * 2.5, 0.7, star.size * 5);
        }
    }
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.015;
        particle.life -= 0.025;
        particle.size *= 0.985;

        if (particle.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 5
        );
        gradient.addColorStop(0, `rgba(${particle.color}, ${particle.life})`);
        gradient.addColorStop(1, `rgba(${particle.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
        ctx.fill();

        if (particle.glitter) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${particle.life * 0.8})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particle.x - particle.size * 2.2, particle.y);
            ctx.lineTo(particle.x + particle.size * 2.2, particle.y);
            ctx.moveTo(particle.x, particle.y - particle.size * 2.2);
            ctx.lineTo(particle.x, particle.y + particle.size * 2.2);
            ctx.stroke();
        }
    }
}

function animate() {
    cursorX += (targetX - cursorX) * 0.16;
    cursorY += (targetY - cursorY) * 0.16;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
    glow.style.left = cursorX + "px";
    glow.style.top = cursorY + "px";

    document.documentElement.style.setProperty("--cursor-x", `${(cursorX / width) * 100}%`);
    document.documentElement.style.setProperty("--cursor-y", `${(cursorY / height) * 100}%`);

    if (isPointerActive) {
        for (let i = 0; i < 3; i++) {
            createSparkle(
                cursorX + (Math.random() - 0.5) * 16,
                cursorY + (Math.random() - 0.5) * 16
            );
        }
    }

    ctx.clearRect(0, 0, width, height);
    drawStars();
    drawParticles();
    requestAnimationFrame(animate);
}

document.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    isPointerActive = true;
    cursor.style.opacity = "1";
    glow.style.opacity = "1";
});

document.addEventListener("pointerleave", () => {
    isPointerActive = false;
    cursor.style.opacity = "0";
    glow.style.opacity = "0";
});

document.addEventListener("pointerdown", (event) => {
    createClickBurst(event.clientX, event.clientY);
    cursor.classList.add("is-hovering");
    window.setTimeout(() => cursor.classList.remove("is-hovering"), 160);
});

cursorDesign.addEventListener("change", (event) => {
    document.body.dataset.cursor = event.target.value;
});

themeDesign.addEventListener("change", (event) => {
    document.body.dataset.theme = event.target.value;
    resizeCanvas();
});

controls.forEach((control) => {
    control.addEventListener("pointerenter", () => {
        cursor.classList.add("is-hovering");
    });

    control.addEventListener("pointerleave", () => {
        cursor.classList.remove("is-hovering");
    });
});

customSelects.forEach((customSelect) => {
    const nativeSelect = document.querySelector(`#${customSelect.dataset.select}`);
    const trigger = customSelect.querySelector(".select-trigger");
    const options = customSelect.querySelectorAll(".select-option");

    trigger.addEventListener("click", () => {
        const isOpen = customSelect.classList.toggle("is-open");

        closeCustomSelects(customSelect);
        trigger.setAttribute("aria-expanded", String(isOpen));
    });

    options.forEach((option) => {
        option.addEventListener("click", () => {
            nativeSelect.value = option.dataset.value;
            nativeSelect.dispatchEvent(new Event("change"));
            syncCustomSelect(customSelect, option.dataset.value, option.textContent);
            customSelect.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
        });
    });
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".custom-select")) {
        closeCustomSelects();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCustomSelects();
    }
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();


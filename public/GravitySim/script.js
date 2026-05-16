const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const slider = document.getElementById("radiusSlider");
const valText = document.getElementById("val");
let radius = slider.value;

slider.oninput = ()=>{
    radius = slider.value;
    valText.innerText = radius;
}

let selectedColor = "white";
const colorBtns = document.querySelectorAll(".color-btn");
colorBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        colorBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedColor = btn.getAttribute("data-color");
    });
});

// Random velocity toggle
const randVelToggle = document.getElementById("randVelToggle");

document.getElementById("clearBtn").addEventListener("click", () => {
    planets.length = 0;
});


document.getElementById("ui").addEventListener("click", (e) => {
    e.stopPropagation();
});

canvas.addEventListener("click", (e) => {

    const rect = canvas.getBoundingClientRect();

    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;

    // Not able to create new planet if clicking on existing one
    for (let p of planets) {
        let dx = clickX - p.x;
        let dy = clickY - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= p.radius) {
            return;
        }
    }

    let vx = 0;
    let vy = 0;
    if (randVelToggle && randVelToggle.checked) {
        vx = (Math.random() - 0.5) * 8;
        vy = (Math.random() - 0.5) * 8;
    }

    // create new planet
    planets.push({
        x: clickX,
        y: clickY,
        vx: vx,
        vy: vy,
        radius: Number(radius),
        color: selectedColor,
        mass: Number(radius),
        cooldown: 0
    });
});


const planets = [];

function drawPlanets(){
    for (let p of planets) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.fill();

        
        ctxshadowColor = "transparent";
        ctx.shadowBlur = 0;
        
    }
}

drawPlanets();

function mixColor(c1, c2) {
    return `rgb(
        ${(Math.random()*255 + Math.random()*255)/2},
        ${(Math.random()*255 + Math.random()*255)/2},
        ${(Math.random()*255 + Math.random()*255)/2}
    )`;
}

let flashScreen = false;

function animate(){
    if(flashScreen){
        ctx.fillStyle = "white";
        flashScreen = false;
    }
    else{
        ctx.fillStyle = "black";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < planets.length; i++){
        if(planets[i].cooldown > 0){
            planets[i].cooldown--;
        }

        let ax = 0;
        let ay = 0;

        for(let j = 0; j < planets.length; j++){
            if (i === j) continue;

            let dx = planets[j].x - planets[i].x;
            let dy = planets[j].y - planets[i].y;

            let distance = Math.sqrt(dx * dx + dy * dy);
            if(distance <= planets[i].radius + planets[j].radius){
                if(planets[i].cooldown > 0 || planets[j].cooldown > 0){}
                else {
                    let p1 = planets[i];
                    let p2 = planets[j];

                    // new mass (sum of both)
                    let m1 = p1.radius;
                    let m2 = p2.radius;
                    let total = m1 + m2;

                    // new position (center of mass)
                    let nx = (p1.x*m1 + p2.x*m2) / total;
                    let ny = (p1.y*m1 + p2.y*m2) / total;

                    // new velocity (momentum)
                    let nvx = (p1.vx*m1 + p2.vx*m2) / total;
                    let nvy = (p1.vy*m1 + p2.vy*m2) / total;
                    let newRadius = (m1 + m2)/1.1;

                    if (newRadius > 250) {
                        flashScreen = true;
                        // Explposion effect
                        let numParticles = 50 + Math.floor(Math.random() * 20);
                        let newParticles = [];
                        for(let k = 0; k < numParticles; k++){
                            let angle = Math.random() * Math.PI * 2;
                            let speed = 10 + Math.random() * 15;
                            
                            let hue = Math.floor(Math.random() * 60); 
                            
                            newParticles.push({
                                x: nx + Math.cos(angle) * (newRadius / 2),
                                y: ny + Math.sin(angle) * (newRadius / 2),
                                vx: nvx + Math.cos(angle) * speed,
                                vy: nvy + Math.sin(angle) * speed,
                                radius: 2 + Math.random() * 4,
                                color: `hsl(${hue}, 100%, 60%)`,
                                cooldown: 45
                            });
                        }
                        
                        planets[i] = newParticles[0];
                        for(let k = 1; k < newParticles.length; k++){
                            planets.push(newParticles[k]);
                        }
                    }
                    else{
                        planets[i] = {
                            x: nx,
                            y: ny,
                            vx: nvx,
                            vy: nvy,
                            radius: newRadius,
                            color: mixColor(p1.color, p2.color),
                            cooldown: 0
                        };
                    }

                    planets.splice(j, 1);
                    if (j < i) i--;
                    j--;
                }
            }

            let force = 80 * (planets[j].radius * planets[i].radius) / (distance * distance);
            let acceleration = force / planets[i].radius;
            ax += acceleration * (dx / distance);
            ay += acceleration * (dy / distance);
        }

        planets[i].vx += ax;
        planets[i].vy += ay;
    }


    //updating position
    for (let p of planets) {
        p.x += p.vx;
        p.y += p.vy;
    }

    drawPlanets();
    requestAnimationFrame(animate);
}
animate();
window.onload = function() {
    const userResponse = prompt("Hello! Welcome to the mysterious world. Are you ready for what lies ahead?");
    
    if (userResponse === null || userResponse.trim() === "") {
        alert("I didn't quite get you, but hope you'll have a blast anyway!");
    } else if (userResponse.toLowerCase() === "yes") {
        alert("Great! You're ready for the adventure ahead!");
    } else if (userResponse.toLowerCase() === "no") {
        alert("That's alright, maybe next time!");
    } else {
        alert("I didn't quite get you, but hope you'll have a blast anyway!");
    }
};


let score = 0;
document.getElementById("score").innerText = score;
let points = 0;

function triggerRandomAlert() {
    const messages = [
        "You shouldn't have clicked that.",
        "What were you thinking?",
        "Curiosity killed the cat...",
        "Feeling brave, aren't we?",
        "It's too late now...",
        "Don't look behind you...",
        "Are you sure this is the right choice?",
        "Is someone watching you?",
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    alert(message);
    updateScore();
}

function updateScore() {
    score++;
    document.getElementById("score").innerText = score;
}

function incrementPoints() {
    points += 5;
    document.getElementById("points").innerText = points;
}

let despairTriggered = false;
function triggerScreenDespair() {
    if (!despairTriggered) {
        despairTriggered = true;
        
        const despairOverlay = document.createElement('div');
        despairOverlay.className = 'dark-overlay';
        despairOverlay.innerHTML = "<h1 class='despair-text'>THE VOID AWAITS...</h1>";
        document.body.appendChild(despairOverlay);

        setTimeout(() => {
            despairOverlay.remove();
            despairTriggered = false;
        }, 1000); // Lasts for 2 seconds
    }
}

setInterval(triggerScreenDespair, 15000); // Trigger every 15 seconds

const eerieSounds = ["sound1.mp3", "sound2.mp3", "sound3.mp3"];
function playRandomSound() {
    const audio = new Audio(eerieSounds[Math.floor(Math.random() * eerieSounds.length)]);
    audio.play();
}


function playSpinSound() {
    const audio = new Audio("spin.mp3"); 
    audio.play();

    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0; 
    }, 5000); 
}

function startRotation() {
    console.log("Rotation started!");
}




// trailing red cursor
let cursorTrail = [];
document.addEventListener("mousemove", function (e) {
    const trailElement = document.createElement("div");
    trailElement.className = "trailing-cursor";
    trailElement.style.left = `${e.pageX}px`;
    trailElement.style.top = `${e.pageY}px`;
    document.body.appendChild(trailElement);
    cursorTrail.push(trailElement);

    if (cursorTrail.length > 10) {
        document.body.removeChild(cursorTrail.shift());
    }
});

function distortScreen() {
    const body = document.body;
    body.classList.add('intense-flash'); 

    let distortInterval = setInterval(() => {
        const scale = 0.7 + Math.random() * 0.6; 
        const rotate = Math.random() * 30 - 15; 

        body.style.transition = 'transform 0.03s, background-color 0.03s'; 
        body.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
    }, 30); 

    setTimeout(() => {
        clearInterval(distortInterval);
        body.style.transform = 'scale(1) rotate(0deg)';
        body.classList.remove('intense-flash'); 
    }, 10000); 
}



function triggerFullScreenImage() {
    const videoOverlay = document.createElement("div");
    videoOverlay.className = "creepy-video-overlay";
    videoOverlay.style.position = "fixed";
    videoOverlay.style.top = "0";
    videoOverlay.style.left = "0";
    videoOverlay.style.width = "100%";
    videoOverlay.style.height = "100%";
    videoOverlay.style.zIndex = "9999";
    videoOverlay.style.backgroundColor = "black";

    const videoElement = document.createElement("video");
    videoElement.src = "Windows.mp4"; 
    videoElement.autoplay = true; 
    videoElement.loop = false; 
    videoElement.controls = false; 
    videoElement.muted = false; 
    videoElement.playsInline = true; 
    videoElement.style.width = "100%";
    videoElement.style.height = "100%";
    videoElement.style.objectFit = "cover";
    videoElement.style.pointerEvents = "none"; 

    videoOverlay.appendChild(videoElement);
    document.body.appendChild(videoOverlay);

    videoElement.addEventListener('canplay', () => {
        if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
        } else if (videoElement.mozRequestFullScreen) { // Firefox
            videoElement.mozRequestFullScreen();
        } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
            videoElement.webkitRequestFullscreen();
        } else if (videoElement.msRequestFullscreen) { // IE/Edge
            videoElement.msRequestFullscreen();
        }
    });

    videoElement.onended = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        videoOverlay.remove();
    };
}

const style = document.createElement('style');
style.innerHTML = `
    video::-webkit-media-controls {
        display: none !important;
    }
    video::--media-controls {
        display: none !important;
    }
`;
document.head.appendChild(style);


function startWhispering() {
    alert("You can hear it whispering...");
}

const wandererCard = document.querySelector(".wanderer");
wandererCard.addEventListener("mouseenter", () => {
    wandererCard.style.position = "absolute";
    wandererCard.style.top = `${Math.random() * window.innerHeight}px`;
    wandererCard.style.left = `${Math.random() * window.innerWidth}px`;
});

const creepyMessages = [
    "Did you hear that?",
    "Something is not right...",
    "Are you alone?",
    "This place feels alive...",
    "You should not be here...",
    "It's behind you...",
];

function startCreepyMessages() {
    setInterval(() => {
        const message = creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
        alert(message);
    }, 10000); // Change message every 10 seconds
}

function addGhostlyFigure() {
    const ghost = document.createElement('div');
    ghost.className = 'ghost';
    ghost.style.top = `${Math.random() * window.innerHeight}px`;
    ghost.style.left = `${Math.random() * window.innerWidth}px`;
    document.body.appendChild(ghost);

    setTimeout(() => {
        ghost.remove();
    }, 3000); // Ghost lasts for 3 seconds
}

setInterval(addGhostlyFigure, 15000); // Add ghost every 15 seconds
setInterval(darkenScreen, 30000); // Darken screen every 30 seconds
setInterval(playRandomSound, 20000); // Play sound every 20 seconds

function jumpThroughTime() {
    const futureMessages = [
        "Welcome to the future, where nothing is as it seems...",
        "Time is an illusion, don't trust it!",
        "You have crossed into another dimension!",
    ];
    const randomMessage = futureMessages[Math.floor(Math.random() * futureMessages.length)];
    document.getElementById('future-message').innerHTML = randomMessage;
}

function createMemory() {
    const memory = document.createElement('button');
    memory.innerHTML = 'Stored Memory';
    memory.addEventListener('click', () => {
        console.log('Memory accessed...');
        triggerRandomAlert();
    });
    document.body.appendChild(memory);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        event.preventDefault();
        triggerRandomAlert();
    }
});

window.addEventListener('resize', () => {
    document.body.style.transition = 'transform 0.5s';
    document.body.style.transform = 'scale(0.8)';
    setTimeout(() => {
        document.body.style.transform = 'scale(1)';
    }, 1000);
});

startCreepyMessages();

function improveVanishingAct() {
    const card = event.currentTarget;
    card.classList.add('glitch-effect');

    triggerRandomAlert();

    updateScore();
    incrementPoints();

    
    addGhostlyFigure();

    const solveButton = document.querySelector('.solve-me'); 
    const creepySound = document.getElementById('creepySound');
    const creepyOverlay = document.getElementById('creepyOverlay');

    solveButton.addEventListener('click', function() {
        creepySound.play();
        creepyOverlay.style.opacity = 1;
        document.body.classList.add('creepy-effect');

        
        document.body.style.transition = "background-color 1s ease";
        document.body.style.backgroundColor = "black"; // You can choose any color

        const flickerInterval = setInterval(() => {
            document.body.style.opacity = Math.random() < 0.5 ? '1' : '0.5';
        }, 200);

        const bloodDripDiv = document.createElement('div');
        bloodDripDiv.className = 'blood-drip';
        document.body.appendChild(bloodDripDiv);
        
        setTimeout(() => {
            clearInterval(flickerInterval);
            document.body.style.opacity = '1'; // Reset opacity
            bloodDripDiv.remove(); 
        }, 5000); 
    });
}

window.onload = () => {
    createMemory();
    jumpThroughTime();
};


const card1 = document.getElementById('card1');

const eerieAudio = new Audio('sound1.mp3');
card1.addEventListener('mouseenter', () => {
    eerieAudio.play();
});



setInterval(createBloodDrip, 1500);

card1.addEventListener('mouseover', () => {
    card1.classList.add('glitch-effect-active');
});

card1.addEventListener('mouseleave', () => {
    card1.classList.remove('glitch-effect-active');
});

function improveVanishingAct() {
    const card = document.getElementById('card1');
    card.classList.add('clicked'); 
}

function playEerieSound() {
    const audio = new Audio('sound2.mp3');
    audio.play();
    const newSound = new Audio('sound1.mp3');
    newSound.play();
}
document.body.style.backgroundColor = "#1e1e1e"; // Change to a darker background color

// Random scary quotes
const scaryQuotes = [
    "You're never really alone...",
    "The shadows have a life of their own.",
    "They watch you while you sleep...",
    "Sometimes, it's better to forget.",
    "What lurks in the dark will find you...",
];

card1.addEventListener('mouseenter', () => {
    const randomQuote = scaryQuotes[Math.floor(Math.random() * scaryQuotes.length)];
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote-display';
    quoteElement.innerText = randomQuote;
    card1.appendChild(quoteElement);

    setTimeout(() => {
        quoteElement.remove();
    }, 3000); // Display for 3 seconds
});

let countdownTimer;
function startCountdown() {
    let timeLeft = 10; // 10 seconds countdown
    const countdownDisplay = document.createElement('div');
    countdownDisplay.className = 'countdown-timer';
    countdownDisplay.innerText = `Countdown: ${timeLeft}`;
    document.body.appendChild(countdownDisplay);

    countdownTimer = setInterval(() => {
        timeLeft--;
        countdownDisplay.innerText = `Countdown: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            countdownDisplay.innerText = "Time's up!";
            setTimeout(() => {
                countdownDisplay.remove();
            }, 2000); // Display 'Time's up!' for 2 seconds
        }
    }, 1000);
}

card1.addEventListener('click', startCountdown);

function startBackgroundAnimation() {
    document.body.style.animation = 'creepyBackground 5s infinite alternate';
}

window.onload = startBackgroundAnimation;

const button = document.querySelector('.solve-button');
const glitchText = document.querySelector('.glitch-effect');
const distortedText = document.querySelector('.distorted-text');
const audio = new Audio('sound1.mp3');

button.addEventListener('click', () => {
    audio.play();
    
    glitchText.classList.add('active');

    distortedText.textContent = "You solved it! Or did you?";

    setTimeout(() => {
        glitchText.classList.remove('active');
    }, 3000); 
});


function createBloodConfetti() {
    for (let i = 0; i < 30; i++) {
        const bloodDrop = document.createElement("div");
        bloodDrop.classList.add("blood-drop-confetti");

        bloodDrop.style.left = `${Math.random() * window.innerWidth}px`;
        bloodDrop.style.animationDelay = `${Math.random() * 0.5}s`;
        
        document.body.appendChild(bloodDrop);

        bloodDrop.addEventListener('animationend', () => bloodDrop.remove());
    }
}

function improveVanishingAct() {
    const card = document.getElementById("card1");
    card.classList.add("clicked");
    playEerieSound();

     createBloodConfetti();

    const thunderBackground = document.createElement("div");
    thunderBackground.classList.add("thunder-background");
    document.body.appendChild(thunderBackground);
    

    const ghostImage = document.createElement("img");
    ghostImage.src = "images/valak.png"; 
    ghostImage.classList.add("ghost-image");

    ghostImage.style.opacity = 0; // Start fully transparent
    ghostImage.style.transition = 'opacity 2s'; // Change opacity over 2 seconds

    document.body.appendChild(ghostImage);

    setTimeout(() => {
        ghostImage.style.opacity = 1; 
    }, 100); 

    const thunderSound = new Audio('card1Sound.mp3'); 
    thunderSound.play();

    setTimeout(() => {
        ghostImage.remove();
        thunderBackground.remove(); 
    }, 10000); 
    setTimeout(() => {
        ghostImage.remove();
        thunderBackground.remove(); 
        createBreakingEffect(); 
    }, 10000); 
    
}



function createFloatingShadows() {
    const shadowCount = 30; // Number of shadows
    const shadows = [];

    for (let i = 0; i < shadowCount; i++) {
        const shadow = document.createElement('div');
        shadow.className = 'floating-shadow';
        shadow.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        shadow.style.animationDuration = `${Math.random() * 3 + 2}s`; // Random animation duration
        document.body.appendChild(shadow);
        shadows.push(shadow);
    }

    setTimeout(() => {
        shadows.forEach(shadow => document.body.removeChild(shadow));
    }, 5000); 
}


function createConfetti() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate confetti particles
    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            velocityX: (Math.random() - 0.5) * 5,
            velocityY: Math.random() * -3 - 1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.closePath();
        });
    }

    function update() {
        particles.forEach(p => {
            p.x += p.velocityX;
            p.y += p.velocityY;

            // Recycle particles
            if (p.y < 0) {
                p.y = canvas.height;
                p.x = Math.random() * canvas.width;
                p.velocityY = (Math.random() * -3) - 1;
            }
        });
    }

    function animate() {
        draw();
        update();
        requestAnimationFrame(animate);
    }

    animate();

    // Remove canvas after a while
    setTimeout(() => {
        document.body.removeChild(canvas);
    }, 5000); // Adjust duration as needed
}

function incrementPoints() {
    const pointsElement = document.getElementById('points');
    let currentPoints = parseInt(pointsElement.innerText);
    pointsElement.innerText = currentPoints + 1; // Increment points
}
function celebrate() {
    incrementPoints(); // Increment points when the button is clicked

    let crackerSound = new Audio('cracker-sound.mp3'); 
    crackerSound.play();
    
    for (let i = 0; i < 90; i++) { 
        createFirework();
    }

    setTimeout(() => {
        crackerSound.pause();
        crackerSound.currentTime = 0; // Reset the audio for next use
    }, 7000); 

    // Spawn fireworks continuously for 7 seconds
    const fireworkInterval = setInterval(() => {
        createFirework();
    }, 100); 

    setTimeout(() => {
        clearInterval(fireworkInterval);
    }, 7000); // 7000 milliseconds = 7 seconds
    
}



function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    firework.style.bottom = `${Math.random() * 100}vh`; // Random vertical position
    firework.style.animationDuration = `${Math.random() * 3 + 1}s`; // Random duration
    document.body.appendChild(firework);

    // Remove firework after animation ends
    firework.addEventListener('animationend', () => {
        firework.remove();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const potionCard = document.querySelector('.potion');
    const surpriseMessageDiv = document.getElementById('surprise-message');
    let clickCount = 0;

    function showMessage() {
        clickCount++;
        const messages = [
            'Boo! You found a hidden message!',
            'Keep clicking for more surprises!',
            'The potion is bubbling with excitement!',
            'What will happen next? Click again!'
        ];

        if (clickCount <= messages.length) {
            surpriseMessageDiv.textContent = messages[clickCount - 1];
        } else {
            surpriseMessageDiv.textContent = 'The potion is now mixed! Something magical may happen...';
            triggerSurpriseEffect();
        }
    }

    function triggerSurpriseEffect() {
        const colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33a1', '#ffcc33'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        potionCard.style.backgroundColor = randomColor;
        potionCard.style.transition = 'background-color 0.5s ease';

        const surpriseSound = new Audio('surprise-sound.mp3');
        surpriseSound.play();

        const liquid = document.querySelector('.liquid');
        liquid.style.animation = 'mixPotion 1s infinite';
    }

    potionCard.addEventListener('click', showMessage);
});

const potionCard = document.querySelector('.potion');
const hiddenMessage = document.getElementById('hidden-message');

function showMessage() {
    hiddenMessage.style.display = 'block'; 
    setTimeout(() => {
        hiddenMessage.style.display = 'none'; 
    }, 3000); 
}

potionCard.addEventListener('click', showMessage);

document.addEventListener("mousemove", (e) => {
    console.log("Mouse is moving", e.pageX, e.pageY); 
    const cursorCircle = document.createElement("div");
    cursorCircle.classList.add("trailing-cursor");

    cursorCircle.style.left = `${e.pageX}px`;
    cursorCircle.style.top = `${e.pageY}px`;

    document.body.appendChild(cursorCircle);

    setTimeout(() => {
        cursorCircle.remove();
    }, 1000);
});

function playAmogus() {
    const amogus = new Audio('Amongus.mp3');
    const duration = 2; 
    const totalDuration = 10; 
    const loops = Math.ceil(totalDuration / duration); 

    let currentLoop = 0; 

    function playNextLoop() {
        if (currentLoop < loops) {
            amogus.currentTime = 0; 
            amogus.play(); 

            currentLoop++;

            setTimeout(() => {
                playNextLoop();
            }, duration * 1000); 
        } else {
            amogus.pause(); 
            amogus.currentTime = 0; 
        }
    }

    playNextLoop(); 
}

function playDisSound() {
    const audio = new Audio('distort.mp3');
    audio.play();

    setTimeout(() => {
        audio.pause();  // Stop the audio
        audio.currentTime = 0;  // Reset to the start
    }, 5000);  

    const newSound = new Audio('distorted2.mp3');
    newSound.play();
    const alarm = new Audio('alarm.mp3');
    alarm.play();
}
function reflectWords() {
    const reflections = [
        "You see a mischievous fairy! 🧚‍♀️",
        "A wise old owl winks at you! 🦉",
        "A rainbow appears, and laughter fills the air! 🌈",
        "You glimpse a playful ghost dancing! 👻",
        "The mirror shows you a silly monster! 👹"
    ];
    const randomReflection = reflections[Math.floor(Math.random() * reflections.length)];
    
    const reflectionElement = document.getElementById("reflection");
    reflectionElement.innerText = randomReflection;
    reflectionElement.style.display = "block"; 
    playMagicSound(); 
}

function playMagicSound() {
    const audio = new Audio('magic-sound.mp3'); 
    audio.play();
}

function embarkOnAdventure() {
    const safariCard = document.getElementById('safari-card');
    safariCard.classList.add('glitch-effect');

    const safariSound = new Audio('safari-sound.mp3'); 
    safariSound.play();

    const messages = [
        "Beware of the wild animals lurking in the code!",
        "A ghost has joined your adventure!",
        "Did you hear that? It’s just a bug!",
        "Watch out! Safari spirits are near!",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    alert(randomMessage);

    setTimeout(() => {
        safariCard.classList.remove('glitch-effect');
    }, 3000); 

    const safariEffect = document.querySelector('.safari-effect');
    safariEffect.classList.add('active');

    setTimeout(() => {
        safariEffect.classList.remove('active');
    }, 3000); 

    setTimeout(() => {
        const bsodMessage = document.querySelector('.bsod-message');
        bsodMessage.style.display = 'flex'; 
        bsodMessage.innerHTML = `<h2>:( SYSTEM FAILURE</h2><p>Your adventure has encountered an error!</p>`; // Custom BSOD message

        setTimeout(() => {
            bsodMessage.style.display = 'none'; 
        }, 50000); 
    }, 3000); 
    createBugs();
}
function createBugs() {
    const numberOfBugs = 5000; 
    const bugs = ['🐜', '🐞', '🕷️', '🐍', '🦗', '🕸️', '🐛']; 

    for (let i = 0; i < numberOfBugs; i++) {
        const bug = document.createElement('span'); 
        const randomBug = bugs[Math.floor(Math.random() * bugs.length)]; 
        bug.textContent = randomBug; 
        bug.classList.add('bug'); 
        bug.style.position = 'absolute'; 
        bug.style.fontSize = '24px'; 
        bug.style.left = Math.random() * 100 + 'vw'; 
        bug.style.top = Math.random() * 100 + 'vh'; 
        bug.style.transition = 'transform 5s linear'; 

        document.body.appendChild(bug); 

        setTimeout(() => {
            bug.style.transform = `translateY(100vh)`; 
        }, 100);

        setTimeout(() => {
            bug.remove(); 
        }, 6000); 
    }
}
function startRotation() {
    const gridDiv = document.querySelector(".grid");
    
    gridDiv.classList.add("rotate-active");
  
    setTimeout(() => {
      gridDiv.classList.remove("rotate-active");
    }, 5000);
  }
  

document.getElementById("hidden-disturbance").classList.add("hidden-message");
function triggerDisturbance() {
    document.getElementById("disturbance-text").textContent = randomizeText();
    showHiddenDisturbance();

    setTimeout(() => {
        moveCardAround();
    }, 4000); // Adjust timing as needed
}

function randomizeText() {
    const messages = [
        "Stop clicking.",
        "It's already too late..."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function showHiddenDisturbance() {
    const hiddenMessage = document.getElementById("hidden-disturbance");
    hiddenMessage.style.display = 'block'; // Make hidden message visible
    hiddenMessage.style.animation = 'fadeIn 1s forwards'; // Add fade-in animation
}

function moveCardAround() {
    const card = document.getElementById("disturb");
    const bsoD = document.createElement("div");
    bsoD.className = "bsoD";
    bsoD.textContent = "FATAL ERROR! SYSTEM CRASHED!";
    document.body.appendChild(bsoD);

    let displacementInterval = setInterval(() => {
        const randomX = Math.random() * (window.innerWidth - card.offsetWidth);
        const randomY = Math.random() * (window.innerHeight - card.offsetHeight);
        card.style.transform = `translate(${randomX}px, ${randomY}px)`;

        setTimeout(() => {
            clearInterval(displacementInterval);
            showBSOD(bsoD);
        }, 2000); 
    }, 1000); 
}

function showBSOD(bsoD) {
    bsoD.style.position = "fixed"; 
    bsoD.style.top = "0"; 
    bsoD.style.left = "0"; 
    bsoD.style.width = "100vw"; 
    bsoD.style.height = "100vh"; 
    bsoD.style.backgroundColor = "#0000FF"; 
    bsoD.style.color = "#ffffff"; 
    bsoD.style.textAlign = "center"; 
    bsoD.style.fontSize = "3rem"; 
    bsoD.style.display = "flex"; 
    bsoD.style.justifyContent = "center"; 
    bsoD.style.alignItems = "center"; 
    bsoD.style.zIndex = "9999"; 
    bsoD.style.opacity = "1"; 
    bsoD.style.transition = "opacity 1s"; 

    if (bsoD.requestFullscreen) {
        bsoD.requestFullscreen();
    } else if (bsoD.mozRequestFullScreen) { // Firefox
        bsoD.mozRequestFullScreen();
    } else if (bsoD.webkitRequestFullscreen) { // Chrome, Safari, Opera
        bsoD.webkitRequestFullscreen();
    } else if (bsoD.msRequestFullscreen) { // IE/Edge
        bsoD.msRequestFullscreen();
    }

    setTimeout(() => {
        bsoD.style.opacity = "0"; 
        setTimeout(() => {
            bsoD.style.display = "none"; 
            returnToNormal(); 
        }, 1000); 
    }, 8000); 
}


function addShakeAnimation() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        body {
            animation: websiteShake 0.3s infinite; /* Set the shake animation */
        }
    `;
    
    document.head.appendChild(style);

    const activateShake = () => {
        document.body.style.animation = 'none'; 
        setTimeout(() => {
            document.body.style.animation = 'websiteShake 0.3s infinite'; 
        }, 50); 
    };

    setInterval(activateShake, 5000); 
}

addShakeAnimation();


function startEarthquake() {
    const gridDiv = document.querySelector(".grid");
    
    gridDiv.classList.add("quake-active");
  
    setTimeout(() => {
      gridDiv.classList.remove("quake-active");
    }, 20000);
  }


function triggerDisturbance() {
    const body = document.body;

    body.classList.add('shake-active');

    setTimeout(() => {
        body.classList.remove('shake-active');
    }, 10000); 

    
    const hiddenMessage = document.getElementById("hidden-disturbance");
    hiddenMessage.classList.remove("hidden-message"); // Make the message visible

}


function triggerCrash() {
    document.body.classList.add('chaotic-mode');
    
    let chaosInterval = setInterval(() => {
        let chaosElement = document.createElement('div');
        chaosElement.classList.add('chaos-element');
        chaosElement.style.top = Math.random() * window.innerHeight + 'px';
        chaosElement.style.left = Math.random() * window.innerWidth + 'px';
        chaosElement.style.zIndex = Math.floor(Math.random() * 1000); // Random z-index for layering
        document.body.appendChild(chaosElement);

        chaosElement.style.animation = 'spin-glitch 0.5s infinite linear, move-glitch 0.5s infinite';
        
        let randomText = document.createElement('p');
        randomText.classList.add('glitchy-text');
        randomText.innerText = 'SYSTEM CRASH!';
        randomText.style.top = Math.random() * window.innerHeight + 'px';
        randomText.style.left = Math.random() * window.innerWidth + 'px';
        document.body.appendChild(randomText);
    }, 50); 

    setTimeout(() => {
        clearInterval(chaosInterval);
        document.body.classList.remove('chaotic-mode');
        document.querySelectorAll('.chaos-element, .glitchy-text').forEach(el => el.remove());
    }, 10000);
}

function createMemory() {
    let errorMemoryText = document.createElement('div');
    errorMemoryText.classList.add('error-memory');
    errorMemoryText.innerText = 'ERROR MEMORY';
    document.body.appendChild(errorMemoryText);

    errorMemoryText.style.top = Math.random() * window.innerHeight + 'px';
    errorMemoryText.style.left = Math.random() * window.innerWidth + 'px';

    setTimeout(() => errorMemoryText.remove(), 3000);
}

function triggerCrash() {
    document.body.classList.add('chaotic-mode');
    
    let chaosInterval = setInterval(() => {
        let chaosElement = document.createElement('div');
        chaosElement.classList.add('chaos-element');
        chaosElement.style.top = Math.random() * window.innerHeight + 'px';
        chaosElement.style.left = Math.random() * window.innerWidth + 'px';
        chaosElement.style.zIndex = Math.floor(Math.random() * 1000); // Random z-index for layering
        document.body.appendChild(chaosElement);

        chaosElement.style.animation = 'spin-glitch 0.5s infinite linear, move-glitch 0.5s infinite';
        
        let randomText = document.createElement('p');
        randomText.classList.add('glitchy-text');
        randomText.innerText = 'SYSTEM CRASH!';
        randomText.style.top = Math.random() * window.innerHeight + 'px';
        randomText.style.left = Math.random() * window.innerWidth + 'px';
        document.body.appendChild(randomText);
    }, 50); 

    setTimeout(() => {
        clearInterval(chaosInterval);
        document.body.classList.remove('chaotic-mode');
        document.querySelectorAll('.chaos-element, .glitchy-text').forEach(el => el.remove());
    }, 10000);
}

function createMemory() {
    let errorMemoryText = document.createElement('div');
    errorMemoryText.classList.add('error-memory');
    errorMemoryText.innerText = 'ERROR MEMORY';
    document.body.appendChild(errorMemoryText);

    errorMemoryText.style.top = Math.random() * window.innerHeight + 'px';
    errorMemoryText.style.left = Math.random() * window.innerWidth + 'px';

    setTimeout(() => errorMemoryText.remove(), 3000);
}

function createMemory() {
    let errorMemoryText = document.createElement('div');
    errorMemoryText.classList.add('error-memory');
    errorMemoryText.innerText = 'ERROR MEMORY';
    document.body.appendChild(errorMemoryText);

    errorMemoryText.style.top = Math.random() * window.innerHeight + 'px';
    errorMemoryText.style.left = Math.random() * window.innerWidth + 'px';

    setTimeout(() => errorMemoryText.remove(), 3000);
}


function createMemory() {
    for (let i = 0; i < 70; i++) { // Increase for more elements
        let errorMemoryText = document.createElement('div');
        errorMemoryText.classList.add('error-memory');
        errorMemoryText.innerText = 'ERROR MEMORY';
        document.body.appendChild(errorMemoryText);

        errorMemoryText.style.position = 'fixed';
        errorMemoryText.style.top = Math.random() * window.innerHeight + 'px';
        errorMemoryText.style.left = Math.random() * window.innerWidth + 'px';
        errorMemoryText.style.animation = 'error-fade 0.5s alternate infinite, rotate-wobble 1s infinite';
    }

    document.body.classList.add('glitch-background');
    setTimeout(() => {
        document.body.classList.remove('glitch-background');
        document.querySelectorAll('.error-memory').forEach(el => el.remove());
    }, 10000);

    triggerScreenShake();

    triggerCursorFlicker();

    triggerRandomColorChanges();

    triggerRandomDialogs();

    document.addEventListener('mousemove', createMouseTrail);
    setTimeout(() => {
        document.removeEventListener('mousemove', createMouseTrail);
    }, 10000);
}

function triggerScreenShake() {
    let body = document.body;
    let shakeInterval = setInterval(() => {
        body.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
    }, 50);

    setTimeout(() => {
        clearInterval(shakeInterval);
        body.style.transform = 'none';
    }, 1000);
}

function triggerCursorFlicker() {
    let cursorInterval = setInterval(() => {
        document.body.style.cursor = (Math.random() > 0.5) ? 'none' : 'default';
    }, 100);

    setTimeout(() => {
        clearInterval(cursorInterval);
        document.body.style.cursor = 'default';
    }, 10000);
}

function triggerRandomColorChanges() {
    let colorInterval = setInterval(() => {
        document.querySelectorAll('*').forEach(element => {
            const randomColor = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
            element.style.color = randomColor;
            element.style.backgroundColor = randomColor;
            element.style.borderColor = randomColor;
        });
    }, 100);

    setTimeout(() => {
        clearInterval(colorInterval);
        document.querySelectorAll('*').forEach(element => {
            element.style.color = '';
            element.style.backgroundColor = '';
            element.style.borderColor = '';
        });
    }, 10000);
}

function triggerRandomDialogs() {
    let dialogInterval = setInterval(() => {
        let randomMessage = ['ERROR DETECTED!', 'SYSTEM OVERLOAD!', 'UNEXPECTED BEHAVIOR', 'RANDOM FAULT OCCURRED'];
        let dialog = document.createElement('div');
        dialog.classList.add('error-dialog');
        dialog.innerText = randomMessage[Math.floor(Math.random() * randomMessage.length)];
        document.body.appendChild(dialog);

        setTimeout(() => {
            dialog.remove();
        }, 2000);
    }, 500);

    setTimeout(() => {
        clearInterval(dialogInterval);
    }, 10000);
}

function createMouseTrail(event) {
    let trail = document.createElement('div');
    trail.classList.add('error-memory-trail');
    trail.innerText = 'ERROR MEMORY';
    trail.style.position = 'fixed';
    trail.style.top = event.clientY + 'px';
    trail.style.left = event.clientX + 'px';
    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 1000); 
}

function triggerTimeMachine() {
    const randomIp = generateRandomIp();

    const fakeIpElement = document.getElementById('fake-ip');
    fakeIpElement.innerText = `Your IP Address: ${randomIp}`; // Set the generated IP address
    fakeIpElement.style.display = 'block'; // Show the IP address

    narrateIpAddress(randomIp);
}

function generateRandomIp() {
    const randomPart = () => Math.floor(Math.random() * 256); 
    return `${randomPart()}.${randomPart()}.${randomPart()}.${randomPart()}`;
}

function narrateIpAddress(ip) {
    const utterance = new SpeechSynthesisUtterance(`Your IP address is ${ip}`);
    utterance.rate = 0.9; 
    utterance.pitch = 1; 
    speechSynthesis.speak(utterance);
}

displayIpMessage();

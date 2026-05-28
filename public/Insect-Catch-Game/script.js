// --- Sound Setup ---
const backgroundMusic = document.getElementById('background-music')
const catchSound = document.getElementById('catch-sound')
const buttonClickSound = document.getElementById('button-click-sound')
const muteBtn = document.getElementById('mute-btn')
const volumeSlider = document.getElementById('volume-slider')

let isMuted = false

// Preload all sounds
backgroundMusic.load()
catchSound.load()
buttonClickSound.load()

// Set initial volume
backgroundMusic.volume = 0.5
catchSound.volume = 0.5
buttonClickSound.volume = 0.5

const screens = document.querySelectorAll('.screen');
const choose_insect_btns = document.querySelectorAll('.choose-insect-btn');
const start_btn = document.getElementById('start-btn')
const game_container = document.getElementById('game-container')
const timeEl = document.getElementById('time')
const scoreEl = document.getElementById('score')
const message = document.getElementById('message')
let seconds = 0
let score = 0
let selected_insect = {}

<<<<<<< HEAD
start_btn.addEventListener('click', () => {
    buttonClickSound.currentTime = 0
    buttonClickSound.onended = null // clear any previous onended
    buttonClickSound.play()
    
    // Wait for sound to finish, then show next screen
    buttonClickSound.onended = () => {
        screens[0].classList.add('up')
    }
=======
start_btn.addEventListener('click', () =>{
screens[0].classList.add('up')
>>>>>>> upstream/main
})

choose_insect_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        buttonClickSound.currentTime = 0
        buttonClickSound.onended = null // clear any previous onended
        buttonClickSound.play()

        const img = btn.querySelector('img')
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        selected_insect = { src, alt }

        // Wait for sound to finish, then show game screen
        buttonClickSound.onended = () => {
            screens[1].classList.add('up')
            setTimeout(createInsect, 1000)
            startGame()

            // Start background music after screen slides
            setTimeout(() => {
                backgroundMusic.play()
            }, 500)
        }
    })
})

function startGame() {
    setInterval(increaseTime, 1000)
}

function increaseTime() {
    let m = Math.floor(seconds / 60)
    let s = seconds % 60
    m = m < 10 ? `0${m}` : m
    s = s < 10 ? `0${s}` : s
    timeEl.innerHTML = `Time: ${m}:${s}`
    seconds++
}

function createInsect() {
    const insect = document.createElement('div')
    insect.classList.add('insect')
    const { x, y } = getRandomLocation()
    insect.style.top = `${y}px`
    insect.style.left = `${x}px`
    insect.innerHTML = `<img src="${selected_insect.src}" alt="${selected_insect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`

    insect.addEventListener('click', catchInsect)

    game_container.appendChild(insect)
}

function getRandomLocation() {
    const width = window.innerWidth
    const height = window.innerHeight
    const x = Math.random() * (width - 200) + 100
    const y = Math.random() * (height - 200) + 100
    return { x, y }
}

function catchInsect() {
<<<<<<< HEAD
    catchSound.currentTime = 0
    catchSound.play()

    increaseScore()
    this.classList.add('caught')
    setTimeout(() => this.remove(), 2000)
    addInsects()
=======
  increaseScore()
  this.classList.add('caught')
  this.style.pointerEvents = 'none'
  setTimeout(() => {
    this.remove()
  }, 300)
  addInsects()
>>>>>>> upstream/main
}

function addInsects() {
    setTimeout(createInsect, 1000)
    setTimeout(createInsect, 1500)
}

function increaseScore() {
    score++
    if(score > 19) {
        message.classList.add('visible')
    }
    scoreEl.innerHTML = `Score: ${score}`
}

// --- Mute Toggle ---
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted
    backgroundMusic.muted = isMuted
    catchSound.muted = isMuted
    buttonClickSound.muted = isMuted
    muteBtn.textContent = isMuted ? '🔇' : '🔊'
})

// --- Volume Slider ---
volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value
    backgroundMusic.volume = volume
    catchSound.volume = volume
    buttonClickSound.volume = volume
})
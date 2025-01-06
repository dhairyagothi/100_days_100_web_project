const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('.start'),
    reset: document.querySelector('.reset'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const shuffle = array => {
    const clonedArray = [...array]
    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = clonedArray[i]
        clonedArray[i] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }
    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []
    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }
    return randomPicks
}

const generateGame = () => {
    const dimensions = 4  // hardcoded dimension since it's in your HTML
    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍']
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2)
    const items = shuffle([...picks, ...picks])
    
    selectors.board.innerHTML = items.map(item => `
        <div class="card">
            <div class="card-front"></div>
            <div class="card-back">${item}</div>
        </div>
    `).join('')
    
    selectors.board.style.gridTemplateColumns = `repeat(${dimensions}, auto)`
}

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')
    selectors.reset.classList.remove('disabled')

    state.loop = setInterval(() => {
        state.totalTime++
        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `Time: ${state.totalTime} sec`
    }, 1000)
}

const resetGame = () => {
    clearInterval(state.loop)
    state.gameStarted = false
    state.flippedCards = 0
    state.totalFlips = 0
    state.totalTime = 0
    
    selectors.moves.innerText = '0 moves'
    selectors.timer.innerText = 'Time: 0 sec'
    selectors.start.classList.remove('disabled')
    selectors.reset.classList.add('disabled')
    selectors.boardContainer.classList.remove('flipped')
    selectors.win.innerHTML = ''
    
    generateGame()
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })
    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    if (!document.querySelectorAll('.card:not(.matched)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `
            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.className.includes('start') && !eventTarget.className.includes('disabled')) {
            startGame()
        } else if (eventTarget.className.includes('reset')) {
            resetGame()
        }
    })
}

generateGame()
attachEventListeners()
selectors.reset.classList.add('disabled')
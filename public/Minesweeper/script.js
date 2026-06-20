const columns = ['A', 'B', 'C', 'D', 'E'];
let bomblist = [];
let attemptlist = [];
let gameOver = false;

const boardDiv = document.getElementById('board');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

//web audio setup
let audioCtx=null;

function getAudioContext(){
    if(!audioCtx){
        audioCtx = new(window.AudioContext ||window.webkitAudioContext)();
    }
    if(audioCtx.state==='suspended'){
        audioCtx.resume();
    }
    return audioCtx;
}
//safe tile sound
async function playSafeSound() {
    const ctx = getAudioContext();
    await ctx.resume(); // Wait until context is truly running before scheduling
 
    // Create oscillator for the tick tone
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
 
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
 
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);           // High A note
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05); // Quick drop
 
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12); // Fast fade-out
 
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12); // Short tick duration
}
//bomb explosion sound
async function playBombSound() {
    const ctx = getAudioContext();
    await ctx.resume(); // Wait until context is truly running before scheduling
 
    // --- Noise source (raw explosion texture) ---
    const bufferSize = ctx.sampleRate * 0.8; // 0.8 seconds of noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // Fill with white noise (-1 to 1)
    }
 
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
 
    // --- Lowpass filter (~400Hz) — makes the noise sound deep and boomy ---
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
 
    // --- Gain envelope — sharp attack, exponential decay (blast fade-out) ---
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(1.5, ctx.currentTime);           // Peak volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8); // Fade to silence
 
    // --- Wire up: noise → filter → gain → output ---
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
 
    noiseSource.start(ctx.currentTime);
    noiseSource.stop(ctx.currentTime + 0.8); // Match buffer length
}
//victory sound
async function playVictorySound() {
    const ctx = getAudioContext();
    await ctx.resume(); // Wait until context is truly running before scheduling
 
    // Three notes of an ascending major chord (C5, E5, G5)
    const notes = [523.25, 659.25, 783.99];
 
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
 
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
 
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
 
        // Stagger each note by 0.15s so they play as an arpeggio
        const startTime = ctx.currentTime + i * 0.15;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05);  // Quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6); // Slow decay
 
        osc.start(startTime);
        osc.stop(startTime + 0.6);
    });
}

// Generate 4 unique random bomb coordinates
function generateBombs() {
    bomblist = [];
    while (bomblist.length < 4) {
        let randomCol = columns[Math.floor(Math.random() * 5)];
        let randomRow = Math.floor(Math.random() * 5) + 1;
        let bombCoord = `${randomCol} ${randomRow}`;
        
        if (!bomblist.includes(bombCoord)) {
            bomblist.push(bombCoord);
        }
    }
}

// Find neighbors matching Python algorithm logic
function getNeighbours(coord) {
    let parts = coord.split(' ');
    let colIndex = columns.indexOf(parts[0]);
    let rowIndex = parseInt(parts[1]);

    let validCols = [colIndex - 1, colIndex + 1, colIndex].filter(c => c >= 0 && c < 5);
    let validRows = [rowIndex - 1, rowIndex + 1, rowIndex].filter(r => r >= 1 && r <= 5);

    let neighbours = [];
    for (let c of validCols) {
        for (let r of validRows) {
            neighbours.push(`${columns[c]} ${r}`);
        }
    }
    
    let selfIndex = neighbours.indexOf(coord);
    if (selfIndex !== -1) {
        neighbours.splice(selfIndex, 1);
    }
    return neighbours;
}

// Count surrounding bombs
function getBombCount(coord) {
    if (bomblist.includes(coord)) return '*';
    
    let neighbours = getNeighbours(coord);
    let count = 0;
    for (let n of neighbours) {
        if (bomblist.includes(n)) {
            count++;
        }
    }
    return count;
}

// Handle square click interaction
function handleCellClick(coord) {
    if (gameOver || attemptlist.includes(coord)) return;

    let cellElement = document.getElementById(coord);
    cellElement.classList.add('revealed');

    if (bomblist.includes(coord)) {
        gameOver = true;
        playBombSound();
        messageDiv.innerText = 'YOU LOST :(';
        messageDiv.style.color = '#ff4d4d';
        revealAllBombs();
        restartBtn.style.display = 'inline-block';
    } else {
        attemptlist.push(coord);
        let count = getBombCount(coord);
        cellElement.innerText = count === 0 ? '' : count;
        
        if (attemptlist.length === 21) {
            gameOver = true;
            playVictorySound();
            messageDiv.innerText = 'YOU WIN!!!!';
            messageDiv.style.color = '#28a745';
            revealAllBombs();
            restartBtn.style.display = 'inline-block';
        }else {
            playSafeSound(); 
        }
    }
}

// Reveal all hidden bombs at game over
function revealAllBombs() {
    for (let bomb of bomblist) {
        let cellElement = document.getElementById(bomb);
        cellElement.classList.add('revealed', 'bomb');
        cellElement.innerText = '*';
    }
}

// Initialize board and reset game variables
function initGame() {
    bomblist = [];
    attemptlist = [];
    gameOver = false;
    messageDiv.innerText = '';
    restartBtn.style.display = 'none';
    boardDiv.innerHTML = ''; 

    generateBombs();

    // Create top row column headers
    let cornerSpace = document.createElement('div');
    boardDiv.appendChild(cornerSpace);
    for (let c of columns) {
        let label = document.createElement('div');
        label.className = 'label';
        label.innerText = c;
        boardDiv.appendChild(label);
    }

    // Create grid layout with buttons
    for (let r = 1; r <= 5; r++) {
        let rowLabel = document.createElement('div');
        rowLabel.className = 'label';
        rowLabel.innerText = r;
        boardDiv.appendChild(rowLabel);

        for (let c = 0; c < 5; c++) {
            let coord = `${columns[c]} ${r}`;
            let btn = document.createElement('button');
            btn.className = 'cell';
            btn.id = coord;
            btn.addEventListener('click', () => handleCellClick(coord));
            boardDiv.appendChild(btn);
        }
    }
}

// Attach restart listener and start game
restartBtn.addEventListener('click', initGame);
initGame();

let queue = [];
let cache = [];
const cacheLimit = 4;
let strategy = 'FIFO';
let tick = 0;

let score = 0;
let hits = 0;
let misses = 0;

function initGame() {
    queue = Array.from({length: 6}, () => Math.floor(Math.random() * 9) + 1);
    cache = [];
    tick = 0;
    render();
}

function setStrategy(s) {
    strategy = s;
    // Update active button layout styles
    document.querySelectorAll('#strategy-selector button').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${s.toLowerCase()}`).classList.add('active');
    
    updateStatus(`Strategy switched to running logic profile: ${s}`);
    
    // Fixed: Forces an immediate visual update of metadata labels mid-game
    render(); 
}

function processNextRequest() {
    if (queue.length === 0) return;
    tick++;
    
    const req = queue.shift();
    const existingIndex = cache.findIndex(item => item.value === req);

    if (existingIndex !== -1) {
        // Cache Hit
        hits++;
        score += 10;
        cache[existingIndex].lastAccessed = tick;
        cache[existingIndex].frequency++;
        updateStatus(`HIT! Data Packet [${req}] found inside cache line storage location.`);
        triggerFlash(existingIndex, 'hit');
    } else {
        // Cache Miss
        misses++;
        score = Math.max(0, score - 5);
        updateStatus(`MISS! Data Packet [${req}] not allocated. Fetching from Main Storage Memory...`);

        const newBlock = {
            value: req,
            insertedAt: tick,
            lastAccessed: tick,
            frequency: 1
        };

        if (cache.length >= cacheLimit) {
            evictAndInsert(newBlock);
        } else {
            cache.push(newBlock);
        }
    }

    // Add a new random packet to the tail of the conveyor belt queue
    queue.push(Math.floor(Math.random() * 9) + 1);
    render();
}

function evictAndInsert(newBlock) {
    let targetIndex = 0;

    if (strategy === 'FIFO') {
        let oldest = Infinity;
        for (let i = 0; i < cache.length; i++) {
            if (cache[i].insertedAt < oldest) {
                oldest = cache[i].insertedAt;
                targetIndex = i;
            }
        }
    } else if (strategy === 'LRU') {
        let leastRecent = Infinity;
        for (let i = 0; i < cache.length; i++) {
            if (cache[i].lastAccessed < leastRecent) {
                leastRecent = cache[i].lastAccessed;
                targetIndex = i;
            }
        }
    } else if (strategy === 'LFU') {
        let lowestFreq = Infinity;
        for (let i = 0; i < cache.length; i++) {
            if (cache[i].frequency < lowestFreq) {
                lowestFreq = cache[i].frequency;
                targetIndex = i;
            }
        }
    }

    const evicted = cache[targetIndex].value;
    updateStatus(`CACHE FULL! Evicting Data Packet [${evicted}] via policy scheme context rules. Added Packet [${newBlock.value}].`);
    cache[targetIndex] = newBlock;
    triggerFlash(targetIndex, 'miss');
}

function triggerFlash(index, type) {
    setTimeout(() => {
        const elements = document.querySelectorAll('#cache-container .block');
        if (elements[index]) {
            elements[index].classList.add(type);
        }
    }, 50);
}

function updateStatus(msg) {
    document.getElementById('status-feed').innerText = msg;
}

function render() {
    // Update Score Board Data Parameters
    document.getElementById('score').innerText = score;
    document.getElementById('hits').innerText = hits;
    document.getElementById('misses').innerText = misses;

    // Render Conveyor Belt Line Elements
    const qContainer = document.getElementById('queue-container');
    qContainer.innerHTML = queue.map(val => `<div class="block">${val}</div>`).join('');

    // Render Cache Storage Matrices
    const cContainer = document.getElementById('cache-container');
    cContainer.innerHTML = cache.map(item => {
        let metaVal = '';
        if (strategy === 'FIFO') metaVal = `t:${item.insertedAt}`;
        if (strategy === 'LRU') metaVal = `rec:${item.lastAccessed}`;
        if (strategy === 'LFU') metaVal = `f:${item.frequency}`;
        return `<div class="block">${item.value}<span class="meta">${metaVal}</span></div>`;
    }).join('');
    
    // Keep structural slot layouts intact when cache array is partially empty
    for(let i = cache.length; i < cacheLimit; i++) {
        cContainer.innerHTML += `<div class="block" style="opacity: 0.25; border-style: dashed;">-</div>`;
    }
}

function resetGame() {
    score = 0; 
    hits = 0; 
    misses = 0;
    initGame();
    updateStatus("Cache memory pipelines flushed. Performance analytics wiped back to zero parameters.");
}

// Fire up core simulation cycles upon window registration load paths
window.onload = initGame;
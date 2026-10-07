/**
 * Pathfinding Algorithm Visualizer
 */

// --- Settings Management ---
const DEFAULTS = {
    startColor: '#00ffcc',
    endColor: '#ff0055',
    wallColor: '#334155',
    pathColor: '#ffff00',
    visitedColor: '#00a8ff',
    animations: true
};

function getSetting(key) {
    const val = localStorage.getItem('pf_' + key);
    if (val === null) return DEFAULTS[key];
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
}

function setSetting(key, value) {
    localStorage.setItem('pf_' + key, value);
}

function applySettings() {
    document.documentElement.style.setProperty('--color-start', getSetting('startColor'));
    document.documentElement.style.setProperty('--color-end', getSetting('endColor'));
    document.documentElement.style.setProperty('--color-wall', getSetting('wallColor'));
    document.documentElement.style.setProperty('--color-path', getSetting('pathColor'));
    document.documentElement.style.setProperty('--color-visited', getSetting('visitedColor'));
    
    if(getSetting('animations')) {
        document.body.classList.add('enable-animations');
    } else {
        document.body.classList.remove('enable-animations');
    }
}
applySettings();


// --- Settings Page Logic ---
if (window.location.pathname.includes('settings.html')) {
    const sStart = document.getElementById('setting-start-color');
    const sEnd = document.getElementById('setting-end-color');
    const sWall = document.getElementById('setting-wall-color');
    const sPath = document.getElementById('setting-path-color');
    const sVisited = document.getElementById('setting-visited-color');
    const sAnim = document.getElementById('setting-animations');

    sStart.value = getSetting('startColor');
    sEnd.value = getSetting('endColor');
    sWall.value = getSetting('wallColor');
    sPath.value = getSetting('pathColor');
    sVisited.value = getSetting('visitedColor');
    sAnim.checked = getSetting('animations');

    sStart.addEventListener('change', e => { setSetting('startColor', e.target.value); applySettings(); });
    sEnd.addEventListener('change', e => { setSetting('endColor', e.target.value); applySettings(); });
    sWall.addEventListener('change', e => { setSetting('wallColor', e.target.value); applySettings(); });
    sPath.addEventListener('change', e => { setSetting('pathColor', e.target.value); applySettings(); });
    sVisited.addEventListener('change', e => { setSetting('visitedColor', e.target.value); applySettings(); });
    sAnim.addEventListener('change', e => { setSetting('animations', e.target.checked); applySettings(); });
}


// --- Visualizer Logic ---
if (window.location.pathname.includes('visualizer.html')) {
    
    const gridContainer = document.getElementById('grid-container');
    const algoSelector = document.getElementById('algo-selector');
    const speedSelector = document.getElementById('speed-selector');
    const btnVisualize = document.getElementById('btn-visualize');
    const btnClearBoard = document.getElementById('btn-clear-board');
    const btnClearPath = document.getElementById('btn-clear-path');

    let grid = [];
    let rows = 21;
    let cols = 45;
    
    let START_NODE_ROW = 10;
    let START_NODE_COL = 10;
    let END_NODE_ROW = 10;
    let END_NODE_COL = 35;

    let isMousePressed = false;
    let isDraggingStart = false;
    let isDraggingEnd = false;
    let isRunning = false;

    // Node Class
    class Node {
        constructor(row, col) {
            this.row = row;
            this.col = col;
            this.isStart = row === START_NODE_ROW && col === START_NODE_COL;
            this.isEnd = row === END_NODE_ROW && col === END_NODE_COL;
            this.distance = Infinity;
            this.isVisited = false;
            this.isWall = false;
            this.previousNode = null;
            
            // For A*
            this.f = Infinity;
            this.g = Infinity;
            this.h = 0;
            
            // DOM Element mapping
            this.elementId = `node-${row}-${col}`;
        }
    }

    // Initialize Grid
    function initializeGrid() {
        grid = [];
        gridContainer.innerHTML = '';
        
        // Setup CSS Grid Layout
        gridContainer.innerHTML = `<div class="grid" id="grid" style="grid-template-columns: repeat(${cols}, 25px);"></div>`;
        const gridElement = document.getElementById('grid');

        for (let r = 0; r < rows; r++) {
            let currentRow = [];
            for (let c = 0; c < cols; c++) {
                const node = new Node(r, c);
                currentRow.push(node);
                
                // Create DOM element
                const domNode = document.createElement('div');
                domNode.id = node.elementId;
                domNode.className = 'node';
                if (node.isStart) domNode.classList.add('is-start');
                if (node.isEnd) domNode.classList.add('is-end');
                
                // Event Listeners for Interaction
                domNode.addEventListener('mousedown', () => handleMouseDown(r, c));
                domNode.addEventListener('mouseenter', () => handleMouseEnter(r, c));
                domNode.addEventListener('mouseup', () => handleMouseUp());
                
                gridElement.appendChild(domNode);
            }
            grid.push(currentRow);
        }
    }

    gridContainer.addEventListener('mouseleave', () => { isMousePressed = false; });

    // Interaction Handlers
    function handleMouseDown(row, col) {
        if (isRunning) return;
        isMousePressed = true;
        const node = grid[row][col];
        
        if (node.isStart) {
            isDraggingStart = true;
        } else if (node.isEnd) {
            isDraggingEnd = true;
        } else {
            toggleWall(row, col);
        }
    }

    function handleMouseEnter(row, col) {
        if (!isMousePressed || isRunning) return;
        
        const node = grid[row][col];
        
        if (isDraggingStart && !node.isEnd && !node.isWall) {
            updateStartNode(row, col);
        } else if (isDraggingEnd && !node.isStart && !node.isWall) {
            updateEndNode(row, col);
        } else if (!isDraggingStart && !isDraggingEnd && !node.isStart && !node.isEnd) {
            toggleWall(row, col);
        }
    }

    function handleMouseUp() {
        isMousePressed = false;
        isDraggingStart = false;
        isDraggingEnd = false;
    }

    function toggleWall(row, col) {
        const node = grid[row][col];
        node.isWall = !node.isWall;
        const el = document.getElementById(node.elementId);
        if (node.isWall) el.classList.add('is-wall');
        else el.classList.remove('is-wall');
    }

    function updateStartNode(r, c) {
        // Clear old
        const oldStart = grid[START_NODE_ROW][START_NODE_COL];
        oldStart.isStart = false;
        document.getElementById(oldStart.elementId).classList.remove('is-start');
        
        // Set new
        START_NODE_ROW = r;
        START_NODE_COL = c;
        grid[r][c].isStart = true;
        document.getElementById(grid[r][c].elementId).classList.add('is-start');
    }

    function updateEndNode(r, c) {
        // Clear old
        const oldEnd = grid[END_NODE_ROW][END_NODE_COL];
        oldEnd.isEnd = false;
        document.getElementById(oldEnd.elementId).classList.remove('is-end');
        
        // Set new
        END_NODE_ROW = r;
        END_NODE_COL = c;
        grid[r][c].isEnd = true;
        document.getElementById(grid[r][c].elementId).classList.add('is-end');
    }

    // Helper: Reset Path logic
    function clearPath(keepWalls = true) {
        if(isRunning) return;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let node = grid[r][c];
                node.isVisited = false;
                node.distance = Infinity;
                node.previousNode = null;
                node.f = Infinity;
                node.g = Infinity;
                node.h = 0;
                
                if(!keepWalls) {
                    node.isWall = false;
                }
                
                const el = document.getElementById(node.elementId);
                el.classList.remove('is-visited', 'is-path');
                if(!keepWalls) el.classList.remove('is-wall');
            }
        }
    }

    // Async Sleep
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getDelay() {
        const speed = speedSelector.value;
        if(speed === 'fast') return 5;
        if(speed === 'average') return 25;
        if(speed === 'slow') return 100;
        return 20;
    }

    // Get unvisited neighbors
    function getUnvisitedNeighbors(node, gridObj) {
        const neighbors = [];
        const {col, row} = node;
        if (row > 0) neighbors.push(gridObj[row - 1][col]);
        if (row < rows - 1) neighbors.push(gridObj[row + 1][col]);
        if (col > 0) neighbors.push(gridObj[row][col - 1]);
        if (col < cols - 1) neighbors.push(gridObj[row][col + 1]);
        return neighbors.filter(n => !n.isVisited && !n.isWall);
    }

    // Animate Shortest Path
    async function animateShortestPath(endNode) {
        const nodesInShortestPathOrder = [];
        let currentNode = endNode;
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }

        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            const node = nodesInShortestPathOrder[i];
            if(!node.isStart && !node.isEnd) {
                document.getElementById(node.elementId).classList.add('is-path');
                document.getElementById(node.elementId).classList.remove('is-visited'); // swap animation
            }
            await sleep(25);
        }
    }

    // --- Algorithms ---

    // 1. Dijkstra
    async function dijkstra() {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[END_NODE_ROW][END_NODE_COL];
        startNode.distance = 0;
        
        const unvisitedNodes = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                unvisitedNodes.push(grid[r][c]);
            }
        }

        while (!!unvisitedNodes.length) {
            // Sort by distance (inefficient for large graphs but fine here, min-heap is better)
            unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
            const closestNode = unvisitedNodes.shift();

            if (closestNode.isWall) continue;
            
            // If closest is infinity, we're trapped
            if (closestNode.distance === Infinity) break;

            closestNode.isVisited = true;
            if(!closestNode.isStart && !closestNode.isEnd) {
                document.getElementById(closestNode.elementId).classList.add('is-visited');
                await sleep(getDelay());
            }

            if (closestNode === endNode) return true;

            const neighbors = getUnvisitedNeighbors(closestNode, grid);
            for (const neighbor of neighbors) {
                neighbor.distance = closestNode.distance + 1;
                neighbor.previousNode = closestNode;
            }
        }
        return false;
    }

    // 2. Breadth-First Search
    async function bfs() {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[END_NODE_ROW][END_NODE_COL];
        let queue = [startNode];
        startNode.isVisited = true;

        while (queue.length > 0) {
            let currentNode = queue.shift();

            if (currentNode === endNode) return true;

            if(!currentNode.isStart && !currentNode.isEnd) {
                document.getElementById(currentNode.elementId).classList.add('is-visited');
                await sleep(getDelay());
            }

            let neighbors = getUnvisitedNeighbors(currentNode, grid);
            for (let neighbor of neighbors) {
                neighbor.isVisited = true;
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
        return false;
    }

    // 3. A* Search
    async function astar() {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[END_NODE_ROW][END_NODE_COL];
        
        let openSet = [startNode];
        startNode.g = 0;
        startNode.f = heuristic(startNode, endNode);

        while (openSet.length > 0) {
            
            // Find node with lowest f
            let lowestIdx = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIdx].f) lowestIdx = i;
            }
            let current = openSet[lowestIdx];

            if (current === endNode) return true;

            // Remove from openSet
            openSet.splice(lowestIdx, 1);
            current.isVisited = true;

            if(!current.isStart && !current.isEnd) {
                document.getElementById(current.elementId).classList.add('is-visited');
                await sleep(getDelay());
            }

            let neighbors = getUnvisitedNeighbors(current, grid);
            for (let neighbor of neighbors) {
                let tempG = current.g + 1; // edge weight 1
                
                // If this new path is shorter
                if (tempG < neighbor.g) {
                    neighbor.previousNode = current;
                    neighbor.g = tempG;
                    neighbor.h = heuristic(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        return false;
    }

    // Manhattan distance
    function heuristic(nodeA, nodeB) {
        let d1 = Math.abs(nodeA.row - nodeB.row);
        let d2 = Math.abs(nodeA.col - nodeB.col);
        return d1 + d2;
    }

    // Main Run function
    async function runAlgorithm() {
        if (isRunning) return;
        isRunning = true;
        clearPath(true); // Keep walls, clear logic

        const algo = algoSelector.value;
        let success = false;
        
        if (algo === 'dijkstra') success = await dijkstra();
        else if (algo === 'bfs') success = await bfs();
        else if (algo === 'astar') success = await astar();

        if (success) {
            const endNode = grid[END_NODE_ROW][END_NODE_COL];
            await animateShortestPath(endNode);
        } else {
            // Optional: alert no path found
        }
        isRunning = false;
    }

    // Bindings
    btnVisualize.addEventListener('click', runAlgorithm);
    btnClearBoard.addEventListener('click', () => { clearPath(false); });
    btnClearPath.addEventListener('click', () => { clearPath(true); });

    // Boot
    initializeGrid();
}

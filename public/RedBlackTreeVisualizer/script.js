// Constants
const DELAY = 800; // Base animation delay in ms
let animationQueue = [];
let isAnimating = false;

// DOM Elements
const nodeInput = document.getElementById('node-value');
const insertBtn = document.getElementById('insert-btn');
const randomBtn = document.getElementById('random-btn');
const clearBtn = document.getElementById('clear-btn');
const logList = document.getElementById('log-list');
const nodesContainer = document.getElementById('nodes-container');
const edgesSvg = document.getElementById('edges-svg');
const speedSlider = document.getElementById('speed-slider');

// RBT Node structure
class Node {
    constructor(val) {
        this.val = val;
        this.color = 'red'; // New nodes are always red initially
        this.left = null;
        this.right = null;
        this.parent = null;
        this.x = 0;
        this.y = 0;
        this.id = `node-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Red-Black Tree Class
class RedBlackTree {
    constructor() {
        this.root = null;
    }

    insert(val) {
        let node = new Node(val);
        let y = null;
        let x = this.root;

        while (x !== null) {
            y = x;
            if (node.val < x.val) {
                x = x.left;
            } else if (node.val > x.val) {
                x = x.right;
            } else {
                log(`Value ${val} already exists in the tree.`, 'warning');
                return; // No duplicates
            }
        }

        node.parent = y;
        if (y === null) {
            this.root = node;
        } else if (node.val < y.val) {
            y.left = node;
        } else {
            y.right = node;
        }

        log(`Inserted ${val} (Red)`);
        queueRender(`Inserted ${val}`);
        this.insertFixup(node);
    }

    insertFixup(k) {
        while (k.parent !== null && k.parent.color === 'red') {
            if (k.parent === k.parent.parent.left) {
                let u = k.parent.parent.right; // uncle
                if (u !== null && u.color === 'red') {
                    k.parent.color = 'black';
                    u.color = 'black';
                    k.parent.parent.color = 'red';
                    log(`Recolored nodes: Parent and Uncle become Black, Grandparent becomes Red.`);
                    queueRender('Recolor');
                    k = k.parent.parent;
                } else {
                    if (k === k.parent.right) {
                        k = k.parent;
                        this.leftRotate(k);
                    }
                    k.parent.color = 'black';
                    k.parent.parent.color = 'red';
                    this.rightRotate(k.parent.parent);
                }
            } else {
                let u = k.parent.parent.left; // uncle
                if (u !== null && u.color === 'red') {
                    k.parent.color = 'black';
                    u.color = 'black';
                    k.parent.parent.color = 'red';
                    log(`Recolored nodes: Parent and Uncle become Black, Grandparent becomes Red.`);
                    queueRender('Recolor');
                    k = k.parent.parent;
                } else {
                    if (k === k.parent.left) {
                        k = k.parent;
                        this.rightRotate(k);
                    }
                    k.parent.color = 'black';
                    k.parent.parent.color = 'red';
                    this.leftRotate(k.parent.parent);
                }
            }
        }
        if (this.root.color !== 'black') {
            this.root.color = 'black';
            log(`Root forced to Black to maintain properties.`);
            queueRender('Force Root Black');
        }
    }

    leftRotate(x) {
        let y = x.right;
        x.right = y.left;
        if (y.left !== null) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
        log(`Left Rotation on node ${x.val}`);
        queueRender('Left Rotation');
    }

    rightRotate(x) {
        let y = x.left;
        x.left = y.right;
        if (y.right !== null) {
            y.right.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }
        y.right = x;
        x.parent = y;
        log(`Right Rotation on node ${x.val}`);
        queueRender('Right Rotation');
    }
}

const tree = new RedBlackTree();

// Helper to log actions
function log(msg, type = 'info') {
    animationQueue.push({ action: 'log', msg: msg });
}

// Deep copy tree for animation frame
function cloneTree(node) {
    if (!node) return null;
    return {
        val: node.val,
        color: node.color,
        id: node.id,
        left: cloneTree(node.left),
        right: cloneTree(node.right)
    };
}

function queueRender(reason) {
    animationQueue.push({
        action: 'render',
        treeState: cloneTree(tree.root)
    });
}

// UI rendering functions
function calculatePositions(node, x, y, dx) {
    if (!node) return;
    node.x = x;
    node.y = y;
    calculatePositions(node.left, x - dx, y + 60, dx / 2);
    calculatePositions(node.right, x + dx, y + 60, dx / 2);
}

function renderTreeState(root) {
    nodesContainer.innerHTML = '';
    edgesSvg.innerHTML = '';

    if (!root) return;

    const containerWidth = document.querySelector('.visualization-area').clientWidth;
    calculatePositions(root, containerWidth / 2, 40, containerWidth / 4);

    drawNodeAndEdges(root);
}

function drawNodeAndEdges(node) {
    if (!node) return;

    // Draw edges
    if (node.left) {
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.left.x);
        line.setAttribute('y2', node.left.y);
        edgesSvg.appendChild(line);
        drawNodeAndEdges(node.left);
    }
    if (node.right) {
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.right.x);
        line.setAttribute('y2', node.right.y);
        edgesSvg.appendChild(line);
        drawNodeAndEdges(node.right);
    }

    // Draw node
    let el = document.createElement('div');
    el.className = `tree-node ${node.color}`;
    el.innerText = node.val;
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;
    nodesContainer.appendChild(el);
}

// Animation Engine
async function processQueue() {
    if (isAnimating || animationQueue.length === 0) return;
    isAnimating = true;

    while (animationQueue.length > 0) {
        let step = animationQueue.shift();
        
        if (step.action === 'log') {
            let li = document.createElement('li');
            li.innerText = step.msg;
            logList.appendChild(li);
            logList.parentElement.scrollTop = logList.parentElement.scrollHeight;
        } else if (step.action === 'render') {
            renderTreeState(step.treeState);
            let speedStr = speedSlider.value;
            let currentDelay = DELAY / parseInt(speedStr);
            await new Promise(r => setTimeout(r, currentDelay));
        }
    }
    isAnimating = false;
}

// Event Listeners
insertBtn.addEventListener('click', () => {
    let val = parseInt(nodeInput.value);
    if (!isNaN(val)) {
        tree.insert(val);
        nodeInput.value = '';
        processQueue();
    }
});

randomBtn.addEventListener('click', () => {
    let val = Math.floor(Math.random() * 100) + 1;
    tree.insert(val);
    processQueue();
});

clearBtn.addEventListener('click', () => {
    tree.root = null;
    animationQueue = [];
    isAnimating = false;
    logList.innerHTML = '<li>Tree cleared.</li>';
    renderTreeState(null);
});

nodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') insertBtn.click();
});

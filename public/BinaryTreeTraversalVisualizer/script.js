document.addEventListener('DOMContentLoaded', () => {
    const nodesContainer = document.getElementById('nodes-container');
    const edgesSvg = document.getElementById('edges-svg');
    const outputBox = document.getElementById('traversal-output');
    const speedSlider = document.getElementById('speed-slider');
    const nodeValueInput = document.getElementById('node-value');
    const btnInsert = document.getElementById('btn-insert');
    const btnPre = document.getElementById('btn-pre');
    const btnIn = document.getElementById('btn-in');
    const btnPost = document.getElementById('btn-post');
    const btnReset = document.getElementById('btn-reset');

    let isTraversing = false;
    let tree = null;

    // --- BST Insertion ---
    function insertNode(val) {
        if (!tree) {
            tree = { value: val, x: 50, y: 12, id: `n${val}`, left: null, right: null };
        } else {
            insertBST(tree, val, 50, 12, 22);
        }
        drawTree();
    }

    function insertBST(node, val, x, y, offset) {
        if (val === node.value) return; // no duplicates
        if (val < node.value) {
            if (!node.left) node.left = { value: val, x: x - offset, y: y + 18, id: `n${val}`, left: null, right: null };
            else insertBST(node.left, val, x - offset, y + 18, offset / 1.8);
        } else {
            if (!node.right) node.right = { value: val, x: x + offset, y: y + 18, id: `n${val}`, left: null, right: null };
            else insertBST(node.right, val, x + offset, y + 18, offset / 1.8);
        }
    }

    // --- Drawing ---
    function drawTree() {
        nodesContainer.innerHTML = '';
        edgesSvg.innerHTML = '';
        renderNode(tree);
    }

    function renderNode(node) {
        if (!node) return;
        if (node.left) { drawEdge(node, node.left); renderNode(node.left); }
        if (node.right) { drawEdge(node, node.right); renderNode(node.right); }
        const div = document.createElement('div');
        div.className = 'node';
        div.id = node.id;
        div.innerText = node.value;
        div.style.left = `${node.x}%`;
        div.style.top = `${node.y}%`;
        nodesContainer.appendChild(div);
    }

    function drawEdge(parent, child) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${parent.x}%`); line.setAttribute('y1', `${parent.y}%`);
        line.setAttribute('x2', `${child.x}%`); line.setAttribute('y2', `${child.y}%`);
        line.setAttribute('class', 'edge');
        line.setAttribute('id', `edge-${parent.id}-${child.id}`);
        edgesSvg.appendChild(line);
    }

    // --- Animation Helpers ---
    const sleep = () => new Promise(r => setTimeout(r, 2000 / parseInt(speedSlider.value)));

    function disableButtons(state) {
        isTraversing = state;
        [btnPre, btnIn, btnPost, btnInsert, speedSlider, nodeValueInput].forEach(el => el.disabled = state);
    }

    function resetVisuals() {
        document.querySelectorAll('.node').forEach(n => n.classList.remove('active', 'visited'));
        document.querySelectorAll('.edge').forEach(e => e.classList.remove('active'));
        outputBox.innerText = 'Insert nodes and select a traversal to begin...';
    }

    async function visit(id) {
        const el = document.getElementById(id);
        el.classList.remove('visited');
        el.classList.add('active');
        await sleep();
    }

    async function extract(id) {
        const el = document.getElementById(id);
        el.classList.remove('active');
        el.classList.add('visited');
        const val = el.innerText;
        outputBox.innerText = outputBox.innerText.includes('[') ? outputBox.innerText + `, ${val}` : `[ ${val}`;
        await sleep();
    }

    async function unvisit(id) {
        const el = document.getElementById(id);
        if (!el.classList.contains('visited')) el.classList.remove('active');
    }

    async function setEdge(id, on) {
        const el = document.getElementById(id);
        if (el) on ? el.classList.add('active') : el.classList.remove('active');
    }

    // --- Traversal Algorithms ---
    async function preOrder(node) {
        if (!node || !isTraversing) return;
        await visit(node.id); await extract(node.id);
        if (node.left && isTraversing) {
            await setEdge(`edge-${node.id}-${node.left.id}`, true);
            await preOrder(node.left);
            await setEdge(`edge-${node.id}-${node.left.id}`, false);
            await visit(node.id); await unvisit(node.id);
        }
        if (node.right && isTraversing) {
            await setEdge(`edge-${node.id}-${node.right.id}`, true);
            await preOrder(node.right);
            await setEdge(`edge-${node.id}-${node.right.id}`, false);
            await visit(node.id); await unvisit(node.id);
        }
    }

    async function inOrder(node) {
        if (!node || !isTraversing) return;
        await visit(node.id);
        if (node.left && isTraversing) {
            await setEdge(`edge-${node.id}-${node.left.id}`, true);
            await inOrder(node.left);
            await setEdge(`edge-${node.id}-${node.left.id}`, false);
            await visit(node.id);
        }
        if (isTraversing) await extract(node.id);
        if (node.right && isTraversing) {
            await setEdge(`edge-${node.id}-${node.right.id}`, true);
            await inOrder(node.right);
            await setEdge(`edge-${node.id}-${node.right.id}`, false);
            await visit(node.id); await unvisit(node.id);
        } else { await unvisit(node.id); }
    }

    async function postOrder(node) {
        if (!node || !isTraversing) return;
        await visit(node.id);
        if (node.left && isTraversing) {
            await setEdge(`edge-${node.id}-${node.left.id}`, true);
            await postOrder(node.left);
            await setEdge(`edge-${node.id}-${node.left.id}`, false);
            await visit(node.id);
        }
        if (node.right && isTraversing) {
            await setEdge(`edge-${node.id}-${node.right.id}`, true);
            await postOrder(node.right);
            await setEdge(`edge-${node.id}-${node.right.id}`, false);
            await visit(node.id);
        }
        if (isTraversing) { await extract(node.id); await unvisit(node.id); }
    }

    async function startTraversal(type) {
        if (!tree) { outputBox.innerText = '⚠️ Tree is empty! Please insert some nodes first.'; return; }
        resetVisuals();
        disableButtons(true);
        outputBox.innerText = '[ ';
        if (type === 'pre') await preOrder(tree);
        else if (type === 'in') await inOrder(tree);
        else await postOrder(tree);
        if (isTraversing) outputBox.innerText += ' ] ✅ Done!';
        disableButtons(false);
    }

    // --- Event Listeners ---
    btnInsert.addEventListener('click', () => {
        const val = parseInt(nodeValueInput.value);
        if (!isNaN(val)) { insertNode(val); nodeValueInput.value = ''; nodeValueInput.focus(); resetVisuals(); }
    });
    nodeValueInput.addEventListener('keypress', e => { if (e.key === 'Enter') btnInsert.click(); });
    btnPre.addEventListener('click', () => startTraversal('pre'));
    btnIn.addEventListener('click', () => startTraversal('in'));
    btnPost.addEventListener('click', () => startTraversal('post'));
    btnReset.addEventListener('click', () => {
        isTraversing = false; tree = null; drawTree();
        outputBox.innerText = 'Tree cleared. Insert nodes to start!';
        disableButtons(false);
    });
});

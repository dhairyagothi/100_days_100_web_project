// --- BIOINFORMATICS COMPILER HOOKS ---
const seqAInput = document.getElementById('seq-a');
const seqBInput = document.getElementById('seq-b');
const matchInput = document.getElementById('score-match');
const mismatchInput = document.getElementById('score-mismatch');
const gapInput = document.getElementById('score-gap');
const btnAlign = document.getElementById('btn-align');

const outSeqA = document.getElementById('output-seq-a');
const outMatch = document.getElementById('output-match-line');
const outSeqB = document.getElementById('output-seq-b');

const metricScore = document.getElementById('metric-score');
const metricIdentity = document.getElementById('metric-identity');
const metricGaps = document.getElementById('metric-gaps');
const gridWrapper = document.getElementById('matrix-grid-wrapper');

// --- NEEDLEMAN-WUNSCH CORE COMPILER ALGORITHM ---
function runGenomicAlignment() {
    const seqA = seqAInput.value.toUpperCase().trim();
    const seqB = seqBInput.value.toUpperCase().trim();

    const MATCH = parseInt(matchInput.value);
    const MISMATCH = parseInt(mismatchInput.value);
    const GAP = parseInt(gapInput.value);

    const rows = seqB.length + 1;
    const cols = seqA.length + 1;

    // 1. Initialize Dynamic Programming Grid Matrix
    let matrix = Array(rows).fill(null).map(() => Array(cols).fill(0));

    for (let i = 0; i <= rows - 1; i++) matrix[i][0] = i * GAP;
    for (let j = 0; j <= cols - 1; j++) matrix[0][j] = j * GAP;

    // 2. Score Matrix Filling Pass
    for (let i = 1; i <= rows - 1; i++) {
        for (let j = 1; j <= cols - 1; j++) {
            let scoreDiag = matrix[i - 1][j - 1] + (seqB[i - 1] === seqA[j - 1] ? MATCH : MISMATCH);
            let scoreLeft = matrix[i][j - 1] + GAP;
            let scoreUp = matrix[i - 1][j] + GAP;

            matrix[i][j] = Math.max(scoreDiag, scoreLeft, scoreUp);
        }
    }

    // 3. Traceback Routing Loop
    let alignA = "";
    let alignB = "";
    let i = rows - 1;
    let j = cols - 1;
    let pathCoordinates = new Set();
    pathCoordinates.add(`${i},${j}`);

    while (i > 0 || j > 0) {
        pathCoordinates.add(`${i},${j}`);

        if (i > 0 && j > 0 && (matrix[i][j] === matrix[i - 1][j - 1] + (seqB[i - 1] === seqA[j - 1] ? MATCH : MISMATCH))) {
            alignA = seqA[j - 1] + alignA;
            alignB = seqB[i - 1] + alignB;
            i--; j--;
        } else if (j > 0 && (matrix[i][j] === matrix[i][j - 1] + GAP)) {
            alignA = seqA[j - 1] + alignA;
            alignB = "-" + alignB;
            j--;
        } else {
            alignA = "-" + alignA;
            alignB = seqB[i - 1] + alignB;
            i--;
        }
    }
    pathCoordinates.add("0,0");

    // 4. Calculate Final Analytics State Matrices
    let matchLine = "";
    let identityCount = 0;
    let totalGaps = 0;

    for (let k = 0; k < alignA.length; k++) {
        if (alignA[k] === alignB[k]) {
            matchLine += "|";
            identityCount++;
        } else if (alignA[k] === "-" || alignB[k] === "-") {
            matchLine += " ";
            totalGaps++;
        } else {
            matchLine += ".";
        }
    }

    // 5. Update UI Analytics Panels
    outSeqA.textContent = alignA;
    outMatch.textContent = matchLine;
    outSeqB.textContent = alignB;

    metricScore.textContent = matrix[rows - 1][cols - 1];
    metricIdentity.textContent = ((identityCount / alignA.length) * 100).toFixed(1) + "%";
    metricGaps.textContent = totalGaps;

    renderHeatmapGrid(matrix, seqA, seqB, pathCoordinates);
}

// --- INTERACTIVE DOM MATRIX HEATMAP GENERATOR ---
function renderHeatmapGrid(matrix, seqA, seqB, pathCoordinates) {
    const rows = seqB.length + 1;
    const cols = seqA.length + 1;

    // Set layout dimensions dynamically based on input length
    gridWrapper.style.gridTemplateColumns = `repeat(${cols + 2}, 50px)`;
    gridWrapper.innerHTML = "";

    // Row 1 Header: Top padding offsets
    gridWrapper.appendChild(createCell("", "header-cell"));
    gridWrapper.appendChild(createCell("", "header-cell"));
    for (let j = 0; j < seqA.length; j++) {
        gridWrapper.appendChild(createCell(seqA[j], "header-cell"));
    }

    // Populate inner values grid cells
    for (let i = 0; i <= rows - 1; i++) {
        // Left Column Headers
        if (i === 0) {
            gridWrapper.appendChild(createCell("", "header-cell"));
        } else {
            gridWrapper.appendChild(createCell(seqB[i - 1], "header-cell"));
        }

        gridWrapper.appendChild(createCell(i === 0 ? "-" : "", "header-cell"));

        // Value elements loading loops
        for (let j = 0; j <= cols - 1; j++) {
            let cellClass = "";
            if (pathCoordinates.has(`${i},${j}`)) {
                cellClass = "trace-path";
            }
            gridWrapper.appendChild(createCell(matrix[i][j], cellClass));
        }
    }
}

function createCell(content, className) {
    const cell = document.createElement('div');
    cell.className = `matrix-cell ${className}`;
    cell.textContent = content;
    return cell;
}

// Initialize compiler operations on load
btnAlign.addEventListener('click', runGenomicAlignment);
runGenomicAlignment();
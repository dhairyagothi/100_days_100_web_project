// Import the ESM version of docx.js for document creation
import * as docx from 'https://cdn.jsdelivr.net/npm/docx@9.7.1/+esm';

// Set up PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */
const state = {
    queue: [],
    isProcessing: false,
    activePreviewFileId: null
};

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const themeToggle = document.getElementById('theme-toggle');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const queueContainer = document.getElementById('queue-container');
const queueCount = document.getElementById('queue-count');
const fileQueue = document.getElementById('file-queue');
const clearQueueBtn = document.getElementById('clear-queue-btn');
const toastContainer = document.getElementById('toast-container');

// Settings Elements
const modeFlow = document.getElementById('mode-flow');
const modeImage = document.getElementById('mode-image');
const formattingGroup = document.getElementById('formatting-group');
const pageRangeInput = document.getElementById('page-range');
const preservePageBreaksCheck = document.getElementById('preserve-page-breaks');
const detectHeadingsCheck = document.getElementById('detect-headings');

// Preview Drawer Elements
const previewDrawer = document.getElementById('preview-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const previewFileName = document.getElementById('preview-file-name');
const editorArea = document.getElementById('editor-area');
const previewWordCount = document.getElementById('preview-word-count');
const drawerCancelBtn = document.getElementById('drawer-cancel-btn');
const drawerDownloadBtn = document.getElementById('drawer-download-btn');

/* ==========================================================================
   THEME TOGGLE SYSTEM
   ========================================================================== */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme} theme`, 'info');
});

/* ==========================================================================
   NOTIFICATION SYSTEM (TOASTS)
   ========================================================================== */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    if (type === 'danger') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>
    `;

    toastContainer.appendChild(toast);

    // Close on button click
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'toast-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse forwards';
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}

/* ==========================================================================
   INTERACTIVE SETTINGS CONTROLS
   ========================================================================== */
function updateSettingsVisibility() {
    const mode = modeFlow.checked ? 'flow' : 'image';
    if (mode === 'flow') {
        formattingGroup.classList.remove('hidden');
    } else {
        formattingGroup.classList.add('hidden');
    }
}

modeFlow.addEventListener('change', updateSettingsVisibility);
modeImage.addEventListener('change', updateSettingsVisibility);

/* ==========================================================================
   QUEUE MANAGEMENT
   ========================================================================== */
function addFilesToQueue(fileList) {
    let addedCount = 0;
    Array.from(fileList).forEach(file => {
        if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
            showToast(`Skipped "${file.name}" (not a PDF file)`, 'danger');
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            showToast(`"${file.name}" exceeds the 50MB file size limit`, 'warning');
            return;
        }

        const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const queueItem = {
            id: fileId,
            file: file,
            name: file.name,
            size: formatBytes(file.size),
            status: 'queued',
            progress: 0,
            pageCount: 0,
            extractedStructure: null,
            downloadBlob: null,
            conversionSettings: {}
        };

        state.queue.push(queueItem);
        addedCount++;
    });

    if (addedCount > 0) {
        showToast(`Added ${addedCount} file(s) to the conversion queue.`, 'success');
        renderQueue();
        processQueue();
    }
}

function renderQueue() {
    if (state.queue.length === 0) {
        queueContainer.classList.add('hidden');
        return;
    }

    queueContainer.classList.remove('hidden');
    queueCount.textContent = state.queue.length;
    fileQueue.innerHTML = '';

    state.queue.forEach(item => {
        const fileRow = document.createElement('div');
        fileRow.className = `file-item ${item.status}`;
        fileRow.id = item.id;

        let statusText = 'Waiting...';
        if (item.status === 'converting') statusText = `Converting (${item.progress}%)`;
        if (item.status === 'completed') statusText = 'Ready to Download';
        if (item.status === 'failed') statusText = 'Failed';

        const isCompleted = item.status === 'completed';
        const isConverting = item.status === 'converting';

        fileRow.innerHTML = `
            <div class="file-item-main">
                <div class="file-info-group">
                    <div class="file-icon-box pdf">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div class="file-details">
                        <span class="file-name" title="${item.name}">${item.name}</span>
                        <div class="file-meta">
                            <span>${item.size}</span>
                            <span class="meta-dot"></span>
                            <span class="pages-count">${item.pageCount > 0 ? item.pageCount + ' pages' : 'calculating...'}</span>
                        </div>
                    </div>
                </div>

                <div class="file-actions">
                    <span class="status-badge ${item.status}">${statusText}</span>
                    
                    ${isCompleted && item.extractedStructure && item.conversionSettings.mode === 'flow' ? `
                        <button class="action-btn preview-trigger" title="Preview Extracted Text">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    ` : ''}

                    ${isCompleted ? `
                        <button class="action-btn download-trigger" title="Download Word DOCX">
                            <i class="fa-solid fa-download"></i>
                        </button>
                    ` : ''}

                    <button class="action-btn delete-trigger" title="Remove from list" ${isConverting ? 'disabled' : ''}>
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            
            ${isConverting ? `
                <div class="file-progress-bar-container">
                    <div class="file-progress-bar" style="width: ${item.progress}%"></div>
                </div>
            ` : ''}
        `;

        // Event listeners for actions
        const previewBtn = fileRow.querySelector('.preview-trigger');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => openPreview(item.id));
        }

        const downloadBtn = fileRow.querySelector('.download-trigger');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => triggerDownload(item));
        }

        fileRow.querySelector('.delete-trigger').addEventListener('click', () => {
            state.queue = state.queue.filter(i => i.id !== item.id);
            renderQueue();
            showToast(`Removed "${item.name}"`, 'info');
        });

        fileQueue.appendChild(fileRow);
    });
}

function clearQueue() {
    state.queue = [];
    renderQueue();
    showToast('Queue cleared', 'info');
}

clearQueueBtn.addEventListener('click', clearQueue);

/* ==========================================================================
   DROPZONE & INPUT LISTENERS
   ========================================================================== */
dropzone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        addFilesToQueue(e.target.files);
        fileInput.value = ''; // Reset input so same file can be selected again
    }
});

// Drag and drop handlers
['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
    }, false);
});

dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        addFilesToQueue(files);
    }
});

/* ==========================================================================
   FONT MAPPING SYSTEM
   ========================================================================== */
function mapPDFFontToWord(pdfFontName) {
    if (!pdfFontName) return 'Calibri';
    
    // Clean subset prefix e.g., "ABCDEF+Arial-Bold" -> "Arial-Bold"
    const plusIdx = pdfFontName.indexOf('+');
    let name = plusIdx !== -1 ? pdfFontName.substring(plusIdx + 1) : pdfFontName;
    
    // Remove style suffixes to check font families e.g. "Arial,Bold" or "Arial-Bold"
    name = name.split('-')[0].split(',')[0].trim();
    const lower = name.toLowerCase();

    if (lower.includes('times') || lower.includes('serif') || lower.includes('roman') || lower.includes('georgia') || lower.includes('garamond') || lower.includes('cambria')) {
        if (lower.includes('georgia')) return 'Georgia';
        if (lower.includes('garamond')) return 'Garamond';
        if (lower.includes('cambria')) return 'Cambria';
        return 'Times New Roman';
    }
    
    if (lower.includes('courier') || lower.includes('mono') || lower.includes('consolas') || lower.includes('code') || lower.includes('monaco')) {
        if (lower.includes('consolas')) return 'Consolas';
        return 'Courier New';
    }
    
    if (lower.includes('calibri') || lower.includes('candara')) {
        if (lower.includes('candara')) return 'Candara';
        return 'Calibri';
    }

    if (lower.includes('helvetica') || lower.includes('arial') || lower.includes('sans') || lower.includes('tahoma') || lower.includes('verdana') || lower.includes('segoe')) {
        if (lower.includes('verdana')) return 'Verdana';
        if (lower.includes('tahoma')) return 'Tahoma';
        if (lower.includes('segoe')) return 'Segoe UI';
        return 'Arial';
    }

    // Default to the original cleaned font name, so if Word can read it, layout matches.
    return name || 'Calibri';
}

/* ==========================================================================
   CONVERSION PROCESS ENGINE
   ========================================================================== */
async function processQueue() {
    if (state.isProcessing) return;

    const item = state.queue.find(i => i.status === 'queued');
    if (!item) {
        state.isProcessing = false;
        return;
    }

    state.isProcessing = true;
    item.status = 'converting';
    item.progress = 5;
    renderQueue();

    try {
        const settings = {
            mode: modeFlow.checked ? 'flow' : 'image',
            pageRange: pageRangeInput.value,
            margins: 'normal', // Default Margins
            preservePageBreaks: preservePageBreaksCheck.checked,
            detectHeadings: detectHeadingsCheck.checked
        };
        item.conversionSettings = settings;

        // Step 1: Read File ArrayBuffer
        const arrayBuffer = await readFileAsArrayBuffer(item.file);
        item.progress = 15;
        renderQueue();

        // Step 2: Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        item.pageCount = pdfDoc.numPages;
        item.progress = 25;
        renderQueue();

        // Step 3: Resolve page range
        const pageRange = parsePageRange(settings.pageRange, pdfDoc.numPages);
        if (pageRange.length === 0) {
            throw new Error("Specified page range resulted in empty selection.");
        }

        // Step 4: Parse & process pages
        if (settings.mode === 'flow') {
            await processFlowableMode(item, pdfDoc, pageRange, settings);
        } else {
            await processImageMode(item, pdfDoc, pageRange, settings);
        }

        item.status = 'completed';
        item.progress = 100;
        showToast(`"${item.name}" converted successfully!`, 'success');
    } catch (err) {
        console.error("Conversion Error:", err);
        item.status = 'failed';
        showToast(`Failed to convert "${item.name}": ${err.message}`, 'danger');
    }

    renderQueue();
    state.isProcessing = false;
    
    // Process next item
    setTimeout(processQueue, 300);
}

/* ==========================================================================
   CONVERSION MODES IMPLEMENTATIONS
   ========================================================================== */

// --- MODE A: FLOWABLE TEXT ---
async function processFlowableMode(item, pdfDoc, pageRange, settings) {
    const pagesData = [];
    const totalPagesToProcess = pageRange.length;
    let pagesProcessed = 0;

    for (const pageNum of pageRange) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Core text processing & sorting
        const rawItems = textContent.items.filter(i => i.str.trim() !== '');
        let pageParagraphs = [];
        let averageFontSize = 11;

        if (rawItems.length > 0) {
            // Find average font size
            const fontSizes = rawItems.map(i => Math.abs(i.transform[3] || i.height || 11));
            averageFontSize = fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length;

            // Group by vertical Y coordinates (incorporating text scale tolerance)
            const linesMap = [];
            rawItems.forEach(textItem => {
                const y = textItem.transform[5];
                const fontSize = Math.abs(textItem.transform[3] || textItem.height || 11);
                const tolerance = fontSize * 0.45;

                let matchedLine = linesMap.find(line => Math.abs(line.y - y) < tolerance);
                if (matchedLine) {
                    matchedLine.items.push(textItem);
                } else {
                    linesMap.push({ y: y, items: [textItem] });
                }
            });

            // Sort lines top to bottom (Y descending in PDF space)
            linesMap.sort((a, b) => b.y - a.y);

            // Sort items inside lines horizontally (X ascending)
            linesMap.forEach(line => {
                line.items.sort((a, b) => a.transform[4] - b.transform[4]);
            });

            // Reconstruct text runs for each line
            const processedLines = linesMap.map(line => {
                const runs = [];
                let currentXEnd = null;
                
                line.items.forEach((item, index) => {
                    const x = item.transform[4];
                    const width = item.width;
                    const size = Math.abs(item.transform[3] || item.height || 11);
                    const font = mapPDFFontToWord(item.fontName);
                    
                    let isBold = false;
                    let isItalic = false;
                    const fontNameLower = (item.fontName || '').toLowerCase();
                    if (fontNameLower.includes('bold') || fontNameLower.includes('black') || fontNameLower.includes('heavy') || fontNameLower.includes('semibold') || fontNameLower.includes('w-700') || fontNameLower.includes('w-800')) {
                        isBold = true;
                    }
                    if (fontNameLower.includes('italic') || fontNameLower.includes('oblique')) {
                        isItalic = true;
                    }

                    let runText = item.str;
                    if (index > 0) {
                        const gap = x - currentXEnd;
                        const spaceWidth = size * 0.22;
                        if (gap > spaceWidth) {
                            runText = ' ' + runText;
                        }
                    }

                    runs.push({
                        text: runText,
                        fontSize: size,
                        isBold: isBold,
                        isItalic: isItalic,
                        font: font
                    });
                    
                    currentXEnd = x + width;
                });

                // Line text helper
                const lineText = runs.map(r => r.text).join('');
                const maxFontSize = runs.reduce((max, r) => Math.max(max, r.fontSize), 11);
                const hasBold = runs.some(r => r.isBold);
                const hasItalic = runs.some(r => r.isItalic);

                return {
                    text: lineText,
                    y: line.y,
                    fontSize: maxFontSize,
                    isBold: hasBold,
                    isItalic: hasItalic,
                    runs: runs
                };
            });

            // Group lines into paragraphs based on spacing gaps
            let currentPara = null;
            processedLines.forEach((line, index) => {
                const isHeading = settings.detectHeadings && (line.fontSize > averageFontSize * 1.25);
                const isList = settings.detectHeadings && /^\s*([•\-\*]|\d+\.)\s+/.test(line.text);
                
                let isBreak = false;
                if (index > 0) {
                    const prevLine = processedLines[index - 1];
                    const gap = prevLine.y - line.y;
                    const fontLimit = Math.max(prevLine.fontSize, line.fontSize);
                    const threshold = fontLimit * 1.75;
                    
                    if (gap > threshold || isHeading || isList || prevLine.isHeading || prevLine.isList) {
                        isBreak = true;
                    }
                }

                if (index === 0 || isBreak) {
                    if (currentPara) pageParagraphs.push(currentPara);
                    
                    let headingLevel = 0;
                    if (isHeading) {
                        headingLevel = line.fontSize > averageFontSize * 1.55 ? 1 : 2;
                    }

                    currentPara = {
                        text: line.text,
                        isHeading: isHeading,
                        headingLevel: headingLevel,
                        isList: isList,
                        fontSize: line.fontSize,
                        runs: [...line.runs]
                    };
                } else {
                    currentPara.text += ' ' + line.text;
                    // Add space to separate lines inside paragraph
                    const firstRun = line.runs[0];
                    if (firstRun && !firstRun.text.startsWith(' ')) {
                        firstRun.text = ' ' + firstRun.text;
                    }
                    currentPara.runs.push(...line.runs);
                }
            });
            if (currentPara) pageParagraphs.push(currentPara);
        }

        pagesData.push({
            pageNum: pageNum,
            paragraphs: pageParagraphs,
            isEmpty: pageParagraphs.length === 0
        });

        pagesProcessed++;
        item.progress = Math.round(25 + (pagesProcessed / totalPagesToProcess) * 45);
        renderQueue();
    }

    const allParas = pagesData.flatMap(p => p.paragraphs);
    if (allParas.length === 0) {
        throw new Error("This PDF seems to be an image-only (scanned) document. Please toggle conversion settings to 'Image Layout' mode and try again.");
    }

    item.extractedStructure = pagesData;
    item.progress = 75;
    renderQueue();

    await compileDocxForFile(item);
}

// --- MODE B: IMAGE LAYOUT MODE ---
async function processImageMode(item, pdfDoc, pageRange, settings) {
    const totalPagesToProcess = pageRange.length;
    let pagesProcessed = 0;
    const pageImages = [];

    for (const pageNum of pageRange) {
        const page = await pdfDoc.getPage(pageNum);
        const scale = 2.0; // High resolution rendering
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const canvasCtx = canvas.getContext('2d');

        const renderContext = {
            canvasContext: canvasCtx,
            viewport: viewport
        };
        await page.render(renderContext).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const u8arr = dataURLtoUint8Array(dataUrl);

        pageImages.push({
            pageNum: pageNum,
            imgData: u8arr,
            aspectRatio: viewport.width / viewport.height
        });

        pagesProcessed++;
        item.progress = Math.round(25 + (pagesProcessed / totalPagesToProcess) * 55);
        renderQueue();
    }

    item.extractedStructure = {
        mode: 'image',
        images: pageImages
    };
    item.progress = 85;
    renderQueue();

    await compileDocxForFile(item);
}

/* ==========================================================================
   DOCX CREATION & PACKER LOGIC
   ========================================================================== */
async function compileDocxForFile(item) {
    const settings = item.conversionSettings;
    const docChildren = [];

    // Margins - default to normal (1.0 inch / 1440 twips)
    const documentMargins = {
        top: 1440,
        bottom: 1440,
        left: 1440,
        right: 1440
    };

    if (settings.mode === 'flow') {
        const pages = item.extractedStructure;
        pages.forEach((page, pIdx) => {
            page.paragraphs.forEach(p => {
                let headingType = null;
                if (p.isHeading) {
                    headingType = p.headingLevel === 1 ? docx.HeadingLevel.HEADING_1 : docx.HeadingLevel.HEADING_2;
                }

                const runs = p.runs.map(run => {
                    return new docx.TextRun({
                        text: run.text,
                        bold: run.isBold || p.isHeading,
                        italic: run.isItalic,
                        font: run.font || 'Calibri',
                        size: Math.round((run.fontSize || 11) * 2), // Half points
                    });
                });

                const spacingOpts = p.isHeading ? { before: 240, after: 120, line: 276 } : { before: 100, after: 100, line: 276 };

                docChildren.push(new docx.Paragraph({
                    children: runs,
                    heading: headingType,
                    spacing: spacingOpts,
                    bullet: p.isList ? { level: 0 } : undefined
                }));
            });

            // Insert page breaks if requested
            if (settings.preservePageBreaks && pIdx < pages.length - 1) {
                docChildren.push(new docx.Paragraph({
                    children: [new docx.PageBreak()]
                }));
            }
        });
    } else {
        const images = item.extractedStructure.images;
        images.forEach((img, idx) => {
            const targetWidth = 550; // Centered fit
            const targetHeight = targetWidth / img.aspectRatio;

            const imageRun = new docx.ImageRun({
                data: img.imgData,
                transformation: {
                    width: targetWidth,
                    height: targetHeight
                }
            });

            docChildren.push(new docx.Paragraph({
                children: [imageRun],
                alignment: docx.AlignmentType.CENTER,
                spacing: { before: 120, after: 120 }
            }));

            if (settings.preservePageBreaks && idx < images.length - 1) {
                docChildren.push(new docx.Paragraph({
                    children: [new docx.PageBreak()]
                }));
            }
        });
    }

    const docObj = new docx.Document({
        sections: [{
            properties: {
                page: {
                    margin: documentMargins
                }
            },
            children: docChildren
        }]
    });

    const blob = await docx.Packer.toBlob(docObj);
    item.downloadBlob = blob;
    item.progress = 100;
}

/* ==========================================================================
   PREVIEW DRAWER SYSTEM
   ========================================================================== */
function openPreview(fileId) {
    const item = state.queue.find(i => i.id === fileId);
    if (!item || !item.extractedStructure) return;

    state.activePreviewFileId = fileId;
    previewFileName.textContent = item.name;
    editorArea.innerHTML = '';

    const pages = item.extractedStructure;
    pages.forEach((page, pIdx) => {
        page.paragraphs.forEach(p => {
            let el;
            if (p.isHeading) {
                el = document.createElement(p.headingLevel === 1 ? 'h1' : 'h2');
            } else if (p.isList) {
                el = document.createElement('p');
                el.className = 'editor-list-item';
            } else {
                el = document.createElement('p');
            }

            p.runs.forEach(run => {
                const span = document.createElement('span');
                span.textContent = run.text;
                span.style.fontFamily = run.font || 'Calibri';
                span.style.fontSize = `${run.fontSize || 11}px`;
                if (run.isBold || p.isHeading) span.style.fontWeight = 'bold';
                if (run.isItalic) span.style.fontStyle = 'italic';
                el.appendChild(span);
            });

            editorArea.appendChild(el);
        });

        if (item.conversionSettings.preservePageBreaks && pIdx < pages.length - 1) {
            const pageBreakDiv = document.createElement('hr');
            pageBreakDiv.className = 'preview-page-divider';
            pageBreakDiv.setAttribute('contenteditable', 'false');
            editorArea.appendChild(pageBreakDiv);
        }
    });

    updateWordCount();
    previewDrawer.classList.add('open');
}

function closePreview() {
    previewDrawer.classList.remove('open');
    state.activePreviewFileId = null;
}

function updateWordCount() {
    const text = editorArea.innerText || '';
    const cleanText = text.trim().replace(/\s+/g, ' ');
    const count = cleanText === '' ? 0 : cleanText.split(' ').length;
    previewWordCount.textContent = count;
}

editorArea.addEventListener('input', updateWordCount);

closeDrawerBtn.addEventListener('click', closePreview);
drawerOverlay.addEventListener('click', closePreview);
drawerCancelBtn.addEventListener('click', closePreview);

drawerDownloadBtn.addEventListener('click', async () => {
    const item = state.queue.find(i => i.id === state.activePreviewFileId);
    if (!item) return;

    drawerDownloadBtn.disabled = true;
    const initialBtnHtml = drawerDownloadBtn.innerHTML;
    drawerDownloadBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Compiling...`;

    try {
        const docChildren = [];
        const documentMargins = { top: 1440, bottom: 1440, left: 1440, right: 1440 };

        const nodes = Array.from(editorArea.childNodes);
        
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    docChildren.push(new docx.Paragraph({
                        children: [new docx.TextRun({ text, font: 'Calibri', size: 22 })],
                        spacing: { before: 100, after: 100, line: 276 }
                    }));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                
                if (tag === 'hr' || node.classList.contains('preview-page-divider')) {
                    docChildren.push(new docx.Paragraph({
                        children: [new docx.PageBreak()]
                    }));
                    return;
                }

                let headingLevel = null;
                let spacingBefore = 100;
                let spacingAfter = 100;

                if (tag === 'h1') {
                    headingLevel = docx.HeadingLevel.HEADING_1;
                    spacingBefore = 240;
                    spacingAfter = 120;
                } else if (tag === 'h2') {
                    headingLevel = docx.HeadingLevel.HEADING_2;
                    spacingBefore = 200;
                    spacingAfter = 100;
                }

                const runs = [];
                node.childNodes.forEach(child => {
                    let isBold = false;
                    let isItalic = false;
                    let runText = '';
                    let fontName = 'Calibri';
                    let fontSize = tag === 'h1' ? 32 : (tag === 'h2' ? 26 : 22);

                    if (child.nodeType === Node.TEXT_NODE) {
                        runText = child.textContent;
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const childTag = child.tagName.toLowerCase();
                        if (childTag === 'strong' || childTag === 'b') {
                            isBold = true;
                        }
                        if (childTag === 'em' || childTag === 'i') {
                            isItalic = true;
                        }
                        runText = child.textContent;
                        
                        if (child.style.fontFamily) {
                            fontName = child.style.fontFamily.replace(/['"]/g, '');
                        }
                        if (child.style.fontSize) {
                            const parsedSize = parseFloat(child.style.fontSize);
                            if (!isNaN(parsedSize)) {
                                fontSize = Math.round(parsedSize * 2);
                            }
                        }
                    }

                    if (runText) {
                        runs.push(new docx.TextRun({
                            text: runText,
                            bold: isBold || (tag === 'h1' || tag === 'h2'),
                            italic: isItalic,
                            font: fontName,
                            size: fontSize
                        }));
                    }
                });

                if (runs.length === 0 && node.textContent.trim()) {
                    runs.push(new docx.TextRun({
                        text: node.textContent,
                        font: 'Calibri',
                        size: tag === 'h1' ? 32 : (tag === 'h2' ? 26 : 22)
                    }));
                }

                docChildren.push(new docx.Paragraph({
                    children: runs,
                    heading: headingLevel,
                    spacing: { before: spacingBefore, after: spacingAfter, line: 276 },
                    bullet: node.classList.contains('editor-list-item') ? { level: 0 } : undefined
                }));
            }
        });

        const docObj = new docx.Document({
            sections: [{
                properties: {
                    page: {
                        margin: documentMargins
                    }
                },
                children: docChildren
            }]
        });

        const compiledBlob = await docx.Packer.toBlob(docObj);
        item.downloadBlob = compiledBlob;
        
        triggerDownload(item);
        closePreview();
        showToast(`Compiled with edits and downloaded!`, 'success');
    } catch (e) {
        console.error("Compilation failed:", e);
        showToast(`Failed compiling edits: ${e.message}`, 'danger');
    } finally {
        drawerDownloadBtn.disabled = false;
        drawerDownloadBtn.innerHTML = initialBtnHtml;
    }
});

/* ==========================================================================
   DOWNLOAD TRIGGER SYSTEM
   ========================================================================== */
function triggerDownload(item) {
    if (!item.downloadBlob) {
        showToast("Error: No downloaded binary file found.", "danger");
        return;
    }

    const docxName = item.name.replace(/\.pdf$/i, '') + '.docx';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(item.downloadBlob);
    link.download = docxName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function dataURLtoUint8Array(dataurl) {
    const arr = dataurl.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return u8arr;
}

function parsePageRange(rangeStr, maxPages) {
    if (!rangeStr || rangeStr.toLowerCase().trim() === 'all') {
        return Array.from({ length: maxPages }, (_, i) => i + 1);
    }

    const pages = new Set();
    const parts = rangeStr.split(',');

    parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
            const [startStr, endStr] = trimmed.split('-');
            const start = parseInt(startStr, 10);
            const end = parseInt(endStr, 10);
            
            if (!isNaN(start) && !isNaN(end)) {
                const s = Math.max(1, Math.min(start, maxPages));
                const e = Math.max(1, Math.min(end, maxPages));
                const min = Math.min(s, e);
                const max = Math.max(s, e);
                for (let i = min; i <= max; i++) {
                    pages.add(i);
                }
            }
        } else {
            const pageNum = parseInt(trimmed, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
                pages.add(pageNum);
            }
        }
    });

    return Array.from(pages).sort((a, b) => a - b);
}

/* ==========================================================================
   INITIALIZE SYSTEM
   ========================================================================== */
initTheme();
updateSettingsVisibility();
renderQueue();

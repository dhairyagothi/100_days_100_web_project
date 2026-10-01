document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let images = [];
  const { jsPDF } = window.jspdf;

  // --- DOM SELECTORS ---
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const btnBrowse = document.getElementById('btnBrowse');
  const previewSection = document.getElementById('previewSection');
  const btnClearAll = document.getElementById('btnClearAll');
  const imageGrid = document.getElementById('imageGrid');

  const pageSize = document.getElementById('pageSize');
  const orientationGroup = document.getElementById('orientationGroup');
  const pageOrientation = document.getElementById('pageOrientation');
  const marginGroup = document.getElementById('marginGroup');
  const pageMargin = document.getElementById('pageMargin');

  const summaryCount = document.getElementById('summaryCount');
  const summaryPages = document.getElementById('summaryPages');
  const pdfFilename = document.getElementById('pdfFilename');
  const btnGenerate = document.getElementById('btnGenerate');

  const overlay = document.getElementById('overlay');
  const progressText = document.getElementById('progressText');
  const themeToggle = document.getElementById('themeToggle');

  // --- INITIALIZE ---
  initApp();

  function initApp() {
    loadThemePreference();
    setupEventListeners();
    updateUI();
  }

  // --- THEME ---
  function loadThemePreference() {
    const isDark = localStorage.getItem('pdfy-dark-theme') === 'true';
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('pdfy-dark-theme', isDark);
    themeToggle.innerHTML = isDark 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);

    // Browse click triggers hidden input
    btnBrowse.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', handleDrop, false);

    // Settings adjustments
    pageSize.addEventListener('change', () => {
      if (pageSize.value === 'fit') {
        orientationGroup.classList.add('hidden');
        marginGroup.classList.add('hidden');
      } else {
        orientationGroup.classList.remove('hidden');
        marginGroup.classList.remove('hidden');
      }
      updateSummary();
    });

    btnClearAll.addEventListener('click', clearAll);
    btnGenerate.addEventListener('click', generatePDF);
  }

  // --- FILE HANDLERS ---
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    processFiles(files);
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    processFiles(files);
  }

  async function processFiles(files) {
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const imageFiles = Array.from(files).filter(file => validImageTypes.includes(file.type));

    if (imageFiles.length === 0) return;

    // Show compiler loader during upload compression processing
    progressText.textContent = 'Processing...';
    overlay.classList.remove('hidden');

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      try {
        const dataUrl = await readFileAsDataURL(file);
        const normalized = await compressAndNormalizeImage(dataUrl, file.name);
        images.push({
          id: Date.now() + Math.random(),
          name: file.name,
          dataUrl: normalized.dataUrl,
          width: normalized.width,
          height: normalized.height
        });
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }
    }

    overlay.classList.add('hidden');
    fileInput.value = ''; // Reset file input
    updateUI();
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Normalize image aspect ratio & dimensions to keep memory consumption low
  function compressAndNormalizeImage(dataUrl, fileName) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1800; // Keep size high quality but optimal for PDF page dimensions
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        // Export to JPEG with good compression ratio
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({
          dataUrl: compressedUrl,
          width: w,
          height: h
        });
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  // --- UI RENDERERS ---
  function updateUI() {
    renderPreviews();
    updateSummary();
  }

  function renderPreviews() {
    if (images.length === 0) {
      previewSection.classList.add('hidden');
      imageGrid.innerHTML = '';
      btnGenerate.disabled = true;
      return;
    }

    previewSection.classList.remove('hidden');
    btnGenerate.disabled = false;

    imageGrid.innerHTML = images.map((image, index) => {
      const isFirst = index === 0;
      const isLast = index === images.length - 1;
      
      return `
        <div class="image-card" data-id="${image.id}">
          <div class="image-wrapper">
            <span class="card-index">${index + 1}</span>
            <img src="${image.dataUrl}" alt="${image.name}">
            <button class="btn-delete-card" data-id="${image.id}" title="Remove image">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="card-filename" title="${image.name}">${image.name}</div>
          <div class="card-controls">
            <button class="reorder-btn" data-id="${image.id}" data-dir="left" ${isFirst ? 'disabled' : ''} title="Move back">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="reorder-btn" data-id="${image.id}" data-dir="right" ${isLast ? 'disabled' : ''} title="Move forward">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Action Listeners
    imageGrid.querySelectorAll('.btn-delete-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseFloat(btn.getAttribute('data-id'));
        removeImage(id);
      });
    });

    imageGrid.querySelectorAll('.reorder-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseFloat(btn.getAttribute('data-id'));
        const dir = btn.getAttribute('data-dir');
        shiftImageOrder(id, dir);
      });
    });
  }

  function updateSummary() {
    const count = images.length;
    summaryCount.textContent = count;
    summaryPages.textContent = count; // 1 image per page is standard
    document.getElementById('fileCount').textContent = count;
  }

  function removeImage(id) {
    images = images.filter(img => img.id !== id);
    updateUI();
  }

  function shiftImageOrder(id, direction) {
    const index = images.findIndex(img => img.id === id);
    if (index === -1) return;

    if (direction === 'left' && index > 0) {
      // Swap with previous element
      const temp = images[index];
      images[index] = images[index - 1];
      images[index - 1] = temp;
    } else if (direction === 'right' && index < images.length - 1) {
      // Swap with next element
      const temp = images[index];
      images[index] = images[index + 1];
      images[index + 1] = temp;
    }

    updateUI();
  }

  function clearAll() {
    if (images.length === 0) return;
    if (confirm('Are you sure you want to remove all uploaded images?')) {
      images = [];
      updateUI();
    }
  }

  // --- PDF GENERATOR PIPELINE ---
  async function generatePDF() {
    if (images.length === 0) return;

    overlay.classList.remove('hidden');
    progressText.textContent = '0%';

    // Setup format calculations
    const selectedSize = pageSize.value;
    const selectedOrientation = pageOrientation.value;
    const selectedMargin = pageMargin.value;

    // Convert margins to points (1 pt = 1/72 inch, 1 mm = 2.835 pt)
    let marginPt = 0;
    if (selectedMargin === 'small') marginPt = 28.35; // 10mm
    else if (selectedMargin === 'medium') marginPt = 56.69; // 20mm

    // Page formats in Points (pt)
    const pageFormats = {
      a4: { w: 595.28, h: 841.89 },
      letter: { w: 612, h: 792 }
    };

    // Instantiate jsPDF
    const pdf = new jsPDF({ unit: 'pt' });

    for (let i = 0; i < images.length; i++) {
      // Wait for DOM or frame loop to update loader
      await new Promise(resolve => setTimeout(resolve, 50));
      progressText.textContent = `${Math.round((i / images.length) * 100)}%`;

      const imgData = images[i];
      let pWidth = 0;
      let pHeight = 0;
      let orientation = 'p';

      if (selectedSize === 'fit') {
        // Dimensions fit the image's original sizes (no orientation or margins apply)
        pWidth = imgData.width;
        pHeight = imgData.height;
        orientation = pWidth > pHeight ? 'l' : 'p';
        
        pdf.addPage([pWidth, pHeight], orientation);
        pdf.addImage(imgData.dataUrl, 'JPEG', 0, 0, pWidth, pHeight);
      } else {
        // Standard formats (A4 or US Letter)
        const formatData = pageFormats[selectedSize];
        let orientationSetting = selectedOrientation;

        if (orientationSetting === 'auto') {
          orientationSetting = imgData.width > imgData.height ? 'landscape' : 'portrait';
        }

        if (orientationSetting === 'landscape') {
          pWidth = formatData.h;
          pHeight = formatData.w;
          orientation = 'l';
        } else {
          pWidth = formatData.w;
          pHeight = formatData.h;
          orientation = 'p';
        }

        pdf.addPage([pWidth, pHeight], orientation);

        // Aspect ratio calculations with Margins
        const drawableWidth = pWidth - (marginPt * 2);
        const drawableHeight = pHeight - (marginPt * 2);

        const imgScale = Math.min(drawableWidth / imgData.width, drawableHeight / imgData.height);
        const renderWidth = imgData.width * imgScale;
        const renderHeight = imgData.height * imgScale;

        // Centered position
        const posX = marginPt + (drawableWidth - renderWidth) / 2;
        const posY = marginPt + (drawableHeight - renderHeight) / 2;

        pdf.addImage(imgData.dataUrl, 'JPEG', posX, posY, renderWidth, renderHeight);
      }
    }

    // Delete first default page created by jsPDF constructor
    pdf.deletePage(1);

    // Save File
    let filename = pdfFilename.value.trim();
    if (!filename) filename = 'converted_images';
    pdf.save(`${filename}.pdf`);

    progressText.textContent = '100%';
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 500);
  }
});

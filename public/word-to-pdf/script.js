// WordyPDF - Client-side Word to PDF Converter Logic

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const btnBrowse = document.getElementById('btnBrowse');
  const fileDetails = document.getElementById('fileDetails');
  const fileNameDisplay = document.getElementById('fileName');
  const fileSizeDisplay = document.getElementById('fileSize');
  const btnRemoveFile = document.getElementById('btnRemoveFile');
  
  const settingsCard = document.getElementById('settingsCard');
  const pdfFilenameInput = document.getElementById('pdfFilename');
  const docStatus = document.getElementById('docStatus');
  const btnPrintPdf = document.getElementById('btnPrintPdf');
  const btnDownloadPdf = document.getElementById('btnDownloadPdf');
  
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const zoomLevelDisplay = document.getElementById('zoomLevel');
  const btnToggleWidth = document.getElementById('btnToggleWidth');
  
  const previewBody = document.getElementById('previewBody');
  const emptyState = document.getElementById('emptyState');
  const docxContainer = document.getElementById('docxContainer');
  
  const loaderOverlay = document.getElementById('loaderOverlay');
  const loaderTitle = document.getElementById('loaderTitle');
  const loaderMessage = document.getElementById('loaderMessage');
  const printGuideOverlay = document.getElementById('printGuideOverlay');
  const btnGotIt = document.getElementById('btnGotIt');

  // --- App State Variables ---
  let activeFile = null;
  let currentZoom = 100; // Percentage
  const originalTitle = document.title;

  // --- 1. Theme Management ---
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // default to premium dark theme
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  };

  const updateThemeIcon = (theme) => {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  };

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  initTheme();

  // --- 2. Drag & Drop Handlers ---
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) handleFileSelection(files[0]);
  });

  btnBrowse.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFileSelection(e.target.files[0]);
  });

  // --- 3. File Selection State ---
  const handleFileSelection = (file) => {
    // Check file extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'docx') {
      alert('Unsupported file format. Please upload a Microsoft Word Document (.docx).');
      return;
    }

    activeFile = file;
    
    // Update Filename input default value
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
    pdfFilenameInput.value = safeBaseName;

    // Display File UI Card
    fileNameDisplay.textContent = file.name;
    fileSizeDisplay.textContent = formatBytes(file.size);
    fileDetails.classList.remove('hidden');
    dropzone.classList.add('hidden');

    // Trigger Docx Rendering
    renderWordDocument(file);
  };

  // Helper: Format file bytes
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Remove File Handler
  btnRemoveFile.addEventListener('click', () => {
    activeFile = null;
    fileInput.value = '';
    
    // UI Reset
    fileDetails.classList.add('hidden');
    dropzone.classList.remove('hidden');
    docxContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    
    // Disable controls
    btnPrintPdf.disabled = true;
    btnDownloadPdf.disabled = true;
    btnZoomIn.disabled = true;
    btnZoomOut.disabled = true;
    btnToggleWidth.disabled = true;
    
    docStatus.textContent = 'No file loaded';
    docStatus.className = 'summary-val';
    
    currentZoom = 100;
    updateZoom();
  });

  // --- 4. Render DOCX using docx-preview ---
  const renderWordDocument = (file) => {
    showLoader('Rendering Preview...', 'Parsing Word layout elements...');
    
    // Safety check for library availability
    if (typeof JSZip === 'undefined' || typeof docx === 'undefined') {
      hideLoader();
      alert('Error: Required libraries (JSZip or docx-preview) failed to load. Please check your internet connection and refresh the page.');
      btnRemoveFile.click();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        
        // Configuration details for docx-preview
        const options = {
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          experimental: false, // Set to false to avoid rendering hangs/slowness on complex elements
          className: "docx"
        };

        docxContainer.innerHTML = '';
        
        docx.renderAsync(arrayBuffer, docxContainer, null, options)
          .then(() => {
            hideLoader();
            emptyState.classList.add('hidden');
            
            // Enable tool buttons
            btnPrintPdf.disabled = false;
            btnDownloadPdf.disabled = false;
            btnZoomIn.disabled = false;
            btnZoomOut.disabled = false;
            btnToggleWidth.disabled = false;
            
            docStatus.textContent = 'Loaded';
            docStatus.className = 'summary-val text-success';
            
            // Auto fit layout
            fitToWidth();
          })
          .catch(err => {
            console.error("Rendering failed inside docx-preview:", err);
            hideLoader();
            alert('Could not render document layout: ' + err.message);
            btnRemoveFile.click();
          });
      } catch (err) {
        console.error("Synchronous rendering crash:", err);
        hideLoader();
        alert('An unexpected error occurred during processing: ' + err.message);
        btnRemoveFile.click();
      }
    };
    
    reader.onerror = () => {
      hideLoader();
      alert('Error reading local file.');
      btnRemoveFile.click();
    };
    
    reader.readAsArrayBuffer(file);
  };

  // --- 5. Preview Controls (Zoom) ---
  const updateZoom = () => {
    zoomLevelDisplay.textContent = `${currentZoom}%`;
    docxContainer.style.transform = `scale(${currentZoom / 100})`;
    
    // Re-adjust container height to scroll nicely when scaled (using offsetHeight is much faster and doesn't suffer layout lag)
    const docxWrapper = docxContainer.querySelector('.docx-wrapper');
    if (docxWrapper) {
      const originalHeight = docxWrapper.offsetHeight;
      docxContainer.style.height = `${originalHeight * (currentZoom / 100)}px`;
    }
  };

  btnZoomIn.addEventListener('click', () => {
    if (currentZoom < 200) {
      currentZoom += 10;
      updateZoom();
    }
  });

  btnZoomOut.addEventListener('click', () => {
    if (currentZoom > 50) {
      currentZoom -= 10;
      updateZoom();
    }
  });

  const fitToWidth = () => {
    const docxPage = docxContainer.querySelector('.docx');
    if (!docxPage) return;
    
    const viewportWidth = previewBody.clientWidth - 64; // subtract padding
    const pageWidth = docxPage.clientWidth;
    
    if (pageWidth > 0) {
      const factor = Math.floor((viewportWidth / pageWidth) * 100);
      currentZoom = Math.max(50, Math.min(150, factor));
      updateZoom();
    }
  };

  btnToggleWidth.addEventListener('click', fitToWidth);

  // Re-fit on window resize
  window.addEventListener('resize', () => {
    if (activeFile) {
      // Small timeout to allow container layouts to update
      setTimeout(fitToWidth, 100);
    }
  });

  // --- 6. Export Action: Print to PDF (Vector) ---
  btnPrintPdf.addEventListener('click', () => {
    // Open instructions prompt overlay
    printGuideOverlay.classList.remove('hidden');
  });

  btnGotIt.addEventListener('click', () => {
    printGuideOverlay.classList.add('hidden');
    
    // 1. Temporarily change Title so that browser saves PDF with the requested filename
    const exportName = pdfFilenameInput.value.trim() || 'converted_document';
    document.title = exportName;
    
    // 2. Trigger native Print dialog
    window.print();
    
    // 3. Restore title afterwards
    document.title = originalTitle;
  });

  // Listen to print end to clean overlays if user pressed escape or printed
  window.addEventListener('afterprint', () => {
    printGuideOverlay.classList.add('hidden');
    document.title = originalTitle;
  });

  // --- 7. Export Action: Direct PDF Download (Canvas fallback) ---
  btnDownloadPdf.addEventListener('click', () => {
    const exportName = pdfFilenameInput.value.trim() || 'converted_document';
    showLoader('Compiling PDF...', 'Converting layouts, this may take a moment for large files.');
    
    // Grab the rendered docx content
    const element = docxContainer.querySelector('.docx-wrapper');
    
    if (!element) {
      alert('No document layout rendered to export.');
      hideLoader();
      return;
    }

    // Configure export options for html2pdf
    // Scale 1.5/2 maintains layout while preserving quality without crashing memory
    const opt = {
      margin:       [0, 0, 0, 0],
      filename:     `${exportName}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 1.5, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF:        { 
        unit: 'pt', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    // Run compiler
    html2pdf().set(opt).from(element).save()
      .then(() => {
        hideLoader();
      })
      .catch(err => {
        console.error("Direct PDF export failed:", err);
        hideLoader();
        alert('Direct PDF compilation encountered an error. Please try "Save as PDF (Vector)" instead.');
      });
  });

  // --- 8. Loader Overlay Helpers ---
  function showLoader(title, message) {
    loaderTitle.textContent = title;
    loaderMessage.textContent = message;
    loaderOverlay.classList.remove('hidden');
  }

  function hideLoader() {
    loaderOverlay.classList.add('hidden');
  }
});

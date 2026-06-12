/**
 * ============================================================
 * INTERACTIVE CODE SANDBOX & PREVIEWER CORE ENGINE
 * ============================================================
 */

(function () {
  let activeProject = null;
  let projectFilesMap = new Map(); // Maps filename -> content
  let activeTab = null;
  let isResizing = false;

  // Dynamically load Prism.js library and styling
  function loadPrism() {
    if (window.Prism) return Promise.resolve();

    return new Promise((resolve) => {
      // Inject CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
      document.head.appendChild(link);

      // Inject JS
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  // Check if project path is local (can be scraped and iframe-sandboxed without CORS issues)
  function isLocalDemo(path) {
    if (!path) return false;
    const trimmed = path.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      // Only treat as local if it's the exact same origin (e.g. during local dev)
      try {
        const urlObj = new URL(trimmed);
        return urlObj.origin === window.location.origin;
      } catch (_) {
        return false;
      }
    }
    return true;
  }

  // Open Sandbox Overlay
  async function openSandbox(project) {
    const path = project.projectPath || project.url;
    if (!isLocalDemo(path)) {
      // Fallback: Open external demo links in a new tab directly
      const cleanUrl = path.startsWith("http") ? path : `./${path.replace(/^\.\//, "")}`;
      window.open(cleanUrl, "_blank", "noopener");
      return;
    }

    activeProject = project;
    projectFilesMap.clear();

    const overlay = document.getElementById("sandboxOverlay");
    if (!overlay) return;

    // Show overlay with loading state
    overlay.innerHTML = `
      <div class="sandbox-container">
        <div class="sandbox-loader" id="sandboxLoader">
          <div class="sandbox-spinner"></div>
          <p>Initialising Sandbox Environment...</p>
        </div>
      </div>
    `;
    overlay.classList.add("active");
    document.body.classList.add("sandbox-open");

    try {
      // 1. Load highlighting core
      await loadPrism();

      // 2. Fetch and parse project files
      const loaderText = overlay.querySelector("#sandboxLoader p");
      if (loaderText) loaderText.textContent = "Loading source files...";
      await fetchProjectFiles(path);

      // 3. Render Sandbox Shell
      renderSandboxShell(overlay, project, path);
      setupEventListeners();
      setupDragResize();

      // 4. Load initial tab
      const firstTab = Array.from(projectFilesMap.keys())[0];
      if (firstTab) {
        selectTab(firstTab);
      }
    } catch (error) {
      console.error("[Sandbox Error]:", error);
      overlay.innerHTML = `
        <div class="sandbox-container" style="justify-content: center; align-items: center; padding: 2rem; text-align: center;">
          <h2 style="color: var(--accent); margin-bottom: 1rem;"><i class="fas fa-exclamation-triangle"></i> Sandbox Failed to Load</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">We couldn't parse the code files for this project.</p>
          <div style="display: flex; gap: 1rem;">
            <a href="${path}" target="_blank" class="sandbox-btn-link" style="background: var(--accent); color: white; border-color: var(--border-accent);">Open Demo Directly</a>
            <button id="errorCloseBtn" class="viewport-btn">Close Sandbox</button>
          </div>
        </div>
      `;
      document.getElementById("errorCloseBtn")?.addEventListener("click", closeSandbox);
    }
  }

  // Fetch index HTML, parse CSS and Javascript tags, download source files
  async function fetchProjectFiles(projectPath) {
    const response = await fetch(projectPath);
    if (!response.ok) {
      throw new Error(`Failed to load main HTML file: ${response.statusText}`);
    }
    const htmlText = await response.text();

    // Store HTML file
    const htmlFilename = projectPath.substring(projectPath.lastIndexOf("/") + 1) || "index.html";
    projectFilesMap.set(htmlFilename, htmlText);

    // Extract directory base path (e.g., "./public/TO_DO_LIST/")
    const baseDir = projectPath.substring(0, projectPath.lastIndexOf("/") + 1);

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const cssPromises = [];
    const jsPromises = [];

    // Parse CSS
    doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("https") && !href.startsWith("//")) {
        const cssUrl = new URL(href, new URL(baseDir, window.location.href)).pathname;
        const cssFilename = href.substring(href.lastIndexOf("/") + 1);
        cssPromises.push(
          fetchFileContent(cssUrl, cssFilename)
        );
      }
    });

    // Parse JS
    doc.querySelectorAll("script[src]").forEach((script) => {
      const src = script.getAttribute("src");
      if (src && !src.startsWith("http") && !src.startsWith("https") && !src.startsWith("//")) {
        const jsUrl = new URL(src, new URL(baseDir, window.location.href)).pathname;
        const jsFilename = src.substring(src.lastIndexOf("/") + 1);
        jsPromises.push(
          fetchFileContent(jsUrl, jsFilename)
        );
      }
    });

    // Await all parallel file downloads
    await Promise.allSettled([...cssPromises, ...jsPromises]);
  }

  // Fetch individual asset contents
  async function fetchFileContent(url, filename) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const content = await response.text();
        projectFilesMap.set(filename, content);
      }
    } catch (e) {
      console.warn(`[Sandbox Info] Could not fetch asset: ${filename}`, e);
    }
  }

  // Render main split container markup
  function renderSandboxShell(overlay, project, path) {
    const isRoot = !window.location.pathname.includes("/contributors/");
    const basePrefix = isRoot ? "" : "../";
    const cleanDemoPath = path.startsWith("./") ? basePrefix + path.substring(2) : path;

    overlay.innerHTML = `
      <div class="sandbox-container">
        <div class="sandbox-header">
          <div class="sandbox-title-area">
            <span class="sandbox-day">${project.day}</span>
            <h2 class="sandbox-title">${project.projectName}</h2>
          </div>
          <div class="sandbox-controls">
            <button class="viewport-btn active" data-viewport="desktop">Desktop</button>
            <button class="viewport-btn" data-viewport="tablet">Tablet</button>
            <button class="viewport-btn" data-viewport="mobile">Mobile</button>
            <span class="divider">|</span>
            <button id="downloadCodeBtn" class="viewport-btn" style="display: inline-flex; align-items: center; gap: 0.35rem; font-family: inherit;">
              <i class="fas fa-download" aria-hidden="true"></i> Download Zip
            </button>
            <a href="${cleanDemoPath}" target="_blank" class="sandbox-btn-link" rel="noopener noreferrer">
              Open Demo <i class="fas fa-external-link-alt" aria-hidden="true"></i>
            </a>
            <button id="closeSandboxBtn" class="close-sandbox-btn" aria-label="Close Sandbox Overlay">&times;</button>
          </div>
        </div>
        <div class="sandbox-body">
          <div class="pane preview-pane" id="previewPane">
            <div class="iframe-wrapper" id="iframeWrapper">
              <iframe id="sandboxIframe" src="${cleanDemoPath}" sandbox="allow-scripts allow-same-origin"></iframe>
            </div>
          </div>
          <div class="sandbox-resizer" id="sandboxResizer"></div>
          <div class="pane code-pane" id="codePane">
            <div class="code-tabs-header" id="codeTabsHeader"></div>
            <div class="code-content-wrapper">
              <pre><code id="codeArea" class="language-markup"></code></pre>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render tab buttons
    const tabsHeader = document.getElementById("codeTabsHeader");
    projectFilesMap.forEach((_, filename) => {
      const tab = document.createElement("button");
      tab.className = "code-tab";
      tab.dataset.file = filename;

      // FontAwesome Icons mapping based on extension
      const ext = filename.split(".").pop().toLowerCase();
      let iconClass = "fa-solid fa-file-code";
      if (ext === "html") iconClass = "fab fa-html5 text-orange-500";
      else if (ext === "css") iconClass = "fab fa-css3-alt text-blue-500";
      else if (ext === "js") iconClass = "fab fa-js text-yellow-500";

      tab.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i> ${filename}`;
      tab.addEventListener("click", () => selectTab(filename));
      tabsHeader.appendChild(tab);
    });
  }

  // File extension language mapping
  function getLanguageFromExtension(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "css") return "css";
    if (ext === "js") return "javascript";
    if (ext === "json") return "javascript";
    return "markup"; // html, xml, etc.
  }

  // Select file tab to render
  function selectTab(filename) {
    const code = projectFilesMap.get(filename);
    if (code === undefined) return;

    activeTab = filename;

    // Toggle active classes on buttons
    document.querySelectorAll(".code-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.file === filename);
    });

    const codeArea = document.getElementById("codeArea");
    if (codeArea && window.Prism) {
      codeArea.textContent = code;
      const lang = getLanguageFromExtension(filename);
      codeArea.className = `language-${lang}`;
      window.Prism.highlightElement(codeArea);
      
      // Reset scroll position of pre container
      codeArea.parentElement.scrollTop = 0;
      codeArea.parentElement.scrollLeft = 0;
    }
  }

  // Dynamically load JSZip library
  function loadJSZip() {
    if (window.JSZip) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load JSZip"));
      document.head.appendChild(script);
    });
  }

  // Package dynamic project files into a zip archive and download it
  async function downloadProjectCode() {
    const downloadBtn = document.getElementById("downloadCodeBtn");
    if (!downloadBtn) return;

    const originalText = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Zipping...`;

    try {
      await loadJSZip();
      
      const zip = new window.JSZip();
      projectFilesMap.forEach((content, filename) => {
        zip.file(filename, content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeProject.projectName.replace(/\s+/g, "_")}_code.zip`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate zip download:", err);
      alert("Failed to download project code. Please try again.");
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalText;
    }
  }

  // Bind close buttons and viewport toggles
  function setupEventListeners() {
    document.getElementById("closeSandboxBtn")?.addEventListener("click", closeSandbox);
    document.getElementById("downloadCodeBtn")?.addEventListener("click", downloadProjectCode);

    // Viewport selectors
    const wrapper = document.getElementById("iframeWrapper");
    document.querySelectorAll(".viewport-btn[data-viewport]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".viewport-btn[data-viewport]").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        const mode = e.target.dataset.viewport;
        if (wrapper) {
          wrapper.className = "iframe-wrapper"; // Reset base classes
          if (mode !== "desktop") {
            wrapper.classList.add(mode);
          }
        }
      });
    });
  }

  // Vertical resizing logic
  function setupDragResize() {
    const resizer = document.getElementById("sandboxResizer");
    const previewPane = document.getElementById("previewPane");
    const codePane = document.getElementById("codePane");
    const iframe = document.getElementById("sandboxIframe");

    if (!resizer || !previewPane || !codePane) return;

    const onMouseDown = (e) => {
      e.preventDefault();
      isResizing = true;
      if (iframe) iframe.style.pointerEvents = "none"; // Avoid iframe absorbing cursor moves
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
    };

    const onMouseMove = (e) => {
      if (!isResizing) return;
      const isMobile = window.innerWidth <= 968;
      
      if (isMobile) {
        // Vertical dragging (top/bottom)
        const containerHeight = document.querySelector(".sandbox-body").clientHeight;
        const topHeight = e.clientY - document.querySelector(".sandbox-body").getBoundingClientRect().top;
        const topPercent = (topHeight / containerHeight) * 100;
        
        if (topPercent > 15 && topPercent < 85) {
          previewPane.style.flex = `0 0 ${topPercent}%`;
          codePane.style.flex = `0 0 ${100 - topPercent}%`;
        }
      } else {
        // Horizontal dragging (left/right)
        const containerWidth = document.querySelector(".sandbox-body").clientWidth;
        const leftWidth = e.clientX - document.querySelector(".sandbox-body").getBoundingClientRect().left;
        const leftPercent = (leftWidth / containerWidth) * 100;

        if (leftPercent > 15 && leftPercent < 85) {
          previewPane.style.flex = `0 0 ${leftPercent}%`;
          codePane.style.flex = `0 0 ${100 - leftPercent}%`;
        }
      }
    };

    const onMouseUp = () => {
      isResizing = false;
      if (iframe) iframe.style.pointerEvents = "auto";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
    };

    resizer.addEventListener("mousedown", onMouseDown);
  }

  // Close Sandbox overlay
  function closeSandbox() {
    const overlay = document.getElementById("sandboxOverlay");
    if (overlay) {
      overlay.classList.remove("active");
      overlay.innerHTML = "";
    }
    document.body.classList.remove("sandbox-open");
    activeProject = null;
    projectFilesMap.clear();
    activeTab = null;
  }

  // Expose function globally
  window.openSandbox = openSandbox;
  window.closeSandbox = closeSandbox;
})();

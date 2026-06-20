(() => {
  'use strict';

  const nodeTemplates = {
    process: {
      idPrefix: 'process',
      labels: { title: 'Process Box', subtitle: 'Rectangle' },
      dimensions: { width: 200, height: 96 },
    },
    decision: {
      idPrefix: 'decision',
      labels: { title: 'Decision Point', subtitle: 'Diamond' },
      dimensions: { width: 180, height: 120 },
    },
    terminal: {
      idPrefix: 'terminal',
      labels: { title: 'Start/End Node', subtitle: 'Rounded Rectangle' },
      dimensions: { width: 220, height: 88 },
    },
  };

  const state = {
    nodes: [],
    connections: [],
    viewport: { panX: 0, panY: 0, scaleZoom: 1 },
    selection: { activeNodeId: null, activeTemplateType: null },
    interaction: {
      mode: null,
      pointerId: null,
      targetNodeId: null,
      sourceNodeId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      moved: false,
      tempLineEndX: 0,
      tempLineEndY: 0,
    },
  };

  const nodeLookup = new Map();
  const svgState = { connectionElements: [] };

  const viewportEl = document.querySelector('.workspace__viewport');
  const stageEl = document.querySelector('.workspace__stage');
  const trayEl = document.querySelector('.shape-tray');
  const svgEl = document.getElementById('vectorSpace');
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const toolbarButtons = Array.from(
    document.querySelectorAll('.toolbar-button')
  );

  if (!viewportEl || !stageEl || !trayEl || !svgEl) return;

  const themeStorageKey = 'flowchart-theme';

  const getPreferredTheme = () => {
    try {
      const storedTheme = localStorage.getItem(themeStorageKey);
      if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    } catch (error) {
      console.warn('Theme preference could not be read:', error);
    }

    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  };

  const getActiveTheme = () =>
    document.documentElement.getAttribute('data-theme') === 'light'
      ? 'light'
      : 'dark';

  const syncThemeToggleButton = () => {
    if (!themeToggleBtn) return;

    const activeTheme = getActiveTheme();
    const nextLabel =
      activeTheme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode';
    themeToggleBtn.textContent = nextLabel;
    themeToggleBtn.setAttribute(
      'aria-label',
      `Switch to ${activeTheme === 'light' ? 'dark' : 'light'} theme`
    );
  };

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      console.warn('Theme preference could not be saved:', error);
    }

    syncThemeToggleButton();
  };

  const toggleTheme = () => {
    applyTheme(getActiveTheme() === 'light' ? 'dark' : 'light');
  };

  applyTheme(getPreferredTheme());

  stageEl.removeAttribute('aria-hidden');
  stageEl.style.position = 'relative';
  stageEl.style.transformOrigin = '0 0';
  svgEl.style.pointerEvents = 'none';

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const getTemplate = (type) => nodeTemplates[type] ?? nodeTemplates.process;
  const createNodeId = (type) =>
    `${getTemplate(type).idPrefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  const syncStageMetrics = () => {
    const rect = viewportEl.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
    stageEl.style.minWidth = `${width}px`;
    stageEl.style.minHeight = `${height}px`;
    return { width, height };
  };

  const getStagePoint = (clientX, clientY) => {
    const rect = viewportEl.getBoundingClientRect();
    return {
      x: (clientX - rect.left - state.viewport.panX) / state.viewport.scaleZoom,
      y: (clientY - rect.top - state.viewport.panY) / state.viewport.scaleZoom,
    };
  };

  const getNodeTemplatePosition = (type) => {
    const template = getTemplate(type);
    const metrics = syncStageMetrics();
    return {
      x: (metrics.width - template.dimensions.width) / 2,
      y: (metrics.height - template.dimensions.height) / 2,
    };
  };

  const applyViewportTransform = () => {
    stageEl.style.transform = `translate3d(${state.viewport.panX}px, ${state.viewport.panY}px, 0) scale(${state.viewport.scaleZoom})`;
  };

  const updateNodeElement = (node) => {
    if (!node?.element) return;
    node.element.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;
    node.element.style.width = `${node.width}px`;
    node.element.style.height = `${node.height}px`;
    node.element.dataset.nodeId = node.id;
    node.element.dataset.nodeType = node.type;

    node.cache = {
      left: node.x,
      top: node.y,
      right: node.x + node.width,
      bottom: node.y + node.height,
      centerX: node.x + node.width / 2,
      centerY: node.y + node.height / 2,
    };
  };

  const setSelection = (nodeId) => {
    state.selection.activeNodeId = nodeId;
    state.nodes.forEach((node) => {
      if (node.element) {
        node.element.classList.toggle('is-selected', node.id === nodeId);
      }
    });
  };

  const clearWorkspaceTargets = () => {
    setSelection(null);
  };

  const scheduleRenderConnections = (() => {
    let frameId = null;
    return () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        renderConnections();
      });
    };
  })();

  const createNodeElement = (node) => {
    const element = document.createElement('article');
    element.className = `shape-node shape-node--${node.type}`;
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.style.position = 'absolute';
    element.style.left = '0';
    element.style.top = '0';
    element.style.display = 'grid';
    element.style.placeItems = 'center';
    element.style.padding = '0.75rem';
    element.style.color = '#08111f';
    element.style.background = 'linear-gradient(180deg, #f9fdff, #dceffc)';
    element.style.border = '2px solid var(--node-border)';
    element.style.boxShadow = '0 14px 30px rgba(2, 10, 20, 0.22)';
    element.style.transformOrigin = '0 0';
    element.style.userSelect = 'none';
    element.style.touchAction = 'none';
    element.style.willChange = 'transform';
    element.style.cursor = 'grab';

    if (node.type === 'decision') {
      element.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    } else if (node.type === 'terminal') {
      element.style.borderRadius = '999px';
    } else {
      element.style.borderRadius = '18px';
    }

    const inner = document.createElement('div');
    inner.className = 'shape-node__content';
    inner.style.display = 'grid';
    inner.style.gap = '0.15rem';
    inner.style.textAlign = 'center';
    // FIX 1: Allow pointer events to interact with text children natively
    inner.style.pointerEvents = 'auto';

    if (node.type === 'decision') {
      inner.style.transform = 'rotate(-45deg)';
      inner.style.margin = '0.75rem';
    }

    const title = document.createElement('div');
    title.textContent = node.labels.title;
    title.contentEditable = 'true';
    title.spellcheck = false;
    title.style.fontSize = '0.98rem';
    title.style.fontWeight = 'bold';
    title.style.outline = 'none';
    title.style.cursor = 'text';
    title.style.minWidth = '120px';
    // FIX 2: Override parent's "userSelect: none" restriction so typing works smoothly
    title.style.userSelect = 'text';
    title.style.webkitUserSelect = 'text';

    title.addEventListener('pointerdown', (e) => e.stopPropagation());
    title.addEventListener('click', (e) => e.stopPropagation());
    title.addEventListener('blur', () => {
      node.labels.title = title.textContent.trim() || 'Untitled Node';
    });

    const subtitle = document.createElement('div');
    subtitle.textContent = node.labels.subtitle;
    subtitle.contentEditable = 'true';
    subtitle.spellcheck = false;
    subtitle.style.fontSize = '0.78rem';
    subtitle.style.color = 'rgba(8, 17, 31, 0.7)';
    subtitle.style.textTransform = 'uppercase';
    subtitle.style.outline = 'none';
    subtitle.style.cursor = 'text';
    subtitle.style.minWidth = '100px';
    subtitle.style.userSelect = 'text';
    subtitle.style.webkitUserSelect = 'text';

    // Prevent clicking or typing in the subtitle from triggering a node drag operation
    subtitle.addEventListener('pointerdown', (e) => e.stopPropagation());
    subtitle.addEventListener('click', (e) => e.stopPropagation());

    // Update the central memory state array automatically when clicking away
    subtitle.addEventListener('blur', () => {
      const updatedSubtitle = subtitle.textContent.trim();
      node.labels.subtitle = updatedSubtitle || 'Shape';
      if (!updatedSubtitle) subtitle.textContent = 'Shape';
    });

    inner.append(title, subtitle);
    element.append(inner);

    // Bind 4 edge connection ports
    ['n', 'e', 's', 'w'].forEach((dir) => {
      const port = document.createElement('div');
      port.className = `shape-port shape-port--${dir}`;
      port.dataset.dir = dir;
      port.addEventListener('pointerdown', (e) =>
        handlePortPointerDown(e, node, dir)
      );
      element.append(port);
    });

    element.addEventListener('pointerdown', (e) =>
      handleNodePointerDown(e, node)
    );
    element.addEventListener('click', (e) => e.stopPropagation());

    return element;
  };

  const addNode = (type, position = null) => {
    try {
      const template = getTemplate(type);
      const id = createNodeId(type);
      const nodePosition = position ?? getNodeTemplatePosition(type);
      const node = {
        id,
        type,
        x: nodePosition.x,
        y: nodePosition.y,
        width: template.dimensions.width,
        height: template.dimensions.height,
        labels: { ...template.labels },
        element: null,
        cache: {},
      };

      node.element = createNodeElement(node);
      stageEl.append(node.element);
      nodeLookup.set(node.id, node);
      state.nodes.push(node);
      updateNodeElement(node);
      setSelection(node.id);
      scheduleRenderConnections();
      return node;
    } catch (error) {
      console.error('Node creation failed:', error);
      return null;
    }
  };

  const createConnection = (fromNodeId, toNodeId) => {
    if (!fromNodeId || !toNodeId || fromNodeId === toNodeId) return null;
    const isDuplicate = state.connections.some(
      (c) => c.fromNodeId === fromNodeId && c.toNodeId === toNodeId
    );
    if (isDuplicate) return null;

    const connection = { fromNodeId, toNodeId };
    state.connections.push(connection);
    return connection;
  };

  const renderConnections = () => {
    try {
      svgEl.replaceChildren();
      const pathElements = [];

      state.connections.forEach((connection, index) => {
        const fromNode = nodeLookup.get(connection.fromNodeId);
        const toNode = nodeLookup.get(connection.toNodeId);
        if (!fromNode || !toNode) return;

        const startX = fromNode.cache.centerX;
        const startY = fromNode.cache.centerY;
        const endX = toNode.cache.centerX;
        const endY = toNode.cache.centerY;

        const angle = Math.atan2(endY - startY, endX - startX);
        const targetOffsetX = Math.cos(angle) * (toNode.width / 2);
        const targetOffsetY = Math.sin(angle) * (toNode.height / 2);

        const arrowEndX = endX - targetOffsetX;
        const arrowEndY = endY - targetOffsetY;
        const deltaX = arrowEndX - startX;
        const deltaY = arrowEndY - startY;
        const controlX = startX + deltaX / 2;
        const controlY =
          startY + deltaY / 2 - Math.max(30, Math.abs(deltaX) * 0.1);

        const path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        path.setAttribute(
          'd',
          `M ${startX} ${startY} Q ${controlX} ${controlY} ${arrowEndX} ${arrowEndY}`
        );
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('marker-end', 'url(#arrowhead)');

        const strokeColor =
          index % 2 === 0 ? 'var(--accent-blue)' : 'var(--accent-cyan)';
        path.style.stroke = strokeColor;
        path.style.color = strokeColor;

        svgEl.append(path);
        pathElements.push(path);
      });

      // Render the active dragging guideline path
      if (
        state.interaction.mode === 'connecting' &&
        state.interaction.sourceNodeId
      ) {
        const fromNode = nodeLookup.get(state.interaction.sourceNodeId);
        if (fromNode) {
          const path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );
          path.setAttribute(
            'd',
            `M ${fromNode.cache.centerX} ${fromNode.cache.centerY} L ${state.interaction.tempLineEndX} ${state.interaction.tempLineEndY}`
          );
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke-width', '3');
          path.setAttribute('stroke-dasharray', '6,6');
          path.setAttribute('stroke', 'var(--accent-blue-strong)');
          path.setAttribute('marker-end', 'url(#arrowhead)');
          svgEl.append(path);
          pathElements.push(path);
        }
      }
      svgState.connectionElements = pathElements;
    } catch (error) {
      console.error('Connection rendering failed:', error);
    }
  };

  const handleNodePointerDown = (event, node) => {
    if (event.button !== 0 || state.interaction.mode === 'connecting') return;
    event.preventDefault();
    event.stopPropagation();

    state.interaction.mode = 'node-drag';
    state.interaction.pointerId = event.pointerId;
    state.interaction.targetNodeId = node.id;
    state.interaction.startX = event.clientX;
    state.interaction.startY = event.clientY;
    state.interaction.originX = node.x;
    state.interaction.originY = node.y;
    state.interaction.moved = false;

    const currentTarget = event.currentTarget;
    currentTarget.classList.add('is-dragging');

    const handleMove = (e) => {
      if (e.pointerId !== state.interaction.pointerId) return;
      const deltaX = e.clientX - state.interaction.startX;
      const deltaY = e.clientY - state.interaction.startY;

      if (!state.interaction.moved && Math.hypot(deltaX, deltaY) > 2) {
        state.interaction.moved = true;
      }

      const nextX =
        state.interaction.originX + deltaX / state.viewport.scaleZoom;
      const nextY =
        state.interaction.originY + deltaY / state.viewport.scaleZoom;
      const targetNode = nodeLookup.get(node.id);

      if (targetNode) {
        targetNode.x = nextX;
        targetNode.y = nextY;
        updateNodeElement(targetNode);
        scheduleRenderConnections();
      }
    };

    const handleUp = (e) => {
      if (e.pointerId !== state.interaction.pointerId) return;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      currentTarget.classList.remove('is-dragging');

      state.interaction.mode = null;
      state.interaction.pointerId = null;
      state.interaction.targetNodeId = null;
      if (state.interaction.moved) scheduleRenderConnections();
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    setSelection(node.id);
  };

  const handlePortPointerDown = (event, node, dir) => {
    event.stopPropagation();
    event.preventDefault();

    state.interaction.mode = 'connecting';
    state.interaction.sourceNodeId = node.id;
    state.interaction.tempLineEndX = node.cache.centerX;
    state.interaction.tempLineEndY = node.cache.centerY;

    const handleMove = (e) => {
      const pt = getStagePoint(e.clientX, e.clientY);
      state.interaction.tempLineEndX = pt.x;
      state.interaction.tempLineEndY = pt.y;
      scheduleRenderConnections();
    };

    const handleUp = (e) => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);

      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const targetNodeEl = elementBelow?.closest('.shape-node');

      if (targetNodeEl) {
        const targetNodeId = targetNodeEl.dataset.nodeId;
        if (targetNodeId && targetNodeId !== node.id) {
          createConnection(node.id, targetNodeId);
        }
      }

      state.interaction.mode = null;
      state.interaction.sourceNodeId = null;
      scheduleRenderConnections();
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleViewportPointerDown = (event) => {
    if (event.button !== 0 || event.target.closest('.shape-node')) return;
    state.interaction.mode = 'pan';
    state.interaction.pointerId = event.pointerId;
    state.interaction.startX = event.clientX;
    state.interaction.startY = event.clientY;
    state.interaction.panOriginX = state.viewport.panX;
    state.interaction.panOriginY = state.viewport.panY;

    const handleMove = (e) => {
      if (e.pointerId !== state.interaction.pointerId) return;
      state.viewport.panX =
        state.interaction.panOriginX + (e.clientX - state.interaction.startX);
      state.viewport.panY =
        state.interaction.panOriginY + (e.clientY - state.interaction.startY);
      applyViewportTransform();
    };

    const handleUp = (e) => {
      if (e.pointerId !== state.interaction.pointerId) return;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      state.interaction.mode = null;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleWorkspaceClick = (event) => {
    if (!event.target.closest('.shape-node')) clearWorkspaceTargets();
  };

  const handleTemplateCardClick = (event) => {
    const card = event.currentTarget.closest('.shape-card');
    if (!card) return;
    const type = card.dataset.nodeType;
    addNode(type, getNodeTemplatePosition(type));
  };

  const handleTemplateDragStart = (event) => {
    const card = event.currentTarget.closest('.shape-card');
    if (!card) return;
    const type = card.dataset.nodeType;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', type);
    state.selection.activeTemplateType = type;
  };

  const handleWorkspaceDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleWorkspaceDrop = (event) => {
    event.preventDefault();
    const type =
      event.dataTransfer.getData('text/plain') ||
      state.selection.activeTemplateType;
    if (!type) return;

    const dropPoint = getStagePoint(event.clientX, event.clientY);
    const template = getTemplate(type);
    addNode(type, {
      x: dropPoint.x - template.dimensions.width / 2,
      y: dropPoint.y - template.dimensions.height / 2,
    });
  };

  const zoomViewport = (direction) => {
    const nextZoom = clamp(
      state.viewport.scaleZoom + direction * 0.1,
      0.45,
      2.5
    );
    state.viewport.scaleZoom = Number(nextZoom.toFixed(2));
    applyViewportTransform();
    scheduleRenderConnections();
  };

  const resetViewport = () => {
    state.viewport.panX = 0;
    state.viewport.panY = 0;
    state.viewport.scaleZoom = 1;
    applyViewportTransform();
    scheduleRenderConnections();
  };

  const clearWorkspace = () => {
    state.nodes.forEach((node) => node.element?.remove());

    state.nodes = [];
    state.connections = [];

    nodeLookup.clear();

    clearWorkspaceTargets();

    // Remove only dynamic SVG elements
    svgEl
      .querySelectorAll('path:not(defs path)')
      .forEach((path) => path.remove());

    svgState.connectionElements = [];
  };
git 
  const bindToolbar = () => {
    toolbarButtons.forEach((button) => {
      if (button === themeToggleBtn) {
        button.addEventListener('click', toggleTheme);
        return;
      }

      const label = button.textContent.trim();
      button.addEventListener('click', () => {
        if (label === 'Zoom In') zoomViewport(1);
        else if (label === 'Zoom Out') zoomViewport(-1);
        else if (label === 'Reset Viewport') resetViewport();
        else if (label === 'Clear Workspace') clearWorkspace();
      });
    });
  };

  const bindTemplateTray = () => {
    Array.from(trayEl.querySelectorAll('.shape-card')).forEach((card) => {
      const type = card.classList.contains('shape-card--decision')
        ? 'decision'
        : card.classList.contains('shape-card--terminal')
          ? 'terminal'
          : 'process';
      card.dataset.nodeType = type;
      card.addEventListener('click', handleTemplateCardClick);
      card.addEventListener('dragstart', handleTemplateDragStart);
    });
  };

  const bindWorkspaceEvents = () => {
    viewportEl.addEventListener('pointerdown', handleViewportPointerDown);
    viewportEl.addEventListener('click', handleWorkspaceClick);
    viewportEl.addEventListener('dragenter', (e) => e.preventDefault());
    viewportEl.addEventListener('dragover', handleWorkspaceDragOver);
    viewportEl.addEventListener('drop', handleWorkspaceDrop);
  };

  const bootstrap = () => {
    syncStageMetrics();
    applyViewportTransform();
    bindToolbar();
    bindTemplateTray();
    bindWorkspaceEvents();
    window.addEventListener('resize', () => {
      syncStageMetrics();
      scheduleRenderConnections();
    });
  };

  bootstrap();
})();

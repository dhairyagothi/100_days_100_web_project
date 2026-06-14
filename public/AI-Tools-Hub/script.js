console.log('🤖 AI Tools Hub - Welcome!');

// === COMPREHENSIVE TOOLS DATA ===
const toolsData = [
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "Coding & Development",
    description: "Your AI pair programmer. Get code suggestions in real-time as you write.",
    url: "https://github.com/copilot",
    pricing: "Freemium ($10+/mo)",
    api: "Yes",
    features: "Code completion, Chat, Multi-language, IDE integration",
    useCases: "Coding assistance, Code completion, Pair programming"
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "Coding & Development",
    description: "AI-first code editor designed for pair-programming with AI.",
    url: "https://cursor.so",
    pricing: "Freemium ($20+/mo)",
    api: "Yes",
    features: "Code completion, Chat, Refactoring, Debugging",
    useCases: "Code editing, Refactoring, Debugging"
  },
  {
    id: "codeium",
    name: "Codeium",
    category: "Coding & Development",
    description: "Free AI-powered code completion and chat for every IDE.",
    url: "https://codeium.com",
    pricing: "Free",
    api: "Yes",
    features: "Code completion, Chat, 70+ languages, IDE plugins",
    useCases: "Coding assistance, Code completion"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "Design & Images",
    description: "Create beautiful, unique images from text descriptions.",
    url: "https://midjourney.com",
    pricing: "Paid ($10+/mo)",
    api: "Yes",
    features: "Image generation, Style customization, Remixing, Vary region",
    useCases: "Image creation, Digital art, Concept design"
  },
  {
    id: "dalle-3",
    name: "DALL·E 3",
    category: "Design & Images",
    description: "OpenAI's latest image generation model with stunning quality.",
    url: "https://openai.com/dall-e-3",
    pricing: "Pay-as-you-go",
    api: "Yes",
    features: "Image generation, Text-to-image, High resolution, Quality options",
    useCases: "Image creation, Design, Content creation"
  },
  {
    id: "figma-ai",
    name: "Figma AI",
    category: "Design & Images",
    description: "AI-powered design assistant built directly into Figma.",
    url: "https://figma.com",
    pricing: "Freemium ($12+/mo)",
    api: "Yes",
    features: "Design suggestions, UI generation, Prototyping, Collaboration",
    useCases: "UI design, Prototyping, Design collaboration"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Writing & Content",
    description: "Advanced language model for conversation and content creation.",
    url: "https://chat.openai.com",
    pricing: "Freemium ($20+/mo)",
    api: "Yes",
    features: "Text generation, Chat, Code, DALL·E integration, Plugins",
    useCases: "Content creation, Coding, Research, Chat"
  },
  {
    id: "claude",
    name: "Claude",
    category: "Writing & Content",
    description: "Anthropic's AI assistant for thoughtful, harmless, and helpful interactions.",
    url: "https://anthropic.com",
    pricing: "Freemium ($20+/mo)",
    api: "Yes",
    features: "Text generation, Long context, Coding, Analysis",
    useCases: "Content creation, Analysis, Coding"
  },
  {
    id: "jasper",
    name: "Jasper",
    category: "Writing & Content",
    description: "AI copywriter for marketing, blogs, and social media.",
    url: "https://jasper.ai",
    pricing: "Paid ($49+/mo)",
    api: "Yes",
    features: "Marketing copy, Blog writing, Social media, Brand voice",
    useCases: "Marketing copy, Blog writing, Content creation"
  },
  {
    id: "gamma",
    name: "Gamma",
    category: "Presentation & Slides",
    description: "Create beautiful presentations and documents with AI.",
    url: "https://gamma.app",
    pricing: "Freemium ($10+/mo)",
    api: "No",
    features: "Slide generation, Documents, Web pages, Analytics",
    useCases: "Presentations, Documentation, Content creation"
  },
  {
    id: "tome",
    name: "Tome",
    category: "Presentation & Slides",
    description: "AI-powered storytelling platform for presentations.",
    url: "https://tome.app",
    pricing: "Freemium ($8+/mo)",
    api: "No",
    features: "Presentation generation, Storytelling, Embeds, Sharing",
    useCases: "Presentations, Storytelling, Content creation"
  },
  {
    id: "beautiful-ai",
    name: "Beautiful.ai",
    category: "Presentation & Slides",
    description: "Smart presentation maker that designs your slides.",
    url: "https://beautiful.ai",
    pricing: "Paid ($12+/mo)",
    api: "No",
    features: "Slide templates, Smart design, Branding, Analytics",
    useCases: "Presentations, Business slides, Design"
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    category: "Productivity & Office",
    description: "AI assistant built into your Notion workspace.",
    url: "https://notion.so",
    pricing: "Freemium ($8+/mo)",
    api: "Yes",
    features: "Note generation, Summarization, Writing help, Task management",
    useCases: "Note-taking, Task management, Documentation"
  },
  {
    id: "microsoft-copilot",
    name: "Microsoft Copilot",
    category: "Productivity & Office",
    description: "AI assistant for Microsoft 365 apps and Windows.",
    url: "https://microsoft.com/copilot",
    pricing: "Freemium ($20+/mo)",
    api: "Yes",
    features: "Office integration, Windows assistant, Code, Bing chat",
    useCases: "Office work, Windows assistance, Coding"
  },
  {
    id: "google-gemini",
    name: "Google Gemini",
    category: "Productivity & Office",
    description: "Google's AI assistant for Workspace and beyond.",
    url: "https://gemini.google.com",
    pricing: "Freemium ($20+/mo)",
    api: "Yes",
    features: "Text generation, Multimodal, Workspace integration, Search",
    useCases: "Content creation, Search, Productivity"
  },
  {
    id: "sora",
    name: "Sora",
    category: "Video, Voice & Media",
    description: "OpenAI's AI video generation model for creating videos.",
    url: "https://openai.com/sora",
    pricing: "Waitlist",
    api: "Coming soon",
    features: "Video generation, Text-to-video, Long videos, Multi-scene",
    useCases: "Video creation, Content creation, Visual storytelling"
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "Video, Voice & Media",
    description: "AI voice generation and text-to-speech platform.",
    url: "https://elevenlabs.io",
    pricing: "Freemium ($5+/mo)",
    api: "Yes",
    features: "Voice generation, Voice cloning, Text-to-speech, Dubbing",
    useCases: "Voice creation, Audio content, Dubbing"
  },
  {
    id: "runway",
    name: "Runway",
    category: "Video, Voice & Media",
    description: "Professional AI video editing and generation tools.",
    url: "https://runwayml.com",
    pricing: "Freemium ($12+/mo)",
    api: "Yes",
    features: "Video editing, Generation, Inpainting, Motion brush",
    useCases: "Video editing, Content creation, Post-production"
  },
  {
    id: "heygen",
    name: "HeyGen",
    category: "Video, Voice & Media",
    description: "Create professional AI videos with talking avatars.",
    url: "https://heygen.com",
    pricing: "Freemium ($18+/mo)",
    api: "Yes",
    features: "Talking avatars, Video generation, Voice cloning, Templates",
    useCases: "Video creation, Content creation, Marketing videos"
  }
];

// === COLLECTIONS DATA ===
const collections = {
  students: ["chatgpt", "claude", "notion-ai", "gamma", "codeium"],
  developers: ["github-copilot", "cursor", "codeium", "chatgpt", "claude"],
  designers: ["midjourney", "dalle-3", "figma-ai", "gamma", "tome"],
  free: ["codeium", "chatgpt", "claude", "gamma", "tome"],
  productivity: ["notion-ai", "microsoft-copilot", "google-gemini", "gamma", "tome"]
};

// === LOCAL STORAGE HELPERS ===
const FAVORITES_KEY = 'ai-tools-hub-favorites';
const RECENT_KEY = 'ai-tools-hub-recent';

function getFavorites() {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function getRecent() {
  const stored = localStorage.getItem(RECENT_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRecent(recent) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}

function addToRecent(toolId) {
  let recent = getRecent();
  recent = recent.filter(id => id !== toolId);
  recent.unshift(toolId);
  if (recent.length > 5) recent.pop();
  saveRecent(recent);
  renderRecent();
}

// === TOAST NOTIFICATION ===
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// === RENDER FAVORITES SECTION ===
function renderFavorites() {
  const favoritesGrid = document.getElementById('favorites-grid');
  const favorites = getFavorites();
  
  if (favorites.length === 0) {
    favoritesGrid.innerHTML = `
      <div id="empty-favorites" class="empty-state">
        <div class="empty-state-icon">💖</div>
        <h4>No favorites yet</h4>
        <p>Click the heart icon on any tool to add it to your favorites!</p>
      </div>
    `;
    return;
  }

  favoritesGrid.innerHTML = favorites.map(tool => `
    <div class="tool-card glass-card" data-tool-id="${tool.id}">
      <button class="favorite-btn favorited" aria-label="Remove ${tool.name} from favorites">
        <span class="heart-icon">❤️</span>
      </button>
      <span class="tool-badge">${tool.category}</span>
      <h4 class="tool-name">${tool.name}</h4>
      <p class="tool-description">${tool.description}</p>
      <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn-primary" aria-label="Visit ${tool.name} website">Visit Website</a>
    </div>
  `).join('');

  attachFavoriteListeners();
  attachToolClickListeners();
}

// === RENDER RECENT SECTION ===
function renderRecent() {
  const recentGrid = document.getElementById('recent-grid');
  const recent = getRecent();
  
  if (recent.length === 0) {
    recentGrid.innerHTML = `
      <div id="empty-recent" class="empty-state">
        <div class="empty-state-icon">👀</div>
        <h4>No tools viewed yet</h4>
        <p>Start exploring tools to see them here!</p>
      </div>
    `;
    return;
  }

  const recentTools = recent.map(id => toolsData.find(t => t.id === id)).filter(Boolean);

  recentGrid.innerHTML = recentTools.map(tool => `
    <div class="tool-card glass-card" data-tool-id="${tool.id}">
      <button class="favorite-btn" aria-label="${getFavorites().some(f => f.id === tool.id) ? 'Remove from favorites' : 'Add to favorites'}">
        <span class="heart-icon">${getFavorites().some(f => f.id === tool.id) ? '❤️' : '🤍'}</span>
      </button>
      <span class="tool-badge">${tool.category}</span>
      <h4 class="tool-name">${tool.name}</h4>
      <p class="tool-description">${tool.description}</p>
      <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn-primary" aria-label="Visit ${tool.name} website">Visit Website</a>
    </div>
  `).join('');

  attachFavoriteListeners();
  attachToolClickListeners();
  updateAllFavoriteButtons();
}

// === TOGGLE FAVORITE ===
function toggleFavorite(toolId) {
  let favorites = getFavorites();
  const tool = toolsData.find(t => t.id === toolId);
  if (!tool) return;

  const index = favorites.findIndex(f => f.id === toolId);
  if (index > -1) {
    favorites.splice(index, 1);
    showToast(`${tool.name} removed from favorites`);
  } else {
    favorites.push({
      id: tool.id,
      name: tool.name,
      category: tool.category,
      description: tool.description,
      url: tool.url
    });
    showToast(`${tool.name} added to favorites!`);
  }

  saveFavorites(favorites);
  updateAllFavoriteButtons();
  renderFavorites();
  renderRecent();
}

// === UPDATE ALL FAVORITE BUTTONS ===
function updateAllFavoriteButtons() {
  const favorites = getFavorites();
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  
  favoriteButtons.forEach(btn => {
    const toolCard = btn.closest('.tool-card');
    if (!toolCard) return;
    const toolId = toolCard.dataset.toolId;
    const isFavorited = favorites.some(f => f.id === toolId);
    
    if (isFavorited) {
      btn.classList.add('favorited');
      if (btn.querySelector('.heart-icon')) {
        btn.querySelector('.heart-icon').textContent = '❤️';
      }
    } else {
      btn.classList.remove('favorited');
      if (btn.querySelector('.heart-icon')) {
        btn.querySelector('.heart-icon').textContent = '🤍';
      }
    }
  });
}

// === ATTACH FAVORITE LISTENERS ===
function attachFavoriteListeners() {
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  favoriteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const toolCard = btn.closest('.tool-card');
      toggleFavorite(toolCard.dataset.toolId);
    });
  });
}

// === ATTACH TOOL CLICK LISTENERS (FOR RECENT) ===
function attachToolClickListeners() {
  const toolCards = document.querySelectorAll('.tool-card');
  toolCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      addToRecent(card.dataset.toolId);
    });
  });
}

// === COMPARISON FUNCTIONS ===
function initComparisonSelects() {
  const select1 = document.getElementById('tool-select-1');
  const select2 = document.getElementById('tool-select-2');
  
  toolsData.forEach(tool => {
    const option1 = document.createElement('option');
    option1.value = tool.id;
    option1.textContent = tool.name;
    select1.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = tool.id;
    option2.textContent = tool.name;
    select2.appendChild(option2);
  });
}

function renderComparison() {
  const tool1Id = document.getElementById('tool-select-1').value;
  const tool2Id = document.getElementById('tool-select-2').value;
  const comparisonTable = document.getElementById('comparison-table');

  if (!tool1Id || !tool2Id) {
    comparisonTable.innerHTML = '<p class="comparison-empty">Please select both tools to compare.</p>';
    comparisonTable.classList.remove('hidden');
    return;
  }

  const tool1 = toolsData.find(t => t.id === tool1Id);
  const tool2 = toolsData.find(t => t.id === tool2Id);

  comparisonTable.innerHTML = `
    <table class="comparison-table-content">
      <thead>
        <tr>
          <th class="comparison-feature">Feature</th>
          <th class="comparison-tool">${tool1.name}</th>
          <th class="comparison-tool">${tool2.name}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="comparison-feature">Category</td>
          <td>${tool1.category}</td>
          <td>${tool2.category}</td>
        </tr>
        <tr>
          <td class="comparison-feature">Pricing</td>
          <td>${tool1.pricing}</td>
          <td>${tool2.pricing}</td>
        </tr>
        <tr>
          <td class="comparison-feature">API Available</td>
          <td>${tool1.api}</td>
          <td>${tool2.api}</td>
        </tr>
        <tr>
          <td class="comparison-feature">Key Features</td>
          <td>${tool1.features}</td>
          <td>${tool2.features}</td>
        </tr>
        <tr>
          <td class="comparison-feature">Best Use Cases</td>
          <td>${tool1.useCases}</td>
          <td>${tool2.useCases}</td>
        </tr>
        <tr>
          <td class="comparison-feature">Description</td>
          <td>${tool1.description}</td>
          <td>${tool2.description}</td>
        </tr>
      </tbody>
    </table>
    <div class="comparison-actions">
      <a href="${tool1.url}" target="_blank" rel="noopener noreferrer" class="btn-primary">Visit ${tool1.name}</a>
      <a href="${tool2.url}" target="_blank" rel="noopener noreferrer" class="btn-primary">Visit ${tool2.name}</a>
    </div>
  `;
  comparisonTable.classList.remove('hidden');
}

// === COLLECTIONS FUNCTION ===
function renderCollection(collectionId) {
  const toolIds = collections[collectionId];
  if (!toolIds) return;

  const collectionTools = toolIds.map(id => toolsData.find(t => t.id === id)).filter(Boolean);
  
  // Scroll to tools section
  const toolsSection = document.getElementById('tools');
  toolsSection.scrollIntoView({ behavior: 'smooth' });

  // Filter and show only collection tools (we'll just show a toast for now)
  const collectionNames = {
    students: "Best Tools for Students",
    developers: "Best Tools for Developers",
    designers: "Best Tools for Designers",
    free: "Best Free AI Tools",
    productivity: "Best Productivity AI Tools"
  };
  
  showToast(`Showing: ${collectionNames[collectionId]}`);
}

function attachCollectionListeners() {
  document.querySelectorAll('.collection-card button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.collection-card');
      const collectionId = card.dataset.collection;
      renderCollection(collectionId);
    });
  });
}

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

function initAnimations() {
  const cardsToAnimate = document.querySelectorAll('.tool-card, .category-card, .stat-card, .why-card, .trend-card, .collection-card');
  cardsToAnimate.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    observer.observe(card);
  });
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
  initComparisonSelects();
  attachCollectionListeners();
  updateAllFavoriteButtons();
  renderFavorites();
  renderRecent();
  attachFavoriteListeners();
  attachToolClickListeners();
  initAnimations();

  // Comparison button listener
  document.getElementById('compare-btn').addEventListener('click', renderComparison);
  document.getElementById('tool-select-1').addEventListener('change', renderComparison);
  document.getElementById('tool-select-2').addEventListener('change', renderComparison);
});

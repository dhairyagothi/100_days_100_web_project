const header = document.querySelector(".header");
const menuToggle = document.querySelector(".fa-bars");
const navbar = document.querySelector(".navbar");

const searchInput = document.getElementById("articleSearch");
const filterButtons = document.querySelectorAll(".filter-pill");
const featuredContainer = document.getElementById("featuredContainer");
const articlesGrid = document.getElementById("articlesGrid");
const resultsCount = document.getElementById("resultsCount");

const modal = document.getElementById("articleModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalImage = document.getElementById("modalImage");
const modalBadge = document.getElementById("modalBadge");
const modalRead = document.getElementById("modalRead");
const modalClose = document.querySelector(".modal-close");

const articles = [
  {
    id: 1,
    title: "How Trees Help Reduce Urban Heat Islands",
    category: "Urban Forestry",
    description:
      "Learn how urban forestry helps lower temperatures and improve city environments.",
    readTime: "5 min read",
    image: "./images/home.jpg",
    featured: true,
    contentPoints: [
      "Shade from mature canopies lowers surface temperatures and reduces heat stress.",
      "Evapotranspiration cools the air and improves thermal comfort in dense neighborhoods.",
      "Targeted planting near streets and rooftops cuts cooling energy demand.",
      "Tree cover reduces smog formation by lowering ambient temperatures.",
      "Well-spaced canopies keep sidewalks walkable and encourage active transport.",
      "Diverse species selection builds resilience against pests and drought.",
    ],
  },
  {
    id: 2,
    title: "Tree Care Basics for New Planters",
    category: "Tree Care",
    description:
      "Watering, mulching, and pruning tips that help young trees thrive in their first year.",
    readTime: "4 min read",
    image: "./images/plant-1.png",
    featured: false,
    contentPoints: [
      "Water deeply once or twice a week instead of frequent shallow watering.",
      "Add a wide mulch ring to reduce evaporation and regulate soil temperature.",
      "Keep mulch a few inches away from the trunk to avoid rot and pests.",
      "Stake only if necessary and remove supports after the first season.",
      "Prune broken branches early to direct energy into strong structure.",
      "Check soil moisture before watering to avoid over-saturation.",
    ],
  },
  {
    id: 3,
    title: "Climate Action Starts with Local Canopies",
    category: "Climate Action",
    description:
      "Neighborhood tree cover is a frontline solution for climate resilience and clean air.",
    readTime: "6 min read",
    image: "./images/plant-2.png",
    featured: false,
    contentPoints: [
      "Local canopy cover absorbs carbon dioxide and filters particulate pollution.",
      "Neighborhood planting reduces cooling costs by shading buildings.",
      "Tree corridors improve walkability and reduce vehicle emissions.",
      "Community-led stewardship increases survival rates after planting.",
      "Prioritize heat-vulnerable blocks for maximum public health gains.",
      "Pair trees with bioswales to capture stormwater and reduce flooding.",
    ],
  },
  {
    id: 4,
    title: "Sustainable Living: Small Changes, Big Impact",
    category: "Sustainability",
    description: "Daily habits that reduce waste and support a greener future.",
    readTime: "5 min read",
    image: "./images/about.png",
    featured: false,
    contentPoints: [
      "Swap single-use plastics for reusable bottles, bags, and containers.",
      "Choose energy-efficient lighting and appliances to cut electricity use.",
      "Eat more plant-forward meals to reduce your carbon footprint.",
      "Repair, reuse, and thrift to extend product life cycles.",
      "Support local growers to lower transportation emissions.",
      "Track your household waste and set monthly reduction goals.",
    ],
  },
  {
    id: 5,
    title: "Urban Forestry Programs That Work",
    category: "Urban Forestry",
    description: "What successful city tree programs have in common.",
    readTime: "7 min read",
    image: "./images/img-1.jpg",
    featured: false,
    contentPoints: [
      "Start with community engagement to build shared ownership.",
      "Plant a mix of species to reduce disease and pest risks.",
      "Secure funding for watering, pruning, and replacement cycles.",
      "Use tree inventories to track survival rates and canopy growth.",
      "Train local volunteers in basic care and reporting issues.",
      "Pair plantings with heat and air quality data to show impact.",
    ],
  },
  {
    id: 6,
    title: "Eco Health: Trees and Mental Wellbeing",
    category: "Eco Health",
    description:
      "Green spaces improve mood, focus, and overall health outcomes.",
    readTime: "4 min read",
    image: "./images/faq.png",
    featured: false,
    contentPoints: [
      "Tree-lined spaces reduce stress hormones and improve mood.",
      "Short nature breaks restore attention and reduce mental fatigue.",
      "Green views have been linked to better sleep and recovery.",
      "Outdoor activity in parks increases social connection and wellbeing.",
      "Cooler microclimates encourage longer, safer outdoor time.",
      "Planting trees near schools supports focus and learning outcomes.",
    ],
  },
  {
    id: 7,
    title: "Water-Wise Planting for Dry Seasons",
    category: "Tree Care",
    description:
      "Drought-resilient species and irrigation practices to save water.",
    readTime: "6 min read",
    image: "./images/plant-3.png",
    featured: false,
    contentPoints: [
      "Choose native or drought-tolerant species suited to local rainfall.",
      "Use drip irrigation or slow-release bags to minimize waste.",
      "Build soil organic matter for better water retention.",
      "Water early in the morning to reduce evaporation loss.",
      "Mulch consistently to keep roots cool and protected.",
      "Monitor for heat stress and adjust schedules during heat waves.",
    ],
  },
  {
    id: 8,
    title: "Composting for a Healthier Planet",
    category: "Sustainability",
    description:
      "Turn kitchen scraps into soil that feeds urban gardens and tree pits.",
    readTime: "5 min read",
    image: "./images/contact.jpg",
    featured: false,
    contentPoints: [
      "Balance greens (food scraps) with browns (dry leaves, paper).",
      "Keep the pile moist like a wrung-out sponge.",
      "Turn weekly to add oxygen and speed up decomposition.",
      "Avoid meat, dairy, and oils to reduce odors and pests.",
      "Use finished compost to enrich tree pits and gardens.",
      "Start small and scale as you build a routine.",
    ],
  },
  {
    id: 9,
    title: "Community Tree Drives: How to Get Started",
    category: "Climate Action",
    description: "Planning tips for volunteer-led planting events.",
    readTime: "5 min read",
    image: "./images/img-2.jpg",
    featured: false,
    contentPoints: [
      "Select a site with local support and reliable water access.",
      "Coordinate permits and planting dates with city partners.",
      "Plan aftercare before planting to avoid early tree loss.",
      "Train volunteers on proper planting depth and staking.",
      "Create a watering rota for the first two summers.",
      "Document results to share impact and attract new partners.",
    ],
  },
  {
    id: 10,
    title: "How Trees Reduce City Heat",
    category: "Urban Forestry",
    description:
      "Practical cooling benefits of shade and canopy cover in busy districts.",
    readTime: "5 min read",
    image: "./images/img-3.jpg",
    featured: false,
    contentPoints: [
      "Dense canopies reduce surface temperatures on streets and plazas.",
      "Tree shade slows asphalt heat storage, lowering nighttime temps.",
      "Cooling corridors improve pedestrian comfort and mobility.",
      "Strategic placement helps protect vulnerable populations in heat waves.",
      "Couple trees with reflective materials for even greater impact.",
      "Regular pruning keeps airflow moving through dense canopy zones.",
    ],
  },
  {
    id: 11,
    title: "Beginner's Guide to Tree Care",
    category: "Tree Care",
    description:
      "A starter checklist for selecting, planting, and protecting young trees.",
    readTime: "6 min read",
    image: "./images/plant-2.png",
    featured: false,
    contentPoints: [
      "Pick a planting site with full sun and enough root space.",
      "Dig a wide, shallow hole to encourage outward root growth.",
      "Water slowly after planting to remove air pockets.",
      "Mulch to reduce weeds and stabilize soil moisture.",
      "Protect trunks from lawn equipment and animals.",
      "Track growth monthly to spot stress early.",
    ],
  },
  {
    id: 12,
    title: "Best Trees for Urban Areas",
    category: "Urban Forestry",
    description:
      "Resilient species that thrive in compact soils and city conditions.",
    readTime: "7 min read",
    image: "./images/plant-1.png",
    featured: false,
    contentPoints: [
      "Choose species with compact root systems for sidewalks.",
      "Look for drought-tolerant varieties to handle heat stress.",
      "Use diverse species to avoid canopy loss from a single pest.",
      "Check clearance needs near power lines and buildings.",
      "Prioritize native or adapted species for lower maintenance.",
      "Plant in groups to create continuous shade corridors.",
    ],
  },
  {
    id: 13,
    title: "Carbon Footprint Explained",
    category: "Climate Action",
    description:
      "What carbon footprints include and how trees offset emissions.",
    readTime: "5 min read",
    image: "./images/about.png",
    featured: false,
    contentPoints: [
      "Your footprint includes energy use, travel, food, and purchases.",
      "Trees capture carbon, but emissions reductions still matter most.",
      "Shift to efficient transport to cut high-impact emissions.",
      "Reduce home energy use with insulation and efficient appliances.",
      "Support local reforestation projects with transparent reporting.",
      "Track changes annually to see progress.",
    ],
  },
  {
    id: 14,
    title: "Sustainable Gardening Tips",
    category: "Sustainability",
    description:
      "Low-impact garden habits that improve soil and conserve water.",
    readTime: "6 min read",
    image: "./images/contact.jpg",
    featured: false,
    contentPoints: [
      "Use compost to enrich soil instead of synthetic fertilizers.",
      "Plant perennials to reduce annual soil disturbance.",
      "Collect rainwater for irrigation when possible.",
      "Group plants by water needs to avoid overwatering.",
      "Encourage pollinators with native flowering species.",
      "Mulch pathways to reduce weed growth and evaporation.",
    ],
  },
  {
    id: 15,
    title: "Importance of Native Species",
    category: "Eco Health",
    description:
      "Why local plants support biodiversity and resilient ecosystems.",
    readTime: "5 min read",
    image: "./images/img-4.jpg",
    featured: false,
    contentPoints: [
      "Native plants provide food and habitat for local wildlife.",
      "They require less water and fewer inputs once established.",
      "Native species improve soil health and reduce erosion.",
      "Diverse plantings strengthen ecosystem resilience.",
      "Local biodiversity supports pollination and natural pest control.",
      "Partner with native plant nurseries for best selections.",
    ],
  },
  {
    id: 16,
    title: "Tree-Friendly Street Design",
    category: "Urban Forestry",
    description: "Design principles that give street trees room to grow.",
    readTime: "6 min read",
    image: "./images/home.jpg",
    featured: false,
    contentPoints: [
      "Provide larger soil volumes with structural soil systems.",
      "Use permeable paving to improve water infiltration.",
      "Keep root flare exposed to prevent trunk decay.",
      "Align tree pits with stormwater channels for natural irrigation.",
      "Protect roots during construction with clear exclusion zones.",
      "Plan maintenance access to avoid damaging trunks.",
    ],
  },
  {
    id: 17,
    title: "Everyday Ways to Cut Plastic Use",
    category: "Sustainability",
    description: "Simple swaps that reduce waste and protect ecosystems.",
    readTime: "4 min read",
    image: "./images/faq.png",
    featured: false,
    contentPoints: [
      "Carry reusable bags and water bottles daily.",
      "Choose refill options for soaps and cleaners.",
      "Avoid single-use cutlery and takeout containers.",
      "Buy in bulk to reduce packaging waste.",
      "Support brands with recyclable or compostable packaging.",
      "Recycle properly by following local guidelines.",
    ],
  },
];

const state = {
  searchTerm: "",
  activeCategory: "All",
};

const normalize = (value) => value.toLowerCase().trim();

const matchesSearch = (article, term) => {
  if (!term) {
    return true;
  }

  const haystack =
    `${article.title} ${article.category} ${article.description}`.toLowerCase();
  return haystack.includes(term);
};

const getFilteredArticles = () => {
  return articles.filter((article) => {
    const inCategory =
      state.activeCategory === "All" ||
      article.category === state.activeCategory;
    return inCategory && matchesSearch(article, state.searchTerm);
  });
};

const renderFeatured = (filteredArticles) => {
  const featuredArticle =
    filteredArticles.find((article) => article.featured) || filteredArticles[0];

  if (!featuredArticle) {
    featuredContainer.innerHTML =
      '<div class="featured-empty">No featured article matches your filters yet.</div>';
    return;
  }

  featuredContainer.innerHTML = `
        <article class="featured-card reveal">
            <div class="featured-media">
                <img src="${featuredArticle.image}" alt="${featuredArticle.title}">
            </div>
            <div class="featured-content">
                <span class="badge">${featuredArticle.category}</span>
                <h2>${featuredArticle.title}</h2>
                <p>${featuredArticle.description}</p>
                <div class="meta">
                    <span class="reading-time">${featuredArticle.readTime}</span>
                </div>
                <button class="read-more" type="button" data-article-id="${featuredArticle.id}">Read More</button>
            </div>
        </article>
    `;
};

const renderGrid = (filteredArticles) => {
  if (!filteredArticles.length) {
    articlesGrid.innerHTML =
      '<div class="empty-state">No articles found. Try a different search or category.</div>';
    return;
  }

  articlesGrid.innerHTML = filteredArticles
    .map(
      (article) => `
        <article class="article-card reveal">
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}">
            </div>
            <div class="article-content">
                <span class="badge">${article.category}</span>
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <div class="meta">
                    <span class="reading-time">${article.readTime}</span>
                </div>
                <button class="read-more" type="button" data-article-id="${article.id}">Read More</button>
            </div>
        </article>
    `,
    )
    .join("");
};

const updateResults = (filteredArticles) => {
  const count = filteredArticles.length;
  resultsCount.textContent = `${count} article${count === 1 ? "" : "s"} found`;
};

const renderAll = () => {
  const filtered = getFilteredArticles();
  renderFeatured(filtered);
  renderGrid(filtered);
  updateResults(filtered);
  observeReveals();
};

const setActiveCategory = (category) => {
  state.activeCategory = category;
  filterButtons.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive.toString());
  });
  renderAll();
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveCategory(button.dataset.category);
  });
});

searchInput.addEventListener("input", (event) => {
  state.searchTerm = normalize(event.target.value);
  renderAll();
});

const openModal = (article) => {
  modalTitle.textContent = article.title;
  modalBody.innerHTML = article.contentPoints
    .map((point) => `<li>${point}</li>`)
    .join("");
  modalImage.src = article.image;
  modalImage.alt = article.title;
  modalBadge.textContent = article.category;
  modalRead.textContent = article.readTime;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  modalClose.focus();
};

const closeModal = () => {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
};

const handleArticleClick = (event) => {
  const button = event.target.closest("[data-article-id]");
  if (!button) {
    return;
  }

  const articleId = Number(button.dataset.articleId);
  const article = articles.find((item) => item.id === articleId);
  if (article) {
    openModal(article);
  }
};

featuredContainer.addEventListener("click", handleArticleClick);
articlesGrid.addEventListener("click", handleArticleClick);

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

const observeReveals = () => {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
    observer.observe(element);
  });
};

const toggleMenu = () => {
  menuToggle.classList.toggle("fa-time");
  navbar.classList.toggle("nav-toggle");
};

const updateHeader = () => {
  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};

menuToggle.addEventListener("click", toggleMenu);
menuToggle.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleMenu();
  }
});

window.addEventListener("scroll", updateHeader);
window.addEventListener("load", () => {
  updateHeader();
  renderAll();
});

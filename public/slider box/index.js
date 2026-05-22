const categoryCollections = {
  cars: [
    ["Crimson Grand Tourer", "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85", "A polished performance mood with bold lines and road-trip energy."],
    ["Track Ready Coupe", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85", "A focused automotive frame for high-energy browsing."],
    ["City Cruiser", "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=85", "A sleek vehicle shot for people who love polished machines."],
    ["Desert Supercar", "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=85", "Sun-washed speed and sculpted metal on an open road."],
    ["Classic Roadster", "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=85", "Vintage curves with a timeless weekend-drive feeling."],
    ["Electric Concept", "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85", "Clean design, modern lines, and a futuristic street presence."],
    ["Mountain Drive", "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85", "A winding road scene built for adventure and motion."],
    ["Night Runner", "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=85", "Glossy reflections and dramatic city lights after dark."],
    ["Offroad Machine", "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1400&q=85", "A rugged frame for trails, dust, and weekend escapes."],
    ["Luxury Sedan", "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1400&q=85", "Premium details with a quiet, executive look."]
  ],
  animals: [
    ["Forest Companion", "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?auto=format&fit=crop&w=1400&q=85", "A close, expressive wildlife moment framed for detail."],
    ["Wild Gaze", "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1400&q=85", "A striking animal frame with strong contrast and character."],
    ["Arctic Watch", "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1400&q=85", "Cool-toned wildlife with a quiet, powerful presence."],
    ["Safari Pause", "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85", "Warm savanna light and a calm natural scene."],
    ["Ocean Glide", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85", "A graceful underwater mood with soft movement."],
    ["Feather Detail", "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1400&q=85", "Fine texture, color, and delicate natural form."],
    ["Gentle Giant", "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1400&q=85", "A peaceful animal portrait with scale and softness."],
    ["Rainforest Color", "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=1400&q=85", "Vibrant wildlife energy from a lush green world."],
    ["Snow Trail", "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1400&q=85", "A cinematic cold-weather animal scene."],
    ["Pasture Calm", "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1400&q=85", "Soft countryside light around a calm animal subject."]
  ],
  landscapes: [
    ["Quiet Alpine Road", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85", "Open views, soft light, and a calm route through nature."],
    ["Golden Valley", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85", "Wide natural scenery made for slow, immersive viewing."],
    ["Northern Lake", "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1400&q=85", "Still water, clean air, and a reflective horizon."],
    ["Desert Horizon", "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1400&q=85", "Minimal shapes and warm sand tones across open distance."],
    ["Coastal Edge", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85", "Cliffs, waves, and crisp coastal drama."],
    ["Forest Light", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=85", "Layered greens with sunbeams cutting through the trees."],
    ["Snow Peaks", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85", "Sharp peaks and bright cold air in a high-altitude frame."],
    ["Waterfall Path", "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1400&q=85", "Moving water surrounded by dense natural texture."],
    ["Misty Valley", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85", "Soft fog and gentle depth across rolling terrain."],
    ["Sunset Ridge", "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=85", "A warm final-light view with a cinematic edge."]
  ],
  bungalows: [
    ["Modern Hill Bungalow", "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=85", "Architecture with warm evening tones and a restful setting."],
    ["Glass House Retreat", "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85", "A clean getaway space with crisp edges and a quiet mood."],
    ["Tropical Villa", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85", "Relaxed architecture surrounded by bright vacation greenery."],
    ["Lakefront Stay", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85", "A peaceful home scene beside calm water."],
    ["Forest Cabin", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=85", "Wood, trees, and a warm retreat feeling."],
    ["Minimal Courtyard", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85", "Simple geometry with elegant outdoor living space."],
    ["Beach Bungalow", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85", "A breezy coastal stay with easy, sunlit charm."],
    ["Stone Hideaway", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85", "Textured walls and grounded countryside character."],
    ["Garden Residence", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=85", "A soft residential scene wrapped in green detail."],
    ["Evening Veranda", "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=85", "Warm lights, outdoor seating, and a restful evening mood."]
  ]
};

const slides = Object.entries(categoryCollections).flatMap(([category, items]) =>
  items.map(([title, src, description]) => ({
    title,
    category,
    description,
    src,
    type: "image",
    alt: `${title} ${category} image`
  }))
);

const wrapper = document.querySelector("#sliderWrapper");
const template = document.querySelector("#slideTemplate");
const categoryButtons = document.querySelectorAll(".category-btn");
const currentSlide = document.querySelector("#currentSlide");
const totalSlides = document.querySelector("#totalSlides");

let swiper;
let activeCategory = "all";

function formatCount(number) {
  return String(number).padStart(2, "0");
}

function getVisibleSlides() {
  if (activeCategory === "all") {
    return slides;
  }

  return slides.filter((slide) => slide.category === activeCategory);
}

function createMedia(slide) {
  if (slide.type === "video") {
    const video = document.createElement("video");
    video.src = slide.src;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("aria-label", slide.alt);
    return video;
  }

  const image = document.createElement("img");
  image.src = slide.src;
  image.alt = slide.alt;
  return image;
}

function renderSlides() {
  const visibleSlides = getVisibleSlides();
  wrapper.innerHTML = "";

  visibleSlides.forEach((slide) => {
    const node = template.content.cloneNode(true);
    const mediaFrame = node.querySelector(".media-frame");

    mediaFrame.appendChild(createMedia(slide));
    node.querySelector(".slide-category").textContent = slide.category;
    node.querySelector(".slide-title").textContent = slide.title;
    node.querySelector(".slide-description").textContent = slide.description;
    wrapper.appendChild(node);
  });

  totalSlides.textContent = formatCount(visibleSlides.length);
  currentSlide.textContent = visibleSlides.length ? "01" : "00";
}

function updateCounter() {
  if (!swiper) {
    return;
  }

  currentSlide.textContent = formatCount(swiper.realIndex + 1);
}

function initSwiper() {
  if (swiper) {
    swiper.destroy(true, true);
  }

  swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    speed: 650,
    keyboard: true,
    mousewheel: {
      forceToAxis: true
    },
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 130,
      modifier: 1.6,
      slideShadows: false
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    on: {
      slideChange: updateCounter
    }
  });

  updateCounter();
}

function setCategory(category) {
  activeCategory = category;

  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderSlides();
  initSwiper();
}

categoryButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => setCategory(button.dataset.category));
});

renderSlides();
initSwiper();

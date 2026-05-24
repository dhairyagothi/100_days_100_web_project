// ── Slide data: each entry has image path, place name, and location ──
let photos = [
  { src: "https://upload.wikimedia.org/wikipedia/commons/1/10/Somanath_mandir_%28cropped%29.jpg", 
    place: "Somnath Temple", 
    location: "Gir Somnath, Gujarat" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Rann_of_Kutch_-_White_Desert.jpg", 
    place: "White Desert Rann of Kutch", 
    location: "Kutch, Gujarat" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Kashi_Vishwanath.jpg", 
      place: "Kashi Vishwanath Temple", 
      location: "Varanasi, Uttar Pradesh" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg", 
    place: "Dashashwamedh Ghat", 
    location: "Varanasi, Uttar Pradesh" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Fatehput_Sikiri_Buland_Darwaza_gate_2010.jpg", 
    place: "Fatehpur Sikri", 
    location: "Agra, Uttar Pradesh" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Udaipur_Lake_India.JPG", 
    place: "Lake Pichola", 
    location: "Udaipur, Rajasthan" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/47/Jaisalmer_forteresse.jpg", 
    place: "Jaisalmer Fort", 
    location: "Jaisalmer, Rajasthan" 
  },
   { src: "https://upload.wikimedia.org/wikipedia/commons/6/66/Periyar_National_Park.JPG", 
    place: "Periyar Wildlife Sanctuary", 
    location: "Thekkady, Kerala" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/01KovalamBeach%26Kerala.jpg",
    place: "Kovalam Beach", 
    location: "Thiruvananthapuram, Kerala" 
  },
   { src: "https://upload.wikimedia.org/wikipedia/commons/6/65/India_Meenakshi_Temple.jpg", 
    place: "Meenakshi Amman Temple", 
    location: "Madurai, Tamil Nadu" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg", 
    place: "Brihadeeswarar Temple", 
    location: "Thanjavur, Tamil Nadu" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/1/15/Ellora_cave16_001.jpg", 
    place: "Ellora Caves", 
    location: "Aurangabad, Maharashtra" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Bhushi_Dam.JPG", 
    place: "Lonavala Bhushi Dam", 
    location: "Lonavala, Maharashtra" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Howrah_bridge_at_night.jpg", 
      place: "Howrah Bridge", 
      location: "Kolkata, West Bengal" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/25/Tea_Estate%2C_Darjeeling.jpg", 
    place: "Darjeeling Tea Gardens", 
    location: "Darjeeling, West Bengal" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mysore_Palace_Morning.jpg", 
      place: "Mysore Palace", 
      location: "Mysuru, Karnataka" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Jog_Falls_05092016.jpg", 
    place: "Jog Falls", 
    location: "Shivamogga, Karnataka" 
  },
  {
    src: "public/images/i1.jpg",
    place: "Mahakaleshwar Temple",
    location: "Ujjain, Madhya Pradesh, India"
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
     place: "Hawa Mahal",
     location: "Jaipur, Rajasthan" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Jodhpur_mehrangarh_fort_%28enhanced%29.jpg", 
    place: "Mehrangarh Fort", 
    location: "Jodhpur, Rajasthan" 
  },
  {
    src: "public/images/i2.jpg",
    place: "Mahakal Lok Corridor",
    location: "Ujjain, Madhya Pradesh, India"
  },
   { src: "https://upload.wikimedia.org/wikipedia/commons/e/ee/House_Boat_DSW.jpg", 
    place: "Alleppey Backwaters", 
    location: "Alappuzha, Kerala" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Munnar_Overview.jpg",
    place: "Munnar Tea Gardens", 
    location: "Munnar, Kerala" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Baga_Beach%2C_Calangute%2C_Goa.jpg", 
    place: "Baga Beach", 
    location: "North Goa" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Doodhsagar_Fall.jpg", 
    place: "Dudhsagar Falls", 
    location: "Goa–Karnataka Border" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg",
    place: "Basilica of Bom Jesus", 
    location: "Old Goa" 
  },
  {
    src: "public/images/i3.jpg",
    place: "Harsiddhi Mata Temple",
    location: "Ujjain, Madhya Pradesh, India"
  },
   { src: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Radha_Nagar_beach%2C_Havelock_Island%2C_Andamn%2C_India-_Sun_set_view.jpg", 
    place: "Radhanagar Beach", 
    location: "Havelock Island, Andaman & Nicobar" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Tarkarli_Photo_by_Sandeep_Wairkar.jpg", 
    place: "Tarkarli Beach", 
    location: "Sindhudurg, Maharashtra" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/7/72/A_beach_side_resort_at_Kadmat_Island%2C_Lakshadweep.jpg", 
    place: "Lakshadweep Lagoon", 
    location: "Lakshadweep Islands" 
  },
  {
    src: "public/images/i4.jpg",
    place: "Ram Ghat",
    location: "Ujjain, Madhya Pradesh, India"
  },
   { src: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Beauty_of_Kaziranga_National_Park.jpg", 
    place: "Kaziranga National Park", 
    location: "Golaghat, Assam" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg", 
    place: "Living Root Bridges", 
    location: "Cherrapunjee, Meghalaya" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/A_part_of_Loktak_Lake.jpg", 
    place: "Loktak Lake", 
    location: "Bishnupur, Manipur" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/8/80/Dzukou_Valley.jpg", 
    place: "Dzukou Valley", 
    location: "Kohima, Nagaland" 
  },
  {
    src: "public/images/i5.jpg",
    place: "diya (earthen lamp)",
    location: "present in the daily aartis performed at these temples and ghats, India"
  },
  {
    src: "public/images/i6.jpg",
    place: "Mangalnath Temple",
    location: "Ujjain, Madhya Pradesh, India"
  },
  { src: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
     place: "India Gate",
     location: "New Delhi" 
  },
  {
    src: "public/images/i7.jpg",
    place: "Mahakaleshwar Temple courtyard",
    location: "Ujjain, Madhya Pradesh, India"
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg", 
    place: "Konark Sun Temple", 
    location: "Puri, Odisha" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/0c/PURI_JAGANATHA_TEMPLE%2C_PURI%2C_ORISSA%2C_INDIA%2C_ASIA.jpg", 
    place: "Puri Jagannath Temple", 
    location: "Puri, Odisha" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/94/Birds_eyeview_of_Chilika_Lake.jpg", 
    place: "Chilika Lake", 
    location: "Khurda, Odisha" 
  },
  {
    src: "public/images/i8.jpg",
    place: "evening view of Ram Ghat",
    location: "Ujjain, Madhya Pradesh, India"
  },
   { src: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Tirumala_090615.jpg", 
    place: "Tirupati Balaji Temple", 
    location: "Tirupati, Andhra Pradesh" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg", 
    place: "Charminar", 
    location: "Hyderabad, Telangana" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Golconda_Fort_013.jpg", 
    place: "Golconda Fort", 
    location: "Hyderabad, Telangana" 
  },
  {
    src: "public/images/i9.jpg",
    place: "Outline map",
    location: " Madhya Pradesh, India"
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg", 
    place: "Taj Mahal",
     location: "Agra, Uttar Pradesh"
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Dal_Lake_Hazratbal_Srinagar.jpg", 
      place: "Dal Lake", 
      location: "Srinagar, Jammu & Kashmir" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Pangong_pano.jpg", 
    place: "Pangong Lake", 
    location: "Leh, Ladakh" 
  },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", 
    place: "Leh Palace", 
    location: "Leh, Ladakh" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/7/75/5_Nubra_valley.jpg", 
    place: "Nubra Valley", 
    location: "Leh, Ladakh" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/94/The_Golden_Temple_of_Amrithsar_7.jpg", 
    place: "Golden Temple", 
    location: "Amritsar, Punjab" 
  },
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/c4/The_SAARC_Car_Rally_2007_being_welcomed_by_traditional_Drummers_at_the_Wagah_Border_on_March_28%2C_2007.jpg", 
    place: "Wagah Border Ceremony", 
    location: "Amritsar, Punjab" 
  },


];

let index = 0;
// Preload all images for smooth transitions
function preloadImages() {
  for (let i = 0; i < photos.length; i++) {
    let img = new Image();
    img.src = photos[i].src;
  }
}

// Update the counter display (e.g. "1 / 9")
function updateCounter() {
  let counter = document.getElementById("counter");
  if (counter) {
    counter.textContent = (index + 1) + " / " + photos.length;
  }
}

// Update dot indicators
function updateDots() {
  let dots = document.querySelectorAll(".dot");
  dots.forEach(function(dot, i) {
    dot.classList.toggle("active", i === index);
  });
}

// Build dot indicators dynamically
function buildDots() {
  let dotsContainer = document.getElementById("dots");
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";
  for (let i = 0; i < photos.length; i++) {
    let dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === index) dot.classList.add("active");
    // Click a dot to jump to that slide
    (function(i) {
      dot.addEventListener("click", function() {
        index = i;
        showPhoto();
      });
    })(i);
    dotsContainer.appendChild(dot);
  }
}

// Show current photo with fade transition + update caption
function showPhoto() {
  let img = document.getElementById("photo");
  let placeName = document.getElementById("place-name");
  let placeLocation = document.getElementById("place-location");

  // Fade out
  img.style.opacity = 0;
  if (placeName) placeName.style.opacity = 0;
  if (placeLocation) placeLocation.style.opacity = 0;

  setTimeout(function() {
    // Update image and caption
    img.src = photos[index].src;
    img.alt = photos[index].place;

    if (placeName) placeName.textContent = photos[index].place;
    if (placeLocation) placeLocation.textContent = "📍 " + photos[index].location;

    // Fade in
    img.style.opacity = 1;
    if (placeName) placeName.style.opacity = 1;
    if (placeLocation) placeLocation.style.opacity = 1;

    updateCounter();
    updateDots();
  }, 300);
}

function nextPhoto() {
  index = (index + 1) % photos.length;
  showPhoto();
}

function prevPhoto() {
  index = (index - 1 + photos.length) % photos.length;
  showPhoto();
}


// Keyboard navigation support
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowRight") nextPhoto();
  if (e.key === "ArrowLeft") prevPhoto();
});

// Init on page load
window.onload = function() {
  preloadImages();
  buildDots();

  let img = document.getElementById("photo");
  let placeName = document.getElementById("place-name");
  let placeLocation = document.getElementById("place-location");

  img.src = photos[index].src;
  img.alt = photos[index].place;
  if (placeName) placeName.textContent = photos[index].place;
  if (placeLocation) placeLocation.textContent = "📍 " + photos[index].location;

  updateCounter();
};
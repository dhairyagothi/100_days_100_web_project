const SEARCH_RADIUS = 20000;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const WIKIDATA_ENTITY_URL = "https://www.wikidata.org/w/api.php";
const LOCATION_CACHE_KEY = "cachedLocation";
const SAVED_CAFES_KEY = "savedCafes";
const LOCATION_CACHE_TTL = 10 * 60 * 1000;
let currentSearchLocation = null;
let currentDeck = [];
let currentViewMode = "Ready";

function getCardsContainer() {
  return document.querySelector(".cards");
}

function getStatusElement() {
  return document.getElementById("status");
}

function getSavedCountElement() {
  return document.getElementById("saved-count");
}

function getRadiusSelect() {
  return document.getElementById("radius-select");
}

function getDeckCountElement() {
  return document.getElementById("deck-count");
}

function getViewModeElement() {
  return document.getElementById("view-mode");
}

function setStatus(message, isError = false) {
  const status = getStatusElement();
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function updateSavedCount() {
  const saved = JSON.parse(localStorage.getItem(SAVED_CAFES_KEY) || "[]");
  const label = `${saved.length} saved`;
  getSavedCountElement().textContent = label;
}

function updateDeckCount() {
  const deckCountElement = getDeckCountElement();
  if (deckCountElement) {
    deckCountElement.textContent = String(currentDeck.length);
  }
}

function setViewMode(mode) {
  currentViewMode = mode;
  const viewModeElement = getViewModeElement();
  if (viewModeElement) {
    viewModeElement.textContent = mode;
  }
}

function getSearchRadius() {
  return Number(getRadiusSelect()?.value || SEARCH_RADIUS);
}

function getLocationCachedOrNew() {
  const cache = JSON.parse(localStorage.getItem(LOCATION_CACHE_KEY) || "{}");
  const now = Date.now();

  setStatus("Checking your location...");
  setViewMode("Loading");

  if (cache.timestamp && now - cache.timestamp < LOCATION_CACHE_TTL) {
    useLocation(cache.lat, cache.lng);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      localStorage.setItem(
        LOCATION_CACHE_KEY,
        JSON.stringify({ lat, lng, timestamp: now })
      );

      currentSearchLocation = { lat, lng };
      useLocation(lat, lng);
    },
    () => {
      setStatus("Location access was denied or unavailable.", true);
      setViewMode("Location Error");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

async function useLocation(lat, lng) {
  currentSearchLocation = { lat, lng };
  await useOpenStreetMap(lat, lng);
}

async function useOpenStreetMap(lat, lng) {
  const radius = getSearchRadius();
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="cafe"](around:${radius},${lat},${lng});
      way["amenity"="cafe"](around:${radius},${lat},${lng});
      relation["amenity"="cafe"](around:${radius},${lat},${lng});
    );
    out center tags;
  `;

  const container = getCardsContainer();
  container.classList.remove("saved-view");
  container.innerHTML = "";
  setStatus("Finding cafes near you with OpenStreetMap data...");
  setViewMode("Live Search");

  try {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8"
      },
      body: query
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const cafes = await enrichCafes(normalizeCafes(data.elements || []));

    if (cafes.length === 0) {
      currentDeck = [];
      updateDeckCount();
      setStatus("No cafes found in this area.");
      setViewMode("No Results");
      return;
    }

    currentDeck = cafes;
    updateDeckCount();
    setStatus(`Found ${cafes.length} cafes. Swipe right to save your favorites.`);
    setViewMode("Browsing");
    displayCards(cafes);
  } catch (error) {
    console.error("Error fetching nearby cafes:", error);
    setStatus("Couldn't load cafes right now. Please try again in a moment.", true);
    setViewMode("Error");
  }
}

function normalizeCafes(elements) {
  const mapped = elements
    .map((element) => {
      const tags = element.tags || {};
      const cafeLat = element.lat ?? element.center?.lat;
      const cafeLng = element.lon ?? element.center?.lon;

      if (!tags.name || cafeLat == null || cafeLng == null) {
        return null;
      }

      const addressParts = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:city"] || tags["addr:suburb"]
      ].filter(Boolean);

      const photo = getCafeImageUrl(tags, tags.name);
      const photoAttribution = getPhotoAttribution(tags);

      return {
        cafeId: `${element.type}-${element.id}`,
        name: tags.name,
        address: addressParts.join(", "),
        rating: "",
        ratingCount: 0,
        photo,
        photoAttribution,
        mapsUrl: `https://www.openstreetmap.org/?mlat=${encodeURIComponent(cafeLat)}&mlon=${encodeURIComponent(cafeLng)}#map=19/${encodeURIComponent(cafeLat)}/${encodeURIComponent(cafeLng)}`,
        lat: cafeLat,
        lng: cafeLng,
        wikipediaTag: tags.wikipedia || "",
        wikidataId: tags.wikidata || "",
        wikimediaCommonsTag: tags.wikimedia_commons || ""
      };
    })
    .filter(Boolean);

  const unique = [];
  const seen = new Set();

  mapped.forEach((cafe) => {
    const key = `${cafe.name}-${cafe.address}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(cafe);
    }
  });

  return unique.slice(0, 20);
}

function getCafeImageUrl(tags, name) {
  if (tags.image) {
    return tags.image;
  }

  if (tags["image:0"]) {
    return tags["image:0"];
  }

  if (tags.wikimedia_commons) {
    const fileName = tags.wikimedia_commons.replace(/^File:/i, "");
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
  }

  return `https://placehold.co/1080x720?text=${encodeURIComponent(name)}`;
}

function getPhotoAttribution(tags) {
  if (!tags.wikimedia_commons) {
    return null;
  }

  const normalizedFile = tags.wikimedia_commons.startsWith("File:")
    ? tags.wikimedia_commons
    : `File:${tags.wikimedia_commons}`;

  return {
    displayName: "Wikimedia Commons",
    uri: `https://commons.wikimedia.org/wiki/${encodeURIComponent(normalizedFile.replace(/ /g, "_"))}`
  };
}

function isPlaceholderImage(url) {
  return typeof url === "string" && url.includes("placehold.co");
}

async function enrichCafes(cafes) {
  const enriched = await Promise.all(
    cafes.map(async (cafe) => {
      const shouldResolveAddress = !cafe.address;
      const shouldResolvePhoto = !cafe.photo || isPlaceholderImage(cafe.photo);

      const [resolvedAddress, resolvedPhoto] = await Promise.all([
        shouldResolveAddress ? fetchAddress(cafe.lat, cafe.lng) : Promise.resolve(cafe.address),
        shouldResolvePhoto ? fetchOpenDataPhoto(cafe) : Promise.resolve(null)
      ]);

      return {
        ...cafe,
        address: resolvedAddress || "Address not available",
        photo: resolvedPhoto?.photo || cafe.photo,
        photoAttribution: resolvedPhoto?.photoAttribution || cafe.photoAttribution
      };
    })
  );

  return enriched;
}

async function fetchOpenDataPhoto(cafe) {
  const fromWikipedia = await fetchPhotoFromWikipediaTag(cafe.wikipediaTag);
  if (fromWikipedia) {
    return fromWikipedia;
  }

  const fromWikidata = await fetchPhotoFromWikidata(cafe.wikidataId);
  if (fromWikidata) {
    return fromWikidata;
  }

  if (cafe.wikimediaCommonsTag) {
    const normalizedFile = cafe.wikimediaCommonsTag.replace(/^File:/i, "");
    return {
      photo: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(normalizedFile)}`,
      photoAttribution: {
        displayName: "Wikimedia Commons",
        uri: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(normalizedFile.replace(/ /g, "_"))}`
      }
    };
  }

  return null;
}

async function fetchPhotoFromWikipediaTag(wikipediaTag) {
  if (!wikipediaTag) {
    return null;
  }

  const separatorIndex = wikipediaTag.indexOf(":");
  const language = separatorIndex > 0 ? wikipediaTag.slice(0, separatorIndex) : "en";
  const rawTitle = separatorIndex > 0 ? wikipediaTag.slice(separatorIndex + 1) : wikipediaTag;
  const title = rawTitle.trim().replace(/ /g, "_");

  if (!title) {
    return null;
  }

  try {
    const url = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const imageUrl = data?.thumbnail?.source || data?.originalimage?.source;

    if (!imageUrl) {
      return null;
    }

    return {
      photo: imageUrl,
      photoAttribution: {
        displayName: `${language}.wikipedia.org`,
        uri: data?.content_urls?.desktop?.page || `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title)}`
      }
    };
  } catch (error) {
    console.error("Error fetching image from Wikipedia:", error);
    return null;
  }
}

async function fetchPhotoFromWikidata(wikidataId) {
  if (!wikidataId) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      action: "wbgetentities",
      ids: wikidataId,
      format: "json",
      origin: "*"
    });

    const response = await fetch(`${WIKIDATA_ENTITY_URL}?${params.toString()}`, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const entity = data?.entities?.[wikidataId];
    const imageName = entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;

    if (!imageName) {
      return null;
    }

    return {
      photo: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageName)}`,
      photoAttribution: {
        displayName: "Wikimedia Commons",
        uri: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(imageName.replace(/ /g, "_"))}`
      }
    };
  } catch (error) {
    console.error("Error fetching image from Wikidata:", error);
    return null;
  }
}

async function fetchAddress(lat, lng) {
  try {
    const url = `${NOMINATIM_URL}?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Reverse geocode failed with status ${response.status}`);
    }

    const data = await response.json();
    const address = data.address || {};
    const addressParts = [
      address.house_number,
      address.road,
      address.suburb || address.neighbourhood,
      address.city || address.town || address.village
    ].filter(Boolean);

    return addressParts.join(", ") || "Address not available";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Address not available";
  }
}

function renderRating(rating) {
  return rating ? `<p class="detail-line"><span>Rating</span><strong>${rating}</strong></p>` : "";
}

function renderRatingCount(ratingCount) {
  return ratingCount ? `<p class="detail-line"><span>Reviews</span><strong>${ratingCount}</strong></p>` : "";
}

function renderPhoto(photoUrl, cafeName) {
  const src = photoUrl || "https://placehold.co/1080x720?text=No+Image";
  return `<img src="${src}" alt="${cafeName}" onerror="this.src='https://placehold.co/1080x720?text=No+Image'" />`;
}

function renderPhotoAttribution(photoAttribution) {
  if (!photoAttribution?.displayName || !photoAttribution?.uri) {
    return "";
  }

  return `<p class="photo-credit">Photo by <a href="${photoAttribution.uri}" target="_blank" rel="noopener noreferrer">${photoAttribution.displayName}</a></p>`;
}

function renderMapsLink(mapsUrl) {
  if (!mapsUrl) {
    return "";
  }

  return `<a class="maps-link" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Open in OpenStreetMap</a>`;
}

function displayCards(cafes) {
  const container = getCardsContainer();
  container.innerHTML = "";
  container.classList.remove("saved-view");
  updateDeckCount();

  cafes.forEach((cafe, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "swipe-wrapper";
    wrapper.style.zIndex = 200 - index;

    const card = document.createElement("article");
    card.className = "location-card";
    card.innerHTML = `
      <div class="image-wrap">
        ${renderPhoto(cafe.photo, cafe.name)}
      </div>
      <div class="card-body">
        <div class="card-topline">
          <p class="section-label">Cafe Pick</p>
          ${renderMapsLink(cafe.mapsUrl)}
        </div>
        <h3>${cafe.name}</h3>
        <p class="address">${cafe.address}</p>
        <div class="detail-grid">
          ${renderRating(cafe.rating)}
          ${renderRatingCount(cafe.ratingCount)}
        </div>
        ${renderPhotoAttribution(cafe.photoAttribution)}
        <p class="swipe-hint">Swipe right to save it, or swipe left to skip and see the next cafe.</p>
      </div>
    `;

    wrapper.appendChild(card);
    container.appendChild(wrapper);

    const hammer = new Hammer(wrapper);

    hammer.on("swipeleft", () => {
      dismissCard(wrapper, cafe, false);
    });

    hammer.on("swiperight", () => {
      dismissCard(wrapper, cafe, true);
    });
  });
}

function getCafeId(cafe) {
  return cafe?.cafeId || cafe?.place_id || "";
}

function dismissCard(wrapper, cafe, shouldSave) {
  if (shouldSave) {
    saveCafe(cafe, { silent: true });
  }

  const targetId = getCafeId(cafe);
  currentDeck = currentDeck.filter((item) => getCafeId(item) !== targetId);
  updateDeckCount();
  wrapper.style.transform = shouldSave
    ? "translateX(150%) rotate(12deg)"
    : "translateX(-150%) rotate(-12deg)";
  wrapper.style.opacity = "0";
  setTimeout(() => {
    wrapper.remove();
    handleDeckCompletion();
  }, 180);
}

function getTopCardWrapper() {
  return getCardsContainer().querySelector(".swipe-wrapper");
}

function skipTopCard() {
  const wrapper = getTopCardWrapper();
  if (!wrapper) {
    setStatus("No more cafes left in this list. Refresh to load more.");
    return;
  }

  const card = currentDeck[0];
  if (!card) {
    setStatus("No more cafes left in this list. Refresh to load more.");
    return;
  }

  dismissCard(wrapper, card, false);
}

function saveTopCard() {
  const wrapper = getTopCardWrapper();
  if (!wrapper) {
    setStatus("No more cafes left in this list. Refresh to load more.");
    return;
  }

  const card = currentDeck[0];
  if (!card) {
    setStatus("No more cafes left in this list. Refresh to load more.");
    return;
  }

  dismissCard(wrapper, card, true);
}

function handleDeckCompletion() {
  if (currentDeck.length > 0) {
    return;
  }

  const container = getCardsContainer();
  if (!container.classList.contains("saved-view") && !container.querySelector(".empty-state")) {
    container.innerHTML = '<p class="empty-state">You checked all the cafes in this list. Refresh the list or change the distance to explore more places.</p>';
    setStatus("List complete. Refresh the list or change the distance to see more cafes.");
    setViewMode("Completed");
  }
}

function saveCafe(cafe, options = {}) {
  const { silent = false } = options;
  const saved = JSON.parse(localStorage.getItem(SAVED_CAFES_KEY) || "[]");

  const cafeId = getCafeId(cafe);

  if (saved.find((item) => getCafeId(item) === cafeId)) {
    if (!silent) {
      setStatus(`${cafe.name} is already in your saved list.`);
    }
    return;
  }

  saved.push({
    ...cafe,
    cafeId
  });
  localStorage.setItem(SAVED_CAFES_KEY, JSON.stringify(saved));
  updateSavedCount();
  setStatus(`${cafe.name} was saved to your list.`);
}

function showSaved() {
  const container = getCardsContainer();
  const saved = JSON.parse(localStorage.getItem(SAVED_CAFES_KEY) || "[]");

  container.classList.add("saved-view");
  container.innerHTML = "";
  currentDeck = [];
  updateDeckCount();
  setViewMode("Saved");

  if (saved.length === 0) {
    container.innerHTML = '<p class="empty-state">No saved cafes yet. Start exploring and save the ones you like.</p>';
    setStatus("You have not saved any cafes yet.");
    return;
  }

  setStatus(`Showing ${saved.length} saved cafes.`);

  saved.forEach((cafe) => {
    const cafeId = getCafeId(cafe);
    const card = document.createElement("article");
    card.className = "location-card saved-card";
    card.innerHTML = `
      <div class="image-wrap">
        ${renderPhoto(cafe.photo, cafe.name)}
      </div>
      <div class="card-body">
        <div class="card-topline">
          <p class="section-label">Saved Cafe</p>
          ${renderMapsLink(cafe.mapsUrl)}
        </div>
        <h3>${cafe.name}</h3>
        <p class="address">${cafe.address}</p>
        <div class="detail-grid">
          ${renderRating(cafe.rating)}
          ${renderRatingCount(cafe.ratingCount)}
        </div>
        ${renderPhotoAttribution(cafe.photoAttribution)}
        <div class="saved-actions">
          <button class="ghost-button small-button" onclick="removeSavedCafe('${cafeId}')">Remove</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function removeSavedCafe(cafeId) {
  const saved = JSON.parse(localStorage.getItem(SAVED_CAFES_KEY) || "[]");
  const nextSaved = saved.filter((cafe) => getCafeId(cafe) !== cafeId);

  localStorage.setItem(SAVED_CAFES_KEY, JSON.stringify(nextSaved));
  updateSavedCount();
  setStatus("Cafe removed from your saved list.");
  showSaved();
}

function clearSavedCafes() {
  localStorage.setItem(SAVED_CAFES_KEY, JSON.stringify([]));
  updateSavedCount();
  setStatus("Saved cafes cleared.");
  if (!getCardsContainer().classList.contains("saved-view")) {
    setViewMode(currentDeck.length ? "Browsing" : "Ready");
  }

  const container = getCardsContainer();
  if (container.classList.contains("saved-view")) {
    showSaved();
  }
}

function refreshCurrentSearch() {
  if (currentSearchLocation) {
    useLocation(currentSearchLocation.lat, currentSearchLocation.lng);
    return;
  }

  getLocationCachedOrNew();
}

updateSavedCount();
updateDeckCount();
setViewMode(currentViewMode);
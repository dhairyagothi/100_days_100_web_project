const STORAGE_KEY = 'profile-card-generator-state';

const defaults = {
  name: 'Krishna Bhati',
  role: 'UI/UX Designer',
  bio: 'Hardworking and reliable UI/UX designer focused on going above and beyond to support teams and serve customers.',
  image: 'logo/Adobe Express - file.png',
  imageUrl: '',
  github: '',
  linkedin: '',
  twitter: '',
  instagram: '',
  theme: '#2f80c9',
  darkMode: true,
  layout: 'classic',
  uploadedImage: '',
};

const elements = {
  form: document.querySelector('#profileForm'),
  name: document.querySelector('#nameInput'),
  role: document.querySelector('#roleInput'),
  bio: document.querySelector('#bioInput'),
  imageUrl: document.querySelector('#imageUrlInput'),
  imageFile: document.querySelector('#imageFileInput'),
  github: document.querySelector('#githubInput'),
  linkedin: document.querySelector('#linkedinInput'),
  twitter: document.querySelector('#twitterInput'),
  instagram: document.querySelector('#instagramInput'),
  theme: document.querySelector('#themeInput'),
  darkMode: document.querySelector('#darkModeInput'),
  modeToggle: document.querySelector('#modeToggle'),
  modeToggleText: document.querySelector('#modeToggleText'),
  reset: document.querySelector('#resetButton'),
  download: document.querySelector('#downloadButton'),
  validation: document.querySelector('#validationMessage'),
  card: document.querySelector('#profileCard'),
  previewName: document.querySelector('#previewName'),
  previewRole: document.querySelector('#previewRole'),
  previewBio: document.querySelector('#previewBio'),
  previewImage: document.querySelector('#previewImage'),
  socialLinks: document.querySelector('#socialLinks'),
};

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.theme === '#bb7ab1' && saved?.darkMode === false) {
      saved.theme = defaults.theme;
      saved.darkMode = defaults.darkMode;
    }
    return { ...defaults, ...saved };
  } catch (error) {
    return { ...defaults };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    elements.validation.textContent = 'This image is too large to save locally, but the live preview still works.';
  }
}

function hydrateForm() {
  elements.name.value = state.name;
  elements.role.value = state.role;
  elements.bio.value = state.bio;
  elements.imageUrl.value = state.imageUrl;
  elements.github.value = state.github;
  elements.linkedin.value = state.linkedin;
  elements.twitter.value = state.twitter;
  elements.instagram.value = state.instagram;
  elements.theme.value = state.theme;
  elements.darkMode.checked = state.darkMode;
  const selectedLayout = document.querySelector(`input[name="layout"][value="${state.layout}"]`);
  (selectedLayout || document.querySelector('input[name="layout"][value="classic"]')).checked = true;
}

function getDisplayValue(value, fallback) {
  return value.trim() || fallback;
}

function setText(element, value, fallback) {
  element.textContent = getDisplayValue(value, fallback);
}

function isValidUrl(value) {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

function updateSocialLinks() {
  const socialValues = {
    github: state.github,
    linkedin: state.linkedin,
    twitter: state.twitter,
    instagram: state.instagram,
  };

  elements.socialLinks.querySelectorAll('a').forEach((link) => {
    const platform = link.dataset.platform;
    const url = socialValues[platform];
    const isActive = isValidUrl(url) && url.trim().length > 0;

    link.classList.toggle('is-hidden', !isActive);
    link.href = isActive ? url : '#';
    link.target = isActive ? '_blank' : '';
    link.rel = isActive ? 'noopener noreferrer' : '';
  });
}

function updateValidation() {
  const urlFields = [
    elements.imageUrl,
    elements.github,
    elements.linkedin,
    elements.twitter,
    elements.instagram,
  ];

  const invalidFields = urlFields.filter((field) => !isValidUrl(field.value));
  urlFields.forEach((field) => {
    field.classList.toggle('invalid', invalidFields.includes(field));
  });

  elements.validation.textContent = invalidFields.length
    ? 'Please use complete links that start with http:// or https://.'
    : '';
}

function updateThemeColor() {
  const theme = state.theme || defaults.theme;
  const soft = mixColors(theme, '#ffffff', 0.18);
  const muted = mixColors(theme, '#ffffff', 0.28);
  const darkTheme = mixColors(theme, '#111522', 0.3);
  const darkCard = mixColors(theme, '#111522', 0.2);
  const rgb = hexToRgb(theme);

  document.documentElement.style.setProperty('--theme', theme);
  document.documentElement.style.setProperty('--theme-soft', soft);
  document.documentElement.style.setProperty('--theme-muted', muted);
  document.documentElement.style.setProperty('--dark-theme-bg', darkTheme);
  document.documentElement.style.setProperty('--dark-card-bg', darkCard);
  document.documentElement.style.setProperty(
    '--theme-focus',
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`,
  );
  document.documentElement.style.setProperty(
    '--theme-shadow',
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.34)`,
  );
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => character + character)
          .join('')
      : normalized;

  const number = Number.parseInt(value, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function mixColors(color, base, amount) {
  const foreground = hexToRgb(color);
  const background = hexToRgb(base);
  const channel = (key) =>
    Math.round(foreground[key] * amount + background[key] * (1 - amount));

  return `rgb(${channel('r')}, ${channel('g')}, ${channel('b')})`;
}

function render() {
  setText(elements.previewName, state.name, defaults.name);
  setText(elements.previewRole, state.role, defaults.role);
  setText(elements.previewBio, state.bio, defaults.bio);
  elements.previewImage.src = state.image || defaults.image;
  elements.previewImage.alt = `${getDisplayValue(state.name, defaults.name)} profile picture`;

  elements.card.className = `card layout-${state.layout}`;
  document.body.classList.toggle('is-dark', state.darkMode);
  elements.darkMode.checked = state.darkMode;
  const modeAction = state.darkMode ? 'Switch to light mode' : 'Switch to dark mode';
  elements.modeToggle.title = modeAction;
  elements.modeToggle.setAttribute('aria-label', modeAction);
  elements.modeToggleText.textContent = modeAction;
  updateThemeColor();
  updateSocialLinks();
  updateValidation();
  saveState();
}

function syncStateFromInputs() {
  state = {
    ...state,
    name: elements.name.value,
    role: elements.role.value,
    bio: elements.bio.value,
    imageUrl: elements.imageUrl.value,
    github: elements.github.value,
    linkedin: elements.linkedin.value,
    twitter: elements.twitter.value,
    instagram: elements.instagram.value,
    theme: elements.theme.value,
    darkMode: elements.darkMode.checked,
    layout: document.querySelector('input[name="layout"]:checked').value,
  };

  if (state.imageUrl.trim() && isValidUrl(state.imageUrl)) {
    state.image = state.imageUrl.trim();
  } else {
    state.image = state.uploadedImage || defaults.image;
  }

  render();
}

function handleImageUpload(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    state.uploadedImage = reader.result;
    state.image = reader.result;
    state.imageUrl = '';
    elements.imageUrl.value = '';
    render();
  });
  reader.readAsDataURL(file);
}

async function downloadCard() {
  if (typeof html2canvas !== 'function') {
    elements.validation.textContent = 'Download is unavailable until the export library finishes loading.';
    return;
  }

  elements.download.disabled = true;
  elements.download.textContent = 'Preparing...';
  document.body.classList.add('is-exporting');
  elements.card.classList.add('is-exporting');

  try {
    await waitForImages(elements.card);
    await nextFrame();

    const canvas = await html2canvas(elements.card, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDocument) => {
        clonedDocument.body.classList.add('is-exporting');
        clonedDocument.querySelector('#profileCard')?.classList.add('is-exporting');
      },
    });
    const link = document.createElement('a');
    link.download = `${getDisplayValue(state.name, 'profile').toLowerCase().replace(/\s+/g, '-')}-card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    elements.validation.textContent = 'Unable to export this image. Try an uploaded image or a CORS-enabled image URL.';
  } finally {
    document.body.classList.remove('is-exporting');
    elements.card.classList.remove('is-exporting');
    elements.download.disabled = false;
    elements.download.textContent = 'Download card';
  }
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function waitForImages(container) {
  const images = [...container.querySelectorAll('img')];
  const pendingImages = images
    .filter((image) => !image.complete)
    .map(
      (image) =>
        new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        }),
    );

  return Promise.all(pendingImages);
}

function handleCardTilt(event) {
  if (document.body.classList.contains('is-exporting')) {
    return;
  }

  const rect = elements.card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateY = (x - 0.5) * 16;
  const rotateX = (0.5 - y) * 14;

  elements.card.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`);
  elements.card.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`);
  elements.card.classList.add('is-tilting');
}

function resetCardTilt() {
  elements.card.style.setProperty('--rotate-x', '0deg');
  elements.card.style.setProperty('--rotate-y', '0deg');
  elements.card.classList.remove('is-tilting');
}

function resetBuilder() {
  state = { ...defaults };
  elements.imageFile.value = '';
  hydrateForm();
  render();
}

elements.form.addEventListener('input', syncStateFromInputs);
elements.form.addEventListener('change', syncStateFromInputs);
elements.imageFile.addEventListener('change', handleImageUpload);
elements.download.addEventListener('click', downloadCard);
elements.reset.addEventListener('click', resetBuilder);

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  elements.card.addEventListener('pointermove', handleCardTilt);
  elements.card.addEventListener('pointerleave', resetCardTilt);
}

hydrateForm();
render();

const STORAGE_KEY = 'profile-card-generator-state';

const defaults = {
  name: 'Krishna Bhati',
  role: 'UI/UX Designer',
  bio: 'Hardworking and reliable UI/UX designer focused on going above and beyond to support teams and serve customers.',
  image: 'logo/Adobe Express - file.png',
};

const initialFormState = {
  name: '',
  role: '',
  bio: '',
  image: '',
  imageUrl: '',
  github: '',
  linkedin: '',
  twitter: '',
  instagram: '',
  theme: '#2f80c9',
  darkMode: true,
  layout: 'classic',
  uploadedImage: '',
  portfolio: '',
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
  portfolio: document.querySelector('#portfolioInput'),
  qrContainer: document.querySelector('#qrContainer'),
  exportPortfolio:
  document.querySelector('#exportPortfolioBtn'),
};

let state = loadState() || { ...defaults };

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...initialFormState, ...saved };
  } catch (error) {
    return { ...initialFormState };
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
  elements.portfolio.value =
  state.portfolio || '';
}

function getDisplayValue(value, fallback) {
  return value.trim() || fallback;
}

function setText(element, value, fallback) {
  element.textContent = getDisplayValue(value, fallback);
}

const SOCIAL_PLATFORMS = {
  github: { base: 'https://github.com/', domain: 'github.com' },
  linkedin: { base: 'https://linkedin.com/in/', domain: 'linkedin.com' },
  twitter: { base: 'https://x.com/', domain: 'x.com' },
  instagram: { base: 'https://instagram.com/', domain: 'instagram.com' },
};

function getAbsoluteSocialUrl(platform, value) {
  const cleaned = value.trim();
  if (!cleaned) return '';
  
  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }
  
  const info = SOCIAL_PLATFORMS[platform];
  if (!info) return cleaned;
  
  if (cleaned.toLowerCase().includes(info.domain)) {
    return `https://${cleaned.replace(/^www\./i, '')}`;
  }
  
  const username = cleaned.replace(/^@/, '');
  
  if (platform === 'linkedin' && username.startsWith('in/')) {
    return `https://linkedin.com/${username}`;
  }
  
  return `${info.base}${username}`;
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
  elements.socialLinks.querySelectorAll('a').forEach((link) => {
    const platform = link.dataset.platform;
    const inputValue = state[platform];
    const absoluteUrl = getAbsoluteSocialUrl(platform, inputValue);
    const isActive = absoluteUrl && isValidUrl(absoluteUrl);

    link.classList.toggle('is-hidden', !isActive);
    link.href = isActive ? absoluteUrl : '#';
    link.target = isActive ? '_blank' : '';
    link.rel = isActive ? 'noopener noreferrer' : '';
  });
}

function updateValidation() {
  const invalidFields = [];
  
  if (elements.imageUrl.value.trim() && !isValidUrl(elements.imageUrl.value)) {
    invalidFields.push(elements.imageUrl);
  }
  
  const socialPlatforms = ['github', 'linkedin', 'twitter', 'instagram'];
  socialPlatforms.forEach((platform) => {
    const field = elements[platform];
    if (field.value.trim()) {
      const absoluteUrl = getAbsoluteSocialUrl(platform, field.value);
      if (!isValidUrl(absoluteUrl)) {
        invalidFields.push(field);
      }
    }
  });

  const urlFields = [
    elements.imageUrl,
    elements.github,
    elements.linkedin,
    elements.twitter,
    elements.instagram,
  ];
  
  urlFields.forEach((field) => {
    field.classList.toggle('invalid', invalidFields.includes(field));
  });

  elements.validation.textContent = invalidFields.length
    ? 'Please use complete links or valid usernames/handles.'
    : '';
}

function updateThemeColor() {
  const theme = state.theme || defaults.theme;
  const soft = mixColors(theme, '#ffffff', 0.18);
  const muted = mixColors(theme, '#ffffff', 0.28);
  const darkTheme = mixColors(theme, '#111522', 0.3);
  const darkCard = mixColors(theme, '#111522', 0.2);
  const rgb = hexToRgb(theme);

  const contrastTheme = getContrastColor(theme, state.darkMode);

  document.documentElement.style.setProperty('--theme', theme);
  document.documentElement.style.setProperty('--theme-text', contrastTheme);
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

function getColorBrightness(hex) {
  const rgb = hexToRgb(hex);
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

function getContrastColor(themeHex, isDarkMode) {
  const brightness = getColorBrightness(themeHex);
  
  if (isDarkMode) {
    if (brightness < 120) {
      return mixColors(themeHex, '#ffffff', 0.65);
    }
  } else {
    if (brightness > 160) {
      return mixColors(themeHex, '#10131e', 0.65);
    }
  }
  return themeHex;
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
  updateQRCode(); 
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
    portfolio:elements.portfolio.value,
  };

  if (state.imageUrl.trim() && isValidUrl(state.imageUrl)) {
    state.image = state.imageUrl.trim();
  } else {
    state.image = state.uploadedImage || defaults.image;
  }

  render();
}

function compressAndLoadImage(file, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', (e) => {
    const img = new Image();
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      const maxDim = 400;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
      callback(compressedDataUrl);
    });
    img.src = e.target.result;
  });
  reader.readAsDataURL(file);
}

function handleImageUpload(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  compressAndLoadImage(file, (compressedDataUrl) => {
    state.uploadedImage = compressedDataUrl;
    state.image = compressedDataUrl;
    state.imageUrl = '';
    elements.imageUrl.value = '';
    render();
  });
}

// ===== DOWNLOAD FUNCTIONALITY - FIXED =====
const downloadWrapper = document.querySelector('#downloadWrapper');
const downloadDropdown = document.querySelector('#downloadDropdown');

function toggleDropdown(open) {
  const isOpen = open !== undefined ? open : !downloadDropdown.classList.contains('is-open');
  downloadDropdown.classList.toggle('is-open', isOpen);
  elements.download.setAttribute('aria-expanded', String(isOpen));
}

// Main download button - just opens the dropdown
elements.download.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
  toggleDropdown(true);
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!downloadWrapper.contains(e.target)) {
    toggleDropdown(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleDropdown(false);
});

// Format selection buttons - THIS IS WHERE DOWNLOAD HAPPENS
const formatButtons = downloadDropdown.querySelectorAll('[data-format]');
formatButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const fmt = btn.dataset.format;
    
    // Close dropdown first
    toggleDropdown(false);
    
    // Add visual feedback
    btn.style.opacity = '0.6';
    
    // Small delay for smooth UX, then download
    setTimeout(() => {
      downloadCard(fmt);
      // Restore button opacity
      setTimeout(() => { btn.style.opacity = '1'; }, 500);
    }, 100);
  });
});

async function downloadCard(format = 'png') {
  if (!format) format = 'png';
  elements.validation.textContent = '';

  // Check if html2canvas is loaded
  if (typeof html2canvas === 'undefined' || typeof html2canvas !== 'function') {
    elements.validation.textContent = 'Export library not loaded yet — please wait and try again.';
    console.error('html2canvas is not loaded');
    return;
  }

  const originalHTML = elements.download.innerHTML;
  elements.download.disabled = true;
  elements.download.innerHTML = 'Preparing…';
  document.body.classList.add('is-exporting');
  elements.card.classList.add('is-exporting');

  let canvas;
  try {
    await waitForImages(elements.card);
    await nextFrame();
    
    const rawCanvas = await html2canvas(elements.card, {
  backgroundColor: format === 'jpg' ? '#ffffff' : null,
  scale: 2,
  useCORS: true,
  allowTaint: true,
  scrollX: 0,
  scrollY: 0,
  logging: false,
  onclone: (clonedDoc) => {
    clonedDoc.body.classList.add('is-exporting');
    const c = clonedDoc.querySelector('#profileCard');
    if (c) c.classList.add('is-exporting');
  },
});

canvas = roundCanvasCorners(rawCanvas, 72);

    const slug = getDisplayValue(state.name, 'profile').toLowerCase().replace(/\s+/g, '-');

    if (format === 'pdf') {
      // PDF download
      const jsPDFClass = window.jspdf?.jsPDF || window.jsPDF;
      
      if (!jsPDFClass) {
        throw new Error('PDF library not loaded. Try PNG or JPG instead.');
      }
      
      const imgData = canvas.toDataURL('image/png');
      const toMm = (px) => Math.round(px * 0.264583 * 10) / 10;
      const w = toMm(canvas.width);
      const h = toMm(canvas.height);
      
      const doc = new jsPDFClass({
        orientation: w > h ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [w, h],
        compress: true,
      });
      
      doc.addImage(imgData, 'PNG', 0, 0, w, h, undefined, 'FAST');
      doc.save(slug + '-card.pdf');
      
    } else {
      // PNG or JPG download
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      
      const link = document.createElement('a');
      link.download = slug + '-card.' + format;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }, 200);
    }
    
  } catch (err) {
    console.error('Download error:', err);
    elements.validation.textContent = 'Download failed: ' + (err.message || String(err));
  } finally {
    document.body.classList.remove('is-exporting');
    elements.card.classList.remove('is-exporting');
    elements.download.disabled = false;
    elements.download.innerHTML = originalHTML;
  }
}

// ===== UTILITY FUNCTIONS =====
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

function roundCanvasCorners(sourceCanvas, radius = 36) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;

  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(canvas.width - radius, 0);
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
  ctx.lineTo(canvas.width, canvas.height - radius);
  ctx.quadraticCurveTo(
    canvas.width,
    canvas.height,
    canvas.width - radius,
    canvas.height
  );
  ctx.lineTo(radius, canvas.height);
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();

  ctx.clip();
  ctx.drawImage(sourceCanvas, 0, 0);

  return canvas;
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
  state = { ...initialFormState };
  elements.imageFile.value = '';
  hydrateForm();
  render();
}


function updateQRCode() {

  elements.qrContainer.innerHTML = '';

  const url = elements.portfolio.value.trim();

  if (!url) return;

  if (!/^https?:\/\//i.test(url)) {
    return;
  }

  new QRCode(elements.qrContainer, {
    text: url,
    width: 120,
    height: 120,
  });
}
function exportPortfolio() {

const html = `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0">

<title>${state.name} Portfolio</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:Inter,sans-serif;
background:#0f172a;
color:white;
padding:40px;
}

.container{
max-width:900px;
margin:auto;
background:#111827;
padding:40px;
border-radius:20px;
box-shadow:0 10px 30px rgba(0,0,0,.3);
}

.profile{
text-align:center;
}

.profile img{
width:180px;
height:180px;
object-fit:cover;
border-radius:50%;
border:5px solid ${state.theme};
}

h1{
margin-top:20px;
font-size:3rem;
}

h2{
margin-top:10px;
color:${state.theme};
}

.bio{
margin-top:20px;
line-height:1.8;
font-size:1rem;
}

.links{
margin-top:30px;
display:flex;
justify-content:center;
gap:20px;
flex-wrap:wrap;
}

.links a{
padding:10px 16px;
background:${state.theme};
color:white;
text-decoration:none;
border-radius:10px;
}

.footer{
margin-top:40px;
text-align:center;
opacity:.7;
}

</style>

</head>

<body>

<div class="container">

<div class="profile">

<img src="${state.image}" alt="Profile">

<h1>${state.name}</h1>

<h2>${state.role}</h2>

<p class="bio">
${state.bio}
</p>

<div class="links">

${state.github ? `<a href="${state.github}" target="_blank">GitHub</a>` : ''}

${state.linkedin ? `<a href="${state.linkedin}" target="_blank">LinkedIn</a>` : ''}

${state.twitter ? `<a href="${state.twitter}" target="_blank">Twitter</a>` : ''}

${state.instagram ? `<a href="${state.instagram}" target="_blank">Instagram</a>` : ''}

</div>

${
state.portfolio
? `
<div style="margin-top:40px;">
<h3>Portfolio QR Code</h3>

<img
src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(state.portfolio)}"
alt="QR Code"
style="margin-top:15px;border-radius:12px;">
</div>
`
: ''
}

</div>

<div class="footer">
Generated using 3D Profile Card Generator
</div>

</div>

</body>

</html>
`;

const blob = new Blob(
[html],
{type:'text/html'}
);

const url =
URL.createObjectURL(blob);

const a =
document.createElement('a');

a.href = url;

a.download =
`${(state.name || 'portfolio')
.replace(/\s+/g,'-')
.toLowerCase()}-portfolio.html`;

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

URL.revokeObjectURL(url);
}

// Event listeners
elements.form.addEventListener('input', syncStateFromInputs);
elements.form.addEventListener('change', syncStateFromInputs);
elements.imageFile.addEventListener('change', handleImageUpload);
elements.reset.addEventListener('click', resetBuilder);
elements.exportPortfolio
.addEventListener(
'click',
exportPortfolio
);

// Card tilt effect (only on devices with hover)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  elements.card.addEventListener('pointermove', handleCardTilt);
  elements.card.addEventListener('pointerleave', resetCardTilt);
}

// Initialize
hydrateForm();
render();
updateQRCode()
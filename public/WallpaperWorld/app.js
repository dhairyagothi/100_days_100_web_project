const API_KEY = '3yuctmGlPYidqQZwrCn3oH1wTZx2bwGsK6yISCd13Nknx6lblpSDzFnO';
let PAGE = 1;
const PER_PAGE = 6;
let API_URL = `https://api.pexels.com/v1/search?query=nature&page=${PAGE}&per_page=${PER_PAGE}`;

document.addEventListener('DOMContentLoaded', () => {
	fetchWallpapers();

	document.getElementById('fullscreen-view').addEventListener('click', (e) => {
		if (e.target.id === 'fullscreen-view') {
			closeFullscreen();
		}
	});

	document.getElementById('close-btn').addEventListener('click', closeFullscreen);
	document.getElementById('download-btn').addEventListener('click', downloadWallpaper);
	document.getElementById('next-btn').addEventListener('click', () => changePage(1));
	document.getElementById('prev-btn').addEventListener('click', () => changePage(-1));
});

async function fetchWallpapers() {
	try {
		API_URL = `https://api.pexels.com/v1/search?query=nature&page=${PAGE}&per_page=${PER_PAGE}`;
		const response = await fetch(API_URL, {
			headers: {
				Authorization: API_KEY
			}
		});
		const data = await response.json();
		displayWallpapers(data.photos);
		updatePaginationButtons(data.page, data.total_results);
	} catch (error) {
		console.error('Error fetching wallpapers:', error);
	}
}

function displayWallpapers(wallpapers) {
	const gallery = document.getElementById('wallpaper-gallery');
	gallery.innerHTML = '';
	wallpapers.forEach(wallpaper => {
		const wallpaperElement = document.createElement('div');
		wallpaperElement.className = 'wallpaper';
		wallpaperElement.style.backgroundImage = `url(${wallpaper.src.medium})`;

		wallpaperElement.addEventListener('click', () => openFullscreen(wallpaper.src.original));

		gallery.appendChild(wallpaperElement);
	});
}

function openFullscreen(url) {
	const fullscreenView = document.getElementById('fullscreen-view');
	const fullscreenImg = document.getElementById('fullscreen-img');

	fullscreenImg.src = url;
	fullscreenView.classList.remove('hidden');

	document.getElementById('download-btn').setAttribute('data-url', url);
}

function closeFullscreen() {
	document.getElementById('fullscreen-view').classList.add('hidden');
}

function downloadWallpaper() {
	const url = document.getElementById('download-btn').getAttribute('data-url');
	const link = document.createElement('a');
	link.href = url;
	link.download = 'wallpaper.jpg';
	link.click();
}

function changePage(direction) {
	PAGE += direction;
	if (PAGE < 1) PAGE = 1;
	fetchWallpapers();
}

function updatePaginationButtons(page, totalResults) {
	const prevBtn = document.getElementById('prev-btn');
	const nextBtn = document.getElementById('next-btn');

	prevBtn.disabled = (page <= 1);
	nextBtn.disabled = (page * PER_PAGE >= totalResults);
}

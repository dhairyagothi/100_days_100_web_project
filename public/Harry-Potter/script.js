const spellInput = document.getElementById('spell-input');
const houseFilter = document.getElementById('house-filter');
const charSearch = document.getElementById('char-search');
const characterList = document.getElementById('character-list');
const mainContainer = document.getElementById('main-container');

let characters = [];

// Fetch Characters from API
async function fetchCharacters() {
    try {
        const response = await fetch('https://hp-api.onrender.com/api/characters');
        characters = await response.json();
        const charactersWithImages = characters.filter(char => char.image !== "").slice(0, 30);
        displayCharacters(charactersWithImages);
    } catch (error) {
        console.error("Error fetching characters:", error);
        characterList.innerHTML = '<p>Failed to load wizarding data.</p>';
    }
}

// Render Character Cards
function displayCharacters(chars) {
    characterList.innerHTML = '';
    
    if (chars.length === 0) {
        characterList.innerHTML = '<p>No characters found.</p>';
        return;
    }

    chars.forEach(char => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${char.image}" alt="${char.name}" onerror="this.style.display='none'">
            <h3>${char.name}</h3>
            <p><strong>House:</strong> ${char.house || 'Unknown'}</p>
        `;
        characterList.appendChild(card);
    });
}

function applyFilters() {
    const searchTerm = charSearch.value.toLowerCase();
    const selectedHouse = houseFilter.value;

    const filteredChars = characters.filter(char => {
        const matchesName = char.name.toLowerCase().includes(searchTerm);
        const matchesHouse = selectedHouse === "" || char.house === selectedHouse;
        return matchesName && matchesHouse && char.image !== ""; 
    });

    displayCharacters(filteredChars);
}

spellInput.addEventListener('input', (e) => {
    const spell = e.target.value.trim().toLowerCase();

    mainContainer.classList.remove('reducto-shake');

    if (spell === 'lumos') {
        document.body.classList.add('lumos-mode');
    } else if (spell === 'nox') {
        document.body.classList.remove('lumos-mode');
    } else if (spell === 'reducto') {
        setTimeout(() => {
            mainContainer.classList.add('reducto-shake');
        }, 10);
    }
});

houseFilter.addEventListener('change', applyFilters);
charSearch.addEventListener('input', applyFilters);

fetchCharacters();
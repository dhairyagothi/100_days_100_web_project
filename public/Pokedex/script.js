const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const pokemonContainer = document.getElementById('pokemon-container');


const fetchPokemon = async (query) => {
    try {
        pokemonContainer.innerHTML = '<p>Searching...</p>';
        // API Fetch
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        
        const data = await response.json();
        renderPokemon(data);
    } catch (error) {
        console.error('Failed to initialize project:', error);
        pokemonContainer.innerHTML = `<p class="error-msg">${error.message}. Please check the spelling or ID!</p>`;
    }
};

const renderPokemon = (data) => {
    const primaryType = data.types[0].type.name;
    
    const typesHtml = data.types.map(typeInfo => {
        return `<span class="type-badge type-${typeInfo.type.name}">${typeInfo.type.name}</span>`;
    }).join('');

    const formattedId = data.id.toString().padStart(3, '0');

    pokemonContainer.innerHTML = `
        <div class="pokemon-card">
            <div class="pokemon-img">
                <img src="${data.sprites.other['official-artwork'].front_default || data.sprites.front_default}" alt="${data.name}">
            </div>
            <h2 class="pokemon-name">${data.name}</h2>
            <p class="pokemon-id">#${formattedId}</p>
            <div class="pokemon-types">
                ${typesHtml}
            </div>
        </div>
    `;
};

// Search 
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchPokemon(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            fetchPokemon(query);
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    fetchPokemon('pikachu');
});
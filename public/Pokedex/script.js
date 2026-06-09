const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const pokemonContainer = document.getElementById('pokemon-container');


const fetchPokemon = async (query) => {
    try {
        pokemonContainer.innerHTML = '<p>Searching...</p>';

        const [pokemonResponse, speciesResponse] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${query.toLowerCase()}`)
        ]);

        if (!pokemonResponse.ok || !speciesResponse.ok) {
            throw new Error('Pokémon not found');
        }

        const data = await pokemonResponse.json();
        const speciesData = await speciesResponse.json();

        renderPokemon(data, speciesData);

    } catch (error) {
        console.error('Failed to initialize project:', error);
        pokemonContainer.innerHTML = `<p class="error-msg">${error.message}. Please check the spelling or ID!</p>`;
    }
};

const renderPokemon = (data, speciesData) => {
    const primaryType = data.types[0].type.name;
    
    const typesHtml = data.types.map(typeInfo => {
        return `<span class="type-badge type-${typeInfo.type.name}">${typeInfo.type.name}</span>`;
    }).join('');

    const formattedId = data.id.toString().padStart(3, '0');
    const descriptionEntry = speciesData.flavor_text_entries.find(
    entry => entry.language.name === "en"
);

    const description = descriptionEntry
    ? descriptionEntry.flavor_text.replace(/\f/g, " ")
    : "No description available.";
    const statsHtml = data.stats.map(stat => `
    <div class="stat-row">
        <span>${stat.stat.name.replace('-', ' ')}</span>
        <span>${stat.base_stat}</span>
    </div>
`).join('');
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
            <div class="pokemon-description">
    <h3>Description</h3>
    <p>${description}</p>
</div>

<div class="pokemon-stats">
    <h3>Base Stats</h3>
    ${statsHtml}
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
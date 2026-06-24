const pokemonImage = document.getElementById('pokemon-image');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const messageDisplay = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');

let currentPokemonName = '';
let score = 0;
//fetch api
async function fetchPokemon() {
    try {
        
        pokemonImage.classList.add('hidden-pokemon');
        guessInput.value = '';
        messageDisplay.textContent = 'Loading...';
        messageDisplay.style.color = '#333';
        nextBtn.style.display = 'none';
        submitBtn.disabled = true;

        // Gen 1 has 151 Pokemon
        const randomId = Math.floor(Math.random() * 151) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();

        // Save the name and remove any hyphens
        currentPokemonName = data.name.replace('-', ' ');
        
        pokemonImage.src = data.sprites.other['official-artwork'].front_default;
        
        // Wait for the image to actually load before allowing guesses
        pokemonImage.onload = () => {
            messageDisplay.textContent = '';
            submitBtn.disabled = false;
            guessInput.focus();
        };

    } catch (error) {
        messageDisplay.textContent = 'Failed to load Pokémon. Check your connection.';
        messageDisplay.style.color = 'red';
    }
}

function checkGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();
    if (!userGuess) return;

    if (userGuess === currentPokemonName) {
        // Correct Guess Logic
        pokemonImage.classList.remove('hidden-pokemon'); // Reveal
        messageDisplay.textContent = `Correct! It's ${currentPokemonName.toUpperCase()}!`;
        messageDisplay.style.color = 'green';
        score++;
        scoreDisplay.textContent = score;
        
        // Update UI states
        submitBtn.disabled = true;
        nextBtn.style.display = 'inline-block';
        nextBtn.focus();
    } else {
        // Incorrect Guess Logic
        messageDisplay.textContent = 'Wrong! Try again.';
        messageDisplay.style.color = 'red';
        guessInput.value = '';
        guessInput.focus();
    }
}

// Event Listeners
submitBtn.addEventListener('click', checkGuess);

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

nextBtn.addEventListener('click', fetchPokemon);

// Start the game on page load
fetchPokemon();
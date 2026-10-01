const elements = {
    oppName: document.getElementById('opp-name'),
    oppSprite: document.getElementById('opp-sprite'),
    oppHpBar: document.getElementById('opp-hp-bar'),
    playerName: document.getElementById('player-name'),
    playerSprite: document.getElementById('player-sprite'),
    playerHpBar: document.getElementById('player-hp-bar'),
    battleText: document.getElementById('battle-text'),
    attackBtn: document.getElementById('attack-btn'),
    restartBtn: document.getElementById('restart-btn')
};

let playerHP = 100;
let oppHP = 100;
let playerNameStr = "";
let oppNameStr = "";

// Fetch a random Generation 1 Pokemon (1-151)
async function fetchPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    return await res.json();
}

async function initBattle() {
    elements.attackBtn.disabled = true;
    elements.battleText.innerText = "Searching for wild Pokémon...";
    
    // Reset HP
    playerHP = 100;
    oppHP = 100;
    updateHPBars();

    try {
        const [playerData, oppData] = await Promise.all([fetchPokemon(), fetchPokemon()]);

        // Setup Player (Using back sprite for classic perspective)
        playerNameStr = playerData.name;
        elements.playerName.innerText = playerNameStr;
        elements.playerSprite.src = playerData.sprites.back_default || playerData.sprites.front_default;

        // Setup Opponent
        oppNameStr = oppData.name;
        elements.oppName.innerText = oppNameStr;
        elements.oppSprite.src = oppData.sprites.front_default;

        elements.battleText.innerText = `Wild ${oppNameStr.toUpperCase()} appeared! Go ${playerNameStr.toUpperCase()}!`;
        elements.attackBtn.disabled = false;
        
    } catch (error) {
        elements.battleText.innerText = "Failed to load Pokémon. Try again!";
        console.error(error);
    }
}

function updateHPBars() {
    elements.playerHpBar.style.width = `${playerHP}%`;
    elements.oppHpBar.style.width = `${oppHP}%`;

    // Change color based on HP
    elements.playerHpBar.style.background = playerHP > 50 ? '#2ecc71' : playerHP > 20 ? '#f1c40f' : '#e74c3c';
    elements.oppHpBar.style.background = oppHP > 50 ? '#2ecc71' : oppHP > 20 ? '#f1c40f' : '#e74c3c';
}

function attack() {
    elements.attackBtn.disabled = true;
    
    // Player Attacks
    const playerDamage = Math.floor(Math.random() * 20) + 10;
    oppHP = Math.max(0, oppHP - playerDamage);
    elements.battleText.innerText = `${playerNameStr.toUpperCase()} attacked! It dealt ${playerDamage} damage.`;
    
    elements.oppSprite.classList.add('shake');
    setTimeout(() => elements.oppSprite.classList.remove('shake'), 500);

    updateHPBars();

    if (oppHP === 0) {
        endGame(true);
        return;
    }

    // Opponent Counter-Attacks after a delay
    setTimeout(() => {
        const oppDamage = Math.floor(Math.random() * 20) + 10;
        playerHP = Math.max(0, playerHP - oppDamage);
        elements.battleText.innerText = `Enemy ${oppNameStr.toUpperCase()} attacked! It dealt ${oppDamage} damage.`;
        
        elements.playerSprite.classList.add('shake');
        setTimeout(() => elements.playerSprite.classList.remove('shake'), 500);

        updateHPBars();

        if (playerHP === 0) {
            endGame(false);
        } else {
            elements.attackBtn.disabled = false;
        }
    }, 1500);
}

function endGame(playerWon) {
    if (playerWon) {
        elements.battleText.innerText = `Enemy ${oppNameStr.toUpperCase()} fainted! You won!`;
    } else {
        elements.battleText.innerText = `${playerNameStr.toUpperCase()} fainted! You blacked out...`;
    }
    
    elements.attackBtn.classList.add('hidden');
    elements.restartBtn.classList.remove('hidden');
}

elements.attackBtn.addEventListener('click', attack);
elements.restartBtn.addEventListener('click', () => {
    elements.attackBtn.classList.remove('hidden');
    elements.restartBtn.classList.add('hidden');
    initBattle();
});

// Start the game
initBattle();
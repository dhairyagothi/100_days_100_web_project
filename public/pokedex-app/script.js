const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const errorMessage = document.getElementById("error-message");
const pokedexCard = document.getElementById("pokedex-card");
const pokeId = document.getElementById("poke-id");
const pokeName = document.getElementById("poke-name");
const pokeTypes = document.getElementById("poke-types");
const pokeSprite = document.getElementById("poke-sprite");

const statMap = {
  hp: {
    value: document.getElementById("val-hp"),
    bar: document.getElementById("bar-hp"),
  },
  attack: {
    value: document.getElementById("val-attack"),
    bar: document.getElementById("bar-attack"),
  },
  defense: {
    value: document.getElementById("val-defense"),
    bar: document.getElementById("bar-defense"),
  },
  "special-attack": {
    value: document.getElementById("val-spatk"),
    bar: document.getElementById("bar-spatk"),
  },
  "special-defense": {
    value: document.getElementById("val-spdef"),
    bar: document.getElementById("bar-spdef"),
  },
  speed: {
    value: document.getElementById("val-speed"),
    bar: document.getElementById("bar-speed"),
  },
};

async function queryPokemonSpecimen() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (!response.ok) throw new Error("Not found");
    const data = await response.json();
    renderPokedexCard(data);
  } catch (error) {
    pokedexCard.classList.add("hidden");
    errorMessage.className = "error-visible";
  }
}

function renderPokedexCard(data) {
  errorMessage.className = "error-hidden";
  pokeId.textContent = `#${data.id.toString().padStart(3, "0")}`;
  pokeName.textContent = data.name;
  pokeSprite.src =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default;

  pokeTypes.innerHTML = "";
  data.types.forEach((t) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.style.backgroundColor = `var(--${t.type.name}, #707070)`;
    span.textContent = t.type.name;
    pokeTypes.appendChild(span);
  });

  data.stats.forEach((s) => {
    const target = statMap[s.stat.name];
    if (target) {
      target.value.textContent = s.base_stat;
      const percentage = Math.min((s.base_stat / 150) * 100, 100);
      setTimeout(() => {
        target.bar.style.width = `${percentage}%`;
      }, 50);
    }
  });

  pokedexCard.classList.remove("hidden");
}

searchBtn.addEventListener("click", queryPokemonSpecimen);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") queryPokemonSpecimen();
});

window.addEventListener("DOMContentLoaded", () => {
  searchInput.value = "1";
  queryPokemonSpecimen();
  searchInput.value = "";
});

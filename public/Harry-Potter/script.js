let students = [];
const spellList = document.getElementById('spell-list');
const spellInput = document.getElementById('spell-input');
const houseFilter = document.getElementById('house-filter');
const charSearch = document.getElementById('char-search');
const characterList = document.getElementById('character-list');
const mainContainer = document.getElementById('main-container');
const rosterContainer = document.createElement("div");
rosterContainer.id = "roster";
document.querySelector(".character-search").appendChild(rosterContainer);

const feedback = document.createElement("p");
feedback.id = "spell-feedback";
feedback.style.textAlign = "center";
feedback.style.marginTop = "10px";
feedback.style.fontWeight = "bold";

document.querySelector(".spell-caster").appendChild(feedback);

const spells = [
  "lumos (light mode)",
  "nox (dark mode)",
  "reducto (shake)",
  "expelliarmus (reset UI)",
  "accio (fetch characters)",
  "obliviate (clear roster)",
  "protego (shield effect)",
  "wingardium leviosa (float UI)"
];

spellList.innerHTML = `
  <strong>Spells Available</strong>
  <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
    ${spells.map(s => `<span style="
      padding:6px 10px;
      border-radius:20px;
      background:#2a2a2a;
      border:1px solid #444;
      font-size:12px;
    ">${s}</span>`).join("")}
  </div>
`;

mainContainer.addEventListener('animationend', (event) => {
  if (event.animationName === 'shake') {
    mainContainer.classList.remove('reducto-shake');
  }
});

let characters = [];

function renderRoster() {
  if (students.length === 0) {
  rosterContainer.innerHTML = "<p>No students added yet 🪄</p>";
  return;
}
  rosterContainer.innerHTML = "";

  const grouped = students.reduce((acc, s) => {
    if (!acc[s.house]) acc[s.house] = [];
    acc[s.house].push(s);
    return acc;
  }, {});

  Object.keys(grouped).forEach(house => {
    const section = document.createElement("div");

    section.innerHTML = `
      <h3>${house}</h3>
      ${grouped[house].map(s => `<p>${s.name}</p>`).join("")}
    `;

    rosterContainer.appendChild(section);
  });
}

const nameInput = document.createElement("input");
nameInput.placeholder = "Enter student name";

const addBtn = document.createElement("button");
addBtn.textContent = "Add Student";

document.querySelector(".character-search").appendChild(nameInput);
document.querySelector(".character-search").appendChild(addBtn);

addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const house = houseFilter.value;

  if (!name) {
    alert("⚠️ Enter a student name first!");
    return;
  }

  if (!house) {
    alert("⚠️ Select a house first!");
    return;
  }

  addStudent(name, house);

  alert(`✨ ${name} added to ${house}!`);

  nameInput.value = "";
}); 

// Fetch Characters from API
async function fetchCharacters() {
  try {
    const response = await fetch('https://hp-api.onrender.com/api/characters');
    characters = (await response.json())
  .filter((char) => char.image !== '')
  .slice(0, 30);

displayCharacters(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    characterList.innerHTML = '<p>Failed to load wizarding data.</p>';
  }
}

function addStudent(name, house) {
  if (!name || !house) return;

  const newStudent = { name, house };

  students = [...students, newStudent];

  renderRoster();
}

// Render Character Cards
function displayCharacters(chars) {
  characterList.innerHTML = '';

  if (chars.length === 0) {
    characterList.innerHTML = '<p>No characters found.</p>';
    return;
  }

  chars.forEach((char) => {
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
  if (!characters.length) return;
  const searchTerm = charSearch.value.toLowerCase();
  const selectedHouse = houseFilter.value;

  const filteredChars = characters.filter((char) => {
    const matchesName = char.name.toLowerCase().includes(searchTerm);
    const matchesHouse = selectedHouse === '' || char.house === selectedHouse;
    return matchesName && matchesHouse && char.image !== '';
  });

  displayCharacters(filteredChars);
}

spellInput.addEventListener('keyup', (e) => {

  if (e.key !== 'Enter') return;

  const spell = e.target.value.trim().toLowerCase();

  mainContainer.classList.remove('reducto-shake');

  if (spell === 'lumos') {
  document.body.classList.add('lumos-mode');
  feedback.textContent = "✨ Lumos — Light is restored!";
}

else if (spell === 'nox') {
  document.body.classList.remove('lumos-mode');
  feedback.textContent = "🌑 Nox — Darkness returns!";
}

else if (spell === 'reducto') {
  void mainContainer.offsetWidth;
  mainContainer.classList.add('reducto-shake');
  feedback.textContent = "💥 Reducto — Screen shakes!";
}

else if (spell === 'expelliarmus') {
  feedback.textContent = "🪄 Expelliarmus — Disarmed! (UI reset)";
  document.body.classList.remove('lumos-mode');
  mainContainer.classList.remove('reducto-shake');
}

else if (spell === 'accio') {
  feedback.textContent = "🧲 Accio — Fetching data...";

  setTimeout(async () => {
    await fetchCharacters();
    feedback.textContent = "✨ Accio complete — Characters summoned!";
  }, 500);
}

else if (spell === 'obliviate') {
  feedback.textContent = "🧠 Obliviate — Clearing roster...";

  // add visual wipe effect
  rosterContainer.style.opacity = "0.2";

  setTimeout(() => {
    students = [];
    renderRoster();

    rosterContainer.style.opacity = "1";
    feedback.textContent = "✨ Memory wiped!";
  }, 500);
}

else if (spell === 'protego') {
  feedback.textContent = "🛡️ Protego — Shield activated!";
  mainContainer.style.border = "2px solid gold";

  setTimeout(() => {
    mainContainer.style.border = "none";
  }, 2000);
}

else if (spell === 'wingardium leviosa') {
  feedback.textContent = "🪶 Wingardium Leviosa — Levitation spell!";

  const container = document.querySelector(".container");

  // lift up + smooth float
  container.style.transition = "transform 0.8s ease, box-shadow 0.8s ease";
  container.style.transform = "translateY(-25px)";
  container.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";

  setTimeout(() => {
    container.style.transform = "translateY(0px)";
    container.style.boxShadow = "none";
    feedback.textContent = "✨ Levitation ended";
  }, 1200);
}
});

houseFilter.addEventListener('change', applyFilters);
charSearch.addEventListener('input', applyFilters);

fetchCharacters();

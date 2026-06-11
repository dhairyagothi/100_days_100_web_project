const wordInput = document.getElementById("word-input");
const searchBtn = document.getElementById("search-btn");
const errorDiv = document.getElementById("error");
const resultMain = document.getElementById("result");
const displayWord = document.getElementById("display-word");
const audioBtn = document.getElementById("audio-btn");
const meaningsDiv = document.getElementById("meanings");

let audio = null;

async function lookup() {
  const word = wordInput.value.trim();
  if (!word) return;

  resultMain.classList.add("hidden");
  errorDiv.classList.add("hidden");
  audio = null;

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    render(data[0]);
  } catch (e) {
    errorDiv.classList.remove("hidden");
  }
}

function render(data) {
  displayWord.textContent = data.word;

  const audioNode = data.phonetics?.find((p) => p.audio);
  if (audioNode?.audio) {
    audio = new Audio(audioNode.audio);
    audioBtn.classList.remove("hidden");
  } else {
    audioBtn.classList.add("hidden");
  }

  meaningsDiv.innerHTML = "";
  data.meanings.forEach((m) => {
    const div = document.createElement("div");
    div.className = "block";
    div.innerHTML = `<span class="pos">${m.partOfSpeech}</span>`;

    m.definitions.slice(0, 2).forEach((d) => {
      const p = document.createElement("p");
      p.textContent = `• ${d.definition}`;
      div.appendChild(p);
    });
    meaningsDiv.appendChild(div);
  });

  resultMain.classList.remove("hidden");
}

searchBtn.addEventListener("click", lookup);
wordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") lookup();
});
audioBtn.addEventListener("click", () => {
  if (audio) audio.play();
});

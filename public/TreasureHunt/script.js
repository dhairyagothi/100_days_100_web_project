
const GameState = {
  score: 0,
  fragments: [null, null, null, null],
  fragmentsSpotted: 0,

  debug: { bug1: false, bug2: false, fragRevealed: false, fragCollected: false },
  dom:   { q1: false,   q2: false,   building1: false, building2: false, fragRevealed: false, fragCollected: false },
  logic: { tree1: false, tree2: false, fragRevealed: false, fragCollected: false },
  async: { chal1: false, chal2: false, fragRevealed: false, fragCollected: false },
};

const FRAGMENTS = [
  { index: 0, word: "CODE",  zone: "Debug Lab"     },
  { index: 1, word: "HUNT",  zone: "DOM City"       },
  { index: 2, word: "TRUE",  zone: "Logic Forest"   },
  { index: 3, word: "WAIT",  zone: "Async Vault"    },
];

const FINAL_CODE = "CODE-HUNT-TRUE-WAIT";

let vaultAttempts = 0;
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg, type = "success", duration = 3200) {
  const toast = $("#toast");
  $("#toast-icon").textContent  = type === "success" ? "✓" : "✕";
  $("#toast-msg").textContent   = msg;
  toast.className               = type === "error" ? "error" : "";
  toast.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add("hidden"), duration);
}

/* Add points and flash the score display */
function addScore(pts) {
  GameState.score += pts;
  const el = $("#nav-score-val");
  el.textContent  = String(GameState.score).padStart(3, "0");
  el.style.textShadow = "0 0 20px #ffb800, 0 0 50px #ffb80088";
  setTimeout(() => (el.style.textShadow = ""), 700);
}

/* Open the modal with a title and HTML body */
function openModal(title, bodyHTML) {
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML    = bodyHTML;
  $("#modal-overlay").classList.remove("hidden");
}
function closeModal() {
  $("#modal-overlay").classList.add("hidden");
}

function navigate(targetId) {
  $$(".page").forEach(p => {
    p.classList.remove("active");
    p.classList.add("hidden");
  });

  const pageMap = {
    hub:   "hub",
    debug: "page-debug",
    dom:   "page-dom",
    logic: "page-logic",
    async: "page-async",
    final: "page-final",
  };

  const page = $("#" + (pageMap[targetId] || targetId));
  if (!page) return;
  page.classList.remove("hidden");
  page.classList.add("active", "slide-in");
  setTimeout(() => page.classList.remove("slide-in"), 400);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function revealFragment(elemId, fragIndex) {
  const el = $("#" + elemId);
  if (!el) return;
  const encoded = el.dataset.fragment;
  el.textContent = atob(encoded);
  el.classList.add("revealed");
  el.addEventListener("click", () => {
    if (el.classList.contains("collected")) return;
    collectFragment(fragIndex, el);
  }, { once: true });
}
function collectFragment(fragIndex, el) {
  const frag = FRAGMENTS[fragIndex];
  if (GameState.fragments[fragIndex] !== null) return;
  GameState.fragments[fragIndex] = frag.word;
  GameState.fragmentsSpotted++;
  el.classList.remove("revealed");
  el.classList.add("collected");
  updateFragmentPanel(fragIndex, frag.word);
  addScore(150);
  showToast(`◈ Fragment "${frag.word}" collected from ${frag.zone}!`, "success", 3500);
  playSoundClue();
  $("#nav-frags-val").textContent = GameState.fragmentsSpotted + "/4";

  // Badge
  const badge = $("#clue-badge");
  badge.textContent = GameState.fragmentsSpotted;
  badge.classList.remove("hidden");
  if (GameState.fragmentsSpotted === 4) {
    setTimeout(unlockFinalVault, 600);
  }
}

function updateFragmentPanel(index, word) {
  const slot = $("#clue-slot-" + index);
  slot.classList.remove("empty");
  slot.classList.add("found");
  $(".clue-text", slot).textContent = word;

  const pct = (GameState.fragmentsSpotted / 4) * 100;
  $("#progress-fill").style.width    = pct + "%";
  $("#progress-label").textContent   = GameState.fragmentsSpotted + " of 4 fragments spotted";
}

function unlockFinalVault() {
  $("#final-vault-entry").classList.remove("hidden");
  $("#clue-panel").classList.add("open");

  const card = $("#zone-final");
  card.classList.remove("locked-zone");
  card.classList.add("unlocked-zone");
  $("#zs-final").textContent = "[ ✦ ENTER ]";

  showToast("★ All fragments collected! The Final Vault is now open.", "success", 4500);
}

function attachOptions(containerSel, resultSel, onCorrect) {
  const container = $(containerSel);
  const resultEl  = $(resultSel);
  if (!container || !resultEl) return;

  let solved       = false;
  let wrongCount   = 0;

  $$(".opt-btn", container).forEach(btn => {
    btn.addEventListener("click", () => {
      if (solved || btn.disabled) return;
      const isCorrect = btn.dataset.correct === "true";
      if (isCorrect) {
        solved = true;
        $$(".opt-btn", container).forEach(b => (b.disabled = true));
        btn.classList.add("correct");
        const pts = Math.max(100 - wrongCount * 20, 20);
        resultEl.classList.remove("hidden");
        resultEl.className   = "chal-result success";
        resultEl.textContent = wrongCount === 0
          ? `✓ Correct! +${pts} pts`
          : `✓ Correct after ${wrongCount} wrong attempt${wrongCount > 1 ? "s" : ""}! +${pts} pts`;
        addScore(pts);
        playSoundCorrect();
        onCorrect && onCorrect();

      } else {
        wrongCount++;
        $$(".opt-btn", container).forEach(b => (b.disabled = true));
        btn.classList.add("wrong");
        resultEl.classList.remove("hidden");
        resultEl.className   = "chal-result fail";
        resultEl.textContent = `✕ Not quite — try again! (Attempt ${wrongCount})`;
        playSoundWrong();
        setTimeout(() => {
          btn.classList.remove("wrong");
          resultEl.classList.add("hidden");
          $$(".opt-btn", container).forEach(b => (b.disabled = false));
        }, 1000);
      }
    });
  });
}

function initDebugLab() {
  attachOptions("#debug-opts-1", "#debug-result-1", () => {
    GameState.debug.bug1 = true;
    $("#bug-line-3").classList.add("fixed");
    showToast("Bug #1 fixed! Now find Bug #2.", "success");
    setTimeout(() => {
      const c2 = $("#debug-chal-2");
      c2.classList.remove("locked");
      c2.classList.add("unlocked");
      c2.style.animation = "fadeIn 0.5s ease";
    }, 500);
  });

  attachOptions("#debug-opts-2", "#debug-result-2", () => {
    GameState.debug.bug2 = true;
    $("#bug-line-6").classList.add("fixed");
    if (!GameState.debug.fragRevealed) {
      GameState.debug.fragRevealed = true;
      markZoneComplete("debug");
      $("#debug-frag-hint").classList.remove("hidden");
      setTimeout(() => {
        revealFragment("frag-debug", 0);
        showToast("🔍 Something appeared in the terminal header... look closely!", "success", 4000);
      }, 600);
    }
  });
}

function initDomCity() {
  $("#building-div").addEventListener("click", () => {
    if (GameState.dom.building1) return;
    GameState.dom.building1 = true;
    const el = $("#building-div");
    el.classList.add("revealed");
    $(".building-secret", el).textContent = "🔓 class=\"vault\" — stores hidden data";
    const q1 = $("#dom-q1");
    q1.classList.remove("hidden");
    attachOptions("#dom-q1 .chal-options", "#dom-result-1", () => {
      GameState.dom.q1 = true;
      showToast("DOM Q1 solved! Inspect the other element.", "success");
      checkDomComplete();
    });
  });

  $("#building-nav").addEventListener("click", () => {
    if (GameState.dom.building2) return;
    GameState.dom.building2 = true;
    const el = $("#building-nav");
    el.classList.add("revealed");
    $(".building-secret", el).textContent = "🔓 Inspecting... id=\"cipher\"";

    const q2 = $("#dom-q2");
    q2.classList.remove("hidden");
    attachOptions("#dom-q2 .chal-options", "#dom-result-2", () => {
      GameState.dom.q2 = true;
      checkDomComplete();
    });
  });
}

function checkDomComplete() {
  if (GameState.dom.q1 && GameState.dom.q2 && !GameState.dom.fragRevealed) {
    GameState.dom.fragRevealed = true;
    markZoneComplete("dom");
    $("#dom-frag-hint").classList.remove("hidden");

    setTimeout(() => {
      const attrSpan = $("#dom-frag-attr");
      attrSpan.classList.remove("hidden");
      revealFragment("frag-dom", 1);
      showToast("🔍 A data attribute appeared inside the nav tag... inspect it!", "success", 4000);
    }, 600);
  }
}

function initLogicForest() {
  attachOptions("#tree-1 .chal-options", "#logic-result-1", () => {
    GameState.logic.tree1 = true;
    showToast("Tree #1 traced! Unlock Tree #2.", "success");

    setTimeout(() => {
      const t2 = $("#tree-2");
      t2.classList.remove("locked");
      t2.classList.add("unlocked");
      t2.style.animation = "fadeIn 0.5s ease";
    }, 500);
  });

  attachOptions("#tree-2 .chal-options", "#logic-result-2", () => {
    GameState.logic.tree2 = true;

    if (!GameState.logic.fragRevealed) {
      GameState.logic.fragRevealed = true;
      markZoneComplete("logic");
      $("#logic-frag-hint").classList.remove("hidden");
      setTimeout(() => {
        const wrap = $("#logic-frag-wrap");
        wrap.classList.remove("hidden");
        revealFragment("frag-logic", 2);
        showToast("🔍 Something is glowing in the forest floor... scroll down!", "success", 4000);
      }, 600);
    }
  });
}

function initAsyncVault() {
  $("#async-animate-btn").addEventListener("click", () => {
    const steps = $$(".timeline-step");
    const btn   = $("#async-animate-btn");
    btn.disabled    = true;
    btn.textContent = "⏳ RUNNING...";

    steps.forEach((step, i) => {
      setTimeout(() => {
        steps.forEach(s => s.classList.remove("active"));
        step.classList.add("active");

        if (i === steps.length - 1) {
          setTimeout(() => {
            steps.forEach(s => { s.classList.remove("active"); s.classList.add("done"); });
            btn.textContent = "▶ ANIMATE AGAIN";
            btn.disabled    = false;
            $("#async-chal-1").classList.remove("locked");
          }, 700);
        }
      }, i * 900);
    });
  });

  attachOptions("#async-chal-1 .chal-options", "#async-result-1", () => {
    GameState.async.chal1 = true;
    showToast("Correct! setTimeout defers to after sync code. Challenge #2 unlocked.", "success");

    setTimeout(() => {
      const c2 = $("#async-chal-2");
      c2.classList.remove("locked");
      c2.classList.add("unlocked");
      c2.style.animation = "fadeIn 0.5s ease";
    }, 500);
  });
  attachOptions("#async-chal-2 .chal-options", "#async-result-2", () => {
    GameState.async.chal2 = true;

    if (!GameState.async.fragRevealed) {
      GameState.async.fragRevealed = true;
      markZoneComplete("async");
      $("#async-frag-hint").classList.remove("hidden");
      $("#async-console").classList.remove("hidden");
      setTimeout(() => {
        typeFragmentInConsole("WAIT", () => {
          revealFragment("frag-async", 3); 
          showToast("🔍 A Promise just resolved in the console... click it!", "success", 4000);
        });
      }, 800);
    }
  });
}

function typeFragmentInConsole(word, onDone) {
  const typingEl = $("#async-console-typing");
  typingEl.textContent = "> Promise resolved: ";

  let i = 0;
  const interval = setInterval(() => {
    if (i < word.length) {
      typingEl.textContent += word[i];
      i++;
    } else {
      clearInterval(interval);
      typingEl.innerHTML =
        `> Promise resolved: <span
            class="hidden-fragment"
            id="frag-async"
            data-fragment="V0FJVA=="
            data-index="3"
          >${word}</span>`;
      onDone && onDone();
    }
  }, 180);
}

function initFinalVault() {
  const input   = $("#vault-code-input");
  const btn     = $("#vault-submit-btn");
  const resultEl= $("#vault-input-result");
  const attemptsEl = $("#vault-attempt-count");

  input.addEventListener("input", () => {
    let val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let formatted = "";
    for (let i = 0; i < val.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += "-";
      formatted += val[i];
    }
    input.value = formatted;
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") btn.click();
  });

  btn.addEventListener("click", () => {
    const entered = input.value.trim().toUpperCase();
    vaultAttempts++;
    attemptsEl.textContent = vaultAttempts;

    if (entered === FINAL_CODE) {
      input.classList.add("success");
      input.disabled = true;
      btn.disabled   = true;
      resultEl.classList.add("hidden");
      const door = $("#vault-door-anim");
      door.classList.add("unlocked");
      $("#vault-center-icon").textContent = "🔓";

      playSoundClue();
      addScore(500 + Math.max(0, (5 - vaultAttempts) * 50));
      setTimeout(() => {
        showTreasure();
      }, 1200);

    } else {
      input.classList.add("error");
      setTimeout(() => input.classList.remove("error"), 600);

      resultEl.classList.remove("hidden");
      resultEl.className   = "vault-input-result fail";

      const collected = GameState.fragments.filter(f => f !== null).length;
      if (collected < 4) {
        resultEl.textContent = `✕ You only have ${collected}/4 fragments. Go collect the rest first!`;
      } else {
        resultEl.textContent = `✕ Wrong code. Check your fragments carefully. Attempt ${vaultAttempts}.`;
      }
      playSoundWrong();
    }
  });
}

/* Show the final treasure reveal on the Final Vault page */
function showTreasure() {
  $(".vault-input-zone").style.display = "none";
  const reveal = $("#treasure-reveal");
  reveal.classList.remove("hidden");
  $("#treasure-code-display").textContent  = FINAL_CODE;
  $("#treasure-final-score").textContent   = GameState.score;

  showToast("🏆 VAULT CRACKED! You found the treasure!", "success", 6000);
  ["debug","dom","logic","async","final"].forEach(z => {
    const card = $("#zone-" + z);
    if (card) card.classList.add("completed");
  });
}

function markZoneComplete(zoneKey) {
  const statusMap = { debug:"zs-debug", dom:"zs-dom", logic:"zs-logic", async:"zs-async" };
  const card = $("#zone-" + zoneKey);
  if (card) card.classList.add("completed");
  const s = $("#" + statusMap[zoneKey]);
  if (s) s.textContent = "[ ✓ SOLVED ]";
  addScore(50);
}

function runBootScreen() {
  const canvas = $("#boot-canvas");
  const ctx    = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff88";
    ctx.font      = "14px 'Share Tech Mono', monospace";
  }

  const matrixInterval = setInterval(drawMatrix, 50);
  const messages = [
    "INITIALIZING CIPHER ENGINE...",
    "LOADING ZONE MODULES...",
    "HIDING FRAGMENT KEYS...",
    "ENCRYPTING VAULT LOCK...",
    "ACTIVATING PUZZLE NODES...",
    "SYSTEM READY.",
  ];

  const bar      = $(".boot-bar");
  const statusEl = $("#boot-status");
  let   mi       = 0;
  const inc      = 100 / messages.length;

  const msgInt = setInterval(() => {
    if (mi < messages.length) {
      statusEl.textContent = messages[mi];
      bar.style.width      = inc * (mi + 1) + "%";
      mi++;
    } else {
      clearInterval(msgInt);
      setTimeout(() => $("#boot-enter").classList.remove("hidden"), 300);
    }
  }, 600);

  $("#boot-enter").addEventListener("click", () => {
    clearInterval(matrixInterval);
    const bs = $("#boot-screen");
    bs.classList.add("fade-out");
    setTimeout(() => {
      bs.classList.add("hidden");
      $("#app").classList.remove("hidden");
      initGame();
    }, 800);
  });
}

function initAmbientCanvas() {
  const canvas = $("#ambient-canvas");
  const ctx    = canvas.getContext("2d");

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 55 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     Math.random() * 1.4 + 0.3,
    vx:    (Math.random() - 0.5) * 0.22,
    vy:    (Math.random() - 0.5) * 0.22,
    alpha: Math.random() * 0.35 + 0.08,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freq = 440, type = "sine", duration = 0.15, vol = 0.15) {
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch(e) { /* audio unavailable */ }
}
function playSoundCorrect() { playTone(660, "sine",     0.18); }
function playSoundWrong()   { playTone(180, "sawtooth", 0.20); }
function playSoundNav()     { playTone(380, "sine",     0.10); }
function playSoundClue()    {
  playTone(880,  "sine", 0.22);
  setTimeout(() => playTone(1100, "sine", 0.28), 200);
}

function attachGlobalListeners() {
  $$(".zone-card").forEach(card => {
    card.addEventListener("click", () => {
      const zone = card.dataset.zone;
      if (zone === "final" && GameState.fragmentsSpotted < 4) {
        showToast("🔒 Collect all 4 fragments first!", "error");
        return;
      }
      playSoundNav();
      navigate(zone);
    });
  });
  $$(".btn-back").forEach(btn => {
    btn.addEventListener("click", () => {
      playSoundNav();
      navigate(btn.dataset.target || "hub");
    });
  });

  $("#clue-panel-toggle").addEventListener("click", () => {
    $("#clue-panel").classList.toggle("open");
  });
  $("#clue-panel-close").addEventListener("click", () => {
    $("#clue-panel").classList.remove("open");
  });

  $("#go-vault-btn").addEventListener("click", () => {
    $("#clue-panel").classList.remove("open");
    playSoundNav();
    navigate("final");
  });

  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-overlay").addEventListener("click", e => {
    if (e.target === $("#modal-overlay")) closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
      $("#clue-panel").classList.remove("open");
    }
  });
}

function initGame() {
  initAmbientCanvas();
  attachGlobalListeners();
  initDebugLab();
  initDomCity();
  initLogicForest();
  initAsyncVault();
  initFinalVault();
  navigate("hub");
  console.log("%c◈ CIPHER LOADED", "color:#00ff88;font-size:15px;font-weight:bold;");
  console.log("%c// Solve challenges → find + click hidden fragments → enter code in Final Vault", "color:#5a7a9a;font-size:12px;");
  console.log("%c// Hint: fragments are hidden in the terminal bar, a tag attribute, the forest floor, and the async console.", "color:#5a7a9a;font-size:12px;");
}

document.addEventListener("DOMContentLoaded", () => {
  runBootScreen();
});
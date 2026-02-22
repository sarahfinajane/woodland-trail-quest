const screen = document.getElementById("screen");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn  = document.getElementById("saveBtn");

const ASSETS = {
  startBg: "assets/start_bg.png",
  btnEnter: "assets/btn_enter.png",
  btnHow: "assets/btn_howtoplay.png",

  // optional later: create a map background in Canva and name it this:
  mapBg: "assets/map_bg.png",
};

const SAVE_KEY = "woodlandSave_v1";

const state = {
  soundOn: true,
  step: "start", // start | how | map

  // Character design that must persist across all levels:
  character: {
    type: "gnome",       // gnome | fairy
    hair: "#ff6aa6",
    skin: "#ffd6b3",
    eyes: "#16323a",
    clothes: "#2fd38c",
  },

  // You’ll add more later:
  unlockedLevels: { 1: true },
};

/* ---------- SAVE SYSTEM ---------- */
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Merge safely so future additions don’t break older saves
      Object.assign(state, parsed);
      state.character = { ...state.character, ...(parsed.character || {}) };
      state.unlockedLevels = { ...state.unlockedLevels, ...(parsed.unlockedLevels || {}) };
    } catch {
      // ignore broken saves
    }
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  // reset state (keep defaults)
  state.soundOn = true;
  state.step = "start";
  state.character = {
    type: "gnome",
    hair: "#ff6aa6",
    skin: "#ffd6b3",
    eyes: "#16323a",
    clothes: "#2fd38c",
  };
  state.unlockedLevels = { 1: true };
  render();
}

/* ---------- SOUND ---------- */
function playClick() {
  if (!state.soundOn) return;
  try {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAAAA"
    );
    audio.play();
  } catch {}
}

/* ---------- RENDER ROUTER ---------- */
function render() {
  if (state.step === "start") return renderStart();
  if (state.step === "how") return renderHow();
  if (state.step === "map") return renderMap();
  // fallback
  state.step = "start";
  return renderStart();
}

/* ---------- START SCREEN ---------- */
function renderStart() {
  screen.innerHTML = `
    <div class="start-screen" style="background-image:url('${ASSETS.startBg}')">
      <div class="start-bottom">
        <button class="start-btn" id="enterBtn" type="button" aria-label="Enter the Forest">
          <img src="${ASSETS.btnEnter}" alt="Enter the Forest">
        </button>

        <button class="start-btn" id="howBtn" type="button" aria-label="How to Play">
          <img src="${ASSETS.btnHow}" alt="How to Play">
        </button>
      </div>
    </div>
  `;

  document.getElementById("enterBtn").addEventListener("click", () => {
    playClick();
    state.step = "map";
    saveGame();
    render();
  });

  document.getElementById("howBtn").addEventListener("click", () => {
    playClick();
    state.step = "how";
    saveGame();
    render();
  });
}

/* ---------- HOW TO PLAY ---------- */
function renderHow() {
  screen.innerHTML = `
    <div class="how-screen" style="background-image:url('${ASSETS.startBg}')">
      <div class="how-overlay"></div>

      <div class="how-card" role="region" aria-label="How to Play">
        <div class="how-title">How to Play</div>
        <div class="how-sub">Explore • Click • Collect • Decorate</div>

        <div class="how-grid">
          <div class="how-step">
            <div class="how-icon">👣</div>
            <div><h3>Enter the Forest</h3><p>Go to the Forest Map hub to set your character and choose trails.</p></div>
          </div>
          <div class="how-step">
            <div class="how-icon">🔍</div>
            <div><h3>Observe</h3><p>Scenes have nature choices—plants, clouds, forest-floor finds.</p></div>
          </div>
          <div class="how-step">
            <div class="how-icon">🖱️</div>
            <div><h3>Choose</h3><p>Click the correct item to earn treasures.</p></div>
          </div>
          <div class="how-step">
            <div class="how-icon">🧰</div>
            <div><h3>Collect</h3><p>Your treasures stay in your chest for decorating later.</p></div>
          </div>
          <div class="how-step">
            <div class="how-icon">🪵</div>
            <div><h3>Decorate</h3><p>Use treasures to decorate your gnome hut or fairy house.</p></div>
          </div>
          <div class="how-step">
            <div class="how-icon">🌿</div>
            <div><h3>Safety</h3><p>Never eat wild plants unless a trusted adult confirms they are safe.</p></div>
          </div>
        </div>

        <div class="how-actions">
          <button class="how-btn" id="howBackBtn" type="button">← Back</button>
          <button class="how-btn" id="howGoMapBtn" type="button">Go to Map</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("howBackBtn").addEventListener("click", () => {
    playClick();
    state.step = "start";
    saveGame();
    render();
  });

  document.getElementById("howGoMapBtn").addEventListener("click", () => {
    playClick();
    state.step = "map";
    saveGame();
    render();
  });
}

/* ---------- FOREST MAP (HUB) ---------- */
function renderMap() {
  // If map_bg.png doesn't exist yet, the CSS will still show a color background.
  // You can add assets/map_bg.png later and it will appear automatically.
  const bg = ASSETS.mapBg;

  screen.innerHTML = `
    <div class="map-screen" style="background-image:url('${bg}')">
      <div class="map-overlay"></div>

      <div class="map-top">
        <button class="map-pill" id="mapHomeBtn" type="button">← Home</button>
        <div class="map-title">Forest Map</div>
        <button class="map-pill" id="mapSaveBtn" type="button">Save</button>
      </div>

      <div class="map-layout">
        <!-- LEFT: Character Design -->
        <div class="panel">
          <div class="panel-title">Choose Your Guide</div>
          <div class="panel-sub">This character will be used across all levels.</div>

          <div class="char-row">
            <button class="char-type ${state.character.type === "gnome" ? "active" : ""}" id="typeGnome" type="button">Gnome</button>
            <button class="char-type ${state.character.type === "fairy" ? "active" : ""}" id="typeFairy" type="button">Fairy</button>
          </div>

          <div class="avatar-preview" aria-label="Character preview">
            ${renderAvatarPreview()}
          </div>

          <div class="color-grid" aria-label="Color pickers">
            ${colorPicker("Hair", "hair", state.character.hair)}
            ${colorPicker("Skin", "skin", state.character.skin)}
            ${colorPicker("Eyes", "eyes", state.character.eyes)}
            ${colorPicker("Clothes", "clothes", state.character.clothes)}
          </div>

          <div class="panel-actions">
            <button class="map-btn" id="randomBtn" type="button">Surprise Colors</button>
            <button class="map-btn primary" id="useCharacterBtn" type="button">Use This Character</button>
          </div>

          <div class="tiny-note">Auto-saves as you edit (and you can press Save too).</div>
        </div>

        <!-- RIGHT: Trails/Levels (placeholder buttons for now) -->
        <div class="panel">
          <div class="panel-title">Trails</div>
          <div class="panel-sub">Your levels will live here (on the map).</div>

          <div class="trail-grid">
            <button class="trail-btn" id="level1Btn" type="button">Level 1</button>
            <button class="trail-btn locked" type="button" disabled>Level 2</button>
            <button class="trail-btn locked" type="button" disabled>Level 3</button>
            <button class="trail-btn locked" type="button" disabled>Potions</button>
            <button class="trail-btn locked" type="button" disabled>Foraging</button>
            <button class="trail-btn locked" type="button" disabled>Cloud Watch</button>
          </div>

          <div class="tiny-note">Next: we’ll make Level 1 actually launch from here.</div>
        </div>
      </div>
    </div>
  `;

  // Wire buttons
  document.getElementById("mapHomeBtn").addEventListener("click", () => {
    playClick();
    state.step = "start";
    saveGame();
    render();
  });

  document.getElementById("mapSaveBtn").addEventListener("click", () => {
    playClick();
    saveGame();
    alert("Saved!");
  });

  document.getElementById("typeGnome").addEventListener("click", () => {
    playClick();
    state.character.type = "gnome";
    saveGame();
    render(); // re-render to update preview + active state
  });

  document.getElementById("typeFairy").addEventListener("click", () => {
    playClick();
    state.character.type = "fairy";
    saveGame();
    render();
  });

  // Color pickers
  ["hair", "skin", "eyes", "clothes"].forEach((key) => {
    const el = document.getElementById(`pick-${key}`);
    el.addEventListener("input", (e) => {
      state.character[key] = e.target.value;
      saveGame();
      // Update preview without full rerender
      const preview = document.querySelector(".avatar-preview");
      if (preview) preview.innerHTML = renderAvatarPreview();
    });
  });

  document.getElementById("randomBtn").addEventListener("click", () => {
    playClick();
    state.character.hair = randomColor();
    state.character.skin = randomSkin();
    state.character.eyes = randomColor();
    state.character.clothes = randomColor();
    saveGame();
    render();
  });

  document.getElementById("useCharacterBtn").addEventListener("click", () => {
    playClick();
    saveGame();
    alert("Character saved! 🌲");
  });

  document.getElementById("level1Btn").addEventListener("click", () => {
    playClick();
    // placeholder — next we’ll connect your Level 1 game here
    alert("Level 1 will launch from the map next 🌲");
  });
}

/* ---------- UI HELPERS ---------- */

function colorPicker(label, key, value) {
  return `
    <div class="pick-row">
      <label for="pick-${key}">${label}</label>
      <input id="pick-${key}" type="color" value="${escapeHtml(value)}" />
    </div>
  `;
}

function renderAvatarPreview() {
  const c = state.character;
  const isFairy = c.type === "fairy";

  // Simple “paper doll” style preview with pure HTML/CSS colors.
  // Later you can swap this with your Canva layered art and keep the same state values.
  return `
    <div class="avatar">
      ${isFairy ? `<div class="wings"></div>` : `<div class="hat" style="background:${c.hair}"></div>`}
      <div class="hair" style="background:${c.hair}"></div>
      <div class="head" style="background:${c.skin}">
        <div class="eyes">
          <span class="eye" style="background:${c.eyes}"></span>
          <span class="eye" style="background:${c.eyes}"></span>
        </div>
        <div class="smile"></div>
      </div>
      <div class="body" style="background:${c.clothes}"></div>
      <div class="tag">${isFairy ? "Fairy" : "Gnome"}</div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function randomColor() {
  // bright-ish random
  const r = 80 + Math.floor(Math.random() * 175);
  const g = 80 + Math.floor(Math.random() * 175);
  const b = 80 + Math.floor(Math.random() * 175);
  return rgbToHex(r, g, b);
}

function randomSkin() {
  const skins = ["#ffd6b3", "#f7c6a3", "#e9b58f", "#d79c79", "#c98766", "#b17355", "#9a5f48"];
  return skins[Math.floor(Math.random() * skins.length)];
}

function rgbToHex(r, g, b) {
  const to = (n) => n.toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/* ---------- TOP BUTTON EVENTS ---------- */

soundBtn.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  saveGame();
  playClick();
});

saveBtn.addEventListener("click", () => {
  saveGame();
  playClick();
  alert("Progress saved!");
});

resetBtn.addEventListener("click", () => {
  if (confirm("Reset your forest journey?")) resetGame();
});

/* ---------- INIT ---------- */
loadGame();
render();

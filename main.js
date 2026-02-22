const screen = document.getElementById("screen");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn  = document.getElementById("saveBtn");

const ASSETS = {
  startBg: "assets/start_bg.png",
  btnEnter: "assets/btn_enter.png",
  btnHow: "assets/btn_howtoplay.png",
  mapBg: "assets/map_bg.png",
};

const CHAR_EXT = "png";
const SAVE_KEY = "woodlandSave_v3";

const CHARACTERS = [
  { id: "bgnome",  title: "Gnome Boy",    colors: ["red","orange","yellow","green","blue","purple","black","white"] },
  { id: "ggnome",  title: "Gnome Girl",   colors: ["red","orange","green","blue","black","white"] },
  { id: "fgfairy1",title: "Fairy Girl 1", colors: ["red","purple","green","black"] },
  { id: "fgfairy2",title: "Fairy Girl 2", colors: ["red","blue","green","black"] },
  { id: "mush",    title: "Mushie",       colors: ["red","orange","yellow","green","blue","purple","pink"] },
];

const SWATCH_HEX = {
  red:"#ff3b30",
  orange:"#ff9500",
  yellow:"#ffd60a",
  green:"#34c759",
  blue:"#007aff",
  purple:"#af52de",
  pink:"#ff2d55",
  black:"#111111",
  white:"#ffffff"
};

const state = {
  soundOn: true,
  step: "start",
  character: {
    id: "bgnome",
    color: "red"
  }
};

/* ---------- SAVE ---------- */
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  } catch {}
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  state.soundOn = true;
  state.step = "start";
  state.character = { id:"bgnome", color:"red" };
  render();
}

/* ---------- SOUND ---------- */
function playClick() {
  if (!state.soundOn) return;
  try {
    const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAAAA");
    audio.play();
  } catch {}
}

/* ---------- ROUTER ---------- */
function render() {
  if (state.step === "start") return renderStart();
  if (state.step === "how") return renderHow();
  if (state.step === "map") return renderMap();
  state.step = "start";
  renderStart();
}

/* ---------- START ---------- */
function renderStart() {
  screen.innerHTML = `
    <div class="start-screen" style="background-image:url('${ASSETS.startBg}')">
      <div class="start-bottom">
        <button class="start-btn" id="enterBtn">
          <img src="${ASSETS.btnEnter}" alt="Enter">
        </button>
        <button class="start-btn" id="howBtn">
          <img src="${ASSETS.btnHow}" alt="How">
        </button>
      </div>
    </div>
  `;

  document.getElementById("enterBtn").onclick = () => {
    playClick();
    state.step = "map";
    saveGame();
    render();
  };

  document.getElementById("howBtn").onclick = () => {
    playClick();
    state.step = "how";
    render();
  };
}

/* ---------- HOW ---------- */
function renderHow() {
  screen.innerHTML = `
    <div class="how-screen" style="background-image:url('${ASSETS.startBg}')">
      <div class="how-overlay"></div>
      <div class="how-card">
        <div class="how-title">How to Play</div>
        <p>Explore. Click the correct nature items. Collect treasures. Decorate your home.</p>
        <button id="backBtn" class="how-btn">Back</button>
      </div>
    </div>
  `;
  document.getElementById("backBtn").onclick = () => {
    state.step = "start";
    render();
  };
}

/* ---------- MAP ---------- */
function renderMap() {

  const def = CHARACTERS.find(c => c.id === state.character.id);
  if (!def.colors.includes(state.character.color)) {
    state.character.color = def.colors[0];
  }

  const bigSrc = `assets/${state.character.id}_${state.character.color}.${CHAR_EXT}`;

  screen.innerHTML = `
    <div class="map-screen" style="background-image:url('${ASSETS.mapBg}')">
      <div class="map-overlay"></div>

      <div class="map-top">
        <button id="homeBtn" class="map-pill">← Home</button>
        <div class="map-title">Forest Map</div>
        <button id="saveMapBtn" class="map-pill">Save</button>
      </div>

      <div class="map-layout">

        <div class="panel">
          <div class="panel-title">Choose Your Character</div>

          <div class="char-grid">
            ${CHARACTERS.map(c => `
              <button class="char-card ${c.id===state.character.id?'active':''}" data-id="${c.id}">
                <img src="assets/${c.id}_red.${CHAR_EXT}">
                <div class="char-card-title">${c.title}</div>
              </button>
            `).join("")}
          </div>

          <div class="char-preview">
            <img id="bigChar" src="${bigSrc}">
            <div class="char-name">${def.title}</div>
          </div>

          <div class="swatch-row">
            ${def.colors.map(color => `
              <button class="swatch ${color===state.character.color?'active':''}" data-color="${color}">
                <span class="swatch-dot" style="background:${SWATCH_HEX[color]}"></span>
              </button>
            `).join("")}
          </div>

        </div>

        <div class="panel">
          <div class="panel-title">Trails</div>
          <button class="trail-btn">Level 1</button>
        </div>

      </div>
    </div>
  `;

  document.getElementById("homeBtn").onclick = () => {
    state.step = "start";
    render();
  };

  document.getElementById("saveMapBtn").onclick = () => {
    saveGame();
    alert("Saved!");
  };

  document.querySelectorAll(".char-card").forEach(btn => {
    btn.onclick = () => {
      state.character.id = btn.dataset.id;
      state.character.color = "red";
      saveGame();
      render();
    };
  });

  document.querySelectorAll(".swatch").forEach(btn => {
    btn.onclick = () => {
      state.character.color = btn.dataset.color;
      saveGame();
      document.getElementById("bigChar").src =
        `assets/${state.character.id}_${state.character.color}.${CHAR_EXT}`;
      document.querySelectorAll(".swatch").forEach(s=>s.classList.remove("active"));
      btn.classList.add("active");
    };
  });
}

/* ---------- TOP BUTTONS ---------- */
soundBtn.onclick = () => {
  state.soundOn = !state.soundOn;
  saveGame();
  playClick();
};

saveBtn.onclick = () => {
  saveGame();
  alert("Saved!");
};

resetBtn.onclick = () => {
  if (confirm("Reset progress?")) resetGame();
};

/* ---------- INIT ---------- */
loadGame();
render();

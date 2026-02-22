const screen = document.getElementById("screen");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn  = document.getElementById("saveBtn");

const ASSETS = {
  startBg: "assets/start_bg.png",
  btnEnter: "assets/btn_enter.png",
  btnHow: "assets/btn_howtoplay.png",
};

const CHAR_EXT = "png";
const SAVE_KEY = "woodlandSave_v5";

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

  // what they are currently selecting
  character: { id: "bgnome", color: "red" },

  // what they have CONFIRMED with ✅
  confirmedCharacter: null,

  // where the character token sits on the map (pixels inside the map box)
  playerPos: { x: 40, y: 40 },
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
    // safety defaults:
    if (!state.character) state.character = { id:"bgnome", color:"red" };
    if (!state.playerPos) state.playerPos = { x:40, y:40 };
  } catch {}
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  state.soundOn = true;
  state.step = "start";
  state.character = { id:"bgnome", color:"red" };
  state.confirmedCharacter = null;
  state.playerPos = { x:40, y:40 };
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
  if (state.step === "map") return renderMap();
  if (state.step === "how") return renderHow();
}

/* ---------- START ---------- */
function renderStart() {
  screen.innerHTML = `
    <div class="start-screen" style="background-image:url('${ASSETS.startBg}')">
      <div class="start-bottom">
        <button class="start-btn" id="enterBtn">
          <img src="${ASSETS.btnEnter}" alt="Enter the Forest">
        </button>
        <button class="start-btn" id="howBtn">
          <img src="${ASSETS.btnHow}" alt="How to Play">
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
        <p style="margin-top:10px; line-height:1.35;">
          Choose a character, tap ✅ to place them on the map, then click a glowing level circle.
          <br><br>
          Later you’ll collect treasures and decorate your forest home.
        </p>
        <button class="how-btn" id="backBtn">Back</button>
      </div>
    </div>
  `;

  document.getElementById("backBtn").onclick = () => {
    playClick();
    state.step = "start";
    render();
  };
}

/* ---------- MAP (CHARACTER + MAP + LEVELS + TOKEN) ---------- */
function renderMap() {
  const def = CHARACTERS.find(c => c.id === state.character.id) || CHARACTERS[0];

  // if saved color isn't valid for that character, pick the first valid one
  if (!def.colors.includes(state.character.color)) {
    state.character.color = def.colors.includes("red") ? "red" : def.colors[0];
  }

  const bigSrc = `assets/${state.character.id}_${state.character.color}.${CHAR_EXT}`;

  screen.innerHTML = `
    <div class="map-screen">

      <div class="map-top">
        <button class="map-pill" id="homeBtn">← Home</button>
      </div>

      <div class="map-layout">

        <!-- LEFT PANEL -->
        <div class="panel">
          <div class="panel-title">Choose Your Character</div>

          <div class="char-grid">
            ${CHARACTERS.map(c => `
              <button class="char-card ${c.id===state.character.id?'active':''}" data-id="${c.id}">
                <img src="assets/${c.id}_red.${CHAR_EXT}" alt="${c.title}">
                <div class="char-card-title">${c.title}</div>
              </button>
            `).join("")}
          </div>

          <div class="char-preview">
            <img id="bigChar" src="${bigSrc}" alt="${def.title}">
            <div class="char-name" id="charName">${def.title}</div>

            <div class="confirm-row">
              <button class="confirm-btn" id="confirmBtn" title="Use this character">✅</button>
              <div class="confirm-text">Tap ✅ to place your character on the map</div>
            </div>
          </div>

          <div class="swatch-row">
            ${def.colors.map(color => `
              <button class="swatch ${color===state.character.color?'active':''}" data-color="${color}">
                <span class="swatch-dot" style="background:${SWATCH_HEX[color] || '#ccc'}"></span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="panel">
          <div class="panel-title">Forest Map</div>

          <div class="map-frame" id="mapFrame">
            <img src="assets/bkg_map.png" class="map-img" alt="Forest Map">

            <!-- GLOWING LEVEL SPOTS (we will move these later) -->
            <button class="level-spot" id="lvl1" style="left: 110px; top: 250px;">1</button>
            <button class="level-spot" id="lvl2" style="left: 210px; top: 220px;">2</button>
            <button class="level-spot" id="lvl3" style="left: 310px; top: 190px;">3</button>

            <!-- CHARACTER TOKEN -->
            <div id="playerToken" class="player-token" style="display:none;"></div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Home button
  document.getElementById("homeBtn").onclick = () => {
    playClick();
    state.step = "start";
    saveGame();
    render();
  };

  // Character choose
  document.querySelectorAll(".char-card").forEach(btn => {
    btn.onclick = () => {
      playClick();
      state.character.id = btn.dataset.id;

      const newDef = CHARACTERS.find(c => c.id === state.character.id);
      state.character.color = newDef.colors.includes("red") ? "red" : newDef.colors[0];

      saveGame();
      render(); // re-render so swatches match that character
    };
  });

  // Color choose
  document.querySelectorAll(".swatch").forEach(btn => {
    btn.onclick = () => {
      playClick();
      state.character.color = btn.dataset.color;
      saveGame();

      const big = document.getElementById("bigChar");
      if (big) big.src = `assets/${state.character.id}_${state.character.color}.${CHAR_EXT}`;

      document.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
    };
  });

  // Confirm ✅ (locks in character and places token on map)
  document.getElementById("confirmBtn").onclick = () => {
    playClick();
    state.confirmedCharacter = { ...state.character };
    saveGame();
    placeTokenOnMap();
  };

  // Level clicks (move token)
  document.getElementById("lvl1").onclick = () => {
    if (!state.confirmedCharacter) return alert("Choose your character and tap ✅ first!");
    moveTokenTo(110, 250);
    alert("Level 1 will open next!");
  };
  document.getElementById("lvl2").onclick = () => {
    if (!state.confirmedCharacter) return alert("Choose your character and tap ✅ first!");
    moveTokenTo(210, 220);
    alert("Level 2 later!");
  };
  document.getElementById("lvl3").onclick = () => {
    if (!state.confirmedCharacter) return alert("Choose your character and tap ✅ first!");
    moveTokenTo(310, 190);
    alert("Level 3 later!");
  };

  // Show token if already confirmed
  placeTokenOnMap();
}

/* ---------- MAP TOKEN HELPERS ---------- */
function placeTokenOnMap() {
  const token = document.getElementById("playerToken");
  if (!token) return;

  if (!state.confirmedCharacter) {
    token.style.display = "none";
    return;
  }

  token.style.display = "grid";
  token.style.left = `${state.playerPos.x}px`;
  token.style.top  = `${state.playerPos.y}px`;
  token.innerHTML = `
    <img src="assets/${state.confirmedCharacter.id}_${state.confirmedCharacter.color}.${CHAR_EXT}" alt="Player">
  `;
}

function moveTokenTo(x, y) {
  state.playerPos = { x, y };
  saveGame();
  placeTokenOnMap();
}

/* ---------- TOP BUTTONS ---------- */
soundBtn.onclick = () => {
  state.soundOn = !state.soundOn;
  saveGame();
  playClick();
};

saveBtn.onclick = () => {
  saveGame();
  playClick();
  alert("Saved!");
};

resetBtn.onclick = () => {
  if (confirm("Reset progress?")) resetGame();
};

/* ---------- INIT ---------- */
loadGame();
render();

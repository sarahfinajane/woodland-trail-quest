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

  // current selection
  character: { id: "bgnome", color: "red" },

  // confirmed selection (after ✅)
  confirmedCharacter: null,

  // token position INSIDE the map box (pixels)
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

/* ---------- MAP WITH CHARACTER PICKER + MAP IMAGE ---------- */
function renderMap() {
  const def = CHARACTERS.find(c => c.id === state.character.id) || CHARACTERS[0];

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

            <!-- 6 LEVELS (placeholder coords - you'll replace using click tool) -->
           <button class="level-spot" id="lvl1" style="left:109px; top:411px;">1</button>
<button class="level-spot" id="lvl2" style="left:276px; top:429px;">2</button>
<button class="level-spot" id="lvl3" style="left:354px; top:339px;">3</button>
<button class="level-spot" id="lvl4" style="left:528px; top:359px;">4</button>
<button class="level-spot" id="lvl5" style="left:702px; top:283px;">5</button>
<button class="level-spot" id="lvl6" style="left:845px; top:287px;">6</button>

            <!-- coordinate label -->
            <div id="coordTip" class="coord-tip" style="display:none;">x: 0, y: 0</div>

            <!-- character token -->
            <div id="playerToken" class="player-token" style="display:none;"></div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Home
  document.getElementById("homeBtn").onclick = () => {
    playClick();
    state.step = "start";
    saveGame();
    render();
  };

  // Character switch
  document.querySelectorAll(".char-card").forEach(btn => {
    btn.onclick = () => {
      playClick();
      state.character.id = btn.dataset.id;

      const newDef = CHARACTERS.find(c => c.id === state.character.id);
      state.character.color = newDef.colors.includes("red") ? "red" : newDef.colors[0];

      saveGame();
      render();
    };
  });

  // Color switch
  document.querySelectorAll(".swatch").forEach(btn => {
    btn.onclick = () => {
      playClick();
      state.character.color = btn.dataset.color;
      saveGame();

      const big = document.getElementById("bigChar");
      if (big) big.src = `assets/${state.character.id}_${state.character.color}.${CHAR_EXT}`;

      document.querySelectorAll(".swatch").forEach(s=>s.classList.remove("active"));
      btn.classList.add("active");
    };
  });

  // Confirm ✅
  document.getElementById("confirmBtn").onclick = () => {
    playClick();
    state.confirmedCharacter = { ...state.character };
    saveGame();
    placeTokenOnMap();
  };

  // Level clicks (moves token)
  function requireConfirmed() {
    if (!state.confirmedCharacter) {
      alert("Choose your character and tap ✅ first!");
      return false;
    }
    return true;
  }

 document.getElementById("lvl1").onclick = () => { if (!requireConfirmed()) return; moveTokenTo(276,429); };
document.getElementById("lvl2").onclick = () => { if (!requireConfirmed()) return; moveTokenTo(276,429); };
document.getElementById("lvl3").onclick = () => { if (!requireConfirmed()) return; moveTokenTo(354,339); };
document.getElementById("lvl4").onclick = () => { if (!requireConfirmed()) return; moveTokenTo(528,359); };
document.getElementById("lvl5").onclick = () => { if (!requireConfirmed()) return; moveTokenTo(702,283); };
document.getElementById("lvl6").onclick = () => { if (!requireConfirmed()) return; moveTokenTo(845,287); };
  // Show token if already confirmed
  placeTokenOnMap();

  // --- COORDINATE CLICK TOOL ---
  const mapFrame = document.getElementById("mapFrame");
  const coordTip = document.getElementById("coordTip");

  if (mapFrame) {
    mapFrame.addEventListener("click", (e) => {
      // ignore clicks on level buttons or player token
      const clickedButton = e.target.closest(".level-spot");
      const clickedToken  = e.target.closest("#playerToken");
      if (clickedButton || clickedToken) return;

      const rect = mapFrame.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);

      console.log("MAP COORDS:", x, y);

      if (coordTip) {
        coordTip.style.display = "block";
        coordTip.style.left = (x + 10) + "px";
        coordTip.style.top  = (y + 10) + "px";
        coordTip.textContent = "x: " + x + ", y: " + y;

        clearTimeout(window.__coordHideTimer);
        window.__coordHideTimer = setTimeout(() => {
          coordTip.style.display = "none";
        }, 1200);
      }
    });
  }
}

/* ---------- TOKEN HELPERS ---------- */
function placeTokenOnMap() {
  const token = document.getElementById("playerToken");
  if (!token) return;

  if (!state.confirmedCharacter) {
    token.style.display = "none";
    return;
  }

  token.style.display = "grid";
  token.style.left = state.playerPos.x + "px";
  token.style.top  = state.playerPos.y + "px";
  token.innerHTML = `<img src="assets/${state.confirmedCharacter.id}_${state.confirmedCharacter.color}.${CHAR_EXT}" alt="Player">`;
}

function moveTokenTo(x, y) {
  state.playerPos = { x, y };
  saveGame();
  placeTokenOnMap();
}

/* ---------- TOP BUTTONS (GUARDED) ---------- */
if (soundBtn) {
  soundBtn.onclick = () => {
    state.soundOn = !state.soundOn;
    saveGame();
    playClick();
  };
}
if (saveBtn) {
  saveBtn.onclick = () => {
    saveGame();
    playClick();
    alert("Saved!");
  };
}
if (resetBtn) {
  resetBtn.onclick = () => {
    if (confirm("Reset progress?")) resetGame();
  };
}

/* ---------- INIT ---------- */
loadGame();
render();

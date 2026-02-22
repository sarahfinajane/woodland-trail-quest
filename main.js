const screen = document.getElementById("screen");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn  = document.getElementById("saveBtn");

const ASSETS = {
  startBg: "assets/start_bg.png",
  btnEnter: "assets/btn_enter.png",
  btnHow: "assets/btn_howtoplay.png",
  level1: "assets/btn_lvl1.png",
};

const state = {
  soundOn: true,
  step: "start",       // start | how | pick | level1 ...
  currentLevel: 1,
};

/* ---------- SAVE SYSTEM ---------- */
function saveGame() {
  localStorage.setItem("woodlandSave", JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem("woodlandSave");
  if (saved) Object.assign(state, JSON.parse(saved));
}

function resetGame() {
  localStorage.removeItem("woodlandSave");
  state.soundOn = true;
  state.step = "start";
  state.currentLevel = 1;
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
  // placeholder for next pages:
  screen.innerHTML = `<div style="color:white; padding:24px;">Next screen coming soon 🌲</div>`;
}

/* ---------- START SCREEN ---------- */
function renderStart() {
  screen.innerHTML = `
    <div class="start-screen" style="background-image:url('${ASSETS.startBg}')">

      <div class="level-column" aria-label="Level buttons">
        <button class="level-btn" id="level1Btn" type="button" aria-label="Play Level 1">
          <img src="${ASSETS.level1}" alt="Level 1">
        </button>
      </div>

      <div class="start-bottom" aria-label="Start buttons">
        <button class="start-btn" id="enterBtn" type="button" aria-label="Enter the Forest">
          <img src="${ASSETS.btnEnter}" alt="Enter the Forest">
        </button>

        <button class="start-btn" id="howBtn" type="button" aria-label="How to Play">
          <img src="${ASSETS.btnHow}" alt="How to Play">
        </button>
      </div>

    </div>
  `;

  document.getElementById("level1Btn").addEventListener("click", () => {
    playClick();
    state.currentLevel = 1;
    state.step = "level1"; // later: route to the real Level 1 game
    saveGame();
    alert("Level 1 will open here next 🌲");
  });

  document.getElementById("enterBtn").addEventListener("click", () => {
    playClick();
    state.step = "pick"; // later: character select page
    saveGame();
    alert("Character select coming next ✨");
  });

  // ✅ NOW CLICKABLE: takes you to How to Play page
  document.getElementById("howBtn").addEventListener("click", () => {
    playClick();
    state.step = "how";
    saveGame();
    render();
  });
}

/* ---------- HOW TO PLAY SCREEN ---------- */
function renderHow() {
  screen.innerHTML = `
    <div class="how-screen" style="background-image:url('${ASSETS.startBg}')">
      <div class="how-overlay"></div>

      <div class="how-card" role="region" aria-label="How to Play">
        <div class="how-title">How to Play</div>
        <div class="how-sub">A bright forest-school quest: explore, click, collect, decorate.</div>

        <div class="how-grid">
          <div class="how-step">
            <div class="how-icon">👣</div>
            <div>
              <h3>Start a Trail</h3>
              <p>Tap <b>Enter the Forest</b> to begin your adventure (character + levels coming next).</p>
            </div>
          </div>

          <div class="how-step">
            <div class="how-icon">🔍</div>
            <div>
              <h3>Look Closely</h3>
              <p>Each scene has hidden nature choices—flowers, clouds, forest-floor finds.</p>
            </div>
          </div>

          <div class="how-step">
            <div class="how-icon">🖱️</div>
            <div>
              <h3>Click the Correct Thing</h3>
              <p>Pick the right item in the scene to earn a treasure for your inventory chest.</p>
            </div>
          </div>

          <div class="how-step">
            <div class="how-icon">🧰</div>
            <div>
              <h3>Collect Treasures</h3>
              <p>Treasures stack up as you play. Later you’ll use them to decorate a hut or fairy house.</p>
            </div>
          </div>

          <div class="how-step">
            <div class="how-icon">🪵</div>
            <div>
              <h3>Decorate Your Home</h3>
              <p>At the end of a level, place treasures around your gnome hut or fairy house.</p>
            </div>
          </div>

          <div class="how-step">
            <div class="how-icon">🌿</div>
            <div>
              <h3>Forest Safety</h3>
              <p>Never eat wild plants unless a trusted adult confirms they are safe.</p>
            </div>
          </div>
        </div>

        <div class="how-actions">
          <button class="how-btn" id="howBackBtn" type="button">← Back</button>
          <button class="how-btn" id="howSaveBtn" type="button">Save</button>
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

  document.getElementById("howSaveBtn").addEventListener("click", () => {
    playClick();
    saveGame();
    alert("Progress saved!");
  });
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

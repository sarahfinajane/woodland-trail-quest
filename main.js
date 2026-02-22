const screen = document.getElementById("screen");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn  = document.getElementById("saveBtn");

const ASSETS = {
  startBg: "assets/start_bg.png",
  btnEnter: "assets/btn_enter.png",        // <-- new name (no underscore)
  btnHow: "assets/btn_howtoplay.png",
  level1: "assets/btn_lvl1.png",
};

const state = {
  soundOn: true,
  step: "start",
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

/* ---------- RENDER ---------- */
function render() {
  if (state.step === "start") renderStart();
  else {
    // placeholder for next screens
    screen.innerHTML = `<div style="color:white; padding:24px;">Next screen coming soon 🌲</div>`;
  }
}

/* ---------- START SCREEN ---------- */
function renderStart() {
  screen.innerHTML = `
    <div class="start-screen" style="background-image:url('${ASSETS.startBg}')">

      <!-- LEFT: LEVEL BUTTONS -->
      <div class="level-column" aria-label="Level buttons">
        <button class="level-btn" id="level1Btn" type="button" aria-label="Play Level 1">
          <img src="${ASSETS.level1}" alt="Level 1">
        </button>
      </div>

      <!-- BOTTOM: ENTER + HOW TO PLAY -->
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

  // Level 1 clickable
  document.getElementById("level1Btn").addEventListener("click", () => {
    playClick();
    state.currentLevel = 1;
    state.step = "level1";   // later: route to your actual level 1 game
    saveGame();
    alert("Level 1 will open here next 🌲");
  });

  // Enter clickable
  document.getElementById("enterBtn").addEventListener("click", () => {
    playClick();
    state.step = "pick";     // later: character select
    saveGame();
    alert("Character select coming next ✨");
  });

  // How to play
  document.getElementById("howBtn").addEventListener("click", () => {
    alert("How to Play:\n\n• Click the correct nature item in each scene\n• Collect treasures\n• Decorate your hut at the end!");
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

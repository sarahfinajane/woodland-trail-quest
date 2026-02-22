const screen = document.getElementById("screen");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");

const state = {
  soundOn: true,
  step: "start"
};

/* ---------- SAVE SYSTEM ---------- */

function saveGame() {
  localStorage.setItem("woodlandSave", JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem("woodlandSave");
  if (saved) {
    Object.assign(state, JSON.parse(saved));
  }
}

function resetGame() {
  localStorage.removeItem("woodlandSave");
  state.step = "start";
  render();
}

/* ---------- SOUND ---------- */

function playClick() {
  if (!state.soundOn) return;
  const audio = new Audio(
    "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAAAA"
  );
  audio.play();
}

/* ---------- RENDER ---------- */

function render() {
  if (state.step === "start") renderStart();
}

/* ---------- START SCREEN ---------- */

function renderStart() {
  screen.innerHTML = `
    <div class="start-screen" style="background-image:url('assets/start_bg.png')">
      <div class="start-content">
        <img src="assets/btn_lvl1.png" class="start-level" alt="Level 1">
        
        <img src="assets/_btn_enter.png" class="start-btn" id="enterBtn" alt="Enter">
        
        <img src="assets/btn_howtoplay.png" class="start-btn" id="howBtn" alt="How To Play">
      </div>
    </div>
  `;

  document.getElementById("enterBtn").addEventListener("click", () => {
    playClick();
    state.step = "next"; // placeholder for next screen
    saveGame();
    alert("Next screen coming soon 🌲");
  });

  document.getElementById("howBtn").addEventListener("click", () => {
    alert("Tap the correct things in each forest scene to collect treasures!");
  });
}

/* ---------- BUTTON EVENTS ---------- */

soundBtn.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  saveGame();
});

resetBtn.addEventListener("click", () => {
  if (confirm("Reset your forest journey?")) {
    resetGame();
  }
});

/* ---------- INIT ---------- */

loadGame();
render();

const screen = document.getElementById("screen");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn  = document.getElementById("saveBtn");

const ASSETS = {
  startBg: "assets/start_bg.png",
  btnEnter: "assets/btn_enter.png",
  btnHow: "assets/btn_howtoplay.png"
};

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
  if (saved) Object.assign(state, JSON.parse(saved));
}

function resetGame() {
  localStorage.removeItem("woodlandSave");
  state.soundOn = true;
  state.step = "start";
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
  if (state.step === "how") renderHow();
}

/* ---------- START SCREEN (NO LEVEL BUTTONS) ---------- */

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

  document.getElementById("enterBtn").addEventListener("click", () => {
    playClick();
    state.step = "map";   // next we will build this
    saveGame();
    alert("Forest Map coming next 🌲");
  });

  document.getElementById("howBtn").addEventListener("click", () => {
    playClick();
    state.step = "how";
    render();
  });
}

/* ---------- HOW TO PLAY ---------- */

function renderHow() {
  screen.innerHTML = `
    <div class="start-screen" style="background-image:url('${ASSETS.startBg}')">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.4);"></div>

      <div style="
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        background:white;
        padding:30px;
        border-radius:20px;
        width:min(700px,90vw);
      ">
        <h2>How to Play</h2>
        <p style="margin-top:10px;">
          • Click the correct nature item in each forest scene.<br>
          • Collect treasures for your inventory chest.<br>
          • Decorate your gnome hut or fairy house.<br><br>
          Never eat wild plants unless a trusted adult confirms they are safe.
        </p>

        <button id="backBtn" style="margin-top:20px; padding:10px 20px;">
          Back
        </button>
      </div>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => {
    state.step = "start";
    render();
  });
}

/* ---------- TOP BUTTON EVENTS ---------- */

soundBtn.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  saveGame();
});

saveBtn.addEventListener("click", () => {
  saveGame();
  alert("Progress saved!");
});

resetBtn.addEventListener("click", () => {
  if (confirm("Reset your forest journey?")) resetGame();
});

/* ---------- INIT ---------- */

loadGame();
render();

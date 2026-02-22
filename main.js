const screen = document.getElementById("screen");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn  = document.getElementById("saveBtn");

const ASSETS = {
  startBg: "assets/start_bg.png",
  btnEnter: "assets/btn_enter.png",
  btnHow: "assets/btn_howtoplay.png",
  mapBg: "assets/map_bg.png",

  // Character SVGs
  gnomeBody: "assets/gnome_body.svg",
  gnomeHat: "assets/gnome_hat.svg",
  fairyGirl: "assets/fairy_girl.svg",
  fairyWings: "assets/fairy_wings.svg",
};

const SAVE_KEY = "woodlandSave_v2_svg";

const state = {
  soundOn: true,
  step: "start", // start | how | map

  character: {
    type: "gnome",     // gnome | fairy
    hatColor: "#ff3b87",
    wingColor: "#7b5cff",
  },
};

/* ---------- SAVE SYSTEM ---------- */
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
    state.character = { ...state.character, ...(parsed.character || {}) };
  } catch {}
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  state.soundOn = true;
  state.step = "start";
  state.character = {
    type: "gnome",
    hatColor: "#ff3b87",
    wingColor: "#7b5cff",
  };
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

/* ---------- ROUTER ---------- */
function render() {
  if (state.step === "start") return renderStart();
  if (state.step === "how") return renderHow();
  if (state.step === "map") return renderMap();
  state.step = "start";
  return renderStart();
}

/* ---------- START ---------- */
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

/* ---------- HOW ---------- */
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
            <div><h3>Enter the Forest</h3><p>Go to the Forest Map hub to choose your guide and trails.</p></div>
          </div>
          <div class="how-step">
            <div class="how-icon">🔍</div>
            <div><h3>Observe</h3><p>Each scene has nature choices—flowers, clouds, forest-floor finds.</p></div>
          </div>
          <div class="how-step">
            <div class="how-icon">🧰</div>
            <div><h3>Collect</h3><p>Earn treasures and decorate your home later.</p></div>
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

/* ---------- MAP / CHARACTER HUB ---------- */
function renderMap() {
  screen.innerHTML = `
    <div class="map-screen" style="background-image:url('${ASSETS.mapBg}')">
      <div class="map-overlay"></div>

      <div class="map-top">
        <button class="map-pill" id="mapHomeBtn" type="button">← Home</button>
        <div class="map-title">Forest Map</div>
        <button class="map-pill" id="mapSaveBtn" type="button">Save</button>
      </div>

      <div class="map-layout">
        <div class="panel">
          <div class="panel-title">Choose Your Guide</div>
          <div class="panel-sub">Your guide stays the same across all levels.</div>

          <div class="char-row">
            <button class="char-type ${state.character.type === "gnome" ? "active" : ""}" id="typeGnome" type="button">Gnome</button>
            <button class="char-type ${state.character.type === "fairy" ? "active" : ""}" id="typeFairy" type="button">Fairy</button>
          </div>

          <div class="avatar-preview" aria-label="Character preview">
            <div class="svg-avatar" id="svgAvatar">
              <div class="svg-slot" id="slotBack"></div>
              <div class="svg-slot" id="slotFront"></div>
            </div>
          </div>

          <div class="pick-area" id="pickArea"></div>

          <div class="panel-actions">
            <button class="map-btn primary" id="useCharacterBtn" type="button">Use This Character</button>
          </div>

          <div class="tiny-note">Auto-saves as you change color.</div>
        </div>

        <div class="panel">
          <div class="panel-title">Trails</div>
          <div class="panel-sub">Next we’ll place clickable level buttons on your map.</div>

          <div class="trail-grid">
            <button class="trail-btn" id="level1Btn" type="button">Level 1</button>
            <button class="trail-btn locked" type="button" disabled>Level 2</button>
            <button class="trail-btn locked" type="button" disabled>Level 3</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Top buttons
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

  // Character type
  document.getElementById("typeGnome").addEventListener("click", () => {
    playClick();
    state.character.type = "gnome";
    saveGame();
    render();
  });

  document.getElementById("typeFairy").addEventListener("click", () => {
    playClick();
    state.character.type = "fairy";
    saveGame();
    render();
  });

  // Apply correct picker UI
  const pickArea = document.getElementById("pickArea");
  if (state.character.type === "gnome") {
    pickArea.innerHTML = `
      <div class="pick-row">
        <label for="pick-hat">Hat Color</label>
        <input id="pick-hat" type="color" value="${escapeHtml(state.character.hatColor)}" />
      </div>
    `;
    document.getElementById("pick-hat").addEventListener("input", (e) => {
      state.character.hatColor = e.target.value;
      saveGame();
      applySvgColors();
    });
  } else {
    pickArea.innerHTML = `
      <div class="pick-row">
        <label for="pick-wing">Wing Color</label>
        <input id="pick-wing" type="color" value="${escapeHtml(state.character.wingColor)}" />
      </div>
    `;
    document.getElementById("pick-wing").addEventListener("input", (e) => {
      state.character.wingColor = e.target.value;
      saveGame();
      applySvgColors();
    });
  }

  document.getElementById("useCharacterBtn").addEventListener("click", () => {
    playClick();
    saveGame();
    alert("Character saved! 🌲✨");
  });

  document.getElementById("level1Btn").addEventListener("click", () => {
    playClick();
    alert("Next: we’ll launch Level 1 from here.");
  });

  // Load + inline SVGs
  loadCharacterSvgs().catch((err) => {
    console.error(err);
    alert("SVG load error. Check that your SVG filenames match exactly in /assets.");
  });
}

/* ---------- SVG LOADING + COLORING ---------- */

async function loadCharacterSvgs() {
  const slotBack = document.getElementById("slotBack");
  const slotFront = document.getElementById("slotFront");
  if (!slotBack || !slotFront) return;

  slotBack.innerHTML = "";
  slotFront.innerHTML = "";

  if (state.character.type === "gnome") {
    // Body (fixed) behind, Hat (colorable) on top
    const body = await fetchSvgInline(ASSETS.gnomeBody, "gnome-body");
    const hat = await fetchSvgInline(ASSETS.gnomeHat, "gnome-hat");
    slotBack.appendChild(body);
    slotFront.appendChild(hat);
  } else {
    // Wings behind, Girl silhouette on top
    const wings = await fetchSvgInline(ASSETS.fairyWings, "fairy-wings");
    const girl = await fetchSvgInline(ASSETS.fairyGirl, "fairy-girl");
    slotBack.appendChild(wings);
    slotFront.appendChild(girl);
  }

  applySvgColors();
}

async function fetchSvgInline(url, className) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch SVG: ${url}`);
  const text = await res.text();

  // Parse as DOM, return the <svg> element
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) throw new Error(`No <svg> tag found in: ${url}`);

  svg.classList.add("inline-svg");
  if (className) svg.classList.add(className);

  // Make it scale nicely
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  return svg;
}

function applySvgColors() {
  const hatSvg = document.querySelector(".gnome-hat");
  if (hatSvg) {
    setSvgFill(hatSvg, state.character.hatColor);
  }

  const wingSvg = document.querySelector(".fairy-wings");
  if (wingSvg) {
    setSvgFill(wingSvg, state.character.wingColor);
  }
}

/**
 * Sets fill color on all SVG shapes that can take fill.
 * Tip: If your SVG paths are using stroke only, we can also set stroke.
 */
function setSvgFill(svgEl, color) {
  const nodes = svgEl.querySelectorAll("path, circle, rect, polygon, ellipse");
  nodes.forEach((n) => {
    // Only override if it isn't explicitly "none"
    const current = (n.getAttribute("fill") || "").toLowerCase();
    if (current !== "none") n.setAttribute("fill", color);

    // If your hat/wings are stroke-only, uncomment:
    // const stroke = (n.getAttribute("stroke") || "").toLowerCase();
    // if (stroke !== "none") n.setAttribute("stroke", color);
  });
}

/* ---------- UTIL ---------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
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

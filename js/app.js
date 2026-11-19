// Main Application Controller for "Azariah's Parang Adventure" Companion Website
// Coordinates UI events, Virtual Parang Band, activities, and responsive interactions

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Reader
  if (window.BookReader) {
    window.bookReader = new BookReader();
  }

  // 2. Initialize Kids' Activity Corner
  if (window.CuatroDesigner) {
    window.cuatroDesigner = new CuatroDesigner('cuatro-canvas');
    setupCuatroControls();
  }

  if (window.ParangMatchingGame) {
    window.matchingGame = new ParangMatchingGame('matching-game-board');
    setupMatchingControls();
  }

  if (window.ParangDetective) {
    window.parangDetective = new ParangDetective('detective-game-board');
  }

  if (window.ParangExplorer) {
    window.parangExplorer = new ParangExplorer('explorer-game-board');
  }

  // 3. Setup Virtual Parang Band (Interactive Instrument Rack)
  setupVirtualBand();

  // 4. Setup Fairy Lights & Navigation
  setupHeaderAndNav();

  // 5. Setup Tabbed Activity Selector
  setupActivityTabs();

  // 6. Setup Audio Players Exclusive Playback
  setupAudioPlayers();
});

function setupAudioPlayers() {
  const players = document.querySelectorAll('.parang-player');
  players.forEach(player => {
    player.addEventListener('play', () => {
      players.forEach(other => {
        if (other !== player) other.pause();
      });
    });
  });
}

// Setup Tabbed Activity Selector (with URL Hash Support for Heyzine & Reader links)
function setupActivityTabs() {
  const pickBtns = document.querySelectorAll('.activity-pick-btn');
  const panels = document.querySelectorAll('.activity-panel');

  function activateTab(tabId) {
    pickBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    panels.forEach(panel => panel.classList.toggle('active', panel.id === tabId));
  }

  pickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      activateTab(tabId);
    });
  });

  // Handle URL Hash deep links (e.g. #tab-cuatro, #tab-matching, #tab-detective, #tab-explorer)
  function checkHash() {
    const hash = window.location.hash.replace('#', '');
    if (['tab-cuatro', 'tab-matching', 'tab-detective', 'tab-explorer'].includes(hash)) {
      activateTab(hash);
      const target = document.getElementById(hash);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      }
    }
  }

  window.addEventListener('hashchange', checkHash);
  checkHash();
}

// Setup Cuatro Studio UI Controls
function setupCuatroControls() {
  const cd = window.cuatroDesigner;
  if (!cd) return;

  // Color Swatches
  const colorSwatches = document.querySelectorAll('.color-swatch');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      cd.color = swatch.dataset.color;
      cd.tool = 'brush';
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tool-brush')?.classList.add('active');
    });
  });

  // Tool buttons
  const brushBtn = document.getElementById('tool-brush');
  const eraserBtn = document.getElementById('tool-eraser');
  const undoBtn = document.getElementById('tool-undo');
  const clearBtn = document.getElementById('tool-clear');
  const strumBtn = document.getElementById('tool-strum');
  const downloadBtn = document.getElementById('tool-download');

  if (brushBtn) {
    brushBtn.addEventListener('click', () => {
      cd.tool = 'brush';
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      brushBtn.classList.add('active');
    });
  }

  if (eraserBtn) {
    eraserBtn.addEventListener('click', () => {
      cd.tool = 'eraser';
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      eraserBtn.classList.add('active');
    });
  }

  if (undoBtn) undoBtn.addEventListener('click', () => cd.undo());
  if (clearBtn) clearBtn.addEventListener('click', () => cd.clear());
  if (strumBtn) strumBtn.addEventListener('click', () => cd.strumSound());
  if (downloadBtn) downloadBtn.addEventListener('click', () => cd.download());

  // Brush Size slider
  const sizeSlider = document.getElementById('brush-size');
  if (sizeSlider) {
    sizeSlider.addEventListener('input', (e) => {
      cd.brushSize = parseInt(e.target.value, 10);
    });
  }

  // Stamp buttons
  const stampBtns = document.querySelectorAll('.stamp-btn');
  stampBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cd.tool = 'stamp';
      cd.currentStamp = btn.dataset.stamp;
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      stampBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Setup Matching Game Controls
function setupMatchingControls() {
  const restartBtn = document.getElementById('restart-matching');
  const playAgainBtn = document.getElementById('play-again-match-btn');
  const victoryModal = document.getElementById('match-victory-modal');
  const closeModalBtn = document.getElementById('close-match-modal');

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      if (window.matchingGame) window.matchingGame.setupBoard();
    });
  }

  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      if (victoryModal) victoryModal.classList.remove('active');
      if (window.matchingGame) window.matchingGame.setupBoard();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (victoryModal) victoryModal.classList.remove('active');
    });
  }
}

// Setup Virtual Caribbean Band Instruments & Rhythm Simulator
function setupVirtualBand() {
  const synth = window.parangSynth;
  if (!synth) return;

  // Cuatro Chord Buttons
  const cuatroChords = document.querySelectorAll('.cuatro-chord-btn');
  cuatroChords.forEach(btn => {
    btn.addEventListener('click', () => {
      cuatroChords.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chord = btn.dataset.chord || 'G';
      synth.playCuatro(chord, 'down');
      animateInstrumentCard('card-cuatro');
    });
  });

  // Chac-Chac Triggers
  const chacchacBtn = document.getElementById('play-chacchac-btn');
  if (chacchacBtn) {
    chacchacBtn.addEventListener('click', () => {
      synth.playChacChac('sharp');
      animateInstrumentCard('card-chacchac');
    });
  }

  // Toc-Toc Triggers
  const toctocBtn = document.getElementById('play-toctoc-btn');
  if (toctocBtn) {
    toctocBtn.addEventListener('click', () => {
      synth.playTocToc('high');
      animateInstrumentCard('card-toctoc');
    });
  }

  // Box Bass Triggers
  const boxbassBtn = document.getElementById('play-boxbass-btn');
  if (boxbassBtn) {
    boxbassBtn.addEventListener('click', () => {
      synth.playBoxBass('low');
      animateInstrumentCard('card-boxbass');
    });
  }

  // Rhythm Metronome Play-Along
  const rhythmToggleBtn = document.getElementById('toggle-rhythm-btn');
  const beatDots = document.querySelectorAll('.beat-dot');

  if (rhythmToggleBtn) {
    rhythmToggleBtn.addEventListener('click', () => {
      const isPlaying = synth.toggleRhythmBeat((step) => {
        beatDots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === step);
        });
      });

      if (isPlaying) {
        rhythmToggleBtn.innerHTML = '⏹️ Stop Village Rhythm';
        rhythmToggleBtn.classList.add('active');
      } else {
        rhythmToggleBtn.innerHTML = '▶️ Play-Along Caribbean Rhythm (120 BPM)';
        rhythmToggleBtn.classList.remove('active');
        beatDots.forEach(d => d.classList.remove('active'));
      }
    });
  }

  // Keyboard instrument triggers: Left hand (A, S) | Right hand (K, L)
  document.addEventListener('keydown', (e) => {
    // Avoid triggering when user is typing in text fields
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'c') {
      synth.playCuatro('G', 'down');
      animateInstrumentCard('card-cuatro');
    } else if (key === 's' || key === 'm') {
      synth.playChacChac('sharp');
      animateInstrumentCard('card-chacchac');
    } else if (key === 'k' || key === 't') {
      synth.playTocToc('high');
      animateInstrumentCard('card-toctoc');
    } else if (key === 'l' || key === 'b') {
      synth.playBoxBass('low');
      animateInstrumentCard('card-boxbass');
    }
  });
}

function animateInstrumentCard(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;
  card.classList.add('pulse');
  setTimeout(() => card.classList.remove('pulse'), 180);
}

// Setup Header, Fairy Lights & Mobile Navigation
function setupHeaderAndNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const fairyLightsToggle = document.getElementById('fairy-lights-toggle');
  const fairyLights = document.getElementById('fairy-lights');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Fairy light control
  if (fairyLightsToggle && fairyLights) {
    let mode = 0; // 0: Festive, 1: Gentle, 2: Off
    const modes = ['Festive ✨', 'Gentle 🕯️', 'Lights Off 🌙'];
    fairyLightsToggle.addEventListener('click', () => {
      mode = (mode + 1) % 3;
      fairyLightsToggle.textContent = modes[mode];
      if (mode === 0) {
        fairyLights.className = 'fairy-lights festive';
      } else if (mode === 1) {
        fairyLights.className = 'fairy-lights gentle';
      } else {
        fairyLights.className = 'fairy-lights off';
      }
    });
  }
}

// Screen-Free Printables Generator (Coloring, Word Search, Worksheets, Certificate)
window.printSheet = function(sheetId) {
  const container = document.getElementById('printable-area');
  if (!container) return;
  container.style.display = 'block';

  if (sheetId === 'print-cuatro') {
    container.innerHTML = `
      <div class="print-page" style="font-family: sans-serif; color: #000; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
          <h2 style="font-size: 24px; margin-bottom: 4px;">🎨 Design Your Own Cuatro!</h2>
          <p style="font-size: 14px; margin: 0;">Companion Activity Sheet for <em>Azariah's Parang Adventure</em> by Kristee Kalisingh</p>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 15px;">
          <span>Artist Name: _________________________________________</span>
          <span>Date: ____________________</span>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <svg viewBox="0 0 800 450" width="100%" height="340" style="display:block; margin: 0 auto;">
            <!-- Cuatro Body Silhouette -->
            <path d="M 320 180 C 350 100, 470 90, 520 145 C 550 180, 575 180, 600 135 C 655 75, 755 110, 760 230 C 755 350, 655 385, 600 325 C 575 280, 550 280, 520 315 C 470 370, 350 360, 320 280 Z" fill="none" stroke="#000" stroke-width="4"/>
            <path d="M 330 185 C 360 115, 460 105, 510 155 C 545 190, 570 190, 595 145 C 645 90, 740 120, 745 230 C 740 340, 645 370, 595 315 C 570 270, 545 270, 510 305 C 460 355, 360 345, 330 275 Z" fill="none" stroke="#666" stroke-width="1.5" stroke-dasharray="4,4"/>
            <!-- Soundhole & Rosette -->
            <circle cx="490" cy="230" r="48" fill="none" stroke="#000" stroke-width="3"/>
            <circle cx="490" cy="230" r="54" fill="none" stroke="#000" stroke-width="1.5"/>
            <circle cx="490" cy="230" r="60" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="3,3"/>
            <!-- Bridge -->
            <rect x="660" y="190" width="24" height="80" rx="3" fill="none" stroke="#000" stroke-width="3"/>
            <rect x="665" y="198" width="6" height="64" fill="none" stroke="#000" stroke-width="1.5"/>
            <!-- Neck -->
            <rect x="140" y="206" width="185" height="48" fill="none" stroke="#000" stroke-width="3"/>
            <!-- Frets -->
            <line x1="165" y1="206" x2="165" y2="254" stroke="#000" stroke-width="2"/>
            <line x1="190" y1="206" x2="190" y2="254" stroke="#000" stroke-width="2"/>
            <line x1="215" y1="206" x2="215" y2="254" stroke="#000" stroke-width="2"/>
            <line x1="240" y1="206" x2="240" y2="254" stroke="#000" stroke-width="2"/>
            <line x1="265" y1="206" x2="265" y2="254" stroke="#000" stroke-width="2"/>
            <line x1="290" y1="206" x2="290" y2="254" stroke="#000" stroke-width="2"/>
            <line x1="315" y1="206" x2="315" y2="254" stroke="#000" stroke-width="2"/>
            <!-- Headstock -->
            <polygon points="140,206 60,195 45,230 60,265 140,254" fill="none" stroke="#000" stroke-width="3"/>
            <!-- Pegs -->
            <circle cx="80" cy="188" r="8" fill="none" stroke="#000" stroke-width="2"/>
            <circle cx="115" cy="190" r="8" fill="none" stroke="#000" stroke-width="2"/>
            <circle cx="80" cy="272" r="8" fill="none" stroke="#000" stroke-width="2"/>
            <circle cx="115" cy="270" r="8" fill="none" stroke="#000" stroke-width="2"/>
            <!-- 4 Strings -->
            <line x1="60" y1="213" x2="670" y2="213" stroke="#000" stroke-width="1.5"/>
            <line x1="60" y1="224" x2="670" y2="224" stroke="#000" stroke-width="1.5"/>
            <line x1="60" y1="236" x2="670" y2="236" stroke="#000" stroke-width="1.5"/>
            <line x1="60" y1="247" x2="670" y2="247" stroke="#000" stroke-width="1.5"/>
          </svg>
        </div>
        <div style="border: 1px dashed #444; padding: 12px; font-size: 13px; line-height: 1.5;">
          <strong>Instructions:</strong> Use your favorite crayons, markers, or colored pencils! Color the cuatro, draw Caribbean hibiscus flowers around the soundhole, and write your signature on the headstock!
        </div>
      </div>
    `;
  } else if (sheetId === 'print-wordsearch') {
    container.innerHTML = `
      <div class="print-page" style="font-family: sans-serif; color: #000; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
          <h2 style="font-size: 24px; margin-bottom: 4px;">🔍 Christmas Parang Word Search</h2>
          <p style="font-size: 14px; margin: 0;">Companion Activity Sheet for <em>Azariah's Parang Adventure</em> by Kristee Kalisingh</p>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 20px;">
          <span>Detective Name: _________________________________________</span>
          <span>Date: ____________________</span>
        </div>
        <div style="display: flex; justify-content: center; margin-bottom: 25px;">
          <table style="border-collapse: collapse; font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 6px; text-align: center;">
            <tr><td style="padding: 6px;">C</td><td style="padding: 6px;">U</td><td style="padding: 6px;">A</td><td style="padding: 6px;">T</td><td style="padding: 6px;">R</td><td style="padding: 6px;">O</td><td style="padding: 6px;">M</td><td style="padding: 6px;">P</td><td style="padding: 6px;">A</td><td style="padding: 6px;">R</td><td style="padding: 6px;">A</td><td style="padding: 6px;">N</td><td style="padding: 6px;">G</td></tr>
            <tr><td style="padding: 6px;">H</td><td style="padding: 6px;">D</td><td style="padding: 6px;">A</td><td style="padding: 6px;">I</td><td style="padding: 6px;">S</td><td style="padding: 6px;">Y</td><td style="padding: 6px;">A</td><td style="padding: 6px;">A</td><td style="padding: 6px;">L</td><td style="padding: 6px;">E</td><td style="padding: 6px;">G</td><td style="padding: 6px;">R</td><td style="padding: 6px;">I</td></tr>
            <tr><td style="padding: 6px;">A</td><td style="padding: 6px;">V</td><td style="padding: 6px;">O</td><td style="padding: 6px;">I</td><td style="padding: 6px;">S</td><td style="padding: 6px;">I</td><td style="padding: 6px;">N</td><td style="padding: 6px;">S</td><td style="padding: 6px;">E</td><td style="padding: 6px;">R</td><td style="padding: 6px;">E</td><td style="padding: 6px;">N</td><td style="padding: 6px;">O</td></tr>
            <tr><td style="padding: 6px;">C</td><td style="padding: 6px;">B</td><td style="padding: 6px;">O</td><td style="padding: 6px;">X</td><td style="padding: 6px;">B</td><td style="padding: 6px;">A</td><td style="padding: 6px;">S</td><td style="padding: 6px;">S</td><td style="padding: 6px;">T</td><td style="padding: 6px;">P</td><td style="padding: 6px;">A</td><td style="padding: 6px;">A</td><td style="padding: 6px;">H</td></tr>
            <tr><td style="padding: 6px;">C</td><td style="padding: 6px;">M</td><td style="padding: 6px;">A</td><td style="padding: 6px;">R</td><td style="padding: 6px;">A</td><td style="padding: 6px;">C</td><td style="padding: 6px;">A</td><td style="padding: 6px;">S</td><td style="padding: 6px;">O</td><td style="padding: 6px;">E</td><td style="padding: 6px;">Z</td><td style="padding: 6px;">V</td><td style="padding: 6px;">U</td></tr>
            <tr><td style="padding: 6px;">H</td><td style="padding: 6px;">P</td><td style="padding: 6px;">A</td><td style="padding: 6px;">I</td><td style="padding: 6px;">M</td><td style="padding: 6px;">E</td><td style="padding: 6px;">R</td><td style="padding: 6px;">L</td><td style="padding: 6px;">C</td><td style="padding: 6px;">L</td><td style="padding: 6px;">A</td><td style="padding: 6px;">I</td><td style="padding: 6px;">R</td></tr>
            <tr><td style="padding: 6px;">A</td><td style="padding: 6px;">S</td><td style="padding: 6px;">O</td><td style="padding: 6px;">R</td><td style="padding: 6px;">R</td><td style="padding: 6px;">E</td><td style="padding: 6px;">L</td><td style="padding: 6px;">I</td><td style="padding: 6px;">T</td><td style="padding: 6px;">L</td><td style="padding: 6px;">R</td><td style="padding: 6px;">D</td><td style="padding: 6px;">R</td></tr>
            <tr><td style="padding: 6px;">C</td><td style="padding: 6px;">P</td><td style="padding: 6px;">R</td><td style="padding: 6px;">I</td><td style="padding: 6px;">N</td><td style="padding: 6px;">C</td><td style="padding: 6px;">E</td><td style="padding: 6px;">S</td><td style="padding: 6px;">T</td><td style="padding: 6px;">O</td><td style="padding: 6px;">W</td><td style="padding: 6px;">N</td><td style="padding: 6px;">A</td></tr>
            <tr><td style="padding: 6px;">S</td><td style="padding: 6px;">F</td><td style="padding: 6px;">L</td><td style="padding: 6px;">O</td><td style="padding: 6px;">W</td><td style="padding: 6px;">E</td><td style="padding: 6px;">R</td><td style="padding: 6px;">S</td><td style="padding: 6px;">O</td><td style="padding: 6px;">V</td><td style="padding: 6px;">I</td><td style="padding: 6px;">V</td><td style="padding: 6px;">H</td></tr>
            <tr><td style="padding: 6px;">P</td><td style="padding: 6px;">A</td><td style="padding: 6px;">R</td><td style="padding: 6px;">A</td><td style="padding: 6px;">N</td><td style="padding: 6px;">D</td><td style="padding: 6px;">E</td><td style="padding: 6px;">R</td><td style="padding: 6px;">O</td><td style="padding: 6px;">S</td><td style="padding: 6px;">C</td><td style="padding: 6px;">A</td><td style="padding: 6px;">Z</td></tr>
          </table>
        </div>
        <div style="border-top: 2px solid #000; padding-top: 15px;">
          <h4 style="margin: 0 0 10px; font-size: 16px;">Find these 10 Caribbean Parang Words:</h4>
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); font-size: 14px; gap: 8px;">
            <span>[ ] CUATRO</span>
            <span>[ ] PARANG</span>
            <span>[ ] DAISY</span>
            <span>[ ] VOISIN</span>
            <span>[ ] PASTELLE</span>
            <span>[ ] SORREL</span>
            <span>[ ] MARACAS</span>
            <span>[ ] CHACCHAC</span>
            <span>[ ] ALEGRIA</span>
            <span>[ ] PRINCESTOWN</span>
          </div>
        </div>
      </div>
    `;
  } else if (sheetId === 'print-detective') {
    container.innerHTML = `
      <div class="print-page" style="font-family: sans-serif; color: #000; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
          <h2 style="font-size: 24px; margin-bottom: 4px;">📝 Parang Detective & Explorer Worksheet</h2>
          <p style="font-size: 14px; margin: 0;">Companion Activity Sheet for <em>Azariah's Parang Adventure</em> by Kristee Kalisingh</p>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 15px;">
          <span>Explorer Name: _________________________________________</span>
          <span>Score: ______ / 5</span>
        </div>
        <div>
          <h3 style="font-size: 16px; margin: 15px 0 10px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Part 1: Solve the 5 Musical Riddles!</h3>
          <ol style="font-size: 14px; line-height: 1.8; padding-left: 20px;">
            <li>I have 4 nylon strings and my fast strum keeps the village dancing from house to house. What am I? <br><strong>Answer:</strong> __________________________________________________</li>
            <li>We are dried calabash gourds filled with seeds, tied with bright festive ribbons. What are we? <br><strong>Answer:</strong> __________________________________________________</li>
            <li>I am wrapped in steamed green banana leaves, seasoned with raisins, olives, and herbs. What am I? <br><strong>Answer:</strong> __________________________________________________</li>
            <li>Known as the Queen of Parang from Princes Town, I wore a white dress and yellow flowers. Who am I? <br><strong>Answer:</strong> __________________________________________________</li>
            <li>Which joyful Spanish word means 'Joy, Joy!' and is Daisy Voisin's famous Christmas parang anthem? <br><strong>Answer:</strong> __________________________________________________</li>
          </ol>
          <h3 style="font-size: 16px; margin: 20px 0 10px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Part 2: Parang Explorer Checklist</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; font-size: 14px; gap: 8px; line-height: 1.6;">
            <span>[ ] Heard a cuatro strumming</span>
            <span>[ ] Shook a pair of chac-chacs</span>
            <span>[ ] Spotted Daisy's yellow flowers</span>
            <span>[ ] Smelled warm steamed pastelles</span>
            <span>[ ] Drank a cold cup of ruby-red sorrel</span>
            <span>[ ] Sang "Alegria, Alegria!" out loud</span>
            <span>[ ] Found the friendly village dog</span>
            <span>[ ] Learned Parang comes from Princes Town</span>
          </div>
        </div>
      </div>
    `;
  } else if (sheetId === 'print-cert') {
    container.innerHTML = `
      <div class="print-page" style="padding: 20px;">
        <div style="border: 6px double #b45309; padding: 25px; text-align: center; font-family: 'Georgia', serif; color: #451a03; background: #fff;">
          <div style="border: 2px solid #d97706; padding: 30px 20px;">
            <div style="font-size: 40px; margin-bottom: 8px;">🏅</div>
            <p style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #92400e; font-weight: bold; margin: 0;">Official Certificate of Honor</p>
            <h1 style="font-size: 32px; color: #78350f; margin: 10px 0;">Master Parandero Explorer</h1>
            <p style="font-size: 15px; margin-bottom: 8px;">This official parang honor is proudly presented to:</p>
            <h2 style="font-size: 32px; color: #b91c1c; border-bottom: 2px solid #b91c1c; min-height: 40px; margin: 0 auto 20px; max-width: 500px;">&nbsp;</h2>
            <p style="font-size: 14px; line-height: 1.6; max-width: 600px; margin: 0 auto 30px; color: #713f12;">
              For exploring the festive music, four-string cuatro rhythms, and joyful Christmas traditions 
              of Princes Town with Azariah, and honoring the cherished cultural legacy of Queen Daisy Voisin.
            </p>
            <div style="display: flex; justify-content: space-around; border-top: 1px solid #d97706; padding-top: 20px; margin-top: 20px;">
              <div style="text-align: center;">
                <span style="font-family: serif; font-style: italic; font-weight: bold; font-size: 18px; display: block;">Kristee Kalisingh</span>
                <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #92400e;">Author & Storyteller</span>
              </div>
              <div style="text-align: center;">
                <span style="font-family: serif; font-style: italic; font-weight: bold; font-size: 18px; display: block;">Princes Town, Trinidad</span>
                <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #92400e;">Parang Heritage Center</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setTimeout(() => {
    window.print();
  }, 100);
};

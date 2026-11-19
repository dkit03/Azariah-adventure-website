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

  // Keyboard instrument triggers (C: Cuatro, M: Maracas, T: Toc-toc, B: Bass)
  document.addEventListener('keydown', (e) => {
    // Avoid triggering when user is typing in text fields
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'c' || e.key === 'C') {
      synth.playCuatro('G', 'down');
      animateInstrumentCard('card-cuatro');
    } else if (e.key === 'm' || e.key === 'M') {
      synth.playChacChac('sharp');
      animateInstrumentCard('card-chacchac');
    } else if (e.key === 't' || e.key === 'T') {
      synth.playTocToc('high');
      animateInstrumentCard('card-toctoc');
    } else if (e.key === 'b' || e.key === 'B') {
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

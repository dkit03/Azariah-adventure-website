// "Parang Matching Game" Interactive Memory Cards
// Includes sound effects, move tracking, 3D card flips, and confetti celebration

class ParangMatchingGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.cardData = [
      { id: 'cuatro', name: 'Cuatro', emoji: '🪕', desc: '4-string Parang Heartbeat' },
      { id: 'chacchac', name: 'Chac-Chacs', emoji: '🥥', desc: 'Calabash Gourd Shakers' },
      { id: 'boxbass', name: 'Box Bass', emoji: '📦', desc: 'Deep Wooden Thump' },
      { id: 'toctoc', name: 'Toc-Toc', emoji: '🪵', desc: 'Hardwood Clack' },
      { id: 'pastelle', name: 'Pastelle', emoji: '🫔', desc: 'Banana Leaf Christmas Treat' },
      { id: 'flowers', name: "Daisy's Flowers", emoji: '💐', desc: 'Signature Yellow Bouquet' },
      { id: 'sorrel', name: 'Cold Sorrel', emoji: '🍷', desc: 'Spiced Ruby Christmas Drink' },
      { id: 'paranderos', name: 'Paranderos', emoji: '🎶', desc: 'House-to-House Carolers' }
    ];

    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.isLocked = false;
    this.startTime = null;
    this.timerInterval = null;

    this.init();
  }

  init() {
    this.setupBoard();
  }

  setupBoard() {
    this.container.innerHTML = '';
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.isLocked = false;
    clearInterval(this.timerInterval);
    this.startTime = null;

    this.updateStats();

    // Create 8 duplicated pairs (16 cards total)
    const deck = [...this.cardData, ...this.cardData]
      .sort(() => Math.random() - 0.5);

    const grid = document.createElement('div');
    grid.className = 'matching-grid';

    deck.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'match-card';
      card.dataset.id = item.id;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <span class="hibiscus-icon">🌺</span>
            <span class="card-back-text">Parang!</span>
          </div>
          <div class="card-back">
            <span class="card-emoji">${item.emoji}</span>
            <span class="card-title">${item.name}</span>
            <span class="card-desc">${item.desc}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => this.flipCard(card, item));
      grid.appendChild(card);
    });

    this.container.appendChild(grid);
  }

  flipCard(card, item) {
    if (this.isLocked) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    if (!this.startTime) {
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    // Play card flip sound
    if (window.parangSynth) {
      window.parangSynth.playTocToc('high');
    }

    card.classList.add('flipped');
    this.flippedCards.push({ card, item });

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateStats();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [first, second] = this.flippedCards;

    if (first.item.id === second.item.id) {
      // Match found!
      setTimeout(() => {
        first.card.classList.add('matched');
        second.card.classList.add('matched');

        // Play authentic instrument sound
        this.playMatchAudio(first.item.id);

        this.matchedPairs++;
        this.flippedCards = [];
        this.isLocked = false;

        if (this.matchedPairs === this.cardData.length) {
          this.handleVictory();
        }
      }, 350);
    } else {
      // Not a match
      setTimeout(() => {
        first.card.classList.remove('flipped');
        second.card.classList.remove('flipped');
        this.flippedCards = [];
        this.isLocked = false;
      }, 900);
    }
  }

  playMatchAudio(id) {
    if (!window.parangSynth) return;
    if (id === 'cuatro') window.parangSynth.playCuatro('G');
    else if (id === 'chacchac') window.parangSynth.playChacChac('sharp');
    else if (id === 'toctoc') window.parangSynth.playTocToc('low');
    else if (id === 'boxbass') window.parangSynth.playBoxBass('low');
    else window.parangSynth.playChime('success');
  }

  updateStats() {
    const moveEl = document.getElementById('match-moves');
    if (moveEl) moveEl.textContent = this.moves;
  }

  updateTimer() {
    const timerEl = document.getElementById('match-timer');
    if (!timerEl || !this.startTime) return;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
  }

  handleVictory() {
    clearInterval(this.timerInterval);
    if (window.parangSynth) {
      window.parangSynth.playChime('success');
      setTimeout(() => window.parangSynth.playCuatro('C', 'down'), 250);
    }

    this.launchConfetti();

    setTimeout(() => {
      const modal = document.getElementById('match-victory-modal');
      const finalMoves = document.getElementById('final-match-moves');
      if (finalMoves) finalMoves.textContent = this.moves;
      if (modal) modal.classList.add('active');
    }, 600);
  }

  launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const particles = [];
    const colors = ['#e11d48', '#fbbf24', '#10b981', '#06b6d4', '#f97316', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velX: (Math.random() - 0.5) * 5,
        velY: Math.random() * 4 + 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    let frames = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.velX;
        p.y += p.velY;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();
      });

      frames++;
      if (frames < 140) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }
    animate();
  }
}

window.ParangMatchingGame = ParangMatchingGame;

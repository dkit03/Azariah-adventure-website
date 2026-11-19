// "Parang Detective" Riddle Quiz
// Interactive story quiz with clues, sound feedback, score tracking, and printable badge

class ParangDetective {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.riddles = [
      {
        question: "I have 4 nylon strings and my fast strum keeps the village dancing from house to house. What am I?",
        icon: "🪕",
        options: ["Cuatro", "Steelpan", "Flute", "Piano"],
        answer: 0,
        hint: "Count the strings! It originated in South America and Trinidad.",
        fact: "The cuatro has just four strings, tuned to create the rhythmic pulse of parang!"
      },
      {
        question: "We are hollow calabash gourds filled with dried seeds, shaken in pairs with bright festive ribbons. What are we?",
        icon: "🥥",
        options: ["Drums", "Chac-Chacs", "Tambourines", "Bells"],
        answer: 1,
        hint: "Listen for the sharp 'chac-chac' rattle sound!",
        fact: "Chac-Chacs are made from dried calabash and give parang its signature drive!"
      },
      {
        question: "I am wrapped inside steamed green banana leaves, filled with cornmeal, seasoned filling, raisins, and olives. What am I?",
        icon: "🫔",
        options: ["Doubles", "Pastelle", "Roti", "Pelau"],
        answer: 1,
        hint: "Azariah and her family love eating this hot on Christmas Eve!",
        fact: "Pastelles are a beloved Trinidad & Tobago Christmas staple wrapped in banana leaves!"
      },
      {
        question: "Known as the undisputed Queen of Parang from Princes Town, I wore a white dress and always sang with fresh flowers. Who am I?",
        icon: "👑",
        options: ["Calypso Rose", "Daisy Voisin", "Ella Andall", "Denise Plummer"],
        answer: 1,
        hint: "She led the famous La Divina Pastora Parang Band!",
        fact: "Daisy Voisin brought Parang to life across Trinidad, the Caribbean, and the world!"
      },
      {
        question: "Which joyful Spanish word means 'Joy, Joy!' and is the title of Daisy Voisin's most famous parang anthem?",
        icon: "🎶",
        options: ["Gracias", "Navidad", "Alegria", "Fiesta"],
        answer: 2,
        hint: "It starts with the letter 'A' and means pure celebration!",
        fact: "'Alegria, Alegria!' is sung on every porch and street corner in Trinidad at Christmas!"
      }
    ];

    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;

    this.init();
  }

  init() {
    this.renderQuestion();
  }

  renderQuestion() {
    this.answered = false;
    const r = this.riddles[this.currentIndex];

    this.container.innerHTML = `
      <div class="detective-card">
        <div class="detective-progress">
          <span>Riddle ${this.currentIndex + 1} of ${this.riddles.length}</span>
          <span class="detective-score">Score: ${this.score} pts</span>
        </div>
        <div class="detective-icon">${r.icon}</div>
        <h3 class="detective-question">"${r.question}"</h3>
        <p class="detective-hint">💡 <em>Clue: ${r.hint}</em></p>

        <div class="detective-options" id="quiz-options">
          ${r.options.map((opt, i) => `
            <button class="quiz-btn" data-index="${i}">
              <span class="btn-letter">${String.fromCharCode(65 + i)}</span>
              <span class="btn-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="detective-feedback" id="quiz-feedback" style="display:none;"></div>
      </div>
    `;

    const buttons = this.container.querySelectorAll('.quiz-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.dataset.index, 10);
        this.checkAnswer(selected, buttons);
      });
    });
  }

  checkAnswer(selected, buttons) {
    if (this.answered) return;
    this.answered = true;

    const r = this.riddles[this.currentIndex];
    const feedback = document.getElementById('quiz-feedback');
    feedback.style.display = 'block';

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === r.answer) {
        btn.classList.add('correct');
      } else if (idx === selected) {
        btn.classList.add('incorrect');
      }
    });

    if (selected === r.answer) {
      this.score += 20;
      if (window.parangSynth) window.parangSynth.playChime('success');
      feedback.innerHTML = `
        <div class="feedback-box success">
          <strong>🌟 Brilliant Detective Work!</strong>
          <p>${r.fact}</p>
          <button class="next-quiz-btn" id="next-riddle-btn">
            ${this.currentIndex < this.riddles.length - 1 ? 'Next Riddle ➡️' : 'See My Detective Badge 🏆'}
          </button>
        </div>
      `;
    } else {
      if (window.parangSynth) window.parangSynth.playTocToc('low');
      feedback.innerHTML = `
        <div class="feedback-box wrong">
          <strong>🔍 Good try! The answer was ${r.options[r.answer]}.</strong>
          <p>${r.fact}</p>
          <button class="next-quiz-btn" id="next-riddle-btn">
            ${this.currentIndex < this.riddles.length - 1 ? 'Next Riddle ➡️' : 'See My Detective Badge 🏆'}
          </button>
        </div>
      `;
    }

    document.getElementById('next-riddle-btn').addEventListener('click', () => {
      this.currentIndex++;
      if (this.currentIndex < this.riddles.length) {
        this.renderQuestion();
      } else {
        this.showBadge();
      }
    });
  }

  showBadge() {
    this.container.innerHTML = `
      <div class="badge-card">
        <div class="badge-ribbon">🏆</div>
        <h3>Official Certified Parang Detective</h3>
        <p class="badge-congrats">Congratulations! You solved the clues of Princes Town with Azariah!</p>
        <div class="badge-stamp">
          <span class="badge-score-big">${this.score} / 100</span>
          <span class="badge-level">${this.score >= 80 ? '⭐ Master Parandero Detective' : '🌟 Junior Parang Scout'}</span>
        </div>
        <p class="badge-desc">Presented for outstanding knowledge of Caribbean Parang music, instruments, Daisy Voisin, and Christmas traditions.</p>
        <div class="badge-actions">
          <button class="quiz-btn-primary" onclick="window.print()">🖨️ Print My Detective Badge</button>
          <button class="quiz-btn-secondary" id="restart-quiz-btn">🔄 Play Again</button>
        </div>
      </div>
    `;

    document.getElementById('restart-quiz-btn').addEventListener('click', () => {
      this.currentIndex = 0;
      this.score = 0;
      this.renderQuestion();
    });
  }
}

window.ParangDetective = ParangDetective;

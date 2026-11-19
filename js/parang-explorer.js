// "Parang Explorer" Interactive Checklist & Certificate Generator
// Adapted directly from Page 18 of "Azariah's Parang Adventure"

class ParangExplorer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.items = [
      { id: 'exp-1', text: 'Heard the fast strum of a four-string Cuatro', icon: '🪕' },
      { id: 'exp-2', text: 'Shook a pair of Chac-Chacs to the rhythm', icon: '🥥' },
      { id: 'exp-3', text: "Spotted Daisy Voisin's famous yellow flowers", icon: '💐' },
      { id: 'exp-4', text: 'Tasted or smelled a warm steamed Pastelle', icon: '🫔' },
      { id: 'exp-5', text: 'Drank a cold cup of ruby-red spiced Sorrel', icon: '🍷' },
      { id: 'exp-6', text: 'Sang "Alegria, Alegria!" with all your heart', icon: '🎶' },
      { id: 'exp-7', text: 'Found the friendly village dog following the band', icon: '🐕' },
      { id: 'exp-8', text: 'Learned that Parang connects Trinidad & Venezuelan heritage', icon: '🌴' }
    ];

    this.checkedItems = new Set();
    this.childName = '';
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const total = this.items.length;
    const completed = this.checkedItems.size;
    const percent = Math.round((completed / total) * 100);

    this.container.innerHTML = `
      <div class="explorer-card">
        <div class="explorer-header">
          <div class="explorer-progress-text">
            <span>Exploration Progress: <strong>${completed} of ${total} Completed</strong></span>
            <span class="explorer-pct">${percent}%</span>
          </div>
          <div class="explorer-progress-bar">
            <div class="explorer-progress-fill" style="width: ${percent}%;"></div>
          </div>
        </div>

        <div class="explorer-checklist">
          ${this.items.map(item => {
            const isChecked = this.checkedItems.has(item.id);
            return `
              <label class="explorer-item ${isChecked ? 'checked' : ''}" data-id="${item.id}">
                <input type="checkbox" ${isChecked ? 'checked' : ''} data-id="${item.id}">
                <span class="custom-checkbox"></span>
                <span class="item-icon">${item.icon}</span>
                <span class="item-text">${item.text}</span>
              </label>
            `;
          }).join('')}
        </div>

        <div class="explorer-completion" id="explorer-completion" style="${completed === total ? 'display:block;' : 'display:none;'}">
          <div class="completion-banner">
            <h3>🎉 You are an Official Parang Explorer!</h3>
            <p>Enter your name below to generate your personalized Master Parandero Certificate:</p>
            <div class="cert-input-wrap">
              <input type="text" id="cert-child-name" placeholder="Enter Child's Name..." value="${this.childName}">
              <button class="cert-btn" id="generate-cert-btn">Generate My Certificate 📜</button>
            </div>
          </div>
        </div>

        <div id="certificate-output"></div>
      </div>
    `;

    // Bind checkboxes
    const checkboxes = this.container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          this.checkedItems.add(id);
          if (window.parangSynth) window.parangSynth.playChacChac('sharp');
        } else {
          this.checkedItems.delete(id);
        }
        this.render();
      });
    });

    // Bind certificate generation
    const genBtn = this.container.querySelector('#generate-cert-btn');
    if (genBtn) {
      genBtn.addEventListener('click', () => {
        const nameInput = this.container.querySelector('#cert-child-name');
        this.childName = nameInput ? nameInput.value.trim() : 'Young Parandero';
        this.showCertificate();
      });
    }
  }

  showCertificate() {
    const certBox = this.container.querySelector('#certificate-output');
    if (!certBox) return;

    if (window.parangSynth) window.parangSynth.playChime('success');

    certBox.innerHTML = `
      <div class="parang-certificate printable-area">
        <div class="cert-border-outer">
          <div class="cert-border-inner">
            <div class="cert-hibiscus-tl">🌺</div>
            <div class="cert-hibiscus-tr">🌺</div>
            <div class="cert-hibiscus-bl">🌺</div>
            <div class="cert-hibiscus-br">🌺</div>

            <div class="cert-header">
              <span class="cert-seal">🏅</span>
              <p class="cert-subtitle">Certificate of Exploration</p>
              <h2 class="cert-title">Master Parang Explorer</h2>
            </div>

            <p class="cert-awarded">This official parang honor is proudly awarded to:</p>
            <h1 class="cert-name">${this.childName || 'Young Parandero'}</h1>

            <p class="cert-body">
              For having completed the Christmas Eve parang journey with Azariah in Princes Town, 
              learning the rhythms of the cuatro, chac-chacs, and box bass, and celebrating the beloved 
              legacy of Queen Daisy Voisin.
            </p>

            <div class="cert-signatures">
              <div class="sig-block">
                <span class="sig-line">Kristee Kalisingh</span>
                <span class="sig-title">Author & Storyteller</span>
              </div>
              <div class="sig-block">
                <span class="sig-line">Princes Town, Trinidad</span>
                <span class="sig-title">Parang Heritage Center</span>
              </div>
            </div>
          </div>
        </div>

        <div class="cert-actions non-printable">
          <button class="quiz-btn-primary" onclick="window.print()">🖨️ Print Certificate</button>
        </div>
      </div>
    `;

    certBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

window.ParangExplorer = ParangExplorer;

// Enhanced Flipbook & Digital Reader for "Azariah's Parang Adventure"
// Supports Spreads mode (2160x1215), Single-page mode (mobile), Zoom Lightbox, Thumbnails, Touch swipe

class BookReader {
  constructor() {
    this.spreads = [
      { file: "images/cover.jpg",   label: "Cover — Azariah's Parang Adventure", audioStop: null },
      { file: "images/pg01.jpg",    label: "Page 1 — Christmas Eve in Princes Town", audioStop: null },
      { file: "images/pg02.jpg",    label: "Page 2 — Azariah Hears the Music", audioStop: null },
      { file: "images/pg03.jpg",    label: "Page 3 — At the Corner / Alegria", audioStop: { title: "Alegria, Alegria", id: "stop-alegria" } },
      { file: "images/pg04.jpg",    label: "Page 4 — What's That Instrument? / Cuatro", audioStop: null },
      { file: "images/pg05.jpg",    label: "Page 5 — The Maracas / Sereno", audioStop: { title: "Sereno, Sereno", id: "stop-sereno" } },
      { file: "images/pg06.jpg",    label: "Page 6 — House to House & Can You Find?", audioStop: null },
      { file: "images/pg07.jpg",    label: "Page 7 — Parang Makes You Hungry!", audioStop: null },
      { file: "images/pg08.jpg",    label: "Page 8 — Your Turn! & Flowers for Daisy", audioStop: null },
      { file: "images/pg09.jpg",    label: "Page 9 — The Night Gets Dark", audioStop: null },
      { file: "images/pg10.jpg",    label: "Page 10 — Listening Stop: Hurrah Hurrah!", audioStop: { title: "Hurrah, Hurrah", id: "stop-hurrah" } },
      { file: "images/pg11.jpg",    label: "Page 11 — Parang Detective (Riddle Time!)", activityId: "tab-detective" },
      { file: "images/pg12.jpg",    label: "Page 12 — The Story of Daisy Voisin", audioStop: null },
      { file: "images/pg13.jpg",    label: "Page 13 — Now You're the Band!", activityId: "music-section" },
      { file: "images/pg14.jpg",    label: "Page 14 — The Big Parang Finale", audioStop: null },
      { file: "images/pg15.jpg",    label: "Page 15 — Daisy Voisin's Christmas Playlist", audioStop: null },
      { file: "images/pg16.jpg",    label: "Page 16 — What Azariah Learned", audioStop: null },
      { file: "images/pg17.jpg",    label: "Page 17 — Design Your Own Cuatro!", activityId: "tab-cuatro" },
      { file: "images/pg18.jpg",    label: "Page 18 — I Am a Parang Explorer!", activityId: "tab-explorer" },
      { file: "images/pg19.jpg",    label: "Page 19 — Parang Matching Game", activityId: "tab-matching" },
      { file: "images/pg20.jpg",    label: "Page 20 — Goodnight, Azariah", audioStop: null },
      { file: "images/pg21.jpg",    label: "Page 21 — Let's Keep Parang Alive!", activityId: "cultural-hub-section" },
      { file: "images/ending.jpg",  label: "The End — Waving Goodbye from the Porch", audioStop: null }
    ];

    this.currentIndex = 0;
    this.viewMode = 'spread'; // 'spread' or 'single'
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.renderThumbnails();
    this.bindEvents();
    this.goToPage(0);
  }

  bindEvents() {
    const prevBtn = document.getElementById('reader-prev');
    const nextBtn = document.getElementById('reader-next');
    const fsBtn = document.getElementById('reader-fullscreen');
    const zoomBtn = document.getElementById('reader-zoom');
    const modeBtn = document.getElementById('reader-mode-toggle');

    if (prevBtn) prevBtn.addEventListener('click', () => this.goToPage(this.currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToPage(this.currentIndex + 1));
    if (fsBtn) fsBtn.addEventListener('click', () => this.toggleFullscreen());
    if (zoomBtn) zoomBtn.addEventListener('click', () => this.openLightbox());
    if (modeBtn) modeBtn.addEventListener('click', () => this.toggleViewMode());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only handle if lightbox is not open or if focused in reader
      if (document.getElementById('lightbox-modal')?.classList.contains('active')) {
        if (e.key === 'Escape') this.closeLightbox();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        this.goToPage(this.currentIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        this.goToPage(this.currentIndex - 1);
      }
    });

    // Touch swipe support
    const bookWrap = document.getElementById('reader-book-wrap');
    if (bookWrap) {
      bookWrap.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      bookWrap.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });

      // Click on image opens zoom lightbox
      bookWrap.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
          this.openLightbox();
        }
      });
    }

    // Lightbox modal close
    const closeLightboxBtn = document.getElementById('close-lightbox');
    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', () => this.closeLightbox());
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left -> next page
        this.goToPage(this.currentIndex + 1);
      } else {
        // Swiped right -> prev page
        this.goToPage(this.currentIndex - 1);
      }
    }
  }

  goToPage(index) {
    if (index < 0 || index >= this.spreads.length) return;
    this.currentIndex = index;
    const page = this.spreads[this.currentIndex];

    const bookImg = document.getElementById('reader-img');
    const pageNum = document.getElementById('reader-page-num');
    const pageTitle = document.getElementById('reader-page-title');
    const audioNotice = document.getElementById('reader-audio-notice');

    if (bookImg) {
      bookImg.src = page.file;
      bookImg.alt = page.label;
    }
    if (pageNum) pageNum.textContent = `Page ${this.currentIndex + 1} of ${this.spreads.length}`;
    if (pageTitle) pageTitle.textContent = page.label;

    // Check for interactive listening prompt or activity prompt
    if (audioNotice) {
      if (page.audioStop) {
        audioNotice.innerHTML = `
          <div class="audio-banner-item">
            <span>🎶 <strong>Listening Stop:</strong> "${page.audioStop.title}" by Daisy Voisin!</span>
            <a href="#music-section" class="banner-link-btn">Listen & Play Along 🎵</a>
          </div>
        `;
        audioNotice.style.display = 'block';
      } else if (page.activityId) {
        audioNotice.innerHTML = `
          <div class="audio-banner-item activity">
            <span>🎨 <strong>Interactive Activity:</strong> This page has an interactive companion activity!</span>
            <a href="#${page.activityId}" class="banner-link-btn">Jump to Activity 🚀</a>
          </div>
        `;
        audioNotice.style.display = 'block';
      } else {
        audioNotice.style.display = 'none';
      }
    }

    // Update thumbnail highlights
    const thumbs = document.querySelectorAll('.reader-thumb');
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === this.currentIndex);
    });

    const activeThumb = thumbs[this.currentIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  renderThumbnails() {
    const thumbBar = document.getElementById('reader-thumb-bar');
    if (!thumbBar) return;
    thumbBar.innerHTML = '';

    this.spreads.forEach((page, idx) => {
      const img = document.createElement('img');
      img.src = page.file;
      img.className = 'reader-thumb';
      img.title = `Page ${idx + 1}: ${page.label}`;
      img.alt = page.label;
      img.loading = 'lazy';
      img.addEventListener('click', () => this.goToPage(idx));
      thumbBar.appendChild(img);
    });
  }

  toggleViewMode() {
    const bookWrap = document.getElementById('reader-book-wrap');
    const modeBtn = document.getElementById('reader-mode-toggle');
    if (!bookWrap) return;

    if (this.viewMode === 'spread') {
      this.viewMode = 'single';
      bookWrap.classList.add('single-mode');
      if (modeBtn) modeBtn.innerHTML = '📱 Mobile Single Mode (Active)';
    } else {
      this.viewMode = 'spread';
      bookWrap.classList.remove('single-mode');
      if (modeBtn) modeBtn.innerHTML = '🌟 Double Spread Mode';
    }
  }

  toggleFullscreen() {
    const readerSection = document.getElementById('reader-section');
    if (!document.fullscreenElement) {
      if (readerSection.requestFullscreen) readerSection.requestFullscreen();
      else if (readerSection.webkitRequestFullscreen) readerSection.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  openLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    if (!modal) return;

    const page = this.spreads[this.currentIndex];
    if (lightboxImg) lightboxImg.src = page.file;
    if (lightboxCaption) lightboxCaption.textContent = page.label;
    modal.classList.add('active');
  }

  closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.remove('active');
  }
}

window.BookReader = BookReader;

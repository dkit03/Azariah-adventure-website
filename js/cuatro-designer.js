// "Design Your Own Cuatro" Interactive Canvas Studio
// Supports touch, mouse, brushes, stamps, colors, undo, PNG export & live strum sound

class CuatroDesigner {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.tool = 'brush'; // 'brush', 'eraser', 'stamp'
    this.color = '#e11d48'; // Hibiscus Red
    this.brushSize = 8;
    this.currentStamp = '🌺';
    this.isDrawing = false;
    this.history = [];
    this.maxHistory = 15;

    this.initCanvas();
    this.bindEvents();
    this.drawCuatroTemplate();
    this.saveState();
  }

  initCanvas() {
    // Set internal resolution for crisp display
    this.width = 600;
    this.height = 420;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  drawCuatroTemplate() {
    const ctx = this.ctx;
    ctx.save();

    // Background soft parchment glow
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle grid/woodgrain guide
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }

    // Cuatro Body Dimensions (Horizontal perspective)
    // Headstock: Left (x: 50 - 110)
    // Neck: (x: 110 - 240)
    // Soundboard Body: (x: 230 - 540)
    
    // Draw Cuatro Outer Body Silhouette (Figure-8 acoustic shape)
    ctx.fillStyle = '#fde68a'; // Warm spruce soundboard
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(180, 83, 9, 0.25)';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    // Start neck joint top
    ctx.moveTo(230, 160);
    // Upper bout top curve
    ctx.bezierCurveTo(260, 100, 340, 95, 370, 135);
    // Waist curve (narrowing)
    ctx.bezierCurveTo(390, 165, 410, 165, 430, 125);
    // Lower bout (wider bottom curve)
    ctx.bezierCurveTo(470, 80, 540, 110, 545, 210);
    // Lower bout bottom curve
    ctx.bezierCurveTo(540, 310, 470, 340, 430, 295);
    // Waist bottom
    ctx.bezierCurveTo(410, 255, 390, 255, 370, 285);
    // Upper bout bottom curve
    ctx.bezierCurveTo(340, 325, 260, 320, 230, 260);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0; // Reset shadow

    // Inner Purfling / Rosette border
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Soundhole (Center of upper bout/waist area ~ x:355, y:210)
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(355, 210, 38, 0, Math.PI * 2);
    ctx.fill();

    // Rosette decorative ring
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(355, 210, 43, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(355, 210, 47, 0, Math.PI * 2);
    ctx.stroke();

    // Bridge (x: 480, y: 175 to 245)
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.fillRect(475, 175, 18, 70);
    ctx.strokeRect(475, 175, 18, 70);

    // Bone Saddle
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(479, 182, 4, 56);

    // Neck (x: 100 to 235, y: 185 to 235)
    ctx.fillStyle = '#92400e';
    ctx.fillRect(100, 188, 135, 44);
    ctx.strokeStyle = '#78350f';
    ctx.strokeRect(100, 188, 135, 44);

    // Frets (10 frets along the fingerboard)
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    for (let f = 1; f <= 10; f++) {
      const fx = 100 + f * 12.5;
      ctx.beginPath();
      ctx.moveTo(fx, 188);
      ctx.lineTo(fx, 232);
      ctx.stroke();
    }

    // Headstock (Pegbox with 4 tuning pegs)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(100, 185);
    ctx.lineTo(40, 175);
    ctx.lineTo(30, 210);
    ctx.lineTo(40, 245);
    ctx.lineTo(100, 235);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.stroke();

    // Tuning Pegs (2 top, 2 bottom)
    ctx.fillStyle = '#fbbf24';
    [50, 80].forEach(px => {
      // Top pegs
      ctx.beginPath();
      ctx.arc(px, 170, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Bottom pegs
      ctx.beginPath();
      ctx.arc(px, 250, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 4 Traditional Cuatro Strings (Nylon silver/gold)
    const stringY = [194, 204, 216, 226];
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    stringY.forEach(sy => {
      ctx.beginPath();
      ctx.moveTo(40, sy);
      ctx.lineTo(485, sy);
      ctx.stroke();
    });

    // Watermark tag
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText("Azariah's Parang Cuatro", 260, 360);

    ctx.restore();
  }

  saveState() {
    if (this.history.length >= this.maxHistory) {
      this.history.shift();
    }
    this.history.push(this.ctx.getImageData(0, 0, this.width, this.height));
  }

  undo() {
    if (this.history.length > 1) {
      this.history.pop(); // Remove current state
      const prevState = this.history[this.history.length - 1];
      this.ctx.putImageData(prevState, 0, 0);
    }
  }

  clear() {
    this.drawCuatroTemplate();
    this.saveState();
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  bindEvents() {
    const startDraw = (e) => {
      e.preventDefault();
      this.isDrawing = true;
      const pos = this.getPointerPos(e);

      if (this.tool === 'stamp') {
        this.addStamp(pos.x, pos.y);
        this.saveState();
        this.isDrawing = false;
        return;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!this.isDrawing || this.tool === 'stamp') return;
      e.preventDefault();
      const pos = this.getPointerPos(e);

      this.ctx.lineWidth = this.brushSize;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      if (this.tool === 'eraser') {
        this.ctx.strokeStyle = '#fffbeb'; // Canvas parchment color
      } else {
        this.ctx.strokeStyle = this.color;
      }

      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    };

    const stopDraw = (e) => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.ctx.closePath();
      this.saveState();
    };

    this.canvas.addEventListener('mousedown', startDraw);
    this.canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    this.canvas.addEventListener('touchstart', startDraw, { passive: false });
    this.canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);
  }

  addStamp(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = `${this.brushSize * 4 + 16}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 4;
    ctx.fillText(this.currentStamp, x, y);
    ctx.restore();
  }

  strumSound() {
    if (window.parangSynth) {
      window.parangSynth.playCuatro('G', 'down');
      setTimeout(() => window.parangSynth.playCuatro('C', 'up'), 180);
      setTimeout(() => window.parangSynth.playCuatro('D7', 'down'), 340);
    }

    // Visual strum feedback
    this.canvas.style.transform = 'scale(1.02) rotate(0.8deg)';
    this.canvas.style.transition = 'transform 0.12s ease';
    setTimeout(() => {
      this.canvas.style.transform = 'scale(1) rotate(0deg)';
    }, 160);
  }

  download() {
    const link = document.createElement('a');
    link.download = 'azariah-parang-cuatro.png';
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

window.CuatroDesigner = CuatroDesigner;

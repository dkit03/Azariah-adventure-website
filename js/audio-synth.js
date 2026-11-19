// Web Audio API Synthesizer for Caribbean Parang Instruments
// Zero external dependencies - 100% offline, lightweight, responsive

class ParangSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.tempo = 120; // BPM for parang rhythm
    this.isPlayingBeat = false;
    this.beatInterval = null;
    this.beatStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.45;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Cuatro: Rapid 4-string acoustic strum
  // Chords: G (G3, B3, D4, G4), C (C4, E4, G4, C5), D7 (D4, F#4, A4, C5), 
  //         Em (E3, G3, B3, E4), A (A3, C#4, E4, A4)
  playCuatro(chord = 'G', direction = 'down') {
    this.init();
    const chords = {
      'G':  [196.00, 246.94, 293.66, 392.00],
      'C':  [261.63, 329.63, 392.00, 523.25],
      'D7': [293.66, 369.99, 440.00, 523.25],
      'Em': [164.81, 196.00, 246.94, 329.63],
      'A':  [220.00, 277.18, 329.63, 440.00]
    };

    const freqs = chords[chord] || chords['G'];
    const now = this.ctx.currentTime;
    const strumOrder = direction === 'down' ? freqs : [...freqs].reverse();

    strumOrder.forEach((freq, idx) => {
      const stringTime = now + (idx * 0.022); // Fast raspeado strum separation
      this.pluckString(freq, stringTime, 0.45);
    });
  }

  pluckString(freq, startTime, duration = 0.4) {
    // Fundamental pluck oscillator (sawtooth for bright nylon string)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm body filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.1, startTime + duration);

    // Quick attack, exponential acoustic decay
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.28, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  // Chac-Chacs (Maracas): Filtered white noise with seed shake envelope
  playChacChac(variant = 'sharp') {
    this.init();
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // White noise generator
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Highpass filter for the sharp dried calabash seed sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(variant === 'sharp' ? 4200 : 3400, now);
    filter.Q.value = 1.6;

    const gain = this.ctx.createGain();
    const duration = variant === 'sharp' ? 0.09 : 0.14;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  }

  // Toc-Toc (Woodblock): High-resonance hardwood clack
  playTocToc(pitch = 'high') {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = pitch === 'high' ? 980 : 750;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.06);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Box Bass (Marímbula / Tambora): Acoustic wooden box thump audible on laptops and phones
  playBoxBass(note = 'low') {
    this.init();
    const now = this.ctx.currentTime;

    // 1. Wood box strike transient (the acoustic slap on the wood)
    const slapOsc = this.ctx.createOscillator();
    const slapGain = this.ctx.createGain();
    slapOsc.type = 'sine';
    slapOsc.frequency.setValueAtTime(340, now);
    slapOsc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    slapGain.gain.setValueAtTime(0.85, now);
    slapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    slapOsc.connect(slapGain);
    slapGain.connect(this.masterGain);
    slapOsc.start(now);
    slapOsc.stop(now + 0.12);

    // 2. Resonant body bass tone (130Hz - 165Hz with rich harmonics so phone/laptop speakers reproduce it)
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    const bodyFilter = this.ctx.createBiquadFilter();

    bodyOsc.type = 'triangle';
    const pitch = note === 'low' ? 130.81 : 164.81; // C3 or E3
    bodyOsc.frequency.setValueAtTime(pitch, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(pitch * 0.85, now + 0.3);

    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(550, now);

    bodyGain.gain.setValueAtTime(0.001, now);
    bodyGain.gain.linearRampToValueAtTime(0.9, now + 0.015);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    bodyOsc.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    bodyGain.connect(this.masterGain);

    bodyOsc.start(now);
    bodyOsc.stop(now + 0.4);
  }

  // Celebratory Chime / Ding for Quiz & Games
  playChime(type = 'success') {
    this.init();
    const now = this.ctx.currentTime;
    const notes = type === 'success' ? [523.25, 659.25, 783.99, 1046.50] : [330.00, 293.66]; // C-E-G-C or E-D
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + (i * 0.08);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.25, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.4);
    });
  }

  // Interactive Parang Rhythm Loop (5/8 - 3/4 Caribbean Swing)
  // Step 1: Bass + Cuatro (down)
  // Step 2: Chac-Chac
  // Step 3: Toc-Toc
  // Step 4: Cuatro (up)
  // Step 5: Chac-Chac
  // Step 6: Toc-Toc
  toggleRhythmBeat(onBeatCallback) {
    this.init();
    if (this.isPlayingBeat) {
      clearInterval(this.beatInterval);
      this.isPlayingBeat = false;
      this.beatStep = 0;
      return false;
    }

    this.isPlayingBeat = true;
    const intervalMs = (60 / this.tempo / 2) * 1000; // Sixteenth / Eighth feel

    this.beatInterval = setInterval(() => {
      this.beatStep = (this.beatStep + 1) % 6;

      if (this.beatStep === 0) {
        this.playBoxBass('low');
        this.playCuatro('G', 'down');
      } else if (this.beatStep === 1) {
        this.playChacChac('sharp');
      } else if (this.beatStep === 2) {
        this.playTocToc('high');
      } else if (this.beatStep === 3) {
        this.playCuatro('G', 'up');
      } else if (this.beatStep === 4) {
        this.playChacChac('soft');
      } else if (this.beatStep === 5) {
        this.playTocToc('low');
      }

      if (typeof onBeatCallback === 'function') {
        onBeatCallback(this.beatStep);
      }
    }, intervalMs);

    return true;
  }
}

// Global instance
window.parangSynth = new ParangSynth();

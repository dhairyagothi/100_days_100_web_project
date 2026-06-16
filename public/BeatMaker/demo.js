// Beat Maker Pro
class BeatMaker {
  constructor() {
    this.bpm = 120;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStep = 0;
    this.intervalId = null;
    this.playStartTime = null;
    this.totalPlayTime = 0;
    this.instruments = ['kick', 'snare', 'hihat', 'clap', 'crash', 'openhat', 'percussion'];
    this.pattern = {};
    this.stats = {
      beatsCreated: 0,
      totalPlayTime: 0,
      favoriteBpm: {},
      savedPatterns: 0
    };
    this.audioContext = null;
    
    this.initPattern();
    this.loadStats();
    this.loadSavedBeats();
    this.bindEvents();
    this.updateStatsDisplay();
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  initPattern() {
    this.instruments.forEach(instrument => {
      this.pattern[instrument] = new Array(8).fill(false);
    });
  }

  bindEvents() {
    // Pad clicks
    document.querySelectorAll('.pad').forEach(pad => {
      pad.addEventListener('click', (e) => this.togglePad(e.target));
    });

    // Preview buttons
    document.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.playSound(e.target.dataset.instrument);
      });
    });

    // Control buttons
    document.getElementById('play-btn').addEventListener('click', () => this.play());
    document.getElementById('pause-btn').addEventListener('click', () => this.pause());
    document.getElementById('stop-btn').addEventListener('click', () => this.stop());
    document.getElementById('clear-btn').addEventListener('click', () => this.clear());
    document.getElementById('random-btn').addEventListener('click', () => this.randomize());

    // BPM slider
    document.getElementById('bpm-slider').addEventListener('input', (e) => {
      this.setBpm(parseInt(e.target.value));
    });

    // Genre presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.loadPreset(e.target.dataset.preset));
    });

    // Save/Load
    document.getElementById('save-btn').addEventListener('click', () => this.saveBeat());
  }

  togglePad(pad) {
    const instrument = pad.dataset.instrument;
    const step = parseInt(pad.dataset.step);
    this.pattern[instrument][step] = !this.pattern[instrument][step];
    pad.classList.toggle('active');
  }

  setBpm(bpm) {
    this.bpm = bpm;
    document.getElementById('bpm-value').textContent = bpm;
    
    if (!this.stats.favoriteBpm[bpm]) {
      this.stats.favoriteBpm[bpm] = 0;
    }
    this.stats.favoriteBpm[bpm]++;
    this.saveStats();
    
    if (this.isPlaying && !this.isPaused) {
      this.stop();
      this.play();
    }
  }

  play() {
    if (this.isPlaying && !this.isPaused) return;
    
    if (this.isPaused) {
      this.isPaused = false;
    } else {
      this.currentStep = 0;
      this.playStartTime = Date.now();
      this.stats.beatsCreated++;
      this.saveStats();
    }
    
    this.isPlaying = true;
    const stepTime = (60 / this.bpm / 2) * 1000;
    this.intervalId = setInterval(() => this.step(), stepTime);
    this.updateStatsDisplay();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    clearInterval(this.intervalId);
    this.updatePlayTime();
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.currentStep = 0;
    this.updatePlayTime();
    this.clearCurrentHighlight();
  }

  step() {
    this.clearCurrentHighlight();
    
    this.instruments.forEach(instrument => {
      if (this.pattern[instrument][this.currentStep]) {
        this.playSound(instrument);
      }
    });

    this.highlightCurrentStep();
    this.animateVisualizer();
    this.currentStep = (this.currentStep + 1) % 8;
  }

  highlightCurrentStep() {
    this.instruments.forEach(instrument => {
      const pad = document.querySelector(`.pad[data-instrument="${instrument}"][data-step="${this.currentStep}"]`);
      if (pad) pad.classList.add('current');
    });
  }

  clearCurrentHighlight() {
    document.querySelectorAll('.pad.current').forEach(pad => {
      pad.classList.remove('current');
    });
  }

  playSound(instrument) {
    this.initAudioContext();
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    switch(instrument) {
      case 'kick':
        this.playKick(ctx, now);
        break;
      case 'snare':
        this.playSnare(ctx, now);
        break;
      case 'hihat':
        this.playHiHat(ctx, now);
        break;
      case 'clap':
        this.playClap(ctx, now);
        break;
      case 'crash':
        this.playCrash(ctx, now);
        break;
      case 'openhat':
        this.playOpenHat(ctx, now);
        break;
      case 'percussion':
        this.playPercussion(ctx, now);
        break;
    }
  }

  playKick(ctx, now) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playSnare(ctx, now) {
    // Noise component
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;
    
    const noiseGain = ctx.createGain();
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseGain.gain.setValueAtTime(1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    // Tone component
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.frequency.value = 200;
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    noise.start(now);
    noise.stop(now + 0.2);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playHiHat(ctx, now) {
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;
    
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 7000;
    
    const gain = ctx.createGain();
    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    noise.start(now);
    noise.stop(now + 0.05);
  }

  playClap(ctx, now) {
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;
    
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 2000;
    
    const gain = ctx.createGain();
    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    
    // Multiple bursts for clap effect
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.01);
    gain.gain.linearRampToValueAtTime(0, now + 0.03);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.05);
    gain.gain.linearRampToValueAtTime(0, now + 0.07);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.09);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    
    noise.start(now);
    noise.stop(now + 0.15);
  }

  playCrash(ctx, now) {
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;
    
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 8000;
    
    const gain = ctx.createGain();
    noise.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
    
    noise.start(now);
    noise.stop(now + 1);
  }

  playOpenHat(ctx, now) {
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;
    
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 6000;
    
    const gain = ctx.createGain();
    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    noise.start(now);
    noise.stop(now + 0.3);
  }

  playPercussion(ctx, now) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  animateVisualizer() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
      const height = Math.random() * 100;
      bar.style.height = `${height}px`;
    });
  }

  clear() {
    this.initPattern();
    document.querySelectorAll('.pad.active').forEach(pad => {
      pad.classList.remove('active');
    });
  }

  randomize() {
    this.clear();
    this.instruments.forEach(instrument => {
      for (let i = 0; i < 8; i++) {
        if (Math.random() > 0.6) {
          this.pattern[instrument][i] = true;
          const pad = document.querySelector(`.pad[data-instrument="${instrument}"][data-step="${i}"]`);
          if (pad) pad.classList.add('active');
        }
      }
    });
  }

  loadPreset(preset) {
    this.clear();
    const presets = {
      edm: {
        bpm: 128,
        pattern: {
          kick: [true, false, false, false, true, false, false, false],
          snare: [false, false, true, false, false, false, true, false],
          hihat: [true, true, true, true, true, true, true, true],
          clap: [false, false, true, false, false, false, true, false],
          crash: [true, false, false, false, false, false, false, false],
          openhat: [false, false, false, false, false, false, false, false],
          percussion: [false, true, false, true, false, true, false, true]
        }
      },
      hiphop: {
        bpm: 95,
        pattern: {
          kick: [true, false, false, false, false, false, true, false],
          snare: [false, false, true, false, false, false, true, false],
          hihat: [true, false, true, false, true, false, true, false],
          clap: [false, false, true, false, false, false, true, false],
          crash: [false, false, false, false, false, false, false, false],
          openhat: [false, true, false, true, false, true, false, true],
          percussion: [true, false, false, false, false, false, false, false]
        }
      },
      lofi: {
        bpm: 80,
        pattern: {
          kick: [true, false, false, false, true, false, false, false],
          snare: [false, false, true, false, false, false, true, false],
          hihat: [true, true, true, true, true, true, true, true],
          clap: [false, false, true, false, false, false, true, false],
          crash: [false, false, false, false, false, false, false, false],
          openhat: [false, false, false, true, false, false, false, true],
          percussion: [false, true, false, false, false, true, false, false]
        }
      },
      trap: {
        bpm: 140,
        pattern: {
          kick: [true, false, false, true, false, false, true, false],
          snare: [false, false, true, false, false, false, true, false],
          hihat: [true, true, true, true, true, true, true, true],
          clap: [false, false, true, false, false, false, true, false],
          crash: [false, false, false, false, false, false, false, false],
          openhat: [false, false, false, false, false, false, false, false],
          percussion: [true, true, false, true, true, false, true, true]
        }
      },
      rock: {
        bpm: 120,
        pattern: {
          kick: [true, false, false, false, true, false, false, false],
          snare: [false, false, true, false, false, false, true, false],
          hihat: [true, false, true, false, true, false, true, false],
          clap: [false, false, true, false, false, false, true, false],
          crash: [true, false, false, false, false, false, false, false],
          openhat: [false, false, false, false, false, false, false, false],
          percussion: [false, false, false, false, false, false, false, false]
        }
      }
    };

    const selectedPreset = presets[preset];
    if (selectedPreset) {
      this.setBpm(selectedPreset.bpm);
      document.getElementById('bpm-slider').value = selectedPreset.bpm;
      
      this.instruments.forEach(instrument => {
        for (let i = 0; i < 8; i++) {
          if (selectedPreset.pattern[instrument][i]) {
            this.pattern[instrument][i] = true;
            const pad = document.querySelector(`.pad[data-instrument="${instrument}"][data-step="${i}"]`);
            if (pad) pad.classList.add('active');
          }
        }
      });
    }
  }

  saveBeat() {
    const nameInput = document.getElementById('save-name');
    const name = nameInput.value.trim() || `Beat ${Date.now()}`;
    
    let savedBeats = JSON.parse(localStorage.getItem('beatmaker-saved') || '[]');
    savedBeats.push({
      name,
      pattern: JSON.parse(JSON.stringify(this.pattern)),
      bpm: this.bpm,
      date: new Date().toLocaleString()
    });
    
    localStorage.setItem('beatmaker-saved', JSON.stringify(savedBeats));
    this.stats.savedPatterns = savedBeats.length;
    this.saveStats();
    this.loadSavedBeats();
    this.updateStatsDisplay();
    nameInput.value = '';
  }

  loadSavedBeats() {
    const container = document.getElementById('saved-beats');
    const savedBeats = JSON.parse(localStorage.getItem('beatmaker-saved') || '[]');
    
    container.innerHTML = '';
    savedBeats.forEach((beat, index) => {
      const beatEl = document.createElement('div');
      beatEl.className = 'saved-beat';
      beatEl.innerHTML = `
        <span>${beat.name}</span>
        <div>
          <button class="load-beat" data-index="${index}">Load</button>
          <button class="delete-beat" data-index="${index}">Delete</button>
        </div>
      `;
      container.appendChild(beatEl);
    });

    container.querySelectorAll('.load-beat').forEach(btn => {
      btn.addEventListener('click', (e) => this.loadBeat(parseInt(e.target.dataset.index)));
    });

    container.querySelectorAll('.delete-beat').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteBeat(parseInt(e.target.dataset.index)));
    });
  }

  loadBeat(index) {
    const savedBeats = JSON.parse(localStorage.getItem('beatmaker-saved') || '[]');
    const beat = savedBeats[index];
    
    if (beat) {
      this.clear();
      this.setBpm(beat.bpm);
      document.getElementById('bpm-slider').value = beat.bpm;
      this.pattern = JSON.parse(JSON.stringify(beat.pattern));
      
      this.instruments.forEach(instrument => {
        for (let i = 0; i < 8; i++) {
          if (this.pattern[instrument][i]) {
            const pad = document.querySelector(`.pad[data-instrument="${instrument}"][data-step="${i}"]`);
            if (pad) pad.classList.add('active');
          }
        }
      });
    }
  }

  deleteBeat(index) {
    let savedBeats = JSON.parse(localStorage.getItem('beatmaker-saved') || '[]');
    savedBeats.splice(index, 1);
    localStorage.setItem('beatmaker-saved', JSON.stringify(savedBeats));
    this.stats.savedPatterns = savedBeats.length;
    this.saveStats();
    this.loadSavedBeats();
    this.updateStatsDisplay();
  }

  updatePlayTime() {
    if (this.playStartTime) {
      const elapsed = Date.now() - this.playStartTime;
      this.stats.totalPlayTime += elapsed;
      this.playStartTime = null;
      this.saveStats();
      this.updateStatsDisplay();
    }
  }

  saveStats() {
    localStorage.setItem('beatmaker-stats', JSON.stringify(this.stats));
  }

  loadStats() {
    const saved = localStorage.getItem('beatmaker-stats');
    if (saved) {
      this.stats = JSON.parse(saved);
    }
  }

  updateStatsDisplay() {
    document.getElementById('beats-created').textContent = this.stats.beatsCreated;
    
    const totalSeconds = Math.floor(this.stats.totalPlayTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('total-time').textContent = 
      minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    let favoriteBpm = '-';
    let maxCount = 0;
    for (const [bpm, count] of Object.entries(this.stats.favoriteBpm)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteBpm = bpm;
      }
    }
    document.getElementById('favorite-bpm').textContent = favoriteBpm;
    
    document.getElementById('saved-count').textContent = this.stats.savedPatterns;
  }
}

const beatMaker = new BeatMaker();
const stop = () => {
  clearInterval(musicPlaying);
  stopBtn.style.display = "none";
  playBtn.style.display = "block";
}
// Theme toggle
  const themeBtn = document.getElementById("themeToggle");

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");

      themeBtn.textContent =
        document.body.classList.contains("light-theme")
          ? "☀️"
          : "🌙";
    });

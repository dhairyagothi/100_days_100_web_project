// Cozy Digital Planner Procedural Sound Synthesizer

export class PlannerAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime); // Gentle default volume
    this.masterGain.connect(this.ctx.destination);
  }

  setMute(muted) {
    this.isMuted = muted;
    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }
  }

  // Synthesizes a scratchy, paper-pencil friction sound
  playPenScratch() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Create audio nodes
    // BufferSource for white noise -> Bandpass filter -> Gain envelope -> Destination
    const bufferSize = this.ctx.sampleRate * 0.05; // 50ms short scratch
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with random noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    // Bandpass filter to isolate mid-high frequencies matching paper scratch (e.g., 2000Hz - 4000Hz)
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2800 + Math.random() * 800, now);
    filter.Q.setValueAtTime(3.0, now);
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    // Sharp attack, rapid decay envelope
    gainNode.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.05, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    
    // Connect nodes
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    noiseNode.start(now);
    noiseNode.stop(now + 0.05);
  }

  // Synthesizes a soft page rustling flip sound
  playPageFlip() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const duration = 0.25; // 250ms page flip
    
    // Generate pink-ish noise by lowpass filtering white noise
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    // Sweeping filter frequency downwards simulates sliding paper
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + duration);
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    noiseNode.start(now);
    noiseNode.stop(now + duration);
  }
}

export const plannerAudio = new PlannerAudioEngine();

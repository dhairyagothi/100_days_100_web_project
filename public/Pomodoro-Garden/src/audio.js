/**
 * audio.js — Web Audio API engine for procedural ambient + chimes.
 *
 * No mp3s. All sounds synthesized:
 *   - forest:  filtered white noise + slow LFO on cutoff (wind through leaves)
 *   - rain:    high-pass filtered noise + faster modulation
 *   - bowls:   periodic harmonic stack (A3/C4/E4/G4/A4) with long decay
 *   - chime:   short bell tone for session boundaries
 */

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.master = null;
        this.activeNodes = [];
        this.scheduledTimers = [];
        this.currentType = 'silence';
        this.volume = 0.4;
        this._initialized = false;
    }

    _ensure() {
        if (this._initialized) return;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.volume;
        this.comp = this.ctx.createDynamicsCompressor();
        this.comp.threshold.value = -14;
        this.comp.knee.value = 12;
        this.comp.ratio.value = 4;
        this.master.connect(this.comp).connect(this.ctx.destination);
        this._initialized = true;
    }

    async resume() {
        this._ensure();
        if (this.ctx?.state === 'suspended') await this.ctx.resume();
    }

    setVolume(v) {
        this.volume = Math.max(0, Math.min(1, v));
        if (this.master) {
            this.master.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.3);
        }
    }

    _makeNoiseBuffer(duration = 6) {
        const len = this.ctx.sampleRate * duration;
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        return buf;
    }

    _noiseSource() {
        const src = this.ctx.createBufferSource();
        src.buffer = this._makeNoiseBuffer(8);
        src.loop = true;
        src.start();
        return src;
    }

    play(type) {
        this._ensure();
        if (!this.ctx) return;
        this.resume();
        this.stop();
        this.currentType = type;
        if (type === 'silence') return;
        if (type === 'forest') this._forest();
        else if (type === 'rain') this._rain();
        else if (type === 'bowls') this._bowls();
    }

    stop() {
        this.activeNodes.forEach(n => {
            try { n.stop?.(); n.disconnect?.(); } catch {}
        });
        this.activeNodes = [];
        this.scheduledTimers.forEach(t => clearTimeout(t));
        this.scheduledTimers = [];
    }

    _forest() {
        const src = this._noiseSource();
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 700;
        lp.Q.value = 2.5;

        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.07;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 350;
        lfo.connect(lfoGain).connect(lp.frequency);
        lfo.start();

        const ambientGain = this.ctx.createGain();
        ambientGain.gain.value = 0.55;

        src.connect(lp).connect(ambientGain).connect(this.master);
        this.activeNodes.push(src, lfo, lp, lfoGain, ambientGain);

        const scheduleBird = () => {
            const delay = 4000 + Math.random() * 8000;
            const t = setTimeout(() => {
                this._chirp();
                scheduleBird();
            }, delay);
            this.scheduledTimers.push(t);
        };
        scheduleBird();
    }

    _chirp() {
        if (!this.ctx) return;
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startFreq = 1800 + Math.random() * 1200;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, t0);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.6, t0 + 0.18);
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(0.05, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.20);
        osc.connect(gain).connect(this.master);
        osc.start(t0);
        osc.stop(t0 + 0.25);
    }

    _rain() {
        const src = this._noiseSource();

        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 1500;

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 9000;

        const mod = this.ctx.createOscillator();
        mod.frequency.value = 0.3;
        const modGain = this.ctx.createGain();
        modGain.gain.value = 700;
        mod.connect(modGain).connect(lp.frequency);
        mod.start();

        const gain = this.ctx.createGain();
        gain.gain.value = 0.45;

        src.connect(hp).connect(lp).connect(gain).connect(this.master);
        this.activeNodes.push(src, hp, lp, mod, modGain, gain);
    }

    _bowls() {
        const fundamentals = [220.0, 261.6, 329.6, 392.0, 440.0];
        const scheduleBowl = () => {
            const fund = fundamentals[Math.floor(Math.random() * fundamentals.length)];
            this._ringBowl(fund);
            const delay = 8000 + Math.random() * 12000;
            const t = setTimeout(scheduleBowl, delay);
            this.scheduledTimers.push(t);
        };
        scheduleBowl();
    }

    _ringBowl(fund, peak = 0.22) {
        if (!this.ctx) return;
        const t0 = this.ctx.currentTime;
        const harmonics = [1, 2.01, 3.02, 4.3];
        harmonics.forEach((h, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = fund * h;
            osc.detune.value = (Math.random() - 0.5) * 6;
            const partialPeak = peak / (i + 1);
            gain.gain.setValueAtTime(0, t0);
            gain.gain.linearRampToValueAtTime(partialPeak, t0 + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 6 + i * 0.6);
            osc.connect(gain).connect(this.master);
            osc.start(t0);
            osc.stop(t0 + 7);
        });
    }

    chime(kind = 'complete') {
        this._ensure();
        if (!this.ctx) return;
        this.resume();
        const fund = kind === 'complete' ? 523.25 : 392.0;
        this._ringBowl(fund, 0.3);
        setTimeout(() => this._ringBowl(fund * 1.5, 0.18), 300);
    }
}
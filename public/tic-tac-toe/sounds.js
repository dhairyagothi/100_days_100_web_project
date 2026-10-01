// sounds.js
// Synthesizes game sounds and background music using Web Audio API

let audioCtx = null;
let bgMusicSource = null;
let bgMusicGainNode = null;
let soundEnabled = true;
let musicEnabled = false;
let musicPlaying = false;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

const SoundEffects = {
    setSoundEnabled(enabled) {
        soundEnabled = enabled;
    },

    setMusicEnabled(enabled) {
        musicEnabled = enabled;
        if (musicEnabled) {
            this.startBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    },

    playClick() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            // Quick sweep from 400Hz to 150Hz
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {
            console.error('Audio playClick error:', e);
        }
    },

    playWin() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
            const tempo = 0.07; // duration of each note

            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * tempo);

                gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * tempo);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * tempo + 0.25);

                osc.start(ctx.currentTime + idx * tempo);
                osc.stop(ctx.currentTime + idx * tempo + 0.25);
            });
        } catch (e) {
            console.error('Audio playWin error:', e);
        }
    },

    playDraw() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            // A sad diminished descending chord
            const notes = [293.66, 277.18, 261.63, 246.94]; // D, C#, C, B descending
            const tempo = 0.12;

            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * tempo);

                gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * tempo);
                gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + idx * tempo + 0.35);

                osc.start(ctx.currentTime + idx * tempo);
                osc.stop(ctx.currentTime + idx * tempo + 0.35);
            });
        } catch (e) {
            console.error('Audio playDraw error:', e);
        }
    },

    playBadgeUnlock() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            const time = ctx.currentTime;
            // Magical double chime
            const freqs = [587.33, 880.00, 1174.66]; // D5, A5, D6 arpeggio

            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time + idx * 0.08);

                gain.gain.setValueAtTime(0.1, time + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.08 + 0.4);

                osc.start(time + idx * 0.08);
                osc.stop(time + idx * 0.08 + 0.4);
            });
        } catch (e) {
            console.error('Audio playBadgeUnlock error:', e);
        }
    },

    startBackgroundMusic() {
        if (!musicEnabled || musicPlaying) return;
        try {
            const ctx = getAudioContext();
            bgMusicGainNode = ctx.createGain();
            bgMusicGainNode.gain.setValueAtTime(0.02, ctx.currentTime); // Low background volume
            bgMusicGainNode.connect(ctx.destination);

            musicPlaying = true;
            this.playMusicLoop(ctx);
        } catch (e) {
            console.error('Audio startBackgroundMusic error:', e);
        }
    },

    stopBackgroundMusic() {
        musicPlaying = false;
        if (bgMusicSource) {
            try {
                bgMusicSource.stop();
            } catch (e) {}
            bgMusicSource = null;
        }
    },

    playMusicLoop(ctx) {
        if (!musicPlaying) return;

        // Create a simple rhythmic retro sequence arpeggio
        // We schedule a series of short notes, then schedule the next loop
        const notes = [
            261.63, 329.63, 392.00, 329.63, // C4 E4 G4 E4
            293.66, 349.23, 440.00, 349.23, // D4 F4 A4 F4
            329.63, 392.00, 493.88, 392.00, // E4 G4 B4 G4
            349.23, 440.00, 523.25, 440.00  // F4 A4 C5 A4
        ];
        
        const noteDuration = 0.25; // Quarter second
        const totalDuration = notes.length * noteDuration;

        const timeStart = ctx.currentTime;

        notes.forEach((freq, idx) => {
            if (!musicPlaying) return;
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();

            osc.connect(noteGain);
            noteGain.connect(bgMusicGainNode);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, timeStart + idx * noteDuration);

            // Staccato retro feel
            noteGain.gain.setValueAtTime(0.0, timeStart + idx * noteDuration);
            noteGain.gain.linearRampToValueAtTime(0.6, timeStart + idx * noteDuration + 0.02);
            noteGain.gain.setValueAtTime(0.6, timeStart + idx * noteDuration + 0.15);
            noteGain.gain.linearRampToValueAtTime(0.0, timeStart + idx * noteDuration + noteDuration - 0.02);

            osc.start(timeStart + idx * noteDuration);
            osc.stop(timeStart + (idx + 1) * noteDuration);
        });

        // Save last oscillator to allow stopping
        bgMusicSource = {
            stop: () => {
                // Stopped externally
            }
        };

        // Schedule next loop
        setTimeout(() => {
            if (musicPlaying) {
                this.playMusicLoop(ctx);
            }
        }, totalDuration * 1000);
    }
};

window.SoundEffects = SoundEffects;

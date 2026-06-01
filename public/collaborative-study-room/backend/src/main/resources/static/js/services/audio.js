// Programmatic Ambient Audio Synthesizer (Web Audio API)
// Synthesizes white noise, wave swells, and binaural alpha beats entirely client-side.

let audioCtx = null;
let analyserNode = null;
let masterGainNode = null;

// Track active audio synthesizers
const activeSources = {
  'white-noise': null,
  'ocean': null,
  'binaural': null
};

// Lazy initialization of Audio Context
function initAudio() {
  if (audioCtx) return;

  // Create AudioContext (supporting vendor prefixes)
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();

  // Create Analyser for Canvas spectrum visualization
  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 128; // Frequency resolution

  // Create Master Gain Controller
  masterGainNode = audioCtx.createGain();
  masterGainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);

  // Connection flow: Source -> Analyser -> Master Gain -> Output
  analyserNode.connect(masterGainNode);
  masterGainNode.connect(audioCtx.destination);
}

// Generate an AudioBuffer containing white noise
function createNoiseBuffer() {
  const bufferSize = 2 * audioCtx.sampleRate; // 2 seconds of sound
  const noiseBuffer = audioCtx.createBuffer(2, bufferSize, audioCtx.sampleRate);
  
  for (let channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {
    const bufferData = noiseBuffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      bufferData[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

// -------------------------------------------------------------
// 1. WHITE NOISE SYNTHESIS
// -------------------------------------------------------------
function startWhiteNoise(volume) {
  stopSound('white-noise');

  // Source Buffer
  const source = audioCtx.createBufferSource();
  source.buffer = createNoiseBuffer();
  source.loop = true;

  // Filter out harsh highs for comfortable study
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime);

  // Gain (Volume) node
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);

  // Connect
  source.connect(filter);
  filter.connect(gain);
  gain.connect(analyserNode);

  source.start(0);

  activeSources['white-noise'] = { source, gain, filter };
}

// -------------------------------------------------------------
// 2. OCEAN WAVE SYNTHESIS (LFO Filter Modulated Noise)
// -------------------------------------------------------------
function startOceanWaves(volume) {
  stopSound('ocean');

  // Noise source
  const source = audioCtx.createBufferSource();
  source.buffer = createNoiseBuffer();
  source.loop = true;

  // Bandpass filter to isolate wave crash frequencies
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(1.5, audioCtx.currentTime);
  filter.frequency.setValueAtTime(350, audioCtx.currentTime);

  // LFO (Low Frequency Oscillator) to modulate filter frequency (creates swelling effect)
  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // 12 seconds per wave swell cycle

  // LFO Depth gain
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(250, audioCtx.currentTime); // Swell amplitude range: 100Hz - 600Hz

  // Gain Node
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);

  // Modulate filter frequency with LFO
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  // Connect Audio
  source.connect(filter);
  filter.connect(gain);
  gain.connect(analyserNode);

  source.start(0);
  lfo.start(0);

  activeSources['ocean'] = { source, gain, filter, lfo };
}

// -------------------------------------------------------------
// 3. BINAURAL BEATS (200Hz Left / 210Hz Right -> 10Hz Alpha differential)
// -------------------------------------------------------------
function startBinauralBeats(volume) {
  stopSound('binaural');

  // Left Oscillator (200 Hz carrier wave)
  const oscLeft = audioCtx.createOscillator();
  oscLeft.type = 'sine';
  oscLeft.frequency.setValueAtTime(200, audioCtx.currentTime);

  // Right Oscillator (210 Hz carrier wave)
  const oscRight = audioCtx.createOscillator();
  oscRight.type = 'sine';
  oscRight.frequency.setValueAtTime(210, audioCtx.currentTime);

  // Stereo panners
  const pannerLeft = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
  const pannerRight = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
  
  // Gain Node
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume * 0.7, audioCtx.currentTime); // Keep binaural slightly softer

  if (pannerLeft && pannerRight) {
    pannerLeft.pan.setValueAtTime(-1, audioCtx.currentTime); // Far left
    pannerRight.pan.setValueAtTime(1, audioCtx.currentTime); // Far right

    oscLeft.connect(pannerLeft);
    pannerLeft.connect(gain);

    oscRight.connect(pannerRight);
    pannerRight.connect(gain);
  } else {
    // Fallback: merge directly if panning unsupported
    oscLeft.connect(gain);
    oscRight.connect(gain);
  }

  gain.connect(analyserNode);

  oscLeft.start(0);
  oscRight.start(0);

  activeSources['binaural'] = { oscLeft, oscRight, gain };
}

// -------------------------------------------------------------
// CONTROL GATEWAYS
// -------------------------------------------------------------

export function playSound(soundId, volume = 0.5) {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (soundId === 'white-noise') {
    startWhiteNoise(volume);
  } else if (soundId === 'ocean') {
    startOceanWaves(volume);
  } else if (soundId === 'binaural') {
    startBinauralBeats(volume);
  }
}

export function stopSound(soundId) {
  const active = activeSources[soundId];
  if (!active) return;

  try {
    if (active.source) active.source.stop();
    if (active.oscLeft) active.oscLeft.stop();
    if (active.oscRight) active.oscRight.stop();
    if (active.lfo) active.lfo.stop();
  } catch (e) {
    // Avoid double stop errors
  }

  activeSources[soundId] = null;
}

export function adjustVolume(soundId, volume) {
  const active = activeSources[soundId];
  if (active && active.gain) {
    active.gain.gain.linearRampToValueAtTime(volume, audioCtx ? audioCtx.currentTime + 0.1 : 0);
  }
}

export function stopAllSounds() {
  Object.keys(activeSources).forEach(soundId => stopSound(soundId));
}

export function isSoundPlaying(soundId) {
  return activeSources[soundId] !== null;
}

export function getAnalyserData() {
  if (!analyserNode) return null;
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyserNode.getByteFrequencyData(dataArray);
  return dataArray;
}

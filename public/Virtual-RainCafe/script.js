/* Virtual Rain Cafe - Core Application Logic */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STATE MANAGEMENT & LOCAL STORAGE
  // ==========================================

  // Helper to safely get stored numbers with a default to avoid NaN crashes
  function getStoredNumber(key, defaultValue) {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  const state = {
    theme: localStorage.getItem('vr-theme') || 'cozy',
    rainIntensity: getStoredNumber('vr-rain-intensity', 2),
    isMutedAll: false,
    isDimmed: false,
    isPlayingMusic: false,
    currentTrackIndex: 0,
    timerDuration: 1500, // 25 minutes default
    timerRemaining: 1500,
    timerInterval: null,
    timerState: 'stopped', // stopped, running, paused
    timerType: 'focus', // focus, short, long
    todos: JSON.parse(localStorage.getItem('vr-todos')) || [
      { id: 1, text: 'Order a hot caramel macchiato ☕', completed: false },
      { id: 2, text: 'Enable rain sound slider', completed: true },
      { id: 3, text: 'Type a cozy journal entry below', completed: false },
    ],
    notepadContent: localStorage.getItem('vr-notepad') || '',
    keyboardSoundsEnabled: localStorage.getItem('vr-kbd-sounds') !== 'false',
  };

  // Ambient Sounds Configuration
  const ambientSounds = {
    rain: {
      url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/rain.mp3',
      volume: getStoredNumber('vr-vol-rain', 50),
      el: null,
      muted: false,
    },
    thunder: {
      url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/thunder.mp3',
      volume: getStoredNumber('vr-vol-thunder', 0),
      el: null,
      muted: true,
    },
    cafe: {
      url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      volume: getStoredNumber('vr-vol-cafe', 40),
      el: null,
      muted: false,
    },
    fire: {
      url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/campfire.mp3',
      volume: getStoredNumber('vr-vol-fire', 20),
      el: null,
      muted: false,
    },
    wind: {
      url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/wind.mp3',
      volume: getStoredNumber('vr-vol-wind', 0),
      el: null,
      muted: true,
    },
  };

  // Lo-Fi Music Playlist (CC0 Public Domain Tracks from btahir/open-lofi)
  const musicPlaylist = [
    {
      title: '2 AM Debug Loop',
      artist: 'btahir (Open Lo-Fi Collection)',
      url: 'https://raw.githubusercontent.com/btahir/open-lofi/main/Focus%2C%20Rituals%20%26%20Daily%20Routines/2%20AM%20Debug%20Loop.mp3',
    },
    {
      title: 'Brushstrokes and Rain',
      artist: 'btahir (Open Lo-Fi Collection)',
      url: 'https://raw.githubusercontent.com/btahir/open-lofi/main/Focus%2C%20Rituals%20%26%20Daily%20Routines/Brushstrokes%20and%20Rain.mp3',
    },
    {
      title: 'Almost Floating',
      artist: 'btahir (Open Lo-Fi Collection)',
      url: 'https://raw.githubusercontent.com/btahir/open-lofi/main/Ambient%20Drift%20%26%20Dreamscapes/Almost%20Floating.mp3',
    },
    {
      title: 'Aurora on Mute',
      artist: 'btahir (Open Lo-Fi Collection)',
      url: 'https://raw.githubusercontent.com/btahir/open-lofi/main/Ambient%20Drift%20%26%20Dreamscapes/Aurora%20on%20Mute.mp3',
    },
    {
      title: '3 AM Echoes',
      artist: 'btahir (Open Lo-Fi Collection)',
      url: 'https://raw.githubusercontent.com/btahir/open-lofi/main/Late%20Night%2C%20Neon%20%26%20After%20Hours/3%20AM%20Echoes.mp3',
    },
    {
      title: 'Antenna After Midnight',
      artist: 'btahir (Open Lo-Fi Collection)',
      url: 'https://raw.githubusercontent.com/btahir/open-lofi/main/Late%20Night%2C%20Neon%20%26%20After%20Hours/Antenna%20After%20Midnight.mp3',
    },
    {
      title: 'Block Party Slow Jam',
      artist: 'btahir (Open Lo-Fi Collection)',
      url: 'https://raw.githubusercontent.com/btahir/open-lofi/main/Funk%2C%20Soul%20%26%20Retro%20Bounce/Block%20Party%20Slow%20Jam.mp3',
    },
  ];

  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================
  const elements = {
    body: document.body,
    appContainer: document.querySelector('.app-container'),
    dimOverlay: document.getElementById('dimOverlay'),
    rainCanvas: document.getElementById('rainCanvas'),
    weatherStatusText: document.getElementById('weatherStatusText'),

    // Header controls
    btnDim: document.getElementById('btnDim'),
    btnMuteAll: document.getElementById('btnMuteAll'),
    muteIcon: document.getElementById('muteIcon'),
    btnHideUI: document.getElementById('btnHideUI'),
    btnRestoreUI: document.getElementById('btnRestoreUI'),
    btnInfo: document.getElementById('btnInfo'),

    // Theme card
    themeButtons: document.querySelectorAll('.theme-btn'),
    sliderRainIntensity: document.getElementById('sliderRainIntensity'),
    rainIntensityLabel: document.getElementById('rainIntensityLabel'),

    // Sound mixer
    mixerItems: document.querySelectorAll('.mixer-item'),

    // Music player
    vinylDisc: document.getElementById('vinylDisc'),
    songTitle: document.getElementById('songTitle'),
    songArtist: document.getElementById('songArtist'),
    currentTimeStamp: document.getElementById('currentTime'),
    totalTimeStamp: document.getElementById('totalTime'),
    progressBarBg: document.getElementById('progressBarBg'),
    progressBarFill: document.getElementById('progressBarFill'),
    btnPlayPause: document.getElementById('btnPlayPause'),
    playPauseIcon: document.getElementById('playPauseIcon'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    musicVolumeSlider: document.getElementById('musicVolumeSlider'),
    musicVisualizer: document.getElementById('musicVisualizer'),

    // Pomodoro Timer
    timerCircle: document.getElementById('timerCircle'),
    timeText: document.getElementById('timeText'),
    presetButtons: document.querySelectorAll('.preset-btn'),
    btnTimerStart: document.getElementById('btnTimerStart'),
    btnTimerReset: document.getElementById('btnTimerReset'),

    // Checklist
    todoForm: document.getElementById('todoForm'),
    todoInput: document.getElementById('todoInput'),
    todoList: document.getElementById('todoList'),

    // Notepad
    notepadTextarea: document.getElementById('notepadTextarea'),
    chkTypingSounds: document.getElementById('chkTypingSounds'),
    charCount: document.getElementById('charCount'),
    btnDownloadNotes: document.getElementById('btnDownloadNotes'),
    btnClearNotes: document.getElementById('btnClearNotes'),

    // Modals
    infoModal: document.getElementById('infoModal'),
    btnModalClose: document.getElementById('btnModalClose'),
  };

  // Music Player audio source
  const musicAudio = new Audio();
  musicAudio.volume = getStoredNumber('vr-vol-music', 50) / 100;
  elements.musicVolumeSlider.value = musicAudio.volume * 100;

  // Web Audio Context for Chimes & Keyboard sounds
  let audioCtx = null;
  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // ==========================================
  // BACKGROUND ANIMATED RAIN ENGINE (CANVAS)
  // ==========================================
  const ctx = elements.rainCanvas.getContext('2d');
  let width = 0;
  let height = 0;
  let drops = [];
  let splashes = [];
  let animationFrameId = null;

  // Rain settings per theme
  const themeRainConfig = {
    cozy: {
      color: 'rgba(212, 163, 115, 0.25)',
      wind: -0.5,
      speedMin: 8,
      speedMax: 14,
      lengthMin: 15,
      lengthMax: 25,
    },
    library: {
      color: 'rgba(204, 164, 59, 0.2)',
      wind: 0,
      speedMin: 6,
      speedMax: 11,
      lengthMin: 12,
      lengthMax: 20,
    },
    cyber: {
      color: 'rgba(0, 240, 255, 0.45)',
      wind: -2.5,
      speedMin: 14,
      speedMax: 22,
      lengthMin: 20,
      lengthMax: 35,
    },
    forest: {
      color: 'rgba(82, 183, 136, 0.3)',
      wind: 0.5,
      speedMin: 9,
      speedMax: 16,
      lengthMin: 18,
      lengthMax: 28,
    },
  };

  function resizeCanvas() {
    width = elements.rainCanvas.width = window.innerWidth;
    height = elements.rainCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class RainDrop {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Distribute vertically at start
    }

    reset() {
      const config = themeRainConfig[state.theme];
      this.x =
        Math.random() * (width + Math.abs(config.wind) * 100) -
        (config.wind > 0 ? config.wind * 50 : 0);
      this.y = -20;
      this.speed =
        config.speedMin + Math.random() * (config.speedMax - config.speedMin);
      this.length =
        config.lengthMin +
        Math.random() * (config.lengthMax - config.lengthMin);
      this.width = 1 + Math.random() * 1.5;

      // Let intensity slightly scale the speed/length
      const intensityScale = 0.8 + state.rainIntensity * 0.15;
      this.speed *= intensityScale;
      this.length *= intensityScale;

      this.opacity = 0.2 + Math.random() * 0.5;
    }

    update() {
      const config = themeRainConfig[state.theme];
      this.y += this.speed;
      this.x += config.wind;

      // Check collision with bottom of the screen
      if (this.y >= height - 10) {
        if (Math.random() < 0.25) {
          // Spawn splash ripple
          splashes.push(new Splash(this.x, height - 5));
        }
        this.reset();
      }

      // Check offscreen left/right
      if (config.wind > 0 && this.x > width + 20) {
        this.reset();
      } else if (config.wind < 0 && this.x < -20) {
        this.reset();
      }
    }

    draw() {
      const config = themeRainConfig[state.theme];
      ctx.beginPath();
      ctx.strokeStyle = config.color;
      ctx.lineWidth = this.width;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + config.wind * 0.6, this.y + this.length);
      ctx.stroke();
    }
  }

  class Splash {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 1;
      this.maxRadius = 3 + Math.random() * 5;
      this.speed = 0.2 + Math.random() * 0.3;
      this.alpha = 0.6;
    }

    update() {
      this.radius += this.speed;
      this.alpha -= 0.025;
    }

    draw() {
      const config = themeRainConfig[state.theme];
      ctx.beginPath();
      // Draw splash ripple oval
      ctx.ellipse(
        this.x,
        this.y,
        this.radius * 2,
        this.radius * 0.6,
        0,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = config.color.replace(/[\d\.]+\)$/, `${this.alpha})`);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function getRainCount() {
    const counts = [25, 75, 200, 450]; // Drizzle, Steady, Downpour, Storm
    return counts[state.rainIntensity - 1] || 75;
  }

  function syncRainDrops() {
    const targetCount = getRainCount();
    if (drops.length < targetCount) {
      while (drops.length < targetCount) {
        drops.push(new RainDrop());
      }
    } else if (drops.length > targetCount) {
      drops = drops.slice(0, targetCount);
    }
  }

  function animateRain() {
    ctx.clearRect(0, 0, width, height);

    // Update & Draw Drops
    for (let i = 0; i < drops.length; i++) {
      drops[i].update();
      drops[i].draw();
    }

    // Update & Draw Splashes
    for (let i = splashes.length - 1; i >= 0; i--) {
      splashes[i].update();
      if (
        splashes[i].alpha <= 0 ||
        splashes[i].radius >= splashes[i].maxRadius
      ) {
        splashes.splice(i, 1);
      } else {
        splashes[i].draw();
      }
    }

    animationFrameId = requestAnimationFrame(animateRain);
  }

  // Initialize rain drops
  syncRainDrops();
  animateRain();

  // ==========================================
  // AMBIENT AUDIO MIXER ENGINE
  // ==========================================
  function createAudioElement(name, sourceUrl, initialVolume, isMuted) {
    const audio = new Audio(sourceUrl);
    audio.loop = true;
    audio.volume = isMuted ? 0 : initialVolume / 100;

    // Preload audio and catch error if blocked
    audio.addEventListener('error', (e) => {
      console.warn(`Failed to load ambient sound: ${name}`, e);
    });

    return audio;
  }

  function initAmbientAudio() {
    initAudioContext();

    for (const [key, sound] of Object.entries(ambientSounds)) {
      if (!sound.el) {
        sound.el = createAudioElement(
          key,
          sound.url,
          sound.volume,
          sound.muted
        );
      }

      // Attempt play on user activity
      if (sound.volume > 0 && !sound.muted && !state.isMutedAll) {
        playAudioPromise(sound.el);
      }
    }

    // Start periodic thunder logic if thunder is active
    startThunderScheduler();
  }

  function playAudioPromise(audioElement) {
    if (!audioElement) return;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Autoplay policy prevented playback, wait for interaction
        console.log('Playback delayed until user interaction.');
      });
    }
  }

  // Periodically trigger thunder storm sounds + lightning flash
  let thunderTimeout = null;
  function startThunderScheduler() {
    if (thunderTimeout) clearTimeout(thunderTimeout);

    const checkThunder = () => {
      const thunderConfig = ambientSounds.thunder;

      // If thunder is active and has volume, schedule a crack
      if (
        thunderConfig.el &&
        thunderConfig.volume > 0 &&
        !thunderConfig.muted &&
        !state.isMutedAll
      ) {
        // Trigger a random rumble between 15 and 45 seconds
        const delay = 15000 + Math.random() * 30000;

        thunderTimeout = setTimeout(() => {
          // Play thunder sound (custom volume overlay)
          const soundVal = thunderConfig.volume / 100;
          thunderConfig.el.volume = soundVal * (0.5 + Math.random() * 0.5); // Random volume variation
          playAudioPromise(thunderConfig.el);

          // Lightning Flash Visual FX!
          triggerLightningFlash();

          // Re-schedule next thunder
          checkThunder();
        }, delay);
      } else {
        // Check again in 5 seconds
        thunderTimeout = setTimeout(checkThunder, 5000);
      }
    };

    checkThunder();
  }

  function triggerLightningFlash() {
    // Flash background canvas glow or dimmer overlay opacity briefly
    const initialOverlayOpacity = state.isDimmed ? 0.75 : 0;

    // Flash 1
    elements.dimOverlay.style.transition = 'opacity 0.05s ease';
    elements.dimOverlay.style.background = '#e6f8ff';
    elements.dimOverlay.style.opacity = '0.45';

    setTimeout(() => {
      elements.dimOverlay.style.opacity = initialOverlayOpacity.toString();
      elements.dimOverlay.style.background = '#000';

      // Double flash sometimes
      if (Math.random() > 0.4) {
        setTimeout(() => {
          elements.dimOverlay.style.opacity = '0.35';
          elements.dimOverlay.style.background = '#ffffff';
          setTimeout(() => {
            elements.dimOverlay.style.transition = 'opacity 0.8s ease';
            elements.dimOverlay.style.opacity =
              initialOverlayOpacity.toString();
            elements.dimOverlay.style.background = '#000';
          }, 60);
        }, 120);
      } else {
        elements.dimOverlay.style.transition = 'opacity 0.8s ease';
      }
    }, 80);
  }

  // Set up mixer UI control elements
  elements.mixerItems.forEach((item) => {
    const soundKey = item.dataset.sound;
    const sound = ambientSounds[soundKey];
    const slider = item.querySelector('.volume-slider');
    const muteBtn = item.querySelector('.btn-mixer-mute');

    // Init UI from initial config state
    slider.value = sound.volume;
    if (sound.volume === 0 || sound.muted) {
      muteBtn.classList.add('muted');
      muteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>`;
    }

    // Slider change handler
    slider.addEventListener('input', (e) => {
      initAmbientAudio(); // Ensure contexts are initialized on user interaction
      const val = parseInt(e.target.value);
      sound.volume = val;
      localStorage.setItem(`vr-vol-${soundKey}`, val.toString());

      if (val > 0) {
        sound.muted = false;
        muteBtn.classList.remove('muted');
        muteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;

        if (sound.el) {
          sound.el.volume = val / 100;
          if (sound.el.paused) playAudioPromise(sound.el);
        }
      } else {
        sound.muted = true;
        muteBtn.classList.add('muted');
        muteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>`;
        if (sound.el) sound.el.volume = 0;
      }
    });

    // Mute toggle handler
    muteBtn.addEventListener('click', () => {
      initAmbientAudio();
      sound.muted = !sound.muted;

      if (sound.muted) {
        muteBtn.classList.add('muted');
        muteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>`;
        if (sound.el) sound.el.volume = 0;
      } else {
        muteBtn.classList.remove('muted');
        muteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;

        // If volume slider was 0, bump it to 40 so they hear it
        if (sound.volume === 0) {
          sound.volume = 40;
          slider.value = 40;
          localStorage.setItem(`vr-vol-${soundKey}`, '40');
        }

        if (sound.el) {
          sound.el.volume = sound.volume / 100;
          playAudioPromise(sound.el);
        }
      }
    });
  });

  // Global Mute Toggle button (Header)
  elements.btnMuteAll.addEventListener('click', () => {
    initAmbientAudio();
    state.isMutedAll = !state.isMutedAll;

    if (state.isMutedAll) {
      elements.btnMuteAll.classList.add('muted-active');
      elements.btnMuteAll.style.color = '#ef4444';
      elements.muteIcon.innerHTML = `<line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>`;

      // Set all ambient sound volumes to 0 in DOM audio nodes
      for (const sound of Object.values(ambientSounds)) {
        if (sound.el) sound.el.volume = 0;
      }
      // Also pause the music player
      if (state.isPlayingMusic) {
        toggleMusicPlayback();
      }
    } else {
      elements.btnMuteAll.classList.remove('muted-active');
      elements.btnMuteAll.style.color = '';
      elements.muteIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;

      // Restore ambient sound volumes
      for (const sound of Object.values(ambientSounds)) {
        if (sound.el && !sound.muted) {
          sound.el.volume = sound.volume / 100;
          playAudioPromise(sound.el);
        }
      }
    }
  });

  // ==========================================
  // LO-FI MUSIC PLAYER CONTROLS
  // ==========================================
  function loadTrack(index) {
    state.currentTrackIndex = index;
    const track = musicPlaylist[index];

    musicAudio.src = track.url;
    elements.songTitle.textContent = track.title;
    elements.songArtist.textContent = track.artist;

    // Reset seek progress display
    elements.progressBarFill.style.width = '0%';
    elements.currentTimeStamp.textContent = '0:00';
    elements.totalTimeStamp.textContent = '0:00';

    // Pre-load metadata to fetch duration
    musicAudio.load();
  }

  // Load first track on startup
  loadTrack(state.currentTrackIndex);

  function toggleMusicPlayback() {
    initAudioContext();
    initAmbientAudio(); // Ensure ambient audios are primed

    if (state.isMutedAll && !state.isPlayingMusic) {
      // If globally muted, disable mute all first
      elements.btnMuteAll.click();
    }

    if (state.isPlayingMusic) {
      musicAudio.pause();
      state.isPlayingMusic = false;
      elements.vinylDisc.classList.remove('playing');
      elements.musicVisualizer.classList.remove('active');
      elements.playPauseIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    } else {
      playAudioPromise(musicAudio);
      state.isPlayingMusic = true;
      elements.vinylDisc.classList.add('playing');
      elements.musicVisualizer.classList.add('active');
      elements.playPauseIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
    }
  }

  // Play/Pause button
  elements.btnPlayPause.addEventListener('click', toggleMusicPlayback);

  // Next Track
  elements.btnNext.addEventListener('click', () => {
    let nextIndex = state.currentTrackIndex + 1;
    if (nextIndex >= musicPlaylist.length) nextIndex = 0;

    loadTrack(nextIndex);
    if (state.isPlayingMusic) {
      playAudioPromise(musicAudio);
    } else {
      toggleMusicPlayback();
    }
  });

  // Previous Track
  elements.btnPrev.addEventListener('click', () => {
    let prevIndex = state.currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = musicPlaylist.length - 1;

    loadTrack(prevIndex);
    if (state.isPlayingMusic) {
      playAudioPromise(musicAudio);
    } else {
      toggleMusicPlayback();
    }
  });

  // Music Volume Slider
  elements.musicVolumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) / 100;
    musicAudio.volume = val;
    localStorage.setItem('vr-vol-music', e.target.value);
  });

  // Update Progress Bar & Time stamps
  musicAudio.addEventListener('timeupdate', () => {
    if (!isNaN(musicAudio.duration)) {
      const progress = (musicAudio.currentTime / musicAudio.duration) * 100;
      elements.progressBarFill.style.width = `${progress}%`;

      elements.currentTimeStamp.textContent = formatTime(
        musicAudio.currentTime
      );
      elements.totalTimeStamp.textContent = formatTime(musicAudio.duration);
    }
  });

  // Format seconds to MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Auto skip when track ends
  musicAudio.addEventListener('ended', () => {
    elements.btnNext.click();
  });

  // Click on progress bar to seek
  elements.progressBarBg.addEventListener('click', (e) => {
    if (!isNaN(musicAudio.duration)) {
      const rect = elements.progressBarBg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;

      musicAudio.currentTime = percentage * musicAudio.duration;
    }
  });

  // ==========================================
  // POMODORO TIMER SYSTEM
  // ==========================================
  const totalCircumference = 2 * Math.PI * 80; // r = 80
  elements.timerCircle.style.strokeDasharray = totalCircumference;
  elements.timerCircle.style.strokeDashoffset = 0;

  function updateTimerRing(percent) {
    const offset = totalCircumference - percent * totalCircumference;
    elements.timerCircle.style.strokeDashoffset = offset;
  }

  function renderTimerDisplay() {
    const mins = Math.floor(state.timerRemaining / 60);
    const secs = state.timerRemaining % 60;
    elements.timeText.textContent = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const progress = state.timerRemaining / state.timerDuration;
    updateTimerRing(progress);
  }

  function startTimer() {
    initAudioContext();
    if (state.timerState === 'running') return;

    state.timerState = 'running';
    elements.btnTimerStart.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg><span>Pause</span>`;

    state.timerInterval = setInterval(() => {
      state.timerRemaining--;
      renderTimerDisplay();

      if (state.timerRemaining <= 0) {
        clearInterval(state.timerInterval);
        state.timerState = 'stopped';
        elements.btnTimerStart.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Start</span>`;

        // Timer Alarm Bell Synthesized via Web Audio!
        playAlarmBell();

        // Auto reset to default duration
        state.timerRemaining = state.timerDuration;
        renderTimerDisplay();

        alert(
          `${state.timerType === 'focus' ? 'Focus session completed! Time for a warm beverage sip.' : 'Break completed! Ready to brew some productivity?'}`
        );
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(state.timerInterval);
    state.timerState = 'paused';
    elements.btnTimerStart.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Resume</span>`;
  }

  // Synthesize a beautiful double-chime alarm sound
  function playAlarmBell() {
    if (!audioCtx) initAudioContext();

    const now = audioCtx.currentTime;

    // First tone (E5 - 659.25 Hz)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.type = 'sine';
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    // Second tone (G5 - 783.99 Hz) triggered slightly later
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.frequency.setValueAtTime(783.99, now + 0.25);
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0, now + 0.25);
    gain2.gain.linearRampToValueAtTime(0.15, now + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 1.3);
    osc2.start(now + 0.25);
    osc2.stop(now + 1.6);
  }

  elements.btnTimerStart.addEventListener('click', () => {
    if (state.timerState === 'running') {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  elements.btnTimerReset.addEventListener('click', () => {
    clearInterval(state.timerInterval);
    state.timerState = 'stopped';
    state.timerRemaining = state.timerDuration;
    elements.btnTimerStart.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Start</span>`;
    renderTimerDisplay();
  });

  // Preset Buttons Focus, Short break, Long break
  elements.presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      elements.presetButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const duration = parseInt(btn.dataset.duration);
      state.timerType = btn.dataset.type;
      state.timerDuration = duration;
      state.timerRemaining = duration;

      // Reset running timers
      clearInterval(state.timerInterval);
      state.timerState = 'stopped';
      elements.btnTimerStart.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Start</span>`;

      renderTimerDisplay();
    });
  });

  // Initialize display
  renderTimerDisplay();

  // ==========================================
  // CAFE ORDERS CHECKLIST (TODO LIST)
  // ==========================================
  function renderTodos() {
    elements.todoList.innerHTML = '';

    state.todos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
        <div class="todo-item-content">
          <input type="checkbox" ${todo.completed ? 'checked' : ''}>
          <span class="todo-text">${escapeHTML(todo.text)}</span>
        </div>
        <button class="btn-todo-del" title="Delete Task" aria-label="Delete">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
        </button>
      `;

      // Checkbox click event
      li.querySelector('input').addEventListener('change', (e) => {
        todo.completed = e.target.checked;
        li.classList.toggle('completed', todo.completed);
        saveTodos();
      });

      // Item text click triggers toggle
      li.querySelector('.todo-text').addEventListener('click', () => {
        const checkbox = li.querySelector('input');
        checkbox.checked = !checkbox.checked;
        todo.completed = checkbox.checked;
        li.classList.toggle('completed', todo.completed);
        saveTodos();
      });

      // Delete button click
      li.querySelector('.btn-todo-del').addEventListener('click', () => {
        state.todos = state.todos.filter((t) => t.id !== todo.id);
        li.style.animation = 'fadeIn 0.2s reverse forwards';
        setTimeout(() => {
          renderTodos();
          saveTodos();
        }, 200);
      });

      elements.todoList.appendChild(li);
    });
  }

  function saveTodos() {
    localStorage.setItem('vr-todos', JSON.stringify(state.todos));
  }

  function escapeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;',
        })[tag] || tag
    );
  }

  elements.todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = elements.todoInput.value.trim();
    if (!text) return;

    state.todos.push({
      id: Date.now(),
      text: text,
      completed: false,
    });

    elements.todoInput.value = '';
    renderTodos();
    saveTodos();
  });

  // Initial render
  renderTodos();

  // ==========================================
  // COZY NOTEPAD & TYPING SOUND SYNTHESIS
  // ==========================================
  elements.notepadTextarea.value = state.notepadContent;
  elements.charCount.textContent = `${state.notepadContent.length} characters`;
  elements.chkTypingSounds.checked = state.keyboardSoundsEnabled;

  // Mechanical Keyboard Click Synthesizer! (Low thud + switch click)
  function playTypingClick() {
    if (!state.keyboardSoundsEnabled) return;
    if (!audioCtx) initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;

    // 1. Switch click (high frequency chirp)
    const oscClick = audioCtx.createOscillator();
    const gainClick = audioCtx.createGain();

    // randomize key click frequency slightly for mechanical switch realism
    const clickFreq = 2200 + Math.random() * 800;
    oscClick.type = 'sine';
    oscClick.frequency.setValueAtTime(clickFreq, now);

    gainClick.connect(audioCtx.destination);
    oscClick.connect(gainClick);

    gainClick.gain.setValueAtTime(0.015, now);
    gainClick.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

    // 2. Plastic bottoming out key sound (lower frequency thud)
    const oscThud = audioCtx.createOscillator();
    const gainThud = audioCtx.createGain();

    const thudFreq = 120 + Math.random() * 45;
    oscThud.type = 'triangle';
    oscThud.frequency.setValueAtTime(thudFreq, now);

    gainThud.connect(audioCtx.destination);
    oscThud.connect(gainThud);

    gainThud.gain.setValueAtTime(0.06, now);
    gainThud.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    oscClick.start(now);
    oscClick.stop(now + 0.02);
    oscThud.start(now);
    oscThud.stop(now + 0.04);
  }

  // Hook notepad typing events
  elements.notepadTextarea.addEventListener('input', (e) => {
    // Play mechanical click
    playTypingClick();

    // Update character count
    const content = elements.notepadTextarea.value;
    state.notepadContent = content;
    elements.charCount.textContent = `${content.length} characters`;

    // Autosave
    localStorage.setItem('vr-notepad', content);
  });

  // Sound toggle checkbox
  elements.chkTypingSounds.addEventListener('change', (e) => {
    state.keyboardSoundsEnabled = e.target.checked;
    localStorage.setItem('vr-kbd-sounds', e.target.checked.toString());
  });

  // Download Notes Button
  elements.btnDownloadNotes.addEventListener('click', () => {
    const text = elements.notepadTextarea.value;
    if (!text.trim()) {
      alert('Your notepad is empty. Write something before downloading!');
      return;
    }

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Virtual-Rain-Cafe-Notes-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Clear notes button
  elements.btnClearNotes.addEventListener('click', () => {
    if (
      confirm(
        'Are you sure you want to clear your notes? This cannot be undone.'
      )
    ) {
      elements.notepadTextarea.value = '';
      state.notepadContent = '';
      elements.charCount.textContent = '0 characters';
      localStorage.setItem('vr-notepad', '');
    }
  });

  // ==========================================
  // ATMOSPHERE & THEME CONTROLLER
  // ==========================================
  function applyTheme(themeName) {
    // Remove old themes
    elements.body.classList.remove(
      'theme-cozy',
      'theme-library',
      'theme-cyber',
      'theme-forest'
    );
    elements.body.classList.add(`theme-${themeName}`);

    state.theme = themeName;
    localStorage.setItem('vr-theme', themeName);

    // Update active class in button UI
    elements.themeButtons.forEach((btn) => {
      if (btn.dataset.theme === themeName) {
        btn.classList.add('active');
        const accent = btn.style.getPropertyValue('--accent');
        elements.body.style.setProperty('--accent-color', accent);
      } else {
        btn.classList.remove('active');
      }
    });

    // Match weather status text
    const statusLabels = {
      cozy: 'Drizzling Coffeehouse',
      library: 'Midnight Library Rain',
      cyber: 'Neon Street Downpour',
      forest: 'Misty Mountain Canopy',
    };
    elements.weatherStatusText.textContent =
      statusLabels[themeName] || 'Cozy Rain';

    // Set theme custom rain parameters
    syncRainDrops();
  }

  // Hook Theme selection buttons
  elements.themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      initAmbientAudio();
      applyTheme(btn.dataset.theme);
    });
  });

  // Set initial theme on startup
  applyTheme(state.theme);

  // Rain intensity slider
  elements.sliderRainIntensity.value = state.rainIntensity;
  const intensityMap = [
    'Light Drizzle',
    'Steady Rainfall',
    'Heavy Downpour',
    'Thunderstorm',
  ];
  elements.rainIntensityLabel.textContent =
    intensityMap[state.rainIntensity - 1] || 'Steady Rainfall';

  elements.sliderRainIntensity.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.rainIntensity = val;
    localStorage.setItem('vr-rain-intensity', val.toString());
    elements.rainIntensityLabel.textContent =
      intensityMap[val - 1] || 'Steady Rainfall';

    // Reconfigure drops count
    syncRainDrops();

    // Adjust rain sound volume automatically with intensity
    if (ambientSounds.rain.el && !ambientSounds.rain.muted) {
      // Drizzle: lower rain volume, Storm: higher rain volume
      const baseVol = ambientSounds.rain.volume;
      const factor = [0.5, 0.8, 1.0, 1.25][val - 1] || 1.0;
      const newVol = Math.min(100, Math.round(baseVol * factor));
      ambientSounds.rain.el.volume = newVol / 100;
    }
  });

  // ==========================================
  // DIMMING & UI TOGGLE QUICK ACTIONS
  // ==========================================
  elements.btnDim.addEventListener('click', () => {
    state.isDimmed = !state.isDimmed;
    if (state.isDimmed) {
      elements.btnDim.style.color = 'var(--accent-color)';
      elements.dimOverlay.style.opacity = '0.75';
      elements.dimOverlay.style.pointerEvents = 'none'; // allow clicks through
    } else {
      elements.btnDim.style.color = '';
      elements.dimOverlay.style.opacity = '0';
    }
  });

  // Hide UI Panel Dashboard
  elements.btnHideUI.addEventListener('click', () => {
    elements.appContainer.classList.add('ui-hidden');
    elements.btnRestoreUI.classList.add('visible');
  });

  elements.btnRestoreUI.addEventListener('click', () => {
    elements.appContainer.classList.remove('ui-hidden');
    elements.btnRestoreUI.classList.remove('visible');
  });

  document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' &&
      elements.appContainer.classList.contains('ui-hidden')) {

    elements.appContainer.classList.remove('ui-hidden');
    elements.btnRestoreUI.classList.remove('visible');
  }
});
  // Double click anywhere on screen restores UI
  window.addEventListener('dblclick', (e) => {
    // Prevent double clicking textareas or inputs triggering this
    if (
      e.target.tagName !== 'TEXTAREA' &&
      e.target.tagName !== 'INPUT' &&
      e.target.tagName !== 'BUTTON'
    ) {
      elements.appContainer.classList.remove('ui-hidden');
    }
  });

  // ==========================================
  // HELP & ABOUT MODAL
  // ==========================================
  elements.btnInfo.addEventListener('click', () => {
    elements.infoModal.classList.add('active');
  });

  elements.btnModalClose.addEventListener('click', () => {
    elements.infoModal.classList.remove('active');
  });

  // Close modal when clicking backdrop
  elements.infoModal.addEventListener('click', (e) => {
    if (e.target === elements.infoModal) {
      elements.infoModal.classList.remove('active');
    }
  });

  // Prime audio contexts on any first click
  window.addEventListener(
    'click',
    () => {
      initAudioContext();
    },
    { once: true }
  );
});

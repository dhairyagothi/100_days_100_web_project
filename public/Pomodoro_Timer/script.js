// ─── Settings ────────────────────────────────────────────────────────────────
let settings = loadSettings();
function defaultSettings() {
    return { pomoDur:25, shortDur:5, longDur:15, longAfter:4, autoBreak:true, autoPomo:false, tickSound:true, strictMode:false, musicTrack:'none', musicVolume:0.4 };
}
function loadSettings() {
    try { const s = JSON.parse(localStorage.getItem('pomodoroSettings')); return s ? { ...defaultSettings(), ...s } : defaultSettings(); }
    catch { return defaultSettings(); }
}
function saveSettingsToStorage() {
    try { localStorage.setItem('pomodoroSettings', JSON.stringify(settings)); } catch(e) { console.warn('Storage full:', e); }
}

// ─── State ────────────────────────────────────────────────────────────────────
let pomodoroTime   = settings.pomoDur  * 60;
let shortBreakTime = settings.shortDur * 60;
let longBreakTime  = settings.longDur  * 60;
let time = pomodoroTime, totalTime = pomodoroTime || 1;
let timerInterval = null, isRunning = false;
let sessionStartTime = null; // for drift correction
let sessionStartRemaining = null;
let currentMode = 'pomodoro', pomosCompleted = 0, activeTaskId = null;

// ─── Tasks ────────────────────────────────────────────────────────────────────
let tasks = loadTasks();
function loadTasks() { try { return JSON.parse(localStorage.getItem('pomodoroTasks')) || []; } catch { return []; } }
function saveTasks() { try { localStorage.setItem('pomodoroTasks', JSON.stringify(tasks)); } catch(e) { console.warn('Storage full:', e); } }
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const timerDisplay    = document.getElementById('timer');
const startBtn        = document.getElementById('startBtn');
const resetBtn        = document.getElementById('resetBtn');
const skipBtn         = document.getElementById('skipBtn');
const muteBtn         = document.getElementById('muteBtn');
const pomodoroBtn     = document.getElementById('pomodoroBtn');
const shortBreakBtn   = document.getElementById('shortBreakBtn');
const longBreakBtn    = document.getElementById('longBreakBtn');
const sessionLabel    = document.getElementById('sessionLabel');
const currentTaskDisp = document.getElementById('currentTaskDisplay');
const taskList        = document.getElementById('taskList');
const addTaskBtn      = document.getElementById('addTaskBtn');
const clearDoneBtn    = document.getElementById('clearDoneBtn');
const sessionDots     = document.getElementById('sessionDots');
const progressRing    = document.getElementById('progressRing');
const toast           = document.getElementById('toast');
const statsTotal      = document.getElementById('statsTotal');
const statsToday      = document.getElementById('statsToday');
const statsStreak     = document.getElementById('statsStreak');
const strictBadge     = document.getElementById('strictBadge');
const nowPlaying      = document.getElementById('nowPlaying');
const nowPlayingLabel = document.getElementById('nowPlayingLabel');
const weeklyChart     = document.getElementById('weeklyChart');
const themeColorMeta  = document.getElementById('themeColorMeta');

const settingsBtn     = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettings   = document.getElementById('closeSettings');
const saveSettingsBtn = document.getElementById('saveSettings');
const autoBreakToggle = document.getElementById('autoBreakToggle');
const autoPomoToggle  = document.getElementById('autoPomoToggle');
const tickToggle      = document.getElementById('tickToggle');
const strictToggle    = document.getElementById('strictToggle');
const addTaskOverlay  = document.getElementById('addTaskOverlay');
const closeAddTask    = document.getElementById('closeAddTask');
const cancelAddTask   = document.getElementById('cancelAddTask');
const confirmAddTask  = document.getElementById('confirmAddTask');
const taskNameInput   = document.getElementById('taskNameInput');
const taskPomoInput   = document.getElementById('taskPomoInput');
const musicHeaderBtn  = document.getElementById('musicHeaderBtn');
const musicDropdown   = document.getElementById('musicDropdown');
const musicOffBtn     = document.getElementById('musicOffBtn');
const musicVolSlider  = document.getElementById('musicVol');

// ─── Web Audio context ────────────────────────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let isMuted  = !settings.tickSound;

function getAudioCtx() {
    if (!audioCtx || audioCtx.state === 'closed') audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

// ─── Tick sound ───────────────────────────────────────────────────────────────
let tickTimeouts = [];
function scheduleTick() {
    stopTick();
    if (isMuted || !isRunning || currentTrackId !== 'none') return;
    _playTick();
    const id = setTimeout(scheduleTick, 1000);
    tickTimeouts.push(id);
}
function stopTick() {
    if (!tickTimeouts.length) return;
    tickTimeouts.forEach(clearTimeout);
    tickTimeouts = [];
}
function _playTick() {
    if (isMuted) return;
    try {
        const ctx = getAudioCtx();
        const len = Math.floor(ctx.sampleRate * 0.012);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d   = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 6);
        const src = ctx.createBufferSource(), gain = ctx.createGain();
        src.buffer = buf; gain.gain.value = 0.55;
        src.connect(gain); gain.connect(ctx.destination); src.start();
    } catch(e) {}
}

function playSessionEndSound() {
    stopTick();
    try {
        const ctx = getAudioCtx();
        [[660,0],[880,0.25],[1100,0.5],[880,0.8]].forEach(([f,d]) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = 'sine'; o.frequency.value = f;
            const t = ctx.currentTime + d;
            g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.3);
            o.start(t); o.stop(t+0.3);
        });
    } catch(e) {}
}

function updateMuteBtn() {
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', isMuted ? 'Unmute tick sound' : 'Mute tick sound');
    muteBtn.title = isMuted ? 'Unmute tick' : 'Mute tick';
    if (isMuted) stopTick();
    else if (isRunning && currentTrackId === 'none') scheduleTick();
}
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted; settings.tickSound = !isMuted;
    saveSettingsToStorage(); updateMuteBtn();
});

// ─── Focus Music — improved Web Audio synthesis ───────────────────────────────
const FOCUS_TRACKS = [
    { id:'lofi',      emoji:'🎵', label:'Lo-fi Beats',           desc:'Warm chord pad with tremolo · relaxed focus' },
    { id:'deepfocus', emoji:'✴️',  label:'Deep Focus Drone',      desc:'Sub-bass + LFO sweep · deep concentration' },
    { id:'rainfocus', emoji:'🌧',  label:'Rain Ambience',         desc:'5-layer bandpass rain + hum · calm flow' },
    { id:'cafejazz',  emoji:'☕',  label:'Cafe Jazz',              desc:'Walking bass + chord pad · energised focus' },
];
const SCIENCE_TRACKS = [
    { id:'white',     emoji:'⬜', label:'White Noise',            desc:'Flat spectrum · masks all distractions' },
    { id:'brown',     emoji:'🟤', label:'Brown Noise',            desc:'Deep warm rumble · sustained attention (Söderlund et al.)' },
    { id:'pink',      emoji:'🟧', label:'Pink Noise',             desc:'True 1/f spectrum · memory consolidation (Scullin et al.)' },
    { id:'binaural',  emoji:'🎯', label:'Binaural 40 Hz Gamma',   desc:'200L/240R Hz · working memory — wear headphones' },
    { id:'birdsong',  emoji:'🐦', label:'Alpha Binaural + Nature',desc:'8 Hz alpha beat + rain + bird calls · stress reduction' },
];
const BINAURAL_IDS = new Set(['binaural', 'birdsong']);

let musicNodes     = [];
let currentTrackId = 'none';
let musicVolume    = settings.musicVolume || 0.4;
let masterGainNode = null;

// Module-level timer refs so stopMusic() always clears them
let _jazzTimerRef  = null;
let _chirpTimerRef = null;

function stopMusic() {
    if (_jazzTimerRef  !== null) { clearTimeout(_jazzTimerRef);  _jazzTimerRef  = null; }
    if (_chirpTimerRef !== null) { clearTimeout(_chirpTimerRef); _chirpTimerRef = null; }
    musicNodes.forEach(n => {
        try { if (n && typeof n.stop       === 'function') n.stop();       } catch(e){}
        try { if (n && typeof n.disconnect === 'function') n.disconnect(); } catch(e){}
    });
    musicNodes = [];
    masterGainNode = null;
    currentTrackId = 'none';
    settings.musicTrack = 'none';
    saveSettingsToStorage();
    updateMusicUI();
}

function startMusic(id) {
    stopMusic();
    currentTrackId = id;
    settings.musicTrack = id;
    saveSettingsToStorage();
    const ctx = getAudioCtx();
    stopTick();

    if (BINAURAL_IDS.has(id)) {
        showToast('🎧 Wear headphones for full binaural effect', 4000);
    }

    try {
        const mg = ctx.createGain();
        mg.gain.value = musicVolume;
        mg.connect(ctx.destination);
        masterGainNode = mg;
        musicNodes.push(mg);

        // ── Lo-fi: 4-voice C-major triangle chord with slow tremolo ─────────────
        if (id === 'lofi') {
            const freqs = [130.81, 164.81, 196.00, 246.94]; // C3 E3 G3 B3
            freqs.forEach((f, i) => {
                const osc=ctx.createOscillator(), mod=ctx.createOscillator();
                const mGain=ctx.createGain(), oGain=ctx.createGain();
                osc.type='triangle'; osc.frequency.value=f; osc.detune.value=(i%2===0?3:-3);
                mod.type='sine'; mod.frequency.value=0.07+i*0.025;
                mGain.gain.value=0.28; oGain.gain.value=0.16;
                mod.connect(mGain); mGain.connect(oGain.gain);
                osc.connect(oGain); oGain.connect(mg);
                osc.start(); mod.start();
                musicNodes.push(osc,mod,mGain,oGain);
            });
        }

        // ── Deep Focus: sub bass + 2 filtered sawtooths with slow LFO sweep ─────
        else if (id === 'deepfocus') {
            [{f:55,type:'sine',filterF:180,q:2.0,vol:0.38,lfoHz:0.04,lfoD:40},
             {f:82.4,type:'sawtooth',filterF:280,q:1.8,vol:0.14,lfoHz:0.06,lfoD:70},
             {f:110,type:'sawtooth',filterF:420,q:1.5,vol:0.10,lfoHz:0.08,lfoD:100}]
            .forEach(({f,type,filterF,q,vol,lfoHz,lfoD},i) => {
                const osc=ctx.createOscillator(), filter=ctx.createBiquadFilter();
                const gain=ctx.createGain(), lfo=ctx.createOscillator(), lGain=ctx.createGain();
                osc.type=type; osc.frequency.value=f; osc.detune.value=i*5;
                filter.type='lowpass'; filter.frequency.value=filterF; filter.Q.value=q;
                lfo.type='sine'; lfo.frequency.value=lfoHz; lGain.gain.value=lfoD;
                gain.gain.value=vol;
                lfo.connect(lGain); lGain.connect(filter.frequency);
                osc.connect(filter); filter.connect(gain); gain.connect(mg);
                osc.start(); lfo.start();
                musicNodes.push(osc,filter,gain,lfo,lGain);
            });
        }

        // ── Rain: 5-layer bandpass noise with stereo panning + low hum ───────────
        else if (id === 'rainfocus') {
            [{fc:200,q:0.5,vol:0.18,pan:-0.4},{fc:500,q:0.6,vol:0.20,pan:0.3},
             {fc:900,q:0.5,vol:0.18,pan:-0.2},{fc:2000,q:0.4,vol:0.12,pan:0.5},
             {fc:5000,q:0.3,vol:0.07,pan:-0.3}]
            .forEach(({fc,q,vol,pan}) => {
                const bl=ctx.sampleRate*4, buf=ctx.createBuffer(1,bl,ctx.sampleRate);
                const d=buf.getChannelData(0);
                for(let i=0;i<bl;i++) d[i]=Math.random()*2-1;
                const src=ctx.createBufferSource(), filter=ctx.createBiquadFilter();
                const panner=ctx.createStereoPanner(), gain=ctx.createGain();
                src.buffer=buf; src.loop=true;
                filter.type='bandpass'; filter.frequency.value=fc; filter.Q.value=q;
                panner.pan.value=pan; gain.gain.value=vol;
                src.connect(filter); filter.connect(gain); gain.connect(panner); panner.connect(mg);
                src.start();
                musicNodes.push(src,filter,gain,panner);
            });
            const hum=ctx.createOscillator(), hg=ctx.createGain();
            hum.type='sine'; hum.frequency.value=72; hg.gain.value=0.06;
            hum.connect(hg); hg.connect(mg); hum.start();
            musicNodes.push(hum,hg);
        }

        // ── Cafe Jazz: walking bass with glide + warm chord pad ──────────────────
        else if (id === 'cafejazz') {
            const bassNotes=[98.0,110.0,123.5,130.8,116.5,110.0,103.8,98.0];
            let noteIdx=0;
            const bassOsc=ctx.createOscillator(), bassGain=ctx.createGain();
            bassOsc.type='triangle'; bassOsc.frequency.value=bassNotes[0]; bassGain.gain.value=0.28;
            bassOsc.connect(bassGain); bassGain.connect(mg); bassOsc.start();
            musicNodes.push(bassOsc,bassGain);
            function nextNote() {
                noteIdx=(noteIdx+1)%bassNotes.length;
                try { bassOsc.frequency.setTargetAtTime(bassNotes[noteIdx],ctx.currentTime,0.04); } catch(e){}
                _jazzTimerRef=setTimeout(nextNote,460+Math.random()*100);
            }
            nextNote();
            [261.63,329.63,392.00].forEach((f,i)=>{
                const osc=ctx.createOscillator(), mod=ctx.createOscillator();
                const mGain=ctx.createGain(), gain=ctx.createGain();
                osc.type='triangle'; osc.frequency.value=f; osc.detune.value=(i%2===0?2:-2);
                mod.type='sine'; mod.frequency.value=0.06+i*0.02; mGain.gain.value=0.06; gain.gain.value=0.09;
                mod.connect(mGain); mGain.connect(gain.gain);
                osc.connect(gain); gain.connect(mg); osc.start(); mod.start();
                musicNodes.push(osc,mod,mGain,gain);
            });
        }

        // ── White noise: stereo, gentle high-shelf cut ───────────────────────────
        else if (id === 'white') {
            const bl=ctx.sampleRate*2, b=ctx.createBuffer(2,bl,ctx.sampleRate);
            for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<bl;i++)d[i]=Math.random()*2-1;}
            const src=ctx.createBufferSource(), shelf=ctx.createBiquadFilter();
            src.buffer=b; src.loop=true;
            shelf.type='highshelf'; shelf.frequency.value=4000; shelf.gain.value=-8;
            src.connect(shelf); shelf.connect(mg); src.start();
            musicNodes.push(src,shelf);
        }

        // ── Brown noise: Brownian integration, warm low-shelf boost ─────────────
        else if (id === 'brown') {
            const bl=ctx.sampleRate*6, b=ctx.createBuffer(2,bl,ctx.sampleRate);
            for(let c=0;c<2;c++){const d=b.getChannelData(c);let last=0;
                for(let i=0;i<bl;i++){const w=Math.random()*2-1;last=(last+0.02*w)/1.02;d[i]=last*3.8;}}
            const src=ctx.createBufferSource(), shelf=ctx.createBiquadFilter();
            src.buffer=b; src.loop=true;
            shelf.type='lowshelf'; shelf.frequency.value=200; shelf.gain.value=4;
            src.connect(shelf); shelf.connect(mg); src.start();
            musicNodes.push(src,shelf);
        }

        // ── Pink noise: Voss-McCartney, stereo ───────────────────────────────────
        else if (id === 'pink') {
            const bl=ctx.sampleRate*6, b=ctx.createBuffer(2,bl,ctx.sampleRate);
            for(let c=0;c<2;c++){const d=b.getChannelData(c);
                let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
                for(let i=0;i<bl;i++){const w=Math.random()*2-1;
                    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
                    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
                    b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
                    d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
                }
            }
            const src=ctx.createBufferSource();
            src.buffer=b; src.loop=true; src.connect(mg); src.start();
            musicNodes.push(src);
        }

        // ── Binaural 40 Hz gamma: hard L/R split ─────────────────────────────────
        else if (id === 'binaural') {
            const merger=ctx.createChannelMerger(2); merger.connect(mg);
            [{f:200,ch:0},{f:240,ch:1}].forEach(({f,ch})=>{
                const osc=ctx.createOscillator(), g=ctx.createGain();
                osc.type='sine'; osc.frequency.value=f; g.gain.value=0.22;
                osc.connect(g); g.connect(merger,0,ch); osc.start();
                musicNodes.push(osc,g);
            });
            musicNodes.push(merger);
        }

        // ── Alpha binaural + rain + bird chirps ──────────────────────────────────
        else if (id === 'birdsong') {
            [{fc:600,q:0.6,vol:0.16,pan:-0.3},{fc:1800,q:0.4,vol:0.10,pan:0.3}].forEach(({fc,q,vol,pan})=>{
                const bl=ctx.sampleRate*4, buf=ctx.createBuffer(1,bl,ctx.sampleRate);
                const d=buf.getChannelData(0); for(let i=0;i<bl;i++) d[i]=Math.random()*2-1;
                const src=ctx.createBufferSource(), filter=ctx.createBiquadFilter();
                const panner=ctx.createStereoPanner(), gain=ctx.createGain();
                src.buffer=buf; src.loop=true;
                filter.type='bandpass'; filter.frequency.value=fc; filter.Q.value=q;
                panner.pan.value=pan; gain.gain.value=vol;
                src.connect(filter); filter.connect(gain); gain.connect(panner); panner.connect(mg);
                src.start(); musicNodes.push(src,filter,gain,panner);
            });
            const merger=ctx.createChannelMerger(2); merger.connect(mg);
            [{f:320,ch:0},{f:328,ch:1}].forEach(({f,ch})=>{
                const osc=ctx.createOscillator(), g=ctx.createGain();
                osc.type='sine'; osc.frequency.value=f; g.gain.value=0.16;
                osc.connect(g); g.connect(merger,0,ch); osc.start();
                musicNodes.push(osc,g);
            });
            musicNodes.push(merger);
            function chirp() {
                if (currentTrackId !== 'birdsong') return;
                try {
                    const c=getAudioCtx(), o=c.createOscillator(), g=c.createGain();
                    const baseF=2200+Math.random()*1400;
                    o.type='sine';
                    o.frequency.setValueAtTime(baseF,c.currentTime);
                    o.frequency.exponentialRampToValueAtTime(baseF*1.6,c.currentTime+0.1);
                    o.frequency.exponentialRampToValueAtTime(baseF*0.85,c.currentTime+0.22);
                    g.gain.setValueAtTime(0,c.currentTime);
                    g.gain.linearRampToValueAtTime(0.13,c.currentTime+0.04);
                    g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.22);
                    o.connect(g); g.connect(mg); o.start(); o.stop(c.currentTime+0.25);
                } catch(e){}
                _chirpTimerRef=setTimeout(chirp,1600+Math.random()*3400);
            }
            chirp();
        }

    } catch(e) { console.warn('Music synthesis error:', e); currentTrackId='none'; }
    updateMusicUI();
}

function updateMusicUI() {
    musicHeaderBtn.classList.toggle('active', currentTrackId !== 'none');
    if (currentTrackId === 'none') {
        nowPlaying.style.display = 'none';
    } else {
        const all = [...FOCUS_TRACKS, ...SCIENCE_TRACKS];
        const t = all.find(x => x.id === currentTrackId);
        nowPlayingLabel.textContent = t ? `${t.emoji} ${t.label}` : '';
        nowPlaying.style.display = 'flex';
    }
    document.querySelectorAll('.music-track-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.id === currentTrackId);
    });
    if (currentTrackId === 'none' && isRunning) scheduleTick();
}

function buildMusicDropdown() {
    [
        { tracks: FOCUS_TRACKS,   gridId: 'focusMusicGrid' },
        { tracks: SCIENCE_TRACKS, gridId: 'scienceMusicGrid' },
    ].forEach(({ tracks, gridId }) => {
        const grid = document.getElementById(gridId);
        grid.innerHTML = '';
        tracks.forEach(t => {
            const btn = document.createElement('button');
            btn.className = 'music-track-btn' + (currentTrackId === t.id ? ' active' : '');
            btn.dataset.id = t.id;
            btn.innerHTML = `<span class="mt-emoji">${t.emoji}</span><span class="mt-label">${t.label}</span><span class="mt-desc">${t.desc}</span>`;
            btn.addEventListener('click', () => {
                getAudioCtx();
                if (currentTrackId === t.id) { stopMusic(); showToast('⏹ Music off'); }
                else { startMusic(t.id); showToast(`▶ ${t.emoji} ${t.label}`); }
            });
            grid.appendChild(btn);
        });
    });
}

musicHeaderBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = musicDropdown.classList.toggle('open');
    musicHeaderBtn.classList.toggle('open', open);
    if (open) buildMusicDropdown();
});
document.addEventListener('click', e => {
    if (!musicDropdown.contains(e.target) && e.target !== musicHeaderBtn) {
        musicDropdown.classList.remove('open');
        musicHeaderBtn.classList.remove('open');
    }
});
musicOffBtn.addEventListener('click', () => { stopMusic(); showToast('⏹ Music off'); });
musicVolSlider.addEventListener('input', e => {
    musicVolume = parseFloat(e.target.value);
    settings.musicVolume = musicVolume;
    saveSettingsToStorage();
    if (masterGainNode) masterGainNode.gain.value = musicVolume;
});

// ─── Strict Mode ──────────────────────────────────────────────────────────────
function applyStrictMode(on) {
    strictBadge.style.display = on ? 'inline-flex' : 'none';
    if (on && isRunning && currentMode === 'pomodoro') {
        skipBtn.disabled = true; skipBtn.title = '🔒 Strict mode';
    } else {
        skipBtn.disabled = false; skipBtn.title = 'Skip (S)';
    }
}

// ─── Theme colors ─────────────────────────────────────────────────────────────
const modeColors = {
    pomodoro: { bg:'#ba4949', ring:'#ff6b6b' },
    short:    { bg:'#38858a', ring:'#4ecdc4' },
    long:     { bg:'#397097', ring:'#74b9ff' }
};

// ─── Display ──────────────────────────────────────────────────────────────────
function updateDisplay() {
    const m = Math.floor(time / 60), s = time % 60;
    const str = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    timerDisplay.textContent = str;
    document.title = `${str} — ${currentMode === 'pomodoro' ? '🍅 Focus' : '☕ Break'}`;
    const safeTotal = totalTime > 0 ? totalTime : 1;
    progressRing.style.strokeDashoffset = 628.3 * (1 - time / safeTotal);
}
function updateSessionDots(animate=false) {
    if (animate) {
        // Flash clear animation before re-rendering
        document.querySelectorAll('.dot.filled').forEach(d => d.classList.add('clearing'));
        setTimeout(() => renderDots(), 300);
    } else {
        renderDots();
    }
}
function renderDots() {
    sessionDots.innerHTML = '';
    for (let i = 0; i < settings.longAfter; i++) {
        const d = document.createElement('span');
        d.className = 'dot' + (i < pomosCompleted % settings.longAfter ? ' filled' : '');
        sessionDots.appendChild(d);
    }
}
function updateActiveTask() {
    const task = tasks.find(t => t.id === activeTaskId);
    currentTaskDisp.textContent = task ? task.name : 'No task selected';
    sessionLabel.textContent = `Session #${pomosCompleted + 1}`;
}

// ─── Stats & weekly chart ─────────────────────────────────────────────────────
function getLog() {
    try { return JSON.parse(localStorage.getItem('pomodoroLog') || '{}'); } catch { return {}; }
}
function updateStats() {
    const log = getLog();
    const today = new Date().toISOString().slice(0,10);
    const total = Object.values(log).reduce((a,b) => a+b, 0);
    statsTotal.textContent = total;
    statsToday.textContent = log[today] || 0;
    // Streak: count consecutive days ending today
    let streak = 0, d = new Date();
    while (true) {
        const key = d.toISOString().slice(0,10);
        if (log[key] && log[key] > 0) { streak++; d.setDate(d.getDate()-1); }
        else break;
    }
    statsStreak.textContent = streak;
    renderWeeklyChart(log);
}
function renderWeeklyChart(log) {
    weeklyChart.innerHTML = '';
    const DAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const today = new Date();
    const todayKey = today.toISOString().slice(0,10);
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        days.push({ key: d.toISOString().slice(0,10), label: DAY[d.getDay()] });
    }
    const counts = days.map(({ key }) => log[key] || 0);
    const maxCount = Math.max(...counts, 1);
    const maxBarH = 32; // px
    days.forEach(({ key, label }, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'wk-bar-wrap';
        const bar = document.createElement('div');
        bar.className = 'wk-bar' + (key === todayKey ? ' today' : '');
        const h = Math.round((counts[i] / maxCount) * maxBarH);
        bar.style.height = `${Math.max(h, 3)}px`;
        bar.title = `${label}: ${counts[i]} 🍅`;
        const lbl = document.createElement('div');
        lbl.className = 'wk-label' + (key === todayKey ? ' today' : '');
        lbl.textContent = key === todayKey ? 'Today' : label;
        wrap.appendChild(bar);
        wrap.appendChild(lbl);
        weeklyChart.appendChild(wrap);
    });
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimeout = null;
function showToast(msg, dur=3200) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), dur);
}

// ─── Notifications ────────────────────────────────────────────────────────────
function requestNotifPermission() { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); }
function sendNotification(title, body) { if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body, icon: '🍅' }); }

// ─── Stats logger ─────────────────────────────────────────────────────────────
function logPomodoro() {
    const key = new Date().toISOString().slice(0,10);
    const log = getLog();
    log[key] = (log[key] || 0) + 1;
    try { localStorage.setItem('pomodoroLog', JSON.stringify(log)); } catch(e) { console.warn('Storage full:', e); }
    updateStats();
}

// ─── Mode switching ───────────────────────────────────────────────────────────
function changeMode(mode, autoStart=false) {
    if (isRunning && !autoStart) {
        if (settings.strictMode && currentMode === 'pomodoro') { showToast('🔒 Strict mode — finish your session first!'); return; }
        if (!confirm('Timer is running. Switch anyway?')) return;
    }
    if (isRunning) pauseTimer();
    currentMode = mode;
    [pomodoroBtn, shortBreakBtn, longBreakBtn].forEach(b => b.classList.remove('active'));
    if (mode === 'pomodoro')   { time = totalTime = pomodoroTime;   pomodoroBtn.classList.add('active'); }
    else if (mode === 'short') { time = totalTime = shortBreakTime; shortBreakBtn.classList.add('active'); }
    else                       { time = totalTime = longBreakTime;  longBreakBtn.classList.add('active'); }
    const c = modeColors[mode] || modeColors.pomodoro;
    document.documentElement.style.setProperty('--bg-color',  c.bg);
    document.documentElement.style.setProperty('--ring-color', c.ring);
    document.documentElement.style.setProperty('--btn-text',   c.bg);
    if (themeColorMeta) themeColorMeta.setAttribute('content', c.bg);
    updateDisplay();
    applyStrictMode(settings.strictMode);
    if (autoStart) startTimer();
}
pomodoroBtn.addEventListener('click',   () => changeMode('pomodoro'));
shortBreakBtn.addEventListener('click', () => changeMode('short'));
longBreakBtn.addEventListener('click',  () => changeMode('long'));

// ─── Accurate timer (Date.now anchored, drift-free) ───────────────────────────
function startTimer() {
    if (isRunning) {
        if (settings.strictMode && currentMode === 'pomodoro') { showToast('🔒 Strict mode — you cannot pause during focus!'); return; }
        pauseTimer();
        return;
    }
    getAudioCtx(); requestNotifPermission();
    isRunning = true;
    sessionStartTime = Date.now();
    sessionStartRemaining = time;
    startBtn.textContent = (settings.strictMode && currentMode === 'pomodoro') ? 'FOCUS 🔒' : 'PAUSE';
    startBtn.classList.add('running');
    if (currentTrackId === 'none') scheduleTick();
    applyStrictMode(settings.strictMode);
    timerInterval = setInterval(() => {
        // Drift-free: calculate actual elapsed seconds from wall clock
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        time = Math.max(0, sessionStartRemaining - elapsed);
        updateDisplay();
        if (time === 0) onSessionComplete();
    }, 500); // poll every 500ms for responsiveness, time is wall-clock derived
}
function pauseTimer() {
    clearInterval(timerInterval); stopTick();
    isRunning = false; sessionStartTime = null; sessionStartRemaining = null;
    startBtn.textContent = 'START'; startBtn.classList.remove('running');
    skipBtn.disabled = false;
}
function resetTimer() {
    if (settings.strictMode && isRunning && currentMode === 'pomodoro') { showToast('🔒 Strict mode — finish your session first!'); return; }
    pauseTimer();
    time = totalTime > 0 ? totalTime : pomodoroTime;
    updateDisplay();
}
function skipSession() {
    if (settings.strictMode && isRunning && currentMode === 'pomodoro') { showToast('🔒 Strict mode — no skipping!'); return; }
    pauseTimer();
    onSessionComplete(true);
}
function onSessionComplete(skipped=false) {
    pauseTimer(); playSessionEndSound();
    if (currentMode === 'pomodoro') {
        pomosCompleted++; logPomodoro();
        // Only increment done on the active task if it's not completed
        const task = tasks.find(t => t.id === activeTaskId && !t.completed);
        if (task) { task.done = (task.done || 0) + 1; saveTasks(); renderTasks(); }
        const isLong = pomosCompleted % settings.longAfter === 0;
        // Animate dot clear when a long-break cycle completes
        updateSessionDots(isLong);
        updateActiveTask();
        showToast(skipped ? '⏭ Skipped! Break time.' : `🍅 Pomodoro ${pomosCompleted} done! ${isLong ? 'Long break!' : 'Short break!'}`);
        sendNotification('Pomodoro Complete! 🍅', isLong ? 'Long break time!' : 'Short break time!');
        changeMode(isLong ? 'long' : 'short', settings.autoBreak);
    } else {
        showToast(skipped ? '⏭ Break skipped. Focus time!' : "☕ Break over! Let's focus.");
        sendNotification('Break Over! ☕', 'Time to focus.');
        changeMode('pomodoro', settings.autoPomo);
    }
}
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
skipBtn.addEventListener('click',  skipSession);

// ─── Page visibility — recalculate elapsed on tab restore ─────────────────────
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isRunning && sessionStartTime !== null) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        time = Math.max(0, sessionStartRemaining - elapsed);
        updateDisplay();
        if (time === 0) onSessionComplete();
    }
});

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.target.closest('.modal-overlay.show')) return;
    switch (e.key) {
        case ' ':  e.preventDefault(); startTimer(); break;
        case 'r': case 'R': resetTimer(); break;
        case 's': case 'S': skipSession(); break;
        case 'm': case 'M': muteBtn.click(); break;
        case '1': changeMode('pomodoro'); break;
        case '2': changeMode('short'); break;
        case '3': changeMode('long'); break;
    }
});

// ─── Tasks CRUD ───────────────────────────────────────────────────────────────
function renderTasks() {
    taskList.innerHTML = '';
    if (!tasks.length) { taskList.innerHTML = '<div class="empty-tasks">✨ No tasks yet. Add one below!</div>'; return; }
    tasks.forEach((task, idx) => {
        const item = document.createElement('div');
        item.className = 'task-item' + (task.id === activeTaskId ? ' active-task' : '') + (task.completed ? ' completed-task' : '');
        item.dataset.id = task.id;
        item.dataset.idx = idx;
        item.draggable = true;
        const done = Math.min(task.done || 0, task.est);
        item.innerHTML = `
            <span class="drag-handle" aria-hidden="true">⠿</span>
            <button class="task-check" data-action="toggle" title="Mark complete" aria-label="Toggle complete">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
            <span class="task-title">${escHtml(task.name)}</span>
            <span class="task-pomodoros">${done}/${task.est} 🍅</span>
            <button class="task-options-item" data-action="delete" title="Delete" aria-label="Delete task">✕</button>`;
        // Click to select (ignore drag handle and action buttons)
        item.addEventListener('click', e => {
            if (e.target.closest('[data-action]') || e.target.classList.contains('drag-handle')) return;
            activeTaskId = task.id; saveTasks(); renderTasks(); updateActiveTask();
        });
        item.querySelector('[data-action="toggle"]').addEventListener('click', () => {
            task.completed = !task.completed;
            if (task.completed && activeTaskId === task.id) activeTaskId = null;
            saveTasks(); renderTasks(); updateActiveTask();
        });
        item.querySelector('[data-action="delete"]').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            if (activeTaskId === task.id) activeTaskId = null;
            saveTasks(); renderTasks(); updateActiveTask();
        });
        // ── Drag & drop ──
        item.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', idx);
            setTimeout(() => item.classList.add('dragging'), 0);
        });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
        item.addEventListener('dragover', e => { e.preventDefault(); item.classList.add('drag-over'); });
        item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
        item.addEventListener('drop', e => {
            e.preventDefault(); item.classList.remove('drag-over');
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
            const toIdx   = idx;
            if (fromIdx === toIdx) return;
            const moved = tasks.splice(fromIdx, 1)[0];
            tasks.splice(toIdx, 0, moved);
            saveTasks(); renderTasks();
        });
        taskList.appendChild(item);
    });
}
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

addTaskBtn.addEventListener('click', () => { taskNameInput.value=''; taskPomoInput.value=1; addTaskOverlay.classList.add('show'); taskNameInput.focus(); });
closeAddTask.addEventListener('click',  () => addTaskOverlay.classList.remove('show'));
cancelAddTask.addEventListener('click', () => addTaskOverlay.classList.remove('show'));
addTaskOverlay.addEventListener('click', e => { if (e.target === addTaskOverlay) addTaskOverlay.classList.remove('show'); });
taskNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') confirmAddTask.click(); });
confirmAddTask.addEventListener('click', () => {
    const name = taskNameInput.value.trim();
    if (!name) { taskNameInput.focus(); return; }
    const t = { id:genId(), name, est:parseInt(taskPomoInput.value)||1, done:0, completed:false };
    tasks.push(t);
    if (!activeTaskId) activeTaskId = t.id;
    saveTasks(); renderTasks(); updateActiveTask();
    addTaskOverlay.classList.remove('show');
    showToast(`✅ Task "${name}" added!`);
});
clearDoneBtn.addEventListener('click', () => {
    const doneCount = tasks.filter(t => t.completed).length;
    if (!doneCount) { showToast('No completed tasks to clear.'); return; }
    if (!confirm(`Clear ${doneCount} completed task${doneCount > 1 ? 's' : ''}?`)) return;
    tasks = tasks.filter(t => !t.completed);
    if (!tasks.find(t => t.id === activeTaskId)) activeTaskId = tasks[0]?.id || null;
    saveTasks(); renderTasks(); updateActiveTask();
    showToast('🗑 Completed tasks cleared.');
});

// ─── Settings modal ───────────────────────────────────────────────────────────
function syncSettingsUI() {
    document.getElementById('setPomo').value      = settings.pomoDur;
    document.getElementById('setShort').value     = settings.shortDur;
    document.getElementById('setLong').value      = settings.longDur;
    document.getElementById('setLongAfter').value = settings.longAfter;
    autoBreakToggle.dataset.active = settings.autoBreak;
    autoPomoToggle.dataset.active  = settings.autoPomo;
    tickToggle.dataset.active      = settings.tickSound;
    strictToggle.dataset.active    = settings.strictMode;
}
settingsBtn.addEventListener('click', () => { syncSettingsUI(); settingsOverlay.classList.add('show'); });
closeSettings.addEventListener('click',  () => settingsOverlay.classList.remove('show'));
settingsOverlay.addEventListener('click', e => { if (e.target === settingsOverlay) settingsOverlay.classList.remove('show'); });
[autoBreakToggle, autoPomoToggle, tickToggle, strictToggle].forEach(t => {
    t.addEventListener('click', () => { t.dataset.active = t.dataset.active === 'true' ? 'false' : 'true'; });
});
saveSettingsBtn.addEventListener('click', () => {
    const clamp = (v, min, max, fallback) => { const n = parseInt(v); return isNaN(n) ? fallback : Math.min(max, Math.max(min, n)); };
    settings.pomoDur    = clamp(document.getElementById('setPomo').value,      1, 60, 25);
    settings.shortDur   = clamp(document.getElementById('setShort').value,     1, 30, 5);
    settings.longDur    = clamp(document.getElementById('setLong').value,      1, 60, 15);
    settings.longAfter  = clamp(document.getElementById('setLongAfter').value, 1, 10, 4);
    settings.autoBreak  = autoBreakToggle.dataset.active === 'true';
    settings.autoPomo   = autoPomoToggle.dataset.active  === 'true';
    settings.tickSound  = tickToggle.dataset.active      === 'true';
    settings.strictMode = strictToggle.dataset.active    === 'true';
    saveSettingsToStorage();
    pomodoroTime   = settings.pomoDur  * 60;
    shortBreakTime = settings.shortDur * 60;
    longBreakTime  = settings.longDur  * 60;
    isMuted = !settings.tickSound;
    updateMuteBtn(); applyStrictMode(settings.strictMode);
    pauseTimer(); changeMode(currentMode); updateSessionDots();
    settingsOverlay.classList.remove('show'); showToast('✅ Settings saved!');
});

// ─── Shortcut hint ────────────────────────────────────────────────────────────
function buildShortcutHint() {
    const el = document.getElementById('shortcutHint');
    if (el) el.innerHTML = 'Space: start/pause &nbsp;|&nbsp; R: reset &nbsp;|&nbsp; S: skip &nbsp;|&nbsp; M: mute &nbsp;|&nbsp; 1/2/3: mode';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
// Restore music volume slider from saved settings
musicVolSlider.value = settings.musicVolume || 0.4;
musicVolume          = settings.musicVolume || 0.4;

updateMuteBtn(); applyStrictMode(settings.strictMode);
changeMode('pomodoro');
updateSessionDots(); renderTasks(); updateActiveTask(); updateStats(); buildShortcutHint();

// Restore last playing track after a short delay (AudioContext needs user gesture)
// We flag it so the first click/keydown auto-resumes it
const _savedTrack = settings.musicTrack;
if (_savedTrack && _savedTrack !== 'none') {
    // Show a subtle indicator that music was paused
    showToast(`▶ Resume ${[...FOCUS_TRACKS,...SCIENCE_TRACKS].find(t=>t.id===_savedTrack)?.emoji || ''} music? Click 🎧`, 5000);
}

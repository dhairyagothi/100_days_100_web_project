const userInput = document.getElementById("userInput");
const themeToggle = document.getElementById("themeToggle");
const pagesContainer = document.getElementById("pagesContainer");
const soundToggle = document.getElementById("soundToggle");
const pageCounter = document.getElementById("pageCounter");
const downloadPDF = document.getElementById("downloadPDF");
const copyBtn = document.getElementById("copyBtn");
const wordCountEl = document.getElementById("wordCount");
const charCountEl = document.getElementById("charCount");
let audioCtx;
let currentPage = 0;
let paperContent = '';
let soundEnabled = true;
let capsLockEnabled = false;
let capsLockKey;
let shiftEnabled = false;   // tracks on-screen SHIFT state (one-shot)
let shiftKeyEl;             // reference to the on-screen SHIFT button

document.addEventListener("DOMContentLoaded", () => {
    capsLockKey = document.querySelector(".caps-lock");
    shiftKeyEl  = document.querySelector(".shift-key");
    
    /* ---------- Onscreen Keys ---------- */
    document.querySelectorAll(".key").forEach(key=>{
        key.onclick=()=>{
        const ch = key.dataset.char;
        if(ch==="BACKSPACE"){
            deleteCharFromPaper();
            return;
        }
        if(ch==="ENTER"){
            paperContent+="\n";
            getCurrentText().textContent=paperContent;
            playReturn();
            updateCopyButtonState();
            updateCounters();
            return;
        }
        if(ch==="SPACE"){
            addCharToPaper(" ");
            resetShift();
            return;
        }
        if (ch === "TAB") {
                // Tab inserts four spaces on the paper (classic typewriter behaviour)
                addCharToPaper("    ");
                return;
        }
        if(ch==="CAPSLOCK"){
            capsLockEnabled = !capsLockEnabled;
            capsLockKey.setAttribute("aria-pressed", capsLockEnabled);
            capsLockKey.classList.toggle("pressed", capsLockEnabled);
            return;
        }
        if (ch === "SHIFT") {
                // One-shot toggle: highlight stays until next character is typed
                shiftEnabled = !shiftEnabled;
                shiftKeyEl.setAttribute("aria-pressed", shiftEnabled);
                shiftKeyEl.classList.toggle("pressed", shiftEnabled);
                return;
        }

        // ---- Dual-character keys (numbers row + symbol rows) ----
        const shiftChar = key.dataset.shift;
        if (shiftChar !== undefined) {
            // For these keys, CapsLock has NO effect — only SHIFT matters
            const charToAdd = shiftEnabled ? shiftChar : ch;
            addCharToPaper(charToAdd);
            resetShift();
            return;
        }

        // ---- Letter keys: apply CapsLock XOR Shift ----
        const shouldBeUpper = capsLockEnabled !== shiftEnabled;
        addCharToPaper(shouldBeUpper ? ch.toUpperCase() : ch.toLowerCase());
        resetShift();
        };
    });
});

/* ---------- Pages ---------- */

function getCurrentText(){
    return document.querySelectorAll(".typewriterText")[currentPage];
}

function resetShift() {
    if (!shiftEnabled) return;
    shiftEnabled = false;
    if (shiftKeyEl) {
        shiftKeyEl.setAttribute("aria-pressed", false);
        shiftKeyEl.classList.remove("pressed");
    }
}

function createPage(){
    paperContent = "";
    currentPage++;
    const page = document.createElement("div");
    page.className = "paper-sheet page";
    page.innerHTML = `<span class="typewriterText"></span><span class="cursor-paper"></span>`;
    pagesContainer.appendChild(page);
    pageCounter.innerText = `Page ${currentPage+1}`;
}

/* ---------- AUDIO ---------- */

function getAudioCtx(){
    if(!audioCtx){
        try{
            audioCtx = 
                new(
                window.AudioContext ||
                window.webkitAudioContext
                )();
        }
        catch(e){}
        }
    return audioCtx;
}


function playClick(noiseVol,freq1,freq2,dur){
    if(!soundEnabled) return;
    const ctx = getAudioCtx();
    if(!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(freq1,now);
    osc.frequency.exponentialRampToValueAtTime(freq2,now+dur);
    gain.gain.setValueAtTime(noiseVol,now);
    gain.gain.exponentialRampToValueAtTime(0.001,now+dur);
    osc.start(now);
    osc.stop(now+dur);
}


function playKeyClick(){
    playClick(0.55,900,200,0.035);
}

function playHeavyKey(){
    playClick(0.40,140,75,0.12);
}

function playSpaceClick(){
    playHeavyKey();
}

function playReturn(){
    playHeavyKey();
}

function playBackspace(){
    playHeavyKey();
}


/* ---------- Typing ---------- */

function addCharToPaper(ch){
    paperContent += ch;
    getCurrentText().textContent = paperContent;
    if(ch===" ") {
        playSpaceClick();
        flashKey("SPACE");
    }
    else {
        playKeyClick();
        if(ch!=="\n")
            flashKey(ch.toUpperCase());
    }

    /* overflow check */
    let page = document.querySelectorAll(".paper-sheet")[currentPage];

    /* check actual page overflow */
    if(page.scrollHeight > page.clientHeight){
        let oldText = paperContent;
        /* create new page */
        createPage();
        /* continue typing on new page */
        paperContent = "";
        getCurrentText().textContent = paperContent;
        }

    updateCopyButtonState();
    updateCounters();
}

function deleteCharFromPaper(){
    if(paperContent.length===0)
        return;
    paperContent = paperContent.slice(0,-1);
    getCurrentText().textContent = paperContent;
    playBackspace();
    updateCopyButtonState();
    updateCounters();
}


/* ---------- Flash ---------- */

function flashKey(char){
    const key = document.querySelector(`.key[data-char="${char}"]`);
    if(!key) return;
    key.classList.add("pressed");
    setTimeout(()=>{key.classList.remove("pressed");},130);
}


/* ---------- Keyboard ---------- */
document.addEventListener("keydown",(e)=>{
    if(e.key==="Backspace"){
        e.preventDefault();
        deleteCharFromPaper();
        flashKey("BACKSPACE");
        return;
    }  
    if(e.key==="Enter"){
        e.preventDefault();
        paperContent+="\n";
        getCurrentText().textContent = paperContent;
        playReturn();
        flashKey("ENTER");
        updateCopyButtonState();
        updateCounters();
        return;
    }
    if(e.key === "CapsLock"){
        e.preventDefault();
        capsLockEnabled = !capsLockEnabled;
        if(capsLockKey){
            capsLockKey.setAttribute("aria-pressed", capsLockEnabled);
            capsLockKey.classList.toggle("pressed", capsLockEnabled);
        }
        return;
    }
    if(e.key === " "){
        e.preventDefault();
        addCharToPaper(" ");
        return;
    }
    if(e.key === "Tab"){
        e.preventDefault();
        addCharToPaper("    "); // 4 spaces = one tab stop
        flashKey("TAB");
        return;
    }


    if(e.key.length===1){
        e.preventDefault();
        let charToAdd;
        // e.shiftKey tells us if Shift is held at the moment of the keypress.
        // CapsLock XOR Shift gives the correct case behaviour:
        const shouldBeUpper = capsLockEnabled !== e.shiftKey; // XOR
        charToAdd = shouldBeUpper ? e.key.toUpperCase() : e.key.toLowerCase();
        addCharToPaper(charToAdd);
    }
});


/* ---------- Sound Toggle ---------- */

soundToggle.onclick=()=>{
    soundEnabled = !soundEnabled;
    soundToggle.innerText=soundEnabled ?"🔊 Sound ON":"🔇 Sound OFF";
};


/* ---------- PDF ---------- */

downloadPDF.onclick = () => {
    const pages = document.querySelectorAll(".paper-sheet");
    const container = document.createElement("div");
    pages.forEach(page => {
        const clone = page.cloneNode(true);
        /* force dark text for pdf */
        clone.querySelectorAll("*").forEach(el=>{
            el.style.color="#000";
            el.style.opacity="1";
            el.style.filter="none";
            el.style.textShadow="none";
        }
    );
    clone.style.color="#000";
    clone.style.background="#fff";
    /* remove blinking cursor in pdf */
    const cursor = clone.querySelector(".cursor-paper");
    if(cursor) cursor.remove();
    clone.style.width="794px";     // A4 width
    clone.style.minHeight="1123px";
    clone.style.padding="40px";
    clone.style.pageBreakAfter="always";
    clone.style.boxSizing="border-box";
    container.appendChild(clone);
    });
    html2pdf().set({
        filename:"typewriter-pages.pdf",
        margin:0,
        image:{
            type:"jpeg",
            quality:1
        },
        html2canvas:{
            scale:2
        },
        jsPDF:{
            unit:"px",
            format:[794,1123],
            orientation:"portrait"
        }
    }).from(container).save();
};


/* ---------- Theme ---------- */

themeToggle.onclick=()=>{
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    themeToggle.textContent= isLight?"☀️":"🌙";localStorage.setItem("theme",isLight?"light":"dark");
};

const savedTheme = localStorage.getItem("theme");
if(savedTheme==="light"){
    document.body.classList.add("light-theme");
    themeToggle.textContent="☀️";
}

/* ---------- Word & Character Counters ---------- */

function updateCounters() {
    const fullText = getAllTextFromAllPages();
    const charCount = fullText.length;
    const words = fullText.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    wordCountEl.textContent = `Words: ${wordCount}`;
    charCountEl.textContent = `Characters: ${charCount}`;
}

/* ---------- Copy to Clipboard ---------- */

function getAllTextFromAllPages() {
    const allPages = document.querySelectorAll(".typewriterText");
    let fullText = "";
    allPages.forEach((pageText, index) => {
        if (index > 0) {
            fullText += "\n";
        }
        fullText += pageText.textContent;
    });
    return fullText;
}

function updateCopyButtonState() {
    const fullText = getAllTextFromAllPages();
    copyBtn.disabled = fullText.trim() === "";
}

copyBtn.onclick = async () => {
    try {
        const fullText = getAllTextFromAllPages();
        await navigator.clipboard.writeText(fullText);
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✅ Copied!";
        copyBtn.disabled = true;
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            updateCopyButtonState();
        }, 2000);
    } catch (err) {
        console.error("Copy failed:", err);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    updateCopyButtonState();
    updateCounters();
});

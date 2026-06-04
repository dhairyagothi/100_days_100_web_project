/* ══════════════════════════════════════════════════════
   4-PLAYER LUDO — 4 tokens per player
   ══════════════════════════════════════════════════════ */

const PATH = [
  [[6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],
   [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
   [7,14],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
   [14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
   [7,0],[6,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]],
  [[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
   [7,14],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
   [14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
   [7,0],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
   [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
  [[8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
   [14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
   [7,0],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
   [0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
   [7,14],[7,13],[7,12],[7,11],[7,10],[7,9],[7,8]],
  [[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
   [7,0],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
   [0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
   [7,14],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
   [14,7],[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]]
];

const YARD = [
  [[2,2],[2,4],[4,2],[4,4]],
  [[2,10],[2,12],[4,10],[4,12]],
  [[10,10],[10,12],[12,10],[12,12]],
  [[10,2],[10,4],[12,2],[12,4]],
];

const SAFE = new Set([
  '6,1','1,8','8,13','13,6',  // starting safe cells
  '2,6','6,12','12,8','8,2'   // middle safe cells (corrected middle safe cells for better compatibility)
]);
const isSafe = (r,c) => SAFE.has(r+','+c);

const DEFAULT_NAMES = ['Player 1','Player 2','Player 3','Player 4'];
const WIN_COLORS    = ['#e53935','#1e88e5','#43a047','#f9a825'];
const WIN_LABELS    = ['🔴 Red','🔵 Blue','🟢 Green','🟡 Yellow'];
const TCLS   = ['tr','tb','tg','ty'];
const LCLS   = ['lr','lb','lg','ly'];
const EMOJIS = ['🔴','🔵','🟢','🟡'];
const PPIDS  = ['pp0','pp1','pp2','pp3'];

let NAMES = [...DEFAULT_NAMES];
let vsAI=false, cur=0, rolled=false, diceVal=0, gameOver=false;
let timerID=null, timerSec=30;
let tokens;
let lastVsAI = false; // remember mode for "play again"

// ── SCREEN MANAGER ────────────────────────────────────
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goToNames(){
  showScreen('name-screen');
  setTimeout(()=>document.getElementById('n0').focus(),100);
}

// ── START GAME ────────────────────────────────────────
function startGame(ai){
  vsAI=ai; lastVsAI=ai;

  if(ai){
    NAMES = ['You','Computer 1','Computer 2','Computer 3'];
  } else {
    const inputs = ['n0','n1','n2','n3'].map(id=>document.getElementById(id).value.trim());
    NAMES = inputs.map((v,i)=>v||DEFAULT_NAMES[i]);
  }

  // Update name displays in panels
  ['pp0name','pp1name','pp2name','pp3name'].forEach((id,i)=>{
    document.getElementById(id).textContent = NAMES[i];
  });

  tokens = [
    [{step:-1},{step:-1},{step:-1},{step:-1}],
    [{step:-1},{step:-1},{step:-1},{step:-1}],
    [{step:-1},{step:-1},{step:-1},{step:-1}],
    [{step:-1},{step:-1},{step:-1},{step:-1}],
  ];
  cur=0; rolled=false; diceVal=0; gameOver=false;
  clearLog(); buildBoard(); render(); updatePanels();
  setStatus(NAMES[0]+' ki baari!');
  showScreen('game-screen');
  startTimer();
}

function playAgain(){
  document.getElementById('win-ov').classList.remove('show');
  document.getElementById('cfbox').innerHTML='';
  if(lastVsAI){
    startGame(true);
  } else {
    showScreen('name-screen');
  }
}

function backToMenu(){
  clearInterval(timerID);
  document.getElementById('win-ov').classList.remove('show');
  document.getElementById('cfbox').innerHTML='';
  showScreen('mode-screen');
}

// ── BUILD BOARD ────────────────────────────────────────
function buildBoard(){
  const b=document.getElementById('board');b.innerHTML='';
  for(let r=0;r<15;r++) for(let c=0;c<15;c++){
    const d=document.createElement('div');
    d.className='cell';d.id='C'+r+'_'+c;
    styleCell(d,r,c);b.appendChild(d);
  }
}
function styleCell(el,r,c){
  if(r<=5&&c<=5){el.classList.add('qr');return;}
  if(r<=5&&c>=9){el.classList.add('qb');return;}
  if(r>=9&&c>=9){el.classList.add('qg');return;}
  if(r>=9&&c<=5){el.classList.add('qy');return;}
  if(r>=6&&r<=8&&c>=6&&c<=8){
    const m={'6,6':'cr','6,8':'cb','8,6':'cy','8,8':'cg','6,7':'cw','7,6':'cw','7,8':'cw','8,7':'cw','7,7':'cw'};
    const k=r+','+c;
    if(m[k]){el.classList.add(m[k]);if(r===7&&c===7)el.textContent='⭐';}
    return;
  }
  if(r===7&&c>=1&&c<=5){el.classList.add('hr');return;}
  if(c===7&&r>=1&&r<=5){el.classList.add('hb');return;}
  if(r===7&&c>=9&&c<=13){el.classList.add('hg');return;}
  if(c===7&&r>=9&&r<=13){el.classList.add('hy');return;}
  if(isSafe(r,c)){el.classList.add('safe');}
}

// ── RENDER ────────────────────────────────────────────
function render(){
  document.querySelectorAll('.cell-inner').forEach(e=>e.remove());
  document.querySelectorAll('.sn').forEach(e=>e.remove());
  const map={};
  for(let pi=0;pi<4;pi++) for(let ti=0;ti<4;ti++){
    const s=tokens[pi][ti].step;
    if(s===57)continue;
    const [r,c]=s===-1?YARD[pi][ti]:PATH[pi][s];
    const k=r+','+c;
    (map[k]=map[k]||[]).push({pi,ti});
  }
  for(const [k,list] of Object.entries(map)){
    const [r,c]=k.split(',').map(Number);
    const cell=document.getElementById('C'+r+'_'+c);
    if(!cell)continue;
    const wrap=document.createElement('div');wrap.className='cell-inner';
    if(list.length>1){const sn=document.createElement('div');sn.className='sn';sn.textContent=list.length;wrap.appendChild(sn);}
    list.forEach(({pi,ti})=>{
      const el=document.createElement('div');
      el.className='token '+TCLS[pi];
      el.textContent=ti+1;
      if(list.length>1){el.style.width='38%';el.style.height='38%';el.style.fontSize='.4rem';}
      if(!gameOver&&rolled&&cur===pi&&canMove(pi,ti)){
        el.classList.add('movable');
        el.addEventListener('click',()=>doMove(pi,ti));
      }
      wrap.appendChild(el);
    });
    cell.appendChild(wrap);
  }
}

// ── MOVEMENT ──────────────────────────────────────────
function canMove(pi,ti){
  const s=tokens[pi][ti].step;
  if(s===57)return false;
  if(s===-1)return diceVal===6;
  //Exact match required
  if (s + diceVal > 57) return false;
  return true;
}
function anyCanMove(pi){return tokens[pi].some((_,ti)=>canMove(pi,ti));}

function doMove(pi,ti){
  if(!rolled||cur!==pi||gameOver)return;
  if(!canMove(pi,ti))return;
  const tok=tokens[pi][ti];
  const nm=NAMES[pi];
  if(tok.step===-1){tok.step=0;addLog(nm+': Token '+(ti+1)+' started moving from the Yard🏠',pi);}
  else{
    if(tok.step + diceVal <= 57)
      tok.step += diceVal;
    else
    return; //invalid move
}
  addLog(nm+': Token '+(ti+1)+' → step '+tok.step,pi);
  if(tok.step===57){
    addLog(nm+': Token '+(ti+1)+' recieved! 🎉',pi);
    playSound('tok');render();updatePanels();
    if(checkWin(pi))return;
    afterMove(pi);return;
  }
  if(tok.step<=51){
    const [mr,mc]=PATH[pi][tok.step];
    if(!isSafe(mr,mc)){
      for(let opi=0;opi<4;opi++){
        if(opi===pi)continue;
        for(let oti=0;oti<4;oti++){
          const ot=tokens[opi][oti];
          if(ot.step<0||ot.step>51||ot.step===57)continue;
          const [or,oc]=PATH[opi][ot.step];
          if(or===mr&&oc===mc){
            ot.step=-1;
            addLog(nm+' has '+NAMES[opi]+'  cutted the Token '+(oti+1)+'✂️',pi);
            playSound('cut');
          }
        }
      }
    }
  }
  render();updatePanels();afterMove(pi);
}

function afterMove(pi){
  rolled=false;
  if(diceVal===6&&!gameOver){
    addLog(NAMES[pi]+': 6 → one more  chance! 🎲',pi);
    setStatus(NAMES[pi]+': 6 - one more chance!');
    resetTimer();
    if(vsAI&&pi!==0)setTimeout(()=>aiTurn(pi),800);
    return;
  }
  cur=(pi+1)%4;
  animateTurnChange();
  rolled=false;updatePanels();
  setStatus(NAMES[cur]+' chance!');
  resetTimer();
  if(vsAI&&cur!==0)setTimeout(()=>aiTurn(cur),800);
}

// ── AI ────────────────────────────────────────────────
function aiTurn(pi){
  if(gameOver||cur!==pi)return;
  const v=Math.ceil(Math.random()*6);
  diceVal=v;rolled=true;showFace(v);
  document.getElementById('dnum').textContent=v;
  addLog(NAMES[pi]+': Dice = '+v+' 🎲',pi);
  if(!anyCanMove(pi)){
    addLog(NAMES[pi]+': no move — skip',pi);
    setStatus(NAMES[pi]+': '+v+' recieved, no move!');
    rolled=false;
    setTimeout(()=>{cur=(pi+1)%4;updatePanels();setStatus(NAMES[cur]+' chance!');resetTimer();render();if(vsAI&&cur!==0)setTimeout(()=>aiTurn(cur),800);},1000);
    return;
  }
  setTimeout(()=>{
    let best=-1,bestScore=-999;
    for(let ti=0;ti<4;ti++){
      if(!canMove(pi,ti))continue;
      const s=tokens[pi][ti].step;
      const ns=s===-1?0:s+diceVal;
      let score=ns;
      if(ns<=51){
        const[mr,mc]=PATH[pi][ns];
        if(!isSafe(mr,mc)){
          for(let opi=0;opi<4;opi++){
            if(opi===pi)continue;
            tokens[opi].forEach(ot=>{
              if(ot.step>=0&&ot.step<=51){
                const[or,oc]=PATH[opi][ot.step];
                if(or===mr&&oc===mc)score+=100;
              }
            });
          }
        }
      }
      if(score>bestScore){bestScore=score;best=ti;}
    }
    if(best>=0)doMove(pi,best);
  },500);
}

// ── WIN ───────────────────────────────────────────────
function checkWin(pi){
  if(tokens[pi].every(t=>t.step===57)){
    gameOver=true;clearInterval(timerID);
    setTimeout(()=>{
      // Fill win card
      document.getElementById('w-trophy').textContent = EMOJIS[pi];
      document.getElementById('w-name').textContent = NAMES[pi];
      const badge = document.getElementById('w-color-badge');
      badge.textContent = WIN_LABELS[pi];
      badge.style.background = WIN_COLORS[pi]+'33';
      badge.style.border = '1.5px solid '+WIN_COLORS[pi];
      badge.style.color = WIN_COLORS[pi];
      document.getElementById('win-ov').classList.add('show');
      launchConfetti(); playSound('win');
    },400);
    return true;
  }
  return false;
}

// ── DICE ─────────────────────────────────────────────
function diceClick(){
  if(rolled||gameOver)return;
  if(vsAI&&cur!==0)return;
  const d=document.getElementById('dice');
  if(d.classList.contains('off'))return;
  d.classList.add('spin','off');playSound('roll');
  let f=0;
  const iv=setInterval(()=>{
    showFace(Math.ceil(Math.random()*6));f++;
    if(f>=6){
      clearInterval(iv);d.classList.remove('spin','off');
      const v=Math.ceil(Math.random()*6);
      diceVal=v;rolled=true;showFace(v);
      document.getElementById('dnum').textContent=v;
      addLog(NAMES[cur]+': Dice = '+v+' 🎲',cur);
      if(!anyCanMove(cur)){
        addLog(NAMES[cur]+': no move— skip',cur);
        setStatus(NAMES[cur]+': '+v+' recieved, no move!');
        rolled=false;
        setTimeout(()=>{cur=(cur+1)%4;updatePanels();setStatus(NAMES[cur]+' chance!');resetTimer();render();if(vsAI&&cur!==0)setTimeout(()=>aiTurn(cur),800);},1200);
      } else {
        setStatus(NAMES[cur]+': '+v+' recieved — choose Token!');render();
      }
    }
  },80);
}

const FACES={1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};
function showFace(n){for(let i=1;i<=9;i++)document.getElementById('p'+i).classList.toggle('on',(FACES[n]||[]).includes(i));}

// ── TIMER ─────────────────────────────────────────────
function startTimer(){
  clearInterval(timerID);timerSec=30;updTimer();
  timerID=setInterval(()=>{
    timerSec--;updTimer();
    if(timerSec<=0){
      addLog(NAMES[cur]+': Time out! ⏰',cur);
      rolled=false;cur=(cur+1)%4;updatePanels();
      setStatus(NAMES[cur]+' chance!');resetTimer();render();
      if(vsAI&&cur!==0)setTimeout(()=>aiTurn(cur),800);
    }
  },1000);
}
function resetTimer(){clearInterval(timerID);timerSec=30;updTimer();if(!gameOver)startTimer();}
function updTimer(){
  const pct=(timerSec/30)*100;
  const f=document.getElementById('tfill');
  f.style.width=pct+'%';f.classList.toggle('urg',timerSec<=8);
  document.getElementById('tsec').textContent=timerSec;
}

// ── UI HELPERS ────────────────────────────────────────
function updatePanels(){
  for(let i=0;i<4;i++){
    const panel = document.getElementById(PPIDS[i]);
    panel.classList.remove('active');
    panel.classList.remove('current-turn');
    if(i===cur){
      panel.classList.add('active');
      panel.classList.add('current-turn');
    }
    const y=tokens[i].filter(t=>t.step===-1).length;
    const d=tokens[i].filter(t=>t.step===57).length;
    document.getElementById('st'+i).textContent='Yard:'+y+' Done:'+d;
  }
}
function setStatus(m){document.getElementById('status').textContent=m;}
function addLog(m,pi){
  const l=document.getElementById('log');
  const d=document.createElement('div');d.className=LCLS[pi];d.textContent=m;
  l.insertBefore(d,l.firstChild);
  if(l.children.length>25)l.removeChild(l.lastChild);
}
function clearLog(){
  document.getElementById('log').innerHTML='';
  document.getElementById('dnum').textContent='—';
  for(let i=1;i<=9;i++)document.getElementById('p'+i).classList.remove('on');
}

// ── CONFETTI ──────────────────────────────────────────
function launchConfetti(){
  const b=document.getElementById('cfbox');b.innerHTML='';
  const cols=['#ffd700','#e53935','#1e88e5','#43a047','#f9a825','#fff','#ff4081'];
  for(let i=0;i<120;i++){
    const e=document.createElement('div');e.className='cf';
    e.style.cssText=`left:${Math.random()*100}vw;background:${cols[i%cols.length]};width:${7+Math.random()*9}px;height:${7+Math.random()*9}px;border-radius:${Math.random()>.5?'50%':'3px'};animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*1.5}s;`;
    b.appendChild(e);
  }
}

// ── SOUND ─────────────────────────────────────────────
function playSound(t){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    if(t==='roll'){o.frequency.setValueAtTime(300,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(600,ctx.currentTime+.15);g.gain.setValueAtTime(.15,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.2);}
    else if(t==='cut'){o.type='sawtooth';o.frequency.setValueAtTime(180,ctx.currentTime);g.gain.setValueAtTime(.2,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.35);}
    else if(t==='tok'){o.frequency.setValueAtTime(880,ctx.currentTime);g.gain.setValueAtTime(.12,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.25);}
    else if(t==='win'){o.type='square';o.frequency.setValueAtTime(523,ctx.currentTime);o.frequency.setValueAtTime(659,ctx.currentTime+.18);o.frequency.setValueAtTime(784,ctx.currentTime+.36);g.gain.setValueAtTime(.12,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.7);}
    o.start();o.stop(ctx.currentTime+.8);
  }catch(e){}
}

//Turn highlight on each Player's turn accordingly
function animateTurnChange() {
  const panel = document.getElementById(PPIDS[cur]);
  panel.style.transition = "all 0.3s ease";
  panel.style.transform = "scale(1.08)";
  setTimeout(() => {
    panel.style.transform = "scale(1)";
  }, 300);
}

// Enter key on name inputs → start game
document.querySelectorAll('.name-input').forEach((inp,i)=>{
  inp.addEventListener('keydown',e=>{
    if(e.key==='Enter'){
      if(i<3)document.getElementById('n'+(i+1)).focus();
      else startGame(false);
    }
  });
});

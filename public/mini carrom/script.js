// ── SETUP ───────────────────────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const S      = Math.min(window.innerWidth - 56, 520);
canvas.width = canvas.height = S;

const PAD       = S * 0.075;
const PLAY      = S - 2*PAD;
const CX = CY   = S/2;
const POCKET_R  = S * 0.068;
const PULL_R    = POCKET_R * 1.5;
const COIN_R    = S * 0.028;
const STRIKER_R = S * 0.040;

const POCKETS = [
  {x:PAD,      y:PAD},
  {x:S-PAD,    y:PAD},
  {x:PAD,      y:S-PAD},
  {x:S-PAD,    y:S-PAD}
];

// Striker line per player
const SL = [
  {y:S-PAD-PLAY*0.11, minX:PAD+PLAY*0.2, maxX:S-PAD-PLAY*0.2},
  {y:PAD+PLAY*0.11,   minX:PAD+PLAY*0.2, maxX:S-PAD-PLAY*0.2}
];

// ── STATE ────────────────────────────────────────────────────────────────────
let gameMode='pvp', gameState='idle', curP=0;
let scores=[0,0], pnames=['Player 1','Player 2'];
let coins=[], striker={}, aimAngle=-Math.PI/2;
let pottedThisTurn=[], sinking=[];
let animFrame=null, compTimer=null;

// ── COINS ────────────────────────────────────────────────────────────────────
function mkCoin(x,y,color){
  return {x,y,vx:0,vy:0,r:COIN_R,color,
    points:color==='black'?10:color==='white'?20:40,
    potted:false,sinkProgress:0,_sinking:false};
}
function initCoins(){
  coins=[];
  const g=COIN_R*2.55;
  coins.push(mkCoin(CX,CY,'pink'));
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3;
    coins.push(mkCoin(CX+Math.cos(a)*g*1.05, CY+Math.sin(a)*g*1.05, i%2===0?'black':'white'));
  }
  const oc=['black','white','black','white','black','white','black','white'];
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4+Math.PI/8;
    coins.push(mkCoin(CX+Math.cos(a)*g*2.1, CY+Math.sin(a)*g*2.1, oc[i]));
  }
}

// ── STRIKER RESET ────────────────────────────────────────────────────────────
function resetStriker(){
  const ln=SL[curP];
  striker={x:(ln.minX+ln.maxX)/2, y:ln.y, vx:0,vy:0,r:STRIKER_R,
           active:true, sinkProgress:0, _sinking:false};
  aimAngle = curP===0 ? -Math.PI/2 : Math.PI/2;
  // sync sliders
  el('posSlider').value=50;
  el('aimSlider').value=0;
  el('aimVal').textContent='0°';
  gameState='aiming';
  updateUI();
  if(gameMode==='pvc' && curP===1) schedComp();
}

// ── UI ───────────────────────────────────────────────────────────────────────
function el(id){ return document.getElementById(id); }
function updateUI(){
  el('card0').classList.toggle('active',curP===0);
  el('card1').classList.toggle('active',curP===1);
  el('pturn0').textContent=curP===0?'▶ YOUR TURN':'';
  el('pturn1').textContent=curP===1?'▶ YOUR TURN':'';
  // Show/hide control panel during computer turn
  el('ctrlPanel').style.opacity=(gameMode==='pvc'&&curP===1)?'0.4':'1';
  el('ctrlPanel').style.pointerEvents=(gameMode==='pvc'&&curP===1)?'none':'auto';
  let s='';
  if(gameState==='aiming')
    s=(gameMode==='pvc'&&curP===1)?'🤖 Computer ki chaal...':`${pnames[curP]}: Aim set karo → Shoot!`;
  else if(gameState==='shooting') s='💨 Chal rahi hai...';
  el('statusBar').textContent=s;
}
function setStatus(t){ el('statusBar').textContent=t; }
function updateScores(){ el('pscore0').textContent=scores[0]; el('pscore1').textContent=scores[1]; }

// ── PHYSICS ──────────────────────────────────────────────────────────────────
const FRICTION=0.989, REST=0.83, SUBSTEPS=8;

function stepObj(o){
  o.x+=o.vx/SUBSTEPS; o.y+=o.vy/SUBSTEPS;
  const f=Math.pow(FRICTION,1/SUBSTEPS);
  o.vx*=f; o.vy*=f;
  if(Math.abs(o.vx)<0.05) o.vx=0;
  if(Math.abs(o.vy)<0.05) o.vy=0;
}
function wallBounce(o){
  const lo=PAD+o.r, hi=S-PAD-o.r;
  if(o.x<lo){o.x=lo; if(o.vx<0)o.vx=-o.vx*0.75;}
  if(o.x>hi){o.x=hi; if(o.vx>0)o.vx=-o.vx*0.75;}
  if(o.y<lo){o.y=lo; if(o.vy<0)o.vy=-o.vy*0.75;}
  if(o.y>hi){o.y=hi; if(o.vy>0)o.vy=-o.vy*0.75;}
}
function collide(a,b){
  const dx=b.x-a.x, dy=b.y-a.y, d2=dx*dx+dy*dy;
  const md=a.r+b.r;
  if(d2>=md*md||d2<0.001) return;
  const d=Math.sqrt(d2), nx=dx/d, ny=dy/d;
  const ov=(md-d)*0.5;
  a.x-=nx*ov; a.y-=ny*ov; b.x+=nx*ov; b.y+=ny*ov;
  const dvx=a.vx-b.vx, dvy=a.vy-b.vy, dot=dvx*nx+dvy*ny;
  if(dot<=0) return;
  const j=dot*REST;
  a.vx-=j*nx; a.vy-=j*ny; b.vx+=j*nx; b.vy+=j*ny;
}
function nearPocket(o){
  for(const p of POCKETS){
    const dx=o.x-p.x, dy=o.y-p.y;
    if(dx*dx+dy*dy<PULL_R*PULL_R) return p;
  }
  return null;
}
function sinkStep(o){
  const p=o._sinkPocket;
  const dx=p.x-o.x, dy=p.y-o.y;
  o.x+=dx*0.25; o.y+=dy*0.25;
  o.vx*=0.5; o.vy*=0.5;
  o.sinkProgress=(o.sinkProgress||0)+0.22;
  return o.sinkProgress>=1;
}
function isSettled(){
  return coins.filter(c=>!c.potted&&!c._sinking).every(c=>c.vx===0&&c.vy===0)
      && (!striker.active||(striker.vx===0&&striker.vy===0));
}

// ── SHOOT ────────────────────────────────────────────────────────────────────
function shoot(power, angle){
  if(gameState!=='aiming') return;
  striker.vx=Math.cos(angle)*power;
  striker.vy=Math.sin(angle)*power;
  pottedThisTurn=[];
  gameState='shooting';
  updateUI();
}

// ── TURN END ─────────────────────────────────────────────────────────────────
function processTurnEnd(){
  const potted=pottedThisTurn.filter(c=>c!=='STRIKER');
  let gotAny=false;
  for(const c of potted){ scores[curP]+=c.points; gotAny=true; }
  updateScores();
  if(checkWin()) return;
  if(gotAny){
    setStatus(`✅ ${pnames[curP]} ne ${potted.map(c=>c.color).join(', ')} pocket! one more chance!`);
    setTimeout(resetStriker, 700);
  } else {
    curP=1-curP;
    setTimeout(resetStriker, 700);
  }
}
function checkWin(){
  if(scores[0]>=120){ showWin(0); return true; }
  if(scores[1]>=120){ showWin(1); return true; }
  if(coins.every(c=>c.potted)){ showWin(scores[0]>=scores[1]?0:1); return true; }
  return false;
}
function showWin(i){
  gameState='idle';
  cancelAnimationFrame(animFrame);
  el('winTitle').textContent=`🏆 ${pnames[i]} Wins!`;
  el('winMsg').textContent=`Score: ${scores[0]} – ${scores[1]}`;
  el('winScreen').style.display='flex';
}

// ── COMPUTER ─────────────────────────────────────────────────────────────────
function schedComp(){ clearTimeout(compTimer); compTimer=setTimeout(compMove, 900+Math.random()*600); }
function compMove(){
  if(gameState!=='aiming'||curP!==1) return;
  const alive=coins.filter(c=>!c.potted);
  if(!alive.length) return;
  let best=alive.reduce((a,b)=>b.points>a.points?b:a);
  let bestAngle=Math.PI/2, bestDist=1e9;
  for(const p of POCKETS){
    const tpA=Math.atan2(p.y-best.y, p.x-best.x);
    const hx=best.x-Math.cos(tpA)*COIN_R*2.1;
    const hy=best.y-Math.sin(tpA)*COIN_R*2.1;
    const a=Math.atan2(hy-striker.y, hx-striker.x);
    const d=Math.hypot(hx-striker.x, hy-striker.y);
    if(d<bestDist){ bestDist=d; bestAngle=a; }
  }
  bestAngle+=(Math.random()-.5)*0.2;
  const ln=SL[1];
  striker.x=ln.minX+Math.random()*(ln.maxX-ln.minX);
  aimAngle=bestAngle;
  setTimeout(()=>shoot(12+Math.random()*10, bestAngle), 250);
}

// ── GAME LOOP ────────────────────────────────────────────────────────────────
function gameLoop(){
  ctx.clearRect(0,0,S,S);
  drawBoard();

  if(gameState==='shooting'){
    for(let s=0;s<SUBSTEPS;s++){
      if(striker.active){ stepObj(striker); wallBounce(striker); }
      for(const c of coins){
        if(c.potted||c._sinking) continue;
        stepObj(c); wallBounce(c);
      }
      if(striker.active){
        for(const c of coins){
          if(c.potted||c._sinking) continue;
          collide(striker,c);
        }
      }
      for(let i=0;i<coins.length;i++){
        if(coins[i].potted||coins[i]._sinking) continue;
        for(let j=i+1;j<coins.length;j++){
          if(coins[j].potted||coins[j]._sinking) continue;
          collide(coins[i],coins[j]);
        }
      }
    }
    // pocket check – coins only, striker never pots
    for(const c of coins){
      if(c.potted||c._sinking) continue;
      const p=nearPocket(c);
      if(p){ c._sinking=true; c._sinkPocket=p; sinking.push(c); }
    }
  }

  // sink animation
  for(let i=sinking.length-1;i>=0;i--){
    const o=sinking[i];
    if(sinkStep(o)){
      o._sinking=false; o.potted=true;
      pottedThisTurn.push(o);
      sinking.splice(i,1);
    }
  }

  if(gameState==='shooting'&&sinking.length===0&&isSettled()){
    gameState='settling';
    setTimeout(processTurnEnd,300);
  }

  drawAimLine();
  for(const c of coins) drawCoin(c);
  drawStriker();
  animFrame=requestAnimationFrame(gameLoop);
}

// ── DRAW ─────────────────────────────────────────────────────────────────────
function drawBoard(){
  // felt
  ctx.fillStyle='#2d6a2d';
  ctx.beginPath(); ctx.roundRect(PAD,PAD,PLAY,PLAY,3); ctx.fill();
  // grid
  ctx.strokeStyle='rgba(0,0,0,0.06)'; ctx.lineWidth=.5;
  for(let i=0;i<PLAY;i+=9){
    ctx.beginPath();ctx.moveTo(PAD+i,PAD);ctx.lineTo(PAD+i,S-PAD);ctx.stroke();
    ctx.beginPath();ctx.moveTo(PAD,PAD+i);ctx.lineTo(S-PAD,PAD+i);ctx.stroke();
  }
  // inner border
  const inn=PLAY*0.09;
  ctx.strokeStyle='rgba(255,220,100,0.28)'; ctx.lineWidth=1.5;
  ctx.strokeRect(PAD+inn,PAD+inn,PLAY-inn*2,PLAY-inn*2);
  // centre circles
  ctx.strokeStyle='rgba(255,220,100,0.3)'; ctx.lineWidth=1.5;
  [PLAY*0.08,PLAY*0.17].forEach(r=>{
    ctx.beginPath();ctx.arc(CX,CY,r,0,Math.PI*2);ctx.stroke();
  });
  // striker lines
  ctx.strokeStyle='rgba(255,220,100,0.45)'; ctx.lineWidth=1.5;
  for(const ln of SL){
    ctx.beginPath();ctx.moveTo(ln.minX,ln.y);ctx.lineTo(ln.maxX,ln.y);ctx.stroke();
    for(const x of [ln.minX,ln.maxX]){
      ctx.beginPath();ctx.arc(x,ln.y,3,0,Math.PI*2);ctx.stroke();
    }
  }
  // pockets
  for(const p of POCKETS){
    ctx.fillStyle='#060606';
    ctx.beginPath();ctx.arc(p.x,p.y,POCKET_R,0,Math.PI*2);ctx.fill();
    for(let r=POCKET_R*.25;r<POCKET_R;r+=POCKET_R*.22){
      ctx.strokeStyle='rgba(30,10,0,.8)';ctx.lineWidth=.8;
      ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.stroke();
    }
    ctx.strokeStyle='rgba(212,175,55,.5)';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(p.x,p.y,POCKET_R,0,Math.PI*2);ctx.stroke();
  }
}

function drawCoin(c){
  if(c.potted&&!c._sinking) return;
  const sc=c._sinking?Math.max(0.05,1-c.sinkProgress):1;
  const al=c._sinking?Math.max(0.05,1-c.sinkProgress*.8):1;
  ctx.save();
  ctx.globalAlpha=al;
  ctx.translate(c.x,c.y); ctx.scale(sc,sc);
  ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=6;ctx.shadowOffsetY=2;
  const g=ctx.createRadialGradient(-c.r*.3,-c.r*.3,1,0,0,c.r);
  if(c.color==='black'){g.addColorStop(0,'#666');g.addColorStop(1,'#111');}
  else if(c.color==='white'){g.addColorStop(0,'#fff');g.addColorStop(1,'#ccc');}
  else{g.addColorStop(0,'#ff79b0');g.addColorStop(1,'#c2185b');}
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,0,c.r,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.strokeStyle=c.color==='black'?'#444':c.color==='white'?'#ddd':'#e91e63';
  ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(0,0,c.r,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle=c.color==='black'?'rgba(255,255,255,.1)':c.color==='white'?'rgba(0,0,0,.15)':'rgba(255,255,255,.2)';
  ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(0,0,c.r*.58,0,Math.PI*2);ctx.stroke();
  ctx.restore();
}

function drawStriker(){
  if(!striker.active) return;
  ctx.save();
  ctx.shadowColor='rgba(212,175,55,.5)';ctx.shadowBlur=12;
  ctx.translate(striker.x,striker.y);
  const g=ctx.createRadialGradient(-striker.r*.3,-striker.r*.3,1,0,0,striker.r);
  g.addColorStop(0,'#f5d56e');g.addColorStop(.5,'#c9972a');g.addColorStop(1,'#8B6914');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,0,striker.r,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(255,220,100,.85)';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(0,0,striker.r,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(0,0,striker.r*.5,0,Math.PI*2);ctx.stroke();
  ctx.restore();
}

function drawAimLine(){
  if(gameState!=='aiming') return;
  if(gameMode==='pvc'&&curP===1) return;
  const power=parseInt(el('powerSlider').value);
  const len=power*7;
  ctx.save();
  ctx.strokeStyle='rgba(212,175,55,.5)';ctx.lineWidth=1.5;ctx.setLineDash([7,5]);
  ctx.beginPath();
  ctx.moveTo(striker.x,striker.y);
  ctx.lineTo(striker.x+Math.cos(aimAngle)*len, striker.y+Math.sin(aimAngle)*len);
  ctx.stroke();ctx.setLineDash([]);
  const ex=striker.x+Math.cos(aimAngle)*len;
  const ey=striker.y+Math.sin(aimAngle)*len;
  ctx.fillStyle='rgba(212,175,55,.85)';
  ctx.beginPath();
  ctx.moveTo(ex,ey);
  ctx.lineTo(ex-Math.cos(aimAngle-.42)*11,ey-Math.sin(aimAngle-.42)*11);
  ctx.lineTo(ex-Math.cos(aimAngle+.42)*11,ey-Math.sin(aimAngle+.42)*11);
  ctx.closePath();ctx.fill();
  ctx.restore();
}

// ── GAME FLOW ────────────────────────────────────────────────────────────────
function startGame(mode){
  gameMode=mode;
  pnames=mode==='pvp'?['Player 1','Player 2']:['Player 1','Computer'];
  el('pname0').textContent=pnames[0];
  el('pname1').textContent=pnames[1];
  el('modeScreen').style.display='none';
  el('gameScreen').style.display='flex';
  resetGame();
}
function resetGame(){
  el('winScreen').style.display='none';
  cancelAnimationFrame(animFrame);
  clearTimeout(compTimer);
  scores=[0,0]; curP=0;
  pottedThisTurn=[]; sinking=[];
  initCoins(); resetStriker(); updateScores();
  gameLoop();
}
function backToMenu(){
  cancelAnimationFrame(animFrame); clearTimeout(compTimer);
  el('gameScreen').style.display='none';
  el('winScreen').style.display='none';
  el('modeScreen').style.display='flex';
  gameState='idle';
}
function humanTurn(){ return !(gameMode==='pvc'&&curP===1); }

// ── CONTROLS ─────────────────────────────────────────────────────────────────
function syncStrikerFromSlider(){
  if(gameState!=='aiming'||!humanTurn()) return;
  const ln=SL[curP];
  const t=el('posSlider').value/100;
  striker.x=ln.minX+t*(ln.maxX-ln.minX);
}
function syncAimFromSlider(){
  if(gameState!=='aiming'||!humanTurn()) return;
  const deg=parseInt(el('aimSlider').value);
  el('aimVal').textContent=deg+'°';
  const base=curP===0?-Math.PI/2:Math.PI/2;
  aimAngle=base+(deg*Math.PI/180);
}
function moveStrikerBtn(dir){
  if(gameState!=='aiming'||!humanTurn()) return;
  const ln=SL[curP];
  striker.x=Math.max(ln.minX,Math.min(ln.maxX,striker.x+dir*7));
  const t=(striker.x-ln.minX)/(ln.maxX-ln.minX);
  el('posSlider').value=Math.round(t*100);
}
function doShoot(){
  if(gameState!=='aiming'||!humanTurn()) return;
  shoot(parseInt(el('powerSlider').value), aimAngle);
}

// Wire up controls after DOM ready
el('posSlider').addEventListener('input', syncStrikerFromSlider);
el('aimSlider').addEventListener('input', syncAimFromSlider);
el('powerSlider').addEventListener('input', function(){ el('powerVal').textContent=this.value; });
el('btnL').addEventListener('click', ()=>moveStrikerBtn(-1));
el('btnR').addEventListener('click', ()=>moveStrikerBtn(1));
el('shootBtn').addEventListener('click', doShoot);

// Keyboard
document.addEventListener('keydown', e=>{
  if(gameState!=='aiming'||!humanTurn()) return;
  if(e.key==='ArrowLeft')  moveStrikerBtn(-1);
  if(e.key==='ArrowRight') moveStrikerBtn(1);
  if(e.key==='ArrowUp'){
    const s=el('aimSlider'); s.value=Math.max(-85,+s.value-3); syncAimFromSlider();
  }
  if(e.key==='ArrowDown'){
    const s=el('aimSlider'); s.value=Math.min(85,+s.value+3); syncAimFromSlider();
  }
  if(e.key===' '||e.key==='Enter'){ e.preventDefault(); doShoot(); }
});

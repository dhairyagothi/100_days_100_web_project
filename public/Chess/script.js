// ── Piece definitions ──────────────────────────────────────────────────────
const EMPTY=0,wP=1,wN=2,wB=3,wR=4,wQ=5,wK=6,bP=7,bN=8,bB=9,bR=10,bQ=11,bK=12;
const WHITE=1,BLACK=-1;
const PIECE_GLYPHS={[wP]:'♙',[wN]:'♘',[wB]:'♗',[wR]:'♖',[wQ]:'♕',[wK]:'♔',[bP]:'♟',[bN]:'♞',[bB]:'♝',[bR]:'♜',[bQ]:'♛',[bK]:'♚'};
const PIECE_VALUES={[wP]:100,[wN]:320,[wB]:330,[wR]:500,[wQ]:900,[wK]:20000,[bP]:100,[bN]:320,[bB]:330,[bR]:500,[bQ]:900,[bK]:20000};
const isWhite=p=>p>=wP&&p<=wK;
const isBlack=p=>p>=bP&&p<=bK;
const color=p=>p===EMPTY?0:isWhite(p)?WHITE:BLACK;
const type=p=>isWhite(p)?p:p-6; // 1-6

// Piece-square tables (white's perspective, mirrored for black)
const PST={
  [wP]:[ 0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
  [wN]:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
  [wB]:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
  [wR]:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
  [wQ]:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
  [wK]:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20]
};

// ── Game state ─────────────────────────────────────────────────────────────
let board=[], turn=WHITE, selected=null, legalMoves=[], history=[], flipped=false;
let gameMode='ai', aiDepth=1;
let enPassantSq=null;
let castleRights={wK:true,wQ:true,bK:true,bQ:true};
let promotionCallback=null;
let gameOver=false;
let lastMove=null;

function initBoard(){
  board=Array(64).fill(EMPTY);
  const back=[wR,wN,wB,wQ,wK,wB,wN,wR];
  for(let c=0;c<8;c++){board[rc(7,c)]=back[c];board[rc(6,c)]=wP;board[rc(1,c)]=bP;board[rc(0,c)]=back[c]+6;}
  turn=WHITE;selected=null;legalMoves=[];history=[];enPassantSq=null;
  castleRights={wK:true,wQ:true,bK:true,bQ:true};
  gameOver=false;lastMove=null;
  renderBoard();updateStatus();renderMoveList();renderCaptures();
}

const rc=(r,c)=>r*8+c;
const row=i=>Math.floor(i/8);
const col=i=>i%8;

// ── Move generation ────────────────────────────────────────────────────────
function pawnMoves(sq,b,ep,cr,checkFilter=true){
  const moves=[];const p=b[sq];const c=color(p);const dir=c===WHITE?-1:1;
  const startRow=c===WHITE?6:1;const r=row(sq),cl=col(sq);
  // forward
  const fwd=sq+dir*8;
  if(fwd>=0&&fwd<64&&b[fwd]===EMPTY){
    moves.push({from:sq,to:fwd,flags:row(fwd)===0||row(fwd)===7?'promo':''});
    const fwd2=sq+dir*16;
    if(r===startRow&&b[fwd2]===EMPTY)moves.push({from:sq,to:fwd2,flags:'ep-target'});
  }
  // captures
  for(const dc of[-1,1]){
    const nc=cl+dc;if(nc<0||nc>7)continue;
    const t=sq+dir*8+dc;
    if(t>=0&&t<64&&color(b[t])===-c)moves.push({from:sq,to:t,flags:row(t)===0||row(t)===7?'promo':''});
    if(ep!==null&&t===ep)moves.push({from:sq,to:t,flags:'ep'});
  }
  return checkFilter?moves.filter(m=>!leavesInCheck(m,b,c,ep,cr)):moves;
}

function knightMoves(sq,b,c,ep,cr){
  const moves=[];const r=row(sq),cl=col(sq);
  for(const[dr,dc] of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){
    const nr=r+dr,nc=cl+dc;
    if(nr<0||nr>7||nc<0||nc>7)continue;
    const t=rc(nr,nc);
    if(color(b[t])!==c)moves.push({from:sq,to:t,flags:''});
  }
  return moves.filter(m=>!leavesInCheck(m,b,c,ep,cr));
}

function slidingMoves(sq,b,c,dirs,ep,cr){
  const moves=[];const r=row(sq),cl=col(sq);
  for(const[dr,dc] of dirs){
    let nr=r+dr,nc=cl+dc;
    while(nr>=0&&nr<=7&&nc>=0&&nc<=7){
      const t=rc(nr,nc);
      if(color(b[t])===c)break;
      moves.push({from:sq,to:t,flags:''});
      if(b[t]!==EMPTY)break;
      nr+=dr;nc+=dc;
    }
  }
  return moves.filter(m=>!leavesInCheck(m,b,c,ep,cr));
}

function kingMoves(sq,b,c,ep,cr){
  const moves=[];const r=row(sq),cl=col(sq);
  for(const[dr,dc] of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){
    const nr=r+dr,nc=cl+dc;
    if(nr<0||nr>7||nc<0||nc>7)continue;
    const t=rc(nr,nc);
    if(color(b[t])!==c)moves.push({from:sq,to:t,flags:''});
  }
  // castling
  if(c===WHITE&&!isInCheck(b,WHITE,ep,cr)){
    if(cr.wK&&b[rc(7,5)]===EMPTY&&b[rc(7,6)]===EMPTY&&b[rc(7,7)]===wR&&!sqAttacked(rc(7,5),b,BLACK,ep)&&!sqAttacked(rc(7,6),b,BLACK,ep))
      moves.push({from:sq,to:rc(7,6),flags:'castle-k'});
    if(cr.wQ&&b[rc(7,3)]===EMPTY&&b[rc(7,2)]===EMPTY&&b[rc(7,1)]===EMPTY&&b[rc(7,0)]===wR&&!sqAttacked(rc(7,3),b,BLACK,ep)&&!sqAttacked(rc(7,2),b,BLACK,ep))
      moves.push({from:sq,to:rc(7,2),flags:'castle-q'});
  }
  if(c===BLACK&&!isInCheck(b,BLACK,ep,cr)){
    if(cr.bK&&b[rc(0,5)]===EMPTY&&b[rc(0,6)]===EMPTY&&b[rc(0,7)]===bR&&!sqAttacked(rc(0,5),b,WHITE,ep)&&!sqAttacked(rc(0,6),b,WHITE,ep))
      moves.push({from:sq,to:rc(0,6),flags:'castle-k'});
    if(cr.bQ&&b[rc(0,3)]===EMPTY&&b[rc(0,2)]===EMPTY&&b[rc(0,1)]===EMPTY&&b[rc(0,0)]===bR&&!sqAttacked(rc(0,3),b,WHITE,ep)&&!sqAttacked(rc(0,2),b,WHITE,ep))
      moves.push({from:sq,to:rc(0,2),flags:'castle-q'});
  }
  return moves.filter(m=>!leavesInCheck(m,b,c,ep,cr));
}

function allMovesFor(sq,b,ep,cr){
  const p=b[sq];if(!p)return[];
  const c=color(p);const t=type(p);
  if(t===1)return pawnMoves(sq,b,ep,cr);
  if(t===2)return knightMoves(sq,b,c,ep,cr);
  if(t===3)return slidingMoves(sq,b,c,[[-1,-1],[-1,1],[1,-1],[1,1]],ep,cr);
  if(t===4)return slidingMoves(sq,b,c,[[-1,0],[1,0],[0,-1],[0,1]],ep,cr);
  if(t===5)return slidingMoves(sq,b,c,[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]],ep,cr);
  if(t===6)return kingMoves(sq,b,c,ep,cr);
  return[];
}

function allMovesForSide(b,c,ep,cr){
  const moves=[];
  for(let i=0;i<64;i++)if(color(b[i])===c)moves.push(...allMovesFor(i,b,ep,cr));
  return moves;
}

function sqAttacked(sq,b,byColor,ep){
  // check if sq is attacked by byColor, ignoring check filtering
  for(let i=0;i<64;i++){
    const p=b[i];if(color(p)!==byColor)continue;
    const t=type(p);
    if(t===1){
      const dir=byColor===WHITE?-1:1;const cl=col(i);
      for(const dc of[-1,1]){const nc=cl+dc;if(nc<0||nc>7)continue;if(i+dir*8+dc===sq)return true;}
    } else if(t===2){
      const r=row(i),c=col(i);
      for(const[dr,dc] of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){
        const nr=r+dr,nc2=c+dc;if(nr<0||nr>7||nc2<0||nc2>7)continue;if(rc(nr,nc2)===sq)return true;
      }
    } else if(t===3||t===5){
      const dirs=[[-1,-1],[-1,1],[1,-1],[1,1]];
      for(const[dr,dc] of dirs){let nr=row(i)+dr,nc=col(i)+dc;while(nr>=0&&nr<=7&&nc>=0&&nc<=7){const s=rc(nr,nc);if(s===sq)return true;if(b[s]!==EMPTY)break;nr+=dr;nc+=dc;}}
    }
    if(t===4||t===5){
      const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
      for(const[dr,dc] of dirs){let nr=row(i)+dr,nc=col(i)+dc;while(nr>=0&&nr<=7&&nc>=0&&nc<=7){const s=rc(nr,nc);if(s===sq)return true;if(b[s]!==EMPTY)break;nr+=dr;nc+=dc;}}
    }
    if(t===6){const r=row(i),c=col(i);for(const[dr,dc] of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){const nr=r+dr,nc=c+dc;if(nr<0||nr>7||nc<0||nc>7)continue;if(rc(nr,nc)===sq)return true;}}
  }
  return false;
}

function findKing(b,c){for(let i=0;i<64;i++)if(b[i]===(c===WHITE?wK:bK))return i;return -1;}
function isInCheck(b,c,ep,cr){const k=findKing(b,c);return k===-1||sqAttacked(k,b,-c,ep);}

function applyMove(m,b,ep,cr){
  const nb=[...b];const nCR={...cr};let nEP=null;
  const p=nb[m.from];const c=color(p);const t=type(p);
  nb[m.to]=p;nb[m.from]=EMPTY;
  if(m.flags==='ep'){const epCapSq=m.to+(c===WHITE?8:-8);nb[epCapSq]=EMPTY;}
  if(m.flags==='ep-target')nEP=m.to;
  if(m.flags==='castle-k'){const r=c===WHITE?7:0;nb[rc(r,5)]=nb[rc(r,7)];nb[rc(r,7)]=EMPTY;}
  if(m.flags==='castle-q'){const r=c===WHITE?7:0;nb[rc(r,3)]=nb[rc(r,0)];nb[rc(r,0)]=EMPTY;}
  if(t===6){if(c===WHITE){nCR.wK=false;nCR.wQ=false;}else{nCR.bK=false;nCR.bQ=false;}}
  if(t===4){if(m.from===rc(7,7))nCR.wK=false;if(m.from===rc(7,0))nCR.wQ=false;if(m.from===rc(0,7))nCR.bK=false;if(m.from===rc(0,0))nCR.bQ=false;}
  return{board:nb,ep:nEP,cr:nCR};
}

function leavesInCheck(m,b,c,ep,cr){
  const{board:nb,ep:nEP,cr:nCR}=applyMove(m,b,ep,cr);
  return isInCheck(nb,c,nEP,nCR);
}

// ── SAN notation ───────────────────────────────────────────────────────────
const FILES='abcdefgh';
const sqName=i=>FILES[col(i)]+(8-row(i));
const pieceChar=p=>{const t=type(p);return t===1?'':t===2?'N':t===3?'B':t===4?'R':t===5?'Q':'K';};
function toSAN(m,b,ep,cr){
  const p=b[m.from];const t=type(p);const c=color(p);
  if(m.flags==='castle-k')return'O-O';
  if(m.flags==='castle-q')return'O-O-O';
  let san='';
  if(t!==1)san=pieceChar(p);
  // disambiguation
  if(t!==1&&t!==6){
    const same=[];
    for(let i=0;i<64;i++){if(i===m.from)continue;if(b[i]===p){const mvs=allMovesFor(i,b,ep,cr);if(mvs.some(mv=>mv.to===m.to))same.push(i);}}
    if(same.length>0){
      const sameCol=same.filter(i=>col(i)===col(m.from));
      const sameRow=same.filter(i=>row(i)===row(m.from));
      if(sameCol.length===0)san+=FILES[col(m.from)];
      else if(sameRow.length===0)san+=(8-row(m.from));
      else san+=sqName(m.from);
    }
  }
  if(t===1&&col(m.from)!==col(m.to))san+=FILES[col(m.from)];
  if(b[m.to]!==EMPTY||(t===1&&m.flags==='ep'))san+='x';
  san+=sqName(m.to);
  if(m.flags&&m.flags.startsWith('promo'))san+='=Q';
  const{board:nb,ep:nEP,cr:nCR}=applyMove(m,b,ep,cr);
  const opp=-c;
  if(allMovesForSide(nb,opp,nEP,nCR).length===0&&isInCheck(nb,opp,nEP,nCR))san+='#';
  else if(isInCheck(nb,opp,nEP,nCR))san+='+';
  return san;
}

// ── Make a move ────────────────────────────────────────────────────────────
function makeMove(m,promoChoice=null){
  const san=toSAN(m,board,enPassantSq,castleRights);
  const{board:nb,ep:nEP,cr:nCR}=applyMove(m,board,enPassantSq,castleRights);
  // promotion
  if(m.flags&&m.flags.startsWith('promo')){
    const promoPiece=promoChoice||(turn===WHITE?wQ:bQ);
    nb[m.to]=promoPiece;
  }
  history.push({board:[...board],ep:enPassantSq,cr:{...castleRights},turn,move:m,san,lastMove});
  board=nb;enPassantSq=nEP;castleRights=nCR;turn=-turn;lastMove=m;
  selected=null;legalMoves=[];
  renderBoard();updateStatus();renderMoveList();renderCaptures();
}

// ── AI ─────────────────────────────────────────────────────────────────────
function evaluate(b){
  let score=0;
  for(let i=0;i<64;i++){
    const p=b[i];if(!p)continue;
    const c=color(p);const t=type(p);const val=PIECE_VALUES[p];
    const pst=PST[c===WHITE?p:t];
    const pstIdx=c===WHITE?i:(7-row(i))*8+col(i);
    score+=c*(val+(pst?pst[pstIdx]:0));
  }
  return score;
}

function minimax(b,depth,alpha,beta,maxing,ep,cr){
  const c=maxing?WHITE:BLACK;
  const moves=allMovesForSide(b,c,ep,cr);
  if(depth===0||moves.length===0){
    if(moves.length===0){
      if(isInCheck(b,c,ep,cr))return maxing?-100000:100000;
      return 0;
    }
    return evaluate(b);
  }
  // move ordering: captures first
  moves.sort((a,b2)=>(b[b2.to]?1:0)-(b[a.to]?1:0));
  if(maxing){
    let best=-Infinity;
    for(const m of moves){
      const{board:nb,ep:nEP,cr:nCR}=applyMove(m,b,ep,cr);
      const v=minimax(nb,depth-1,alpha,beta,false,nEP,nCR);
      best=Math.max(best,v);alpha=Math.max(alpha,v);
      if(beta<=alpha)break;
    }
    return best;
  } else {
    let best=Infinity;
    for(const m of moves){
      const{board:nb,ep:nEP,cr:nCR}=applyMove(m,b,ep,cr);
      const v=minimax(nb,depth-1,alpha,beta,true,nEP,nCR);
      best=Math.min(best,v);beta=Math.min(beta,v);
      if(beta<=alpha)break;
    }
    return best;
  }
}

function aiMove(){
  if(gameOver)return;
  document.getElementById('thinking').classList.add('show');
  setTimeout(()=>{
    const moves=allMovesForSide(board,BLACK,enPassantSq,castleRights);
    if(!moves.length)return;
    let best=-Infinity,bestMove=null;
    const shuffled=[...moves].sort(()=>Math.random()-0.5);
    for(const m of shuffled){
      const{board:nb,ep:nEP,cr:nCR}=applyMove(m,board,enPassantSq,castleRights);
      const v=-minimax(nb,aiDepth-1,-Infinity,Infinity,true,nEP,nCR);
      if(v>best){best=v;bestMove=m;}
    }
    document.getElementById('thinking').classList.remove('show');
    if(bestMove)makeMove(bestMove);
  },30);
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderBoard(){
  const boardEl=document.getElementById('board');
  boardEl.innerHTML='';
  const checkedKingSq=isInCheck(board,turn,enPassantSq,castleRights)?findKing(board,turn):-1;
  for(let vi=0;vi<64;vi++){
    const i=flipped?63-vi:vi;
    const r=row(i),c=col(i);
    const isLight=(r+c)%2===0;
    const sq=document.createElement('div');
    sq.className='sq '+(isLight?'light':'dark');
    sq.dataset.sq=i;
    if(selected===i)sq.classList.add('selected');
    if(lastMove&&(lastMove.from===i||lastMove.to===i))sq.classList.add('last-move');
    if(i===checkedKingSq)sq.classList.add('in-check');
    if(legalMoves.some(m=>m.to===i)){
      sq.classList.add('move-hint');
      const dot=document.createElement('div');
      dot.className=board[i]!==EMPTY?'dot capture':'dot';
      sq.appendChild(dot);
    }
    if(board[i]){
      const piece=document.createElement('div');
      piece.className='piece';
      piece.textContent=PIECE_GLYPHS[board[i]];
      sq.appendChild(piece);
    }
    sq.addEventListener('click',()=>handleClick(i));
    boardEl.appendChild(sq);
  }
  // rank/file labels
  const rl=document.getElementById('rank-labels');
  rl.innerHTML='';
  for(let r=0;r<8;r++){
    const s=document.createElement('span');
    s.textContent=flipped?r+1:8-r;
    rl.appendChild(s);
  }
  const fl=document.getElementById('file-labels');
  fl.innerHTML='';
  for(let c=0;c<8;c++){
    const s=document.createElement('span');
    s.textContent=FILES[flipped?7-c:c];
    fl.appendChild(s);
  }
}

function updateStatus(){
  const el=document.getElementById('status');
  const moves=allMovesForSide(board,turn,enPassantSq,castleRights);
  if(moves.length===0){
    if(isInCheck(board,turn,enPassantSq,castleRights)){
      const winner=turn===WHITE?'Black':'White';
      el.textContent=`Checkmate — ${winner} wins!`;
      el.className='status-bar danger';
    } else {
      el.textContent='Stalemate — draw!';
      el.className='status-bar alert';
    }
    gameOver=true;return;
  }
  if(isInCheck(board,turn,enPassantSq,castleRights)){
    el.textContent=`${turn===WHITE?'White':'Black'} is in check!`;
    el.className='status-bar danger';
  } else {
    el.textContent=`${turn===WHITE?'White':'Black'} to move`;
    el.className='status-bar';
  }
}

function renderMoveList(){
  const el=document.getElementById('move-list');
  el.innerHTML='';
  const moves=history.filter((_,i)=>true);
  for(let i=0;i<moves.length;i+=2){
    const pair=document.createElement('div');
    pair.className='move-pair';
    const num=document.createElement('span');
    num.className='move-num';num.textContent=(i/2+1)+'.';
    pair.appendChild(num);
    const w=document.createElement('span');
    w.className='move-san'+(i===moves.length-1?' current':'');
    w.textContent=moves[i].san;pair.appendChild(w);
    if(moves[i+1]){
      const b=document.createElement('span');
      b.className='move-san'+(i+1===moves.length-1?' current':'');
      b.textContent=moves[i+1].san;pair.appendChild(b);
    }
    el.appendChild(pair);
  }
  el.scrollTop=el.scrollHeight;
}

function renderCaptures(){
  const wCap=[],bCap=[];
  const init=[wR,wN,wB,wQ,wK,wB,wN,wR,wP,wP,wP,wP,wP,wP,wP,wP,bP,bP,bP,bP,bP,bP,bP,bP,bR,bN,bB,bQ,bK,bB,bN,bR];
  const count={};init.forEach(p=>{count[p]=(count[p]||0)+1;});
  board.forEach(p=>{if(p)count[p]=(count[p]||0)-1;});
  let wMat=0,bMat=0;
  for(const [p,cnt] of Object.entries(count)){
    if(cnt<=0)continue;
    const c=color(Number(p));
    for(let i=0;i<cnt;i++){
      if(c===WHITE)bCap.push(PIECE_GLYPHS[Number(p)]);
      else wCap.push(PIECE_GLYPHS[Number(p)]);
    }
    if(c===WHITE)bMat+=PIECE_VALUES[Number(p)]*cnt;
    else wMat+=PIECE_VALUES[Number(p)]*cnt;
  }
  document.getElementById('white-captured').textContent=wCap.join('');
  document.getElementById('black-captured').textContent=bCap.join('');
  document.getElementById('white-material').textContent=wMat>bMat?`+${wMat-bMat}`:'';
  document.getElementById('black-material').textContent=bMat>wMat?`+${bMat-wMat}`:'';
}

// ── Input handling ─────────────────────────────────────────────────────────
function handleClick(i){
  if(gameOver)return;
  if(gameMode==='ai'&&turn===BLACK)return;
  if(selected!==null){
    const move=legalMoves.find(m=>m.to===i);
    if(move){
      if(move.flags&&move.flags.startsWith('promo')){
        showPromo(move);
      } else {
        makeMove(move);
        if(gameMode==='ai'&&!gameOver&&turn===BLACK)setTimeout(aiMove,100);
      }
      return;
    }
  }
  if(color(board[i])===turn){
    selected=i;
    legalMoves=allMovesFor(i,board,enPassantSq,castleRights);
  } else {
    selected=null;legalMoves=[];
  }
  renderBoard();
}

function showPromo(move){
  const overlay=document.getElementById('promo-overlay');
  const piecesEl=document.getElementById('promo-pieces');
  piecesEl.innerHTML='';
  const promoOptions=turn===WHITE?[wQ,wR,wB,wN]:[bQ,bR,bB,bN];
  promoOptions.forEach(p=>{
    const btn=document.createElement('button');
    btn.className='promo-btn';
    btn.textContent=PIECE_GLYPHS[p];
    btn.onclick=()=>{
      overlay.classList.remove('show');
      makeMove(move,p);
      if(gameMode==='ai'&&!gameOver&&turn===BLACK)setTimeout(aiMove,100);
    };
    piecesEl.appendChild(btn);
  });
  overlay.classList.add('show');
}

// ── Controls ───────────────────────────────────────────────────────────────
document.getElementById('btn-new').onclick=initBoard;
document.getElementById('btn-flip').onclick=()=>{flipped=!flipped;renderBoard();};
document.getElementById('btn-undo').onclick=()=>{
  if(gameOver){gameOver=false;}
  let steps=gameMode==='ai'&&history.length>=2?2:1;
  while(steps-->0&&history.length>0){
    const prev=history.pop();
    board=prev.board;enPassantSq=prev.ep;castleRights=prev.cr;turn=prev.turn;lastMove=prev.lastMove;
  }
  selected=null;legalMoves=[];
  renderBoard();updateStatus();renderMoveList();renderCaptures();
};

function setMode(m){
  gameMode=m;
  document.getElementById('mode-ai').classList.toggle('active',m==='ai');
  document.getElementById('mode-2p').classList.toggle('active',m==='2p');
  document.getElementById('diff-row').style.opacity=m==='ai'?'1':'0.3';
  initBoard();
}

function setDiff(d){
  aiDepth=d;
  ['easy','med','hard'].forEach(id=>{
    document.getElementById('diff-'+id).classList.remove('active');
  });
  document.getElementById(d===1?'diff-easy':d===3?'diff-med':'diff-hard').classList.add('active');
}

// keyboard
document.addEventListener('keydown',e=>{
  if(e.key==='n'||e.key==='N')initBoard();
  if(e.key==='f'||e.key==='F'){flipped=!flipped;renderBoard();}
  if(e.key==='u'||e.key==='U')document.getElementById('btn-undo').click();
});

initBoard();
//enhance: Code format and readability 
import './App.css'
import { useState, useEffect } from "react";
import { updateStats } from "./utils/stats";
// data imports
import characters from "./data-set/characters.json";
import questions from "./data-set/questions.json"
import StatsDashboard from "./components/StatsDashboard";
// function imports
import { findchar, bestQues } from './utils/gameEngine.js'
import BackButton from "./BackButton.jsx"
import ThemeToggle from './components/ThemeToggle.jsx';

// image imports
import gennie from "./assets/gennie.png"
import thinking_gennie from "./assets/thinking.png"
import lastgennie from "./assets/ansfound.png"
import gameover from "./assets/gameover.png"



function App() {
  let [curQue, setque] = useState(0); //stores index of current question
  const [qcount, setqcount] = useState(0); //stores count of questions asked
  let [remainingchar, setremainingchar] = useState(characters); //stores remaining characters
  let [ans, setans] = useState(''); //stores answer
  const [playstate, playset] = useState('notplaying'); //stores play state
  const [gstate, setstate] = useState(gennie); //stores gennie image
  let cardContent;
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
});
useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
}, [theme]);
  //when answer is found
  if (ans !== '' && playstate == 'playing') {
    cardContent = (
      <div>
        <p className='question'> i read your mind <br /> it must be {ans}</p>
        <button className='btn' onClick={() => {
          setans('')
          setque(0)
          setqcount(0)
          setremainingchar(characters)
          setstate(gennie)
          playset("notplaying");
        }}>restart</button>
      </div>
    )
  }
  //when game ends in loss
  else if (playstate == 'gameover') {
    cardContent = (
      <div>
        <p className='question'>No character found</p>
        <p className='question'>You defeated me</p>
        <button className='btn' onClick={() => {
          setans('')
          setque(0)
          setqcount(0)
          setremainingchar(characters)
          setstate(gennie)
          playset("notplaying");
        }}>restart</button>
      </div>
    )
  }
  //main playing screen
  else if (playstate == 'playing') {
    cardContent = (
      <div>
        <p className='question'>{questions[curQue].question}</p>
        <p>remaining characters: {remainingchar.length}</p>
        <p>questions asked: {qcount}/20</p>
        <div className="btn-box">
          {/* yes button */}
          <button className='btn' onClick={() => {
            setqcount(qcount + 1);
            const newremainingchar = findchar(true, questions[curQue].key, remainingchar);
            if (newremainingchar.length !== 1) {
              let nextQue = bestQues(questions, newremainingchar);
              if (nextQue === undefined) {
                updateStats("genie", qcount + 1);
                setans(newremainingchar[0].name);
                setstate(lastgennie);
              }
              else {
                let nextQueIndex = questions.findIndex(q => q.key === nextQue);
                setque(nextQueIndex);
                setremainingchar(newremainingchar)
                playset('thinking');
                setstate(thinking_gennie);
                setTimeout(() => {
                  if (newremainingchar.length == 0 || qcount + 1 == questions.length) {
                    updateStats("player", qcount + 1);
                    setstate(gameover)
                    playset('gameover');
                  } else {
                    playset('playing');
                    setstate(gennie)
                  }
                }, 2000);
              }
            } else {
              updateStats("genie", qcount + 1);
              setans(newremainingchar[0].name);
              setstate(lastgennie);
            }
          }}>yes
          </button>
          {/* no button */}
          <button className='btn' onClick={() => {
            setqcount(qcount + 1);
            const newremainingchar = findchar(false, questions[curQue].key, remainingchar);
            if (newremainingchar.length !== 1) {
              let nextQue = bestQues(questions, newremainingchar);
              if (nextQue === undefined) {
                updateStats("genie", qcount + 1);
                setans(newremainingchar[0].name);
                setstate(lastgennie);
              }
              else {
                let nextQueIndex = questions.findIndex(q => q.key === nextQue);
                setque(nextQueIndex);
                setremainingchar(newremainingchar)
                playset('thinking');
                if (remainingchar.length == 0 || qcount == questions.length) {
                  updateStats("player", qcount + 1);
                  setstate(gameover)
                  playset('gameover')
                }
                setstate(thinking_gennie);
                setTimeout(() => {
                  if (newremainingchar.length == 0 || qcount + 1 == questions.length) {
                    updateStats("player", qcount + 1);
                    setstate(gameover)
                    playset('gameover');
                  }
                  else {
                    playset('playing');
                    setstate(gennie)
                  }
                }, 2000);
                // console.log(remainingchar) commented out for debugging purposes
              }
            } else {
              updateStats("genie", qcount + 1);
              setans(newremainingchar[0].name);
              setstate(lastgennie);
            }
          }}>no</button>
          {/* dontknow button */}
          <button className="btn" onClick={() => {
            setqcount(qcount + 1);
            let nextQue = bestQues(questions.slice(curQue + 1), remainingchar);
            if (nextQue === undefined) {
              if (remainingchar.length === 1) {
                updateStats("genie", qcount + 1);
                setans(remainingchar[0].name);
                setstate(lastgennie);
              }
              else {
                updateStats("player", qcount + 1);
                setstate(gameover);
                playset('gameover');
              }
            }
            else {
              let nextQueIndex = questions.findIndex(q => q.key === nextQue);
              setque(nextQueIndex);
              setremainingchar(remainingchar)
              playset('thinking');
              setstate(thinking_gennie);
              setTimeout(() => {
                if (remainingchar.length == 0 || qcount + 1 == questions.length) {
                  updateStats("player", qcount + 1);
                  setstate(gameover)
                  playset('gameover');
                }
                else {
                  playset('playing');
                  setstate(gennie)
                }
              }, 2000);
              // console.log(remainingchar) Commented out for debugging purposes
            }
          }}>Don't know</button>
        </div>
      </div>
    )
  }else if (playstate === "stats") {
  cardContent = (
    <StatsDashboard
      onBack={() => playset("notplaying")}
    />
  );
}
  //how to play card
  else if (playstate == 'working') {
    cardContent = (
      <div>
        <h2 className='question'>How to Play</h2>
       <p className="instructions">
          <strong>1.</strong> Think of a character from the anime universe.<br />
          <strong>2.</strong> I will ask you a series of Yes or No questions.<br />
          <strong>3.</strong> Answer honestly to help me narrow down the list.<br />
          <br />
          <em>Let's see if my magic can read your mind!</em>
        </p>
        <button className='btn' onClick={() => { playset('notplaying') }}>Back</button>
      </div>
    )
  } else if (playstate === "thinking") {
  cardContent = (
    <div className='spinner'>
    </div>
  )
} else {
  cardContent = (
          <div>
            <p className='question'>Let's read your mind! </p>
            <ThemeToggle
            theme={theme}
            setTheme={setTheme}
          />
            <button
        className="btn"
        onClick={() => playset("stats")}
      >
        Statistics
      </button>
        <button className="btn" onClick={() => { playset('working') }}>how to play</button>
        <button className='btn' onClick={() => { playset('playing') }}>Play!</button>
      </div>
    )
  }
  return (
    <div className="background">
      <BackButton />
      <div className='title-box'>
        <h1 className='main-title'>AKINATOR</h1>
        <img src={gstate} alt="" className='gennie' />
      </div>
      <div className="card">
        {cardContent}
      </div>
    </div>
  )
}

export default App

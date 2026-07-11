//enhance: Code format and readability 
import './App.css'
import { useState } from 'react';

// data imports
import characters from "./data-set/characters.json";
import questions from "./data-set/questions.json"

// function imports
import { findchar, bestQues } from './utils/gameEngine.js'
import BackButton from "./BackButton.jsx"

// image imports
import gennie from "./assets/gennie.png"
import thinking_gennie from "./assets/thinking.png"
import lastgennie from "./assets/ansfound.png"
import gameover from "./assets/gameover.png"

function App() {
  // Index of the currently displayed question.
  let [curQue, setque] = useState(0);
  // Number of questions answered in the current round.
  const [qcount, setqcount] = useState(0);
  // Characters that still match the player's answers.
  let [remainingchar, setremainingchar] = useState(characters);
  // Final guessed answer once the game identifies a character.
  let [ans, setans] = useState('');
  // Current screen/state of the game flow.
  const [playstate, playset] = useState('notplaying');
  // Genie image shown for the current state.
  const [gstate, setstate] = useState(gennie);
  let cardContent;
  // Winning state: a single character has been identified.
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
        }}>restart</button>
      </div>
    )
  }
  // Losing state: no valid character could be found.
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
        }}>restart</button>
      </div>
    )
  }
  // Main gameplay screen with the active question and answers.
  else if (playstate == 'playing') {
    cardContent = (
      <div>
        <p className='question'>{questions[curQue].question}</p>
        <p>remaining characters: {remainingchar.length}</p>
        <p>questions asked: {qcount}/20</p>
        <div className="btn-box">
          {/* Yes narrows the remaining characters using the current question. */}
          <button className='btn' onClick={() => {
            setqcount(qcount + 1);
            const newremainingchar = findchar(true, questions[curQue].key, remainingchar);
            if (newremainingchar.length !== 1) {
              let nextQue = bestQues(questions, newremainingchar);
              if (nextQue === undefined) {
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
                    setstate(gameover)
                    playset('gameover');
                  } else {
                    playset('playing');
                    setstate(gennie)
                  }
                }, 2000);
              }
            } else {
              setans(newremainingchar[0].name);
              setstate(lastgennie);
            }
          }}>yes
          </button>
          {/* No narrows the remaining characters using the opposite answer. */}
          <button className='btn' onClick={() => {
            setqcount(qcount + 1);
            const newremainingchar = findchar(false, questions[curQue].key, remainingchar);
            if (newremainingchar.length !== 1) {
              let nextQue = bestQues(questions, newremainingchar);
              if (nextQue === undefined) {
                setans(newremainingchar[0].name);
                setstate(lastgennie);
              }
              else {
                let nextQueIndex = questions.findIndex(q => q.key === nextQue);
                setque(nextQueIndex);
                setremainingchar(newremainingchar)
                playset('thinking');
                // End the game if there are no candidates or no questions left.
                if (remainingchar.length == 0 || qcount == questions.length) {
                  setstate(gameover)
                  playset('gameover')
                }
                setstate(thinking_gennie);
                setTimeout(() => {
                  if (newremainingchar.length == 0 || qcount + 1 == questions.length) {
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
              setans(newremainingchar[0].name);
              setstate(lastgennie);
            }
          }}>no</button>
          {/* Don't know asks the engine to pick the best next question. */}
          <button className="btn" onClick={() => {
            setqcount(qcount + 1);
            let nextQue = bestQues(questions.slice(curQue + 1), remainingchar);
            if (nextQue === undefined) {
              if (remainingchar.length === 1) {
                setans(remainingchar[0].name);
                setstate(lastgennie);
              }
              else {
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
  }
  // Instructions screen describing how to play.
  else if (playstate == 'working') {
    cardContent = (
      <div>
        <h2 className='question'>How to Play</h2>
        <p style={{ fontSize: '18px', color: '#2c2c2c', lineHeight: '1.8', marginBottom: '30px', textAlign: 'left', padding: '0 20px' }}>
          <strong>1.</strong> Think of a character from the anime universe.<br />
          <strong>2.</strong> I will ask you a series of Yes or No questions.<br />
          <strong>3.</strong> Answer honestly to help me narrow down the list.<br />
          <br />
          <em>Let's see if my magic can read your mind!</em>
        </p>
        <button className='btn' onClick={() => { playset('notplaying') }}>Back</button>
      </div>
    )
  }
  // Spinner shown while the app is thinking.
  else if (playstate == 'thinking') {
    cardContent = (
      <div className='spinner'>
      </div>
    )
  }
  // Landing screen shown before gameplay starts.
  else {
    cardContent = (
      <div>
        <p className='question'>Let's read your mind! </p>
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

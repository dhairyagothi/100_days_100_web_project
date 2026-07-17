import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from "nanoid";
import { useStopwatch } from 'react-timer-hook';
import Die from "./components/Die";
import confetti from 'canvas-confetti';
export default function App() {
    const { seconds, minutes, hours, start, pause, reset: resetTimer, iRunning } = useStopwatch({ autoStart: false });
    const [dicestate, setdicestate] = useState(() => generateallnewdice());
    const [rolls, setrolls] = useState(0);
    const [bestRolls, setBestRolls] = useState(() => localStorage.getItem("bestRolls") || null);
    const [bestTime, setBestTime] = useState(() => localStorage.getItem("bestTime") || null);

    const buttonref = useRef(null);

    
    function createNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        };
    }

    function generateallnewdice() {
        return new Array(10).fill(0).map(() => createNewDie());
    }

    const gamewon = dicestate.every(die => die.isHeld) && 
                    dicestate.every(die => die.value === dicestate[0].value);

    useEffect(() => {
        if (gamewon) {
            pause(); 
            buttonref.current.focus();
            const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
            if (!bestRolls || rolls < parseInt(bestRolls)) {
                localStorage.setItem("bestRolls", rolls);
                setBestRolls(rolls);
            }

            if (!bestTime || totalSeconds < parseInt(bestTime)) {
                localStorage.setItem("bestTime", totalSeconds);
                setBestTime(totalSeconds);
            }
        }
    }, [gamewon, rolls, hours, minutes, seconds, bestRolls, bestTime, pause]);

    function rolldice() {
        if (rolls === 0) {
            start();
        }

        setdicestate(olddice => olddice.map(die =>
            die.isHeld ? die : createNewDie()
        ));
        setrolls(oldrolls => oldrolls + 1);
    }

    function hold(id) {
        if (rolls === 0 && !iRunning) {
            start();
        }
        
        if (!gamewon) {
            setdicestate(oldone => oldone.map(die => {
                return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
            }));
        }
    }

    function reset() {
        setdicestate(generateallnewdice());
        resetTimer(0, false); 
        setrolls(0);
    }

    function formatBestTime(totalSecs) {
        if (!totalSecs) return "--:--";
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    const diceelements = dicestate.map((num, index) => (
        <Die 
            key={num.id} 
            value={num.value} 
            isHeld={num.isHeld}
            id={num.id}  
            hold={hold}
            disabled={gamewon}
        />
    ));

    return (
        <main>
            <h1 className="game-title">Let's Play a Game!</h1>
            
            <p className="rules">
                Roll the dice until all dice show the same face. 
                Click each die to freeze it at its current value between rolls.
            </p>
            
            <div className="timer-container">
                <h2 className="time">Time: {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</h2>
                <h2>Rolls: {rolls}</h2>
            </div>

            <div className="high-score-container">
                <p>🏆 Personal Best — Rolls: <strong>{bestRolls || "-"}</strong> | Time: <strong>{formatBestTime(bestTime)}</strong></p>
            </div>

            <div className="dice-container">
               {diceelements}
            </div>

            <div className="button-display">
                {gamewon ?
                    <button ref={buttonref} className="roll-dice" onClick={reset}>Reset Game</button> :
                    <button ref={buttonref} className="roll-dice" onClick={rolldice}>Roll</button>
                }
            </div>

            {gamewon && <h3 className="congratulations">🎉 Congratulations! You Won!</h3>}
        </main>
    );
}
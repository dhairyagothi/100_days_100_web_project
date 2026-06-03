import React, { useEffect, useMemo, useReducer, useState, useRef, useCallback } from "react";
import WordDisplay from "./WordDisplay";
import Keyboard from "./Keyboard";
import HangmanSVG from "./HangmanSVG";
import HintsPanel from "./HintsPanel";
import type { DictResult } from "../hooks/useDictionary";
import useDictionary from "../hooks/useDictionary";
import { pickRandomWord } from "../utils/words";

export type GameStatus = "PLAYING" | "WON" | "LOST";

type State = {
  word: string;
  guessedLetters: string[];
  wrongCount: number;
  status: GameStatus;
  revealLevel: number; // 0, 1, 2
  hintData?: DictResult | null;
};

type Action =
  | { type: "START_GAME"; word: string; hintData?: DictResult | null }
  | { type: "MAKE_GUESS"; letter: string }
  | { type: "REVEAL_HINT" }
  | { type: "SET_HINT_DATA"; hintData: DictResult | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_GAME":
      return {
        word: action.word,
        guessedLetters: [],
        wrongCount: 0,
        status: "PLAYING",
        revealLevel: 0,
        hintData: action.hintData ?? null
      };
    case "MAKE_GUESS": {
      if (state.status !== "PLAYING") return state;
      const letter = action.letter.toLowerCase();
      if (state.guessedLetters.includes(letter)) return state;

      const guessedLetters = [...state.guessedLetters, letter];

      // Compute if all alphabet letters of the word are guessed
      const revealedAll = state.word.split("").every(ch => {
        if (!/^[a-zA-Z]$/.test(ch)) return true; // non-letters are pre-revealed
        return guessedLetters.includes(ch.toLowerCase());
      });

      const wrong = state.word.toLowerCase().includes(letter) ? state.wrongCount : state.wrongCount + 1;
      const status = revealedAll ? "WON" : wrong >= 6 ? "LOST" : "PLAYING";

      return { ...state, guessedLetters, wrongCount: wrong, status };
    }
    case "REVEAL_HINT": {
      const next = Math.min(2, state.revealLevel + 1);
      return { ...state, revealLevel: next };
    }
    case "SET_HINT_DATA":
      return { ...state, hintData: action.hintData };
    default:
      return state;
  }
}

export default function Game() {
  const { fetchDefinition } = useDictionary();
  const initialWord = useMemo(() => pickRandomWord(), []);
  const [state, dispatch] = useReducer(reducer, {
    word: initialWord,
    guessedLetters: [],
    wrongCount: 0,
    status: "PLAYING",
    revealLevel: 0,
    hintData: null
  });

  const [loadingHint, setLoadingHint] = useState(false);
  const mountedRef = useRef(true);

  // prefetch cache to avoid repeated dictionary API requests
  const prefetchRef = useRef<Record<string, DictResult | null>>({});

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // fetch hints when word changes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingHint(true);
      try {
        const key = state.word.toLowerCase();
        if (prefetchRef.current[key] !== undefined) {
          const cached = prefetchRef.current[key];
          if (!cancelled) dispatch({ type: "START_GAME", word: state.word, hintData: cached ?? null });
          return;
        }

        const h = await fetchDefinition(state.word);
        if (!cancelled) dispatch({ type: "START_GAME", word: state.word, hintData: h });
      } catch (err) {
        console.warn("hint load error", err);
      } finally {
        if (!cancelled) setLoadingHint(false);
      }
    }
    load();

    // prefetch next word definition
    (async () => {
      try {
        const next = pickRandomWord();
        const k = next.toLowerCase();
        if (!prefetchRef.current[k]) {
          const h2 = await fetchDefinition(next);
          prefetchRef.current[k] = h2 ?? null;
        }
      } catch {
        // ignore errors silently
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.word, fetchDefinition]);

  // Stable callback for making guesses, ensuring no race conditions or stale event closures
  const handleGuess = useCallback((letter: string) => {
    dispatch({ type: "MAKE_GUESS", letter });
  }, []);

  // Physical keyboard listener
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const k = e.key.toLowerCase();
      if (/^[a-z]$/.test(k)) {
        handleGuess(k);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleGuess]);

  const handleRevealHint = useCallback(() => {
    // If first reveal, treat first letter as correct guess to show it visually and count in win calculation
    if (state.revealLevel === 0) {
      const first = state.word[0]?.toLowerCase();
      if (first && /^[a-z]$/.test(first) && !state.guessedLetters.includes(first)) {
        dispatch({ type: "MAKE_GUESS", letter: first });
      }
    }
    dispatch({ type: "REVEAL_HINT" });
  }, [state.revealLevel, state.word, state.guessedLetters]);

  const handleReset = useCallback(() => {
    const newWord = pickRandomWord();
    setLoadingHint(true);
    fetchDefinition(newWord)
      .then(h => {
        prefetchRef.current[newWord.toLowerCase()] = h ?? null;
        dispatch({ type: "START_GAME", word: newWord, hintData: h });
      })
      .catch(() => {
        dispatch({ type: "START_GAME", word: newWord, hintData: null });
      })
      .finally(() => {
        if (mountedRef.current) setLoadingHint(false);
      });
  }, [fetchDefinition]);

  return (
    <main className="game-root">
      <header className="topbar">
        <div className="title-group">
          <h1>Hangman</h1>
          <span className="subtitle">Universe</span>
        </div>
        <div className="controls">
          <button
            onClick={handleRevealHint}
            className="btn btn--hint"
            disabled={state.revealLevel >= 2 || state.status !== "PLAYING"}
          >
            Reveal Hint
          </button>
          <button onClick={handleReset} className="btn btn--reset">
            New Word
          </button>
        </div>
      </header>

      <section className="game-area">
        <div className="card-panel left-panel">
          <HangmanSVG wrongCount={state.wrongCount} />
        </div>

        <div className="card-panel center-panel">
          <WordDisplay
            word={state.word}
            guessedLetters={state.guessedLetters}
            revealFirst={state.revealLevel >= 1}
          />
          
          <div className="status-display">
            {state.status === "WON" && (
              <div className="status-alert win-alert animate-fade-in">
                <span>You Won! 🎉 Excellent guess.</span>
              </div>
            )}
            {state.status === "LOST" && (
              <div className="status-alert lose-alert animate-fade-in">
                <span>You Lost — the word was <strong className="correct-word">{state.word}</strong></span>
              </div>
            )}
            <div className="attempts-badge">
              Attempts left: <span className="remaining-count">{6 - state.wrongCount}</span>
            </div>
          </div>

          <Keyboard
            onGuess={handleGuess}
            word={state.word}
            guessedLetters={state.guessedLetters}
            disabled={state.status !== "PLAYING"}
          />
        </div>

        <div className="card-panel right-panel">
          <HintsPanel
            hintData={state.hintData ?? null}
            revealLevel={state.revealLevel}
            word={state.word}
            loading={loadingHint}
          />
        </div>
      </section>
    </main>
  );
}


import React, { useEffect, useMemo, useReducer, useState, useRef } from "react";
import WordDisplay from "./WordDisplay";
import Keyboard from "./Keyboard";
import HangmanSVG from "./HangmanSVG";
import HintsPanel from "./HintsPanel";
import type { DictResult } from "../hooks/useDictionary";
import useDictionary from "../hooks/useDictionary";
import { pickRandomWord } from "../utils/words";

type State = {
  word: string;
  guessed: Set<string>;
  wrongCount: number;
  status: "playing" | "won" | "lost";
  revealLevel: number; // 0,1,2
  hintData?: DictResult | null;
};

type Action =
  | { type: "init"; word: string; hintData?: DictResult | null }
  | { type: "guess"; letter: string }
  | { type: "revealHint" }
  | { type: "reset"; word: string; hintData?: DictResult | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init":
      return {
        word: action.word,
        guessed: new Set<string>(),
        wrongCount: 0,
        status: "playing",
        revealLevel: 0,
        hintData: action.hintData ?? null
      };
    case "guess": {
      if (state.status !== "playing") return state;
      const letter = action.letter.toLowerCase();
      if (state.guessed.has(letter)) return state;
      const guessed = new Set(state.guessed);
      guessed.add(letter);
      // compute revealedAll considering guessed set
      const revealedAll = state.word.split("").every(ch => {
        if (!/^[a-zA-Z]$/.test(ch)) return true; // non-letters considered revealed
        return guessed.has(ch.toLowerCase());
      });
      const wrong = state.word.includes(letter) ? state.wrongCount : state.wrongCount + 1;
      const status = revealedAll ? "won" : wrong >= 6 ? "lost" : "playing";
      return { ...state, guessed, wrongCount: wrong, status };
    }
    case "revealHint": {
      const next = Math.min(2, state.revealLevel + 1);
      return { ...state, revealLevel: next };
    }
    case "reset":
      return {
        word: action.word,
        guessed: new Set<string>(),
        wrongCount: 0,
        status: "playing",
        revealLevel: 0,
        hintData: action.hintData ?? null
      };
    default:
      return state;
  }
}

export default function Game() {
  const { fetchDefinition } = useDictionary();
  const initialWord = useMemo(() => pickRandomWord(), []);
  const [state, dispatch] = useReducer(reducer, {
    word: initialWord,
    guessed: new Set<string>(),
    wrongCount: 0,
    status: "playing",
    revealLevel: 0,
    hintData: null
  });

  const [loadingHint, setLoadingHint] = useState(false);
  const mountedRef = useRef(true);

  // keep a small prefetch cache in memory to avoid repeated fetches in same session
  const prefetchRef = useRef<Record<string, DictResult | null>>({});

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // fetch hint when word changes (initial load and resets)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingHint(true);
      try {
        // check prefetch memory cache first
        const key = state.word.toLowerCase();
        if (prefetchRef.current[key] !== undefined) {
          const cached = prefetchRef.current[key];
          if (!cancelled) dispatch({ type: "init", word: state.word, hintData: cached ?? null });
          return;
        }

        const h = await fetchDefinition(state.word);
        if (!cancelled) dispatch({ type: "init", word: state.word, hintData: h });
      } catch (err) {
        // swallow — UI will show "no definition" if null
        console.warn("hint load error", err);
      } finally {
        if (!cancelled) setLoadingHint(false);
      }
    }
    load();

    // prefetch a next random word in background (non-blocking)
    (async () => {
      try {
        const next = pickRandomWord();
        const k = next.toLowerCase();
        if (!prefetchRef.current[k]) {
          const h2 = await fetchDefinition(next);
          prefetchRef.current[k] = h2 ?? null;
        }
      } catch {
        // ignore prefetch errors
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.word]);

  // keyboard input
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (state.status !== "playing") return;
      const k = e.key.toLowerCase();
      if (/^[a-z]$/.test(k)) dispatch({ type: "guess", letter: k });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.status]);

  function handleGuess(letter: string) {
    dispatch({ type: "guess", letter: letter.toLowerCase() });
  }

  function handleRevealHint() {
    // If this is the first reveal (revealLevel === 0), treat the first letter as a real guessed letter
    if (state.revealLevel === 0) {
      const first = state.word[0]?.toLowerCase();
      if (first && /^[a-z]$/.test(first) && !state.guessed.has(first)) {
        // dispatch guess for the first letter so win detection works
        dispatch({ type: "guess", letter: first });
      }
    }
    // then increment reveal level (visual + second hint)
    dispatch({ type: "revealHint" });
  }

  function handleReset() {
    const newWord = pickRandomWord();
    setLoadingHint(true);
    fetchDefinition(newWord)
      .then(h => {
        // store in prefetch memory so next load is instant
        prefetchRef.current[newWord.toLowerCase()] = h ?? null;
        dispatch({ type: "reset", word: newWord, hintData: h });
      })
      .catch(() => {
        dispatch({ type: "reset", word: newWord, hintData: null });
      })
      .finally(() => {
        if (mountedRef.current) setLoadingHint(false);
      });
  }

  const disabledLetters = state.guessed;

  return (
    <main className="game-root">
      <header className="topbar">
        <h1>Hangman</h1>
        <div className="controls">
          <button onClick={handleRevealHint} className="btn" disabled={state.revealLevel >= 2}>
            Reveal Hint
          </button>
          <button onClick={handleReset} className="btn">New Word</button>
        </div>
      </header>

      <section className="game-area">
        <div className="left">
          <HangmanSVG wrongCount={state.wrongCount} />
        </div>

        <div className="center">
          <WordDisplay word={state.word} guessed={state.guessed} revealFirst={state.revealLevel >= 1} />
          <div className="status">
            {state.status === "won" && <div className="win">You won 🎉</div>}
            {state.status === "lost" && <div className="lose">You lost — word was <strong>{state.word}</strong></div>}
            <div>Attempts left: {6 - state.wrongCount}</div>
          </div>
          <Keyboard onGuess={handleGuess} disabledLetters={disabledLetters} />
        </div>

        <div className="right">
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

import React from "react";

type Props = {
  onGuess: (c: string) => void;
  disabledLetters: Set<string>;
};

const KEYS = "abcdefghijklmnopqrstuvwxyz".split("");

export default function Keyboard({ onGuess, disabledLetters }: Props) {
  return (
    <div className="keyboard" role="application" aria-label="On screen keyboard">
      {KEYS.map(k => (
        <button
          key={k}
          className="key"
          onClick={() => onGuess(k)}
          disabled={disabledLetters.has(k)}
          aria-pressed={disabledLetters.has(k)}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

import React from "react";

type Props = {
  onGuess: (letter: string) => void;
  word: string;
  guessedLetters: string[];
  disabled?: boolean;
};

const KEYS = "abcdefghijklmnopqrstuvwxyz".split("");

export default function Keyboard({ onGuess, word, guessedLetters, disabled = false }: Props) {
  const normalizedWord = word.toLowerCase();

  return (
    <div className="keyboard" role="application" aria-label="On screen keyboard">
      {KEYS.map(k => {
        const isGuessed = guessedLetters.includes(k);
        const isCorrect = isGuessed && normalizedWord.includes(k);
        const isIncorrect = isGuessed && !normalizedWord.includes(k);

        let className = "key";
        if (isCorrect) className += " key--correct";
        else if (isIncorrect) className += " key--incorrect";

        return (
          <button
            key={k}
            className={className}
            onClick={() => onGuess(k)}
            disabled={disabled || isGuessed}
            aria-pressed={isGuessed}
            aria-label={`Letter ${k}${isCorrect ? " (correct)" : isIncorrect ? " (incorrect)" : ""}`}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}


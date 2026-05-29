import React from "react";

type Props = {
  word: string;
  guessed: Set<string>;
  revealFirst?: boolean;
};

function isLetter(ch: string) {
  return /^[a-zA-Z]$/.test(ch);
}

export default function WordDisplay({ word, guessed, revealFirst = false }: Props) {
  const first = word[0]?.toLowerCase();

  return (
    <div className="word-display" aria-live="polite" role="group" aria-label="Secret word">
      {word.split("").map((ch, i) => {
        const lower = ch.toLowerCase();
        const isAlpha = isLetter(ch);
        const revealed = isAlpha && (guessed.has(lower) || (revealFirst && lower === first));
        const displayChar = !isAlpha ? ch : revealed ? ch : "_";

        return (
          <span
            key={i}
            className={`slot ${isAlpha ? (revealed ? "slot--revealed" : "slot--hidden") : "slot--sep"}`}
            aria-hidden={!isAlpha ? false : !revealed}
            title={!isAlpha ? (ch === " " ? "space" : ch) : undefined}
          >
            <span className="slot-inner">{displayChar}</span>
          </span>
        );
      })}
    </div>
  );
}

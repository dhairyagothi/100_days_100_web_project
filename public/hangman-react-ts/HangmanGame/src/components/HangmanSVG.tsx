import React from "react";

type Props = {
  wrongCount: number; // 0..6
};

export default function HangmanSVG({ wrongCount }: Props) {
  return (
    <svg viewBox="0 0 200 240" className="hangman-svg" role="img" aria-label="Hangman drawing">
      {/* Gallows */}
      <g className="gallows">
        <rect x="10" y="220" width="180" height="10" fill="var(--gallows-color, #475569)" rx="4" />
        <rect x="30" y="20" width="10" height="200" fill="var(--gallows-color, #475569)" rx="2" />
        <rect x="30" y="20" width="100" height="10" fill="var(--gallows-color, #475569)" rx="2" />
        <rect x="130" y="20" width="4" height="30" fill="var(--rope-color, #d97706)" rx="1" />
      </g>

      {/* Head */}
      <g className={`part head ${wrongCount > 0 ? "visible" : ""}`}>
        <circle cx="131" cy="70" r="16" stroke="var(--hangman-color, #cbd5e1)" strokeWidth="3.5" fill="none" />
      </g>

      {/* Body */}
      <g className={`part body ${wrongCount > 1 ? "visible" : ""}`}>
        <line x1="131" y1="86" x2="131" y2="140" stroke="var(--hangman-color, #cbd5e1)" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Left Arm */}
      <g className={`part left-arm ${wrongCount > 2 ? "visible" : ""}`}>
        <line x1="131" y1="100" x2="110" y2="120" stroke="var(--hangman-color, #cbd5e1)" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Right Arm */}
      <g className={`part right-arm ${wrongCount > 3 ? "visible" : ""}`}>
        <line x1="131" y1="100" x2="152" y2="120" stroke="var(--hangman-color, #cbd5e1)" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Left Leg */}
      <g className={`part left-leg ${wrongCount > 4 ? "visible" : ""}`}>
        <line x1="131" y1="140" x2="115" y2="180" stroke="var(--hangman-color, #cbd5e1)" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Right Leg */}
      <g className={`part right-leg ${wrongCount > 5 ? "visible" : ""}`}>
        <line x1="131" y1="140" x2="147" y2="180" stroke="var(--hangman-color, #cbd5e1)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}


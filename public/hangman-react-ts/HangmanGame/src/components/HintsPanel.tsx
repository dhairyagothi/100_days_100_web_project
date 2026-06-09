import React from "react";

type HintData = {
  word?: string;
  definition?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  example?: string;
  [key: string]: unknown;
} | null;

type Props = {
  hintData?: HintData;
  revealLevel: number; // 0, 1, 2
  word?: string;
  loading?: boolean;
};

export default function HintsPanel({ hintData, revealLevel, word, loading = false }: Props) {
  return (
    <aside className="hints-panel" aria-live="polite" aria-atomic="true">
      <h3>Hints</h3>

      {loading && (
        <div className="hint-row animate-fade-in">
          Loading hint…
        </div>
      )}

      {!loading && revealLevel === 0 && (
        <div className="hint-row animate-fade-in">
          Press <strong>Reveal Hint</strong> to get the first letter.
        </div>
      )}

      {!loading && revealLevel >= 1 && word && (
        <div className="hint-row animate-fade-in">
          <strong>First letter</strong>:{" "}
          <span className="first-letter-reveal">{word[0].toUpperCase()}</span>
        </div>
      )}

      {!loading && revealLevel >= 2 && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          {hintData?.definition ? (
            <div className="hint-row">
              <strong>Definition</strong>: {hintData.definition}
              {hintData.partOfSpeech && (
                <span style={{ marginLeft: 8, color: "var(--text-muted)", fontStyle: "italic" }}>
                  ({hintData.partOfSpeech})
                </span>
              )}
            </div>
          ) : (
            <div className="hint-row">
              No dictionary definition available.
            </div>
          )}

          {hintData?.synonyms && hintData.synonyms.length > 0 && (
            <div className="hint-row">
              <strong>Synonyms</strong>: {(hintData.synonyms as string[]).slice(0, 6).join(", ")}
            </div>
          )}

          {hintData?.example && (
            <div className="hint-row">
              <strong>Example</strong>: <em>"{hintData.example}"</em>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}


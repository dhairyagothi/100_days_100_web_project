import React from "react";

type HintData = {
  word?: string;
  definition?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  example?: string;
  // allow extra fields from different parsers
  [key: string]: unknown;
} | null;

type Props = {
  hintData?: HintData;
  revealLevel: number; // 0,1,2
  word?: string;
  loading?: boolean;
};

export default function HintsPanel({ hintData, revealLevel, word, loading = false }: Props) {
  return (
    <aside className="hints-panel" aria-live="polite" aria-atomic="true">
      <h3>Hints</h3>

      {loading && (
        <div className="hint-row">
          Loading hint…
        </div>
      )}

      {!loading && revealLevel === 0 && (
        <div className="hint-row">
          Press <strong>Reveal Hint</strong> to get the first letter.
        </div>
      )}

      {!loading && revealLevel >= 1 && word && (
        <div className="hint-row">
          <strong>First letter</strong>:{" "}
          <span style={{ marginLeft: 8, fontWeight: 700 }}>{word[0].toUpperCase()}</span>
        </div>
      )}

      {!loading && revealLevel >= 2 && (
        <>
          {hintData?.definition ? (
            <div className="hint-row" style={{ marginTop: 10 }}>
              <strong>Definition</strong>: {hintData.definition}
              {hintData.partOfSpeech && (
                <span style={{ marginLeft: 8, color: "var(--muted)" }}>— {hintData.partOfSpeech}</span>
              )}
            </div>
          ) : (
            <div className="hint-row" style={{ marginTop: 10 }}>
              No dictionary definition available.
            </div>
          )}

          {hintData?.synonyms && hintData.synonyms.length > 0 && (
            <div className="hint-row" style={{ marginTop: 8 }}>
              <strong>Synonyms</strong>: {(hintData.synonyms as string[]).slice(0, 6).join(", ")}
            </div>
          )}

          {hintData?.example && (
            <div className="hint-row" style={{ marginTop: 8 }}>
              <strong>Example</strong>: <em>{hintData.example}</em>
            </div>
          )}
        </>
      )}
    </aside>
  );
}

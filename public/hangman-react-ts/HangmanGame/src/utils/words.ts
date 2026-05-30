// small curated fallback list
export const FALLBACK_WORDS = [
  "python","javascript","hangman","developer","algorithm","component","state","react","typescript",
  "variable","function","compiler","framework","database","encryption","iteration","recursion","syntax",

  // General vocabulary
  "harmony","adventure","mystery","courage","freedom","wisdom","journey","destiny","victory","fortune",

  // Nature & science
  "galaxy", "nebula", "volcano", "tsunami", "oxygen", "gravity", "photosynthesis", "ecosystem", "evolution", "asteroid",

  // Fun & everyday
  "puzzle", "festival", "holiday", "treasure", "rainbow", "sunshine", "friendship", "laughter", "music", "chocolate"
];

export function pickRandomWord(): string {
  const idx = Math.floor(Math.random() * FALLBACK_WORDS.length);
  return FALLBACK_WORDS[idx];
}

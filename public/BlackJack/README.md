# ♠️ BlackJack

A browser-based Blackjack card game built with vanilla HTML, CSS, and JavaScript.

## 🎮 How to Play

| Action | What it does |
|--------|--------------|
| **Hit** | Draw one card from the deck |
| **Stand** | Stop drawing; the dealer plays automatically |
| **Deal** | Reset the board and start a new round |
| **Play Again** | Shortcut to start a new round immediately |

### Rules
- Get as close to **21** as possible without going over.
- **Face cards** (K, Q, J) are worth **10**.
- **Aces** count as **11**, or **1** if 11 would cause a bust.
- The dealer draws until reaching a score of **17 or more**.
- Going over 21 is a **Bust** — an instant loss.
- The player closest to 21 wins; equal scores are a **Draw**.

## 🗂️ Project Structure

```
BlackJack/
├── blackJ.html   # Game markup and layout
├── blackJ.css    # Casino-themed styles (dark green felt)
├── blackJ.js     # All game logic
├── README.md     # This file
└── static/
    ├── *.png         # Card face images
    ├── table.jpg     # Table background
    └── sounds/       # Audio effects
        ├── swish.m4a   # Card draw
        ├── tink.wav    # Button hover
        ├── cash.mp3    # Win
        ├── cheer.wav   # Crowd cheer (win)
        ├── aww.mp3     # Loss
        └── ohh.mp3     # Draw
```

## 🐛 Bug Fixes Applied

1. **`hitsound` ReferenceError** — audio objects moved above function declarations (`const` is not hoisted).
2. **Audio volume spike on win** — `cheers.volume` now set before `.play()`.
3. **Dealer stand threshold** — corrected from `< 16` to `< 17` per standard casino rules.
4. **Auto-bust resolution** — round resolves immediately on player bust; no Stand click needed.
5. **Double `findWinner()` call** — `gameActive` flag prevents scoring the same round twice.
6. **Stale Dealer-score guard** — replaced unreliable `Dealer.score > 0` check with `gameActive`.
7. **Deal blocked after auto-bust** — `BJdeal()` guard now checks `gameActive` (dealer score stays 0 on bust).
8. **Play Again guard bypass** — `Play Again` calls `startNewRound()` directly, skipping deal guards.
9. **Buttons not disabled after round** — Hit and Stand are greyed out when no round is active.
10. **`cardsmap` mutation risk** — card values extracted to a module-level `CARD_VALUES` const.

## ✨ Enhancements

- **Casino dark-green felt** theme with gold accents
- **Card deal animation** — cards fly in with a CSS entrance
- **Animated scoreboard** — counters bounce on update
- **Responsive layout** — side-by-side on desktop, stacked on mobile
- **ARIA labels + focus rings** — keyboard and screen-reader accessible
- **Reduced-motion support** — animations skipped per OS preference

## 🚀 Running Locally

No build tools required — open `blackJ.html` directly in any modern browser:

```bash
# From the repo root
open public/BlackJack/blackJ.html
# or
npx serve public/BlackJack
```

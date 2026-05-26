# Cyber Typing Battle Game

A cyber-style typing battle game built using **HTML**, **CSS**, and **JavaScript** where enemies attack the player from the right side of the screen and the player destroys them by typing words correctly.

---

# Project Overview

This project is a browser-based typing game.

The player stays on the left side of the screen.

Enemies continuously move from the right side toward the player.

Each enemy has a word above it.

The player must type the word correctly to destroy the enemy before it reaches the player.

If any enemy touches the player, the game ends.

---

# Features

- 3 Difficulty Modes
  - Easy
  - Medium
  - Hard

- Typing-based combat system

- Enemy selection system

- Bullet shooting animation

- Enemy hit effect

- Enemy destroy effect

- Sound effects

- Full-screen cyber playground

- Start screen UI

- Game over screen

- Dynamic enemy spawning

- Score system

---

# Difficulty Modes

## Easy Mode

- Only 1 enemy appears at a time
- Slow enemy speed
- Best for beginners

---

## Medium Mode

- 2 enemies appear at the same time
- Same speed as easy mode
- Player can choose which enemy to attack first

---

## Hard Mode

- 3 enemies appear simultaneously
- Enemies move faster
- Requires fast typing and target switching

---

# Technologies Used

## HTML

Used for:
- Game structure
- Canvas element
- Start screen
- Score UI
- Game over screen

---

## CSS

Used for:
- Cyber-style design
- Layout
- Buttons
- Background grid
- Animations
- Neon colors
- Fullscreen styling

---

## JavaScript

Used for:
- Game logic
- Enemy movement
- Typing system
- Collision detection
- Bullet movement
- Sound effects
- Difficulty system
- Rendering everything on canvas

---

# Project Structure

```txt
project-folder/
│
├── index.html
├── style.css
├── script.js
├── words.js
│
├── sounds/
│   ├── shoot.mp3
│   ├── hit.mp3
│   ├── destroy.mp3
│   └── gameover.mp3
│
└── README.md
```

---

# File Explanation

# 1. index.html

This file contains:
- Start screen
- Difficulty buttons
- Start button
- Score display
- Game over screen
- Canvas

Main purpose:
Creates the structure of the game.

---

# 2. style.css

This file controls:
- Game design
- Neon cyber theme
- Layout
- Buttons
- Full-screen background
- UI positioning

Main purpose:
Makes the game visually attractive.

---

# 3. script.js

This is the main game engine.

It controls:
- Enemy spawning
- Player controls
- Bullet movement
- Typing logic
- Game loop
- Score updates
- Sound effects
- Collision detection

Main purpose:
Handles the complete game functionality.

---

# 4. words.js

This file stores all enemy words.

Example:

```javascript
export const words = [
  "apple",
  "cyber",
  "battle",
  "dragon"
];
```

Main purpose:
Keeps word data separate from game logic.

Benefits:
- Cleaner code
- Easy to add more words
- Better project structure

---

# Sound Effects

The game uses sound effects for:
- Shooting
- Enemy hit
- Enemy destroy
- Game over

---

# Sound Websites Used


## Pixabay Sound Effects

https://pixabay.com/sound-effects/


# Sound Files Used

```txt
shoot.mp3
→ Bullet shooting sound

hit.mp3
→ Enemy hit sound

destroy.mp3
→ Enemy destroyed sound

gameover.mp3
→ Game over sound
```

---

# How the Typing System Works

1. Enemy appears with a word

2. Player types the first letter

3. That enemy becomes the active target

4. Every correct key:
   - Fires a bullet
   - Damages enemy
   - Changes typed letters color

5. When the full word is typed:
   - Enemy gets destroyed
   - Score increases

---

# How Enemy Selection Works

In medium and hard mode:

Multiple enemies appear.

Player can choose which enemy to attack first by typing the first letter of its word.

This makes gameplay more strategic.

---

# How Bullets Work

When the player types a correct letter:
- A bullet is created
- Bullet travels toward enemy
- Enemy flashes red on hit

When the word finishes:
- Enemy is removed from the array
- Enemy disappears from screen

---

# Game Loop

The game continuously runs using:

```javascript
requestAnimationFrame(gameLoop);
```

This updates:
- Enemy movement
- Bullet movement
- Rendering
- Collision checks

every frame.

---

# Collision Detection

The game checks:

```javascript
if(enemy.x < player.x + 20)
```

If enemy reaches player:
- Game over screen appears
- Game stops

---

# Why Separate Files Were Used

The project was separated into:
- HTML
- CSS
- JavaScript
- Words file

because it makes:
- Code cleaner
- Easier to maintain
- Easier to debug
- Easier to scale later

This is standard frontend project structure.

---



# Learning Outcome

This project helped in learning:

- JavaScript game logic
- Canvas rendering
- Event listeners
- Arrays and objects
- Collision detection
- Game loops
- Modular JavaScript
- Sound integration
- Frontend project structuring

---

# Final Result

A fully working cyber-themed typing battle game where:
- enemies attack the player,
- player types words to destroy enemies,
- bullets and sounds improve gameplay,
- difficulty modes change gameplay challenge.

---
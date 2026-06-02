# Cyber Typing Battle

A fast-paced cyber-themed typing game where players destroy incoming enemies by typing words correctly before the enemies reach the player.

---

# Overview

Cyber Typing Battle is an arcade typing game built using JavaScript, HTML, and CSS.
The project combines typing practice with action gameplay in a futuristic cyber environment.

Players must:

* Type enemy words correctly
* Destroy enemies before they reach the player
* Survive increasingly difficult waves
* Improve typing speed and accuracy

The game was designed to feel lightweight, responsive, and visually cyber-themed while still being easy to understand and maintain.

---

# Features

## Typing Combat System

* Enemies contain random words
* Players type letters to attack enemies
* Correct typing fires bullets toward enemies
* Completing a word destroys the enemy

## Difficulty Modes

The game includes:

* Easy Mode
* Medium Mode
* Hard Mode

Each mode changes:

* Enemy count
* Spawn behavior
* Enemy movement speed

## Cyber Theme UI

The game uses:

* Neon glowing effects
* Grid background
* Futuristic colors
* Arcade-inspired design

## Sound Effects

The game includes:

* Shooting sound
* Hit sound
* Destroy sound
* Game over sound

## Navigation System

The game supports:

* Start screen
* Back button navigation
* Return to homepage
* Game over screen

---

# Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Canvas API

No external game engine was used.

---


---

# File Explanation

## index.js

This file connects the game with the main website.

Responsibilities:

* Exports the game component
* Loads the game screen
* Connects routing/navigation
* Registers the game into the website system

---

## game.js

Main gameplay logic.

Handles:

* Game loop
* Enemy movement
* Bullet system
* Typing logic
* Collision detection
* Score system
* Difficulty handling

---

## style.css

Contains all game styling.

Includes:

* Cyber UI theme
* Neon effects
* Layout styling
* Responsive design
* Animation styling

---

## components/

Contains reusable UI sections.

Examples:

* Start Screen
* HUD
* Game Over Screen
* Buttons
* Enemy Renderer

---

## utils/

Contains helper functions.

Examples:

* Random word generation
* Collision calculations
* Sound handling
* Utility helpers

---

# Gameplay Logic

## Enemy System

Enemies spawn from the right side of the screen and move toward the player.

Each enemy:

* Has a word assigned
* Tracks typed letters
* Gets destroyed when the word is completed

---

## Typing System

The typing system:

1. Detects keyboard input
2. Matches typed letters
3. Locks onto enemies
4. Tracks progress
5. Fires bullets visually

---

## Bullet System

Bullets are visual effects that:

* Travel from player to enemy
* Follow enemy position
* Create cyber combat feel

---

## Score System

Players gain points after:

* Destroying enemies
* Completing words correctly

---

# Sound Effects

The project uses free sound effects.

Sound files used:

* shoot.mp3
* hit.mp3
* destroy.mp3
* gameover.mp3

---

# Sound Sources

Free sound websites used:

## Pixabay

https://pixabay.com/sound-effects/

---

# How the Game Connects to the Main Website

The game is connected to the main project by:

* Registering it in the game registry
* Adding search tags
* Connecting routes/navigation
* Linking the game card to the game component

This allows users to:

* Search the game
* Open the game page
* Play directly from the website

---

# Search Integration

The game supports searchable keywords such as:

* cyber
* typing
* battle
* arcade
* word game

This makes the game discoverable from the website search system.

---

# GitHub Integration

A GitHub button/icon is included.

Purpose:

* Opens the Cyber Typing Battle repository
* Allows users to view source code
* Provides project access directly from the game page

---

# Navigation Flow

Navigation behavior:

Homepage
→ Start Screen
→ Gameplay
→ Game Over
→ Back Button
→ Start Screen
→ Back Button
→ Homepage

---

# Performance Optimization

The project includes:

* Lightweight rendering
* Efficient game loop
* Minimal dependencies
* Optimized canvas drawing

---


# Learning Outcomes

This project helped in understanding:

* Canvas rendering
* Real-time game loops
* Keyboard event handling
* Collision systems
* Game state management
* UI navigation
* Modular JavaScript structure

---

# Conclusion

Cyber Typing Battle is a cyber-themed typing arcade game focused on combining fast typing mechanics with action gameplay.

The project was built to be:

* Fun
* Lightweight
* Modular
* Easy to maintain
* Easy to integrate into larger game websites

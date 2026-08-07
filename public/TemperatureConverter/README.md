# Temperature Converter
Convert temperatures in real time.

## Overview
This is an elegant web-based Temperature Converter that allows users to convert values between Celsius, Fahrenheit, and Kelvin in real-time with a modern, clean UI.

## Features
- **Real-time Temperature Conversion**: Convert between Celsius, Fahrenheit, and Kelvin as you type
- **Quick Presets**: One-click presets for common temperatures (Freezing, Room Temp, Body Temp, Boiling)
- **Temperature Facts**: Display interesting facts about the current temperature
- **Formula & Calculation Panel**: Shows the conversion formula and step-by-step calculations
- **Real-World Reference**: Highlights the closest real-world temperature reference point
- **Conversion History**: Keeps track of your conversion history (up to 20 entries)
- **Dark/Light Theme Toggle**: Switch between dark and light themes
- **Visual Scale Bar**: Visual indicator of where the temperature falls on a scale
- **Clean and Responsive UI**: Modern design with smooth animations
- **Input Validation**: Handles invalid values gracefully

## Technologies Used
- Vanilla HTML5
- Vanilla CSS3
- Vanilla JavaScript (no external libraries)

## How to Run
1. Download or clone the repository
2. Open the `index.html` file in any modern web browser

## How It Works
- When the user enters a value in any input field, the other two fields are automatically updated
- JavaScript event listeners detect input changes and apply conversion formulas
- The app updates the fact card, formula panel, real-world reference, and scale bar simultaneously

## Conversion Formulas
- Celsius to Fahrenheit: (C × 9/5) + 32
- Celsius to Kelvin: C + 273.15
- Fahrenheit to Celsius: (F − 32) × 5/9
- Fahrenheit to Kelvin: (F − 32) × 5/9 + 273.15
- Kelvin to Celsius: K − 273.15
- Kelvin to Fahrenheit: (K − 273.15) × 9/5 + 32

## Real-World Reference Points
- ❄ Absolute Zero (-273.15°C)
- ❄️ Freezing Point (0°C)
- 🌤 Room Temperature (23°C)
- 🌡 Human Body Temperature (37°C)
- ♨ Boiling Point (100°C)


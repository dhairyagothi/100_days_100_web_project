# 🚌 City Bus Rush - Interactive Bus Driving Game

A fast-paced, retro-styled arcade game where players navigate a city bus through traffic, manage passenger pickups, and reach destinations while avoiding collisions and weather hazards.

## Brief Description

City Bus Rush is an engaging browser-based game that combines arcade-style driving mechanics with strategic passenger management. Players control a city bus navigating through dynamic traffic, managing passenger load, and achieving objectives while dealing with real-world challenges like weather conditions and traffic patterns. The game features colorful retro graphics, engaging HUD, and progressive difficulty.

## Features

- **Dynamic Bus Driving:**
  - Smooth, responsive bus controls
  - Realistic physics-based movement
  - Collision detection with vehicles and obstacles
  - Road boundaries and path constraints

- **Passenger Management:**
  - Dynamic passenger pickup and drop-off
  - Passenger capacity limits
  - Real-time passenger count display
  - Status indicators for passenger satisfaction

- **Traffic System:**
  - AI-controlled traffic vehicles
  - Realistic traffic flow patterns
  - Collision hazards requiring skillful navigation
  - Dynamic vehicle spawning

- **Environmental Effects:**
  - Weather system (rain, clear skies)
  - Weather impact on driving conditions
  - Visual and mechanical effects
  - Dynamic weather badge indicator

- **Scoring System:**
  - Points for completed routes
  - Bonus multipliers for efficiency
  - Passenger satisfaction scoring
  - Level progression system

- **Retro Game Aesthetics:**
  - Pixel-art inspired design
  - Colorful palette (yellows, reds, greens)
  - Arcade-style HUD with numeric display
  - Bangers font for authentic retro feel
  - Full-screen immersive experience

- **Interactive HUD:**
  - Live score display
  - Distance tracking
  - Passenger indicators with visual icons
  - Next stop announcement
  - Weather badge
  - Control hints overlay

## Technologies Used

- **HTML5** - Semantic page structure with canvas element
- **CSS3** - Advanced styling with:
  - CSS Variables for consistent theming
  - Flexbox for HUD layout
  - Absolute positioning for overlays
  - Retro color palette
- **JavaScript (ES6+)** - Game engine and physics
- **Canvas API** - 2D rendering and animation
- **requestAnimationFrame** - Optimized game loop
- **Google Fonts** - Bangers and Nunito fonts for retro aesthetic

## Installation / Setup Instructions

1. **Navigate to the project folder:**
   ```bash
   cd public/bus_game
   ```

2. **Open in a web browser:**
   - Open `index.html` in any modern web browser
   - No build process or dependencies required
   - Works on desktop and mobile devices
   - Fullscreen recommended for best experience

3. **Alternative - Local development server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Navigate to: http://localhost:8000/bus_game
   ```

4. **Fullscreen Mode (Optional):**
   - Most browsers allow fullscreen canvas
   - Check your browser's fullscreen API support
   - F11 key toggles browser fullscreen

## Usage Instructions

1. **Start the Game:**
   - Open `index.html` in your browser
   - Game initializes with starting scenario
   - Bus appears on the road ready to drive

2. **Control the Bus:**
   - Use **Arrow Keys** or **WASD** to drive:
     - **UP/W**: Accelerate forward
     - **DOWN/S**: Brake/Reverse
     - **LEFT/A**: Steer left
     - **RIGHT/D**: Steer right
   - Smooth, responsive controls for realistic driving

3. **Monitor HUD Elements:**
   - **Score Display**: Top-left shows current score
   - **Distance Meter**: Tracks distance traveled
   - **Passenger Indicators**: Shows current passenger count with emoji icons
   - **Weather Badge**: Top-center displays current weather condition
   - **Next Stop**: Shows upcoming destination (when applicable)
   - **Controls Hint**: Bottom-right displays control scheme

4. **Manage Passengers:**
   - Pickup passengers at designated stops
   - Respect passenger capacity limits
   - Drop off passengers at destinations
   - Earn points for successful delivery

5. **Navigate Traffic:**
   - Avoid collisions with AI-controlled vehicles
   - Navigate around obstacles
   - Stay on the road (avoid grass/boundaries)
   - Use traffic gaps strategically

6. **Deal with Weather:**
   - Adapt driving to weather conditions
   - Rain may reduce traction
   - Clear skies provide better conditions
   - Weather badge indicates current conditions

7. **Reach Objectives:**
   - Complete designated routes
   - Deliver passengers to destinations
   - Achieve score targets
   - Progress through difficulty levels

## Project Structure

```
bus_game/
├── index.html          # Main game interface with HUD
├── style.js            # Game engine and logic
└── README.md           # This file
```

## Game Mechanics

### Movement System
- Smooth acceleration and deceleration
- Velocity-based physics
- Steering affects direction smoothly
- Realistic friction and drag

### Collision Detection
- Vehicle-to-vehicle collisions
- Road boundary constraints
- Passenger pickup zones
- Drop-off detection

### Scoring
- Base points for distance traveled
- Bonus multipliers for objectives
- Passenger satisfaction bonus
- Time efficiency bonuses

### Difficulty Progression
- Early levels: Light traffic, simple routes
- Mid levels: Increased traffic, complex routes
- Late levels: Heavy traffic, weather effects, tight schedules

## Controls

| Key | Action |
|-----|--------|
| UP / W | Accelerate |
| DOWN / S | Brake/Reverse |
| LEFT / A | Steer Left |
| RIGHT / D | Steer Right |
| SPACE | (Optional) Special Action |

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with canvas support

## Performance Notes

- Optimized for 60 FPS gameplay
- Hardware-accelerated canvas rendering
- Efficient collision detection algorithms
- Dynamic object pooling for vehicles

## Tips for Better Gameplay

1. **Anticipate Traffic** - Look ahead for approaching vehicles
2. **Smooth Steering** - Avoid jerky movements for better control
3. **Plan Routes** - Know where passengers need to go
4. **Manage Speed** - Fast isn't always best in tight traffic
5. **Learn Patterns** - Traffic follows predictable routes
6. **Time Your Moves** - Use gaps in traffic strategically

## Notes

- Game saves aren't persistent (resets on page reload)
- Designed for entertainment and casual gaming
- Single-player experience
- No online multiplayer
- Mobile-friendly with touch controls (if implemented)
- Perfect for quick gaming sessions

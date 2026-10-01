const POT_COLORS = {
  terracotta: { primary: '#E07A5F', shadow: '#C86247' },
  lavender: { primary: '#B8C0FF', shadow: '#9FA8E3' },
  peach: { primary: '#F4A261', shadow: '#E76F51' },
  mint: { primary: '#8ECAE6', shadow: '#219EBC' },
  charcoal: { primary: '#4A5759', shadow: '#303B3D' }
};

// SVG face parts helper based on mood
function getFaceSVG(mood) {
  switch (mood) {
    case 'happy':
      return `
        <!-- Happy Face -->
        <path d="M 44 63 Q 46 60 48 63" stroke="#2B2D42" stroke-width="2" stroke-linecap="round" fill="none" />
        <path d="M 52 63 Q 54 60 56 63" stroke="#2B2D42" stroke-width="2" stroke-linecap="round" fill="none" />
        <path d="M 48 66 Q 50 69 52 66" stroke="#2B2D42" stroke-width="1.5" stroke-linecap="round" fill="none" />
        <circle cx="43" cy="65" r="2" fill="#FFB5A7" opacity="0.8" />
        <circle cx="57" cy="65" r="2" fill="#FFB5A7" opacity="0.8" />
      `;
    case 'thirsty':
      return `
        <!-- Thirsty/Sad Face -->
        <circle cx="44" cy="62" r="1.5" fill="#2B2D42" />
        <circle cx="56" cy="62" r="1.5" fill="#2B2D42" />
        <path d="M 48 67 Q 50 65 52 67" stroke="#2B2D42" stroke-width="1.5" stroke-linecap="round" fill="none" />
        <path d="M 41 60 Q 43 59 45 60" stroke="#2B2D42" stroke-width="1" fill="none" />
        <path d="M 55 60 Q 57 59 59 60" stroke="#2B2D42" stroke-width="1" fill="none" />
      `;
    case 'sad':
      return `
        <!-- Neglected Face -->
        <path d="M 43 64 L 46 62" stroke="#2B2D42" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 57 64 L 54 62" stroke="#2B2D42" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 47 68 Q 50 64 53 68" stroke="#2B2D42" stroke-width="2" stroke-linecap="round" fill="none" />
        <!-- Tiny tears -->
        <circle cx="42" cy="67" r="1" fill="#4EA8DE" />
        <circle cx="58" cy="67" r="1" fill="#4EA8DE" />
      `;
    case 'normal':
    default:
      return `
        <!-- Normal Face -->
        <circle cx="44" cy="63" r="1.5" fill="#2B2D42" />
        <circle cx="56" cy="63" r="1.5" fill="#2B2D42" />
        <path d="M 48 66 Q 50 68 52 66" stroke="#2B2D42" stroke-width="1.5" stroke-linecap="round" fill="none" />
        <circle cx="42" cy="65.5" r="1.5" fill="#FFCAD4" opacity="0.6" />
        <circle cx="58" cy="65.5" r="1.5" fill="#FFCAD4" opacity="0.6" />
      `;
  }
}

// Generate the decorative pot
function getPotSVG(potColorName, mood) {
  const colors = POT_COLORS[potColorName] || POT_COLORS.terracotta;
  return `
    <g class="plant-pot">
      <!-- Shadow on ground -->
      <ellipse cx="50" cy="88" rx="22" ry="4" fill="#EAE2B7" opacity="0.6" />
      
      <!-- Pot Body -->
      <path d="M 32 55 L 68 55 L 63 85 L 37 85 Z" fill="${colors.primary}" />
      <path d="M 50 55 L 68 55 L 63 85 L 50 85 Z" fill="${colors.shadow}" opacity="0.15" />
      
      <!-- Pot Rim -->
      <rect x="29" y="50" width="42" height="6" rx="2" fill="${colors.primary}" />
      <rect x="50" y="50" width="21" height="6" rx="0" fill="${colors.shadow}" opacity="0.15" />
      <line x1="29" y1="56" x2="71" y2="56" stroke="${colors.shadow}" stroke-width="1" opacity="0.4" />
      
      <!-- Cute Pot Face -->
      ${getFaceSVG(mood)}
    </g>
  `;
}

// 1. Seedling SVG (Same for all species, representing the early stage of life!)
function getSeedlingSVG(potColorName, mood) {
  const pot = getPotSVG(potColorName, mood);
  return `
    <svg viewBox="0 0 100 100" class="plant-svg seedling" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#AACC00" />
          <stop offset="100%" stop-color="#70E000" />
        </linearGradient>
      </defs>
      
      <!-- Soil -->
      <ellipse cx="50" cy="51" rx="19" ry="5" fill="#6C584C" />
      
      <!-- Little Sprout Stem -->
      <path d="M 50 51 Q 48 35 44 28" fill="none" stroke="url(#stemGrad)" stroke-width="2.5" stroke-linecap="round" />
      
      <!-- Leaf Left -->
      <path d="M 44 28 C 38 28 35 34 44 33 Z" fill="#80B918" />
      <!-- Leaf Right -->
      <path d="M 44 28 C 50 24 53 30 46 31 Z" fill="#9EF01A" />
      
      <!-- Pot -->
      ${pot}
    </svg>
  `;
}

// 2. Sprout Stage
function getSproutSVG(species, potColorName, mood) {
  const pot = getPotSVG(potColorName, mood);
  let sproutContent = '';

  switch (species) {
    case 'monstera':
      sproutContent = `
        <!-- Monstera Sprout -->
        <path d="M 50 51 Q 45 32 40 22" fill="none" stroke="#52B788" stroke-width="3" stroke-linecap="round" />
        <path d="M 50 51 Q 55 38 58 30" fill="none" stroke="#52B788" stroke-width="2.5" stroke-linecap="round" />
        
        <!-- Leaf 1 (Top Left) -->
        <path d="M 40 22 C 32 18 28 30 40 28 Z" fill="#40916C" />
        <!-- Leaf 2 (Right) -->
        <path d="M 58 30 C 66 28 66 38 58 36 Z" fill="#74C69D" />
      `;
      break;
    case 'succulent':
      sproutContent = `
        <!-- Succulent Sprout (Tiny cluster of 3 leaves) -->
        <path d="M 50 51 Q 50 42 50 40" fill="none" stroke="#74C69D" stroke-width="3" />
        <!-- Fleshy Leaves -->
        <path d="M 50 40 C 44 38 45 48 50 49 Z" fill="#52B788" />
        <path d="M 50 40 C 56 38 55 48 50 49 Z" fill="#52B788" />
        <path d="M 50 40 C 47 34 53 34 50 49 Z" fill="#74C69D" />
      `;
      break;
    case 'fern':
      sproutContent = `
        <!-- Fern Sprout (Curling fronds) -->
        <path d="M 50 51 Q 46 35 38 25" fill="none" stroke="#74C69D" stroke-width="2" stroke-linecap="round" />
        <path d="M 50 51 Q 53 38 60 28" fill="none" stroke="#74C69D" stroke-width="2" stroke-linecap="round" />
        
        <!-- Tiny Frond Leaves -->
        <circle cx="38" cy="25" r="1.5" fill="#52B788" />
        <circle cx="41" cy="28" r="1.5" fill="#52B788" />
        <circle cx="44" cy="32" r="1.5" fill="#52B788" />
        
        <circle cx="60" cy="28" r="1.5" fill="#52B788" />
        <circle cx="57" cy="32" r="1.5" fill="#52B788" />
      `;
      break;
    case 'cactus':
      sproutContent = `
        <!-- Cactus Sprout -->
        <path d="M 50 51 C 42 51 42 33 50 33 C 58 33 58 51 50 51 Z" fill="#2D6A4F" />
        <!-- Spines -->
        <line x1="50" y1="31" x2="50" y2="28" stroke="#D8F3DC" stroke-width="1" />
        <line x1="42" y1="38" x2="39" y2="36" stroke="#D8F3DC" stroke-width="1" />
        <line x1="58" y1="38" x2="61" y2="36" stroke="#D8F3DC" stroke-width="1" />
      `;
      break;
    case 'snake_plant':
      sproutContent = `
        <!-- Snake Plant Sprout -->
        <path d="M 46 51 C 44 40 47 25 47 25 C 47 25 50 40 48 51 Z" fill="#1B4332" />
        <path d="M 52 51 C 50 42 53 30 53 30 C 53 30 55 42 53 51 Z" fill="#2D6A4F" />
        <!-- Yellow details -->
        <path d="M 46.5 45 C 45 40 47 28 47 28 C 47 28 48 40 47.5 45 Z" fill="#D8F3DC" opacity="0.4" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 100 100" class="plant-svg sprout" xmlns="http://www.w3.org/2000/svg">
      <!-- Soil -->
      <ellipse cx="50" cy="51" rx="19" ry="5" fill="#6C584C" />
      
      ${sproutContent}
      ${pot}
    </svg>
  `;
}

// 3. Mature Stage
function getMatureSVG(species, potColorName, mood) {
  const pot = getPotSVG(potColorName, mood);
  let plantColor = '#2D6A4F';
  let content = '';

  const isThirsty = mood === 'thirsty' || mood === 'sad';
  const leafColor1 = isThirsty ? '#9CA38F' : '#40916C';
  const leafColor2 = isThirsty ? '#8A9A86' : '#52B788';
  const leafColor3 = isThirsty ? '#ADB5A3' : '#74C69D';
  const stemColor = isThirsty ? '#B5BEA8' : '#74C69D';

  switch (species) {
    case 'monstera':
      content = `
        <!-- Stems -->
        <path d="M 50 51 Q 42 35 32 24" fill="none" stroke="${stemColor}" stroke-width="2.5" />
        <path d="M 50 51 Q 50 30 50 16" fill="none" stroke="${stemColor}" stroke-width="3" />
        <path d="M 50 51 Q 58 35 66 26" fill="none" stroke="${stemColor}" stroke-width="2.5" />
        
        <!-- Left Leaf -->
        <g transform="translate(32, 24) rotate(-30)">
          <path d="M 0 0 C -15 -10 -20 10 0 15 C 20 10 15 -10 0 0 Z" fill="${leafColor2}" />
          <!-- Fenestrations (Cuts) -->
          <path d="M -8 2 L -15 0" stroke="#F4F1DE" stroke-width="1.5" opacity="0.3" />
          <path d="M -6 8 L -14 7" stroke="#F4F1DE" stroke-width="1.5" opacity="0.3" />
        </g>
        
        <!-- Center Leaf -->
        <g transform="translate(50, 16) rotate(0)">
          <path d="M 0 0 C -18 -12 -22 12 0 18 C 22 12 18 -12 0 0 Z" fill="${leafColor1}" />
          <path d="M -10 3 L -17 2" stroke="#F4F1DE" stroke-width="2" opacity="0.3" />
          <path d="M 10 3 L 17 2" stroke="#F4F1DE" stroke-width="2" opacity="0.3" />
          <path d="M -7 10 L -14 9" stroke="#F4F1DE" stroke-width="2" opacity="0.3" />
          <path d="M 7 10 L 14 9" stroke="#F4F1DE" stroke-width="2" opacity="0.3" />
        </g>
        
        <!-- Right Leaf -->
        <g transform="translate(66, 26) rotate(35)">
          <path d="M 0 0 C -15 -10 -20 10 0 15 C 20 10 15 -10 0 0 Z" fill="${leafColor3}" />
          <path d="M 8 2 L 15 0" stroke="#F4F1DE" stroke-width="1.5" opacity="0.3" />
          <path d="M 6 8 L 14 7" stroke="#F4F1DE" stroke-width="1.5" opacity="0.3" />
        </g>
      `;
      break;

    case 'succulent':
      content = `
        <!-- Succulent Rosette -->
        <g transform="translate(50, 44)">
          <!-- Outer Leaves -->
          <path d="M 0 0 C -12 10 -25 5 -18 -10 C -11 -25 0 -15 0 0 Z" fill="${leafColor1}" />
          <path d="M 0 0 C 12 10 25 5 18 -10 C 11 -25 0 -15 0 0 Z" fill="${leafColor1}" />
          <path d="M 0 0 C -18 -5 -15 -22 0 -22 C 15 -22 18 -5 0 0 Z" fill="${leafColor2}" />
          <!-- Inner Leaves -->
          <path d="M 0 0 C -8 -2 -10 -15 0 -15 C 10 -15 8 -2 0 0 Z" fill="${leafColor3}" />
          <path d="M 0 0 C -5 5 -10 -8 -2 -10 Z" fill="#FFCCD5" opacity="0.5" />
          <!-- Cute Pink Tips -->
          <circle cx="-18" cy="-10" r="2.5" fill="#FF85A1" opacity="${isThirsty ? 0.3 : 0.8}" />
          <circle cx="18" cy="-10" r="2.5" fill="#FF85A1" opacity="${isThirsty ? 0.3 : 0.8}" />
          <circle cx="0" cy="-22" r="2.5" fill="#FF85A1" opacity="${isThirsty ? 0.3 : 0.8}" />
        </g>
      `;
      break;

    case 'fern':
      content = `
        <!-- Fern Leaves -->
        <g>
          <!-- Left Frond -->
          <path d="M 50 51 Q 30 40 18 20" fill="none" stroke="${leafColor1}" stroke-width="2" />
          <path d="M 18 20 Q 22 23 26 27 M 22 24 Q 27 27 32 31 M 28 32 Q 33 34 38 37" stroke="${leafColor1}" stroke-width="2.5" stroke-linecap="round" />
          
          <!-- Center Frond -->
          <path d="M 50 51 Q 50 30 50 10" fill="none" stroke="${leafColor2}" stroke-width="2" />
          <path d="M 50 10 Q 45 15 42 20 M 50 10 Q 55 15 58 20 M 50 22 Q 44 26 40 31 M 50 22 Q 56 26 60 31" stroke="${leafColor2}" stroke-width="2.5" stroke-linecap="round" />
          
          <!-- Right Frond -->
          <path d="M 50 51 Q 70 40 82 20" fill="none" stroke="${leafColor3}" stroke-width="2" />
          <path d="M 82 20 Q 78 23 74 27 M 78 24 Q 73 27 68 31 M 72 32 Q 67 34 62 37" stroke="${leafColor3}" stroke-width="2.5" stroke-linecap="round" />
          
          <!-- Extra arching details -->
          <path d="M 50 51 Q 38 42 28 35" fill="none" stroke="${leafColor1}" stroke-width="1.5" />
          <path d="M 50 51 Q 62 42 72 35" fill="none" stroke="${leafColor3}" stroke-width="1.5" />
        </g>
      `;
      break;

    case 'cactus':
      content = `
        <!-- Main Saguaro Stem -->
        <path d="M 42 51 L 42 25 C 42 18 58 18 58 25 L 58 51 Z" fill="${leafColor1}" />
        <!-- Left Arm -->
        <path d="M 42 38 L 34 38 C 30 38 30 26 34 26" fill="none" stroke="${leafColor1}" stroke-width="7" stroke-linecap="round" />
        <!-- Right Arm -->
        <path d="M 58 42 L 66 42 C 70 42 70 32 66 32" fill="none" stroke="${leafColor2}" stroke-width="6.5" stroke-linecap="round" />
        
        <!-- Ridges / Verticals -->
        <path d="M 50 51 L 50 20" stroke="${leafColor2}" stroke-width="1.5" opacity="0.6" />
        
        <!-- Needle details -->
        <!-- Center needles -->
        <line x1="50" y1="18" x2="50" y2="14" stroke="#FFF" stroke-width="1" />
        <line x1="50" y1="28" x2="47" y2="28" stroke="#FFF" stroke-width="0.8" />
        <line x1="50" y1="28" x2="53" y2="28" stroke="#FFF" stroke-width="0.8" />
        <line x1="50" y1="38" x2="46" y2="38" stroke="#FFF" stroke-width="0.8" />
        <line x1="50" y1="38" x2="54" y2="38" stroke="#FFF" stroke-width="0.8" />
        <!-- Left arm needles -->
        <line x1="30" y1="30" x2="27" y2="29" stroke="#FFF" stroke-width="0.8" />
        <line x1="34" y1="24" x2="34" y2="21" stroke="#FFF" stroke-width="0.8" />
        <!-- Right arm needles -->
        <line x1="70" y1="36" x2="73" y2="35" stroke="#FFF" stroke-width="0.8" />
        <line x1="66" y1="30" x2="66" y2="27" stroke="#FFF" stroke-width="0.8" />
      `;
      break;

    case 'snake_plant':
      content = `
        <!-- Tall upright sword leaves -->
        <!-- Center Leaf (Tallest) -->
        <g>
          <path d="M 46 51 C 42 35 45 10 50 6 C 55 10 58 35 54 51 Z" fill="${leafColor1}" />
          <!-- Striped pattern inside -->
          <path d="M 48 51 C 46 38 48 18 50 12 C 52 18 54 38 52 51 Z" fill="${leafColor2}" />
          <!-- Yellow wavy border -->
          <path d="M 46 51 C 42 35 45 10 50 6" fill="none" stroke="#E9C46A" stroke-width="1.5" opacity="${isThirsty ? 0.4 : 1}" />
          <path d="M 50 6 C 55 10 58 35 54 51" fill="none" stroke="#E9C46A" stroke-width="1.5" opacity="${isThirsty ? 0.4 : 1}" />
        </g>
        
        <!-- Left Leaf -->
        <g>
          <path d="M 38 51 C 32 38 36 22 41 18 C 45 22 46 38 42 51 Z" fill="${leafColor2}" />
          <path d="M 38 51 C 32 38 36 22 41 18" fill="none" stroke="#E9C46A" stroke-width="1.2" opacity="${isThirsty ? 0.4 : 1}" />
        </g>
        
        <!-- Right Leaf -->
        <g>
          <path d="M 58 51 C 54 38 56 25 61 20 C 65 25 68 38 62 51 Z" fill="${leafColor3}" />
          <path d="M 61 20 C 65 25 68 38 62 51" fill="none" stroke="#E9C46A" stroke-width="1.2" opacity="${isThirsty ? 0.4 : 1}" />
        </g>
      `;
      break;
  }

  return `
    <svg viewBox="0 0 100 100" class="plant-svg mature" xmlns="http://www.w3.org/2000/svg">
      <!-- Soil -->
      <ellipse cx="50" cy="51" rx="19" ry="5" fill="#6C584C" />
      
      ${content}
      ${pot}
    </svg>
  `;
}

// 4. Blooming Stage (Adds dynamic flowers to mature plant!)
function getBloomingSVG(species, potColorName, mood) {
  const matureSVG = getMatureSVG(species, potColorName, mood);
  const isThirsty = mood === 'thirsty' || mood === 'sad';
  
  // Custom flower details based on species
  let flowers = '';
  switch (species) {
    case 'monstera':
      // Gorgeous white/creamy spadix spathe flower
      flowers = `
        <g transform="translate(48, 14)">
          <!-- White Spathe petal -->
          <path d="M 0 0 C -8 -5 -10 -18 0 -24 C 10 -18 8 -5 0 0 Z" fill="#F4F1DE" stroke="#E07A5F" stroke-width="0.5" />
          <!-- Yellow Spadix spike -->
          <rect x="-2" y="-18" width="4" height="12" rx="2" fill="#F4A261" />
        </g>
      `;
      break;
    case 'succulent':
      // Cute pink blossoms on a thin stem
      flowers = `
        <g>
          <!-- Thin Flower stem -->
          <path d="M 50 35 Q 40 22 44 10" fill="none" stroke="#81B29A" stroke-width="1.5" />
          
          <!-- Blossoms -->
          <!-- Flower 1 -->
          <g transform="translate(44, 10)">
            <circle cx="0" cy="0" r="3.5" fill="#F28482" />
            <circle cx="0" cy="-3" r="2" fill="#F28482" />
            <circle cx="-3" cy="0" r="2" fill="#F28482" />
            <circle cx="3" cy="0" r="2" fill="#F28482" />
            <circle cx="0" cy="3" r="2" fill="#F28482" />
            <circle cx="0" cy="0" r="1.2" fill="#F4F1DE" />
          </g>
          <!-- Flower 2 -->
          <g transform="translate(42, 18) scale(0.7)">
            <circle cx="0" cy="0" r="3.5" fill="#F28482" />
            <circle cx="0" cy="-3" r="2" fill="#F28482" />
            <circle cx="-3" cy="0" r="2" fill="#F28482" />
            <circle cx="3" cy="0" r="2" fill="#F28482" />
            <circle cx="0" cy="3" r="2" fill="#F28482" />
            <circle cx="0" cy="0" r="1.2" fill="#F4F1DE" />
          </g>
        </g>
      `;
      break;
    case 'fern':
      // Ferns don't flower biologically, so we give it magical glowing forest spores (little golden glowing stars!)
      flowers = `
        <g class="magic-glow">
          <circle cx="34" cy="18" r="1.5" fill="#F4A261" filter="drop-shadow(0 0 2px #E9C46A)" />
          <circle cx="50" cy="6" r="2" fill="#F4A261" filter="drop-shadow(0 0 2px #E9C46A)" />
          <circle cx="68" cy="14" r="1.5" fill="#F4A261" filter="drop-shadow(0 0 2px #E9C46A)" />
          <!-- Sparkle stars -->
          <path d="M 44 22 L 45 20 L 47 20 L 45 19 L 44 17 L 43 19 L 41 20 L 43 20 Z" fill="#E9C46A" />
          <path d="M 58 12 L 59 10 L 61 10 L 59 9 L 58 7 L 57 9 L 55 10 L 57 10 Z" fill="#E9C46A" />
        </g>
      `;
      break;
    case 'cactus':
      // Large premium pink cactus flower right on top!
      flowers = `
        <g transform="translate(50, 16)">
          <!-- Petals -->
          <ellipse cx="0" cy="0" rx="8" ry="4" fill="#F28482" transform="rotate(0)" />
          <ellipse cx="0" cy="0" rx="8" ry="4" fill="#F28482" transform="rotate(45)" />
          <ellipse cx="0" cy="0" rx="8" ry="4" fill="#F28482" transform="rotate(90)" />
          <ellipse cx="0" cy="0" rx="8" ry="4" fill="#F28482" transform="rotate(135)" />
          <!-- Center -->
          <circle cx="0" cy="0" r="3" fill="#E9C46A" />
        </g>
      `;
      break;
    case 'snake_plant':
      // Small delicate white blossoms on a spike stalk rising alongside the leaves
      flowers = `
        <g>
          <!-- Blossom stalk -->
          <path d="M 52 51 L 52 14" fill="none" stroke="#F4F1DE" stroke-width="1.2" opacity="0.8" />
          <!-- Tiny white stars -->
          <g transform="translate(52, 14)">
            <circle cx="0" cy="0" r="1.5" fill="#FFF" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#E9C46A" stroke-width="0.5" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#E9C46A" stroke-width="0.5" />
          </g>
          <g transform="translate(52, 22)">
            <circle cx="0" cy="0" r="1.5" fill="#FFF" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#E9C46A" stroke-width="0.5" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#E9C46A" stroke-width="0.5" />
          </g>
          <g transform="translate(52, 30)">
            <circle cx="0" cy="0" r="1.5" fill="#FFF" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#E9C46A" stroke-width="0.5" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#E9C46A" stroke-width="0.5" />
          </g>
        </g>
      `;
      break;
  }

  // Insert the flowers right before the pot block
  const potMarker = '<!-- Soil -->';
  const splitIndex = matureSVG.indexOf(potMarker);
  
  if (splitIndex !== -1) {
    const head = matureSVG.substring(0, splitIndex);
    const tail = matureSVG.substring(splitIndex);
    return `${head}${flowers}${tail}`;
  }
  
  return matureSVG;
}

// Master function to export/retrieve SVG markup string
function getPlantSVG(species, stage, mood, potColorName) {
  switch (stage) {
    case 'seedling':
      return getSeedlingSVG(potColorName, mood);
    case 'sprout':
      return getSproutSVG(species, potColorName, mood);
    case 'mature':
      return getMatureSVG(species, potColorName, mood);
    case 'blooming':
      return getBloomingSVG(species, potColorName, mood);
    default:
      return getSeedlingSVG(potColorName, mood);
  }
}

// Make available globally
window.getPlantSVG = getPlantSVG;
window.POT_COLORS = POT_COLORS;

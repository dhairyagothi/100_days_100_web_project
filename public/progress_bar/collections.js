const progressbars = [

    {
        id: "neon",

        name: "Neon Progressbar",

        description: "Glowing animated gradient progressbar",
        category : "neon",

        previewHTML: `
        <div class="preview-neon">
            <div class="bar">
                <div class="fill"></div>
            </div>
        </div>
    `,

        previewCSS: `
        .preview-neon{
            display:flex;
            justify-content:center;
            align-items:center;
            width:100%;
            height:100%;
        }

        .preview-neon .bar{
            width:180px;
            height:16px;
            background:#1b1b1b;
            border-radius:50px;
            overflow:hidden;
        }

        .preview-neon .fill{
            width:80%;
            height:100%;
            background:linear-gradient(90deg,#00f7ff,#8b5cf6);
            box-shadow:0 0 20px #00f7ff;
            animation:neonFill 2s infinite alternate;
        }

        @keyframes neonFill{
            from{width:20%;}
            to{width:85%;}
        }
    `,

        htmlCode: `
<div class="progress">
    <div class="fill"></div>
</div>
`,

        cssCode: `
.progress{
    width:300px;
    height:18px;
    background:#1b1b1b;
    border-radius:50px;
    overflow:hidden;
}

.fill{
    width:80%;
    height:100%;
    background:linear-gradient(90deg,#00f7ff,#8b5cf6);
}
`
    },

    {
        id: "walking",

        name: "Walking Man Progress",

        description: "Animated walking man on a loading track",
        category : "smooth",

        previewHTML: `
        <div class="preview-walking">
            <div class="track">
                <div class="man">🚶</div>
            </div>
        </div>
    `,

        previewCSS: `
        .preview-walking{
            display:flex;
            justify-content:center;
            align-items:center;
            height:100%;
        }

        .preview-walking .track{
            width:180px;
            height:8px;
            background:#222;
            border-radius:20px;
            position:relative;
        }

        .preview-walking .man{
            position:absolute;
            top:-20px;
            animation:walk 3s linear infinite alternate;
        }

        @keyframes walk{
            from{
                left:0;
            }
            to{
                left:150px;
            }
        }
    `,

        htmlCode: `
<div class="track">
    <div class="man">🚶</div>
</div>
`,

        cssCode: `
.track{
    width:300px;
    height:8px;
    background:#222;
    position:relative;
}

.man{
    position:absolute;
    top:-20px;
    animation:walk 3s linear infinite alternate;
}

@keyframes walk{
    from{left:0;}
    to{left:270px;}
}
`
    },


    {
        id: "space",

        name: "Space Tunnel Progress",

        description: "Flying particles inside a space tunnel",
        category : "bounce",

        previewHTML: `
        <div class="preview-space">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
        </div>
    `,

        previewCSS: `
        .preview-space{
            width:180px;
            height:100px;
            position:relative;
            overflow:hidden;
        }

        .preview-space .star{
            width:4px;
            height:4px;
            background:white;
            border-radius:50%;
            position:absolute;
            left:50%;
            top:50%;
            animation:spaceFly 1.5s linear infinite;
        }

        .preview-space .star:nth-child(2){
            animation-delay:.3s;
        }

        .preview-space .star:nth-child(3){
            animation-delay:.6s;
        }

        .preview-space .star:nth-child(4){
            animation-delay:.9s;
        }

        @keyframes spaceFly{
            from{
                transform:scale(.2);
                opacity:1;
            }

            to{
                transform:scale(12);
                opacity:0;
            }
        }
    `,

        htmlCode: `
<div class="space">
    <div class="star"></div>
</div>
`,

        cssCode: `
.star{
    width:5px;
    height:5px;
    background:white;
    border-radius:50%;
    animation:spaceFly 1.5s linear infinite;
}
`
    },


    {
        id: "crystal",

        name: "Crystal Progress",

        description: "Diamond blocks light up one by one",

        category : "classic",

        previewHTML: `
        <div class="preview-crystal">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    `,

        previewCSS: `
        .preview-crystal{
            display:flex;
            gap:10px;
        }

        .preview-crystal div{
            width:20px;
            height:20px;
            background:#5eead4;
            transform:rotate(45deg);
            animation:crystalGlow 1s infinite alternate;
        }

        .preview-crystal div:nth-child(2){
            animation-delay:.2s;
        }

        .preview-crystal div:nth-child(3){
            animation-delay:.4s;
        }

        .preview-crystal div:nth-child(4){
            animation-delay:.6s;
        }

        .preview-crystal div:nth-child(5){
            animation-delay:.8s;
        }

        @keyframes crystalGlow{
            from{
                opacity:.2;
            }

            to{
                box-shadow:0 0 20px cyan;
            }
        }
    `,

        htmlCode: `
<div class="crystal"></div>
`,

        cssCode: `
.crystal{
    width:20px;
    height:20px;
    transform:rotate(45deg);
    background:#5eead4;
}
`
    },


    {
        id: "pacman",

        name: "Pacman Progress",

        description: "Pacman eating loading dots",
        category : "bounce",

        previewHTML: `
        <div class="preview-pacman">
            <div class="pacman">ᗧ</div>
            <div class="dots">
                • • • • •
            </div>
        </div>
    `,

        previewCSS: `
        .preview-pacman{
            display:flex;
            align-items:center;
            gap:10px;
        }

        .preview-pacman .pacman{
            color:yellow;
            font-size:32px;
            animation:pacMove 2s linear infinite alternate;
        }

        @keyframes pacMove{
            from{
                transform:translateX(0);
            }
            to{
                transform:translateX(30px);
            }
        }
    `,

        htmlCode: `
<div class="pacman">ᗧ</div>
`,

        cssCode: `
.pacman{
    color:yellow;
    font-size:40px;
}
`},


    {
        id: "ring",

        name: "Circular Ring Progress",

        description: "Rotating glowing circular ring",
        category : "neon",

        previewHTML: `
        <div class="preview-ring-progress">
            <div class="circle"></div>
        </div>
    `,

        previewCSS: `
        .preview-ring-progress{
            display:flex;
            justify-content:center;
            align-items:center;
            height:100%;
        }

        .preview-ring-progress .circle{
            width:60px;
            height:60px;
            border:6px solid #333;
            border-top-color:#57d8ff;
            border-radius:50%;
            animation:ringSpin 1s linear infinite;
            box-shadow:0 0 20px #57d8ff;
        }

        @keyframes ringSpin{
            to{
                transform:rotate(360deg);
            }
        }
    `,

        htmlCode: `
<div class="circle"></div>
`,

        cssCode: `
.circle{
    width:80px;
    height:80px;
    border:8px solid #333;
    border-top-color:#57d8ff;
    border-radius:50%;
    animation:ringSpin 1s linear infinite;
}`},

// Bounce Ball Progressbar
{
  id: "bounce-ball",
  name: "Bounce Ball Progressbar",
  description: "Ball bouncing across the track",
  category: "bounce",
  previewHTML: `
    <div class="preview-bounce">
      <div class="track"><div class="ball"></div></div>
    </div>
  `,
  previewCSS: `
    .preview-bounce .track {
      width: 200px;
      height: 8px;
      background: #ddd;
      border-radius: 10px;
      position: relative;
    }
    .preview-bounce .ball {
      width: 20px;
      height: 20px;
      background: #ff4d4d;
      border-radius: 50%;
      position: absolute;
      top: -6px;
      animation: bounceBall 2s ease-in-out infinite;
    }
    @keyframes bounceBall {
      0% { left: 0; transform: translateY(0); }
      50% { left: 180px; transform: translateY(-15px); }
      100% { left: 0; transform: translateY(0); }
    }
  `,
  htmlCode: `<div class="ball"></div>`,
  cssCode: `.ball { animation: bounceBall 2s infinite; }`
},

// Smooth Circular Fill Progressbar
{
  id: "circle-fill",
  name: "Circular Fill Progress",
  description: "Smooth circular progress filling up",
  category: "smooth",
  previewHTML: `
    <div class="preview-circle-fill">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" />
      </svg>
    </div>
  `,
  previewCSS: `
    .preview-circle-fill svg {
      width: 80px;
      height: 80px;
      transform: rotate(-90deg);
    }
    .preview-circle-fill circle {
      fill: none;
      stroke: #00c6ff;
      stroke-width: 10;
      stroke-dasharray: 283;
      stroke-dashoffset: 283;
      animation: circleFill 3s linear forwards;
    }
    @keyframes circleFill {
      to { stroke-dashoffset: 0; }
    }
  `,
  htmlCode: `<svg><circle cx="50" cy="50" r="45"></circle></svg>`,
  cssCode: `.circle { stroke-dasharray: 283; animation: circleFill 3s linear forwards; }`
},

// Bounce Dot Progressbar
{
  id: "bounce-dots",
  name: "Bouncing Dots Progress",
  description: "Three bouncing dots indicating progress",
  category: "bounce",
  previewHTML: `
    <div class="preview-bounce-dots">
      <span></span><span></span><span></span>
    </div>
  `,
  previewCSS: `
    .preview-bounce-dots {
      display: flex;
      gap: 8px;
    }
    .preview-bounce-dots span {
      width: 12px;
      height: 12px;
      background: #ff4d4d;
      border-radius: 50%;
      animation: bounceDots 0.6s infinite alternate;
    }
    .preview-bounce-dots span:nth-child(2) { animation-delay: 0.2s; }
    .preview-bounce-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounceDots {
      from { transform: translateY(0); }
      to { transform: translateY(-12px); }
    }
  `,
  htmlCode: `<div class="bounce-dots"><span></span><span></span><span></span></div>`,
  cssCode: `.bounce-dots span { animation: bounceDots 0.6s infinite alternate; }`
},

// Neon Hexagon Progressbar
{
  id: "hexagon",
  name: "Neon Hexagon Progress",
  description: "Glowing hexagon outline filling",
  category: "neon",
  previewHTML: `
    <div class="preview-hexagon">
      <div class="hex"></div>
    </div>
  `,
  previewCSS: `
    .preview-hexagon .hex {
      width: 80px;
      height: 46px;
      background: transparent;
      position: relative;
      margin: 20px;
      border-left: solid 4px #57d8ff;
      border-right: solid 4px #57d8ff;
      animation: hexGlow 2s infinite alternate;
    }
    .preview-hexagon .hex:before,
    .preview-hexagon .hex:after {
      content: "";
      position: absolute;
      width: 0;
      border-left: 40px solid transparent;
      border-right: 40px solid transparent;
    }
    .preview-hexagon .hex:before {
      bottom: 100%;
      border-bottom: 23px solid #57d8ff;
    }
    .preview-hexagon .hex:after {
      top: 100%;
      border-top: 23px solid #57d8ff;
    }
    @keyframes hexGlow {
      from { box-shadow: 0 0 10px #57d8ff; }
      to { box-shadow: 0 0 25px #57d8ff; }
    }
  `,
  htmlCode: `<div class="hex"></div>`,
  cssCode: `.hex { animation: hexGlow 2s infinite alternate; }`
},

// Classic Text Loader Progressbar
{
  id: "text-loader",
  name: "Classic Text Loader",
  description: "Loading text with animated dots",
  category: "classic",
  previewHTML: `
    <div class="preview-text-loader">
      Loading<span>.</span><span>.</span><span>.</span>
    </div>
  `,
  previewCSS: `
    .preview-text-loader {
      font-family: monospace;
      font-size: 18px;
      color: #333;
    }
    .preview-text-loader span {
      opacity: 0;
      animation: dotsFade 1s infinite;
    }
    .preview-text-loader span:nth-child(1) { animation-delay: 0.2s; }
    .preview-text-loader span:nth-child(2) { animation-delay: 0.4s; }
    .preview-text-loader span:nth-child(3) { animation-delay: 0.6s; }
    @keyframes dotsFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  htmlCode: `<div class="text-loader">Loading<span>.</span><span>.</span><span>.</span></div>`,
  cssCode: `.text-loader span { animation: dotsFade 1s infinite; }`
}
,
{
    id: "pulse-blocks",

    name: "Pulse Blocks Progress",

    description: "Colorful blocks pulsing in sequence",

    category: "bounce",

    previewHTML: `
    <div class="preview-pulse">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
    `,

    previewCSS: `
    .preview-pulse{
        display:flex;
        gap:8px;
    }

    .preview-pulse span{
        width:18px;
        height:18px;
        border-radius:4px;
        background:#f97316;
        animation:pulseBlock 1s infinite;
    }

    .preview-pulse span:nth-child(2){animation-delay:.2s;}
    .preview-pulse span:nth-child(3){animation-delay:.4s;}
    .preview-pulse span:nth-child(4){animation-delay:.6s;}
    .preview-pulse span:nth-child(5){animation-delay:.8s;}

    @keyframes pulseBlock{
        50%{
            transform:scale(1.6);
            background:#ec4899;
        }
    }
    `,

    htmlCode: `
<div class="pulse-blocks">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>
`,

    cssCode: `
.pulse-blocks{
    display:flex;
    gap:10px;
}

.pulse-blocks span{
    width:20px;
    height:20px;
    border-radius:4px;
    background:#f97316;
    animation:pulseBlock 1s infinite;
}

.pulse-blocks span:nth-child(2){animation-delay:.2s;}
.pulse-blocks span:nth-child(3){animation-delay:.4s;}
.pulse-blocks span:nth-child(4){animation-delay:.6s;}
.pulse-blocks span:nth-child(5){animation-delay:.8s;}

@keyframes pulseBlock{
    50%{
        transform:scale(1.6);
        background:#ec4899;
    }
}
`
},
{
    id: "rainbow-runner",

    name: "Rainbow Runner Progress",

    description: "Bright rainbow beam racing across track",

    category: "neon",

    previewHTML: `
    <div class="preview-rainbow">
        <div class="runner"></div>
    </div>
    `,

    previewCSS: `
    .preview-rainbow{
        width:180px;
        height:14px;
        background:#111;
        border-radius:50px;
        overflow:hidden;
        position:relative;
    }

    .preview-rainbow .runner{
        position:absolute;
        height:100%;
        width:40px;
        background:linear-gradient(
            90deg,
            #ff0000,
            #ff9900,
            #ffff00,
            #00ff00,
            #00ffff,
            #0000ff,
            #ff00ff
        );
        box-shadow:0 0 20px #00ffff;
        animation:runnerMove 2s infinite linear;
    }

    @keyframes runnerMove{
        from{left:-40px;}
        to{left:180px;}
    }
    `,

    htmlCode: `
<div class="rainbow-progress">
    <div class="runner"></div>
</div>
`,

    cssCode: `
.rainbow-progress{
    width:300px;
    height:14px;
    background:#111;
    border-radius:50px;
    overflow:hidden;
    position:relative;
}

.runner{
    position:absolute;
    width:60px;
    height:100%;
    background:linear-gradient(
        90deg,
        #ff0000,
        #ff9900,
        #ffff00,
        #00ff00,
        #00ffff,
        #0000ff,
        #ff00ff
    );
    box-shadow:0 0 20px #00ffff;
    animation:runnerMove 2s infinite linear;
}

@keyframes runnerMove{
    from{left:-60px;}
    to{left:300px;}
}
`
},
{
    id: "segmented",

    name: "Segmented Progress",

    description: "Classic loading segments lighting up",

    category: "classic",

    previewHTML: `
    <div class="preview-segment">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
    `,

    previewCSS: `
    .preview-segment{
        display:flex;
        gap:6px;
    }

    .preview-segment span{
        width:24px;
        height:12px;
        border-radius:20px;
        background:#d1d5db;
        animation:segmentGlow 1.2s infinite;
    }

    .preview-segment span:nth-child(2){animation-delay:.2s;}
    .preview-segment span:nth-child(3){animation-delay:.4s;}
    .preview-segment span:nth-child(4){animation-delay:.6s;}
    .preview-segment span:nth-child(5){animation-delay:.8s;}
    .preview-segment span:nth-child(6){animation-delay:1s;}

    @keyframes segmentGlow{
        50%{
            background:#10b981;
        }
    }
    `,

    htmlCode: `
<div class="segmented-progress">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>
`,

    cssCode: `
.segmented-progress{
    display:flex;
    gap:8px;
}

.segmented-progress span{
    width:28px;
    height:14px;
    border-radius:20px;
    background:#d1d5db;
    animation:segmentGlow 1.2s infinite;
}

.segmented-progress span:nth-child(2){animation-delay:.2s;}
.segmented-progress span:nth-child(3){animation-delay:.4s;}
.segmented-progress span:nth-child(4){animation-delay:.6s;}
.segmented-progress span:nth-child(5){animation-delay:.8s;}
.segmented-progress span:nth-child(6){animation-delay:1s;}

@keyframes segmentGlow{
    50%{
        background:#10b981;
    }
}
`
}


];
const progreGrid = document.getElementById("progreGrid");
const previewStyle = document.createElement("style");
document.head.appendChild(previewStyle);

let visibleCount = 4;          // initially show 4
const increment = 4;           // load more adds 4
let currentCategory = "all";
let searchQuery = "";

// inject all preview CSS once
progressbars.forEach(item => {
  previewStyle.textContent += item.previewCSS;
});

// filter + search logic
function getFilteredProgressbars() {
  return progressbars.filter(item => {
    const matchesCategory =
      currentCategory === "all" || item.category === currentCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });
}

// render cards
function renderProgressbars() {
  progreGrid.innerHTML = "";
  const filtered = getFilteredProgressbars();

  filtered.slice(0, visibleCount).forEach(item => {
    const card = document.createElement("article");
    card.className = "progre-card";
    card.innerHTML = `
      <div class="progre-preview">${item.previewHTML}</div>
      <div class="progre-details">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="view-code" data-id="${item.id}">View Code</button>
      </div>
    `;
    progreGrid.appendChild(card);
  });

  // toggle Load More button
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.style.display =
    visibleCount >= filtered.length ? "none" : "block";
}

// load more handler
function loadMoreProgressbars() {
  visibleCount += increment;
  renderProgressbars();
}

// event listeners
document.getElementById("loadMoreBtn").addEventListener("click", loadMoreProgressbars);

document.getElementById("categoryFilter").addEventListener("change", e => {
  currentCategory = e.target.value;
  visibleCount = 4; // reset
  renderProgressbars();
});

document.getElementById("searchBox").addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase();
  visibleCount = 4; // reset
  renderProgressbars();
});

// initial render
renderProgressbars();

const cursors = [
  {
    id: "galaxy",
    name: "Galaxy Cursor",
    description: "Glowing galaxy trail cursor",

    previewHTML: `
      <div class="preview-galaxy">
        <div class="preview-dot"></div>
      </div>
    `,

    previewCSS: `
      .preview-galaxy{
        position:relative;
        width:100%;
        height:100%;
      }

      .preview-galaxy .preview-dot{
        position:absolute;
        width:14px;
        height:14px;
        border-radius:50%;
        background:#ffd84a;
        box-shadow:
          0 0 10px #ffd84a,
          0 0 25px #57d8ff;
        animation: galaxyOrbit 3s linear infinite;
      }

      @keyframes galaxyOrbit{
        0%{
          top:20%;
          left:20%;
        }
        50%{
          top:70%;
          left:70%;
        }
        100%{
          top:20%;
          left:20%;
        }
      }
    `,

    cursorCSS: `
.cursor{
    width:16px;
    height:16px;
    border-radius:50%;

    background:#ffd84a;

    box-shadow:
      0 0 15px #ffd84a,
      0 0 30px #57d8ff,
      0 0 60px #ff7ad9;
}

.cursor::before{
    content:"";
    position:absolute;

    inset:-12px;
    border-radius:50%;

    border:2px solid rgba(87,216,255,.5);

    animation:galaxyRotate 3s linear infinite;
}

@keyframes galaxyRotate{
    to{
      transform:rotate(360deg);
    }
}
`
  },

  {
    id: "ring",

    name: "Ring Cursor",

    description: "Animated Ring Cursor",

    previewHTML: `
      <div class="preview-ring">
        <div class="ring"></div>
      </div>
    `,

    previewCSS: `
      .preview-ring{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
      }

      .preview-ring .ring{
        width:30px;
        height:30px;
        border:3px solid #57d8ff;
        border-radius:50%;
        animation:ringPulse 2s infinite;
      }

      @keyframes ringPulse{
        50%{
          transform:scale(1.4);
          opacity:.5;
        }
      }
    `,
    cursorCSS: `
.cursor{
  width:30px;
  height:30px;
  border-radius:50%;
  border:3px solid #57d8ff;
  background:transparent;

  box-shadow:
    0 0 18px #57d8ff,
    inset 0 0 14px rgba(87,216,255,0.45);

  transform: translate(-50%, -50%);
  animation: ringGlow 2s infinite ease-in-out;
}

.cursor::before,
.cursor::after{
  display:none;
}

@keyframes ringGlow{
  50%{
    transform: translate(-50%, -50%) scale(1.2);
    opacity:0.7;
  }
}
`
  },
  {
    id: "diamond",

    name: "Diamond Cursor",

    description: "Rotating diamond cursor",

    previewHTML: `
      <div class="preview-diamond">
        <div class="diamond"></div>
      </div>
    `,

    previewCSS: `
      .preview-diamond{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
      }

      .preview-diamond .diamond{
        width:24px;
        height:24px;

        background:
        linear-gradient(
          135deg,
          #ffd84a,
          #ff7ad9,
          #57d8ff
        );

        transform:rotate(45deg);

        animation:diamondSpin 3s linear infinite;
      }

      @keyframes diamondSpin{
        from{
          transform:rotate(45deg);
        }
        to{
          transform:rotate(405deg);
        }
      }
    `,

    cursorCSS: `
.cursor{
  width:22px;
  height:22px;

  background: linear-gradient(
    135deg,
    #ffd84a,
    #ff7ad9,
    #57d8ff
  );

  transform: translate(-50%, -50%) rotate(45deg);

  box-shadow:
    0 0 18px rgba(255,216,74,0.7),
    0 0 40px rgba(87,216,255,0.5);

  border-radius: 6px;

  animation: diamondGlow 2s infinite ease-in-out;
}

.cursor::before,
.cursor::after{
  display:none;
}

@keyframes diamondGlow{
  50%{
    transform: translate(-50%, -50%) rotate(45deg) scale(1.25);
    opacity:0.8;
  }
}
`
  },
  {
    id: "crosshair",

    name: "Crosshair Cursor",

    description: "Gaming style targeting cursor",

    previewHTML: `
      <div class="preview-crosshair">
        <div class="crosshair"></div>
      </div>
    `,

    previewCSS: `
      .preview-crosshair{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
      }

      .crosshair{
        position:relative;

        width:32px;
        height:32px;

        border:2px solid white;
        border-radius:50%;

        animation:crossPulse 2s infinite;
      }

      .crosshair::before,
      .crosshair::after{
        content:"";
        position:absolute;
        background:#ffd84a;
      }

      .crosshair::before{
        width:2px;
        height:40px;
        left:50%;
        top:-6px;
        transform:translateX(-50%);
      }

      .crosshair::after{
        width:40px;
        height:2px;
        top:50%;
        left:-6px;
        transform:translateY(-50%);
      }

      @keyframes crossPulse{
        50%{
          transform:scale(1.15);
        }
      }
    `,

    cursorCSS: `
.cursor{
  width:34px;
  height:34px;

  border-radius:50%;
  border:2px solid #ffffff;

  background:
    linear-gradient(#ffd84a, #ffd84a) center/2px 100% no-repeat,
    linear-gradient(#ffd84a, #ffd84a) center/100% 2px no-repeat;

  transform: translate(-50%, -50%);

  box-shadow:
    0 0 15px rgba(255,255,255,0.4),
    0 0 30px rgba(255,216,74,0.4);

  animation: crossPulse 2s infinite ease-in-out;
}

.cursor::before,
.cursor::after{
  display:none;
}

@keyframes crossPulse{
  50%{
    transform: translate(-50%, -50%) scale(1.15);
    box-shadow:
      0 0 20px rgba(255,255,255,0.6),
      0 0 40px rgba(255,216,74,0.6);
  }
}
`
  },
  {
    id: "pulse",

    name: "Pulse Cursor",

    description: "Breathing glow effect",

    previewHTML: `
      <div class="preview-pulse">
        <div class="pulse-dot"></div>
      </div>
    `,

    previewCSS: `
      .preview-pulse{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
      }

      .pulse-dot{
        width:18px;
        height:18px;
        border-radius:50%;

        background:#57d8ff;

        box-shadow:
          0 0 15px #57d8ff,
          0 0 40px #57d8ff;

        animation:pulseGlow 1.5s infinite;
      }

      @keyframes pulseGlow{
        50%{
          transform:scale(1.8);
          opacity:.5;
        }
      }
    `,

    cursorCSS: `
.cursor{
    width:18px;
    height:18px;
    border-radius:50%;
    background:#57d8ff;

    box-shadow:
      0 0 15px #57d8ff,
      0 0 40px #57d8ff;

    animation:pulseCursor 1.5s infinite;
}

.cursor::before,
.cursor::after{
    display:none;
}

@keyframes pulseCursor{
    50%{
        transform:
          translate(-50%,-50%)
          scale(1.8);
        opacity:.5;
    }
}
`
  },
  {
    id: "comet",

    name: "Comet Cursor",

    description: "Cursor with glowing trail",

    previewHTML: `
      <div class="preview-comet">
        <div class="comet"></div>
      </div>
    `,

    previewCSS: `
      .preview-comet{
        position:relative;
        width:100%;
        height:100%;
      }

      .comet{
        position:absolute;
        width:12px;
        height:12px;
        border-radius:50%;
        background:#ffd84a;
        box-shadow:0 0 15px #ffd84a;
        animation:cometMove 4s linear infinite;
      }

      .comet::before{
        content:"";
        position:absolute;
        width:50px;
        height:3px;
        right:100%;
        top:50%;
        transform:translateY(-50%);
        background:linear-gradient(
          to left,
          #ffd84a,
          transparent
        );
      }

      @keyframes cometMove{
        0%{
          left:10%;
          top:70%;
        }

        50%{
          left:80%;
          top:30%;
        }

        100%{
          left:10%;
          top:70%;
        }
      }
    `,

    cursorCSS: `
      .cursor{
        width:16px;
        height:16px;

        border-radius:50%;

        background:#ffd84a;

        box-shadow:
          0 0 15px #ffd84a,
          0 0 35px #ffb700,
          0 0 60px rgba(255,216,74,.6);

        animation:cometGlow 2s infinite ease-in-out;
      }

      .cursor::before{
        content:"";

        position:absolute;

        width:55px;
        height:4px;

        right:100%;
        top:50%;

        transform:translateY(-50%);

        background:
          linear-gradient(
            to left,
            rgba(255,216,74,1),
            rgba(255,216,74,.4),
            transparent
          );

        border-radius:999px;
      }

      .cursor::after{
        display:none;
      }

      @keyframes cometGlow{
        50%{
          transform:
            translate(-50%, -50%)
            scale(1.3);
        }
      }
    `
  },
  {
    id: "orbit",

    name: "Orbit Cursor",

    description: "Planet orbit animation",

    previewHTML: `
      <div class="preview-orbit">
        <div class="orbit-center"></div>
        <div class="orbit-dot"></div>
      </div>
    `,

    previewCSS: `
      .preview-orbit{
        position:relative;
        width:100%;
        height:100%;

        display:flex;
        justify-content:center;
        align-items:center;
      }

      .orbit-center{
        width:12px;
        height:12px;
        border-radius:50%;
        background:#ffd84a;
      }

      .orbit-dot{
        position:absolute;

        width:10px;
        height:10px;

        border-radius:50%;

        background:#57d8ff;

        animation:orbitSpin 3s linear infinite;
      }

      @keyframes orbitSpin{

        from{
          transform:
            rotate(0deg)
            translateX(35px);
        }

        to{
          transform:
            rotate(360deg)
            translateX(35px);
        }
      }
    `,

    cursorCSS: `
.cursor{
    width:14px;
    height:14px;
    border-radius:50%;
    background:#ffd84a;
}

.cursor::before{
    content:"";
    position:absolute;
    width:10px;
    height:10px;
    border-radius:50%;
    background:#57d8ff;

    animation:orbitCursor 2s linear infinite;
}

.cursor::after{
    display:none;
}

@keyframes orbitCursor{
    from{
      transform:rotate(0deg) translateX(20px);
    }
    to{
      transform:rotate(360deg) translateX(20px);
    }
}
`
  },
  {
    id: "spark",

    name: "Spark Cursor",

    description: "Electric spark effect",

    previewHTML: `
      <div class="preview-spark">
        <div class="spark"></div>
      </div>
    `,

    previewCSS: `
      .preview-spark{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
      }

      .spark{
        width:12px;
        height:12px;
        background:#00f5ff;
        transform:rotate(45deg);

        animation:sparkFlash 1s infinite;
      }

      @keyframes sparkFlash{
        50%{
          transform:rotate(45deg) scale(2);
          box-shadow:0 0 25px #00f5ff;
        }
      }
    `,
    cursorCSS: `
.cursor{
    width:14px;
    height:14px;
    background:#00f5ff;

    transform:
      translate(-50%,-50%)
      rotate(45deg);

    animation:sparkCursor 1s infinite;
}

.cursor::before,
.cursor::after{
    display:none;
}

@keyframes sparkCursor{
    50%{
      transform:
        translate(-50%,-50%)
        rotate(45deg)
        scale(2);

      box-shadow:
        0 0 25px #00f5ff;
    }
}
`
  },
  {
    id: "fire",

    name: "Fire Cursor",

    description: "Burning flame cursor",

    previewHTML: `
      <div class="preview-fire">
        <div class="fire"></div>
      </div>
    `,

    previewCSS: `
      .preview-fire{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
      }

      .fire{
        width:20px;
        height:30px;

        background:linear-gradient(
          orange,
          red
        );

        border-radius:50% 50% 50% 0;

        transform:rotate(-45deg);

        animation:fireBurn 1.5s infinite alternate;
      }

      @keyframes fireBurn{
        to{
          transform:rotate(-45deg) scale(1.2);
        }
      }
    `,
    cursorCSS: `
.cursor{
    width:20px;
    height:28px;

    background:
      linear-gradient(
        orange,
        red
      );

    border-radius:50% 50% 50% 0;

    transform:
      translate(-50%,-50%)
      rotate(-45deg);

    animation:fireCursor 1.2s infinite alternate;
}

.cursor::before,
.cursor::after{
    display:none;
}

@keyframes fireCursor{
    to{
      transform:
        translate(-50%,-50%)
        rotate(-45deg)
        scale(1.2);
    }
}
`
  },
  {
    id: "rocket",

    name: "Rocket Cursor",

    description: "Flying rocket effect",

    previewHTML: `
      <div class="preview-rocket">
        <div class="rocket">🚀</div>
      </div>
    `,

    previewCSS: `
      .preview-rocket{
        position:relative;
        height:100%;
      }

      .rocket{
        position:absolute;
        font-size:28px;

        animation:rocketFly 4s linear infinite;
      }

      @keyframes rocketFly{
        0%{
          left:0;
          top:70%;
        }
        100%{
          left:85%;
          top:20%;
        }
      }
    `,
    cursorCSS: `
.cursor{
    width:auto;
    height:auto;
    background:none;
    box-shadow:none;
}

.cursor::before{
    content:"🚀";
    font-size:24px;
}

.cursor::after{
    display:none;
}
`
  },
 {
  id: "triangle",

  name: "Triangle Cursor",

  description: "Sharp glowing triangle cursor with rotation effect",

  previewHTML: `
    <div class="preview-triangle">
      <div class="triangle-core"></div>
    </div>
  `,

  previewCSS: `
    .preview-triangle{
      width:100%;
      height:100%;
      position:relative;
      display:flex;
      justify-content:center;
      align-items:center;
      background:#0b0b1a;
    }

    .triangle-core{
      width:0;
      height:0;

      border-left:10px solid transparent;
      border-right:10px solid transparent;
      border-bottom:18px solid #00e5ff;

      filter:drop-shadow(0 0 8px #00e5ff);

      animation:triangleSpin 2.5s linear infinite;
    }

    @keyframes triangleSpin{
      0%{
        transform:rotate(0deg) translateY(0px);
        opacity:0.8;
      }
      50%{
        transform:rotate(180deg) translateY(-10px);
        opacity:0.4;
      }
      100%{
        transform:rotate(360deg) translateY(0px);
        opacity:0.8;
      }
    }
  `,

  cursorCSS: `
    .cursor{
      width:0;
      height:0;

      border-left:8px solid transparent;
      border-right:8px solid transparent;
      border-bottom:14px solid #00e5ff;

      filter:drop-shadow(0 0 10px #00e5ff);

      position:fixed;
      top:0;
      left:0;
      transform:translate(-50%, -50%);
      pointer-events:none;
      z-index:9999;
    }

    .cursor::before,
    .cursor::after{
      display:none;
    }
  `,

  apply() {
    document.body.dataset.cursor = "triangle";
  }
},
  {
    id: "radar",

    name: "Radar Cursor",

    description: "Scanning radar effect",

    previewHTML: `
      <div class="preview-radar">
        <div class="radar"></div>
      </div>
    `,

    previewCSS: `
      .preview-radar{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
      }

      .radar{
        width:40px;
        height:40px;

        border:2px solid #57d8ff;
        border-radius:50%;

        position:relative;
      }

      .radar::after{
        content:"";

        position:absolute;

        width:2px;
        height:20px;

        background:#57d8ff;

        left:50%;
        top:0;

        transform-origin:bottom;

        animation:radarScan 2s linear infinite;
      }

      @keyframes radarScan{
        to{
          transform:rotate(360deg);
        }
      }
    `,
    cursorCSS: `
.cursor{
    width:40px;
    height:40px;

    border:2px solid #57d8ff;
    border-radius:50%;

    background:transparent;
}

.cursor::before{
    content:"";

    position:absolute;

    width:2px;
    height:20px;

    background:#57d8ff;

    left:50%;
    top:0;

    transform-origin:bottom;

    animation:radarCursor 1.5s linear infinite;
}

.cursor::after{
    display:none;
}

@keyframes radarCursor{
    to{
      transform:rotate(360deg);
    }
}
`
  },
  {
    id: "star",

    name: "Star Cursor",

    description: "Twinkling star effect",

    previewHTML: `
      <div class="preview-star">
        ⭐
      </div>
    `,

    previewCSS: `
      .preview-star{
        height:100%;
        display:flex;
        justify-content:center;
        align-items:center;

        font-size:30px;

        animation:starTwinkle 1s infinite;
      }

      @keyframes starTwinkle{
        50%{
          transform:scale(1.4);
        }
      }
    `,
    cursorCSS: `
.cursor{
    width:auto;
    height:auto;
    background:none;
    box-shadow:none;
}

.cursor::before{
    content:"⭐";
    font-size:24px;

    animation:starCursor 1s infinite;
}

.cursor::after{
    display:none;
}

@keyframes starCursor{
    50%{
      transform:scale(1.4);
    }
}
`
  },
  {
    id: "magnet",

    name: "Magnet Cursor",

    description: "Magnetic attraction effect",

    previewHTML: `
      <div class="preview-magnet">
        <div class="magnet">🧲</div>
      </div>
    `,

    previewCSS: `
      .preview-magnet{
        height:100%;
        display:flex;
        justify-content:center;
        align-items:center;
      }

      .magnet{
        font-size:32px;

        animation:magnetShake .6s infinite;
      }

      @keyframes magnetShake{
        25%{transform:translateX(-3px);}
        75%{transform:translateX(3px);}
      }
    `, cursorCSS: `
.cursor{
    width:auto;
    height:auto;
    background:none;
    box-shadow:none;
}

.cursor::before{
    content:"🧲";
    font-size:28px;

    animation:magnetCursor .6s infinite;
}

.cursor::after{
    display:none;
}

@keyframes magnetCursor{
    25%{
      transform:translateX(-3px);
    }
    75%{
      transform:translateX(3px);
    }
}
`
  },
  {
    id: "dna",

    name: "DNA Cursor",

    description: "Rotating DNA strand",

    previewHTML: `
      <div class="preview-dna">
        <div class="dna"></div>
      </div>
    `,

    previewCSS: `
      .preview-dna{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
      }

      .dna{
        width:10px;
        height:50px;

        border-radius:20px;

        background:
        linear-gradient(
          #57d8ff,
          #ff7ad9
        );

        animation:dnaRotate 2s infinite linear;
      }

      @keyframes dnaRotate{
        to{
          transform:rotateY(360deg);
        }
      }
    `,
    cursorCSS: `
.cursor{
    width:10px;
    height:40px;

    border-radius:20px;

    background:
      linear-gradient(
        #57d8ff,
        #ff7ad9
      );

    animation:dnaCursor 2s linear infinite;
}

.cursor::before,
.cursor::after{
    display:none;
}

@keyframes dnaCursor{
    to{
      transform:
        translate(-50%,-50%)
        rotateY(360deg);
    }
}
`

  }
];


const cursorStyleTag = document.createElement("style");
cursorStyleTag.id = "active-cursor-style";
document.head.appendChild(cursorStyleTag);

function applyCursor(id) {

  const cursorData = cursors.find(
    cursor => cursor.id === id
  );

  if (!cursorData) return;

  cursorStyleTag.textContent =
    cursorData.cursorCSS || "";

  localStorage.setItem(
    "selectedCursor",
    id
  );

  document
    .querySelectorAll(".apply-btn")
    .forEach(btn =>
      btn.textContent = "Apply Cursor"
    );

  const activeBtn =
    document.querySelector(
      `[data-cursor="${id}"]`
    );

  if (activeBtn) {
    activeBtn.textContent = "Applied ✓";
  }
}

const grid = document.getElementById("cursorGrid");

function renderCursors() {

  grid.innerHTML = "";

  cursors.forEach(cursor => {

    const card = document.createElement("div");

    card.className = "cursor-card";

    card.innerHTML = `

<div class="cursor-content">
    <h3>${cursor.name}</h3>
    <p>${cursor.description}</p>
</div>

<div class="preview-box">
    ${cursor.previewHTML}
</div>

<button
    class="apply-btn"
    data-cursor="${cursor.id}"
>
    Apply Cursor
</button>
`;
    card
      .querySelector(".apply-btn")
      .addEventListener("click", () => {
        applyCursor(cursor.id);
      });


    grid.appendChild(card);

    injectCSS(cursor.previewCSS);
  });
}

renderCursors();

window.addEventListener("DOMContentLoaded", () => {

  const savedCursor =
    localStorage.getItem(
      "selectedCursor"
    );

  if (savedCursor) {
    applyCursor(savedCursor);
  }

});

function injectCSS(css) {

  const style = document.createElement("style");

  style.textContent = css;

  document.head.appendChild(style);
}
const progressbars = [

    {
        id: "neon",

        name: "Neon Progressbar",

        description: "Glowing animated gradient progressbar",

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
}`}


];

const progreGrid = document.getElementById("progreGrid");

// inject all preview css
const previewStyle = document.createElement("style");
document.head.appendChild(previewStyle);

progressbars.forEach((item) => {

    // inject preview css
    previewStyle.textContent += item.previewCSS;

    // create card
    const card = document.createElement("article");

    card.className = "progre-card";

    card.innerHTML = `
        <div class="progre-preview">
            ${item.previewHTML}
        </div>

        <div class="progre-details">

            <h3>
                ${item.name}
            </h3>

            <p>
                ${item.description}
            </p>

            <button
                class="view-code"
                data-id="${item.id}"
            >
                View Code
            </button>

        </div>
    `;

    progreGrid.appendChild(card);

});


// View Code button click
document.addEventListener("click", (e) => {

    const button = e.target.closest(".view-code");

    if (!button) return;

    const id = button.dataset.id;

    const item = progressbars.find(
        p => p.id === id
    );

    console.log(item); // should print object

    document.getElementById("htmlCode").textContent =
        item.htmlCode;

    document.getElementById("cssCode").textContent =
        item.cssCode;

    document
        .querySelector(".view-modal")
        .classList.add("active");

});

document
    .querySelector(".close-modal")
    .addEventListener("click", () => {

        document
            .querySelector(".view-modal")
            .classList.remove("active");

    });

const modal = document.querySelector(".view-modal");

modal.addEventListener("click", (e) => {

    // clicked on overlay, not content
    if (e.target === modal) {
        modal.classList.remove("active");
    }

});
const animationLibrary = {

    floatingText: {
        title: "Floating Text",
        html: `<span class="floating-preview">
            Floating Text
          </span>`,
        css: `.floating-preview {
    font-size: 24px;
    font-weight: bold;

    animation: floatingText 2s ease infinite;
}

@keyframes floatingText {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-12px);
    }
}`
    },

    loader: {
        title: "Loader",
        html: ` <div class="loader-preview"></div>`,
        css: `.loader-preview {
    width: 50px;
    height: 50px;
    border: 5px solid #ddd;
    border-top-color: #457ed4;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}`
    },

    typewriter: {
        title: "Typewriter",
        html: `  <span class="typewriter-preview">
            Hello World
          </span>`,
        css: `.typewriter{
    overflow:hidden;
    white-space:nowrap;
    width:0;
    animation:typing 3s steps(10) forwards;
}` },

    RotatingDoll: {
        title: "Rotating Doll",
        html: `    <div class="doll-preview">
            🪆
          </div>`,
        css: `.rotating-doll-preview{
    overflow:hidden;
    white-space:nowrap;
    width:0;
    animation:typing 3s steps(10) forwards;
}`

    },


    glitchtext: {
        title: "Glitch Text",
        html: `  <span class="glitch-preview">
            GLITCH
          </span>`,
        css: `.glitch-preview{
    overflow:hidden;
    white-space:nowrap;
    width:0;
    animation:typing 3s steps(10) forwards;
}`

    },


    dancingRobot: {

        title: "Dancing Robot",

        html: `
<div class="robot">🤖</div>
        `,

        css: `
.robot{
    font-size:70px;
    animation:danceRobot 1s ease-in-out infinite alternate;
}
`
    },

    jumpingEmoji: {

        title: "Jumping Emoji",

        html: `
<div class="emoji">😀</div>
        `,

        css: `
.emoji{
    font-size:70px;
    animation:jumpEmoji 1s infinite;
}
`
    },

    floatingBalloon: {

        title: "Floating Balloon",

        html: `
<div class="balloon">🎈</div>
        `,

        css: `
.balloon{
    font-size:70px;
    animation:floatBalloon 3s ease-in-out infinite;
}
`
    },

    walkingCharacter: {

        title: "Walking Character",

        html: `
<div class="walker">🚶</div>
        `,

        css: `
.walker{
    font-size:70px;
    animation:walkCharacter 4s linear infinite;
}
`
    },

    rocketLaunch: {

        title: "Rocket Launch",

        html: `
<div class="rocket">🚀</div>
        `,

        css: `
.rocket{
    font-size:70px;
    animation:rocketLaunch 2s infinite;
}
`
    },

    spinningPlanet: {

        title: "Spinning Planet",

        html: `
<div class="planet">🪐</div>
        `,

        css: `
.planet{
    font-size:70px;
    animation:planetSpin 5s linear infinite;
}
`
    },

    bouncingBall: {

        title: "Bouncing Ball",

        html: `
<div class="ball"></div>
        `,

        css: `
.ball{
    width:60px;
    height:60px;
    border-radius:50%;
    background:#ff5722;
}
`
    },

    skeletonLoading: {

        title: "Skeleton Loading",

        html: `
<div class="skeleton"></div>
        `,

        css: `
.skeleton{
    width:220px;
    height:18px;
    border-radius:10px;
}
`
    },

    toastNotification: {

        title: "Toast Notification",

        html: `
<div class="toast">
    Success ✓
</div>
        `,

        css: `
.toast{
    background:#22c55e;
    color:white;
    padding:12px 24px;
}
`
    },

    progressBar: {

        title: "Progress Bar",

        html: `
<div class="progress">
    <div class="fill"></div>
</div>
        `,

        css: `
.progress{
    width:220px;
    height:20px;
}
`
    },

    animatedTabs: {

        title: "Animated Tabs",

        html: `
<div class="tabs">
    <span>Home</span>
</div>
        `,

        css: `
.tabs span::after{
    content:"";
}
`
    },

    accordion: {

        title: "Accordion",

        html: `
<div class="accordion"></div>
        `,

        css: `
.accordion{
    width:220px;
}
`
    },

    searchBarExpand: {

        title: "Search Bar Expand",

        html: `
<input
class="search-expand"
placeholder="Search..."
>
        `,

        css: `
.search-expand{
    width:90px;
}
`
    },

    hamburgerMenu: {

        title: "Hamburger Menu",

        html: `
<div class="hamburger">
    <span></span>
    <span></span>
    <span></span>
</div>
        `,

        css: `
.hamburger{
    width:60px;
}
`
    },

    neonButton: {

        title: "Neon Button",

        html: `
<button class="neon-preview">
Hover Me
</button>
        `,

        css: `
.neon-preview{
    box-shadow:
    0 0 10px #75cfb9;
}
`
    }

};
var numOfKeys = $(".key").length;

/* KEY CLICK EVENTS */

for (var i = 0; i < numOfKeys; i++) {

    $(".key")[i].addEventListener("click", function () {

        var keyInnerHTML = this.innerHTML;

        playNote(keyInnerHTML);

        pressAnimation(keyInnerHTML);

    });

}

/* KEYBOARD EVENTS */

$(document).keydown(function (event) {

    playNote(event.key);

    pressAnimation(event.key);

});

/* PLAY SOUND */

function playNote(note) {

    note = note.toUpperCase();

    switch (note) {

        case "A":
            var A = new Audio("./PianoNotes/key08.mp3");
            A.play();
            break;

        case "W":
            var W = new Audio("./PianoNotes/key09.mp3");
            W.play();
            break;

        case "S":
            var S = new Audio("./PianoNotes/key10.mp3");
            S.play();
            break;

        case "E":
            var E = new Audio("./PianoNotes/key11.mp3");
            E.play();
            break;

        case "D":
            var D = new Audio("./PianoNotes/key12.mp3");
            D.play();
            break;

        case "F":
            var F = new Audio("./PianoNotes/key13.mp3");
            F.play();
            break;

        case "T":
            var T = new Audio("./PianoNotes/key14.mp3");
            T.play();
            break;

        case "G":
            var G = new Audio("./PianoNotes/key15.mp3");
            G.play();
            break;

        case "Y":
            var Y = new Audio("./PianoNotes/key16.mp3");
            Y.play();
            break;

        case "H":
            var H = new Audio("./PianoNotes/key17.mp3");
            H.play();
            break;

        case "U":
            var U = new Audio("./PianoNotes/key18.mp3");
            U.play();
            break;

        case "J":
            var J = new Audio("./PianoNotes/key19.mp3");
            J.play();
            break;

        case "K":
            var K = new Audio("./PianoNotes/key20.mp3");
            K.play();
            break;

        case "O":
            var O = new Audio("./PianoNotes/key21.mp3");
            O.play();
            break;

        case "L":
            var L = new Audio("./PianoNotes/key22.mp3");
            L.play();
            break;

        case "P":
            var P = new Audio("./PianoNotes/key23.mp3");
            P.play();
            break;

        case ";":
            var last = new Audio("./PianoNotes/key24.mp3");
            last.play();
            break;

        default:
            console.log(note);

    }

}

/* KEY PRESS ANIMATION */

function pressAnimation(key) {

    key = key.toLowerCase();

    var inputKey = key === ";" ? "\\;" : key;

    $("#" + inputKey).addClass("pressed");

    setTimeout(function () {

        $("#" + inputKey).removeClass("pressed");

    }, 100);

}

/* MENU */

const menuBtn = document.getElementById("menuBtn");

const menuPanel = document.getElementById("menuPanel");

const closeMenuBtn = document.getElementById("closeMenuBtn");

const infoBtn = document.getElementById("infoBtn");

const neonBtn = document.getElementById("neonBtn");

const darkModeBtn = document.getElementById("darkModeBtn");


/* OPEN MENU */

menuBtn.addEventListener("click", () => {

    menuPanel.classList.add("active");

    menuBtn.classList.add("hide-menu-btn");

});

/* CLOSE MENU */

closeMenuBtn.addEventListener("click", () => {

    menuPanel.classList.remove("active");
    
    menuBtn.classList.remove("hide-menu-btn");

});

/* INFO POPUP */

infoBtn.addEventListener("click", () => {

    alert(
`🎹 Welcome to Virtual Piano ✨

Feel the rhythm.
Touch the keys.
Create your own melody.

Features:
🌈 RGB Neon Effects
🎼 Real Piano Notes
✨ Smooth Animations
🖤 Modern UI
🎵 Interactive Keyboard

Play • Relax • Enjoy 💫`
    );

});

/* NEON TOGGLE */

neonBtn.addEventListener("click", () => {

    document.body.classList.toggle("neon-off");

});

/* DARK MODE TOGGLE */

darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

});

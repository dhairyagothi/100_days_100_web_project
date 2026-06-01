

var isRecording  = false;
var recordStart  = null;
var recording    = [];
var playbackTimers = [];
var keysHeld     = {};

// Load saved recording from localStorage on startup
var saved = localStorage.getItem("pianoRecording");
if (saved) {
    recording = JSON.parse(saved);
    $("#btn-play, #btn-clear, #btn-export").prop("disabled", false);
    $("#speed-slider").prop("disabled", false);
}


var numOfKeys = $(".key").length;
function handleKey(note) {
    playNote(note);
    pressAnimation(note);

    if (isRecording) {
        recording.push({
            key: note.toUpperCase(),
            time: Date.now() - recordStart
        });
    }
}
for(var i=0; i<numOfKeys; i++) {
    $(".key")[i].addEventListener("click", function() {
        var keyInnerHTML = this.innerHTML;
        handleKey(keyInnerHTML);
    })
}

$(document).keydown(function(event) {
    if (keysHeld[event.key]) return; 
    keysHeld[event.key] = true;
    handleKey(event.key);
});

$(document).keyup(function(event) {
    delete keysHeld[event.key];
});

$("#speed-slider").on("input", function() {
    $("#speed-label").text($(this).val() + "×");
});

function playNote(note) {

    note = note.toUpperCase();

    switch(note) {
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

        default: console.log(note);
    }
}

function pressAnimation(key) {

    key = key.toLowerCase();

    var inputKey = key === ";" ? "\\;" : key;

    $("#" + inputKey).addClass("pressed");

    setTimeout(function() {
        $("#" + inputKey).removeClass("pressed");
    }, 100);
}
// ── Record ────────────────────────────────────────────────
$("#btn-record").on("click", function () {
    isRecording = true;
    recordStart = Date.now();
    recording   = [];

    $(this).addClass("recording").text("⏺ Recording…");
    $("#btn-stop").prop("disabled", false);
    $("#btn-play, #btn-clear, #btn-export").prop("disabled", true);
    $("#speed-slider").prop("disabled", true);
});

// ── Stop ──────────────────────────────────────────────────
$("#btn-stop").on("click", function () {
    isRecording = false;

    // Save to localStorage immediately on stop
    localStorage.setItem("pianoRecording", JSON.stringify(recording));

    $("#btn-record").removeClass("recording").text("⏺ Record");
    $(this).prop("disabled", true);

    var hasNotes = recording.length > 0;
    $("#btn-play, #btn-clear, #btn-export").prop("disabled", !hasNotes);
    $("#speed-slider").prop("disabled", !hasNotes);
});

// ── Play ──────────────────────────────────────────────────
$("#btn-play").on("click", function () {
    playbackTimers.forEach(clearTimeout);
    playbackTimers = [];

    var speed = parseFloat($("#speed-slider").val());

    recording.forEach(function (event) {
        var t = setTimeout(function () {
            playNote(event.key);
            pressAnimation(event.key);
        }, event.time / speed);
        playbackTimers.push(t);
    });
});

// ── Clear ─────────────────────────────────────────────────
$("#btn-clear").on("click", function () {
    playbackTimers.forEach(clearTimeout);
    playbackTimers = [];
    recording      = [];

    localStorage.removeItem("pianoRecording");

    $("#btn-play, #btn-clear, #btn-export").prop("disabled", true);
    $("#speed-slider").prop("disabled", true);
    $("#btn-record").text("⏺ Record");
});

// ── Export ────────────────────────────────────────────────
$("#btn-export").on("click", function () {
    var blob = new Blob(
        [JSON.stringify(recording, null, 2)],
        { type: "application/json" }
    );
    var url = URL.createObjectURL(blob);
    var a   = document.createElement("a");
    a.href     = url;
    a.download = "piano-recording.json";
    a.click();
    URL.revokeObjectURL(url);
});
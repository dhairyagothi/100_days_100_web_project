document.addEventListener("DOMContentLoaded", () => {
    const tv = document.querySelector(".TV1");
    const doc = document.querySelector(".document");
    const pc = document.querySelector(".pc");
    const door = document.querySelector(".door");
    const button = document.querySelector(".b1");
    const main = document.querySelector(".main");
    const land = document.querySelector(".container");
    const terminalbut = document.querySelector(".b2");
    const terminal = document.querySelector(".terminal");
    const content = document.querySelector(".content");
    const exit = document.querySelector(".b3");

    /* timer logic */

    let timeLeft = 120;

    const timer = document.querySelector(".timer");
    let interval;

    function startTimer() {

        interval = setInterval(() => {

            let minutes = Math.floor(timeLeft / 60);

            let seconds = timeLeft % 60;

            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            timer.textContent = `${minutes}:${seconds}`;

            timeLeft--;

            if (timeLeft < 0) {

                clearInterval(interval);

                timer.textContent = "TIME UP";

                alert("MISSION FAILED");
                terminalbut.disabled = true;
            }

        }, 1000);

    }

    button.addEventListener("click", () => {
        main.style.backgroundColor = "rgba(0,0,0,0)";
        land.style.display = "none";
        terminalbut.style.display = "block";
        startTimer();


    })
    /*terminal logic */
    const lines = ["TERMINAL LOADING........",
        "  INITIALIZING AETHER_CORE...",
        "  RESTORING CORRUPTED SYSTEM FILES.....",
        "  CONNECTION ESTABLISHED...",
        "  WARNING : SECURITY LOCKDOWN ACTIVE....",
        "  UNAUTHORIZED OPERATOR DETECTED....",
        "  OXYGEN LEVELS FALLING.....",
        "  SEARCHING FOR ACCESS KEY....",
        "  ACCESS KEY FRAGMENT FOUND....",
        "  DECRYPTING BIOS...[OK]",
        " BYPASSING ENCRYPTION.....",
        "  ACCESS_ERROR : HANDSHAKE_FAILED....",
        "  RETRYING(1 / 3).....",
        "  BYPASSING ENCRYPTION....[SUCCESS]",
        "  ACCESS GRANTED...",
        "  WELCOME, OPERATOR_01...button...",
        "  ENTER COMMAND..."
    ]

    let line_index = 0;
    let char_index = 0;
    let result = false;
    let stage = 1;
    function typewriter() {
        if (line_index < lines.length) {
            if (char_index < lines[line_index].length) {
                content.innerHTML += lines[line_index].charAt(char_index);
                char_index++;
                setTimeout(typewriter, 30);
            }

            else {
                content.innerHTML += "<br>>";
                line_index++;
                char_index = 0;
                setTimeout(typewriter, 300);
            }
        }
        else {

            const input = document.createElement("input");

            input.type = "text";

            input.classList.add("answer");

            content.appendChild(input);

            input.focus();

            input.addEventListener("keydown", (e) => {

                if (e.key === "Enter") {

                    const ans = input.value;

                    const msg = document.createElement("div");

                    if (ans === "98770") {

                        pc.style.display = "flex";

                        msg.innerText = "> ACCESS GRANTED. NEW CLUE UNLOCKED ";

                    }

                    else if (ans === "NEON") {

                        tv.style.display = "flex";

                        msg.innerText = "> ACCESS GRANTED. NEW CLUE UNLOCKED ";

                    }

                    else if (ans === "404") {

                        door.style.display = "flex";

                        msg.innerText = "> ACCESS GRANTED. NEW CLUE UNLOCKED ";
                    }

                    else if (ans === "449907880") {
                        clearInterval(interval);
                        alert("CONGRATS! YOU ESCAPED THE ROOM WITH " + timer.textContent + " REMAINING");
                        terminalbut.disabled = true;
                        terminal.style.display = "none";

                    }

                    else {

                        msg.innerText = "> ACCESS DENIED";

                    }

                    content.insertBefore(msg, input);

                    input.value = "";

                }
            })
        }
    }


    terminalbut.addEventListener("click", () => {
        terminal.style.display = "block";
        if (!result) {
            result = true;
            typewriter();
        }

    })

    exit.addEventListener("click", () => {
        terminal.style.display = "none";
    })

})

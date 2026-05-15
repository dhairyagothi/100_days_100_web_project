let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
// Store calculation string
let string = "";

// Create history array
let history = [];

// Convert buttons NodeList to array
let arr = Array.from(buttons);
arr.forEach(button => {

    button.addEventListener('click', (e) => {

        let value = e.target.innerHTML;

        // Equal button
        if (value == '=') {

            try {

                // Save old expression
                let expression = string;
                string = eval(string).toString();
                input.value = string;
                history.push(`${expression} = ${string}`);

                // Print history in console
                console.log("Calculation History:");
                console.log(history);

            } catch {

                input.value = "Error";
                string = "";
            }
        }
        else if (value == 'AC') {

            string = "";
            input.value = string;
        }
        else if (value == 'DEL') {

            string = string.substring(0, string.length - 1);
            input.value = string;
        }
        else if (value == 'sin') {

            string = Math.sin(eval(string)).toString();
            input.value = string;
        }
        else if (value == 'cos') {

            string = Math.cos(eval(string)).toString();
            input.value = string;
        }

        else if (value == 'tan') {

            string = Math.tan(eval(string)).toString();
            input.value = string;
        }

        else if (value == 'log') {

            string = Math.log10(eval(string)).toString();
            input.value = string;
        }

        else if (value == 'ln') {

            string = Math.log(eval(string)).toString();
            input.value = string;
        }

        else if (value == '√') {

            string = Math.sqrt(eval(string)).toString();
            input.value = string;
        }

        else if (value == 'π') {

            string += Math.PI.toFixed(8);
            input.value = string;
        }

        else if (value == 'e') {

            string += Math.E.toFixed(8);
            input.value = string;
        }

        else {

            string += value;
            input.value = string;
        }
    });
});


// --------------------------------
// KEYBOARD SUPPORT
// --------------------------------
document.addEventListener('keydown', (event) => {

    const key = event.key;
    if (
        !isNaN(key) ||
        ['+', '-', '*', '/', '.', '%', '(', ')'].includes(key)
    ) {

        string += key;
        input.value = string;
    }
    else if (key === 'Enter') {

        try {

            let expression = string;

            string = eval(string).toString();

            input.value = string;

            history.push(`${expression} = ${string}`);

        } catch {

            input.value = "Error";
            string = "";
        }
    }
    else if (key === 'Backspace') {

        string = string.substring(0, string.length - 1);

        input.value = string;
    }
    else if (key === 'Escape') {

        string = "";
        input.value = "";
    }
});


// --------------------------------
// BUTTON CLICK ANIMATION
// --------------------------------
buttons.forEach(button => {

    button.addEventListener('click', () => {

        button.style.transform = "scale(0.90)";

        setTimeout(() => {
            button.style.transform = "scale(1)";
        }, 100);
    });
});

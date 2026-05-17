let input = document.getElementById('inputBox');

let buttons = document.querySelectorAll('.calculator button');
let string = "";

let history =
JSON.parse(localStorage.getItem("calcHistory")) || [];

let calculated = false;

/* Render History */
function renderHistory(){

    let historyList =
    document.getElementById("historyList");

    historyList.innerHTML = "";

    history.forEach(item => {

        let div =
        document.createElement("div");

        div.classList.add("history-item");

        div.innerText = item;

        historyList.appendChild(div);

    });
}

/* Button Functionality */
let arr = Array.from(buttons);

arr.forEach(button => {

    button.addEventListener('click',(e) => {

        let value = e.target.innerHTML;

        /* Ignore Clear History button */
        if(value === "Clear History"){
            return;
        }

        /* Equal Button */
        if(value === '='){

            try{

                let expression = string;

                let result = eval(string);

                history.push(`${expression} = ${result}`);

                localStorage.setItem(
                    "calcHistory",
                    JSON.stringify(history)
                );

                renderHistory();

                string = result.toString();

                input.value = string;

                calculated = true;

            }

            catch{

                input.value = "Error";

                string = "";

            }

        }

        /* AC Button */
        else if(value === 'AC'){

            string = "";

            input.value = string;

            calculated = false;
        }

        /* DEL Button */
        else if(value === 'DEL'){

            string =
            string.substring(0,string.length-1);

            input.value = string;
        }

        else{

            /* Start fresh after calculation */
            if(calculated){

                if(
                    ['+','-','*','/','%'].includes(value)
                ){
                    string += value;
                }

                else{
                    string = value;
                }

                calculated = false;
            }

            else{
                string += value;
            }

            input.value = string;
        }

    });

});

/* Clear History */
document
.getElementById("clearHistory")
.addEventListener("click", () => {

    history = [];

    localStorage.removeItem("calcHistory");

    renderHistory();

});

/* Initial Render */
renderHistory();

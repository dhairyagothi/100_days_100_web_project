window.onload = function() {
    let button = document.getElementById("calculate");
    button.addEventListener("click", calculateLove)
}

function calculateLove() {
    let yourName = document.getElementById("fname").value;
    let crushName = document.getElementById("cname").value;

    if (yourName != "" && crushName != "") {
        let percentage = Math.floor(Math.random() * 101);
        document.getElementById("result-message").innerText = yourName + " and " + crushName + " 's chance of love:  ";
        document.getElementById("result-percentage").innerText = percentage.toString() + "%";
    }
}
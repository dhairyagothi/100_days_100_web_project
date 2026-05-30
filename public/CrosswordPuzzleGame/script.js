const words = [
    {
        answer: "HTML"
    },
    {
        answer: "JAVASCRIPT"
    },
    {
        answer: "CSS"
    }
];

const grid = document.getElementById("grid");

words.forEach(word => {

    const row = document.createElement("div");
    row.classList.add("word-row");

    for(let i = 0; i < word.answer.length; i++){

        const input = document.createElement("input");
        input.maxLength = 1;

        row.appendChild(input);
    }

    grid.appendChild(row);
});

document.getElementById("checkBtn").addEventListener("click", () => {

    const rows = document.querySelectorAll(".word-row");

    let allCorrect = true;

    rows.forEach((row,index) => {

        let userWord = "";

        row.querySelectorAll("input").forEach(input => {
            userWord += input.value.toUpperCase();
        });

        if(userWord !== words[index].answer){
            allCorrect = false;
        }
    });

    const result = document.getElementById("result");

    if(allCorrect){
        result.textContent = "🎉 Congratulations! All answers are correct.";
        result.style.color = "green";
    }else{
        result.textContent = "❌ Some answers are incorrect. Try again.";
        result.style.color = "red";
    }

});

document.getElementById("resetBtn").addEventListener("click", () => {

    document.querySelectorAll("input").forEach(input => {
        input.value = "";
    });

    document.getElementById("result").textContent = "";
});
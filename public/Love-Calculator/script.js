
window.onload = function () {
    const button = document.getElementById("calculate");
    button.addEventListener("click", calculateLove);
};

document.getElementById("reset").addEventListener("click", function() {
    document.getElementById("fname").value = "";
    document.getElementById("cname").value = "";
    document.getElementById("result-message").textContent = "";
    document.getElementById("result-percentage").textContent = "";
    document.getElementById("calculate").classList.remove("hidden");
    document.getElementById("reset").classList.add("hidden");
});

function calculateLove() {
    const yourName = document.getElementById("fname").value.trim();
    const crushName = document.getElementById("cname").value.trim();

    if (yourName && crushName) {
        // Use the provided formula to calculate the love index
        const combined = yourName + crushName;
        const letterCounts = {};

        for (const letter of combined) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }

        // Sum of all letter counts
        const sum = Object.values(letterCounts).reduce((a, b) => a + b, 0);

        // Convert sum to a percentage
        const loveIndex = sum % 101;

        // Display the result
        let emoji = "";
        let msg = "";
        if (loveIndex <= 30) { emoji = "💔"; msg = "Not a great match!"; }
        else if (loveIndex <= 60) { emoji = "💛"; msg = "There's potential!"; }
        else if (loveIndex <= 90) { emoji = "💕"; msg = "Great match!"; }
        else { emoji = "❤️‍🔥"; msg = "Soulmates!"; }

        document.getElementById("result-message").textContent = 
        `${emoji} ${loveIndex}% ${emoji}`;
        document.getElementById("result-percentage").textContent = 
        `${yourName} & ${crushName} — ${msg}`;

        document.getElementById("calculate").classList.add("hidden");
        document.getElementById("reset").classList.remove("hidden");
    } else{
        document.getElementById("result-message").textContent = 
            "Please enter both names!";
    }

}

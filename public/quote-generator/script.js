    const quotes = [
        "The only way to do great work is to love what you do.",
        "Life is what happens when you're busy making other plans.",
        "Get busy living or get busy dying.",
        "You have within you right now, everything you need to deal with whatever the world can throw at you.",
        "Believe you can and you're halfway there."
    ];

    function newQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        document.getElementById("quote").innerText = quotes[randomIndex];
    }

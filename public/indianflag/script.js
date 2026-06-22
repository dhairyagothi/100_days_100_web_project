const quotes = [
      {
        text: "Give me blood and I will give you freedom.",
        author: "— Subhas Chandra Bose",
        image: "./img/subhas_bose.png",
      },
      {
        text: "Swaraj is my birthright and I shall have it.",
        author: "— Bal Gangadhar Tilak",
        image: "./img/bal_tilak.png",
      },
      {
        text: "Inquilab Zindabad.",
        author: "— Bhagat Singh",
        image: "./img/bhagat_singh.jpg",
      },
      {
        text: "Jai Hind!",
        author: "— Netaji Subhas Chandra Bose",
        image: "./img/subhas_bose.png",
      },
      {
        text: "Karo ya maro.",
        author: "— Mahatma Gandhi",
        image: "./img/gandhi.png",
      },
    ];

    let currentQuoteIndex = 0;

    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    const patriotImage = document.getElementById("patriot-image");

    function displayQuote() {
      const currentQuote = quotes[currentQuoteIndex];

      quoteText.textContent = currentQuote.text;
      quoteAuthor.textContent = currentQuote.author;
      patriotImage.src = currentQuote.image;
    }

    displayQuote();

    setInterval(() => {
      currentQuoteIndex =
        (currentQuoteIndex + 1) % quotes.length;

      displayQuote();
    }, 5000);

    document
      .getElementById("prev-quote")
      .addEventListener("click", () => {

        currentQuoteIndex =
          (currentQuoteIndex - 1 + quotes.length) %
          quotes.length;

        displayQuote();
      });

    document
      .getElementById("next-quote")
      .addEventListener("click", () => {

        currentQuoteIndex =
          (currentQuoteIndex + 1) %
          quotes.length;

        displayQuote();
      });

    // Text to Speech
    document
      .getElementById("speak-quote")
      .addEventListener("click", () => {

        const speech = new SpeechSynthesisUtterance(
          `${quotes[currentQuoteIndex].text} by ${quotes[currentQuoteIndex].author}`
        );

        speech.rate = 0.95;
        speech.pitch = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
      });

    // Music autoplay fallback
    const music = document.getElementById("bgMusic");

    window.addEventListener("load", () => {
      music.play().catch(() => {
        console.log("Autoplay blocked");
      });
    });
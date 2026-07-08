document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // 1. Check if the user already chose a theme in a previous session
  const currentTheme = localStorage.getItem('theme');
  
  if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
  }

  // 2. Listen for clicks on the toggle button
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');

    // 3. Update LocalStorage based on the current state
    if (body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
});

const filters = document.querySelectorAll(".filter");

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(item => {
            item.style.opacity = "0.7";
        });

        filter.style.opacity = "1";

    });

});

// --- Currency Converter Logic ---
const currencySelector = document.getElementById('currency-selector');
const cardTexts = document.querySelectorAll('.card-text');

// Save the original base price of every card when the page loads
cardTexts.forEach(card => {
    const parts = card.innerHTML.split('₹');
    if (parts.length > 1) {
        const titlePart = parts[0]; 
        const pricePart = parts[1].split('/')[0].replace(',', ''); 
        const afterPart = parts[1].split('/')[1]; 
        
        card.setAttribute('data-base-price', pricePart);
        card.setAttribute('data-title-html', titlePart);
        card.setAttribute('data-after-html', '/' + afterPart);
    }
});

// Listen for currency changes
if (currencySelector) {
    currencySelector.addEventListener('change', function() {
        const selectedCurrency = this.value;
        
        const exchangeRates = {
            'INR': { rate: 1, symbol: '₹' },
            'USD': { rate: 0.012, symbol: '$' },
            'EUR': { rate: 0.011, symbol: '€' }
        };

        const currentRate = exchangeRates[selectedCurrency].rate;
        const currentSymbol = exchangeRates[selectedCurrency].symbol;

        cardTexts.forEach(card => {
            const basePrice = card.getAttribute('data-base-price');
            if (basePrice) {
                const newPrice = Math.round(basePrice * currentRate);
                const formattedPrice = newPrice.toLocaleString();
                
                const title = card.getAttribute('data-title-html');
                const after = card.getAttribute('data-after-html');
                
                card.innerHTML = title + currentSymbol + formattedPrice + after;
            }
        });
    });
}
const api = "https://api.exchangerate-api.com/v4/latest/USD";

        let search = document.querySelector('.searchBox');
        let convert = document.querySelector('.convert');
        let fromCurrency = document.querySelector('.from');
        let toCurrency = document.querySelector('.to');
        let finalValue = document.querySelector('.finalValue');
        let finalAmount = document.querySelector('#finalAmount');
        let resultFrom, resultTo, searchValue;

        fromCurrency.addEventListener('change', (event) => {
            resultFrom = `${event.target.value}`;
        });

        toCurrency.addEventListener('change', (event) => {
            resultTo = `${event.target.value}`;
        });

        search.addEventListener('input', (event) => {
            searchValue = event.target.value;
        });

        convert.addEventListener('click', getResults);

        function getResults() {
            fetch(`${api}`)
            .then(currency => {
                return currency.json();
            }).then(displayResults);
        }

        function displayResults(currency) {
            let fromRate = currency.rates[resultFrom];
            let toRate = currency.rates[resultTo];
            finalValue.innerHTML = ((toRate / fromRate) * searchValue).toFixed(5);
            finalAmount.style.display = "block";
        }

        function clearVal() {
            window.location.reload();
            document.querySelector('.finalValue').innerHTML = "";
        };
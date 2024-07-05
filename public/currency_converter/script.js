const fromAmountElement = document.querySelector('.amount');
const convertedmountElement = document.querySelector('.convertedAmount');
const fromCurrencyElement = document.querySelector('.fromCurrency');
const toCurrencyElement = document.querySelector('.toCurrency');
const resultElement = document.querySelector('.result');
const converterContainer = document.querySelector('.converter-container');


// Array to populate the select with these countries
const countries =[
    {code: "AED"  , name: "United Arab Emirates Dirham"},
    {code: "ARS"  , name: "Argentine Peso"},
    {code: "AUD"  , name: "Australian Doller"},
    {code: "BRL"  , name: "Brazilian Real"},
    {code: "CAD"  , name: "Canadian Doller"},
    {code: "CHF"  , name: "Swiss Franc"},
    {code: "CLP"  , name: "Chilean Peso"},
    {code: "CNY"  , name: "Chinese Yuan"},
    {code: "COP"  , name: "Colombian Peso"},
    {code: "CZK"  , name: "Czech Koruna"},
    {code: "DKK"  , name: "Danish Krone"},
    {code: "EGP"  , name: "Egyptian Pound"},

    {code: "EUR"  , name: "Euro"},
    {code: "GBP"  , name: "British Pound Sterling"},
    {code: "HKD"  , name: "Hong Kong Doller"},
    {code: "HRK"  , name: "Croatian Kuna"},
    {code: "HUF"  , name: "Hungarian Forint"},
    {code: "IDR"  , name: "Indonesian Rupish"},
    {code: "ILS"  , name: "Israeli New Shekel"},
    {code: "INR"  , name: "Indian Rupee"},
    {code: "ISK"  , name: "Icelandic Krona"},
    {code: "JPY"  , name: "Japanese Yen"},
    {code: "KRW"  , name: "South Korean Won"},
    {code: "MXN"  , name: "Mexican Peso"},

    {code: "MYR"  , name: "Malaysian Ringgit"},
    {code: "NOK"  , name: "Norwegian Krone"},
    {code: "NZK"  , name: "New Zealand DOllar"},
    {code: "PEN"  , name: "Peruvian Sol"},
    {code: "PHP"  , name: "Philippine Peso"},
    {code: "PLN"  , name: "Polish Zloty"},
    {code: "RON"  , name: "Romanian Leu"},
    {code: "RUB"  , name: "Swedish Krona"},
    {code: "SGD"  , name: "Singapore DOller"},

    {code: "THB"  , name: "Thai Baht"},
    {code: "TRY"  , name: "Turkish Lira"},
    {code: "TWD"  , name: "Taiwan New Doller"},
    {code: "UAH"  , name: "Ukrainian Hryvnia"},
    {code: "USD"  , name: "United States Doller"},
    {code: "UYU"  , name: "Uruguayan Peso"},
    {code: "VND"  , name: "Vietnamese Dong"},
    {code: "ZAR"  , name: "South African Rand"},
    
];

// showing countries form array to select tag
countries.forEach(country=>{
    const option1 =document.createElement('option');
    const option2 =document.createElement('option');

    option1.value =option2.value=country.code;
    option1.textContent= option2.textContent =`${country.code} (${country.name})`
        fromCurrencyElement.appendChild(option1);
        toCurrencyElement.appendChild(option2);

        // setting default values of select tag
        fromCurrencyElement.value ="USD";
        toCurrencyElement.value ="INR";
});


//function to get exchange rate using API
const getExchangeRate = async() =>{
    const amount = parseFloat(fromAmountElement.value);
    const fromCurrency = fromCurrencyElement.value;
    const toCurrency = toCurrencyElement.value;
    resultElement.textContent = "Fetching Exchange Rates....";


     try{


    //ftech data from APi 
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await response.json();
    // console.log(data);

    const conversionRate = data.rates[toCurrency];
    const convertedAmount = (amount *conversionRate).toFixed(2);
     if(typeof conversionRate ===`undefined`){
         resultElement.textContent ="Exchange rate data is not available fot selected countries!!!";
         convertedmountElement ="";
    }

     else{
        convertedmountElement.value = convertedAmount; 
        resultElement.textContent =`${amount} ${fromCurrency} =${convertedAmount} ${toCurrency}  `;

    }
   
 }catch(error){
converterContainer.innerHTML = `<h2>Error while Fetching Exchange!!!</h2>`;
}
}

// featching exchange rate when user inputs the amount
fromAmountElement.addEventListener('input' , getExchangeRate);
fromCurrencyElement.addEventListener('change' , getExchangeRate);
toCurrencyElement.addEventListener('change' , getExchangeRate);
window.addEventListener('load' , getExchangeRate);

//************ CURRENCY_CONVERTER_TASK **************************************** 
const BASE_URL = 
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies/eur.json"

const dropdowns = document.querySelectorAll(".dropdown select");
let btn = document.querySelector("button");
let fromCurr = document.querySelector(".from select");
let toCurr = document.querySelector(".to select");
let msg = document.querySelector(".msg");


for (let select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name==="From" && currCode==="USD"){
            newOption.selected="selected";
        }
        else if(select.name==="To" && currCode==="INR"){
            newOption.selected="selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    // console.log(currCode);
    // console.log(countryList[currCode]);
    let countryCode = countryList[currCode];
    let img = element.parentElement.querySelector("img"); 
    let url = `https://flagsapi.com/${countryCode}/flat/64.png`;
    // console.log(url);
    img.src = url;
}


btn.addEventListener("click", async (evt) => {
    evt.preventDefault(); //ye page reload hone se bachega becoz relload hone par jo humne dropdown chokse kare ya input daala vo sab reset bhi ho sakta hai
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if(amtVal === "" || amtVal < 1){
        amtVal = 1;
        amount.value = "1";
    }

    // console.log(fromCurr.value, toCurr.value);
    // const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
    // console.log(URL);
    let response = await fetch(BASE_URL);
    let data = await response.json();
    // console.log(data.eur.usd);
    let fromVal = fromCurr.value.toLowerCase();
    console.log(fromVal);
    let toVal = toCurr.value.toLowerCase();
    console.log(toVal);
    let target_rate = data.eur[toVal];
    let source_rate = data.eur[fromVal];
    console.log("target rate : ", target_rate);
    console.log("source rate : ", source_rate);
    let final_amount = (target_rate / source_rate)*amtVal;
    let rounded = final_amount.toFixed(2);
    console.log("Final Amount is", final_amount);
    console.log("Final Rounded Amount is", rounded);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${rounded} ${toCurr.value}`;

});
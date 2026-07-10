// ======================================
// UNIT CONVERTER DATA
// ======================================

const categories = {

  length: {
    allowNegative:false,
    errorMessage:"Length cannot be negative",
    units:{
      kilometer:{label:"Kilometer (km)",value:1000},
      meter:{label:"Meter (m)",value:1},
      centimeter:{label:"Centimeter (cm)",value:0.01},
      millimeter:{label:"Millimeter (mm)",value:0.001},
      mile:{label:"Mile (mi)",value:1609.344},
      yard:{label:"Yard (yd)",value:0.9144},
      foot:{label:"Foot (ft)",value:0.3048},
      inch:{label:"Inch (in)",value:0.0254}
    }
  },


  weight:{
    allowNegative:false,
    errorMessage:"Weight cannot be negative",
    units:{
      kilogram:{label:"Kilogram (kg)",value:1},
      gram:{label:"Gram (g)",value:0.001},
      milligram:{label:"Milligram (mg)",value:0.000001},
      pound:{label:"Pound (lb)",value:0.45359237},
      ounce:{label:"Ounce (oz)",value:0.0283495},
      ton:{label:"Metric Ton (t)",value:1000}
    }
  },


  temperature:{
    allowNegative:true,
    units:{
      celsius:{label:"Celsius (°C)"},
      fahrenheit:{label:"Fahrenheit (°F)"},
      kelvin:{label:"Kelvin (K)"}
    }
  },


  time:{
    allowNegative:false,
    errorMessage:"Time cannot be negative",
    units:{
      second:{label:"Second (s)",value:1},
      minute:{label:"Minute (min)",value:60},
      hour:{label:"Hour (hr)",value:3600},
      day:{label:"Day",value:86400}
    }
  },


  speed:{
    allowNegative:false,
    errorMessage:"Speed cannot be negative",
    units:{
      meterPerSecond:{label:"m/s",value:1},
      kilometerPerHour:{label:"km/h",value:.277778},
      milePerHour:{label:"mph",value:.44704}
    }
  }

};



// ======================================
// DOM
// ======================================

const fromInput=document.getElementById("fromInput");
const toInput=document.getElementById("toInput");

const fromUnit=document.getElementById("fromUnit");
const toUnit=document.getElementById("toUnit");

const output=document.getElementById("output");

const tabs=document.getElementById("tabs");
const swapBtn=document.getElementById("swapBtn");

const themeSelect=document.getElementById("themeSelect");

const historyList=document.getElementById("historyList");
const clearHistoryBtn=document.getElementById("clearHistoryBtn");



// ======================================
// STATE
// ======================================

let currentCategory="length";

let typingTimer;


let history=
JSON.parse(localStorage.getItem("unitConverterHistory")) || [];



// ======================================
// THEME
// ======================================

function loadTheme(){

let theme=
localStorage.getItem("unitConverterTheme") || "aurora";

document.body.className=theme;

themeSelect.value=theme;

}


function applyTheme(theme){

document.body.className=theme;

localStorage.setItem(
"unitConverterTheme",
theme
);

}



// ======================================
// HISTORY
// ======================================


function saveHistory(){

localStorage.setItem(
"unitConverterHistory",
JSON.stringify(history)
);

}



function renderHistory(){

if(!history.length){

historyList.innerHTML=
`
<div class="history-empty">
No conversions yet
</div>
`;

return;

}


historyList.innerHTML=
history.map(item=>
`
<div class="history-item">
${item}
</div>
`
).join("");

}



function addHistory(text){

if(!text)return;


if(history[0]===text)return;


history.unshift(text);


if(history.length>10)
history.pop();


saveHistory();

renderHistory();

}



function clearHistory(){

history=[];

saveHistory();

renderHistory();

}



// ======================================
// CATEGORY
// ======================================


function loadCategory(category){

currentCategory=category;


fromUnit.innerHTML="";
toUnit.innerHTML="";


Object.entries(
categories[category].units
)
.forEach(([key,value])=>{

fromUnit.add(
new Option(value.label,key)
);

toUnit.add(
new Option(value.label,key)
);


});


fromUnit.selectedIndex=0;
toUnit.selectedIndex=1;


convert(false);

}



// ======================================
// VALIDATION
// ======================================


function validateInput(value){


if(fromInput.value.trim()===""){

return {
valid:false,
message:"Please enter a value"
};

}


if(isNaN(value)){

return {
valid:false,
message:"Please enter a valid number"
};

}


let config=
categories[currentCategory];


if(!config.allowNegative && value<0){

return{
valid:false,
message:config.errorMessage
};

}



if(currentCategory==="temperature"){

if(
fromUnit.value==="kelvin" &&
value<0
){

return{
valid:false,
message:"Temperature cannot be below 0 Kelvin"
};

}


if(
fromUnit.value==="celsius" &&
value<-273.15
){

return{
valid:false,
message:"Temperature cannot be below -273.15°C"
};

}

}


return{
valid:true
};

}



// ======================================
// CONVERSION
// ======================================


function convertTemperature(value,from,to){


let c;


if(from==="celsius")
c=value;

else if(from==="fahrenheit")
c=(value-32)*5/9;

else
c=value-273.15;



if(to==="celsius")
return c;


if(to==="fahrenheit")
return c*9/5+32;


return c+273.15;

}




function convert(addHistory=false){


let value=
parseFloat(fromInput.value);


let check=
validateInput(value);



if(!check.valid){

toInput.value="";

output.innerHTML=check.message;

return;

}



let from=fromUnit.value;
let to=toUnit.value;


let result;


if(currentCategory==="temperature"){

result=
convertTemperature(
value,
from,
to
);

}

else{


let units=
categories[currentCategory].units;


result=
(value*units[from].value)/
units[to].value;


}



result=
Number(result.toFixed(6));


toInput.value=result;


let text=
`${value} ${categories[currentCategory].units[from].label}
=
${result} ${categories[currentCategory].units[to].label}`;


output.innerHTML=text;



if(addHistory){

addHistory(text);

}


}



// ======================================
// EVENTS
// ======================================


fromInput.addEventListener(
"keypress",
e=>{

if(!/[0-9.\-]/.test(e.key)){

e.preventDefault();

}

});



fromInput.addEventListener(
"input",
()=>{

clearTimeout(typingTimer);


convert(false);


typingTimer=setTimeout(()=>{

if(validateInput(
parseFloat(fromInput.value)
).valid){

convert(true);

}

},800);


});



fromUnit.addEventListener(
"change",
()=>convert(true)
);


toUnit.addEventListener(
"change",
()=>convert(true)
);



swapBtn.addEventListener(
"click",
()=>{

let temp=fromUnit.value;

fromUnit.value=toUnit.value;

toUnit.value=temp;


convert(true);

});



tabs.addEventListener(
"click",
e=>{

let btn=e.target.closest(".tab-btn");

if(!btn)return;


document
.querySelectorAll(".tab-btn")
.forEach(b=>
b.classList.remove("active")
);


btn.classList.add("active");


loadCategory(btn.dataset.cat);


});

// ── Dark Mode Logic Block ──
const themeToggleBtn = document.getElementById('themeToggle');
const toggleIcon = document.getElementById('toggleIcon');

// Load stored settings or default to device configuration
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', initialTheme);
updateStarIcon(initialTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateStarIcon(newTheme);
});

function updateStarIcon(theme) {
  if (theme === 'dark') {
    toggleIcon.classList.remove('ti-star');
    toggleIcon.classList.add('ti-star-filled');
  } else {
    toggleIcon.classList.remove('ti-star-filled');
    toggleIcon.classList.add('ti-star');
  }
}


// Theme dropdown
themeSelect.addEventListener(
  "change",
  () => applyTheme(themeSelect.value)
);


// Clear history button
clearHistoryBtn.addEventListener(
  "click",
  clearHistory
);


// ======================================
// INIT
// ======================================

loadTheme();

renderHistory();

loadCategory("length");

convert(false);


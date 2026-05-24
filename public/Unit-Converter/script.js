const categories = {
    length :{
        units :{
            meter: { label: "Meter(m)", value: 1 },
            kilometer: { label: "Kilometer(km)", value: 1000 },
            centimeter: { label: "Centimeter(cm)", value: 0.01 },
            millimeter: { label: "Millimeter(mm)", value: 0.001 },
            mile: { label: "Mile(mi)", value: 1609.344 },
            yard: { label: "Yard(yd)", value: 0.9144 },
            foot: { label: "Foot(ft)", value: 0.3048 },
            inch: { label: "Inch(in)", value: 0.0254 },
        },
        quick:[
            ["1 km", "1000 m"],
            ["1 m", "3.281 ft"],
            ["1 cm", "0.01 m"],
            ["1 m", "39.370 in"],
            ["1 mi", "1609.344 m"],
        ]
    },
    weight :{
        units: {
            kilogram: { label: "Kilogram (kg)", value: 1 },
            gram: { label: "Gram (g)", value: 0.001 },
            milligram: { label: "Milligram (mg)", value: 0.000001 },
            pound: { label: "Pound (lb)", value: 0.45359237 },
            ounce: { label: "Ounce (oz)", value: 0.0283495 },
            ton: { label: "Metric Ton (t)", value: 1000 }
        },
        quick: [
            ["1 kg", "1000 g"],
            ["1 lb", "0.454 kg"],
            ["1 oz", "28.35 g"],
            ["1 t", "1000 kg"],
            ["1 g", "1000 mg"]
        ]
    },
    temperature :{
        units: {
            celsius: { label: "Celsius (°C)" },
            fahrenheit: { label: "Fahrenheit (°F)" },
            kelvin: { label: "Kelvin (K)" }
        },
        quick: [
            ["0°C", "32°F"],
            ["100°C", "212°F"],
            ["37°C", "98.6°F"],
            ["0°C", "273.15K"],
            ["300K", "26.85°C"]
        ]
    },
    time :{
        units: {
            second: { label: "Second (s)", value: 1 },
            minute: { label: "Minute (min)", value: 60 },
            hour: { label: "Hour (hr)", value: 3600 },
            day: { label: "Day", value: 86400 },
            week: { label: "Week", value: 604800 },
            month: { label: "Month", value: 2629800 },
            year: { label: "Year", value: 31557600 }
        },
        quick: [
            ["1 min", "60 sec"],
            ["1 hr", "60 min"],
            ["1 day", "24 hr"],
            ["1 week", "7 days"],
            ["1 year", "365 days"]
        ]
    },
    speed :{
        units: {
            meterPerSecond: { label: "Meter/Second (m/s)", value: 1 },
            kilometerPerHour: { label: "Kilometer/Hour (km/h)", value: 0.277778 },
            milePerHour: { label: "Mile/Hour (mph)", value: 0.44704 },
            footPerSecond: { label: "Foot/Second (ft/s)", value: 0.3048 },
            knot: { label: "Knot", value: 0.514444 }
        },
        quick: [
            ["1 m/s", "3.6 km/h"],
            ["1 mph", "1.609 km/h"],
            ["1 knot", "1.852 km/h"],
            ["100 km/h", "62.137 mph"],
            ["1 ft/s", "0.305 m/s"]
        ]
    }

}

// DOM ITEMS //

const categoryList = document.getElementById("categoryList")

const fromInput = document.getElementById("fromInput")
const toInput = document.getElementById("toInput")

const fromUnit = document.getElementById("fromUnit")
const toUnit = document.getElementById("toUnit")

const output = document.getElementById("output")

let currentCategory = "length"

function loadCategory(category) {
    currentCategory = category;

    const data = categories[category];

    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    Object.keys(data.units).forEach((unitKey) => {
        const option1 = document.createElement("option")
        option1.value = unitKey;
        option1.textContent = data.units[unitKey].label;

        const option2 = document.createElement("option");
        option2.value = unitKey;
        option2.textContent = data.units[unitKey].label;

        fromUnit.appendChild(option1)
        toUnit.appendChild(option2)
    });

    const unitKeys=Object.keys(data.units);
    fromUnit.value = unitKeys[0];
    toUnit.value = unitKeys[1] || unitKeys[0];

    fromInput.value= 1;

    convert();
}


// Convert Function //

function convert(){
    const val = parseFloat(fromInput.value);

    if(isNaN(val)){
        toInput.value ="";
        output.innerHTML="Enter a valid number";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    let result;

    if(currentCategory === "temperature"){
        result = convertTemperature(val, from, to);
    } else{
        const units = categories[currentCategory].units;
        const baseValue = val*units[from].value;
        result = baseValue / units[to].value;
    }
    result = formatNumber(result);
    toInput.value = result;

    const fromLabel = categories[currentCategory].units[from].label
    const toLabel = categories[currentCategory].units[to].label

    output.innerHTML = `
        <span>${val} ${fromLabel}</span>
        <strong>=</strong>
        <span>${result} ${toLabel}</span>
    `

}

// TEMPERATURE CONVERSION //

function convertTemperature(value, from, to) {
  let celsius;

  if (from === "celsius") {
    celsius = value;
  } else if (from === "fahrenheit") {
    celsius = (value - 32) * 5 / 9;
  } else if (from === "kelvin") {
    celsius = value - 273.15;
  }

  if (to === "celsius") {
    return celsius;
  } else if (to === "fahrenheit") {
    return celsius * 9 / 5 + 32;
  } else if (to === "kelvin") {
    return celsius + 273.15;
  }
}


// FORMAR NUMBER //
function formatNumber(num) {
  if (num === 0) return 0;

  if (Math.abs(num) >= 1000000 || Math.abs(num) < 0.0001) {
    return Number(num).toExponential(4);
  }

  return parseFloat(num.toFixed(6));
}

categoryList.addEventListener("change", () => {
    loadCategory(categoryList.value)
});


// EVENT LISTENER //
fromInput.addEventListener("input", convert);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);


[fromUnit, toUnit].forEach((select) => {
  select.addEventListener("keydown", (e) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      e.preventDefault();
    }
  });
});



document.addEventListener("DOMContentLoaded", () => {
  loadCategory(currentCategory);
});
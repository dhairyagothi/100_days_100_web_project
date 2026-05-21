const celsius = document.getElementById("celsius");
const fahrenheit = document.getElementById("fahrenheit");
const kelvin = document.getElementById("kelvin");

celsius.addEventListener("input", () => {
  let c = parseFloat(celsius.value);
  if (!isNaN(c)) {
    fahrenheit.value = (c * 9/5 + 32).toFixed(2);
    kelvin.value = (c + 273.15).toFixed(2);
  } else {
    fahrenheit.value = "";
    kelvin.value = "";
  }
});

fahrenheit.addEventListener("input", () => {
  let f = parseFloat(fahrenheit.value);
  if (!isNaN(f)) {
    celsius.value = ((f - 32) * 5/9).toFixed(2);
    kelvin.value = ((f - 32) * 5/9 + 273.15).toFixed(2);
  } else {
    celsius.value = "";
    kelvin.value = "";
  }
});

kelvin.addEventListener("input", () => {
  let k = parseFloat(kelvin.value);
  if (!isNaN(k)) {
    celsius.value = (k - 273.15).toFixed(2);
    fahrenheit.value = ((k - 273.15) * 9/5 + 32).toFixed(2);
  } else {
    celsius.value = "";
    fahrenheit.value = "";
  }
});
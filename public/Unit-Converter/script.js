const meterRatios = {
    m: 1,
    km: 0.001,
    mi: 0.000621371,
    ft: 3.28084
};

const inputValue = document.getElementById('inputValue');
const outputValue = document.getElementById('outputValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');

function calculateConversion() {
    const val = parseFloat(inputValue.value);
if (isNaN(val)) {
        outputValue.value = '';
        return;
    }

    const fromKey = fromUnit.value;
    const toKey = toUnit.value;
const valueInMeters = val / meterRatios[fromKey];
const convertedValue = valueInMeters * meterRatios[toKey];
outputValue.value = parseFloat(convertedValue.toFixed(5));
}
inputValue.addEventListener('input', calculateConversion);
fromUnit.addEventListener('change', calculateConversion);
toUnit.addEventListener('change', calculateConversion);
calculateConversion();

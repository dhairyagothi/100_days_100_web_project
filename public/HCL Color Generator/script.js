document.addEventListener("DOMContentLoaded",function(){

    const hueInput = document.getElementById("hue");
    const saturationInput = document.getElementById("saturation");
    const lightnessInput = document.getElementById("lightness");

    const hueValueSpan = document.getElementById("hueValue");
    const saturationValueSpan = document.getElementById("saturationValue");
    const lightnessValueSpan = document.getElementById("lightnessValue");

    const colorDisplay = document.querySelector(".color-display");

    const copyButton = document.getElementById("copyButton");


    hueInput.addEventListener('input',updateColor);
    saturationInput.addEventListener('input',updateColor);
    lightnessInput.addEventListener('input',updateColor);

    updateColor();


    function updateColor(){

        const hue = hueInput.value;
        const saturation = saturationInput.value;
        const lightness = lightnessInput.value;

        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        colorDisplay.style.backgroundColor = color;

        hueValueSpan.textContent = hue;
        saturationValueSpan.textContent = saturation;
        lightnessValueSpan.textContent = lightness;

    }

    copyButton.addEventListener("click",copyToClipboard);

    function copyToClipboard(){

        const textToCopy = `hsl(${hueInput.value}, ${saturationInput.value}%, ${lightnessInput.value}%)`;

        navigator.clipboard.writeText(textToCopy).then(function(){

            alert("The color is copied to Clipboard")

        }).catch(function(err){

            console.error("Unable to Copy the Data",err);
        });

    }

});
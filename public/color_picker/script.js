const redSlider = document.getElementById('red');
    const greenSlider = document.getElementById('green');
    const blueSlider = document.getElementById('blue');
    const colorDisplay = document.getElementById('customColorDisplay');

    function updateColor() {

        const red = redSlider.value;
        const green = greenSlider.value;
        const blue = blueSlider.value;

        const color = `rgb(${red}, ${green}, ${blue})`;
        colorDisplay.style.backgroundColor = color;
    }

    
    redSlider.addEventListener('input', updateColor);
    greenSlider.addEventListener('input', updateColor);
    blueSlider.addEventListener('input', updateColor);

    
    updateColor();
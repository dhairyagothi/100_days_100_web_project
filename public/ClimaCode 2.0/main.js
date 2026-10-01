var rotateDiv = document.getElementById('rot');
var rotateIcons = document.getElementById('rot-icons');
var randomModeButton = document.getElementById('random-mode');
var angle = 0;

function rotateWheel(steps) {
  angle += 60 * steps;
  rotateDiv.style.transform = 'rotate(' + angle + 'deg)';
  rotateIcons.style.transform = 'rotate(' + angle + 'deg)';
}

var step = 2;
var color1 = 'rgba(0,0,0,0.5)';
var color2 = 'rgba(0,0,0,0.1)';

var gradient = ' conic-gradient(';
for (var i = 0; i < 360; i += step) {
  var color = i % (2 * step) === 0 ? color1 : color2;
  gradient += color + ' ' + i + 'deg, ';
}
gradient = gradient.slice(0, -2) + '), rgb(85 93 108)';

rotateDiv.style.background = gradient;


var toggles = document.querySelectorAll('.toggle');
var tempElement = document.querySelector('.temp');

let isAnimating = false; // Add flag to indicate if animation is active

toggles.forEach(function (toggle) {
  toggle.addEventListener('click', function () {
    if (this.classList.contains('active') || isAnimating) { // Check if animation is active
      return;
    }
    toggles.forEach(function (toggle) {
      toggle.classList.remove('active');
    });
    this.classList.add('active');
    var tempValue = parseFloat(tempElement.textContent);
    if (this.id === 'toggle-cel') {
      var celsius = Math.round((tempValue - 32) * 5 / 9);
      tempElement.textContent = celsius + '°C';
    } else if (this.id === 'toggle-far') {
      var fahrenheit = Math.round(tempValue * 9 / 5 + 32);
      tempElement.textContent = fahrenheit + '°F';
    }
  });
});

let currentTempF = 34; // Initialize with the initial temperature in Fahrenheit

// cubic ease in/out function
function easeInOutCubic(t) {
  return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function changeTemp(element, newTemp) {
  let unit = element.innerHTML.includes("F") ? "°F" : "°C";
  let currentTemp = unit === "°F" ? currentTempF : Math.round((currentTempF - 32) * 5 / 9);
  let finalTemp = unit === "°F" ? newTemp : Math.round((newTemp - 32) * 5 / 9);

  let duration = 2000; // Duration of the animation in milliseconds
  let startTime = null;

  function animate(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }

    let elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);
    progress = easeInOutCubic(progress);

    let tempNow = Math.round(currentTemp + (progress * (finalTemp - currentTemp)));
    element.innerHTML = `${tempNow}${unit}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Update currentTempF once the animation is complete
      currentTempF = newTemp;
      isAnimating = false; // Reset the flag when animation is done
    }
  }

  isAnimating = true; // Set flag when animation starts
  requestAnimationFrame(animate);
}


window.onload = function () {
  const sixths = Array.from(document.querySelectorAll('.sixths'));
  let index = 0;
  let isChoosingRandom = false;
  let temp = document.querySelector('.temp');
  let mountains = document.querySelector('#mountains');

  const climateModes = [
    { temp: 34, classes: [] },
    { temp: 27, classes: ['sunset'] },
    { temp: 14, classes: ['moon'] },
    { temp: 16, classes: ['clouds'] },
    { temp: 8, classes: ['storm'] },
    { temp: -4, classes: ['snow'] }
  ];

  function triggerLoadingBar() {
    let loadingBar = document.querySelector('.loading-bar');
    loadingBar.classList.add('active');

    setTimeout(() => {
      loadingBar.classList.remove('active');
    }, 1200);
  }

  function setClimateMode(nextIndex) {
    sixths[index].classList.remove('active');
    index = nextIndex % sixths.length;
    sixths[index].classList.add('active');

    mountains.classList.remove('sunset', 'moon', 'clouds', 'storm', 'snow');
    if (climateModes[index].classes.length) {
      mountains.classList.add(...climateModes[index].classes);
    }
    changeTemp(temp, climateModes[index].temp);
    triggerLoadingBar();
  }

  function chooseRandomMode() {
    if (isChoosingRandom) {
      return;
    }

    isChoosingRandom = true;
    let nextIndex = Math.floor(Math.random() * sixths.length);

    if (sixths.length > 1 && nextIndex === index) {
      nextIndex = (nextIndex + 1) % sixths.length;
    }

    randomModeButton.classList.add('is-choosing');
    rotateWheel(sixths.length + ((nextIndex - index + sixths.length) % sixths.length));

    setTimeout(() => {
      randomModeButton.classList.remove('is-choosing');
      setClimateMode(nextIndex);
      isChoosingRandom = false;
    }, 500);
  }

  rotateIcons.addEventListener('click', () => {
    rotateWheel(1);
    setClimateMode((index + 1) % sixths.length);
  });

  randomModeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    chooseRandomMode();
  });
};

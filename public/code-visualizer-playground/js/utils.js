// Encapsulates shared helpers and exposes only VisualizerUtils.
(function () {
  // Sleeps for the requested duration in milliseconds.
  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  // Returns a new random integer array used for bar generation.
  function randomArray(length, minValue, maxValue) {
    var values = [];

    for (var i = 0; i < length; i += 1) {
      var value =
        Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      values.push(value);
    }

    return values;
  }

  // Creates a shallow copy of an array for safe state updates.
  function copyArray(values) {
    return values.slice();
  }

  // Maps slider speed (1-100) to animation delay (500-50 ms).
  function speedValueToDelay(speedValue) {
    var clampedValue = Math.max(1, Math.min(100, speedValue));
    var slowest = 500;
    var fastest = 50;
    var ratio = (clampedValue - 1) / 99;
    return Math.round(slowest - ratio * (slowest - fastest));
  }

  // Exposes shared helpers globally so scripts work without ES modules.
  window.VisualizerUtils = {
    sleep: sleep,
    randomArray: randomArray,
    copyArray: copyArray,
    speedValueToDelay: speedValueToDelay,
  };
})();

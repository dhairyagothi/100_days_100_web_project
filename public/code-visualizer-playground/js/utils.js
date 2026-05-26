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

  // Builds an ascending sequence spread across the requested numeric range.
  function createAscendingArray(length, minValue, maxValue) {
    var values = [];

    if (length <= 0) {
      return values;
    }

    var range = maxValue - minValue;

    for (var i = 0; i < length; i += 1) {
      var ratio = length === 1 ? 0 : i / (length - 1);
      values.push(Math.round(minValue + ratio * range));
    }

    return values;
  }

  // Returns a descending version of the standard ascending sequence.
  function createDescendingArray(length, minValue, maxValue) {
    return createAscendingArray(length, minValue, maxValue).reverse();
  }

  // Creates a mostly sorted array with a few local swaps for learning demos.
  function createNearlySortedArray(length, minValue, maxValue) {
    var values = createAscendingArray(length, minValue, maxValue);
    var swapCount = Math.max(1, Math.round(length * 0.12));

    for (var i = 0; i < swapCount; i += 1) {
      var index = Math.min(
        values.length - 2,
        Math.floor((i * values.length) / swapCount),
      );

      if (index >= 0 && index < values.length - 1) {
        var temp = values[index];
        values[index] = values[index + 1];
        values[index + 1] = temp;
      }
    }

    return values;
  }

  // Parses a comma-separated list of numbers into an array or a validation error.
  function parseNumberList(inputValue) {
    var rawValue = String(inputValue || "").trim();
    var result = {
      valid: false,
      values: [],
      message: "Enter comma-separated numbers to build a custom array.",
    };

    if (!rawValue) {
      return result;
    }

    var tokens = rawValue.split(",");
    var values = [];

    for (var i = 0; i < tokens.length; i += 1) {
      var token = tokens[i].trim();

      if (!token) {
        result.message =
          "Remove empty values and keep the list in comma-separated form.";
        return result;
      }

      var numericValue = Number(token);

      if (!isFinite(numericValue)) {
        result.message =
          '"' +
          token +
          '" is not a valid number. Use digits separated by commas.';
        return result;
      }

      values.push(numericValue);
    }

    result.valid = true;
    result.values = values;
    result.message = "Custom array ready.";

    return result;
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
    createAscendingArray: createAscendingArray,
    createDescendingArray: createDescendingArray,
    createNearlySortedArray: createNearlySortedArray,
    parseNumberList: parseNumberList,
    speedValueToDelay: speedValueToDelay,
  };
})();

(function () {
  var sleep = window.VisualizerUtils.sleep;

  // Returns true when the app requests an immediate stop.
  function shouldStop(callbacks) {
    return typeof callbacks.shouldStop === "function" && callbacks.shouldStop();
  }

  // Pauses between operations while respecting app-level controls.
  async function checkpoint(speed, callbacks) {
    if (shouldStop(callbacks)) {
      throw new Error("VISUALIZATION_STOPPED");
    }

    if (typeof callbacks.wait === "function") {
      await callbacks.wait(speed);
    } else {
      await sleep(speed);
    }

    if (shouldStop(callbacks)) {
      throw new Error("VISUALIZATION_STOPPED");
    }
  }

  // Updates the explanation panel with a plain-English message.
  function explain(callbacks, text) {
    if (typeof callbacks.onExplain === "function") {
      callbacks.onExplain(text);
    }
  }

  // Runs selection sort and emits callback events for each visual step.
  async function visualize(array, speed, callbacks) {
    var n = array.length;

    for (var i = 0; i < n - 1; i += 1) {
      var minIndex = i;
      explain(
        callbacks,
        "Starting a new pass. Assume index " + i + " is the minimum.",
      );

      for (var j = i + 1; j < n; j += 1) {
        explain(
          callbacks,
          "Comparing current minimum at index " +
            minIndex +
            " (value " +
            array[minIndex] +
            ") with index " +
            j +
            " (value " +
            array[j] +
            ").",
        );

        if (typeof callbacks.onCompare === "function") {
          await callbacks.onCompare(minIndex, j, array[minIndex], array[j]);
        }
        await checkpoint(speed, callbacks);

        if (array[j] < array[minIndex]) {
          minIndex = j;
          explain(callbacks, "Found a new minimum at index " + minIndex + ".");
        }
      }

      if (minIndex !== i) {
        explain(
          callbacks,
          "Swapping index " +
            i +
            " (value " +
            array[i] +
            ") with minimum index " +
            minIndex +
            " (value " +
            array[minIndex] +
            ").",
        );

        var temp = array[i];
        array[i] = array[minIndex];
        array[minIndex] = temp;

        if (typeof callbacks.onSwap === "function") {
          await callbacks.onSwap(i, minIndex, array);
        }
        await checkpoint(speed, callbacks);
      }

      if (typeof callbacks.onSorted === "function") {
        await callbacks.onSorted(i);
      }
      await checkpoint(speed, callbacks);
    }

    if (typeof callbacks.onSorted === "function") {
      await callbacks.onSorted(n - 1);
    }

    return array;
  }

  // Registers selection sort so app.js can route to it.
  window.SortingAlgorithms = window.SortingAlgorithms || {};
  window.SortingAlgorithms.selection = visualize;
})();

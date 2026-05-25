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

  // Runs bubble sort and emits callback events for each visual step.
  async function visualize(array, speed, callbacks) {
    var n = array.length;

    for (var i = 0; i < n; i += 1) {
      var swapped = false;

      for (var j = 0; j < n - i - 1; j += 1) {
        explain(
          callbacks,
          "Comparing index " +
            j +
            " (value " +
            array[j] +
            ") with index " +
            (j + 1) +
            " (value " +
            array[j + 1] +
            ").",
        );

        if (typeof callbacks.onCompare === "function") {
          await callbacks.onCompare(j, j + 1, array[j], array[j + 1]);
        }
        await checkpoint(speed, callbacks);

        if (array[j] > array[j + 1]) {
          explain(
            callbacks,
            "Value " +
              array[j] +
              " is larger than " +
              array[j + 1] +
              ", so we swap them.",
          );

          var temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          if (typeof callbacks.onSwap === "function") {
            await callbacks.onSwap(j, j + 1, array);
          }
          await checkpoint(speed, callbacks);
          swapped = true;
        }
      }

      if (typeof callbacks.onSorted === "function") {
        await callbacks.onSorted(n - i - 1);
      }
      await checkpoint(speed, callbacks);

      if (!swapped) {
        explain(
          callbacks,
          "No swaps happened in this pass, so the array is now sorted.",
        );

        for (var k = 0; k < n - i - 1; k += 1) {
          if (typeof callbacks.onSorted === "function") {
            await callbacks.onSorted(k);
          }
        }
        break;
      }
    }

    return array;
  }

  // Registers bubble sort so app.js can route to it.
  window.SortingAlgorithms = window.SortingAlgorithms || {};
  window.SortingAlgorithms.bubble = visualize;
})();

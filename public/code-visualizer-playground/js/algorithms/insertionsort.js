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

  // Runs insertion sort and emits callback events for each visual step.
  async function visualize(array, speed, callbacks) {
    var n = array.length;

    if (typeof callbacks.onSorted === "function") {
      await callbacks.onSorted(0);
    }

    for (var i = 1; i < n; i += 1) {
      var key = array[i];
      var j = i - 1;

      explain(
        callbacks,
        "Take value " +
          key +
          " from index " +
          i +
          " and insert it in the sorted part.",
      );

      while (j >= 0) {
        explain(
          callbacks,
          "Comparing key value " +
            key +
            " with index " +
            j +
            " (value " +
            array[j] +
            ").",
        );

        if (typeof callbacks.onCompare === "function") {
          await callbacks.onCompare(j, j + 1, array[j], key);
        }
        await checkpoint(speed, callbacks);

        if (array[j] > key) {
          array[j + 1] = array[j];
          explain(
            callbacks,
            "Value " +
              array[j] +
              " is larger than " +
              key +
              ", so shift it right by one position.",
          );

          if (typeof callbacks.onSwap === "function") {
            await callbacks.onSwap(j + 1, j, array);
          }
          await checkpoint(speed, callbacks);
          j -= 1;
        } else {
          break;
        }
      }

      array[j + 1] = key;
      explain(
        callbacks,
        "Place key value " + key + " at index " + (j + 1) + ".",
      );

      if (typeof callbacks.onSwap === "function") {
        await callbacks.onSwap(j + 1, j + 1, array);
      }
      await checkpoint(speed, callbacks);

      for (var k = 0; k <= i; k += 1) {
        if (typeof callbacks.onSorted === "function") {
          await callbacks.onSorted(k);
        }
      }
    }

    return array;
  }

  // Registers insertion sort so app.js can route to it.
  window.SortingAlgorithms = window.SortingAlgorithms || {};
  window.SortingAlgorithms.insertion = visualize;
})();

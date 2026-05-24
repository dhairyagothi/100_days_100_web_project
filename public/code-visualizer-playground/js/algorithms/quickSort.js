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

  // Partitions the array around a pivot and returns the pivot's final index.
  async function partition(array, low, high, speed, callbacks) {
    var pivot = array[high];
    var i = low - 1;

    explain(
      callbacks,
      "Choosing index " + high + " (value " + pivot + ") as the pivot.",
    );

    for (var j = low; j < high; j += 1) {
      explain(
        callbacks,
        "Comparing index " +
          j +
          " (value " +
          array[j] +
          ") with pivot " +
          pivot +
          ".",
      );

      if (typeof callbacks.onCompare === "function") {
        await callbacks.onCompare(j, high, array[j], pivot);
      }
      await checkpoint(speed, callbacks);

      if (array[j] <= pivot) {
        i += 1;

        if (i !== j) {
          explain(
            callbacks,
            "Value " +
              array[j] +
              " is less than or equal to pivot, swapping with index " +
              i +
              ".",
          );

          var tempA = array[i];
          array[i] = array[j];
          array[j] = tempA;

          if (typeof callbacks.onSwap === "function") {
            await callbacks.onSwap(i, j, array);
          }
          await checkpoint(speed, callbacks);
        }
      }
    }

    explain(
      callbacks,
      "Placing pivot into its final sorted position at index " + (i + 1) + ".",
    );
    var tempB = array[i + 1];
    array[i + 1] = array[high];
    array[high] = tempB;

    if (typeof callbacks.onSwap === "function") {
      await callbacks.onSwap(i + 1, high, array);
    }
    await checkpoint(speed, callbacks);

    return i + 1;
  }

  // Recursively applies quick sort to left and right partitions.
  async function sort(array, low, high, speed, callbacks) {
    if (low > high) {
      return;
    }

    if (low === high) {
      if (typeof callbacks.onSorted === "function") {
        await callbacks.onSorted(low);
      }
      await checkpoint(speed, callbacks);
      return;
    }

    var pivotIndex = await partition(array, low, high, speed, callbacks);

    if (typeof callbacks.onSorted === "function") {
      await callbacks.onSorted(pivotIndex);
    }
    await checkpoint(speed, callbacks);

    await sort(array, low, pivotIndex - 1, speed, callbacks);
    await sort(array, pivotIndex + 1, high, speed, callbacks);
  }

  // Runs quick sort and emits callback events for each visual step.
  async function visualize(array, speed, callbacks) {
    await sort(array, 0, array.length - 1, speed, callbacks);

    for (var i = 0; i < array.length; i += 1) {
      if (typeof callbacks.onSorted === "function") {
        await callbacks.onSorted(i);
      }
    }

    return array;
  }

  // Registers quick sort so app.js can route to it.
  window.SortingAlgorithms = window.SortingAlgorithms || {};
  window.SortingAlgorithms.quick = visualize;
})();

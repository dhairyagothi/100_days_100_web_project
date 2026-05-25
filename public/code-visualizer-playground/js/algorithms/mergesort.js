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

  // Merges two sorted halves back into the array while emitting visual events.
  async function merge(array, left, middle, right, speed, callbacks) {
    var leftPart = array.slice(left, middle + 1);
    var rightPart = array.slice(middle + 1, right + 1);
    var i = 0;
    var j = 0;
    var k = left;

    while (i < leftPart.length && j < rightPart.length) {
      explain(
        callbacks,
        "Comparing left value " +
          leftPart[i] +
          " with right value " +
          rightPart[j] +
          ".",
      );

      if (typeof callbacks.onCompare === "function") {
        await callbacks.onCompare(
          left + i,
          middle + 1 + j,
          leftPart[i],
          rightPart[j],
        );
      }
      await checkpoint(speed, callbacks);

      if (leftPart[i] <= rightPart[j]) {
        array[k] = leftPart[i];
        explain(callbacks, "Placing " + leftPart[i] + " at index " + k + ".");
        i += 1;
      } else {
        array[k] = rightPart[j];
        explain(callbacks, "Placing " + rightPart[j] + " at index " + k + ".");
        j += 1;
      }

      if (typeof callbacks.onSwap === "function") {
        await callbacks.onSwap(k, k, array);
      }
      await checkpoint(speed, callbacks);
      k += 1;
    }

    while (i < leftPart.length) {
      array[k] = leftPart[i];
      explain(
        callbacks,
        "Copying remaining left value " + leftPart[i] + " to index " + k + ".",
      );

      if (typeof callbacks.onSwap === "function") {
        await callbacks.onSwap(k, k, array);
      }
      await checkpoint(speed, callbacks);

      i += 1;
      k += 1;
    }

    while (j < rightPart.length) {
      array[k] = rightPart[j];
      explain(
        callbacks,
        "Copying remaining right value " +
          rightPart[j] +
          " to index " +
          k +
          ".",
      );

      if (typeof callbacks.onSwap === "function") {
        await callbacks.onSwap(k, k, array);
      }
      await checkpoint(speed, callbacks);

      j += 1;
      k += 1;
    }
  }

  // Recursively divides the array and sorts each segment.
  async function divideAndSort(array, left, right, speed, callbacks) {
    if (left >= right) {
      return;
    }

    var middle = Math.floor((left + right) / 2);
    await divideAndSort(array, left, middle, speed, callbacks);
    await divideAndSort(array, middle + 1, right, speed, callbacks);
    await merge(array, left, middle, right, speed, callbacks);
  }

  // Runs merge sort and emits callback events for each visual step.
  async function visualize(array, speed, callbacks) {
    explain(
      callbacks,
      "Merge sort splits the array into halves, then merges them in sorted order.",
    );
    await divideAndSort(array, 0, array.length - 1, speed, callbacks);

    for (var i = 0; i < array.length; i += 1) {
      if (typeof callbacks.onSorted === "function") {
        await callbacks.onSorted(i);
      }
      await checkpoint(speed, callbacks);
    }

    return array;
  }

  // Registers merge sort so app.js can route to it.
  window.SortingAlgorithms = window.SortingAlgorithms || {};
  window.SortingAlgorithms.merge = visualize;
})();

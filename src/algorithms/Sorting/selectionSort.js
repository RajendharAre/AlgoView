export function* selectionSortGenerator(inputArray) {
  const arr = inputArray.slice();
  const n = arr.length;
  const done = new Set();

  // initial yield (neutral)
  yield {
    array: arr.slice(),
    currentIndex: 0,
    minIndex: 0,
    comparingIndex: null,
    swapIndices: null,
    doneIndices: new Set(done),
  };

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // mark the 'current' position and candidate
    yield {
      array: arr.slice(),
      currentIndex: i,
      minIndex,
      comparingIndex: null,
      swapIndices: null,
      doneIndices: new Set(done),
    };

    for (let j = i + 1; j < n; j++) {
      // comparing j with current minIndex
      yield {
        array: arr.slice(),
        currentIndex: i,
        minIndex,
        comparingIndex: j,
        swapIndices: null,
        doneIndices: new Set(done),
      };

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        // new candidate selected
        yield {
          array: arr.slice(),
          currentIndex: i,
          minIndex,
          comparingIndex: j,
          swapIndices: null,
          doneIndices: new Set(done),
        };
      }
    }

    if (minIndex !== i) {
      // swap and yield the swap event (so UI can animate)
      const temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;

      yield {
        array: arr.slice(),
        currentIndex: i,
        minIndex,
        comparingIndex: null,
        swapIndices: [i, minIndex],
        doneIndices: new Set(done),
      };
    }

    // mark i as done
    done.add(i);
    yield {
      array: arr.slice(),
      currentIndex: i + 1,
      minIndex: i + 1 < n ? i + 1 : i,
      comparingIndex: null,
      swapIndices: null,
      doneIndices: new Set(done),
    };
  }

  // final: all done
  for (let k = 0; k < n; k++) done.add(k);
  yield {
    array: arr.slice(),
    currentIndex: null,
    minIndex: null,
    comparingIndex: null,
    swapIndices: null,
    doneIndices: new Set(done),
  };
}

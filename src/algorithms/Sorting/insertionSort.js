// src/algorithms/Sorting/insertionSort.js
export function* insertionSort(arr) {
  const a = [...arr];
  const n = a.length;

  // initially nothing is "done" except maybe index 0 (treat index 0 as sorted)
  let doneIndices = n > 0 ? [0] : [];

  // yield initial state
  yield {
    array: [...a],
    keyIndex: null,
    comparingIndex: null,
    shiftingIndex: null,
    placedIndex: null,
    doneIndices: [...doneIndices],
    description: 'Initial array',
  };

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    // picking key
    yield {
      array: [...a],
      keyIndex: i,
      comparingIndex: null,
      shiftingIndex: null,
      placedIndex: null,
      doneIndices: [...doneIndices],
      description: `Pick key ${key} from index ${i}`,
    };

    // shift larger elements to the right
    while (j >= 0 && a[j] > key) {
      // comparing a[j] with key
      yield {
        array: [...a],
        keyIndex: i,
        comparingIndex: j,
        shiftingIndex: null,
        placedIndex: null,
        doneIndices: [...doneIndices],
        description: `Compare ${a[j]} (index ${j}) > ${key} ? shift right`,
      };

      // shift a[j] to a[j+1]
      a[j + 1] = a[j];
      yield {
        array: [...a],
        keyIndex: i,
        comparingIndex: j,
        shiftingIndex: j + 1,
        placedIndex: null,
        doneIndices: [...doneIndices],
        description: `Shift ${a[j]} from index ${j} to index ${j + 1}`,
      };

      j--;
    }

    // place key at its correct position
    a[j + 1] = key;

    // update doneIndices to include the newly extended sorted prefix
    doneIndices = Array.from({ length: i + 1 }, (_, k) => k);

    yield {
      array: [...a],
      keyIndex: i,
      comparingIndex: null,
      shiftingIndex: null,
      placedIndex: j + 1,
      doneIndices: [...doneIndices],
      description: `Insert key ${key} at index ${j + 1}`,
    };
  }

  // final state: fully sorted
  yield {
    array: [...a],
    keyIndex: null,
    comparingIndex: null,
    shiftingIndex: null,
    placedIndex: null,
    doneIndices: Array.from({ length: n }, (_, k) => k),
    description: 'Insertion sort complete',
  };
}

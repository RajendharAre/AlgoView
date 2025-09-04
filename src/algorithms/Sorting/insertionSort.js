// src/algorithms/Sorting/insertionSort.js
export function* insertionSort(arr) {
  const a = [...arr];

  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;

    // Show "picking up card"
    yield {
      array: [...a],
      keyIndex: i,
      currentIndex: i,
      comparingIndex: j,
      description: `Pick card ${key} at index ${i}`,
    };

    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];

      yield {
        array: [...a],
        keyValue: key,
        keyIndex: j, // target position moving left
        shiftingIndex: j,
        comparingIndex: j,
        description: `Shift ${a[j]} right`,
      };

      j--;
    }

    a[j + 1] = key;

    yield {
      array: [...a],
      keyPlacedIndex: j + 1,
      description: `Place card ${key} at position ${j + 1}`,
    };
  }

  yield {
    array: [...a],
    description: 'Sorting complete!',
  };
}

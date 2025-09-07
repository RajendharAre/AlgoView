// src/algorithms/Sorting/quickSort.js

export function* quickSort(arr) {
  const a = [...arr];

  function* partition(low, high) {
    const pivotValue = a[high];
    let i = low;
    for (let j = low; j < high; j++) {
      yield {
        array: [...a],
        pivot: high,
        left: low,
        right: high,
        comparing: [j],
        description: `Comparing ${a[j]} with pivot ${pivotValue}`,
      };

      if (a[j] < pivotValue) {
        [a[i], a[j]] = [a[j], a[i]];
        yield {
          array: [...a],
          pivot: high,
          left: low,
          right: high,
          swapped: [i, j],
          description: `Swapped ${a[i]} and ${a[j]}`,
        };
        i++;
      }
    }

    [a[i], a[high]] = [a[high], a[i]]; // place pivot correctly
    yield {
      array: [...a],
      pivot: i,
      left: low,
      right: high,
      swapped: [i, high],
      description: `Pivot ${a[i]} placed at index ${i}`,
    };

    return i;
  }

  function* quickSortRecursive(low, high) {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield* quickSortRecursive(low, pi - 1);
      yield* quickSortRecursive(pi + 1, high);
    } else if (low === high) {
      // single element is sorted
      yield {
        array: [...a],
        pivot: low,
        left: low,
        right: high,
        description: `Single element ${a[low]} is sorted`,
      };
    }
  }

  yield* quickSortRecursive(0, a.length - 1);

  yield {
    array: [...a],
    pivot: null,
    left: 0,
    right: a.length - 1,
    description: 'Sorting complete!',
  };
}

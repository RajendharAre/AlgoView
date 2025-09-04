// src/algorithms/Sorting/quickSort.js
export function* quickSort(arr) {
  const a = [...arr];

  function* partition(low, high) {
    const pivot = a[high];
    let i = low - 1;

    yield { array: [...a], pivotIndex: high, low, high, phase: 'pivot', description: `Pivot = ${pivot} at ${high}` };

    for (let j = low; j < high; j++) {
      yield { array: [...a], pivotIndex: high, i, j, phase: 'scan', description: `Compare ${a[j]} with pivot ${pivot}` };

      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        yield { array: [...a], pivotIndex: high, i, j, phase: 'swap', description: `Swap indices ${i} and ${j}` };
      }
    }

    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    yield { array: [...a], pivotIndex: i + 1, phase: 'pivot-place', description: `Place pivot at ${i + 1}` };

    return i + 1;
  }

  function* _quickSort(low, high) {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield { array: [...a], phase: 'partitioned', pivotIndex: pi, left: [low, pi - 1], right: [pi + 1, high], description: `Partitioned around ${pi}` };
      yield* _quickSort(low, pi - 1);
      yield* _quickSort(pi + 1, high);
    } else {
      yield { array: [...a], phase: 'base', description: `Base at [${low}, ${high}]` };
    }
  }

  yield* _quickSort(0, a.length - 1);
  yield { array: [...a], phase: 'done', description: 'Sorting complete!' };
}

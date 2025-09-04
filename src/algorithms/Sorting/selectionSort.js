// src/algorithms/Sorting/selectionSort.js
export function* selectionSort(arr) {
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { array: [...a], i, minIdx, scanningFrom: i + 1, phase: 'select', description: `Start selection at index ${i}` };

    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], i, minIdx, j, phase: 'compare', description: `Compare a[${j}] with current min a[${minIdx}]` };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { array: [...a], i, minIdx, j, phase: 'new-min', description: `New min at ${minIdx}` };
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { array: [...a], i, minIdx, phase: 'swap', description: `Swap ${i} and ${minIdx}` };
    }

    yield { array: [...a], sortedUpto: i, phase: 'fixed', description: `Fixed position ${i}` };
  }

  yield { array: [...a], sortedUpto: n - 1, phase: 'done', description: 'Sorting complete!' };
}

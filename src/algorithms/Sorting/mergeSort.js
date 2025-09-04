// src/algorithms/Sorting/mergeSort.js
export function* mergeSort(arr) {
  const a = [...arr];

  function* _mergeSort(l, r) {
    if (l >= r) {
      yield {
        array: [...a],
        range: [l, r],
        phase: 'base',
        description: `Base case at [${l}, ${r}]`,
      };
      return;
    }

    const m = Math.floor((l + r) / 2);

    yield { array: [...a], range: [l, r], mid: m, phase: 'split', description: `Split [${l}, ${r}] at ${m}` };
    yield* _mergeSort(l, m);
    yield* _mergeSort(m + 1, r);

    // Merge
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
      yield {
        array: [...a],
        range: [l, r],
        leftWindow: [l, m],
        rightWindow: [m + 1, r],
        comparing: [k, left[i], right[j]],
        phase: 'merge-compare',
        description: `Compare ${left[i]} and ${right[j]}`,
      };

      if (left[i] <= right[j]) {
        a[k++] = left[i++];
      } else {
        a[k++] = right[j++];
      }

      yield {
        array: [...a],
        range: [l, r],
        mergedIndex: k - 1,
        phase: 'merge-place',
        description: `Place at index ${k - 1}`,
      };
    }

    while (i < left.length) {
      a[k++] = left[i++];
      yield {
        array: [...a],
        range: [l, r],
        mergedIndex: k - 1,
        phase: 'merge-place',
        description: `Drain left into index ${k - 1}`,
      };
    }

    while (j < right.length) {
      a[k++] = right[j++];
      yield {
        array: [...a],
        range: [l, r],
        mergedIndex: k - 1,
        phase: 'merge-place',
        description: `Drain right into index ${k - 1}`,
      };
    }

    yield {
      array: [...a],
      range: [l, r],
      phase: 'merged',
      description: `Merged segment [${l}, ${r}]`,
    };
  }

  yield* _mergeSort(0, a.length - 1);

  yield { array: [...a], phase: 'done', description: 'Sorting complete!' };
}
 
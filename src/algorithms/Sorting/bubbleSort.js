// src/algorithms/Sorting/bubbleSort.js
export function* bubbleSort(arr) {
  const a = [...arr]
  let n = a.length
  let doneIndex = a.length // tail from doneIndex to end is sorted

  for (let i = 0; i < n - 1; i++) {
    let swappedThisPass = false

    for (let j = 0; j < n - i - 1; j++) {
      // comparing j and j+1
      yield {
        array: [...a],
        compared: [j, j + 1],
        swapped: false,
        doneIndex,
        description: `Comparing ${a[j]} and ${a[j + 1]}`,
      }

      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swappedThisPass = true

        yield {
          array: [...a],
          compared: [j, j + 1],
          swapped: true,
          doneIndex,
          description: `Swapped ${a[j]} and ${a[j + 1]}`,
        }
      }
    }

    doneIndex = a.length - i - 1 // last element of this pass is in place
    // Optional: yield pass completion
    yield {
      array: [...a],
      compared: [],
      swapped: false,
      doneIndex,
      description: `End of pass ${i + 1}; index ${doneIndex} fixed.`,
    }

    if (!swappedThisPass) break // optimization
  }

  yield {
    array: [...a],
    compared: [],
    swapped: false,
    doneIndex: 0, // whole array sorted
    description: 'Sorting complete!',
  }
}

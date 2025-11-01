// src/algorithms/Sorting/insertionSort.js

/**
 * Insertion Sort Algorithm
 * 
 * A simple sorting algorithm that builds the final sorted array one item at a time.
 * It is much less efficient on large lists than more advanced algorithms such as quicksort,
 * heapsort, or merge sort.
 * 
 * @param {number[]} arr - Array of numbers to sort
 * @yields {Object} - Step information for visualization
 * @returns {Generator<Object, void, unknown>} - Generator that yields visualization steps
 */
export function* insertionSort(arr) {
  const a = [...arr]
  const n = a.length

  // initially nothing is "done" except maybe index 0 (treat index 0 as sorted)
  let doneIndices = n > 0 ? [0] : []

  // yield initial state
  yield {
    array: [...a],
    keyIndex: null,
    comparingIndex: null,
    shiftingIndex: null,
    placedIndex: null,
    doneIndices: [...doneIndices],
    description: 'Initial array',
  }

  for (let i = 1; i < n; i++) {
    const key = a[i]
    let j = i - 1

    // picking key
    yield {
      array: [...a],
      keyIndex: i,
      comparingIndex: null,
      shiftingIndex: null,
      placedIndex: null,
      doneIndices: [...doneIndices],
      description: `Pick key ${key} from index ${i}`,
    }

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
      }

      // shift a[j] to a[j+1]
      a[j + 1] = a[j]
      yield {
        array: [...a],
        keyIndex: i,
        comparingIndex: j,
        shiftingIndex: j + 1,
        placedIndex: null,
        doneIndices: [...doneIndices],
        description: `Shift ${a[j]} from index ${j} to index ${j + 1}`,
      }

      j--
    }

    // place key at its correct position
    a[j + 1] = key

    // update doneIndices to include the newly extended sorted prefix
    doneIndices = Array.from({ length: i + 1 }, (_, k) => k)

    yield {
      array: [...a],
      keyIndex: i,
      comparingIndex: null,
      shiftingIndex: null,
      placedIndex: j + 1,
      doneIndices: [...doneIndices],
      description: `Insert key ${key} at index ${j + 1}`,
    }
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
  }
}

/**
 * Algorithm information for Insertion Sort
 * 
 * @type {Object}
 * @property {string} name - Name of the algorithm
 * @property {string} category - Category of the algorithm
 * @property {Object} complexity - Time and space complexity
 * @property {Object} complexity.time - Time complexity for different cases
 * @property {string} complexity.time.best - Best case time complexity
 * @property {string} complexity.time.average - Average case time complexity
 * @property {string} complexity.time.worst - Worst case time complexity
 * @property {string} complexity.space - Space complexity
 * @property {boolean} stable - Whether the algorithm is stable
 * @property {boolean} inPlace - Whether the algorithm sorts in-place
 * @property {string} description - Brief description of the algorithm
 */
export const insertionSortInfo = {
  name: 'Insertion Sort',
  category: 'sorting',
  complexity: {
    time: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    space: 'O(1)'
  },
  stable: true,
  inPlace: true,
  description: 'A simple sorting algorithm that builds the final sorted array one item at a time by inserting each element into its correct position.',
  code: {
    javascript: `
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    python: `
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    java: `
public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
  },
  useCases: [
    'Small datasets where simplicity is preferred',
    'When the data is already mostly sorted',
    'Online algorithms where data arrives continuously',
    'Hybrid algorithms like Timsort and Introsort use insertion sort for small subarrays'
  ]
}
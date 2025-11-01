// src/algorithms/Sorting/bubbleSort.js

/**
 * Bubble Sort Algorithm
 * 
 * A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements
 * and swaps them if they are in the wrong order. The pass through the list is repeated until
 * the list is sorted.
 * 
 * @param {number[]} arr - Array of numbers to sort
 * @yields {Object} - Step information for visualization
 * @returns {Generator<Object, void, unknown>} - Generator that yields visualization steps
 */
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

/**
 * Algorithm information for Bubble Sort
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
export const bubbleSortInfo = {
  name: 'Bubble Sort',
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
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  code: {
    javascript: `
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    python: `
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    java: `
public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
  },
  useCases: [
    'Educational purposes to teach sorting concepts',
    'Small datasets where simplicity is preferred over efficiency',
    'When the data is already mostly sorted',
    'When simplicity of implementation is more important than performance'
  ]
}
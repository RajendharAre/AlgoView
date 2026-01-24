// src/algorithms/Sorting/selectionSort.js

/**
 * Selection Sort Algorithm
 * 
 * A sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.
 * The algorithm repeatedly finds the smallest element in the unsorted sublist, swaps it with the leftmost
 * unsorted element, and moves the boundary of the sorted sublist one position to the right.
 * 
 * @param {number[]} arr - Array of numbers to sort
 * @yields {Object} - Step information for visualization
 * @returns {Generator<Object, void, unknown>} - Generator that yields visualization steps
 */
export function* selectionSort(arr) {
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    // Mark current minimum index and start scanning
    yield {
      array: [...a],
      compared: [i], // current position
      swapping: [], // no swapping happening yet
      doneIndex: i, // elements before index i are sorted
      description: `Starting pass ${i + 1}: Assuming element at index ${i} is minimum (${a[i]})`,
    };

    for (let j = i + 1; j < n; j++) {
      // Comparing current minimum with element at j
      yield {
        array: [...a],
        compared: [minIdx, j], // current minimum and element being compared
        swapping: [], // no swapping happening yet
        doneIndex: i, // elements before index i are sorted
        description: `Comparing minimum ${a[minIdx]} at index ${minIdx} with ${a[j]} at index ${j}`,
      };

      if (a[j] < a[minIdx]) {
        minIdx = j; // Found a new minimum

        yield {
          array: [...a],
          compared: [minIdx], // new minimum
          swapping: [], // no swapping happening yet
          doneIndex: i, // elements before index i are sorted
          description: `New minimum found: ${a[minIdx]} at index ${minIdx}`,
        };
      }
    }

    // If minimum is not at the current position, swap
    if (minIdx !== i) {
      // Perform the swap
      [a[i], a[minIdx]] = [a[minIdx], a[i]];

      yield {
        array: [...a],
        compared: [i, minIdx], // positions being swapped
        swapping: [i, minIdx], // indicate these positions are swapping
        doneIndex: i, // elements before index i are sorted
        description: `Swapping ${a[minIdx]} at index ${i} with ${a[i]} at index ${minIdx}`,
      };
    }

    // Mark the current position as sorted
    yield {
      array: [...a],
      compared: [],
      swapping: [],
      doneIndex: i + 1, // increment the sorted portion
      description: `Element at index ${i} is now in its final sorted position`,
    };
  }

  yield {
    array: [...a],
    compared: [],
    swapping: [],
    doneIndex: n, // all elements are sorted
    description: 'Selection Sort complete!',
  };
}

/**
 * Algorithm information for Selection Sort
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
export const selectionSortInfo = {
  name: 'Selection Sort',
  category: 'sorting',
  complexity: {
    time: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    space: 'O(1)'
  },
  stable: false,
  inPlace: true,
  description: 'A sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist. The algorithm repeatedly finds the smallest element in the unsorted sublist, swaps it with the leftmost unsorted element, and moves the boundary of the sorted sublist one position to the right.',
  code: {
    javascript: `
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    python: `
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    java: `
public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`
  },
  useCases: [
    'When memory writes are expensive since selection sort minimizes the number of swaps',
    'When the cost of comparison is much lower than the cost of swapping',
    'Educational purposes to teach sorting concepts',
    'When auxiliary memory is limited'
  ]
}
/**
 * Selection Sort Algorithm
 * 
 * A simple in-place comparison sorting algorithm. It divides the input list into two parts:
 * the sublist of items already sorted, which is built up from left to right at the front
 * of the list, and the sublist of items remaining to be sorted that occupy the rest of the list.
 * 
 * @param {number[]} inputArray - Array of numbers to sort
 * @yields {Object} - Step information for visualization
 * @returns {Generator<Object, void, unknown>} - Generator that yields visualization steps
 */
export function* selectionSort(inputArray) {
  const arr = inputArray.slice()
  const n = arr.length
  const doneIndices = []
  let stepIndex = 0

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    // Start outer loop
    yield {
      array: arr.slice(),
      currentIndex: i,
      minIndex,
      comparingIndex: null,
      swapIndices: null,
      doneIndices: [...doneIndices],
      stepIndex: stepIndex++,
      description: `Starting new outer loop at index ${i}, initial minIndex = ${minIndex}`,
    }

    for (let j = i + 1; j < n; j++) {
      // Comparing
      yield {
        array: arr.slice(),
        currentIndex: i,
        minIndex,
        comparingIndex: j,
        swapIndices: null,
        doneIndices: [...doneIndices],
        stepIndex: stepIndex++,
        description: `Comparing arr[${j}] = ${arr[j]} with current min arr[${minIndex}] = ${arr[minIndex]}`,
      }

      if (arr[j] < arr[minIndex]) {
        minIndex = j
        // Found new minimum
        yield {
          array: arr.slice(),
          currentIndex: i,
          minIndex,
          comparingIndex: j,
          swapIndices: null,
          doneIndices: [...doneIndices],
          stepIndex: stepIndex++,
          description: `New minimum found at index ${j}, value = ${arr[j]}`,
        }
      }
    }

    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
      // Swapping
      yield {
        array: arr.slice(),
        currentIndex: i,
        minIndex,
        comparingIndex: null,
        swapIndices: [i, minIndex],
        doneIndices: [...doneIndices],
        stepIndex: stepIndex++,
        description: `Swapping arr[${i}] and arr[${minIndex}]`,
      }
    }

    // Mark element as sorted
    doneIndices.push(i)
    yield {
      array: arr.slice(),
      currentIndex: i + 1 < n ? i + 1 : null,
      minIndex: i + 1 < n ? i + 1 : null,
      comparingIndex: null,
      swapIndices: null,
      doneIndices: [...doneIndices],
      stepIndex: stepIndex++,
      description: `Element at index ${i} is now in its final sorted position`,
    }
  }

  // Final step: all sorted
  yield {
    array: arr.slice(),
    currentIndex: null,
    minIndex: null,
    comparingIndex: null,
    swapIndices: null,
    doneIndices: [...Array(n).keys()],
    stepIndex: stepIndex++,
    description: 'Array is fully sorted',
  }
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
  description: 'A simple in-place comparison sorting algorithm that divides the input list into a sorted and an unsorted region.',
  code: {
    javascript: `
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`,
    python: `
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr`,
    java: `
public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex != i) {
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
}`
  },
  useCases: [
    'When memory writes are costly as it makes at most O(n) swaps',
    'Small datasets where simplicity is preferred',
    'When the cost of swapping items is high',
    'Educational purposes to demonstrate sorting algorithms'
  ]
}
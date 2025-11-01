// src/algorithms/Sorting/quickSort.js

/**
 * Quick Sort Algorithm
 * 
 * A divide-and-conquer algorithm that picks an element as a pivot and partitions
 * the given array around the picked pivot. The key process is the partition() function,
 * which places the pivot element at its correct position in the sorted array and puts
 * all smaller elements to the left of the pivot and all greater elements to the right.
 * 
 * @param {number[]} arr - Array of numbers to sort
 * @yields {Object} - Step information for visualization
 * @returns {Generator<Object, void, unknown>} - Generator that yields visualization steps
 */
export function* quickSort(arr) {
  const a = [...arr]

  function* partition(low, high) {
    const pivotValue = a[high]
    let i = low
    for (let j = low; j < high; j++) {
      yield {
        array: [...a],
        pivot: high,
        left: low,
        right: high,
        comparing: [j],
        description: `Comparing ${a[j]} with pivot ${pivotValue}`,
      }

      if (a[j] < pivotValue) {
        ;[a[i], a[j]] = [a[j], a[i]]
        yield {
          array: [...a],
          pivot: high,
          left: low,
          right: high,
          swapped: [i, j],
          description: `Swapped ${a[i]} and ${a[j]}`,
        }
        i++
      }
    }

    ;[a[i], a[high]] = [a[high], a[i]] // place pivot correctly
    yield {
      array: [...a],
      pivot: i,
      left: low,
      right: high,
      swapped: [i, high],
      description: `Pivot ${a[i]} placed at index ${i}`,
    }

    return i
  }

  function* quickSortRecursive(low, high) {
    if (low < high) {
      const pi = yield* partition(low, high)
      yield* quickSortRecursive(low, pi - 1)
      yield* quickSortRecursive(pi + 1, high)
    } else if (low === high) {
      // single element is sorted
      yield {
        array: [...a],
        pivot: low,
        left: low,
        right: high,
        description: `Single element ${a[low]} is sorted`,
      }
    }
  }

  yield* quickSortRecursive(0, a.length - 1)

  yield {
    array: [...a],
    pivot: null,
    left: 0,
    right: a.length - 1,
    description: 'Sorting complete!',
  }
}

/**
 * Algorithm information for Quick Sort
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
export const quickSortInfo = {
  name: 'Quick Sort',
  category: 'sorting',
  complexity: {
    time: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    space: 'O(log n)'
  },
  stable: false,
  inPlace: true,
  description: 'A divide-and-conquer algorithm that picks an element as a pivot and partitions the given array around the picked pivot.',
  code: {
    javascript: `
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}`,
    python: `
def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low
    for j in range(low, high):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[high] = arr[high], arr[i]
    return i`,
    java: `
public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

public static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
        }
    }
    int temp = arr[i];
    arr[i] = arr[high];
    arr[high] = temp;
    return i;
}`
  },
  useCases: [
    'General-purpose sorting when average-case performance is important',
    'When memory usage needs to be minimized (in-place sorting)',
    'Cache-efficient algorithms due to good locality of reference',
    'Randomized versions provide good expected performance on any input'
  ]
}
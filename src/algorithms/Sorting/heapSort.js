// src/algorithms/Sorting/heapSort.js

/**
 * Heap Sort Algorithm
 * 
 * A comparison-based sorting algorithm that uses binary heap data structure.
 * It divides its input into a sorted and an unsorted region, and it iteratively
 * shrinks the unsorted region by extracting the largest element and moving that
 * to the sorted region.
 * 
 * @param {number[]} arr - Array of numbers to sort
 * @yields {Object} - Step information for visualization
 * @returns {Generator<Object, void, unknown>} - Generator that yields visualization steps
 */
export function* heapSort(arr) {
  const a = [...arr];
  let n = a.length;
  let localStats = { comparisons: 0, swaps: 0 };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(a, n, i, localStats);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [a[0], a[i]] = [a[i], a[0]];
    localStats.swaps++;
    
    yield {
      array: [...a],
      comparing: [],
      swapping: [0, i],
      heapSize: i,
      description: `Extracting root ${a[i]} to position ${i}`,
      stats: { ...localStats }
    };

    // Call heapify on the reduced heap
    yield* heapify(a, i, 0, localStats);
  }

  yield {
    array: [...a],
    comparing: [],
    swapping: [],
    heapSize: 0,
    description: 'Heap Sort Complete',
    stats: { ...localStats }
  };
}

/**
 * Heapify a subtree rooted at index i
 * 
 * @param {number[]} arr - Array to heapify
 * @param {number} n - Size of heap
 * @param {number} i - Root index
 * @param {Object} localStats - Statistics object
 * @yields {Object} - Step information for visualization
 */
function* heapify(arr, n, i, localStats) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // Compare with left child
  if (left < n) {
    localStats.comparisons++;
    yield {
      array: [...arr],
      comparing: [i, left],
      swapping: [],
      heapSize: n,
      description: `Comparing parent ${arr[i]} with left child ${arr[left]}`,
      stats: { ...localStats }
    };

    if (arr[left] > arr[largest]) {
      largest = left;
    }
  }

  // Compare with right child
  if (right < n) {
    localStats.comparisons++;
    yield {
      array: [...arr],
      comparing: [largest, right],
      swapping: [],
      heapSize: n,
      description: `Comparing parent ${arr[largest]} with right child ${arr[right]}`,
      stats: { ...localStats }
    };

    if (arr[right] > arr[largest]) {
      largest = right;
    }
  }

  // If largest is not root
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    localStats.swaps++;
    
    yield {
      array: [...arr],
      comparing: [],
      swapping: [i, largest],
      heapSize: n,
      description: `Swapping ${arr[i]} and ${arr[largest]} to maintain Max Heap`,
      stats: { ...localStats }
    };

    // Recursively heapify the affected subtree
    yield* heapify(arr, n, largest, localStats);
  }
}

/**
 * Algorithm information for Heap Sort
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
export const heapSortInfo = {
  name: 'Heap Sort',
  category: 'sorting',
  complexity: {
    time: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    space: 'O(1)'
  },
  stable: false,
  inPlace: true,
  description: 'A comparison-based sorting algorithm that uses binary heap data structure. It builds a max heap and repeatedly extracts the maximum element.',
  code: {
    javascript: `
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    python: `
def heap_sort(arr):
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    
    return arr

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    java: `
public static void heapSort(int[] arr) {
    int n = arr.length;
    
    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}

public static void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        heapify(arr, n, largest);
    }
}`
  },
  useCases: [
    'When guaranteed O(n log n) performance is needed',
    'When memory usage needs to be minimized (in-place sorting)',
    'For priority queue implementations',
    'When sorting large datasets where consistent performance matters'
  ]
}
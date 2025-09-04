// src/utils/algorithmConstants.js
export const ALGORITHM_CATEGORIES = {
  SORTING: 'sorting',
  SEARCHING: 'searching',
  GRAPH: 'graph',
  PATHFINDING: 'pathfinding',
  DYNAMIC_PROGRAMMING: 'dp',
};

// Registry keys are UPPERCASE “constants”; each entry has a lowercase `id`
export const ALGORITHMS = {
  BUBBLESORT: {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/bubbleSort').then(m => m.bubbleSort),
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    description:
      'Repeatedly compares adjacent elements and swaps them if out of order.',
  },

  INSERTIONSORT: {
    id: 'insertionSort',
    name: 'Insertion Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/insertionSort').then(m => m.insertionSort),
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    description:
      'Builds the final sorted array one item at a time by inserting into place.',
  },

  MERGESORT: {
    id: 'mergeSort',
    name: 'Merge Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/mergeSort').then(m => m.mergeSort),
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
    },
    description:
      'Divides the array into halves, sorts them and merges back together.',
  },

  QUICKSORT: {
    id: 'quickSort',
    name: 'Quick Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/quickSort').then(m => m.quickSort),
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      space: 'O(log n)',
    },
    description:
      'Picks a pivot and partitions the array around it, then sorts subarrays.',
  },

  SELECTIONSORT: {
    id: 'selectionSort',
    name: 'Selection Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/selectionSort').then(m => m.selectionSort),
    complexity: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    description:
      'Repeatedly selects the smallest element and moves it to the sorted sublist.',
  },

  LINEARSEARCH: {
    id: 'linearSearch',
    name: 'Linear Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    importFn: () => import('../algorithms/Searching/linearSearch').then(m => m.linearSearch),
    complexity: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
    },
    description:
      'Checks each element sequentially until a match is found.',
  },

  BINARYSEARCH: {
    id: 'binarySearch',
    name: 'Binary Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    importFn: () => import('../algorithms/Searching/binarySearch').then(m => m.binarySearch),
    complexity: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
    },
    description:
      'Finds a target in a sorted array by repeatedly halving the search space.',
  },
};

// Helper: find by lowercase id (e.g., "bubbleSort")
export const getAlgorithmInfoById = (id) =>
  Object.values(ALGORITHMS).find((a) => a.id === id) || null;

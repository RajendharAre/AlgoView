// src/utils/algorithmConstants.js

// Import algorithm info objects
import { bubbleSortInfo } from '../algorithms/Sorting/bubbleSort'
import { insertionSortInfo } from '../algorithms/Sorting/insertionSort'
import { mergeSortInfo } from '../algorithms/Sorting/mergeSort'
import { quickSortInfo } from '../algorithms/Sorting/quickSort'
import { selectionSortInfo } from '../algorithms/Sorting/selectionSort'
import { linearSearchInfo } from '../algorithms/Searching/linearSearch'
import { binarySearchInfo } from '../algorithms/Searching/binarySearch'
import { bfsInfo } from '../algorithms/Graph/bfs'
import { dfsInfo } from '../algorithms/Graph/dfs'
import { dijkstraInfo } from '../algorithms/Graph/dijkstra'
import { heapSortInfo } from '../algorithms/Sorting/heapSort'
import { bucketSortInfo } from '../algorithms/Sorting/bucketSort'

export const ALGORITHM_CATEGORIES = {
  SORTING: 'sorting',
  SEARCHING: 'searching',
  GRAPH: 'graph',
  PATHFINDING: 'pathfinding',
  DYNAMIC_PROGRAMMING: 'dp',
}

// Registry: camelCase keys, each with consistent metadata
export const ALGORITHMS = {
  bubbleSort: {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/bubbleSort').then(m => m.bubbleSort),
    ...bubbleSortInfo
  },

  insertionSort: {
    id: 'insertionSort',
    name: 'Insertion Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/insertionSort').then(m => m.insertionSort),
    ...insertionSortInfo
  },

  mergeSort: {
    id: 'mergeSort',
    name: 'Merge Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/mergeSort').then(m => m.mergeSort),
    ...mergeSortInfo
  },

  quickSort: {
    id: 'quickSort',
    name: 'Quick Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/quickSort').then(m => m.quickSort),
    ...quickSortInfo
  },

  selectionSort: {
    id: 'selectionSort',
    name: 'Selection Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/selectionSort').then(m => m.selectionSort),
    ...selectionSortInfo
  },

  linearSearch: {
    id: 'linearSearch',
    name: 'Linear Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    importFn: () => import('../algorithms/Searching/linearSearch').then(m => m.linearSearch),
    ...linearSearchInfo
  },

  binarySearch: {
    id: 'binarySearch',
    name: 'Binary Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    importFn: () => import('../algorithms/Searching/binarySearch').then(m => m.binarySearch),
    ...binarySearchInfo
  },

  // Graph Algorithms
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../algorithms/Graph/bfs').then(m => m.bfs),
    ...bfsInfo
  },

  dfs: {
    id: 'dfs',
    name: 'Depth-First Search',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../algorithms/Graph/dfs').then(m => m.dfs),
    ...dfsInfo
  },

  dijkstra: {
    id: 'dijkstra',
    name: 'Dijkstra\'s Algorithm',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../algorithms/Graph/dijkstra').then(m => m.dijkstra),
    ...dijkstraInfo
  },

  heapSort: {
    id: 'heapSort',
    name: 'Heap Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/heapSort').then(m => m.heapSort),
    ...heapSortInfo
  },

  bucketSort: {
    id: 'bucketSort',
    name: 'Bucket Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/bucketSort').then(m => m.bucketSort),
    ...bucketSortInfo
  },
}

// Helper: find by lowercase id (e.g., "bubbleSort")
export const getAlgorithmInfoById = id => {
  console.log('=== DEBUGGING ALGORITHM LOOKUP ===');
  console.log('Looking up algorithm with ID:', id);
  console.log('Available algorithms:', Object.keys(ALGORITHMS));
  console.log('Type of id:', typeof id);
  console.log('Algorithm registry keys:', Object.keys(ALGORITHMS));
  
  // Check if the ID exists exactly as provided
  if (ALGORITHMS.hasOwnProperty(id)) {
    console.log('Exact match found for:', id);
    const result = ALGORITHMS[id];
    console.log('Returning algorithm info:', result);
    return result;
  }
  
  // If no exact match, let's check for possible issues
  console.log('No exact match found. Checking for possible issues...');
  
  // Check if it's undefined or null
  if (id === undefined || id === null) {
    console.log('ID is undefined or null');
    return null;
  }
  
  // Check if it's an empty string
  if (id === '') {
    console.log('ID is an empty string');
    return null;
  }
  
  // Check if there's a case mismatch
  const lowerId = id.toLowerCase();
  for (const key in ALGORITHMS) {
    if (key.toLowerCase() === lowerId) {
      console.log('Found case-insensitive match:', key);
      return ALGORITHMS[key];
    }
  }
  
  console.log('No algorithm found for ID:', id);
  return null;
}

// Extra helper: get all algorithms by category
export const getAlgorithmsByCategory = category =>
  Object.values(ALGORITHMS).filter(a => a.category === category)
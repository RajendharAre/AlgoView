// src/utils/algorithmConstants.js

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
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    description: 'Repeatedly compares adjacent elements and swaps them if out of order.',
  },

  insertionSort: {
    id: 'insertionSort',
    name: 'Insertion Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/insertionSort').then(m => m.insertionSort),
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    description: 'Builds the final sorted array one item at a time by inserting into place.',
  },

  mergeSort: {
    id: 'mergeSort',
    name: 'Merge Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/mergeSort').then(m => m.mergeSort),
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
    },
    description: 'Divides the array into halves, sorts them and merges back together.',
  },

  quickSort: {
    id: 'quickSort',
    name: 'Quick Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/quickSort').then(m => m.quickSort),
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      space: 'O(log n)',
    },
    description: 'Picks a pivot and partitions the array around it, then sorts subarrays.',
  },

  selectionSort: {
    id: 'selectionSort',
    name: 'Selection Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    importFn: () => import('../algorithms/Sorting/selectionSort').then(m => m.selectionSort),
    complexity: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    description: 'Repeatedly selects the smallest element and moves it to the sorted sublist.',
  },

  linearSearch: {
    id: 'linearSearch',
    name: 'Linear Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    importFn: () => import('../algorithms/Searching/linearSearch').then(m => m.linearSearch),
    complexity: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
    },
    description: 'Checks each element sequentially until a match is found.',
  },

  binarySearch: {
    id: 'binarySearch',
    name: 'Binary Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    importFn: () => import('../algorithms/Searching/binarySearch').then(m => m.binarySearch),
    complexity: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
    },
    description: 'Finds a target in a sorted array by repeatedly halving the search space.',
  },

  // Graph Algorithms
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../algorithms/Graph/bfs').then(m => m.bfs),
    complexity: {
      time: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
      space: 'O(V)',
    },
    description: 'Level-order traversal used to find shortest unweighted paths.',
  },

  dfs: {
    id: 'dfs',
    name: 'Depth-First Search',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../algorithms/Graph/dfs').then(m => m.dfs),
    complexity: {
      time: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
      space: 'O(V)',
    },
    description: 'Depth-first traversal useful for connectivity, ordering, cycles.',
  },

  dijkstra: {
    id: 'dijkstra',
    name: 'Dijkstra (shortest paths)',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../algorithms/Graph/dijkstra').then(m => m.dijkstra),
    complexity: {
      time: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)' },
      space: 'O(V)',
    },
    description: 'Shortest path algorithm for weighted graphs with non-negative edges.',
  },
}

// Helper: find by lowercase id (e.g., "bubbleSort")
// Also supports kebab-case (e.g., "bubble-sort") by converting to camelCase
export const getAlgorithmInfoById = id => {
  if (!id) return null
  
  // If already in camelCase, try direct lookup
  if (ALGORITHMS[id]) return ALGORITHMS[id]
  
  // Convert kebab-case to camelCase
  const camelCaseId = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  
  // Try direct lookup with camelCase
  if (ALGORITHMS[camelCaseId]) return ALGORITHMS[camelCaseId]
  
  // Try lowercase lookup as fallback
  const lowerId = id.toLowerCase()
  if (ALGORITHMS[lowerId]) return ALGORITHMS[lowerId]
  
  // No match found
  return null
}

// Extra helper: get all algorithms by category
export const getAlgorithmsByCategory = category =>
  Object.values(ALGORITHMS).filter(a => a.category === category)
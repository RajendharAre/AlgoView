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
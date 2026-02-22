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
import { bellmanFordInfo } from '../algorithms/Graph/bellmanFord'
import { floydWarshallInfo } from '../algorithms/Graph/floydWarshall'
import { astarInfo } from '../pages/DSA/Visualization/Searching/utils/astarInfo'
import { kruskalInfo } from '../pages/DSA/Visualization/Graph/utils/kruskalInfo'
import { primInfo } from '../pages/DSA/Visualization/Graph/utils/primInfo'
import topSortInfo from '../pages/DSA/Visualization/Graph/topSortInfo'
import kosarajuInfo from '../pages/DSA/Visualization/Graph/kosarajuInfo'
import graphColoringInfo from '../pages/DSA/Visualization/Graph/graphColoringInfo'
import pageRankInfo from '../pages/DSA/Visualization/Graph/pageRankInfo'
import climbingStairsInfo from '../pages/DSA/Visualization/DP/climbingStairsInfo'

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

  aStar: {
    id: 'aStar',
    name: 'A* Pathfinding',
    category: ALGORITHM_CATEGORIES.PATHFINDING,
    simpleVisualization: true,
    ...astarInfo
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

  bellmanFord: {
    id: 'bellmanFord',
    name: 'Bellman-Ford Algorithm',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../algorithms/Graph/bellmanFord').then(m => m.bellmanFord),
    ...bellmanFordInfo
  },

  floydWarshall: {
    id: 'floydWarshall',
    name: 'Floyd-Warshall Algorithm',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../algorithms/Graph/floydWarshall').then(m => m.floydWarshall),
    ...floydWarshallInfo
  },

  graphColoring: {
    id: 'graphColoring',
    name: 'Graph Coloring',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../pages/DSA/Visualization/Graph/GraphColoring').then(m => m.default),
    ...graphColoringInfo
  },

  kruskal: {
    id: 'kruskal',
    name: 'Kruskal\'s Algorithm',
    category: ALGORITHM_CATEGORIES.GRAPH,
    simpleVisualization: true,
    ...kruskalInfo
  },

  prim: {
    id: 'prim',
    name: 'Prim\'s Algorithm',
    category: ALGORITHM_CATEGORIES.GRAPH,
    simpleVisualization: true,
    ...primInfo
  },

  topologicalSort: {
    id: 'topologicalSort',
    name: 'Topological Sort',
    category: ALGORITHM_CATEGORIES.GRAPH,
    simpleVisualization: true,
    ...topSortInfo
  },

  kosaraju: {
    id: 'kosaraju',
    name: 'Kosaraju\'s Algorithm',
    category: ALGORITHM_CATEGORIES.GRAPH,
    simpleVisualization: true,
    ...kosarajuInfo
  },

  pagerank: {
    id: 'pagerank',
    name: 'PageRank',
    category: ALGORITHM_CATEGORIES.GRAPH,
    importFn: () => import('../pages/DSA/Visualization/Graph/PageRank').then(m => m.default),
    ...pageRankInfo
  },

  climbingStairs: {
    id: 'climbingStairs',
    name: 'Climbing Stairs',
    category: ALGORITHM_CATEGORIES.DYNAMIC_PROGRAMMING,
    importFn: () => import('../pages/DSA/Visualization/DP/ClimbingStairs').then(m => m.default),
    ...climbingStairsInfo
  },
}

// Helper: find by lowercase id (e.g., "bubbleSort")
export const getAlgorithmInfoById = id => {
  // Check if the ID exists exactly as provided
  if (ALGORITHMS.hasOwnProperty(id)) {
    return ALGORITHMS[id];
  }
  
  // If no exact match, let's check for possible issues
  // Check if it's undefined or null
  if (id === undefined || id === null) {
    return null;
  }
  
  // Check if it's an empty string
  if (id === '') {
    return null;
  }
  
  // Check if there's a case mismatch
  const lowerId = id.toLowerCase();
  for (const key in ALGORITHMS) {
    if (key.toLowerCase() === lowerId) {
      return ALGORITHMS[key];
    }
  }
  
  return null;
}

// Extra helper: get all algorithms by category
export const getAlgorithmsByCategory = category =>
  Object.values(ALGORITHMS).filter(a => a.category === category)
// src/utils/algorithmConstants.js
export const ALGORITHM_CATEGORIES = {
  SORTING: 'sorting',
  SEARCHING: 'searching',
  GRAPH: 'graph',
  PATHFINDING: 'pathfinding',
  DYNAMIC_PROGRAMMING: 'dp'
};

export const ALGORITHMS = {
  // Sorting Algorithms
  BUBBLE_SORT: {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    complexity: {
      time: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      space: 'O(1)'
    },
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
  },

  QUICK_SORT: {
    id: 'quickSort',
    name: 'Quick Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      space: 'O(log n)'
    },
    description: 'Picks an element as pivot and partitions the array around the pivot.'
  },

  // Searching Algorithms
  LINEAR_SEARCH: {
    id: 'linearSearch',
    name: 'Linear Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    complexity: {
      time: {
        best: 'O(1)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      space: 'O(1)'
    },
    description: 'Sequentially checks each element of the list until a match is found.'
  },

  BINARY_SEARCH: {
    id: 'binarySearch',
    name: 'Binary Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    complexity: {
      time: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)'
      },
      space: 'O(1)'
    },
    description: 'Finds the position of a target value within a sorted array.'
  }
};
// src/algorithms/Searching/binarySearch.js
export function* binarySearch(arr, target) {
  let a = [...arr].sort((x, y) => x - y) // Ensure array is sorted
  let low = 0
  let high = a.length - 1

  while (low <= high) {
    let mid = Math.floor((low + high) / 2)

    yield {
      array: [...a],
      low,
      mid,
      high,
      description: `Checking middle element ${a[mid]}`,
    }

    if (a[mid] === target) {
      yield {
        array: [...a],
        low,
        mid,
        high,
        found: true,
        description: `Element ${target} found at index ${mid}`,
      }
      return
    } else if (a[mid] < target) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  // Target not found
  yield {
    array: [...a],
    low: -1,
    mid: -1,
    high: -1,
    found: false,
    description: `Element ${target} not found`,
  }
}

/**
 * Algorithm information for Binary Search
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
export const binarySearchInfo = {
  name: 'Binary Search',
  category: 'searching',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    space: 'O(1)'
  },
  stable: true,
  inPlace: true,
  description: 'An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
  code: {
    javascript: `
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    
    if (arr[mid] === target) {
      return mid; // Element found
    } else if (arr[mid] < target) {
      low = mid + 1; // Search right half
    } else {
      high = mid - 1; // Search left half
    }
  }
  
  return -1; // Element not found
}`,
    python: `
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        
        if arr[mid] == target:
            return mid  # Element found
        elif arr[mid] < target:
            low = mid + 1  # Search right half
        else:
            high = mid - 1  # Search left half
    
    return -1  # Element not found`,
    java: `
public static int binarySearch(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    
    while (low <= high) {
        int mid = (low + high) / 2;
        
        if (arr[mid] == target) {
            return mid; // Element found
        } else if (arr[mid] < target) {
            low = mid + 1; // Search right half
        } else {
            high = mid - 1; // Search left half
        }
    }
    
    return -1; // Element not found
}`
  },
  useCases: [
    'Searching in large sorted datasets',
    'Finding elements in sorted arrays or lists',
    'Implementing dictionary or phonebook lookups',
    'When data is already sorted or can be sorted efficiently'
  ]
}
// src/algorithms/Searching/linearSearch.js
export function* linearSearch(arr, target) {
  const a = [...arr]

  for (let i = 0; i < a.length; i++) {
    // Yield the step where current element is being checked
    yield {
      array: [...a],
      currentIndex: i,
      foundIndex: null,
      description: `Checking element ${a[i]} at index ${i}`,
    }

    if (a[i] === target) {
      // Yield the "found" step
      yield {
        array: [...a],
        currentIndex: i,
        foundIndex: i,
        description: `Element ${target} found at index ${i}`,
      }
      return // ✅ Stop here, don’t keep searching
    }
  }

  // If not found after full loop
  yield {
    array: [...a],
    currentIndex: -1,
    foundIndex: -1,
    description: `Element ${target} not found in array`,
  }
}

/**
 * Algorithm information for Linear Search
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
export const linearSearchInfo = {
  name: 'Linear Search',
  category: 'searching',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)'
    },
    space: 'O(1)'
  },
  stable: true,
  inPlace: true,
  description: 'A simple search algorithm that checks each element in a list sequentially until a match is found or the whole list has been searched.',
  code: {
    javascript: `
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Return index of found element
    }
  }
  return -1; // Element not found
}`,
    python: `
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Return index of found element
    return -1  # Element not found`,
    java: `
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i; // Return index of found element
        }
    }
    return -1; // Element not found
}`
  },
  useCases: [
    'Small datasets where simplicity is preferred',
    'Unsorted data where other search algorithms cannot be used',
    'When the cost of sorting exceeds the cost of sequential search',
    'Educational purposes to demonstrate basic search concepts'
  ]
}
/**
 * Binary Search Algorithm Implementation with Visualization Steps
 */

// Generator function for binary search visualization steps
export function* binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;

  // Initial state
  yield {
    array: [...arr],
    low: left,
    high: right,
    mid: -1,
    foundIndex: -1,
    target: target,
    comparisons: comparisons,
    currentStep: "Starting Binary Search",
    searchFailed: false
  };

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    // Show mid calculation
    yield {
      array: [...arr],
      low: left,
      high: right,
      mid: mid,
      foundIndex: -1,
      target: target,
      comparisons: comparisons,
      currentStep: `Mid index: ${mid}. Comparing ${arr[mid]} with ${target}.`,
      searchFailed: false
    };

    if (arr[mid] === target) {
      // Target found
      yield {
        array: [...arr],
        low: -1,
        high: -1,
        mid: -1,
        foundIndex: mid,
        target: target,
        comparisons: comparisons,
        currentStep: `Target ${target} found at index ${mid}.`,
        searchFailed: false
      };
      return;
    }

    if (arr[mid] < target) {
      // Move left pointer
      yield {
        array: [...arr],
        low: mid + 1,
        high: right,
        mid: -1,
        foundIndex: -1,
        target: target,
        comparisons: comparisons,
        currentStep: `${arr[mid]} < ${target}: Moving Low pointer to ${mid + 1}`,
        searchFailed: false
      };
      left = mid + 1;
    } else {
      // Move right pointer
      yield {
        array: [...arr],
        low: left,
        high: mid - 1,
        mid: -1,
        foundIndex: -1,
        target: target,
        comparisons: comparisons,
        currentStep: `${arr[mid]} > ${target}: Moving High pointer to ${mid - 1}`,
        searchFailed: false
      };
      right = mid - 1;
    }
  }

  // Target not found
  yield {
    array: [...arr],
    low: -1,
    high: -1,
    mid: -1,
    foundIndex: -1,
    target: target,
    comparisons: comparisons,
    currentStep: `Target ${target} not found in array.`,
    searchFailed: true
  };
}

// Algorithm info object
export const binarySearchInfo = {
  name: 'Binary Search',
  category: 'Searching',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    space: 'O(1)'
  },
  description: 'Binary search is an efficient algorithm for finding an item in a sorted array.',
  explanation: 'Binary search works by repeatedly dividing in half the portion of the array that could contain the item, until you\'ve narrowed down the possible locations to just one.',
  steps: [
    'Array must be sorted',
    'Compare target with middle element',
    'If equal, return index',
    'If target is smaller, search left half',
    'If target is larger, search right half',
    'Repeat until found or search space is empty'
  ],
  generator: binarySearch
};
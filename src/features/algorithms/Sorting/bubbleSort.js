export function* bubbleSort(arr) {
  let n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Yield current state for visualization
      yield {
        array: [...arr],
        compared: [j, j + 1],
        swapped: false,
        description: `Comparing ${arr[j]} and ${arr[j + 1]}`
      };

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        // Yield swapped state
        yield {
          array: [...arr],
          compared: [j, j + 1],
          swapped: true,
          description: `Swapped ${arr[j]} and ${arr[j + 1]}`
        };
      }
    }
  }

  yield {
    array: [...arr],
    compared: [],
    swapped: false,
    description: "Sorting complete!"
  };
}

// Complexity analysis
export const bubbleSortInfo = {
  timeComplexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)"
  },
  spaceComplexity: "O(1)",
  stable: true,
  inPlace: true
};
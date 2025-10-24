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

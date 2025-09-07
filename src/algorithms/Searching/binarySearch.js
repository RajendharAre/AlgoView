// src/algorithms/Searching/binarySearch.js
export function* binarySearch(arr, target) {
  let a = [...arr].sort((x, y) => x - y); // Ensure array is sorted
  let low = 0;
  let high = a.length - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    yield {
      array: [...a],
      low,
      mid,
      high,
      description: `Checking middle element ${a[mid]}`,
    };

    if (a[mid] === target) {
      yield {
        array: [...a],
        low,
        mid,
        high,
        found: true,
        description: `Element ${target} found at index ${mid}`,
      };
      return;
    } else if (a[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
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
  };
}

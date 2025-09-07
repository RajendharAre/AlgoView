// src/algorithms/Searching/binarySearch.js
export function* binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  let foundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      foundIndex = mid;
    }

    yield { low, mid, high, foundIndex };

    if (arr[mid] === target) break;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }

  // Continue yielding to animate remaining low/high checks
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    yield { low, mid, high, foundIndex };
    if (low === high) break;
  }
}

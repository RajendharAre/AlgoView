// src/algorithms/Sorting/mergeSort.js

/**
 * Merge Sort Algorithm
 * 
 * A divide and conquer algorithm that divides the input array into two halves,
 * calls itself for the two halves, and then merges the two sorted halves.
 * 
 * @param {number[]} arr - Array of numbers to sort
 * @yields {Object} - Step information for visualization
 * @returns {Generator<Object, void, unknown>} - Generator that yields visualization steps
 */
export function* mergeSort(arr) {
  const a = [...arr]

  function* _mergeSort(l, r) {
    if (l >= r) {
      yield {
        array: [...a],
        range: [l, r],
        phase: 'base',
        description: `Base case at [${l}, ${r}]`,
      }
      return
    }

    const m = Math.floor((l + r) / 2)

    yield {
      array: [...a],
      range: [l, r],
      mid: m,
      phase: 'split',
      description: `Split [${l}, ${r}] at ${m}`,
    }
    yield* _mergeSort(l, m)
    yield* _mergeSort(m + 1, r)

    // Merge
    const left = a.slice(l, m + 1)
    const right = a.slice(m + 1, r + 1)
    let i = 0,
      j = 0,
      k = l

    while (i < left.length && j < right.length) {
      yield {
        array: [...a],
        range: [l, r],
        leftWindow: [l, m],
        rightWindow: [m + 1, r],
        comparing: [k, left[i], right[j]],
        phase: 'merge-compare',
        description: `Compare ${left[i]} and ${right[j]}`,
      }

      if (left[i] <= right[j]) {
        a[k++] = left[i++]
      } else {
        a[k++] = right[j++]
      }

      yield {
        array: [...a],
        range: [l, r],
        mergedIndex: k - 1,
        phase: 'merge-place',
        description: `Place at index ${k - 1}`,
      }
    }

    while (i < left.length) {
      a[k++] = left[i++]
      yield {
        array: [...a],
        range: [l, r],
        mergedIndex: k - 1,
        phase: 'merge-place',
        description: `Drain left into index ${k - 1}`,
      }
    }

    while (j < right.length) {
      a[k++] = right[j++]
      yield {
        array: [...a],
        range: [l, r],
        mergedIndex: k - 1,
        phase: 'merge-place',
        description: `Drain right into index ${k - 1}`,
      }
    }

    yield {
      array: [...a],
      range: [l, r],
      phase: 'merged',
      description: `Merged segment [${l}, ${r}]`,
    }
  }

  yield* _mergeSort(0, a.length - 1)

  yield { array: [...a], phase: 'done', description: 'Sorting complete!' }
}

/**
 * Algorithm information for Merge Sort
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
export const mergeSortInfo = {
  name: 'Merge Sort',
  category: 'sorting',
  complexity: {
    time: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    space: 'O(n)'
  },
  stable: true,
  inPlace: false,
  description: 'A divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
  code: {
    javascript: `
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    python: `
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    java: `
public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    
    int mid = arr.length / 2;
    int[] left = Arrays.copyOfRange(arr, 0, mid);
    int[] right = Arrays.copyOfRange(arr, mid, arr.length);
    
    return merge(mergeSort(left), mergeSort(right));
}

public static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result[k++] = left[i++];
        } else {
            result[k++] = right[j++];
        }
    }
    
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    
    return result;
}`
  },
  useCases: [
    'Large datasets where consistent O(n log n) performance is needed',
    'When stable sorting is required',
    'External sorting when data doesn\'t fit in memory',
    'When predictable performance is more important than memory usage'
  ]
}
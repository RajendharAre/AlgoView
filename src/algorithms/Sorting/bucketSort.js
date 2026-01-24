// src/algorithms/Sorting/bucketSort.js

/**
 * Bucket Sort Algorithm
 * 
 * A distribution sorting algorithm that works by distributing elements into buckets
 * and then sorting each bucket individually. It's particularly effective when the
 * input is uniformly distributed over a range.
 * 
 * @param {number[]} arr - Array of numbers to sort (values should be in range 0-99)
 * @yields {Object} - Step information for visualization
 * @returns {Generator<Object, void, unknown>} - Generator that yields visualization steps
 */
export function* bucketSort(arr) {
  const a = [...arr];
  const n = a.length;
  let localStats = { scattered: 0, gathered: 0 };
  
  // Create 5 buckets for ranges 0-19, 20-39, 40-59, 60-79, 80-99
  const buckets = [[], [], [], [], []];
  
  // Phase 1: Scatter elements into buckets
  for (let i = 0; i < n; i++) {
    const val = a[i];
    const bucketIndex = Math.floor(val / 20);
    
    yield {
      array: [...a],
      buckets: buckets.map(b => [...b]),
      activeElementIdx: i,
      currentBucketIdx: bucketIndex,
      phase: 'SCATTER',
      description: `Scattering ${val}: Fits in range ${bucketIndex * 20}-${bucketIndex * 20 + 19}`,
      stats: { ...localStats }
    };
    
    // Move element to bucket
    buckets[bucketIndex].push(val);
    localStats.scattered++;
    
    // Mark element as moved in array
    a[i] = null;
    
    yield {
      array: [...a],
      buckets: buckets.map(b => [...b]),
      activeElementIdx: -1,
      currentBucketIdx: bucketIndex,
      phase: 'SCATTER',
      description: `Added ${val} to bucket ${bucketIndex}`,
      stats: { ...localStats }
    };
  }
  
  // Phase 2: Sort each bucket
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i].length === 0) continue;
    
    yield {
      array: [...a],
      buckets: buckets.map(b => [...b]),
      currentBucketIdx: i,
      phase: 'SORT',
      description: `Sorting Bucket ${i} (${i * 20}-${i * 20 + 19})`,
      stats: { ...localStats }
    };
    
    // Sort bucket using insertion sort (good for small arrays)
    buckets[i].sort((x, y) => x - y);
    
    yield {
      array: [...a],
      buckets: buckets.map(b => [...b]),
      currentBucketIdx: i,
      phase: 'SORT',
      description: `Sorted Bucket ${i}`,
      stats: { ...localStats }
    };
  }
  
  // Phase 3: Gather elements back into array
  let k = 0;
  for (let i = 0; i < buckets.length; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      const val = buckets[i][j];
      
      yield {
        array: [...a],
        buckets: buckets.map((b, idx) => 
          idx === i ? [...b.slice(0, j), "✓", ...b.slice(j + 1)] : [...b]
        ),
        currentBucketIdx: i,
        phase: 'GATHER',
        description: `Gathering ${val} from Bucket ${i}`,
        stats: { ...localStats }
      };
      
      a[k] = val;
      localStats.gathered++;
      k++;
      
      yield {
        array: [...a],
        buckets: buckets.map((b, idx) => 
          idx === i ? [...b.slice(0, j + 1), ...b.slice(j + 1)] : [...b]
        ),
        currentBucketIdx: i,
        phase: 'GATHER',
        description: `Placed ${val} at position ${k - 1}`,
        stats: { ...localStats }
      };
    }
  }
  
  yield {
    array: [...a],
    buckets: buckets.map(b => [...b]),
    activeElementIdx: -1,
    currentBucketIdx: -1,
    phase: 'COMPLETE',
    description: 'Bucket Sort Complete',
    stats: { ...localStats }
  };
}

/**
 * Algorithm information for Bucket Sort
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
export const bucketSortInfo = {
  name: 'Bucket Sort',
  category: 'sorting',
  complexity: {
    time: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n²)'
    },
    space: 'O(n + k)'
  },
  stable: true,
  inPlace: false,
  description: 'A distribution sorting algorithm that works by distributing elements into buckets and sorting each bucket individually. Works best when input is uniformly distributed.',
  code: {
    javascript: `
function bucketSort(arr) {
  const n = arr.length;
  const buckets = Array(5).fill().map(() => []);
  
  // Scatter phase
  for (let i = 0; i < n; i++) {
    const bucketIndex = Math.floor(arr[i] / 20);
    buckets[bucketIndex].push(arr[i]);
  }
  
  // Sort each bucket
  for (let i = 0; i < buckets.length; i++) {
    buckets[i].sort((a, b) => a - b);
  }
  
  // Gather phase
  let k = 0;
  for (let i = 0; i < buckets.length; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      arr[k++] = buckets[i][j];
    }
  }
  
  return arr;
}`,
    python: `
def bucket_sort(arr):
    n = len(arr)
    buckets = [[] for _ in range(5)]
    
    # Scatter phase
    for num in arr:
        bucket_index = num // 20
        buckets[bucket_index].append(num)
    
    # Sort each bucket
    for bucket in buckets:
        bucket.sort()
    
    # Gather phase
    result = []
    for bucket in buckets:
        result.extend(bucket)
    
    return result`,
    java: `
public static void bucketSort(int[] arr) {
    int n = arr.length;
    List<Integer>[] buckets = new ArrayList[5];
    
    // Initialize buckets
    for (int i = 0; i < 5; i++) {
        buckets[i] = new ArrayList<>();
    }
    
    // Scatter phase
    for (int i = 0; i < n; i++) {
        int bucketIndex = arr[i] / 20;
        buckets[bucketIndex].add(arr[i]);
    }
    
    // Sort each bucket
    for (int i = 0; i < 5; i++) {
        Collections.sort(buckets[i]);
    }
    
    // Gather phase
    int k = 0;
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < buckets[i].size(); j++) {
            arr[k++] = buckets[i].get(j);
        }
    }
}`
  },
  useCases: [
    'When input is uniformly distributed over a range',
    'For floating point numbers in a known range',
    'When additional memory usage is acceptable',
    'For sorting data that fits naturally into buckets'
  ]
}
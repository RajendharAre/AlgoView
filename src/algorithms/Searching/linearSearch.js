// src/algorithms/searching/linearSearch.js
export function* linearSearch(array, target) {
  const arr = [...array];
  
  for (let i = 0; i < arr.length; i++) {
    yield {
      array: [...arr],
      highlights: [
        { index: i, color: 'checking' }
      ],
      description: `Checking element at index ${i}: ${arr[i]}`,
      step: `Checking index ${i}`,
      found: arr[i] === target ? i : -1
    };

    if (arr[i] === target) {
      yield {
        array: [...arr],
        highlights: [
          { index: i, color: 'found' }
        ],
        description: `Found ${target} at index ${i}!`,
        step: 'Target found',
        found: i
      };
      return;
    }
  }

  yield {
    array: [...arr],
    highlights: [],
    description: `${target} not found in the array`,
    step: 'Not found',
    found: -1
  };
}
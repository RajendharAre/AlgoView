export function* selectionSort(inputArray) {
  const arr = inputArray.slice()
  const n = arr.length
  const doneIndices = []
  let stepIndex = 0

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    // Start outer loop
    yield {
      array: arr.slice(),
      currentIndex: i,
      minIndex,
      comparingIndex: null,
      swapIndices: null,
      doneIndices: [...doneIndices],
      stepIndex: stepIndex++,
      description: `Starting new outer loop at index ${i}, initial minIndex = ${minIndex}`,
    }

    for (let j = i + 1; j < n; j++) {
      // Comparing
      yield {
        array: arr.slice(),
        currentIndex: i,
        minIndex,
        comparingIndex: j,
        swapIndices: null,
        doneIndices: [...doneIndices],
        stepIndex: stepIndex++,
        description: `Comparing arr[${j}] = ${arr[j]} with current min arr[${minIndex}] = ${arr[minIndex]}`,
      }

      if (arr[j] < arr[minIndex]) {
        minIndex = j
        // Found new minimum
        yield {
          array: arr.slice(),
          currentIndex: i,
          minIndex,
          comparingIndex: j,
          swapIndices: null,
          doneIndices: [...doneIndices],
          stepIndex: stepIndex++,
          description: `New minimum found at index ${j}, value = ${arr[j]}`,
        }
      }
    }

    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
      // Swapping
      yield {
        array: arr.slice(),
        currentIndex: i,
        minIndex,
        comparingIndex: null,
        swapIndices: [i, minIndex],
        doneIndices: [...doneIndices],
        stepIndex: stepIndex++,
        description: `Swapping arr[${i}] and arr[${minIndex}]`,
      }
    }

    // Mark element as sorted
    doneIndices.push(i)
    yield {
      array: arr.slice(),
      currentIndex: i + 1 < n ? i + 1 : null,
      minIndex: i + 1 < n ? i + 1 : null,
      comparingIndex: null,
      swapIndices: null,
      doneIndices: [...doneIndices],
      stepIndex: stepIndex++,
      description: `Element at index ${i} is now in its final sorted position`,
    }
  }

  // Final step: all sorted
  yield {
    array: arr.slice(),
    currentIndex: null,
    minIndex: null,
    comparingIndex: null,
    swapIndices: null,
    doneIndices: [...Array(n).keys()],
    stepIndex: stepIndex++,
    description: 'Array is fully sorted',
  }
}

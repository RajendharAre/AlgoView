## Algorithms (Generators)

All algorithms are ES generator functions that `yield` step objects for visualization. Consume them directly or via `useAlgorithm.executeAlgorithm`.

### Sorting

#### `bubbleSort(arr: number[]): Generator`
- Yields: `{ array, compared: [i,j], swapped: boolean, doneIndex, description }`
- Import: `import { bubbleSort } from 'src/algorithms/Sorting/bubbleSort'`

#### `insertionSort(arr: number[]): Generator`
- Yields: `{ array, keyIndex, comparingIndex, shiftingIndex, placedIndex, doneIndices, description }`
- Import: `import { insertionSort } from 'src/algorithms/Sorting/insertionSort'`

#### `mergeSort(arr: number[]): Generator`
- Yields: `{ array, range, leftWindow?, rightWindow?, mergedIndex?, phase, description }`
- Import: `import { mergeSort } from 'src/algorithms/Sorting/mergeSort'`

#### `quickSort(arr: number[]): Generator`
- Yields: `{ array, pivot, left, right, comparing?, swapped?, description }`
- Import: `import { quickSort } from 'src/algorithms/Sorting/quickSort'`

#### `selectionSort(arr: number[]): Generator`
- Yields: `{ array, currentIndex, minIndex, comparingIndex, swapIndices?, doneIndices, stepIndex, description }`
- Import: `import { selectionSort } from 'src/algorithms/Sorting/selectionSort'`

### Searching

#### `linearSearch(arr: number[], target: number): Generator`
- Yields: `{ array, currentIndex, foundIndex, description }`
- Import: `import { linearSearch } from 'src/algorithms/Searching/linearSearch'`

#### `binarySearch(arr: number[], target: number): Generator`
- Note: sorts a copy of the input internally
- Yields: `{ array, low, mid, high, found, description }`
- Import: `import { binarySearch } from 'src/algorithms/Searching/binarySearch'`

### Graph

Graph input shape: `{ nodes: {id,label?,x,y}[], edges: {from,to,weight?}[] }`

#### `bfs(graph, startId): Generator`
- Yields: `{ nodes, edges, current, visiting, frontier, doneNodes, description, stepIndex }`
- Import: `import { bfs } from 'src/algorithms/Graph/bfs'`

#### `dfs(graph, startId): Generator`
- Yields: `{ nodes, edges, current, visiting, stack, doneNodes, description, stepIndex }`
- Import: `import { dfs } from 'src/algorithms/Graph/dfs'`

#### `dijkstra(graph, startId): Generator`
- Yields: `{ nodes, edges, current, visiting, pq, distances, doneNodes, description, stepIndex }`
- Import: `import { dijkstra } from 'src/algorithms/Graph/dijkstra'`

### Using a generator directly
```js
import { bubbleSort } from 'src/algorithms/Sorting/bubbleSort';

const gen = bubbleSort([5,3,1]);
for (const step of gen) {
  console.log(step.description, step.array);
}
```

### Using with `useAlgorithm`
```jsx
import { useAlgorithm } from 'src/hooks/useAlgorithm';
import { mergeSort } from 'src/algorithms/Sorting/mergeSort';

function SortDemo() {
  const { executeAlgorithm, play, currentStep, totalSteps } = useAlgorithm();
  const run = async () => {
    await executeAlgorithm(mergeSort([4,1,3,2]));
    play();
  };
  return (
    <div>
      <button onClick={run}>Visualize</button>
      <div>{currentStep?.description}</div>
      <small>{totalSteps} steps</small>
    </div>
  );
}
```


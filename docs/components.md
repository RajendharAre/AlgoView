## Components

This document describes public React components exported in `src/components`.

### Algorithm UI

#### `VisualizationPage`
- **Export**: default from `src/components/Visualisation/VisualizationPage.jsx`
- **Props**:
  - `selectedAlgorithm: string` — one of ids in `ALGORITHMS` (e.g., `bubbleSort`, `binarySearch`, `bfs`).
- **Description**: High-level page that orchestrates inputs, runs an algorithm via `useAlgorithm`, and renders the visualization and controls.
- **Usage**:
```jsx
import VisualizationPage from 'src/components/Visualisation/VisualizationPage';

export default function Page() {
  return <VisualizationPage selectedAlgorithm="bubbleSort" />;
}
```

#### `AlgorithmController`
- **Export**: default from `src/components/Visualisation/AlgorithmController.jsx`
- **Props**:
  - `isPlaying: boolean`
  - `currentStep: number` — current step index
  - `totalSteps: number`
  - `speed: number` — delay in ms between steps
  - `onPlay(): void`
  - `onPause(): void`
  - `onReset(): void` — re-initializes current algorithm
  - `onSpeedChange(value: number): void`
  - `onStepChange(index: number): void`
- **Usage**:
```jsx
<AlgorithmController
  isPlaying={isPlaying}
  currentStep={currentStepIndex}
  totalSteps={totalSteps}
  speed={speed}
  onPlay={play}
  onPause={pause}
  onReset={initializeAlgorithm}
  onSpeedChange={setSpeed}
  onStepChange={goToStep}
/>
```

#### `AlgorithmVisualizer`
- **Export**: default from `src/components/Visualisation/AlgorithmVisualizer.jsx`
- **Props**:
  - `algorithm: string` — algorithm id; used to show description and render an array visualizer
- **Usage**:
```jsx
<AlgorithmVisualizer algorithm="mergeSort" />
```

#### `ArrayVisualizer`
- **Export**: default from `src/components/Visualisation/ArrayVisualizer.jsx`
- **Props**:
  - `algorithmId: string`
  - `data: number[]`
  - `step?: object` — current step from generator
  - `highlights?: any[]`
  - `target?: number` — used by searching visualizers
- **Usage**:
```jsx
<ArrayVisualizer algorithmId="quickSort" data={[5,1,4]} step={step} />
```

#### `GraphVisualizer`
- **Export**: default from `src/components/Visualisation/GraphVisualizer.jsx`
- **Props**:
  - `nodes: {id: string, label?: string, x: number, y: number}[]`
  - `edges: {from: string, to: string, weight?: number}[]`
  - `step?: object` — current step (supports `current`, `visiting`, `frontier`, `doneNodes`, `distances`, `description`)
  - `width?: number` (default 700)
  - `height?: number` (default 380)
- **Usage**:
```jsx
<GraphVisualizer nodes={nodes} edges={edges} step={currentStep} />
```

### Sorting Visualizers

All accept `data: number[]` and an algorithm-specific `step` object.

- `BubbleSortVisualizer` — `step`: `{ compared: [i,j], swapped: boolean, doneIndex: number }`
- `InsertionSortVisualizer` — `step`: `{ keyIndex, comparingIndex, shiftingIndex, placedIndex, doneIndices: number[] }`
- `MergeSortVisualizer` — `step`: `{ range: [l,r], leftWindow?: [l,m], rightWindow?: [m+1,r], mergedIndex?: number, phase?: string }`
- `QuickSortVisualizer` — `step`: `{ pivot, comparing?: number[], swapped?: number[], left, right }`
- `SelectionSortVisualizer` — `step`: `{ currentIndex, minIndex, comparingIndex, swapIndices?: [i,j], doneIndices: number[] }`

Imports:
```jsx
import BubbleSortVisualizer from 'src/components/Visualisation/Sorting/BubbleSortVisualizer';
```

### Searching Visualizers

- `LinearSearchVisualizer` — Props: `data`, `step` (`{ currentIndex, foundIndex }`), `target`
- `BinarySearchVisualizer` — Props: `data`, `step` (`{ low, mid, high, found }`), `target`

### Layout and Common

- `Header` — default from `src/components/Layout/Header.jsx`
  - Uses `useAuth` internally; no props

- `Sidebar` — default from `src/components/Layout/Sidebar.jsx`
  - Props: `selectedAlgorithm: string`, `onAlgorithmSelect(id: string): void`

- `Loader` — default from `src/components/Common/Loader.jsx`
  - No props

### Auth

- `Auth` — default from `src/components/Auth/Auth.jsx` (switches between forms). No props.
- `Login` — default from `src/components/Auth/Login.jsx`
  - Props: `onSwitchToRegister(): void`
- `Register` — default from `src/components/Auth/Register.jsx`
  - Props: `onSwitchToLogin(): void`


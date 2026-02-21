import React from 'react';
import { useParams } from 'react-router-dom';
import BubbleSortVisualization from './Sorting/BubbleSort';
import SelectionSortVisualization from './Sorting/SelectionSort';
import MergeSortVisualization from './Sorting/MergeSort';
import InsertionSortVisualization from './Sorting/InsertionSort';
import QuickSortVisualization from './Sorting/QuickSort';
import HeapSortVisualization from './Sorting/HeapSort';
import BucketSortVisualization from './Sorting/BucketSort';
import LinearSearchVisualization from './Searching/LinearSearch';
import BinarySearchVisualization from './Searching/BinarySearch';
import AStarVisualization from './Searching/AStar';
import BFSVisualization from './Graph/BFS';
import DFSVisualization from './Graph/DFS';
import DijkstraVisualization from './Graph/Dijkstra';
import BellmanFordVisualization from './Graph/BellmanFord';
import FloydWarshallVisualization from './Graph/FloydWarshall';
import KruskalVisualization from './Graph/Kruskal';
import PrimVisualization from './Graph/Prim';
import TopologicalSortVisualization from './Graph/TopologicalSort';
import KosarajuVisualization from './Graph/Kosaraju';
import GraphColoringVisualization from './Graph/GraphColoring';

/**
 * Dynamic Algorithm Visualization Component
 * Renders the appropriate visualization based on the algorithm ID
 */
const AlgorithmVisualization = () => {
  const { algorithmId } = useParams();

  // Map algorithm IDs to their respective visualization components
  const algorithmComponents = {
    'bubbleSort': BubbleSortVisualization,
    'selectionSort': SelectionSortVisualization,
    'mergeSort': MergeSortVisualization,
    'insertionSort': InsertionSortVisualization,
    'quickSort': QuickSortVisualization,
    'heapSort': HeapSortVisualization,
    'bucketSort': BucketSortVisualization,
    'linearSearch': LinearSearchVisualization,
    'binarySearch': BinarySearchVisualization,
    'aStar': AStarVisualization,
    'bfs': BFSVisualization,
    'dfs': DFSVisualization,
    'dijkstra': DijkstraVisualization,
    'bellmanFord': BellmanFordVisualization,
    'floydWarshall': FloydWarshallVisualization,
    'kruskal': KruskalVisualization,
    'prim': PrimVisualization,
    'topologicalSort': TopologicalSortVisualization,
    'kosaraju': KosarajuVisualization,
    'graphColoring': GraphColoringVisualization,
    // Add more algorithms here as they are implemented
  };

  // Get the component for the given algorithm ID, defaulting to Bubble Sort if not found
  const VisualizationComponent = algorithmComponents[algorithmId] || algorithmComponents['bubbleSort'];

  if (!VisualizationComponent) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Algorithm Not Found</h1>
          <p className="text-gray-600">The requested algorithm visualization is not available.</p>
        </div>
      </div>
    );
  }

  return <VisualizationComponent />;
};

export default AlgorithmVisualization;
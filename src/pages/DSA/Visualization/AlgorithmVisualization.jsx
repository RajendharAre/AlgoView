import React from 'react';
import { useParams } from 'react-router-dom';
import BubbleSortVisualization from './BubbleSort';
import SelectionSortVisualization from './SelectionSort';
import MergeSortVisualization from './MergeSort';
import InsertionSortVisualization from './InsertionSort';
import QuickSortVisualization from './QuickSort';
import HeapSortVisualization from './HeapSort';

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
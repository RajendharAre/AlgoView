import React from 'react';
import { useParams } from 'react-router-dom';
import SortingVisualization from '../../../../components/Visualisation/SortingVisualization';
import { bubbleSort, bubbleSortInfo } from '../../../../algorithms/Sorting/bubbleSort';

/**
 * Bubble Sort Visualization Page
 * Dedicated page for bubble sort algorithm visualization
 */
const BubbleSortVisualization = () => {
  const { algorithmId } = useParams();

  // Custom color palette for Bubble Sort (using the snow to carbon theme from original)
  const bubbleSortColors = {
    unsorted: '#ced4daff',
    comparing: '#495057ff',
    swapping: '#212529ff',
    sorted: '#6c757dff',
    background: '#f8f9faff'
  };

  return (
    <div className="h-screen w-full">
      <SortingVisualization
        algorithmGenerator={bubbleSort}
        algorithmName="Bubble Sort"
        customColors={bubbleSortColors}
        allowUserInput={true}
        complexityInfo={bubbleSortInfo.complexity}
        onComplete={(results) => {
          console.log('Bubble Sort completed:', results);
        }}
      />
    </div>
  );
};

export default BubbleSortVisualization;
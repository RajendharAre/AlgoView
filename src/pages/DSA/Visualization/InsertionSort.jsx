import React from 'react';
import { useParams } from 'react-router-dom';
import SortingVisualization from '../../../components/Visualisation/SortingVisualization';
import { insertionSort, insertionSortInfo } from '../../../algorithms/Sorting/insertionSort';

/**
 * Insertion Sort Visualization Page
 * Dedicated page for insertion sort algorithm visualization
 */
const InsertionSortVisualization = () => {
  const { algorithmId } = useParams();

  // Custom color palette for Insertion Sort (using the snow to carbon theme from original)
  const insertionSortColors = {
    unsorted: '#ced4daff',
    comparing: '#495057ff',
    swapping: '#212529ff',
    sorted: '#6c757dff',
    background: '#f8f9faff'
  };

  return (
    <div className="h-screen w-full">
      <SortingVisualization
        algorithmGenerator={insertionSort}
        algorithmName="Insertion Sort"
        customColors={insertionSortColors}
        allowUserInput={true}
        complexityInfo={insertionSortInfo.complexity}
        onComplete={(results) => {
          console.log('Insertion Sort completed:', results);
        }}
      />
    </div>
  );
};

export default InsertionSortVisualization;
import React from 'react';
import { useParams } from 'react-router-dom';
import SortingVisualization from '../../../../components/Visualisation/SortingVisualization';
import { selectionSort, selectionSortInfo } from '../../../../algorithms/Sorting/selectionSort';

/**
 * Selection Sort Visualization Page
 * Dedicated page for selection sort algorithm visualization
 */
const SelectionSortVisualization = () => {
  const { algorithmId } = useParams();

  // Custom color palette for Selection Sort (using the snow to carbon theme from original)
  const selectionSortColors = {
    unsorted: '#ced4daff',
    comparing: '#495057ff',
    swapping: '#212529ff',
    sorted: '#6c757dff',
    background: '#f8f9faff'
  };

  return (
    <div className="h-screen w-full">
      <SortingVisualization
        algorithmGenerator={selectionSort}
        algorithmName="Selection Sort"
        customColors={selectionSortColors}
        allowUserInput={true}
        complexityInfo={selectionSortInfo.complexity}
        onComplete={(results) => {
          console.log('Selection Sort completed:', results);
        }}
      />
    </div>
  );
};

export default SelectionSortVisualization;
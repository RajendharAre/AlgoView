 
// src/components/Visualization/ArrayVisualizer.jsx
import BubbleSortVisualizer from './Sorting/BubbleSortVisualizer';
import InsertionSortVisualizer from './Sorting/InsertionSortVisualizer';
import MergeSortVisualizer from './Sorting/MergeSortVisualizer';
import LinearSearchVisualizer from './Searching/LinearSearchVisualizer';
import BinarySearchVisualizer from './Searching/BinarySearchVisualizer';
import QuickSortVisualizer from './Sorting/QuickSortVisualizer';
import SelectionSortVisualizer from './Sorting/SelectionSortVisualizer';

const ArrayVisualizer = ({ algorithmId, data = [], step = {}, highlights = [], target = null}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-6 bg-[#ffffff] rounded-lg shadow-md text-[#480360]">
        No data to visualize
      </div>
    );
  }

  switch (algorithmId) {
    case 'bubbleSort':
      return <BubbleSortVisualizer data={data} step={step} highlights={highlights} />;

    case 'insertionSort':
      return <InsertionSortVisualizer data={data} step={step} highlights={highlights} />;

    case 'mergeSort':
      return <MergeSortVisualizer data={data} step={step} highlights={highlights} />;

    case 'linearSearch':
      return <LinearSearchVisualizer data={data} step={step} highlights={highlights} target={target} />;

    case 'binarySearch':
      return <BinarySearchVisualizer data={data} step={step} highlights={highlights} target={target} />;
    
    case 'quickSort':
      return <QuickSortVisualizer data={data} step={step} highlights={highlights} />;

    case 'selectionSort':
      return <SelectionSortVisualizer data={data} step={step} highlights={highlights}/>;

    default:
      return (
        <div className="p-6 bg-[#ffffff] rounded-lg shadow-md text-[#480360]">
          Visualization for <strong>{algorithmId}</strong> is not implemented yet.
        </div>
      );
  }
};

export default ArrayVisualizer;

import BubbleSortVisualizer from './Sorting/BubbleSortVisualizer';
import InsertionSortVisualizer from './Sorting/InsertionSortVisualizer';
import MergeSortVisualizer from './Sorting/MergeSortVisualizer';
import LinearSearchVisualizer from './Searching/LinearSearchVisualizer';
import BinarySearchVisualizer from './Searching/BinarySearchVisualizer';
import QuickSortVisualizer from './Sorting/QuickSortVisualizer';
import SelectionSortVisualizer from './Sorting/SelectionSortVisualizer';

const ArrayVisualizer = ({ algorithmId, data = [], step = {}, highlights = [], target = null, stepIndex = null, totalSteps = 0 }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">No data to visualize</p>
      </div>
    );
  }

  const renderVisualizer = () => {
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
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">
              Visualization for <strong className="text-gray-800">{algorithmId}</strong> is not implemented yet.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Visualization</h3>
        {stepIndex !== null && totalSteps > 0 && (
          <span className="text-sm text-gray-500">
            Step {stepIndex + 1} of {totalSteps}
          </span>
        )}
      </div>
      {renderVisualizer()}
    </div>
  );
};

export default ArrayVisualizer;
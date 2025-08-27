// src/components/Visualization/AlgorithmVisualizer.jsx
import { useState } from 'react';
import { sortingAlgorithms } from '../../features/algorithms/Sorting';
import ArrayVisualizer from './ArrayVisualizer';

const AlgorithmVisualizer = ({ algorithm }) => {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [customInput, setCustomInput] = useState('64,34,25,12,22,11,90');

  const handleInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const applyCustomInput = () => {
    try {
      const newArray = customInput.split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));
      
      if (newArray.length > 0) {
        setInputArray(newArray);
      }
    } catch {
      alert('Invalid input! Please enter comma-separated numbers.');
    }
  };

  const generateRandomArray = () => {
    const randomArray = Array.from({ length: 10 }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setInputArray(randomArray);
    setCustomInput(randomArray.join(','));
  };

  const currentAlgorithm = sortingAlgorithms[algorithm];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{currentAlgorithm.name}</h2>
        <p className="text-gray-600 mb-4">
          Time Complexity: Best {currentAlgorithm.info.timeComplexity.best}, 
          Worst {currentAlgorithm.info.timeComplexity.worst} | 
          Space Complexity: {currentAlgorithm.info.spaceComplexity}
        </p>
      </div>

      {/* Input Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Array Input</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customInput}
            onChange={handleInputChange}
            className="flex-1 p-2 border rounded"
            placeholder="Enter comma-separated numbers"
          />
          <button
            onClick={applyCustomInput}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Apply
          </button>
          <button
            onClick={generateRandomArray}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Random
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Current array: [{inputArray.join(', ')}]
        </p>
      </div>

      {/* Visualization */}
      <ArrayVisualizer 
        algorithm={currentAlgorithm.function}
        inputArray={inputArray}
      />

      {/* Algorithm Description */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <p className="text-sm">
          {algorithm === 'bubbleSort' && 
            "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
          }
          {algorithm === 'quickSort' && 
            "Quick Sort picks an element as pivot and partitions the array around the pivot, then recursively sorts the sub-arrays."
          }
          {/* Add descriptions for other algorithms */}
        </p>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
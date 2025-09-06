// src/components/Visualization/AlgorithmVisualizer.jsx
import { useState } from 'react';
import ArrayVisualizer from './ArrayVisualizer';
import { getAlgorithmInfoById } from '../../utils/algorithmConstants';

const AlgorithmVisualizer = ({ algorithm }) => {
  const algoInfo = getAlgorithmInfoById(algorithm);
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [customInput, setCustomInput] = useState('64,34,25,12,22,11,90');

  const handleInputChange = (e) => setCustomInput(e.target.value);

  const applyCustomInput = () => {
    const newArray = customInput
      .split(',')
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));
    if (newArray.length > 0) setInputArray(newArray);
  };

  const generateRandomArray = () => {
    const randomArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setInputArray(randomArray);
    setCustomInput(randomArray.join(','));
  };

  if (!algoInfo) return <div className="text-red-500">Algorithm not found!</div>;

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          {algoInfo.name}
        </h2>
        <p className="text-gray-700 mt-2">{algoInfo.description}</p>
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-semibold">Time:</span> Best {algoInfo.complexity.time.best}, Worst {algoInfo.complexity.time.worst} | 
          <span className="font-semibold"> Space:</span> {algoInfo.complexity.space}
        </p>
      </div>

      {/* Input Controls */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
        <h3 className="font-semibold mb-2">Array Input</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={customInput}
            onChange={handleInputChange}
            className="flex-1 p-3 border rounded-lg shadow focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter comma-separated numbers"
          />
          <button
            onClick={applyCustomInput}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-md transition"
          >
            Apply
          </button>
          <button
            onClick={generateRandomArray}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition"
          >
            Random
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Current array: [{inputArray.join(', ')}]
        </p>
      </div>

      {/* Visualization */}
      <ArrayVisualizer data={inputArray} algorithmType={algoInfo.category} />

      {/* Description */}
      <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <p className="text-sm text-gray-700">{algoInfo.description}</p>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;

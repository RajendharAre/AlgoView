// src/components/Visualization/VisualizationPage.jsx
import { useState, useEffect } from 'react';
import { useAlgorithm } from '../../hooks/useAlgorithm';
import ArrayVisualizer from './ArrayVisualizer';
import AlgorithmController from './AlgorithmController';
import { getAlgorithmInfoById } from '../../utils/algorithmConstants';

const VisualizationPage = ({ selectedAlgorithm }) => {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [searchTarget, setSearchTarget] = useState(25);

  const {
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    setSpeed,
    executeAlgorithm,
    play,
    pause,
    reset,
    goToStep,
    hasSteps,
  } = useAlgorithm();

  const algoInfo = getAlgorithmInfoById(selectedAlgorithm);

  useEffect(() => {
    reset();
  }, [selectedAlgorithm, reset]);

  const initializeAlgorithm = async () => {
    if (!algoInfo) {
      console.warn('Unknown algorithm:', selectedAlgorithm);
      return;
    }

    reset();

    try {
      const algorithmFn = await algoInfo.importFn();

      let arr = [...inputArray];

      // Auto-sort for binary search
      if (algoInfo.id === 'binarySearch') {
        arr = arr.sort((a, b) => a - b);
        setInputArray(arr); // update state so user sees sorted array
      }

      // Sorting algorithms just take array
      // Searching algorithms also need target
      const steps =
        algoInfo.category === 'searching'
          ? algorithmFn(arr, searchTarget)
          : algorithmFn(arr);

      await executeAlgorithm(steps, arr);
      console.log('Algorithm initialized successfully');
    } catch (error) {
      console.error('Algorithm initialization failed:', error);
    }
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setInputArray(newArray);
    reset();
  };

  const handleArrayInputChange = (e) => {
    const inputText = e.target.value;
    const newArray = inputText
      .split(',')
      .map((num) => parseInt(num.trim(), 10))
      .filter((num) => !isNaN(num));

    if (newArray.length > 0) {
      setInputArray(newArray);
      reset();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {algoInfo?.name || 'Algorithm Visualizer'}
        </h1>
        <p className="text-gray-600">{algoInfo?.description}</p>
      </div>

      {/* Input Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="font-semibold mb-3">Input Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Array Elements
            </label>
            <input
              type="text"
              value={inputArray.join(', ')}
              onChange={handleArrayInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter numbers separated by commas"
            />
          </div>

          {(algoInfo?.id === 'linearSearch' ||
            algoInfo?.id === 'binarySearch') && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Search Target
              </label>
              <input
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={generateRandomArray}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate Random Array
          </button>
          <button
            onClick={initializeAlgorithm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Initialize Algorithm
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Current array: [{inputArray.join(', ')}]
          {(algoInfo?.id === 'linearSearch' ||
            algoInfo?.id === 'binarySearch') &&
            ` | Searching for: ${searchTarget}`}
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {hasSteps ? (
          <ArrayVisualizer
            algorithmId={algoInfo?.id}
            data={currentStep?.array || inputArray}
            stepIndex={currentStep?.stepIndex ?? null}
            step={currentStep || {}}
            highlights={currentStep?.highlights || []}
            target={searchTarget}
            totalSteps={totalSteps}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            Click "Initialize Algorithm" to start visualization
          </div>
        )}
      </div>

      {/* Controller */}
      {hasSteps && (
        <AlgorithmController
          isPlaying={isPlaying}
          currentStep={currentStep?.stepIndex || 0}
          totalSteps={totalSteps}
          speed={speed}
          onPlay={play}
          onPause={pause}
          onReset={initializeAlgorithm}
          onSpeedChange={setSpeed}
          onStepChange={goToStep}
        />
      )}

      {/* Status Information */}
      {currentStep && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Current Step:</h4>
          <p className="text-blue-700">{currentStep.description}</p>
          {currentStep.step && (
            <p className="text-sm text-blue-600 mt-1">{currentStep.step}</p>
          )}
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
        <strong>Debug Info:</strong> Steps: {totalSteps} | Playing:{' '}
        {isPlaying ? 'Yes' : 'No'} | Current Step:{' '}
        {currentStep?.stepIndex ?? 'None'}
      </div>
    </div>
  );
};

export default VisualizationPage;

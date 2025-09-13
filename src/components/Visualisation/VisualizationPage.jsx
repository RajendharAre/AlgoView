// /* eslint-disable no-unused-vars */
// src/components/Visualization/VisualizationPage.jsx
import { useState, useEffect } from 'react';
import { useAlgorithm } from '../../hooks/useAlgorithm';
import ArrayVisualizer from './ArrayVisualizer';
import AlgorithmController from './AlgorithmController';
import { getAlgorithmInfoById } from '../../utils/algorithmConstants';
import { RefreshCcw, Play, Dice5, Settings } from "lucide-react";
import { layoutNodesCircle } from '../../utils/graphUtils';
import GraphVisualizer from './GraphVisualizer';

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

      if (algoInfo.id === 'binarySearch') {
        arr = arr.sort((a, b) => a - b);
        setInputArray(arr);
      }
      let steps;
      
      if (algoInfo?.category === 'searching') {
        steps = algorithmFn(arr, searchTarget);
        await executeAlgorithm(steps, arr);
      } else if (algoInfo?.category === 'sorting') {
        steps = algorithmFn(arr);
        await executeAlgorithm(steps, arr);
      } else if (algoInfo?.category === 'graph') {
        // Build example graph (you can later replace with UI input)
        const nodes = [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' }
        ];
        const positionedNodes = layoutNodesCircle(nodes, 700, 380);
        const edges = [
          { from: 'A', to: 'B', weight: 1 },
          { from: 'A', to: 'C', weight: 1 },
          { from: 'B', to: 'D', weight: 1 },
          { from: 'C', to: 'D', weight: 1 }
        ];
        const graph = { nodes: positionedNodes, edges };

        // Pass start node ID (first node for now)
        steps = algorithmFn(graph, nodes[0].id);
        await executeAlgorithm(steps, graph); // second param is optional metadata
}
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

    if (!algoInfo) {
      return (
        <div className="p-6 text-center text-gray-600">
          Please select an algorithm from the sidebar.
        </div>
      );
    }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[--tekhelet] mb-2">
          {algoInfo?.name || 'Algorithm Visualizer'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {algoInfo?.description}
        </p>
      </div>

      {/* Input Controls */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-[--tekhelet] mb-4 text-lg">
          Input Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Array Elements
            </label>
            <input
              type="text"
              value={inputArray.join(', ')}
              onChange={handleArrayInputChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--medium-slate-blue]"
              placeholder="Enter numbers separated by commas"
            />
          </div>

          {(algoInfo?.id === 'linearSearch' ||
            algoInfo?.id === 'binarySearch') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Target
              </label>
              <input
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--medium-slate-blue]"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
            <button
              onClick={generateRandomArray}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[--medium-slate-blue] text-white hover:bg-[--tekhelet] transition"
            >
              <Dice5 size={18} />
              Random Array
            </button>

            <button
              onClick={initializeAlgorithm}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[--selective-yellow] text-black hover:bg-yellow-500 transition"
            >
              <Play size={18} />
              Initialize
            </button>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              <RefreshCcw size={18} />
              Reset
            </button>
        </div>

        <div className="mt-4 text-sm text-gray-700 italic">
          Current array: [{inputArray.join(', ')}]
          {(algoInfo?.id === 'linearSearch' ||
            algoInfo?.id === 'binarySearch') &&
            ` | Searching for: ${searchTarget}`}
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[250px] flex items-center justify-center">
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
        ) : (algoInfo?.category === 'graph') ? (
            <GraphVisualizer
              nodes={currentStep?.nodes || []}
              edges={currentStep?.edges || []}
              step={currentStep || {}}
              width={700}
              height={380}
            />
          ) : (
          <div className="text-center text-gray-500">
            Click <span className="text-[--tekhelet] font-semibold">"Initialize"</span> to begin the visualization
            <Settings size={18} className="inline ml-1 text-[--tekhelet]" />
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
        <div className="bg-[--medium-slate-blue]/10 border border-[--medium-slate-blue]/30 rounded-xl p-5">
          <h4 className="font-semibold text-[--tekhelet] mb-2">
            Current Step
          </h4>
          <p className="text-gray-800">{currentStep.description}</p>
        </div>
      )}

      {/* Debug Info (Collapsible for devs) */}
      <details className="mt-4 bg-gray-100 rounded-lg p-3 text-xs text-gray-700">
        <summary className="cursor-pointer font-medium">
          Debug Info
        </summary>
        Steps: {totalSteps} | Playing: {isPlaying ? 'Yes' : 'No'} | Current Step:{' '}
        {currentStep?.stepIndex ?? 'None'}
      </details>
    </div>
  );
};

export default VisualizationPage;

import { Settings, Dice5, RefreshCcw, Play } from 'lucide-react'
import ArrayVisualizer from './ArrayVisualizer'
import GraphVisualizer from './GraphVisualizer'

const VisualizationPanel = ({ 
  algoInfo, 
  currentStep, 
  currentStepIndex, 
  totalSteps, 
  inputArray, 
  searchTarget, 
  hasSteps, 
  isPlaying, 
  play, 
  pause, 
  initializeAlgorithm, 
  stats,
  handleArrayInputChange,
  generateRandomArray,
  reset,
  setSearchTarget
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Configuration Controls - Always visible in visualize mode */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mx-4 md:mx-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">Configuration</h3>
          <div className="flex gap-2">
            <button
              onClick={generateRandomArray}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Generate random array"
            >
              <Dice5 size={16} />
              Random
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Reset visualization"
            >
              <RefreshCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Array Elements</label>
            <input
              type="text"
              value={inputArray.join(', ')}
              onChange={handleArrayInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter numbers separated by commas"
              aria-label="Array elements input"
            />
          </div>

          {(algoInfo?.id === 'linearSearch' || algoInfo?.id === 'binarySearch') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Target</label>
              <input
                type="number"
                value={searchTarget}
                onChange={e => setSearchTarget(parseInt(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search target input"
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={initializeAlgorithm}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
            aria-label="Initialize algorithm"
          >
            <Play size={18} />
            Initialize
          </button>

          <div className="text-sm text-gray-600">
            Current array: [{inputArray.join(', ')}]
            {(algoInfo?.id === 'linearSearch' || algoInfo?.id === 'binarySearch') &&
              ` | Searching for: ${searchTarget}`}
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mx-4 md:mx-6 mb-4">
        {algoInfo?.category === 'graph' ? (
          hasSteps ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Graph Visualization</h3>
                {currentStepIndex !== null && totalSteps > 0 && (
                  <span className="text-sm text-gray-500">
                    Step {currentStepIndex + 1} of {totalSteps}
                  </span>
                )}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <GraphVisualizer
                  nodes={currentStep?.nodes || []}
                  edges={currentStep?.edges || []}
                  step={currentStep || {}}
                  width={700}
                  height={380}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <Settings size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="font-medium text-gray-700">Ready to Visualize</p>
                <p className="text-sm mt-1">Click "Initialize" to begin the visualization</p>
              </div>
            </div>
          )
        ) : hasSteps ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Visualization</h3>
              {currentStepIndex !== null && totalSteps > 0 && (
                <span className="text-sm text-gray-500">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <ArrayVisualizer
                algorithmId={algoInfo?.id}
                data={currentStep?.array || inputArray}
                stepIndex={currentStep?.stepIndex ?? null}
                step={currentStep || {}}
                highlights={currentStep?.highlights || []}
                target={searchTarget}
                totalSteps={totalSteps}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <Settings size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-700">Ready to Visualize</p>
              <p className="text-sm mt-1">Click "Initialize" to begin the visualization</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VisualizationPanel
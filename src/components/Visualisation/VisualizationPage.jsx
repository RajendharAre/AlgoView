import { useState, useEffect } from 'react'
import { useAlgorithm } from '../../hooks/useAlgorithm'
import ArrayVisualizer from './ArrayVisualizer'
import AlgorithmController from './AlgorithmController'
import { getAlgorithmInfoById } from '../../utils/algorithmConstants'
import { RefreshCcw, Play, Dice5, Settings, Info } from 'lucide-react'
import { layoutNodesCircle } from '../../utils/graphUtils'
import GraphVisualizer from './GraphVisualizer'

const VisualizationPage = ({ selectedAlgorithm }) => {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [searchTarget, setSearchTarget] = useState(25)
  const [showInfo, setShowInfo] = useState(false)

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
  } = useAlgorithm()

  const algoInfo = getAlgorithmInfoById(selectedAlgorithm)

  useEffect(() => {
    reset()
  }, [selectedAlgorithm, reset])

  const initializeAlgorithm = async () => {
    if (!algoInfo) {
      console.warn('Unknown algorithm:', selectedAlgorithm)
      return
    }

    reset()

    try {
      const algorithmFn = await algoInfo.importFn()

      let arr = [...inputArray]

      if (algoInfo.id === 'binarySearch') {
        arr = arr.sort((a, b) => a - b)
        setInputArray(arr)
      }
      let steps

      if (algoInfo?.category === 'searching') {
        steps = algorithmFn(arr, searchTarget)
        await executeAlgorithm(steps)
      } else if (algoInfo?.category === 'sorting') {
        steps = algorithmFn(arr)
        await executeAlgorithm(steps)
      } else if (algoInfo?.category === 'graph') {
        // Build example graph (you can later replace with UI input)
        const nodes = [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' },
        ]
        const positionedNodes = layoutNodesCircle(nodes, 700, 380)
        const edges = [
          { from: 'A', to: 'B', weight: 1 },
          { from: 'A', to: 'C', weight: 1 },
          { from: 'B', to: 'D', weight: 1 },
          { from: 'C', to: 'D', weight: 1 },
        ]
        const graph = { nodes: positionedNodes, edges }

        // Pass start node ID (first node for now)
        steps = algorithmFn(graph, nodes[0].id)
        await executeAlgorithm(steps) // second param is optional metadata
      }
    } catch (error) {
      console.error('Algorithm initialization failed:', error)
    }
  }

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
    setInputArray(newArray)
    reset()
  }

  const handleArrayInputChange = e => {
    const inputText = e.target.value
    const newArray = inputText
      .split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => !isNaN(num))

    if (newArray.length > 0) {
      setInputArray(newArray)
      reset()
    }
  }

  if (!algoInfo) {
    return (
      <div className="p-6 text-center text-gray-600">
        Please select an algorithm from the sidebar.
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {algoInfo?.name || 'Algorithm Visualizer'}
          </h1>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Info size={20} />
          </button>
        </div>

        {showInfo && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4 mb-4 text-left">
            <p className="text-gray-600 text-sm">{algoInfo?.description}</p>
          </div>
        )}

        {!showInfo && (
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            {algoInfo?.description.substring(0, 100)}...
          </p>
        )}
      </div>

      {/* Input Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">Configuration</h3>
          <div className="flex gap-2">
            <button
              onClick={generateRandomArray}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Dice5 size={16} />
              Random
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={initializeAlgorithm}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-h-[300px] flex items-center justify-center">
        {algoInfo?.category === 'graph' ? (
          hasSteps ? (
            <GraphVisualizer
              nodes={currentStep?.nodes || []}
              edges={currentStep?.edges || []}
              step={currentStep || {}}
              width={700}
              height={380}
            />
          ) : (
            <div className="text-center text-gray-500 p-8">
              <Settings size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-700">Ready to Visualize</p>
              <p className="text-sm mt-1">Click "Initialize" to begin the visualization</p>
            </div>
          )
        ) : hasSteps ? (
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
          <div className="text-center text-gray-500 p-8">
            <Settings size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-700">Ready to Visualize</p>
            <p className="text-sm mt-1">Click "Initialize" to begin the visualization</p>
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
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info size={18} />
            Current Step
          </h4>
          <p className="text-gray-700">{currentStep.description}</p>
        </div>
      )}
    </div>
  )
}

export default VisualizationPage

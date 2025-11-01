import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAlgorithm } from '../../hooks/useAlgorithm'
import ArrayVisualizer from './ArrayVisualizer'
import AlgorithmController from './AlgorithmController'
import { getAlgorithmInfoById } from '../../utils/algorithmConstants'
import { 
  RefreshCcw, 
  Play, 
  Dice5, 
  Settings, 
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { layoutNodesCircle } from '../../utils/graphUtils'
import GraphVisualizer from './GraphVisualizer'
import AlgorithmInfo from './AlgorithmInfo'
import VisualizationPanel from './VisualizationPanel'
import FullscreenContainer from './FullscreenContainer'

const AlgorithmVisualizer = ({ selectedAlgorithm }) => {
  console.log('=== AlgorithmVisualizer CONSTRUCTOR ===')
  console.log('selectedAlgorithm prop:', selectedAlgorithm)
  console.log('typeof selectedAlgorithm:', typeof selectedAlgorithm)
  
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [searchTarget, setSearchTarget] = useState(25)
  const [showInfo, setShowInfo] = useState(false)
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 })
  const [viewMode, setViewMode] = useState('algorithm') // 'algorithm', 'visualize', 'fullscreen'
  const fullscreenRef = useRef(null)

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
    currentStepIndex,
  } = useAlgorithm()

  console.log('AlgorithmVisualizer rendered with selectedAlgorithm:', selectedAlgorithm)
  const algoInfo = getAlgorithmInfoById(selectedAlgorithm)
  console.log('Algorithm info retrieved:', algoInfo)
  
  // Add debug logging to help with troubleshooting
  useEffect(() => {
    console.log('Selected algorithm ID:', selectedAlgorithm)
    console.log('Algorithm info found:', algoInfo)
  }, [selectedAlgorithm, algoInfo])

  useEffect(() => {
    setStats({ comparisons: 0, swaps: 0 })
    reset()
  }, [selectedAlgorithm, reset])

  const initializeAlgorithm = async () => {
    console.log('Initializing algorithm:', selectedAlgorithm)
    console.log('Algorithm info:', algoInfo)
    if (!algoInfo) {
      console.warn('Unknown algorithm:', selectedAlgorithm)
      return
    }

    // Reset stats when initializing
    setStats({ comparisons: 0, swaps: 0 })
    reset()

    try {
      console.log('Loading algorithm function...')
      const algorithmFn = await algoInfo.importFn()
      console.log('Algorithm function loaded:', typeof algorithmFn)
      console.log('Algorithm function:', algorithmFn)

      let arr = [...inputArray]
      console.log('Input array:', arr)

      if (algoInfo.id === 'binarySearch') {
        arr = arr.sort((a, b) => a - b)
        setInputArray(arr)
      }
      let steps

      if (algoInfo?.category === 'searching') {
        console.log('Executing searching algorithm with target:', searchTarget)
        steps = algorithmFn(arr, searchTarget)
        console.log('Steps generated:', steps)
        await executeAlgorithm(steps)
      } else if (algoInfo?.category === 'sorting') {
        console.log('Executing sorting algorithm')
        steps = algorithmFn(arr)
        console.log('Steps generated:', steps)
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
      console.error('Error stack:', error.stack)
    }
  }

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event) => {
    // Prevent default behavior for arrow keys to avoid page scrolling
    if ([32, 37, 39, 82, 65, 86, 70].includes(event.keyCode)) {
      event.preventDefault()
    }

    // Space - Play/Pause
    if (event.keyCode === 32) {
      if (isPlaying) {
        pause()
      } else {
        play()
      }
    }
    
    // R - Reset (with Ctrl key)
    if (event.keyCode === 82 && event.ctrlKey) {
      initializeAlgorithm()
    }
    
    // Arrow Right - Step Forward
    if (event.keyCode === 39 && !isPlaying) {
      if (currentStepIndex < totalSteps - 1) {
        goToStep(currentStepIndex + 1)
      }
    }
    
    // Arrow Left - Step Backward
    if (event.keyCode === 37 && !isPlaying) {
      if (currentStepIndex > 0) {
        goToStep(currentStepIndex - 1)
      }
    }
    
    // A - Algorithm view
    if (event.keyCode === 65) {
      setViewMode('algorithm')
    }
    
    // V - Visualize view
    if (event.keyCode === 86) {
      setViewMode('visualize')
    }
    
    // F - Fullscreen
    if (event.keyCode === 70) {
      toggleFullscreen()
    }
  }, [isPlaying, play, pause, currentStepIndex, totalSteps, goToStep])

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Update stats when step changes
  useEffect(() => {
    if (currentStep && algoInfo) {
      setStats(prevStats => {
        const newStats = { ...prevStats }
        
        // Count comparisons and swaps based on the specific algorithm category
        switch (algoInfo.category) {
          case 'sorting':
            // Handle different sorting algorithms
            switch (algoInfo.id) {
              case 'bubbleSort':
                // Bubble Sort uses 'compared' array for comparisons and 'swapped' for swaps
                if (currentStep.compared && currentStep.compared.length > 0) {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
                if (currentStep.swapped) {
                  newStats.swaps = (newStats.swaps || 0) + 1
                }
                break
                
              case 'selectionSort':
                // Selection Sort uses 'comparingIndex' for comparisons and 'swapIndices' for swaps
                if (currentStep.comparingIndex !== undefined && currentStep.comparingIndex !== null) {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
                if (currentStep.swapIndices && currentStep.swapIndices.length > 0) {
                  newStats.swaps = (newStats.swaps || 0) + 1
                }
                break
                
              case 'insertionSort':
                // Insertion Sort uses 'comparingIndex' for comparisons
                if (currentStep.comparingIndex !== undefined && currentStep.comparingIndex !== null) {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
                // Insertion Sort doesn't have explicit swaps in the same way, but we can count shifts
                if (currentStep.shiftingIndex !== undefined && currentStep.shiftingIndex !== null) {
                  newStats.swaps = (newStats.swaps || 0) + 1
                }
                break
                
              case 'mergeSort':
                // Merge Sort doesn't have simple comparisons/swaps, but we can count merge operations
                if (currentStep.phase === 'merge-compare') {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
                if (currentStep.phase === 'merge-place') {
                  newStats.swaps = (newStats.swaps || 0) + 1
                }
                break
                
              case 'quickSort':
                // Quick Sort uses 'comparing' array for comparisons and 'swapped' array for swaps
                if (currentStep.comparing && currentStep.comparing.length > 0) {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
                if (currentStep.swapped && currentStep.swapped.length > 0) {
                  newStats.swaps = (newStats.swaps || 0) + 1
                }
                break
                
              default:
                // Fallback for any other sorting algorithms
                if (currentStep.compared && currentStep.compared.length > 0) {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
                if (currentStep.swapped) {
                  newStats.swaps = (newStats.swaps || 0) + 1
                }
            }
            break
            
          case 'searching':
            // Handle searching algorithms
            switch (algoInfo.id) {
              case 'linearSearch':
                // Linear Search checks each element
                if (currentStep.currentIndex !== undefined && currentStep.currentIndex !== null && currentStep.currentIndex >= 0) {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
                break
                
              case 'binarySearch':
                // Binary Search compares mid element with target
                if (currentStep.mid !== undefined && currentStep.mid !== null && currentStep.mid >= 0) {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
                break
                
              default:
                // Fallback for any other searching algorithms
                if (currentStep.currentIndex !== undefined && currentStep.currentIndex !== null && currentStep.currentIndex >= 0) {
                  newStats.comparisons = (newStats.comparisons || 0) + 1
                }
            }
            break
            
          case 'graph':
            // Handle graph algorithms
            // For graph algorithms, we can count node visits or edge traversals
            if (currentStep.visiting !== undefined && currentStep.visiting !== null) {
              newStats.comparisons = (newStats.comparisons || 0) + 1
            }
            break
            
          default:
            // Fallback for any other algorithm categories
            if (currentStep.compared && currentStep.compared.length > 0) {
              newStats.comparisons = (newStats.comparisons || 0) + 1
            }
            if (currentStep.swapped) {
              newStats.swaps = (newStats.swaps || 0) + 1
            }
        }
        
        return newStats
      })
    }
  }, [currentStep, algoInfo])

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

  const toggleFullscreen = () => {
    if (viewMode !== 'fullscreen') {
      // Enter fullscreen
      setViewMode('fullscreen')
    } else {
      // Exit fullscreen
      setViewMode('algorithm')
    }
  }

  const exitFullscreen = () => {
    setViewMode('algorithm')
  }

  if (!algoInfo) {
    console.log('No algorithm info found, rendering not found message')
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-xl font-bold text-red-600 mb-2">Algorithm Not Found</h2>
        <p className="mb-2">The algorithm with ID "{selectedAlgorithm}" could not be found.</p>
        <p className="text-sm">Please check that the algorithm ID matches one of the available algorithms.</p>
        <Link to="/dsa/algorithms" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Browse Algorithms
        </Link>
      </div>
    )
  }

  console.log('Rendering visualization page for algorithm:', algoInfo.name)

  // Render fullscreen mode
  if (viewMode === 'fullscreen') {
    return (
      <FullscreenContainer onClose={exitFullscreen}>
        <div className="flex flex-col h-full bg-gray-50" ref={fullscreenRef}>
          {/* Header with Title and Mode Buttons */}
          <div className="text-center p-4 md:p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {algoInfo?.name || 'Algorithm Visualizer'}
              </h1>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-gray-500 hover:text-gray-700"
                aria-label={showInfo ? "Hide algorithm information" : "Show algorithm information"}
              >
                <Info size={20} />
              </button>
            </div>

            {/* Mode Toggle Buttons */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => setViewMode('algorithm')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'algorithm' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🧩 Algorithm
              </button>
              <button
                onClick={() => setViewMode('visualize')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'visualize' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ▶️ Visualize
              </button>
              <button
                onClick={exitFullscreen}
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-blue-500 text-white shadow-md"
              >
                <Minimize2 size={16} />
                Collapse
              </button>
            </div>

            {showInfo && (
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4 mb-4 text-left">
                <p className="text-gray-600 text-sm">{algoInfo?.description}</p>
                
                {/* Use Cases */}
                {algoInfo?.useCases && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Real-world Use Cases:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {algoInfo.useCases.map((useCase, index) => (
                        <li key={index}>{useCase}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!showInfo && (
              <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                {algoInfo?.description.substring(0, 100)}...
              </p>
            )}
          </div>

          {/* Algorithm Info Section - Always show in fullscreen mode */}
          <div className="mb-4">
            <AlgorithmInfo 
              algoInfo={algoInfo}
            />
          </div>

          {/* Visualization Panel - Show in fullscreen mode */}
          <VisualizationPanel
            algoInfo={algoInfo}
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            inputArray={inputArray}
            searchTarget={searchTarget}
            hasSteps={hasSteps}
            isPlaying={isPlaying}
            play={play}
            pause={pause}
            initializeAlgorithm={initializeAlgorithm}
            stats={stats}
            handleArrayInputChange={handleArrayInputChange}
            generateRandomArray={generateRandomArray}
            reset={reset}
            setSearchTarget={setSearchTarget}
          />

          {/* Controller - Show in fullscreen mode */}
          {hasSteps && (
            <div className="px-4 md:px-6 pb-4 md:pb-6">
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
            </div>
          )}

          {/* Status Information - Show in fullscreen mode */}
          {currentStep && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mx-4 md:mx-6 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Info size={18} />
                Current Step
              </h4>
              <p className="text-gray-700 mb-3">{currentStep.description}</p>
              
              {/* Enhanced Status Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-3 border-t border-blue-100">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Comparisons</div>
                  <div className="text-lg font-bold text-blue-600">{stats.comparisons}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Swaps</div>
                  <div className="text-lg font-bold text-blue-600">{stats.swaps}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Time Complexity</div>
                  <div className="text-sm font-medium text-gray-700">
                    {algoInfo?.complexity?.time?.average || 'N/A'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Space Complexity</div>
                  <div className="text-sm font-medium text-gray-700">
                    {algoInfo?.complexity?.space || 'N/A'}
                  </div>
                </div>
              </div>
              
              {/* Keyboard Shortcuts Help */}
              <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-gray-600">
                <div className="flex flex-wrap gap-3">
                  <span>Keyboard: <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Space</kbd> Play/Pause</span>
                  <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">←</kbd> <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">→</kbd> Step</span>
                  <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Ctrl+R</kbd> Reset</span>
                  <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">A</kbd> Algorithm</span>
                  <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">V</kbd> Visualize</span>
                  <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">F</kbd> Fullscreen</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </FullscreenContainer>
    )
  }

  // Render normal mode
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Title and Mode Buttons */}
      <div className="text-center p-4 md:p-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {algoInfo?.name || 'Algorithm Visualizer'}
          </h1>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={showInfo ? "Hide algorithm information" : "Show algorithm information"}
          >
            <Info size={20} />
          </button>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setViewMode('algorithm')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'algorithm' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🧩 Algorithm
          </button>
          <button
            onClick={() => setViewMode('visualize')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'visualize' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ▶️ Visualize
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <Maximize2 size={16} />
            Fullscreen
          </button>
        </div>

        {showInfo && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4 mb-4 text-left">
            <p className="text-gray-600 text-sm">{algoInfo?.description}</p>
            
            {/* Use Cases */}
            {algoInfo?.useCases && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Real-world Use Cases:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {algoInfo.useCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!showInfo && (
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            {algoInfo?.description.substring(0, 100)}...
          </p>
        )}
      </div>

      {/* Algorithm Info Section - Only show in algorithm mode */}
      {viewMode === 'algorithm' && (
        <AlgorithmInfo 
          algoInfo={algoInfo}
        />
      )}

      {/* Visualization Panel - Show in visualize mode */}
      {viewMode === 'visualize' && (
        <VisualizationPanel
          algoInfo={algoInfo}
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          inputArray={inputArray}
          searchTarget={searchTarget}
          hasSteps={hasSteps}
          isPlaying={isPlaying}
          play={play}
          pause={pause}
          initializeAlgorithm={initializeAlgorithm}
          stats={stats}
          handleArrayInputChange={handleArrayInputChange}
          generateRandomArray={generateRandomArray}
          reset={reset}
          setSearchTarget={setSearchTarget}
        />
      )}

      {/* Controller - Show in visualize mode */}
      {viewMode === 'visualize' && hasSteps && (
        <div className="px-4 md:px-6 pb-4 md:pb-6">
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
        </div>
      )}

      {/* Status Information - Show in visualize mode */}
      {viewMode === 'visualize' && currentStep && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mx-4 md:mx-6 mb-4">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info size={18} />
            Current Step
          </h4>
          <p className="text-gray-700 mb-3">{currentStep.description}</p>
          
          {/* Enhanced Status Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-3 border-t border-blue-100">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Comparisons</div>
              <div className="text-lg font-bold text-blue-600">{stats.comparisons}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Swaps</div>
              <div className="text-lg font-bold text-blue-600">{stats.swaps}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Time Complexity</div>
              <div className="text-sm font-medium text-gray-700">
                {algoInfo?.complexity?.time?.average || 'N/A'}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Space Complexity</div>
              <div className="text-sm font-medium text-gray-700">
                {algoInfo?.complexity?.space || 'N/A'}
              </div>
            </div>
          </div>
          
          {/* Keyboard Shortcuts Help */}
          <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-gray-600">
            <div className="flex flex-wrap gap-3">
              <span>Keyboard: <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Space</kbd> Play/Pause</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">←</kbd> <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">→</kbd> Step</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Ctrl+R</kbd> Reset</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">A</kbd> Algorithm</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">V</kbd> Visualize</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">F</kbd> Fullscreen</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlgorithmVisualizer
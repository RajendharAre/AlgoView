import { useSelector, useDispatch } from 'react-redux'
import {
  play,
  pause,
  reset,
  setSpeed,
  updateStep,
  setInputData,
  setSearchTarget,
} from '../store/slices/algorithmSlice'
import { addNotification } from '../store/slices/uiSlice'
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Settings,
} from 'lucide-react'

const AlgorithmControllerRedux = () => {
  const dispatch = useDispatch()

  // Algorithm state from Redux
  const { isRunning, currentStep, totalSteps, speed, inputData, searchTarget, selectedAlgorithm } =
    useSelector(state => ({
      isRunning: state.algorithm.isRunning,
      currentStep: state.algorithm.currentStep,
      totalSteps: state.algorithm.steps.length,
      speed: state.algorithm.speed,
      inputData: state.algorithm.inputData,
      searchTarget: state.algorithm.searchTarget,
      selectedAlgorithm: state.algorithm.selectedAlgorithm,
    }))

  // Add proper event handlers
  const handlePlay = () => {
    dispatch(play())
    dispatch(
      addNotification({
        title: 'Algorithm Started',
        message: 'The algorithm visualization has started',
        type: 'info',
      })
    )
  }

  const handlePause = () => {
    dispatch(pause())
    dispatch(
      addNotification({
        title: 'Algorithm Paused',
        message: 'The algorithm visualization has been paused',
        type: 'info',
      })
    )
  }

  const handleReset = () => {
    dispatch(reset())
    dispatch(
      addNotification({
        title: 'Algorithm Reset',
        message: 'The algorithm visualization has been reset',
        type: 'info',
      })
    )
  }

  const handleSpeedChange = e => {
    const newSpeed = Number(e.target.value)
    dispatch(setSpeed(newSpeed))
    dispatch(
      addNotification({
        title: 'Speed Updated',
        message: `Visualization speed set to ${newSpeed}ms`,
        type: 'info',
      })
    )
  }

  const handleStepChange = e => {
    const newStep = Number(e.target.value)
    dispatch(updateStep(newStep))
  }

  const handleStepBack = () => {
    if (currentStep > 0) {
      dispatch(updateStep(currentStep - 1))
    }
  }

  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      dispatch(updateStep(currentStep + 1))
    }
  }

  const handleFirstStep = () => {
    dispatch(updateStep(0))
  }

  const handleLastStep = () => {
    dispatch(updateStep(Math.max(totalSteps - 1, 0)))
  }

  const handleArrayInputChange = e => {
    const inputText = e.target.value
    const newArray = inputText
      .split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => !isNaN(num))

    if (newArray.length > 0) {
      dispatch(setInputData(newArray))
      dispatch(reset())
      dispatch(
        addNotification({
          title: 'Input Data Updated',
          message: 'Array input has been updated',
          type: 'success',
        })
      )
    }
  }

  const handleSearchTargetChange = e => {
    const target = parseInt(e.target.value)
    if (!isNaN(target)) {
      dispatch(setSearchTarget(target))
      dispatch(
        addNotification({
          title: 'Search Target Updated',
          message: `Search target set to ${target}`,
          type: 'success',
        })
      )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Array Elements</label>
          <input
            type="text"
            value={inputData.join(', ')}
            onChange={handleArrayInputChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter numbers separated by commas"
          />
        </div>

        {(selectedAlgorithm === 'linearSearch' || selectedAlgorithm === 'binarySearch') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Target</label>
            <input
              type="number"
              value={searchTarget}
              onChange={handleSearchTargetChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Step: {currentStep + 1} / {totalSteps || 1}
          </span>
          <span>{totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Step Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFirstStep}
            disabled={currentStep === 0 || totalSteps === 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={handleStepBack}
            disabled={currentStep === 0 || totalSteps === 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Rewind size={20} />
          </button>

          {isRunning ? (
            <button
              onClick={handlePause}
              className="p-3 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors shadow-sm"
            >
              <Pause size={24} />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
              className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Play size={24} />
            </button>
          )}

          <button
            onClick={handleStepForward}
            disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FastForward size={20} />
          </button>

          <button
            onClick={handleLastStep}
            disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={18} />
            Reset
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <select
              value={speed}
              onChange={handleSpeedChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1000}>Slow</option>
              <option value={500}>Medium</option>
              <option value={100}>Fast</option>
              <option value={50}>Very Fast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step Slider */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <input
          type="range"
          min="0"
          max={Math.max(totalSteps - 1, 0)}
          value={currentStep}
          onChange={handleStepChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          disabled={totalSteps === 0}
        />
      </div>
    </div>
  )
}

export default AlgorithmControllerRedux

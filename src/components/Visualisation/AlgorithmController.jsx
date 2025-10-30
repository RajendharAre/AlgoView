import { Play, Pause, RotateCcw, SkipBack, SkipForward, FastForward, Rewind } from 'lucide-react'

const AlgorithmController = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onStepChange,
}) => {
  // Add proper event handlers
  const handlePlay = () => {
    console.log('Play button clicked')
    onPlay?.()
  }

  const handlePause = () => {
    console.log('Pause button clicked')
    onPause?.()
  }

  const handleReset = () => {
    console.log('Reset button clicked')
    onReset?.()
  }

  const handleSpeedChange = e => {
    console.log('Speed changed to:', e.target.value)
    onSpeedChange?.(Number(e.target.value))
  }

  const handleStepChange = e => {
    console.log('Step changed to:', e.target.value)
    onStepChange?.(Number(e.target.value))
  }

  const handleStepBack = () => {
    if (currentStep > 0) {
      onStepChange?.(currentStep - 1)
    }
  }

  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      onStepChange?.(currentStep + 1)
    }
  }

  const handleFirstStep = () => {
    onStepChange?.(0)
  }

  const handleLastStep = () => {
    onStepChange?.(totalSteps - 1)
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Step: {currentStep + 1} / {totalSteps}
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

          {isPlaying ? (
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

export default AlgorithmController
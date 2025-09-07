// src/components/Visualization/AlgorithmController.jsx
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

const AlgorithmController = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onStepChange
}) => {
  
  // Add proper event handlers
  const handlePlay = () => {
    console.log('Play button clicked');
    onPlay?.();
  };

  const handlePause = () => {
    console.log('Pause button clicked');
    onPause?.();
  };

  const handleReset = () => {
    console.log('Reset button clicked');
    onReset?.();
  };

  const handleSpeedChange = (e) => {
    console.log('Speed changed to:', e.target.value);
    onSpeedChange?.(Number(e.target.value));
  };

  const handleStepChange = (e) => {
    console.log('Step changed to:', e.target.value);
    onStepChange?.(Number(e.target.value));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            disabled={currentStep === 0}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={handlePlay}
            disabled={isPlaying || currentStep >= totalSteps - 1}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            <Play size={20} />
          </button>
          
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
          >
            <Pause size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Speed:</span>
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="border rounded px-2 py-1"
          >
            <option value={1000}>Slow</option>
            <option value={500}>Medium</option>
            <option value={100}>Fast</option>
            <option value={50}>Very Fast</option>
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Step: {currentStep + 1} / {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onStepChange?.(0)}
          disabled={currentStep === 0}
          className="p-1 disabled:opacity-50 hover:text-blue-600 transition-colors"
        >
          <SkipBack size={16} />
        </button>
        
        <input
          type="range"
          min="0"
          max={Math.max(totalSteps - 1, 0)}
          value={currentStep}
          onChange={handleStepChange}
          className="flex-1"
          disabled={totalSteps === 0}
        />
        
        <button
          onClick={() => onStepChange?.(totalSteps - 1)}
          disabled={currentStep === totalSteps - 1 || totalSteps === 0}
          className="p-1 disabled:opacity-50 hover:text-blue-600 transition-colors"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
};

export default AlgorithmController;
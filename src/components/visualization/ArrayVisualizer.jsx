/* eslint-disable no-unused-vars */
// src/components/visualization/ArrayVisualizer.jsx
import { motion } from 'framer-motion';
import { useAlgorithm } from '../../hooks/useAlgorithm';

const ArrayVisualizer = ({ algorithm, inputArray }) => {
  const { currentStep, isPlaying, speed, play, pause, reset } = useAlgorithm(algorithm, inputArray);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={play}
          disabled={isPlaying}
          className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-400"
        >
          Play
        </button>
        <button
          onClick={pause}
          disabled={!isPlaying}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg disabled:bg-gray-400"
        >
          Pause
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* Visualization */}
      <div className="flex items-end justify-center h-64 gap-1">
        {currentStep?.array.map((value, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              height: `${value * 10}px`,
              backgroundColor: currentStep.compared.includes(index) 
                ? '#ff4d4f' 
                : currentStep.swapped && currentStep.compared.includes(index)
                ? '#52c41a'
                : '#1890ff'
            }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-8 rounded-t-lg flex items-center justify-center text-white text-xs font-medium"
          >
            {value}
          </motion.div>
        ))}
      </div>

      {/* Status */}
      {currentStep?.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gray-100 rounded-lg text-center"
        >
          {currentStep.description}
        </motion.div>
      )}
    </div>
  );
};

export default ArrayVisualizer;
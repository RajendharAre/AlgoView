import React, { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2, Volume1 } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Enhanced Visualization Control Panel
 * Provides intuitive controls for stepping through algorithm visualizations
 */
const VisualizationControlPanel = ({
  isRunning = false,
  onPlay = () => {},
  onPause = () => {},
  onReset = () => {},
  onStepBack = () => {},
  onStepForward = () => {},
  currentStep = 0,
  totalSteps = 0,
  speed = 1,
  onSpeedChange = () => {},
  algorithName = 'Algorithm',
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  const speedOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2 },
  ]

  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{algorithName}</h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Step {currentStep + 1} of {totalSteps || 0}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 transition-all"
          title="Reset to beginning"
        >
          <RotateCcw size={20} />
        </motion.button>

        {/* Step Back Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStepBack}
          disabled={currentStep === 0}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Previous step"
        >
          <SkipBack size={20} />
        </motion.button>

        {/* Play/Pause Button - Primary */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? onPause : onPlay}
          className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all"
          title={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </motion.button>

        {/* Step Forward Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Next step"
        >
          <SkipForward size={20} />
        </motion.button>

        {/* Speed Control */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 transition-all flex items-center gap-2"
            title="Playback speed"
          >
            <Volume1 size={20} />
            <span className="text-sm font-semibold">{speed}x</span>
          </motion.button>

          {/* Speed Menu */}
          {showSpeedMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-full mb-2 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-2 min-w-[100px] z-50"
            >
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSpeedChange(option.value)
                    setShowSpeedMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                    speed === option.value
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{progressPercent.toFixed(0)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Speed</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{speed}x</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Steps</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{totalSteps}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default VisualizationControlPanel

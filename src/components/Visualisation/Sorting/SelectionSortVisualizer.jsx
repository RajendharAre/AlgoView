// src/components/Visualization/Sorting/SelectionSortVisualizer.jsx
import React from 'react'
import { motion as Motion } from 'framer-motion'
import '../../../styles/visualizers.css'

const SelectionSortVisualizer = ({ data = [], step = {}, stepIndex = null, totalSteps = null }) => {
  const arr = Array.isArray(step?.array) ? step.array : data

  const currentIndex = typeof step?.currentIndex === 'number' ? step.currentIndex : null
  const minIndex = typeof step?.minIndex === 'number' ? step.minIndex : null
  const comparingIndex = typeof step?.comparingIndex === 'number' ? step.comparingIndex : null
  const swapIndices = Array.isArray(step?.swapIndices) ? step.swapIndices : []
  const doneIndices = Array.isArray(step?.doneIndices) ? step.doneIndices : []

  return (
    <div className="w-full h-full flex flex-col">
      {/* Cards */}
      <div className="cards-row flex-1 min-h-0">
        {arr.map((value, idx) => {
          let stateClass = 'card-neutral'
          if (doneIndices.includes(idx)) stateClass = 'card-done'
          else if (swapIndices.includes(idx)) stateClass = 'card-shifting'
          else if (idx === minIndex) stateClass = 'card-key'
          else if (idx === comparingIndex) stateClass = 'card-comparing'
          else if (idx === currentIndex) stateClass = 'card-neutral' // keep current neutral unless min/swap

          return (
            <Motion.div
              key={idx}
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`card ${stateClass}`}
            >
              <div className="card-value">{value}</div>
            </Motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="legend">
        <span className="legend-item">
          <span className="legend-swatch sw-key" /> Current Min
        </span>
        <span className="legend-item">
          <span className="legend-swatch sw-compare" /> Comparing
        </span>
        <span className="legend-item">
          <span className="legend-swatch sw-shift" /> Swapping
        </span>
        <span className="legend-item">
          <span className="legend-swatch sw-done" /> Sorted
        </span>
      </div>

      {/* Step counter (optional) */}
      {typeof stepIndex === 'number' && typeof totalSteps === 'number' && (
        <div className="step-counter">
          Step {stepIndex + 1} / {totalSteps}
        </div>
      )}
    </div>
  )
}

export default SelectionSortVisualizer
import React from 'react'
import { History } from 'lucide-react'

/**
 * Reusable Time Complexity Section Component
 * Displays time and space complexity information for algorithms
 * Works with both graph and sorting algorithm info structures
 */
const TimeComplexitySection = ({ complexityInfo }) => {
  if (!complexityInfo) return null

  // Support both structures:
  // Graph: { timeComplexity: {...}, spaceComplexity: {...} }
  // Sorting: { time: {...}, space: '...' }
  const timeInfo = complexityInfo.timeComplexity || complexityInfo.time
  const spaceInfo = complexityInfo.spaceComplexity || complexityInfo.space

  return (
    <div className="mt-auto pt-4 border-t border-[#f1f3f5]">
      <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest mb-3 flex items-center gap-2">
        <History size={12} /> Complexity
      </h4>
      <div className="space-y-1 text-[10px] font-bold text-[#6c757d]">
        {timeInfo && (
          <>
            {(timeInfo.worst || timeInfo.worst === undefined) && (
              <div className="flex justify-between">
                <span>Worst:</span>
                <span className="font-mono">{timeInfo.worst || 'N/A'}</span>
              </div>
            )}
            {(timeInfo.average || timeInfo.average === undefined) && (
              <div className="flex justify-between">
                <span>Avg:</span>
                <span className="font-mono">{timeInfo.average || 'N/A'}</span>
              </div>
            )}
            {(timeInfo.best || timeInfo.best === undefined) && (
              <div className="flex justify-between">
                <span>Best:</span>
                <span className="font-mono">{timeInfo.best || 'N/A'}</span>
              </div>
            )}
          </>
        )}
        {spaceInfo && (
          <div className="flex justify-between">
            <span>Space:</span>
            <span className="font-mono">{typeof spaceInfo === 'string' ? spaceInfo : spaceInfo.value || 'N/A'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimeComplexitySection

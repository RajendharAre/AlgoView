import { motion as Motion } from 'framer-motion'

/**
 * InsertionSortVisualizer
 * - uses step.current (index of element being inserted)
 * - step.compared (array of indices being compared)
 * - step.sorted (array of sorted indices)
 *
 * Props:
 *  - data: number[]
 *  - step: { current: number, compared: number[], sorted: number[], description?: string }
 */
const InsertionSortVisualizer = ({ data = [], step = {} }) => {
  const current = typeof step?.current === 'number' ? step.current : -1
  const compared = Array.isArray(step?.compared) ? step.compared : []
  const sorted = Array.isArray(step?.sorted) ? step.sorted : []

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-center items-end gap-3 md:gap-4 flex-1 min-h-0">
        {data.map((value, idx) => {
          const isCurrent = idx === current
          const isCompared = compared.includes(idx)
          const isSorted = sorted.includes(idx)

          // color logic
          let bgClass = 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' // default: blue
          let borderClass = 'border-transparent'

          if (isSorted) {
            bgClass = 'bg-gradient-to-br from-green-400 to-green-500 text-white' // green for sorted
            borderClass = 'border-green-300'
          } else if (isCurrent) {
            bgClass = 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' // purple for current
            borderClass = 'border-purple-400'
          } else if (isCompared) {
            bgClass = 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' // yellow for comparing
            borderClass = 'border-yellow-400'
          }

          return (
            <Motion.div
              key={`${idx}-${value}`}
              layout
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: isCurrent ? -14 : 0,
                opacity: 1,
                scale: isCurrent ? 1.06 : 1,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className={`flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl shadow-md border-2 ${bgClass} ${borderClass} transition-all duration-200`}
            >
              <div className="text-base md:text-lg font-bold">{value}</div>
              <div className="text-xs mt-0.5 font-medium">
                {isCurrent ? 'curr' : ''}
              </div>
            </Motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
          <span className="text-gray-600">Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-purple-600"></div>
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
          <span className="text-gray-600">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-green-500"></div>
          <span className="text-gray-600">Sorted</span>
        </div>
      </div>
    </div>
  )
}

export default InsertionSortVisualizer
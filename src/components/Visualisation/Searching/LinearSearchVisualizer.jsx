import { motion as Motion } from 'framer-motion'

const LinearSearchVisualizer = ({ data = [], step = {}, target = null }) => {
  const currentIndex = typeof step?.currentIndex === 'number' ? step.currentIndex : -1
  const foundIndex = typeof step?.foundIndex === 'number' ? step.foundIndex : -1
  const isComplete = step?.isComplete === true

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-center items-end gap-3 md:gap-4 flex-1 min-h-0">
        {data.map((value, idx) => {
          let bgClass = 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
          let borderClass = 'border-transparent'
          let scale = 1
          let y = 0

          if (idx === currentIndex) {
            bgClass = 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
            borderClass = 'border-yellow-400'
            scale = 1.06
            y = -10
          } else if (idx === foundIndex && isComplete) {
            bgClass = 'bg-gradient-to-br from-green-400 to-green-500 text-white'
            borderClass = 'border-green-300'
          }

          return (
            <Motion.div
              key={`${idx}-${value}`}
              layout
              initial={{ y: 10, opacity: 0 }}
              animate={{ y, opacity: 1, scale }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className={`flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl shadow-md border-2 ${bgClass} ${borderClass} transition-all duration-200`}
            >
              <div className="text-base md:text-lg font-bold">{value}</div>
              <div className="text-xs mt-0.5 font-medium">
                {idx === currentIndex ? 'curr' : ''}
              </div>
            </Motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
          <span className="text-gray-600">Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-green-500"></div>
          <span className="text-gray-600">Found</span>
        </div>
      </div>

      {/* Target Display */}
      {target !== null && (
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Searching for: <span className="font-bold text-blue-600">{target}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default LinearSearchVisualizer
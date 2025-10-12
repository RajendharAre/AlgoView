import { motion as Motion } from 'framer-motion';

/**
 * BubbleSortVisualizer
 * - uses step.compared (array of two indices)
 * - step.swapped (boolean)
 * - step.doneIndex (index after which items are sorted)
 *
 * Props:
 *  - data: number[]
 *  - step: { compared: [i,j], swapped: boolean, doneIndex: number, description?: string }
 */
const BubbleSortVisualizer = ({ data = [], step = {} }) => {
  const compared = Array.isArray(step?.compared) ? step.compared : [];
  const swapped = !!step?.swapped;
  const doneIndex = typeof step?.doneIndex === 'number' ? step.doneIndex : data.length;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-center items-end gap-3 md:gap-4 h-56">
        {data.map((value, idx) => {
          const isCompared = compared.includes(idx);
          const isSorted = idx >= doneIndex;

          // color logic
          let bgClass = 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'; // default: blue
          let borderClass = 'border-transparent';
          
          if (isSorted) {
            bgClass = 'bg-gradient-to-br from-green-400 to-green-500 text-white'; // green for sorted
            borderClass = 'border-green-300';
          } else if (isCompared && swapped) {
            bgClass = 'bg-gradient-to-br from-red-500 to-red-600 text-white'; // red for swapped
            borderClass = 'border-red-400';
          } else if (isCompared) {
            bgClass = 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'; // yellow for comparing
            borderClass = 'border-yellow-400';
          }

          return (
            <Motion.div
              key={`${idx}-${value}`}
              layout
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: isCompared && swapped ? -14 : 0,
                opacity: 1,
                scale: isCompared && swapped ? 1.06 : 1,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className={`flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl shadow-md border-2 ${bgClass} ${borderClass} transition-all duration-200`}
            >
              <div className="text-base md:text-lg font-bold">{value}</div>
              {/* small label for pointers when compared */}
              <div className="text-xs mt-0.5 font-medium">
                {isCompared ? (compared[0] === idx ? 'i' : compared[1] === idx ? 'j' : '') : ''}
              </div>
            </Motion.div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
          <span className="text-gray-600">Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
          <span className="text-gray-600">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
          <span className="text-gray-600">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-green-500"></div>
          <span className="text-gray-600">Sorted</span>
        </div>
      </div>
    </div>
  );
};

export default BubbleSortVisualizer;
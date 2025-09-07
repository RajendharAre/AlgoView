// src/components/Visualization/Sorting/QuickSortVisualizer.jsx
import { motion as Motion } from 'framer-motion';

const QuickSortVisualizer = ({ data = [], step = {} }) => {
  const maxValue = Math.max(...data);
  const { pivotIndex, leftIndex, rightIndex, doneIndices = [] } = step;

  return (
    <div className="flex items-end justify-center gap-3 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-inner flex-wrap">
      {data.map((value, idx) => {
        // Determine colors
        let bgColor = 'bg-blue-300';
        if (idx === pivotIndex) bgColor = 'bg-pink-500'; // Pivot = pink
        else if (idx === leftIndex || idx === rightIndex) bgColor = 'bg-yellow-400'; // Currently compared = yellow
        else if (doneIndices.includes(idx)) bgColor = 'bg-green-500'; // Sorted = green

        return (
          <div key={idx} className="relative flex flex-col items-center">
            <Motion.div
              className={`relative flex items-end justify-center w-12 rounded-lg shadow-md ${bgColor}`}
              initial={{ height: 0 }}
              animate={{
                height: `${(value / maxValue) * 150}px`, // proportional height
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            >
              <span className="absolute -top-6 text-sm font-semibold text-gray-700">
                {value}
              </span>
            </Motion.div>
            {/* Labels */}
            {idx === pivotIndex && (
              <span className="text-xs mt-1 text-pink-700 font-semibold">Pivot</span>
            )}
            {(idx === leftIndex || idx === rightIndex) && (
              <span className="text-xs mt-1 text-yellow-800">Comparing</span>
            )}
            {doneIndices.includes(idx) && (
              <span className="text-xs mt-1 text-green-800 font-semibold">Sorted</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuickSortVisualizer;

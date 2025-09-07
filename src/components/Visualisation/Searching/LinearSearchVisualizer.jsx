// src/components/Visualization/Searching/LinearSearchVisualizer.jsx
import { motion as Motion } from 'framer-motion';

const LinearSearchVisualizer = ({ data = [], step = {}, target }) => {
  return (
    <div className="flex justify-center gap-3 p-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-inner flex-wrap">
      {data.map((value, idx) => {
        const isCurrent = step?.currentIndex === idx;
        const isFound = value === target && step?.foundIndex === idx;
        const bgColor = isFound
          ? 'bg-green-500'
          : isCurrent
          ? 'bg-yellow-400'
          : 'bg-blue-300';

        return (
          <div key={idx} className="relative flex flex-col items-center">
            <Motion.div
              className={`w-14 h-14 rounded-full shadow-md flex items-center justify-center font-bold text-white ${bgColor}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: isCurrent || isFound ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              {value}
            </Motion.div>
            {isCurrent && !isFound && (
              <span className="text-xs mt-1 text-gray-700">Checking</span>
            )}
            {isFound && (
              <span className="text-xs mt-1 text-green-800 font-semibold">
                Found
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LinearSearchVisualizer;

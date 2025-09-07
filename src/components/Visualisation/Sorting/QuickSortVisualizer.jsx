// src/components/Visualization/Sorting/QuickSortVisualizer.jsx
import { motion as Motion } from 'framer-motion';

const QuickSortVisualizer = ({ data, step = {} }) => {
  const { pivot, comparing = [], swapped = [], left, right } = step;

  const getCircleColor = (index) => {
    if (index === pivot) return 'bg-pink-500'; // pivot = neon pink
    if (swapped.includes(index)) return 'bg-yellow-400'; // swapped = yellow
    if (comparing.includes(index)) return 'bg-blue-400'; // currently comparing
    if (index >= left && index <= right) return 'bg-green-300'; // current partition
    return 'bg-gray-300'; // default
  };

  return (
    <div className="flex justify-center gap-4 p-6 bg-gray-100 rounded-xl shadow-inner flex-wrap">
      {data.map((value, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <Motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 15 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white shadow-md ${getCircleColor(idx)}`}
          >
            {value}
          </Motion.div>
          <span className="mt-2 text-xs text-gray-700">
            {idx === pivot ? 'P' : idx >= left && idx <= right ? '' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export default QuickSortVisualizer;

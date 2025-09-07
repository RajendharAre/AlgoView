/* eslint-disable no-unused-vars */
import { motion as Motion } from 'framer-motion';

const BinarySearchVisualizer = ({ data = [], step = {}, target }) => {
  const { low, mid, high, found } = step;

  const getCircleColor = (index) => {
    if (index === mid) return 'bg-pink-500'; // mid = neon pink
    if (index === low || index === high) return 'bg-blue-400'; // bounds = blue
    if (found && index === mid) return 'bg-green-500'; // found = green
    return 'bg-gray-300'; // default
  };

  return (
    <div className="flex justify-center gap-4 p-6 flex-wrap bg-gray-100 rounded-xl shadow-inner">
      {data.map((value, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <Motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: idx === mid ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white shadow-md ${getCircleColor(idx)}`}
          >
            {value}
          </Motion.div>
          <span className="mt-2 text-xs text-gray-700">
            {idx === low ? 'L' : idx === mid ? 'M' : idx === high ? 'H' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BinarySearchVisualizer;

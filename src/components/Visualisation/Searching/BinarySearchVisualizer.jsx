/* eslint-disable no-unused-vars */
// src/components/Visualization/Searching/BinarySearchVisualizer.jsx
import { motion as Motion } from 'framer-motion';

const BinarySearchVisualizer = ({ data = [], step = {}, target }) => {
  const { low = 0, mid = 0, high = data.length - 1 } = step;

  return (
    <div className="flex justify-center gap-3 p-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-inner flex-wrap">
      {data.map((value, idx) => {
        let bgColor = 'bg-blue-300';
        let scale = 1;

        if (idx === mid) {
          bgColor = 'bg-pink-500';
          scale = 1.2;
        } else if (idx === low || idx === high) {
          bgColor = 'bg-yellow-400';
          scale = 1.1;
        } else if (step.foundIndex === idx) {
          bgColor = 'bg-green-500';
          scale = 1.2;
        }

        return (
          <div key={idx} className="relative flex flex-col items-center">
            <Motion.div
              className={`w-14 h-14 rounded-full shadow-md flex items-center justify-center font-bold text-white ${bgColor}`}
              initial={{ scale: 0.8 }}
              animate={{ scale }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              {value}
            </Motion.div>
            {idx === mid && <span className="text-xs mt-1 text-pink-700">Mid</span>}
            {idx === low && <span className="text-xs mt-1 text-yellow-800">Low</span>}
            {idx === high && <span className="text-xs mt-1 text-yellow-800">High</span>}
            {step.foundIndex === idx && (
              <span className="text-xs mt-1 text-green-800 font-semibold">Found</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BinarySearchVisualizer;

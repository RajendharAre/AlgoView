// src/components/Visualization/SearchingVisualizer.jsx
import { motion as Motion } from 'framer-motion';

const SearchingVisualizer = ({ data }) => {
  return (
    <div className="flex justify-center gap-4 p-4 bg-gray-50 rounded-xl shadow-inner">
      {data.map((value, idx) => (
        <Motion.div
          key={idx}
          className="flex items-center justify-center w-12 h-12 bg-green-400 text-white font-bold rounded-lg shadow"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {value}
        </Motion.div>
      ))}
    </div>
  );
};

export default SearchingVisualizer;

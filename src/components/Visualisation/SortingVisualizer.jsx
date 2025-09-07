// src/components/Visualization/SortingVisualizer.jsx
import { motion as Motion } from 'framer-motion';

const SortingVisualizer = ({ data }) => {
  return (
    <div className="flex justify-center items-end gap-2 h-64 bg-gray-50 rounded-xl p-4 shadow-inner">
      {data.map((value, idx) => (
        <Motion.div
          key={idx}
          className="bg-indigo-500 rounded-t-md"
          initial={{ height: 0 }}
          animate={{ height: value * 3 }}
          transition={{ duration: 0.5 }}
          style={{ width: '20px' }}
          title={value}
        />
      ))}
    </div>
  );
};

export default SortingVisualizer;

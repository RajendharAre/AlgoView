/* eslint-disable no-unused-vars */
// src/components/Visualization/ArrayVisualizer.jsx
import { motion } from 'framer-motion';

const ArrayVisualizer = ({ data, highlights = [], algorithmType = 'sorting' }) => {
  const getBarColor = (index, highlights) => {
    const highlight = highlights.find(h => h.index === index);
    if (!highlight) return 'bg-blue-500';
    
    switch (highlight.color) {
      case 'compare': return 'bg-yellow-500';
      case 'swap': return 'bg-red-500';
      case 'sorted': return 'bg-green-500';
      case 'checking': return 'bg-orange-500';
      case 'found': return 'bg-green-500';
      case 'pivot': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const maxValue = Math.max(...data, 10);

  return (
    <div className="w-full bg-gray-100 rounded-lg p-4">
      <div className="flex items-end justify-center gap-1 h-64">
        {data.map((value, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              height: `${(value / maxValue) * 100}%`,
            }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className={`
              w-8 rounded-t-lg flex items-center justify-center 
              text-white text-xs font-bold transition-all duration-300
              ${getBarColor(index, highlights)}
            `}
            style={{ minWidth: '2rem' }}
          >
            {value}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ArrayVisualizer;
// src/components/Visualization/Sorting/InsertionSortVisualizer.jsx
import { motion as Motion } from 'framer-motion';

/**
 * InsertionSortVisualizer (Card-style)
 * - expects step to contain: keyIndex, shiftingIndex, keyPlacedIndex, comparingIndex, keyValue (optional).
 *
 * Visual: cards (like playing cards) that slide into place.
 */
const InsertionSortVisualizer = ({ data = [], step = {} }) => {
  const keyIndex = typeof step?.keyIndex === 'number' ? step.keyIndex : null;
  const shiftingIndex = typeof step?.shiftingIndex === 'number' ? step.shiftingIndex : null;
  const keyPlacedIndex = typeof step?.keyPlacedIndex === 'number' ? step.keyPlacedIndex : null;
  const comparingIndex = typeof step?.comparingIndex === 'number' ? step.comparingIndex : null;

  return (
    <div className="p-6 bg-[#ffffff] rounded-xl shadow-lg">
      <div className="flex items-end gap-4 justify-center h-56">
        {data.map((value, idx) => {
          const isKey = idx === keyIndex;
          const isPlaced = idx === keyPlacedIndex;
          const isShifting = idx === shiftingIndex;
          const isComparing = idx === comparingIndex;

          let bgClass = 'bg-[#4eb3c1] text-[#ffffff]'; // azure cards by default
          if (isKey) bgClass = 'bg-[#480360] text-[#ffffff]'; // key card: dark neon
          if (isPlaced) bgClass = 'bg-[#a14097] text-[#ffffff]'; // placed: neon pink
          if (isShifting) bgClass = 'bg-[#ffffff] text-[#480360] border-2 border-[#4eb3c1]'; // shifting (white card with azure border)
          if (isComparing) bgClass = 'bg-[#4eb3c1] text-[#ffffff] ring-2 ring-[#a14097]';

          return (
            <Motion.div
              key={idx}
              layout
              initial={{ rotateX: 20, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1, y: isShifting ? -18 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className={`w-16 h-24 rounded-xl shadow-lg flex items-center justify-center font-bold ${bgClass}`}
              style={{ perspective: 800 }}
            >
              {value}
            </Motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InsertionSortVisualizer;

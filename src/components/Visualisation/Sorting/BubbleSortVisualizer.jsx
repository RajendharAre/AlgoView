// src/components/Visualization/Sorting/BubbleSortVisualizer.jsx
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
    <div className="p-6 bg-[#ffffff] rounded-xl shadow-lg">
      <div className="flex justify-center items-end gap-4 h-56">
        {data.map((value, idx) => {
          const isCompared = compared.includes(idx);
          const isSorted = idx >= doneIndex;

          // color logic using only allowed colors
          let bgClass = 'bg-[#480360] text-[#ffffff]'; // default: dark neon pink
          if (isSorted) {
            bgClass = 'bg-[#ffffff] text-[#480360]'; // white background for sorted, text primary
          } else if (isCompared && swapped) {
            bgClass = 'bg-[#a14097] text-[#ffffff]'; // neon pink for swapped
          } else if (isCompared) {
            bgClass = 'bg-[#4eb3c1] text-[#ffffff]'; // azure for comparing
          }

          return (
            <Motion.div
              key={idx}
              layout
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: isCompared && swapped ? -14 : 0,
                opacity: 1,
                scale: isCompared && swapped ? 1.06 : 1,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-md border-2 ${bgClass}`}
            >
              <div className="text-lg font-bold">{value}</div>
              {/* small label for pointers when compared */}
              <div className="text-xs mt-1" style={{ color: '#480360' }}>
                {isCompared ? (compared[0] === idx ? 'i' : compared[1] === idx ? 'j' : '') : ''}
              </div>
            </Motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BubbleSortVisualizer;

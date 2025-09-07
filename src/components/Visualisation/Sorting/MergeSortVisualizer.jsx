// src/components/Visualization/Sorting/MergeSortVisualizer.jsx
import { motion as Motion } from 'framer-motion';

/**
 * MergeSortVisualizer
 * - Uses step.range, step.leftWindow, step.rightWindow, step.mergedIndex, step.phase
 * - Visual: bars with left/right/merge windows highlighted
 */
const MergeSortVisualizer = ({ data = [], step = {} }) => {
  const maxValue = Math.max(...data, 1);
  const range = Array.isArray(step?.range) ? step.range : null;
  const leftWindow = Array.isArray(step?.leftWindow) ? step.leftWindow : null;
  const rightWindow = Array.isArray(step?.rightWindow) ? step.rightWindow : null;
  const mergedIndex = typeof step?.mergedIndex === 'number' ? step.mergedIndex : null;
  const phase = step?.phase || '';

  const inRange = (idx, r) => (r ? idx >= r[0] && idx <= r[1] : false);

  return (
    <div className="p-6 bg-[#ffffff] rounded-xl shadow-lg">
      <div className="flex items-end gap-3 justify-center h-64">
        {data.map((value, idx) => {
          const isLeft = inRange(idx, leftWindow);
          const isRight = inRange(idx, rightWindow);
          const isActiveRange = inRange(idx, range);
          const isMerged = idx === mergedIndex;

          let bgClass = 'bg-[#480360] text-[#ffffff]'; // default
          if (isLeft) bgClass = 'bg-[#4eb3c1] text-[#ffffff]';
          if (isRight) bgClass = 'bg-[#a14097] text-[#ffffff]';
          if (isActiveRange) bgClass = 'bg-[#ffffff] text-[#480360] border-2 border-[#4eb3c1]';
          if (isMerged) bgClass = 'bg-[#4eb3c1] text-[#ffffff] ring-2 ring-[#a14097]';

          return (
            <div key={idx} className="flex flex-col items-center justify-end">
              <Motion.div
                layout
                initial={{ height: 0, opacity: 0.6 }}
                animate={{ height: `${(value / maxValue) * 100}%`, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                className={`w-12 rounded-t-md shadow-md ${bgClass}`}
                style={{ minHeight: 20 }}
              />
              <div className="mt-2 text-sm font-semibold text-[#480360]">{value}</div>
            </div>
          );
        })}
      </div>

      {phase && <div className="mt-3 text-center text-sm text-[#480360]">Phase: {phase}</div>}
    </div>
  );
};

export default MergeSortVisualizer;

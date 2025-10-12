import { motion as Motion } from 'framer-motion';

/**
 * BinarySearchVisualizer
 * - uses step.left, step.right, step.mid (indices)
 * - step.found (boolean)
 * - step.compared (value at mid)
 * - highlights: array of indices to highlight
 *
 * Props:
 *  - data: number[]
 *  - step: { left: number, right: number, mid: number, found: boolean, compared: number }
 *  - target: number
 */
const BinarySearchVisualizer = ({ data = [], step = {}, target = null }) => {
  const left = typeof step?.left === 'number' ? step.left : 0;
  const right = typeof step?.right === 'number' ? step.right : data.length - 1;
  const mid = typeof step?.mid === 'number' ? step.mid : Math.floor((left + right) / 2);
  const found = !!step?.found;
  const compared = typeof step?.compared === 'number' ? step.compared : null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap min-h-32">
        {data.map((value, idx) => {
          let bgClass = 'bg-gradient-to-br from-blue-500 to-blue-600 text-white';
          let borderClass = 'border-transparent';
          let label = '';
          
          if (idx < left || idx > right) {
            bgClass = 'bg-gray-200 text-gray-500'; // eliminated
            borderClass = 'border-gray-300';
          } else if (idx === mid) {
            if (found) {
              bgClass = 'bg-gradient-to-br from-green-500 to-green-600 text-white'; // found
              borderClass = 'border-green-400';
              label = 'Found!';
            } else {
              bgClass = 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'; // current mid
              borderClass = 'border-yellow-400';
              label = 'Mid';
            }
          } else if (idx === left) {
            bgClass = 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'; // left pointer
            borderClass = 'border-purple-400';
            label = 'Left';
          } else if (idx === right) {
            bgClass = 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'; // right pointer
            borderClass = 'border-pink-400';
            label = 'Right';
          }

          return (
            <Motion.div
              key={`${idx}-${value}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl shadow-md border-2 ${bgClass} ${borderClass} transition-all duration-200`}
            >
              <div className="text-sm md:text-base font-bold">{value}</div>
              {label && (
                <div className="text-xs mt-0.5 font-medium bg-black/20 px-1 rounded">
                  {label}
                </div>
              )}
            </Motion.div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
          <span className="text-gray-600">In Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-purple-600"></div>
          <span className="text-gray-600">Left Pointer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-pink-500 to-pink-600"></div>
          <span className="text-gray-600">Right Pointer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
          <span className="text-gray-600">Mid Point</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-green-600"></div>
          <span className="text-gray-600">Found</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200"></div>
          <span className="text-gray-600">Eliminated</span>
        </div>
      </div>
      
      {/* Info Panel */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Target:</span>
            <span className="font-medium text-gray-800">{target}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Left:</span>
            <span className="font-medium text-gray-800">{left}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Right:</span>
            <span className="font-medium text-gray-800">{right}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mid:</span>
            <span className="font-medium text-gray-800">{mid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Compared:</span>
            <span className="font-medium text-gray-800">{compared}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Found:</span>
            <span className={`font-medium ${found ? 'text-green-600' : 'text-red-600'}`}>
              {found ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;
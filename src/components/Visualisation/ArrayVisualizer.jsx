import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Array Visualizer Component
 * Visualizes array elements as vertical bars with color-coded states
 * 
 * @param {Object} props - Component props
 * @param {number[]} props.array - Array of numbers to visualize
 * @param {number[]} props.comparing - Indices currently being compared
 * @param {number[]} props.sorted - Indices that are sorted
 * @param {number[]} props.swapping - Indices currently being swapped
 * @param {number} props.maxHeight - Maximum height for bars (default: 340)
 * @param {Object} props.colors - Color palette object
 * @param {boolean} props.showIndices - Whether to show array indices
 * @param {string} props.className - Additional CSS classes
 */
const ArrayVisualizer = ({
  array = [],
  comparing = [],
  sorted = [],
  swapping = [],
  maxHeight = 340,
  colors,
  showIndices = true,
  className = ''
}) => {
  // Default color palette if none provided
  const defaultColors = {
    unsorted: '#ced4daff',
    comparing: '#495057ff',
    swapping: '#212529ff',
    sorted: '#6c757dff',
    background: '#f8f9faff'
  };

  const colorPalette = colors || defaultColors;

  if (array.length === 0) {
    return (
      <div className={`w-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl ${className}`}>
        <div className="text-gray-400">
          <div className="w-8 h-8 mx-auto mb-2 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest">No data to visualize</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-5xl h-96 flex items-end gap-1.5 px-8 ${className}`}>
      {array.map((value, idx) => {
        const isSorted = Array.isArray(sorted) ? sorted.includes(idx) : false;
        const isComparing = Array.isArray(comparing) ? comparing.includes(idx) : false;
        const isSwapping = Array.isArray(swapping) ? swapping.includes(idx) : false;

        // Determine bar color based on state
        let barColor = colorPalette.unsorted;
        let scale = "scale-100";
        let shadow = "";

        if (isSwapping) {
          barColor = colorPalette.swapping;
          scale = "scale-105";
          shadow = "shadow-xl ring-2 ring-white";
        } else if (isComparing) {
          barColor = colorPalette.comparing;
          scale = "scale-105";
        } else if (isSorted) {
          barColor = colorPalette.sorted;
        }

        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-3">
            <div className="relative w-full group">
              <motion.div 
                className={`w-full rounded-t-lg transition-all duration-300 ${scale} ${shadow}`}
                style={{ 
                  height: `${Math.min(value * 3.5, maxHeight)}px`, 
                  backgroundColor: barColor,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                  {value}
                </div>
              </motion.div>
            </div>
            {showIndices && (
              <span className={`text-xs font-black transition-colors ${
                isComparing || isSwapping ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {idx}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ArrayVisualizer;
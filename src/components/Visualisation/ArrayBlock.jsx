import React from 'react';
import { COLORS } from '../../constants/visualizationConstants';

const ArrayBlock = ({ 
  value, 
  index, 
  isComparing, 
  isSwapping, 
  isSorted, 
  isActive, 
  inRange, 
  isPivot, 
  isI, 
  isJ, 
  size = 'normal', 
  showIndex = false 
}) => {
  let bg = COLORS.platinum;
  let textColor = COLORS.gunmetal;
  let borderStyle = "border-transparent";
  let scale = "scale-100";
  let elevation = "translate-y-0";
  let widthClass = "w-12 h-12";
  let fontSize = "text-xs";

  if (size === 'large') {
    widthClass = "w-14 h-14";
    fontSize = "text-sm";
  } else if (size === 'small') {
    widthClass = "w-10 h-10";
    fontSize = "text-xs";
  }

  // Priority order for visual states
  if (isSwapping) {
    bg = COLORS.carbonBlack;
    textColor = 'white';
    scale = "scale-110";
    elevation = "translate-y-0";
  } else if (isPivot) {
    bg = COLORS.carbonBlack;
    textColor = 'white';
    scale = "scale-110";
    elevation = "-translate-y-4";
  } else if (isI) {
    bg = COLORS.slateGrey;
    textColor = 'white';
    scale = "scale-105";
  } else if (isJ) {
    bg = COLORS.paleSlate2;
    textColor = COLORS.gunmetal;
    scale = "scale-105";
  } else if (isComparing) {
    bg = COLORS.slateGrey;
    textColor = 'white';
    scale = "scale-105";
  } else if (isActive) {
    bg = COLORS.platinum;
    borderStyle = `2px solid ${COLORS.carbonBlack}`;
    scale = "scale-110";
  } else if (inRange && !isSorted) {
    bg = COLORS.platinum;
    borderStyle = `2px solid ${COLORS.carbonBlack}`;
  } else if (isSorted) {
    bg = COLORS.alabasterGrey;
    textColor = COLORS.adb5bd;
  } else {
    bg = COLORS.e9ecefff; // platinum for unsorted/inactive
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={`${widthClass} rounded-lg flex items-center justify-center ${fontSize} font-black transition-all duration-300 shadow-sm ${scale} ${elevation}`}
        style={{ 
          backgroundColor: bg, 
          color: textColor,
          border: borderStyle
        }}
      >
        {value}
      </div>
      {showIndex && (
        <div className="text-[8px] font-bold text-[#adb5bd]">i:{index}</div>
      )}
    </div>
  );
};

export default ArrayBlock;
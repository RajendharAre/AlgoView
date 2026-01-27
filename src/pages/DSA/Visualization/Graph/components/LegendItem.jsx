import React from 'react';

const LegendItem = ({ color, label, border }) => (
  <div className="flex items-center gap-2">
    <div 
      className={`w-3 h-3 rounded-full ${border ? 'border border-[#dee2e6]' : ''}`} 
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
);

export default LegendItem;
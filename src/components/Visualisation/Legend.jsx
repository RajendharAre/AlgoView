import React from 'react';
import { Info } from 'lucide-react';
import { COLORS } from '../../constants/visualizationConstants';

const Legend = ({ items, description, showDivider = true }) => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
      <div className="flex items-center gap-6">
        {items.map((item, index) => (
          <LegendItem key={index} color={item.color} label={item.label} icon={item.icon} />
        ))}
      </div>
      
      {showDivider && <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>}
      
      {description && (
        <div className="flex items-center gap-2">
          <Info size={14} className="text-[#adb5bd]" />
          <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
            {description}
          </span>
        </div>
      )}
    </div>
  );
};

const LegendItem = ({ color, label, icon }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}>
      {icon && <div className="flex items-center justify-center w-full h-full">{icon}</div>}
    </div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
);

export default Legend;
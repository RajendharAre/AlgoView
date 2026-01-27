import React from 'react';

const ToolButton = ({ active, onClick, disabled, icon, label, desc, danger }) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left disabled:opacity-30 ${active 
      ? 'bg-[#212529] border-[#212529] shadow-md translate-x-1' 
      : 'bg-white border-transparent hover:bg-[#f8f9faff] hover:border-[#dee2e6]'}`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active 
      ? 'bg-white/20 text-white' 
      : danger 
        ? 'bg-red-50 text-red-500' 
        : 'bg-[#f1f3f5] text-[#6c757d]'}`}>
      {icon}
    </div>
    <div className="overflow-hidden">
      <div className={`text-[11px] font-bold truncate ${active ? 'text-white' : 'text-[#212529]'}`}>
        {label}
      </div>
      <div className={`text-[8px] font-medium leading-none mt-0.5 truncate ${active ? 'text-white/60' : 'text-[#adb5bd]'}`}>
        {desc}
      </div>
    </div>
  </button>
);

export default ToolButton;
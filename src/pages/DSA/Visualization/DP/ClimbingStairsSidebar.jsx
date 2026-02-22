import React from 'react';
import {
  Play,
  RotateCcw,
  Activity,
  Layers,
  Hash,
  TrendingUp,
  Footprints,
  ChevronUp
} from 'lucide-react';
import TimeComplexitySection from '../../../components/Common/TimeComplexitySection';

const ClimbingStairsSidebar = ({
  n,
  setN,
  isRunning,
  speedIndex,
  onSpeedChange,
  onRun,
  onReset,
  status,
  dp,
  currentIndex,
  MAX_STAIRS,
  SPEEDS,
  complexityInfo
}) => {
  return (
    <aside className="w-80 bg-white border-r border-[#dee2e6] flex flex-col shrink-0 shadow-lg z-20 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-[#f1f3f5]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-[#212529] rounded flex items-center justify-center text-white">
            <Footprints size={18} />
          </div>
          <h1 className="text-base font-bold tracking-tight">Climbing Stairs</h1>
        </div>
        <p className="text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">DP Visualizer</p>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-[#f1f3f5] space-y-6">
        {/* Steps Count Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider flex items-center gap-2">
              <Hash size={12} /> Steps Count
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#f8f9faff] border rounded-md">n = {n}</span>
          </div>
          <input
            type="range"
            min="3"
            max={MAX_STAIRS}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full accent-[#212529] cursor-pointer"
          />
        </div>

        {/* Speed Control */}
        <div>
          <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity size={12} /> Simulation Speed
          </h3>
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
            {SPEEDS.map((s, idx) => (
              <button
                key={s.label}
                onClick={() => onSpeedChange(idx)}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  speedIndex === idx
                    ? 'bg-[#212529] text-white shadow-md'
                    : 'text-[#6c757d] hover:bg-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-b border-[#f1f3f5] space-y-2">
        <button
          onClick={onRun}
          disabled={isRunning}
          className="w-full py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-md active:scale-95 disabled:opacity-30 transition-all"
        >
          <Play size={14} fill="white" /> Start Calculation
        </button>
        <button
          onClick={onReset}
          className="w-full py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
        >
          <RotateCcw size={12} className="inline mr-1" /> Reset Grid
        </button>
      </div>

      {/* Status and DP Array */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#fafafa]">
        {/* Status Box */}
        <div
          className={`p-4 rounded-xl border-l-4 transition-all ${
            isRunning ? 'bg-[#212529] text-white' : 'bg-white border-[#dee2e6]'
          }`}
        >
          <p className="text-[9px] font-black uppercase opacity-60 mb-1">Status</p>
          <p className="text-xs font-bold leading-tight min-h-[2.5rem]">{status}</p>
        </div>

        {/* DP Array Display */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
            <Layers size={12} /> DP Array [Ways]
          </h4>
          <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
            {dp.map((val, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all duration-300
                  ${
                    currentIndex === idx
                      ? 'bg-[#212529] text-white border-[#212529] scale-105'
                      : idx === currentIndex - 1 || idx === currentIndex - 2
                      ? 'bg-[#e9ecefff] border-[#6c757d] font-bold'
                      : val !== null
                      ? 'bg-white border-[#dee2e6] text-[#6c757d]'
                      : 'bg-transparent border-dashed border-[#dee2e6] opacity-30'
                  }
                `}
              >
                <span className="opacity-50 font-black">ways[{idx}]</span>
                <span className="font-bold">{val !== null ? val : '--'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Complexity Section */}
        {complexityInfo && (
          <div className="pt-4 border-t border-[#f1f3f5]">
            <TimeComplexitySection complexityInfo={complexityInfo} />
          </div>
        )}
      </div>
    </aside>
  );
};

export default ClimbingStairsSidebar;

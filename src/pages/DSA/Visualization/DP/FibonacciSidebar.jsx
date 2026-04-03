import React from 'react';
import {
  Play,
  RotateCcw,
  Activity,
  Info,
  Layers,
  Hash,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import TimeComplexitySection from '../../../../components/Visualisation/TimeComplexitySection';

const FibonacciSidebar = ({
  n,
  setN,
  isRunning,
  speedIndex,
  onSpeedChange,
  onRun,
  onReset,
  status,
  sequence,
  currentIndex,
  SPEEDS,
  MAX_N,
  complexityInfo,
}) => {
  return (
    <aside className="w-full md:w-80 bg-white border-r border-[#dee2e6] flex flex-col shrink-0 shadow-lg z-20 overflow-y-auto">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-[#f1f3f5] sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 bg-[#212529] rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Go back to algorithms"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-sm md:text-base font-bold tracking-tight truncate">Fibonacci Solver</h1>
        </div>
        <p className="text-[9px] md:text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">
          Dynamic Programming
        </p>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex-1 overflow-y-auto">
        {/* Input Controls Section */}
        <section className="space-y-4 md:space-y-6">
          {/* Sequence Length */}
          <div>
            <div className="flex justify-between items-center mb-2 md:mb-3">
              <h3 className="text-[9px] sm:text-[10px] font-black text-[#adb5bd] uppercase tracking-wider flex items-center gap-2">
                <Hash size={12} /> Sequence Length
              </h3>
              <span className="text-[10px] sm:text-xs font-mono font-bold bg-[#212529] text-white px-2 py-0.5 rounded-full">
                {n}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max={MAX_N}
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full h-1.5 bg-[#e9ecefff] rounded-lg appearance-none cursor-pointer accent-[#212529] disabled:opacity-50"
            />
            <div className="flex justify-between text-[8px] text-[#adb5bd] mt-1 px-0.5">
              <span>2</span>
              <span>Max {MAX_N}</span>
            </div>
          </div>

          {/* Speed Control */}
          <div>
            <h3 className="text-[9px] sm:text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-2 md:mb-3 flex items-center gap-2">
              <Activity size={12} /> Speed
            </h3>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
              {SPEEDS.map((s, idx) => (
                <button
                  key={s.label}
                  onClick={() => onSpeedChange(idx)}
                  disabled={isRunning}
                  className={`py-1.5 text-[8px] sm:text-[9px] font-bold rounded-lg transition-all disabled:opacity-50 ${
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
        </section>

        {/* Action Buttons */}
        <section className="space-y-2 pt-4 border-t border-[#f1f3f5]">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="w-full py-2.5 md:py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] sm:text-xs shadow-md active:scale-95 disabled:opacity-30 transition-all"
          >
            <Play size={14} fill="white" /> Generate Series
          </button>
          <button
            onClick={onReset}
            disabled={isRunning}
            className="w-full py-2 md:py-2.5 bg-white border border-[#dee2e6] text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RotateCcw size={12} className="inline mr-1" /> Reset
          </button>
        </section>

        {/* Live Log Section */}
        <section className="space-y-3 md:space-y-4 pt-4 border-t border-[#f1f3f5]">
          <div
            className={`p-3 md:p-4 rounded-xl border-l-4 transition-all ${
              isRunning
                ? 'bg-[#212529] text-white shadow-md'
                : 'bg-[#f8f9faff] border-[#dee2e6]'
            }`}
          >
            <p className="text-[8px] sm:text-[9px] font-black uppercase opacity-60 mb-1 flex items-center gap-1">
              <Info size={10} /> Live Log
            </p>
            <p className="text-[9px] md:text-[11px] font-bold leading-relaxed h-12 md:h-14 overflow-hidden">
              {status}
            </p>
          </div>

          {/* DP Table Visualization */}
          <div className="space-y-2">
            <h4 className="text-[8px] sm:text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
              <Layers size={12} /> DP Table
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-48 md:max-h-56 overflow-y-auto pr-2">
              {sequence.map((val, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center p-2 rounded-lg border text-[8px] sm:text-xs font-mono transition-all duration-300
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
                  <span className="opacity-50 font-black text-[7px] sm:text-[8px]">F({idx})</span>
                  <span className="font-bold">{val !== null ? val : '--'}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Time Complexity Section */}
        <section className="space-y-3 md:space-y-4 pt-4 border-t border-[#f1f3f5] pb-8 md:pb-12">
          {complexityInfo && <TimeComplexitySection complexityInfo={complexityInfo} />}
        </section>
      </div>
    </aside>
  );
};

export default FibonacciSidebar;

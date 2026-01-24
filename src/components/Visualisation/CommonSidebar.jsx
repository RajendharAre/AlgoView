import React from 'react';
import { 
  ArrowLeft,
  Activity,
  Keyboard,
  Lock,
  History,
  RefreshCw,
  RotateCcw,
  Play
} from 'lucide-react';
import { COLORS, SPEEDS } from '../../constants/visualizationConstants';

const CommonSidebar = ({
  algorithmTitle,
  algorithmSubtitle,
  inputValue,
  onInputChange,
  isRunning,
  onRunAlgorithm,
  onGenerateRandom,
  onReset,
  speedIndex,
  onSpeedChange,
  currentStep,
  stats,
  complexityInfo,
  runButtonText = "Start Algorithm",
  inputPlaceholder = "10, 20, 30...",
  inputLabel = "Input Data",
  showInput = true,
  children
}) => {
  return (
    <aside className="w-80 bg-white border-r border-[#dee2e6] flex flex-col shrink-0 shadow-lg z-20 overflow-y-auto">
      <div className="p-6 border-b border-[#f1f3f5]">
        <div className="flex items-center gap-3 mb-1">
          <button 
            onClick={() => window.history.back()} 
            className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            aria-label="Go back to algorithms"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-bold tracking-tight">{algorithmTitle}</h1>
        </div>
        <p className="text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">{algorithmSubtitle}</p>
      </div>

      <div className="p-6 border-b border-[#f1f3f5]">
         <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-3 flex items-center gap-2">
           <Activity size={12} /> Speed
         </h3>
         <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
            {SPEEDS.map((s, idx) => (
              <button
                key={s.label}
                onClick={() => onSpeedChange(idx)}
                className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${speedIndex === idx ? 'bg-[#212529] text-white shadow-md' : 'text-[#6c757d] hover:bg-slate-100'}`}
              >
                {s.label}
              </button>
            ))}
         </div>
      </div>

      {showInput && (
        <div className="p-6 border-b border-[#f1f3f5]">
          <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><Keyboard size={12} /> {inputLabel}</span>
            {isRunning && <Lock size={10} className="text-amber-600" />}
          </h3>
          <textarea 
            value={inputValue}
            onChange={onInputChange}
            disabled={isRunning}
            className="w-full h-20 p-3 text-xs font-mono rounded-xl border border-[#dee2e6] focus:ring-1 focus:ring-black outline-none transition-all resize-none"
            placeholder={inputPlaceholder}
          />
        </div>
      )}

      <div className="p-6 border-b border-[#f1f3f5] space-y-2">
          <button 
            onClick={onRunAlgorithm}
            disabled={isRunning}
            className="w-full py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-30 transition-transform active:scale-95 shadow-md"
          >
            <Play size={14} fill="white" /> {runButtonText}
          </button>
          <div className="flex gap-2">
              <button onClick={onGenerateRandom} disabled={isRunning} className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
                  <RefreshCw size={12} className="inline mr-1" /> Random
              </button>
              <button onClick={onReset} className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
                  <RotateCcw size={12} className="inline mr-1" /> Reset
              </button>
          </div>
      </div>

      {children}

      <div className="flex-1 p-6 space-y-4">
          <div className={`p-4 rounded-xl border-l-4 transition-all ${isRunning ? 'bg-[#212529] text-white' : 'bg-[#f8f9faff] border-[#dee2e6]'}`}>
              <p className="text-[9px] font-black uppercase opacity-60 mb-1">Status</p>
              <p className="text-xs font-bold leading-tight">{currentStep}</p>
          </div>
          {(stats?.comparisons !== undefined || stats?.swaps !== undefined) && (
            <div className="flex gap-2 text-center">
                {stats?.comparisons !== undefined && (
                  <div className="flex-1 p-3 bg-white border border-[#dee2e6] rounded-xl">
                      <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Comps</p>
                      <p className="text-lg font-bold font-mono">{stats?.comparisons || 0}</p>
                  </div>
                )}
                {stats?.swaps !== undefined && (
                  <div className="flex-1 p-3 bg-white border border-[#dee2e6] rounded-xl">
                      <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Swaps</p>
                      <p className="text-lg font-bold font-mono">{stats?.swaps || 0}</p>
                  </div>
                )}
            </div>
          )}
          {complexityInfo && (
            <div className="mt-auto pt-4 border-t border-[#f1f3f5]">
               <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest mb-3 flex items-center gap-2">
                 <History size={12} /> Complexity
               </h4>
               <div className="space-y-1 text-[10px] font-bold text-[#6c757d]">
                  {complexityInfo.time && (
                    <>
                      {complexityInfo.time.worst && (
                        <div className="flex justify-between">
                          <span>Worst:</span> 
                          <span className="font-mono">{complexityInfo.time.worst}</span>
                        </div>
                      )}
                      {complexityInfo.time.average && (
                        <div className="flex justify-between">
                          <span>Avg:</span> 
                          <span className="font-mono">{complexityInfo.time.average}</span>
                        </div>
                      )}
                      {complexityInfo.time.best && (
                        <div className="flex justify-between">
                          <span>Best:</span> 
                          <span className="font-mono">{complexityInfo.time.best}</span>
                        </div>
                      )}
                    </>
                  )}
                  {complexityInfo.space && (
                    <div className="flex justify-between">
                      <span>Space:</span> 
                      <span className="font-mono">{complexityInfo.space}</span>
                    </div>
                  )}
               </div>
            </div>
          )}
      </div>
    </aside>
  );
};

export default CommonSidebar;
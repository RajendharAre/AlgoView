import React from 'react'
import { Activity, Play, RotateCcw, History, CheckCircle, ArrowLeft } from 'lucide-react'
import { SPEEDS } from '../utils/astarUtils'

/**
 * A* Sidebar Component
 * Contains controls, speed settings, and statistics
 */
const AStarSidebar = ({
  isRunning,
  gridReady,
  speedIndex,
  onSpeedChange,
  onRunAlgorithm,
  onClearWalls,
  onReset,
  currentStep,
  stats,
  finalPath,
}) => {
  return (
    <aside className="w-80 bg-white border-r border-[#dee2e6] flex flex-col shrink-0 shadow-lg z-20 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-[#f1f3f5]">
        <div className="flex items-center gap-3 mb-1">
          <button 
            onClick={() => window.history.back()} 
            className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            aria-label="Go back to algorithms"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-bold tracking-tight">A* Pathfinder</h1>
        </div>
        <p className="text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">
          Informed Search
        </p>
      </div>

      {/* Animation Speed */}
      <div className="p-6 border-b border-[#f1f3f5]">
        <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity size={12} /> Search Speed
        </h3>
        <div className="grid grid-cols-5 gap-1 p-1 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
          {SPEEDS.map((s, idx) => (
            <button
              key={s.label}
              onClick={() => onSpeedChange(idx)}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                speedIndex === idx
                  ? 'bg-[#212529] text-white shadow-md'
                  : 'text-[#6c757d] hover:bg-slate-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-[#f1f3f5] space-y-2">
        <button
          onClick={onRunAlgorithm}
          disabled={isRunning || !gridReady}
          className="w-full py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-30 shadow-md active:scale-95 transition-transform"
        >
          <Play size={14} fill="white" /> Run Algorithm
        </button>
        <div className="flex gap-2">
          <button
            onClick={onClearWalls}
            disabled={isRunning}
            className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
          >
            Clear Walls
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Stats & Info */}
      <div className="flex-1 p-6 space-y-6">
        <div
          className={`p-4 rounded-xl border-l-4 transition-all ${
            finalPath.size > 0
              ? 'bg-green-50 border-green-500 text-green-700'
              : isRunning
              ? 'bg-[#212529] text-white shadow-md'
              : 'bg-[#f8f9faff] border-[#dee2e6]'
          }`}
        >
          <p className="text-[9px] font-black uppercase opacity-60 mb-1 flex items-center gap-1">
            {finalPath.size > 0 && <CheckCircle size={10} />} Status
          </p>
          <p className="text-xs font-bold leading-tight">{currentStep}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
            <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Visited</p>
            <p className="text-lg font-bold font-mono">{stats.visited}</p>
          </div>
          <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
            <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Path Length</p>
            <p className="text-lg font-bold font-mono">{stats.pathLength || '-'}</p>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[#f1f3f5]">
          <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest mb-3 flex items-center gap-2">
            <History size={12} /> Heuristic Logic
          </h4>
          <div className="space-y-1 text-[10px] font-bold text-[#6c757d]">
            <div className="flex justify-between">
              <span>Function:</span>
              <span className="font-mono">f(n) = g(n) + h(n)</span>
            </div>
            <div className="flex justify-between">
              <span>Estimator:</span>
              <span className="uppercase text-[8px]">Manhattan Distance</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AStarSidebar

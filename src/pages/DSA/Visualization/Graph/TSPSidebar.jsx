import React from 'react'
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Activity,
  Info,
  MousePointer2,
  Lock,
  Circle,
  ArrowLeft,
  MapPin,
} from 'lucide-react'
import TimeComplexitySection from '../../../../components/Visualisation/TimeComplexitySection'

const ToolButton = ({ active, onClick, disabled, icon, label, desc, danger }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left disabled:opacity-30 ${
      active
        ? 'bg-[#212529] border-[#212529] shadow-md translate-x-1'
        : 'bg-white border-transparent hover:bg-[#f8f9faff] hover:border-[#dee2e6]'
    }`}
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        active
          ? 'bg-white/20 text-white'
          : danger
            ? 'bg-red-50 text-red-500'
            : 'bg-[#f1f3f5] text-[#6c757d]'
      }`}
    >
      {icon}
    </div>
    <div className="overflow-hidden">
      <div className={`text-[11px] font-bold truncate ${active ? 'text-white' : 'text-[#212529]'}`}>
        {label}
      </div>
      <div
        className={`text-[8px] font-medium leading-none mt-0.5 truncate ${active ? 'text-white/60' : 'text-[#adb5bd]'}`}
      >
        {desc}
      </div>
    </div>
  </button>
)

const TSPSidebar = ({
  mode,
  setMode,
  isRunning,
  speedIndex,
  onSpeedChange,
  onRun,
  onReset,
  status,
  minCost,
  bestPath,
  nodes,
  SPEEDS,
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
          <h1 className="text-sm md:text-base font-bold tracking-tight truncate">TSP Solver</h1>
        </div>
        <p className="text-[9px] md:text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">
          Backtracking Logic
        </p>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex-1 overflow-y-auto">
        {/* Interaction Section */}
        <section className="space-y-3 md:space-y-4">
          <div>
            <h3 className="text-[9px] sm:text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-2 md:mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MousePointer2 size={12} /> Graph Tools
              </span>
              {isRunning && <Lock size={10} className="text-amber-600" />}
            </h3>
            <div className="space-y-1.5">
              <ToolButton
                active={mode === 'ADD'}
                onClick={() => setMode('ADD')}
                disabled={isRunning}
                icon={<Plus size={16} />}
                label="Add City"
                desc="Place new node"
              />
              <ToolButton
                active={mode === 'START'}
                onClick={() => setMode('START')}
                disabled={isRunning}
                icon={<Circle size={14} />}
                label="Set Depot"
                desc="Source city"
              />
              <ToolButton
                active={mode === 'DELETE'}
                onClick={() => setMode('DELETE')}
                disabled={isRunning}
                icon={<Trash2 size={16} />}
                label="Delete"
                desc="Remove element"
                danger
              />
            </div>
          </div>

          <div>
            <h3 className="text-[9px] sm:text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-2 md:mb-3 flex items-center gap-2">
              <Activity size={12} /> Simulation Speed
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

        {/* Action Section */}
        <section className="space-y-2 pt-4 border-t border-[#f1f3f5]">
          <button
            onClick={onRun}
            disabled={isRunning || nodes.length < 3}
            className="w-full py-2.5 md:py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] sm:text-xs shadow-md active:scale-95 disabled:opacity-30 transition-all"
          >
            <Play size={14} fill="white" /> Execute Solver
          </button>
          <button
            onClick={onReset}
            disabled={isRunning}
            className="w-full py-2 md:py-2.5 bg-white border border-[#dee2e6] text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RotateCcw size={12} className="inline mr-1" /> Reset Scenario
          </button>
        </section>

        {/* Live Progress Section */}
        <section className="space-y-3 md:space-y-4 pt-4 border-t border-[#f1f3f5]">
          <div
            className={`p-3 md:p-4 rounded-xl border-l-4 transition-all ${
              isRunning ? 'bg-[#212529] text-white shadow-md' : 'bg-[#f8f9faff] border-[#dee2e6]'
            }`}
          >
            <p className="text-[8px] sm:text-[9px] font-black uppercase opacity-60 mb-1 flex items-center gap-1">
              <Info size={10} /> Live Log
            </p>
            <p className="text-[9px] md:text-[11px] font-bold leading-relaxed h-12 md:h-14 overflow-hidden">
              {status}
            </p>
          </div>

          <div className="p-3 md:p-4 bg-white border border-[#dee2e6] rounded-xl text-center shadow-sm">
            <p className="text-[8px] sm:text-[9px] font-black text-[#adb5bd] uppercase mb-1">
              Current Best Cost
            </p>
            <div className="text-2xl md:text-3xl font-black font-mono text-[#212529]">
              {minCost === Infinity ? '---' : minCost}
            </div>
          </div>

          {bestPath.length > 0 && (
            <div className="space-y-2 md:space-y-3 animate-in slide-in-from-bottom-2 pt-2">
              <h4 className="text-[8px] sm:text-[10px] font-black text-[#212529] uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Optimal Cycle Sequence
              </h4>
              <div className="flex flex-wrap items-center gap-1 p-2 md:p-3 bg-white border border-[#dee2e6] rounded-xl shadow-sm text-[8px] sm:text-[10px]">
                {bestPath.map((id, idx) => (
                  <React.Fragment key={idx}>
                    <span className="font-black px-1.5 py-0.5 bg-[#f8f9faff] rounded border">
                      {nodes.find(n => n.id === id)?.label}
                    </span>
                    {idx < bestPath.length - 1 && <span className="text-[#adb5bd]">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Time Complexity Section */}
        <section className="space-y-3 md:space-y-4 pt-4 border-t border-[#f1f3f5] pb-8 md:pb-12">
          {complexityInfo && (
            <div className="pt-4 border-t border-[#f1f3f5]">
              <TimeComplexitySection complexityInfo={complexityInfo} />
            </div>
          )}
        </section>
      </div>
    </aside>
  )
}

export default TSPSidebar

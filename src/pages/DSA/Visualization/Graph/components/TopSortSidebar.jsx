import React from 'react'
import {
  Play,
  Plus,
  Link as LinkIcon,
  Trash2,
  Activity,
  Lock,
  MousePointer2,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react'
import { COLORS, SPEEDS } from '../utils/topSortUtils'

/**
 * TopSort Sidebar Component
 * Controls for graph manipulation and algorithm execution
 */
const TopSortSidebar = ({
  isRunning,
  mode,
  speedIndex,
  onSpeedChange,
  onModeChange,
  onRunAlgorithm,
  onSample,
  onClear,
  currentStep,
  visited,
  queue,
  traversalOrder,
  inDegrees,
  activeNode,
  nodes,
  cycleDetected,
}) => {
  const ToolButton = ({ active, onClick, disabled, icon, label, desc, danger }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left disabled:opacity-30 ${
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
          className={`text-[8px] font-medium leading-none mt-0.5 truncate ${
            active ? 'text-white/60' : 'text-[#adb5bd]'
          }`}
        >
          {desc}
        </div>
      </div>
    </button>
  )

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
          <h1 className="text-base font-bold tracking-tight">Topological Sort</h1>
        </div>
        <p className="text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">Kahn's Dependency Logic</p>
      </div>

      {/* Speed Controls */}
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

      {/* Tools */}
      <div className="p-6 border-b border-[#f1f3f5]">
        <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MousePointer2 size={12} /> Graph Tools
          </span>
          {isRunning && <Lock size={10} className="text-amber-600" />}
        </h3>
        <div className="space-y-1.5">
          <ToolButton
            active={mode === 'ADD'}
            onClick={() => onModeChange('ADD')}
            disabled={isRunning}
            icon={<Plus size={16} />}
            label="Add Node"
            desc="Place new vertices"
          />
          <ToolButton
            active={mode === 'LINK'}
            onClick={() => onModeChange('LINK')}
            disabled={isRunning}
            icon={<LinkIcon size={16} />}
            label="Directed Link"
            desc="Dependency flow"
          />
          <ToolButton
            active={mode === 'DELETE'}
            onClick={() => onModeChange('DELETE')}
            disabled={isRunning}
            icon={<Trash2 size={16} />}
            label="Delete"
            desc="Remove graph items"
            danger
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-b border-[#f1f3f5] space-y-2">
        <button
          onClick={onRunAlgorithm}
          disabled={isRunning || nodes.length === 0}
          className="w-full py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-md active:scale-95 transition-transform"
        >
          <Play size={14} fill="white" /> Execute Kahn's
        </button>
        <div className="flex gap-2">
          <button
            onClick={onSample}
            disabled={isRunning}
            className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase rounded-xl hover:bg-slate-50 transition-all"
          >
            Sample
          </button>
          <button
            onClick={onClear}
            disabled={isRunning}
            className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase rounded-xl hover:bg-slate-50 transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Status Report */}
      <div className="flex-1 p-6 space-y-6">
        {/* Status Box */}
        <div
          className={`p-4 rounded-xl border-l-4 transition-all ${
            cycleDetected
              ? 'bg-red-50 border-red-500 text-red-700'
              : traversalOrder.length === nodes.length && nodes.length > 0
                ? 'bg-green-50 border-green-500 text-green-700'
                : isRunning
                  ? 'bg-[#212529] text-white shadow-md'
                  : 'bg-[#f8f9faff] border-[#dee2e6]'
          }`}
        >
          <p className="text-[9px] font-black uppercase opacity-60 mb-1 flex items-center gap-1">
            {cycleDetected ? (
              <AlertCircle size={10} />
            ) : traversalOrder.length === nodes.length && nodes.length > 0 ? (
              <CheckCircle size={10} />
            ) : null}
            Status
          </p>
          <p className="text-xs font-bold leading-tight h-10 overflow-hidden">{currentStep}</p>
        </div>

        {/* Queue Display */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
            <Activity size={12} /> Ready Queue (In-degree 0)
          </h4>
          <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
            {queue.map((id, i) => (
              <div key={i} className="px-2 py-1 bg-[#212529] text-white text-[10px] font-bold rounded-lg shadow-sm">
                {nodes.find(n => n.id === id)?.label}
              </div>
            ))}
            {queue.length === 0 && (
              <span className="text-[9px] text-[#adb5bd] italic p-1">Empty</span>
            )}
          </div>
        </div>

        {/* Sorted Sequence Display */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
            <ChevronRight size={12} /> Sorted Sequence
          </h4>
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-xl border border-[#dee2e6]">
            {traversalOrder.map((label, i) => (
              <React.Fragment key={i}>
                <div className="px-2 py-1 bg-[#212529] text-white text-[10px] font-bold rounded-lg shadow-sm">
                  {label}
                </div>
                {i < traversalOrder.length - 1 && (
                  <ChevronRight size={10} className="text-[#adb5bd]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

TopSortSidebar.displayName = 'TopSortSidebar'

export default TopSortSidebar

import React from 'react'
import {
  Play,
  RotateCcw,
  Plus,
  Link as LinkIcon,
  Trash2,
  Activity,
  Info,
  MousePointer2,
  Lock,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { SPEEDS, COLORS, NODE_PALETTE } from '../utils/graphColoringUtils'
import graphColoringInfo from '../graphColoringInfo'
import TimeComplexitySection from '../../../../../components/Visualisation/TimeComplexitySection'

/**
 * Graph Coloring Sidebar
 * Control panel for graph creation and algorithm execution
 */
const GraphColoringSidebar = ({
  isRunning,
  mode,
  setMode,
  speedIndex,
  setSpeedIndex,
  runColoring,
  onSample,
  onClear,
  currentStep,
  chromaticNumber,
  nodes,
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
          <h1 className="text-base font-bold tracking-tight">Graph Coloring</h1>
        </div>
        <p className="text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">
          Vibrant Constraints
        </p>
      </div>

      {/* Speed Controls */}
      <div className="p-6 border-b border-[#f1f3f5]">
        <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity size={12} /> Execution Speed
        </h3>
        <div className="grid grid-cols-5 gap-1 p-1 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
          {SPEEDS.map((s, idx) => (
            <button
              key={s.label}
              onClick={() => setSpeedIndex(idx)}
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
            onClick={() => setMode('ADD')}
            disabled={isRunning}
            icon={<Plus size={16} />}
            label="Add Node"
            desc="Create new vertices"
          />
          <ToolButton
            active={mode === 'LINK'}
            onClick={() => setMode('LINK')}
            disabled={isRunning}
            icon={<LinkIcon size={16} />}
            label="Connect"
            desc="Create adjacencies"
          />
          <ToolButton
            active={mode === 'DELETE'}
            onClick={() => setMode('DELETE')}
            disabled={isRunning}
            icon={<Trash2 size={16} />}
            label="Delete"
            desc="Remove elements"
            danger
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-b border-[#f1f3f5] space-y-2">
        <button
          onClick={runColoring}
          disabled={isRunning || nodes.length === 0}
          className="w-full py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-md active:scale-95 transition-transform disabled:opacity-50"
        >
          <Play size={14} fill="white" /> Start Coloring
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

      {/* Metrics */}
      <div className="flex-1 p-6 space-y-6">
        <div
          className={`p-4 rounded-xl border-l-4 transition-all ${
            isRunning
              ? 'bg-[#212529] text-white shadow-md'
              : 'bg-[#f8f9faff] border-[#dee2e6]'
          }`}
        >
          <p className="text-[9px] font-black uppercase opacity-60 mb-1">Process Status</p>
          <p className="text-xs font-bold leading-tight h-10 overflow-hidden">{currentStep}</p>
        </div>

        <div className="p-4 bg-white border border-[#dee2e6] rounded-xl text-center shadow-sm">
          <p className="text-[9px] font-black text-[#adb5bd] uppercase mb-2">
            <ChevronRight size={12} className="inline mr-1" /> Chromatic Number
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-500 via-blue-500 to-green-500 animate-spin-slow"></div>
            <span className="text-3xl font-black font-mono">{chromaticNumber || '-'}</span>
          </div>
          <p className="text-[8px] text-[#adb5bd] mt-2 font-medium">Distinct colors currently assigned.</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
            <ChevronRight size={12} /> Available Palette
          </h4>
          <div className="grid grid-cols-5 gap-1.5">
            {NODE_PALETTE.map((p, i) => (
              <div key={i} className="group relative">
                <div
                  className="w-full h-8 rounded-lg border border-[#dee2e6] shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: p.bg }}
                ></div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[6px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <TimeComplexitySection complexityInfo={graphColoringInfo} />
      </div>
    </aside>
  )
}

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

export default GraphColoringSidebar

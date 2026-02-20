import React, { memo } from 'react'
import {
  Activity,
  Play,
  RotateCcw,
  Lock,
  MousePointer2,
  Plus,
  Link as LinkIcon,
  Trash2,
  Database,
  Circle,
  ArrowLeft
} from 'lucide-react'
import { SPEEDS, COLORS } from '../utils/primUtils'

/**
 * Prim Sidebar Component
 * Contains controls, speed settings, and cost candidate table
 */
const PrimSidebar = memo(({
  isRunning,
  mode,
  speedIndex,
  onSpeedChange,
  onModeChange,
  onRunAlgorithm,
  onReset,
  onSample,
  onClear,
  currentStep,
  visited,
  totalWeight,
  costs,
  parent,
  activeNode,
  startNodeId,
  nodes,
  edges
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
          <h1 className="text-base font-bold tracking-tight">Prim's Visualizer</h1>
        </div>
        <p className="text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">Tree Growth Logic</p>
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

      {/* Graph Tools */}
      <div className="p-6 border-b border-[#f1f3f5]">
        <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><MousePointer2 size={12} /> Graph Tools</span>
          {isRunning && <Lock size={10} className="text-amber-600" />}
        </h3>
        <div className="space-y-1.5">
          <ToolButton
            active={mode === 'ADD'}
            onClick={() => onModeChange('ADD')}
            disabled={isRunning}
            icon={<Plus size={16} />}
            label="Add Node"
            desc="Place vertices"
          />
          <ToolButton
            active={mode === 'LINK'}
            onClick={() => onModeChange('LINK')}
            disabled={isRunning}
            icon={<LinkIcon size={16} />}
            label="Weighted Link"
            desc="Undirected edges"
          />
          <ToolButton
            active={mode === 'START'}
            onClick={() => onModeChange('START')}
            disabled={isRunning}
            icon={<Circle size={14} />}
            label="Set Start"
            desc="Root of MST"
          />
          <ToolButton
            active={mode === 'DELETE'}
            onClick={() => onModeChange('DELETE')}
            disabled={isRunning}
            icon={<Trash2 size={16} />}
            label="Delete"
            desc="Remove items"
            danger
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-b border-[#f1f3f5] space-y-2">
        <button
          onClick={onRunAlgorithm}
          disabled={isRunning || nodes.length < 2 || edges.length === 0}
          className="w-full py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-50 shadow-md active:scale-95 transition-transform"
        >
          <Play size={14} fill="white" /> Grow MST
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

      {/* Statistics */}
      <div className="flex-1 p-6 space-y-6">
        <div
          className={`p-4 rounded-xl border-l-4 transition-all ${
            isRunning
              ? 'bg-[#212529] text-white shadow-md'
              : 'bg-[#f8f9faff] border-[#dee2e6]'
          }`}
        >
          <p className="text-[9px] font-black uppercase opacity-60 mb-1">Status Report</p>
          <p className="text-xs font-bold leading-tight h-10 overflow-hidden">{currentStep}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
            <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Total Weight</p>
            <p className="text-lg font-bold font-mono">{totalWeight}</p>
          </div>
          <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
            <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">In MST</p>
            <p className="text-lg font-bold font-mono">{visited.size} / {nodes.length}</p>
          </div>
        </div>

        {/* Candidate Cost Table */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
            <Database size={12} /> Candidate Table
          </h4>
          <div className="bg-white border border-[#dee2e6] rounded-xl overflow-hidden shadow-sm">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-[#f8f9faff] border-b border-[#dee2e6] sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-black">Node</th>
                    <th className="px-3 py-2 font-black">Min Cost</th>
                    <th className="px-3 py-2 font-black">Parent</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map(n => (
                    <tr
                      key={n.id}
                      className={`border-b border-[#f1f3f5] transition-colors ${
                        activeNode === n.id ? 'bg-slate-100 font-bold' : visited.has(n.id) ? 'opacity-40' : ''
                      }`}
                    >
                      <td className="px-3 py-2">{n.label}</td>
                      <td className="px-3 py-2 font-mono">
                        {costs[n.id] === Infinity ? '∞' : costs[n.id] ?? '-'}
                      </td>
                      <td className="px-3 py-2">
                        {parent[n.id] !== undefined
                          ? nodes.find(p => p.id === parent[n.id])?.label
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
})

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

PrimSidebar.displayName = 'PrimSidebar'

export default PrimSidebar

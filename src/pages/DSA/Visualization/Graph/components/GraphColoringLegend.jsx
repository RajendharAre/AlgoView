import React from 'react'
import { Info } from 'lucide-react'
import { COLORS } from '../utils/graphColoringUtils'

/**
 * Graph Coloring Legend
 * Bottom legend overlay showing algorithm explanation and indicators
 */
const GraphColoringLegend = () => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
      <div className="flex items-center gap-8">
        <LegendItem color={COLORS.carbonBlack} label="Active Processor" />
        <LegendItem color={COLORS.alabasterGrey} label="Checking Adjacency" border />
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
          </div>
          <span className="text-[9px] font-black uppercase text-[#6c757d]">Vibrant Coloring</span>
        </div>
      </div>
      <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
      <div className="flex items-center gap-2">
        <Info size={14} className="text-[#adb5bd]" />
        <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
          Greedy Strategy: Assigning the first available bright color that is not used by any connected
          neighbor.
        </span>
      </div>
    </div>
  )
}

const LegendItem = ({ color, label, border }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-3 h-3 rounded-full ${border ? 'border border-[#dee2e6]' : ''}`}
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
)

export default GraphColoringLegend

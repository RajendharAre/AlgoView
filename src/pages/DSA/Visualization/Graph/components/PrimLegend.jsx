import React from 'react'
import { Info } from 'lucide-react'
import { COLORS } from '../utils/primUtils'

/**
 * Prim Legend Component
 * Displays the legend and algorithm description
 */
const PrimLegend = () => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
      <div className="flex items-center gap-8">
        <LegendItem color={COLORS.carbonBlack} label="Active Processing" />
        <LegendItem color={COLORS.slateGrey} label="Settled (In MST)" />
        <LegendItem color={COLORS.platinum} label="Frontier (Discovery)" />
        <LegendItem color="white" label="Unreachable" border />
      </div>
      <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
      <div className="flex items-center gap-2">
        <Info size={14} className="text-[#adb5bd]" />
        <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
          Prim's Algorithm: Greedily adds the closest unvisited node to the growing MST cloud.
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

export default PrimLegend

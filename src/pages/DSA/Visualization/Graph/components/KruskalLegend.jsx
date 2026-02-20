import React from 'react'
import { Info } from 'lucide-react'
import { COLORS } from '../utils/kruskalUtils'

/**
 * Kruskal Legend Component
 * Displays the legend and algorithm description
 */
const KruskalLegend = () => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
      <div className="flex items-center gap-8">
        <LegendItem color={COLORS.carbonBlack} label="MST Edge (Selected)" />
        <LegendItem color={COLORS.slateGrey} label="Currently Checking" />
        <LegendItem color={COLORS.ironGrey} label="Rejected (Cycle)" />
        <LegendItem color="white" label="Unprocessed Edge" border dashed />
      </div>
      <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
      <div className="flex items-center gap-2">
        <Info size={14} className="text-[#adb5bd]" />
        <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
          Kruskal's Algorithm: Sort all edges by weight and pick the cheapest ones without forming cycles.
        </span>
      </div>
    </div>
  )
}

const LegendItem = ({ color, label, border, dashed }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-4 h-0.5 rounded-full ${border ? 'border border-[#dee2e6]' : ''} ${dashed ? 'border-dashed border-2' : ''}`}
      style={{
        backgroundColor: dashed ? 'transparent' : color,
        borderTopColor: dashed ? color : 'transparent'
      }}
    ></div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
)

export default KruskalLegend

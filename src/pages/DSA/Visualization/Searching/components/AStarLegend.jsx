import React from 'react'
import { Info } from 'lucide-react'
import { COLORS } from '../utils/astarUtils'

/**
 * A* Legend Component
 * Shows color meanings and algorithm info
 */
const AStarLegend = () => {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
      <div className="flex items-center gap-8">
        <LegendItem color={COLORS.carbonBlack} label="Optimal Path" />
        <LegendItem color={COLORS.slateGrey} label="Frontier (Open)" />
        <LegendItem color={COLORS.platinum} label="Explored (Closed)" />
        <LegendItem color={COLORS.gunmetal} label="Obstacle" />
      </div>

      <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>

      <div className="flex items-center gap-2">
        <Info size={14} className="text-[#adb5bd]" />
        <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
          A* Pathfinder: Informed search balancing distance from start and distance to goal.
        </span>
      </div>
    </div>
  )
}

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-md" style={{ backgroundColor: color }}></div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
)

export default AStarLegend

import React from 'react'
import { Info } from 'lucide-react'
import { COLORS } from '../utils/topSortUtils'

/**
 * TopSort Legend Component
 * Visual reference for node states and algorithm markers
 */
const TopSortLegend = () => {
  const items = [
    { color: COLORS.carbonBlack, label: 'Active / Resolving' },
    { color: COLORS.slateGrey, label: 'Processed' },
    { color: COLORS.platinum, label: 'Ready (In Queue)', border: COLORS.slateGrey },
  ]

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl z-10">
      <div className="flex items-center gap-8">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: item.color,
                border: item.border ? `2px solid ${item.border}` : 'none',
              }}
            />
            <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#212529] flex items-center justify-center text-[6px] text-white font-bold">
            #
          </div>
          <span className="text-[9px] font-black uppercase text-[#6c757d]">In-Degree</span>
        </div>
      </div>

      <div className="w-full h-px bg-[#dee2e6] opacity-50" />

      <div className="flex items-center gap-2">
        <Info size={14} className="text-[#adb5bd]" />
        <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
          Topological Sort: Order nodes such that all dependencies (in-degrees) are resolved first.
        </span>
      </div>
    </div>
  )
}

TopSortLegend.displayName = 'TopSortLegend'

export default TopSortLegend

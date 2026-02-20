import React from 'react'
import { GRID_SIZE } from '../utils/astarUtils'

/**
 * A* Grid Component
 * Renders the pathfinding grid with interactive cells
 */
const AStarGrid = ({
  grid,
  startPos,
  targetPos,
  openSet,
  closedSet,
  finalPath,
  currentCell,
  isRunning,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const getCellColor = (r, c, key) => {
    const isStart = r === startPos.r && c === startPos.c
    const isTarget = r === targetPos.r && c === targetPos.c
    const isWall = grid[r]?.[c]?.isWall
    const isOpen = openSet.has(key)
    const isClosed = closedSet.has(key)
    const isPath = finalPath.has(key)
    const isActive = currentCell === key

    if (isWall) return 'bg-[#343a40]'
    if (isPath && !isStart && !isTarget) return 'bg-[#212529]'
    if (isActive) return 'bg-[#212529]'
    if (isOpen) return 'bg-[#adb5bd]'
    if (isClosed) return 'bg-[#e9ecefff]'
    return 'bg-white'
  }

  return (
    <main
      className="flex-1 flex flex-col bg-[#f8f9faff] relative overflow-hidden items-center justify-center p-8"
      onMouseUp={onMouseUp}
    >
      <div
        className="grid gap-px bg-[#dee2e6] border border-[#dee2e6] shadow-2xl p-px rounded-lg overflow-hidden select-none cursor-default"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(90vh, 90%)',
          aspectRatio: '1/1',
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r},${c}`
            const isStart = r === startPos.r && c === startPos.c
            const isTarget = r === targetPos.r && c === targetPos.c
            const isPath = finalPath.has(key)
            const isActive = currentCell === key

            return (
              <div
                key={key}
                onMouseDown={() => onMouseDown(r, c)}
                onMouseEnter={() => onMouseEnter(r, c)}
                className={`relative flex items-center justify-center transition-all duration-300 ${getCellColor(r, c, key)} hover:brightness-95`}
              >
                {isStart && (
                  <div className="w-3/4 h-3/4 bg-white border-4 border-[#212529] rounded-lg flex items-center justify-center z-10 animate-in zoom-in-50 duration-200">
                    <span className="text-[10px] font-black">S</span>
                  </div>
                )}
                {isTarget && (
                  <div className="w-3/4 h-3/4 bg-[#212529] text-white rounded-lg flex items-center justify-center z-10 animate-pulse">
                    <span className="text-[10px] font-black">T</span>
                  </div>
                )}
                {isPath && !isStart && !isTarget && (
                  <div className="w-2 h-2 bg-white rounded-full animate-in fade-in zoom-in duration-500" />
                )}
                {isActive && (
                  <div className="absolute inset-0 border-2 border-[#212529] animate-pulse z-20" />
                )}
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}

export default AStarGrid

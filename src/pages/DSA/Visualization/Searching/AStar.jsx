import React, { useState, useEffect, useRef, useCallback } from 'react'
import AStarSidebar from './components/AStarSidebar'
import AStarGrid from './components/AStarGrid'
import AStarLegend from './components/AStarLegend'
import {
  COLORS,
  GRID_SIZE,
  SPEEDS,
  heuristic,
  initializeGrid,
  getNeighbors,
  reconstructPath,
} from './utils/astarUtils'

/**
 * A* Search Algorithm Visualizer
 * Main container component with algorithm logic
 */
const AStarVisualizer = () => {
  // Grid State
  const [grid, setGrid] = useState([])
  const [startPos, setStartPos] = useState({ r: 5, c: 5 })
  const [targetPos, setTargetPos] = useState({ r: 15, c: 15 })
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [dragMode, setDragMode] = useState(null) // 'WALL', 'START', 'TARGET'

  // Algorithm State
  const [isRunning, setIsRunning] = useState(false)
  const [openSet, setOpenSet] = useState(new Set())
  const [closedSet, setClosedSet] = useState(new Set())
  const [finalPath, setFinalPath] = useState(new Set())
  const [currentCell, setCurrentCell] = useState(null)

  // UI State
  const [speedIndex, setSpeedIndex] = useState(2)
  const [currentStep, setCurrentStep] = useState(
    'Click/Drag to draw walls. Drag S and T to move markers.'
  )
  const [stats, setStats] = useState({ visited: 0, pathLength: 0 })

  const speedRef = useRef(SPEEDS[2].value)
  const isRunningRef = useRef(false)

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value
  }, [speedIndex])

  // Initialize Grid
  const initGrid = useCallback((resetWalls = false) => {
    const newGrid = []
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = []
      for (let c = 0; c < GRID_SIZE; c++) {
        const isWall = !resetWalls && grid[r]?.[c]?.isWall ? true : false
        row.push({ r, c, isWall })
      }
      newGrid.push(row)
    }
    setGrid(newGrid)
    setOpenSet(new Set())
    setClosedSet(new Set())
    setFinalPath(new Set())
    setCurrentCell(null)
    setStats({ visited: 0, pathLength: 0 })
    setIsRunning(false)
    isRunningRef.current = false
  }, [grid])

  useEffect(() => {
    initGrid(true)
  }, [])

  // Input Handlers
  const handleMouseDown = (r, c) => {
    if (isRunning) return
    setIsMouseDown(true)
    if (r === startPos.r && c === startPos.c) {
      setDragMode('START')
    } else if (r === targetPos.r && c === targetPos.c) {
      setDragMode('TARGET')
    } else {
      setDragMode('WALL')
      toggleWall(r, c)
    }
  }

  const handleMouseEnter = (r, c) => {
    if (!isMouseDown || isRunning) return
    if (dragMode === 'START') {
      if (!grid[r]?.[c]?.isWall && (r !== targetPos.r || c !== targetPos.c)) {
        setStartPos({ r, c })
      }
    } else if (dragMode === 'TARGET') {
      if (!grid[r]?.[c]?.isWall && (r !== startPos.r || c !== startPos.c)) {
        setTargetPos({ r, c })
      }
    } else if (dragMode === 'WALL') {
      toggleWall(r, c)
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  const toggleWall = (r, c) => {
    if ((r === startPos.r && c === startPos.c) || (r === targetPos.r && c === targetPos.c))
      return
    const newGrid = [...grid]
    newGrid[r][c].isWall = !newGrid[r][c].isWall
    setGrid(newGrid)
  }

  const resetAll = () => {
    isRunningRef.current = false
    initGrid(true)
    setCurrentStep('Grid reset. Draw walls and press Start.')
  }

  // A* Algorithm
  const sleep = () => new Promise((r) => setTimeout(r, speedRef.current))

  const getPos = (key) => {
    const [r, c] = key.split(',').map(Number)
    return { r, c }
  }

  const runAStar = async () => {
    if (isRunning) return
    setIsRunning(true)
    isRunningRef.current = true
    setFinalPath(new Set())
    setOpenSet(new Set())
    setClosedSet(new Set())
    setStats({ visited: 0, pathLength: 0 })

    const startKey = `${startPos.r},${startPos.c}`
    const targetKey = `${targetPos.r},${targetPos.c}`

    const open = [startKey]
    const cameFrom = {}
    const gScore = { [startKey]: 0 }
    const fScore = { [startKey]: heuristic(startPos, targetPos) }

    while (open.length > 0) {
      if (!isRunningRef.current) {
        setIsRunning(false)
        return
      }

      // Find node with lowest fScore
      open.sort((a, b) => fScore[a] - fScore[b])
      const currentKey = open.shift()
      const current = getPos(currentKey)

      setCurrentCell(currentKey)
      setOpenSet(new Set(open))
      setClosedSet((prev) => new Set(prev).add(currentKey))
      setStats((s) => ({ ...s, visited: s.visited + 1 }))

      if (currentKey === targetKey) {
        // Path Reconstruction
        const path = reconstructPath(cameFrom, startKey, targetKey)
        setFinalPath(new Set(path))
        setStats((s) => ({ ...s, pathLength: path.length }))
        setCurrentStep('Goal reached! Optimal path found.')
        setIsRunning(false)
        isRunningRef.current = false
        setCurrentCell(null)
        return
      }

      setCurrentStep(`Evaluating cell (${current.r}, ${current.c}) | f=${fScore[currentKey].toFixed(2)}`)
      await sleep()

      // Get neighbors
      const neighbors = getNeighbors(current, grid)

      for (const neighborKey of neighbors) {
        const tentativeGScore = gScore[currentKey] + 1
        if (tentativeGScore < (gScore[neighborKey] ?? Infinity)) {
          cameFrom[neighborKey] = currentKey
          gScore[neighborKey] = tentativeGScore
          const neighborPos = getPos(neighborKey)
          fScore[neighborKey] =
            tentativeGScore + heuristic(neighborPos, targetPos)
          if (!open.includes(neighborKey)) {
            open.push(neighborKey)
            setOpenSet(new Set(open))
          }
        }
      }
    }

    setCurrentStep('No path found to the target.')
    setIsRunning(false)
    isRunningRef.current = false
    setCurrentCell(null)
  }

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      <AStarSidebar
        isRunning={isRunning}
        gridReady={grid.length > 0}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        onRunAlgorithm={runAStar}
        onClearWalls={() => initGrid(false)}
        onReset={resetAll}
        currentStep={currentStep}
        stats={stats}
        finalPath={finalPath}
      />

      <div className="flex-1 flex flex-col">
        <AStarGrid
          grid={grid}
          startPos={startPos}
          targetPos={targetPos}
          openSet={openSet}
          closedSet={closedSet}
          finalPath={finalPath}
          currentCell={currentCell}
          isRunning={isRunning}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
        />
        <AStarLegend />
      </div>
    </div>
  )
}

export default AStarVisualizer

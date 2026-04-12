import React, { useState, useEffect, useRef } from 'react'
import { ChevronRight, Timer } from 'lucide-react'
import TSPSidebar from './TSPSidebar'
import tspInfo from './tspInfo'
import { COLORS, SPEEDS, INITIAL_NODES, calculateDistance, factorial } from './tspUtils'

/**
 * Traveling Salesman Problem (TSP) Visualizer
 * Backtracking with Pruning + Complexity Analysis
 */

const TSP = () => {
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [mode, setMode] = useState('ADD')
  const [startNodeId, setStartNodeId] = useState(INITIAL_NODES[0].id)

  // Algorithm State
  const [isRunning, setIsRunning] = useState(false)
  const [currentPath, setCurrentPath] = useState([])
  const [bestPath, setBestPath] = useState([])
  const [minCost, setMinCost] = useState(Infinity)
  const [exploredCount, setExploredCount] = useState(0)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [status, setStatus] = useState(
    'Depot: Node A. Click "Execute Solver" to find optimal route.'
  )

  const speedRef = useRef(SPEEDS[1].value)
  const isRunningRef = useRef(false)
  const svgRef = useRef(null)

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value
  }, [speedIndex])

  const handleCanvasClick = e => {
    if (isRunning || mode !== 'ADD') return
    if (nodes.length >= 8) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const newNode = { id: Date.now(), x, y, label: labels[nodes.length % 26] }
    const updatedNodes = [...nodes, newNode]
    setNodes(updatedNodes)

    // If startNodeId was null (all nodes deleted), set first node as depot
    if (!startNodeId) {
      setStartNodeId(newNode.id)
      console.log('🔧 Auto-set depot to first node:', newNode.label)
    }

    resetAlgoState()
  }

  const handleNodeClick = (e, node) => {
    e.stopPropagation()
    if (isRunning) return
    if (mode === 'DELETE') {
      const remainingNodes = nodes.filter(n => n.id !== node.id)
      setNodes(remainingNodes)

      // If deleted node was the start node, or all nodes deleted, update startNodeId
      if (startNodeId === node.id || remainingNodes.length === 0) {
        setStartNodeId(remainingNodes.length > 0 ? remainingNodes[0].id : null)
      }
      resetAlgoState()
    } else if (mode === 'START') {
      setStartNodeId(node.id)
      resetAlgoState()
    }
  }

  const resetAlgoState = () => {
    setCurrentPath([])
    setBestPath([])
    setMinCost(Infinity)
    setExploredCount(0)
    setIsRunning(false)
    isRunningRef.current = false
  }

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current))

  const solveTSP = async () => {
    console.log(
      '🔧 solveTSP called - isRunning:',
      isRunning,
      'nodes:',
      nodes.length,
      'startNodeId:',
      startNodeId
    )

    if (isRunning || nodes.length < 3 || !startNodeId) {
      const msg = `Need at least 3 nodes and a valid depot to start. (nodes: ${nodes.length}, startNodeId: ${startNodeId})`
      setStatus(msg)
      console.log('❌', msg)
      return
    }

    // Validate that startNodeId exists in current nodes
    const validStart = nodes.find(n => n.id === startNodeId)
    console.log('✓ Validation: startNodeId exists?', !!validStart)
    if (!validStart) {
      setStartNodeId(nodes[0]?.id || null)
      setStatus('Invalid start node. Set a new depot and try again.')
      console.log('❌ Invalid start node')
      return
    }

    setIsRunning(true)
    isRunningRef.current = true
    console.log('🚀 Starting algorithm...')

    let localBestPath = []
    let localMinCost = Infinity
    let currentNodesCount = nodes.length
    console.log('📊 Algorithm config - nodes to visit:', currentNodesCount)

    const backtrack = async (currId, visitedSet, path, cost) => {
      if (!isRunningRef.current) {
        console.log('⏸️ Algorithm interrupted')
        return
      }

      setCurrentPath([...path])
      console.log(
        `📍 Visiting: node=${currId}, path=${path.join(',')}  visited=${visitedSet.size}/${currentNodesCount}`
      )

      // Check if all nodes have been visited
      if (visitedSet.size === currentNodesCount) {
        const startNode = nodes.find(n => n.id === startNodeId)
        const lastNode = nodes.find(n => n.id === currId)

        if (!startNode || !lastNode) {
          console.error('❌ Start or last node not found', { startNode, lastNode })
          return
        }

        const returnDist = calculateDistance(lastNode, startNode)
        const totalCost = cost + returnDist
        console.log(`✅ Complete path found! Cost: ${totalCost}, LocalMin: ${localMinCost}`)

        if (totalCost < localMinCost) {
          localMinCost = totalCost
          localBestPath = [...path, startNodeId]
          setMinCost(totalCost)
          setBestPath(localBestPath)
          setStatus(`✓ Found better route! Cost: ${totalCost}`)
          console.log(`🎯 New best path: ${localBestPath.join(' → ')}`)
        }
        await sleep()
        return
      }

      // Try adding each unvisited node
      for (let nextNode of nodes) {
        if (!visitedSet.has(nextNode.id)) {
          const currNode = nodes.find(n => n.id === currId)
          if (!currNode) {
            console.warn(`⚠️  Current node ${currId} not found in nodes array`)
            continue
          }

          const dist = calculateDistance(currNode, nextNode)

          // Pruning: skip if current path cost plus this edge exceeds best known
          if (cost + dist >= localMinCost) {
            console.log(
              `⏭️  Pruned: edge ${currId}→${nextNode.id}, cost ${cost + dist} >= ${localMinCost}`
            )
            continue
          }

          visitedSet.add(nextNode.id)
          await backtrack(nextNode.id, visitedSet, [...path, nextNode.id], cost + dist)
          visitedSet.delete(nextNode.id)

          if (!isRunningRef.current) return
        }
      }
    }

    // Initialize and start backtracking
    const initialVisited = new Set([startNodeId])
    console.log(`🔄 Starting backtracking from node ${startNodeId}`)
    await backtrack(startNodeId, initialVisited, [startNodeId], 0)

    setIsRunning(false)
    isRunningRef.current = false
    setCurrentPath([])

    console.log(`🏁 Algorithm complete. Best path found:`, localBestPath, `Cost: ${localMinCost}`)
    if (localBestPath.length > 0) {
      setStatus(`✓ Completed! Optimal cost: ${localMinCost}`)
      console.log('✅ SUCCESS - Path found')
    } else {
      setStatus('No solution found or search was interrupted.')
      console.log('❌ NO PATH - Algorithm ran but found nothing')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8f9faff] text-[#212529] font-sans">
      {/* Sidebar - On mobile at TOP (full width), on desktop on LEFT */}
      <div className="md:flex md:flex-row md:h-screen flex flex-col flex-1">
        {/* Sidebar Section */}
        <div className="w-full md:w-80 h-auto md:h-full overflow-y-auto md:border-r border-t md:border-t-0">
          <TSPSidebar
            mode={mode}
            setMode={setMode}
            isRunning={isRunning}
            speedIndex={speedIndex}
            onSpeedChange={setSpeedIndex}
            onRun={solveTSP}
            onReset={() => {
              setNodes(INITIAL_NODES)
              setMode('ADD')
              setStartNodeId(INITIAL_NODES[0].id)
              setStatus('Place nodes and find the optimal route.')
              resetAlgoState()
            }}
            status={status}
            minCost={minCost}
            bestPath={bestPath}
            nodes={nodes}
            SPEEDS={SPEEDS}
            complexityInfo={tspInfo}
          />
        </div>

        {/* Canvas Area - FILLS remaining space */}
        <main
          className="flex-1 relative bg-[#f8f9faff] overflow-hidden"
          onClick={handleCanvasClick}
        >
          <svg ref={svgRef} className="w-full h-full cursor-crosshair" style={{ display: 'block' }}>
            {/* Background Adjacency Matrix (Light Connections) */}
            {!isRunning &&
              bestPath.length === 0 &&
              nodes.map((n1, i) =>
                nodes
                  .slice(i + 1)
                  .map(n2 => (
                    <line
                      key={`${n1.id}-${n2.id}`}
                      x1={n1.x}
                      y1={n1.y}
                      x2={n2.x}
                      y2={n2.y}
                      stroke={COLORS.platinum}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  ))
              )}

            {/* Current Search Trajectory (Dashed) */}
            {isRunning &&
              currentPath.length > 1 &&
              currentPath.map((id, idx) => {
                if (idx === 0) return null
                const u = nodes.find(n => n.id === currentPath[idx - 1])
                const v = nodes.find(n => n.id === id)
                return (
                  <line
                    key={`cur-${idx}`}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={COLORS.slateGrey}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                )
              })}

            {/* Optimized Result Circuit (Solid) */}
            {bestPath.length > 1 &&
              bestPath.map((id, idx) => {
                if (idx === 0) return null
                const u = nodes.find(n => n.id === bestPath[idx - 1])
                const v = nodes.find(n => n.id === id)
                return (
                  <line
                    key={`best-${idx}`}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={COLORS.carbonBlack}
                    strokeWidth="4"
                    className="animate-in fade-in"
                  />
                )
              })}

            {/* Nodes Rendering */}
            {nodes.map(node => {
              const isStart = startNodeId === node.id
              const inBestPath = bestPath.includes(node.id)
              const fill = inBestPath ? COLORS.carbonBlack : 'white'
              const textColor = inBestPath ? 'white' : COLORS.carbonBlack

              return (
                <g
                  key={node.id}
                  onClick={e => handleNodeClick(e, node)}
                  className="cursor-pointer transition-all duration-300"
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill={fill}
                    stroke={COLORS.carbonBlack}
                    strokeWidth={isStart ? '4' : '2'}
                    className="shadow-lg hover:brightness-95"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="12"
                    fontWeight="900"
                    fill={textColor}
                  >
                    {node.label}
                  </text>
                  {isStart && (
                    <text
                      x={node.x}
                      y={node.y - 34}
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="black"
                      fill={COLORS.carbonBlack}
                      className="uppercase tracking-widest"
                    >
                      Depot
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Legend Overlay - Responsive positioning */}
          <div className="absolute bottom-3 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 px-4 md:px-8 py-2 md:py-4 bg-white/95 backdrop-blur-sm border border-[#dee2e6] rounded-2xl md:rounded-3xl shadow-2xl text-[8px] md:text-[9px]">
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#212529]"></div>
                <span className="font-black uppercase text-[#6c757d]">Optimal Result</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white border border-[#dee2e6]"></div>
                <span className="font-black uppercase text-[#6c757d]">Active Probe</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer size={10} className="md:w-4 md:h-4 text-[#adb5bd]" />
                <span className="font-black uppercase text-[#6c757d]">Factorial Growth</span>
              </div>
            </div>
            <div className="hidden md:block w-full h-px bg-[#dee2e6] opacity-50"></div>
            <span className="hidden md:block text-[9px] font-black text-[#adb5bd] uppercase tracking-widest text-center max-w-md">
              Complexity: The number of cities makes this problem exponentially difficult to solve
              precisely.
            </span>
          </div>
        </main>
      </div>
    </div>
  )
}

export default TSP

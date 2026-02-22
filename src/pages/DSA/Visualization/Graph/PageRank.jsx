import React, { useState, useEffect, useRef } from 'react'
import { TrendingUp, Info } from 'lucide-react'
import PageRankSidebar from './components/PageRankSidebar'
import { COLORS, SPEEDS, DAMPING_FACTOR, INITIAL_NODES, INITIAL_EDGES } from './utils/pageRankUtils'

/**
 * PageRank Algorithm Visualizer
 * Palette: Monochromatic "Snow to Carbon"
 * Logic: Iterative link analysis (Power Method)
 */

const PageRank = () => {
  // Graph State
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)
  const [mode, setMode] = useState('ADD')

  // Algorithm State
  const [isRunning, setIsRunning] = useState(false)
  const [iteration, setIteration] = useState(0)
  const [activeNode, setActiveNode] = useState(null)
  const [pulseEdge, setPulseEdge] = useState(null) // {u, v}

  // UI State
  const [speedIndex, setSpeedIndex] = useState(1)
  const [currentStep, setCurrentStep] = useState('Add nodes and directed links to build a network.')
  const [linkSource, setLinkSource] = useState(null)

  const speedRef = useRef(SPEEDS[1].value)
  const isRunningRef = useRef(false)
  const svgRef = useRef(null)

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value
  }, [speedIndex])

  // --- Graph Management ---

  const handleCanvasClick = (e) => {
    if (isRunning || mode !== 'ADD') return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const newNode = {
      id: Date.now(),
      x,
      y,
      label: labels[nodes.length % 26],
      rank: 1 / (nodes.length + 1),
    }

    // Normalize existing nodes for the new N
    const newN = nodes.length + 1
    const updatedNodes = nodes.map(n => ({ ...n, rank: 1 / newN }))
    setNodes([...updatedNodes, newNode])
    resetAlgoState()
  }

  const handleNodeClick = (e, node) => {
    e.stopPropagation()
    if (isRunning) return

    if (mode === 'DELETE') {
      const remainingNodes = nodes.filter(n => n.id !== node.id)
      const newN = remainingNodes.length
      const updatedNodes = remainingNodes.map(n => ({ ...n, rank: 1 / newN }))
      setNodes(updatedNodes)
      setEdges(edges.filter(edge => edge.u !== node.id && edge.v !== node.id))
      resetAlgoState()
    } else if (mode === 'LINK') {
      if (linkSource === null) {
        setLinkSource(node.id)
      } else if (linkSource !== node.id) {
        const exists = edges.some(edge => edge.u === linkSource && edge.v === node.id)
        if (!exists) {
          setEdges([...edges, { u: linkSource, v: node.id }])
        }
        setLinkSource(null)
        resetAlgoState()
      }
    }
  }

  const resetAlgoState = () => {
    const n = nodes.length
    setNodes(nodes.map(node => ({ ...node, rank: 1 / n })))
    setIteration(0)
    setActiveNode(null)
    setPulseEdge(null)
    setCurrentStep('Graph updated. Ranks reset to 1/N.')
  }

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current))

  // --- PageRank Algorithm ---

  const runPageRank = async () => {
    if (isRunning || nodes.length === 0) return

    setIsRunning(true)
    isRunningRef.current = true

    const N = nodes.length
    let currentRanks = {}
    nodes.forEach(n => (currentRanks[n.id] = n.rank))

    // Iterative Process (Runs for 10 iterations or until stopped)
    for (let i = 0; i < 10; i++) {
      if (!isRunningRef.current) break
      setIteration(i + 1)
      setCurrentStep(`Iteration ${i + 1}: Distributing rank based on outgoing links.`)

      let nextRanks = {}
      nodes.forEach(n => (nextRanks[n.id] = (1 - DAMPING_FACTOR) / N))

      // Distribute rank
      for (let uNode of nodes) {
        if (!isRunningRef.current) break
        setActiveNode(uNode.id)

        const outEdges = edges.filter(e => e.u === uNode.id)
        const outDegree = outEdges.length

        if (outDegree > 0) {
          const distributedValue = (DAMPING_FACTOR * currentRanks[uNode.id]) / outDegree
          for (let edge of outEdges) {
            setPulseEdge(edge)
            nextRanks[edge.v] += distributedValue
            await sleep()
          }
        } else {
          // Dangling node: distributes equally to all
          const distributedValue = (DAMPING_FACTOR * currentRanks[uNode.id]) / N
          nodes.forEach(vNode => (nextRanks[vNode.id] += distributedValue))
          setCurrentStep(`Node ${uNode.label} is a dangling node. Distributing rank globally.`)
          await sleep()
        }
        setPulseEdge(null)
      }

      currentRanks = nextRanks
      setNodes(nodes.map(n => ({ ...n, rank: currentRanks[n.id] })))
      setActiveNode(null)
      await sleep()
    }

    setCurrentStep('PageRank converged. Node sizes reflect relative importance.')
    setIsRunning(false)
    isRunningRef.current = false
  }

  // Helper for node sizing based on rank
  const getRadius = (rank) => {
    const base = 22
    const scale = nodes.length > 0 ? rank * nodes.length : 1
    return Math.max(18, Math.min(50, base * scale))
  }

  const handleSample = () => {
    setNodes(INITIAL_NODES)
    setEdges(INITIAL_EDGES)
    resetAlgoState()
  }

  const handleClear = () => {
    setNodes([])
    setEdges([])
    resetAlgoState()
  }

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      {/* Sidebar */}
      <PageRankSidebar
        isRunning={isRunning}
        mode={mode}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        onModeChange={setMode}
        onRunAlgorithm={runPageRank}
        currentStep={currentStep}
        nodes={nodes}
        activeNode={activeNode}
        onSample={handleSample}
        onClear={handleClear}
      />

      {/* Main Workspace */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <svg ref={svgRef} className="w-full h-full cursor-crosshair">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="28"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.slateGrey} />
            </marker>
            <marker
              id="arrow-pulse"
              viewBox="0 0 10 10"
              refX="28"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.carbonBlack} />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const u = nodes.find(n => n.id === edge.u)
            const v = nodes.find(n => n.id === edge.v)
            if (!u || !v) return null

            const isPulsing = pulseEdge?.u === edge.u && pulseEdge?.v === edge.v

            return (
              <line
                key={i}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={isPulsing ? COLORS.carbonBlack : COLORS.alabasterGrey}
                strokeWidth={isPulsing ? '4' : '2'}
                markerEnd={isPulsing ? 'url(#arrow-pulse)' : 'url(#arrow)'}
                className="transition-all duration-300"
              />
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isActive = activeNode === node.id
            const isSelected = linkSource === node.id
            const radius = getRadius(node.rank)

            let fill = 'white',
              stroke = COLORS.alabasterGrey,
              textColor = COLORS.carbonBlack

            if (isActive) {
              fill = COLORS.carbonBlack
              stroke = COLORS.carbonBlack
              textColor = 'white'
            }
            if (isSelected) stroke = COLORS.ironGrey

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
                  r={radius}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isActive || isSelected ? '3' : '2'}
                  className="shadow-lg transition-all duration-700"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dy=".3em"
                  fontSize={Math.max(10, radius / 2)}
                  fontWeight="900"
                  fill={textColor}
                >
                  {node.label}
                </text>

                {isActive && (
                  <text
                    x={node.x}
                    y={node.y - radius - 10}
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="black"
                    fill={COLORS.carbonBlack}
                    className="animate-bounce"
                  >
                    DISTRIBUTING
                  </text>
                )}

                <text
                  x={node.x}
                  y={node.y + radius + 15}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill={COLORS.slateGrey}
                >
                  {(node.rank * 100).toFixed(1)}%
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
          <div className="flex items-center gap-8">
            <LegendItem color={COLORS.carbonBlack} label="Active Distributor" />
            <LegendItem color={COLORS.platinum} label="Relative Rank (Size)" />
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-[#6c757d]" />
              <span className="text-[9px] font-black uppercase text-[#6c757d]">Iterative Convergence</span>
            </div>
          </div>
          <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
          <div className="flex items-center gap-2">
            <Info size={14} className="text-[#adb5bd]" />
            <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
              PageRank: Nodes gain authority by receiving links from other high-authority nodes.
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

const LegendItem = ({ color, label, border }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${border ? 'border border-[#dee2e6]' : ''}`} style={{ backgroundColor: color }}></div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
)

export default PageRank

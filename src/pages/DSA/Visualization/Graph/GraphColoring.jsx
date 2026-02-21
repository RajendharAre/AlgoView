import React, { useState, useEffect, useRef } from 'react'
import GraphColoringSidebar from './components/GraphColoringSidebar'
import GraphColoringCanvas from './components/GraphColoringCanvas'
import GraphColoringLegend from './components/GraphColoringLegend'
import {
  SPEEDS,
  COLORS,
  INITIAL_NODES,
  INITIAL_EDGES,
  NODE_PALETTE,
  getNeighbors,
  getNeighborColors,
  findAvailableColor,
} from './utils/graphColoringUtils'

/**
 * Graph Coloring Visualizer (Greedy Algorithm)
 * Palette: Vibrant Node Colors + Monochromatic Dashboard
 */
const GraphColoring = () => {
  // Graph State
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)
  const [mode, setMode] = useState('ADD')

  // Algorithm State
  const [isRunning, setIsRunning] = useState(false)
  const [nodeColors, setNodeColors] = useState({}) // {nodeId: paletteIndex}
  const [activeNode, setActiveNode] = useState(null)
  const [checkingNeighbors, setCheckingNeighbors] = useState([])
  const [speedIndex, setSpeedIndex] = useState(1)
  const [chromaticNumber, setChromaticNumber] = useState(0)

  // UI State
  const [currentStep, setCurrentStep] = useState('Assigning vibrant colors so no neighbors match.')
  const [linkSource, setLinkSource] = useState(null)

  const speedRef = useRef(SPEEDS[1].value)
  const isRunningRef = useRef(false)
  const svgRef = useRef(null)

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value
  }, [speedIndex])

  // --- Graph Management ---

  const handleCanvasClick = e => {
    if (isRunning || mode !== 'ADD') return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setNodes([...nodes, { id: nodes.length, x, y, label: nodes.length.toString() }])
    resetAlgoState()
  }

  const handleNodeClick = (e, node) => {
    e.stopPropagation()
    if (isRunning) return

    if (mode === 'DELETE') {
      setNodes(nodes.filter(n => n.id !== node.id))
      setEdges(edges.filter(edge => edge.u !== node.id && edge.v !== node.id))
      resetAlgoState()
    } else if (mode === 'LINK') {
      if (linkSource === null) {
        setLinkSource(node.id)
      } else if (linkSource !== node.id) {
        const exists = edges.some(
          edge =>
            (edge.u === linkSource && edge.v === node.id) ||
            (edge.u === node.id && edge.v === linkSource)
        )
        if (!exists) {
          setEdges([...edges, { u: linkSource, v: node.id }])
        }
        setLinkSource(null)
        resetAlgoState()
      }
    }
  }

  const resetAlgoState = () => {
    setNodeColors({})
    setActiveNode(null)
    setCheckingNeighbors([])
    setChromaticNumber(0)
    setCurrentStep('Ready to perform greedy coloring.')
  }

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current))

  // --- Graph Coloring Algorithm ---

  const runColoring = async () => {
    if (isRunning || nodes.length === 0) return

    setIsRunning(true)
    isRunningRef.current = true
    resetAlgoState()

    const localColors = {}
    let maxColorUsed = -1

    for (let i = 0; i < nodes.length; i++) {
      if (!isRunningRef.current) return

      const u = nodes[i]
      setActiveNode(u.id)
      setCurrentStep(
        `Checking assigned colors of Node ${u.label}'s neighbors...`
      )

      const neighbors = getNeighbors(u.id, edges)

      setCheckingNeighbors(neighbors)
      await sleep()

      const usedNeighborColors = getNeighborColors(u.id, edges, localColors)
      const colorIdx = findAvailableColor(usedNeighborColors)

      localColors[u.id] = colorIdx
      maxColorUsed = Math.max(maxColorUsed, colorIdx)

      setNodeColors({ ...localColors })
      setChromaticNumber(maxColorUsed + 1)
      setCurrentStep(
        `Assigned ${NODE_PALETTE[colorIdx % NODE_PALETTE.length].name} to Node ${u.label}.`
      )

      await sleep()
      setCheckingNeighbors([])
    }

    setActiveNode(null)
    setCurrentStep(
      `Success! Minimum ${maxColorUsed + 1} colors required for this graph.`
    )
    setIsRunning(false)
    isRunningRef.current = false
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
      <GraphColoringSidebar
        isRunning={isRunning}
        mode={mode}
        setMode={setMode}
        speedIndex={speedIndex}
        setSpeedIndex={setSpeedIndex}
        runColoring={runColoring}
        onSample={handleSample}
        onClear={handleClear}
        currentStep={currentStep}
        chromaticNumber={chromaticNumber}
        nodes={nodes}
      />

      {/* Main Canvas */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden">
        <GraphColoringCanvas
          svgRef={svgRef}
          nodes={nodes}
          edges={edges}
          nodeColors={nodeColors}
          activeNode={activeNode}
          checkingNeighbors={checkingNeighbors}
          linkSource={linkSource}
          handleCanvasClick={handleCanvasClick}
          handleNodeClick={handleNodeClick}
        />

        {/* Legend */}
        <GraphColoringLegend />
      </main>
    </div>
  )
}

export default GraphColoring

import React, { useState, useEffect, useRef } from 'react'
import KruskalSidebar from './components/KruskalSidebar'
import KruskalCanvas from './components/KruskalCanvas'
import KruskalLegend from './components/KruskalLegend'
import { SPEEDS, COLORS, INITIAL_NODES, INITIAL_EDGES, find, union } from './utils/kruskalUtils'

/**
 * Kruskal's Algorithm Visualizer
 * Main component orchestrating the Kruskal's MST algorithm visualization
 */
const Kruskal = () => {
  // Graph State
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)
  const [mode, setMode] = useState('ADD')

  // Algorithm State
  const [isRunning, setIsRunning] = useState(false)
  const [sortedEdges, setSortedEdges] = useState([])
  const [currentEdgeIdx, setCurrentEdgeIdx] = useState(-1)
  const [mstEdges, setMstEdges] = useState([])
  const [rejectedEdges, setRejectedEdges] = useState([])
  const [totalWeight, setTotalWeight] = useState(0)

  // UI State
  const [speedIndex, setSpeedIndex] = useState(1)
  const [currentStep, setCurrentStep] = useState(
    "Kruskal's adds the cheapest edges that don't form cycles."
  )
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

    setNodes([...nodes, { id: Date.now(), x, y, label: nodes.length.toString() }])
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
          const weight = Math.floor(Math.random() * 15) + 1
          setEdges([...edges, { u: linkSource, v: node.id, weight }])
        }
        setLinkSource(null)
        resetAlgoState()
      }
    }
  }

  const resetAlgoState = () => {
    setCurrentEdgeIdx(-1)
    setMstEdges([])
    setRejectedEdges([])
    setSortedEdges([])
    setTotalWeight(0)
    setCurrentStep("Ready to find the Minimum Spanning Tree.")
  }

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current))

  // --- Kruskal's Algorithm ---

  const runKruskal = async () => {
    if (isRunning || nodes.length === 0 || edges.length === 0) return

    setIsRunning(true)
    isRunningRef.current = true
    resetAlgoState()

    // Create a mapping from node ID to index (0 to n-1)
    const nodeIdToIndex = {}
    nodes.forEach((node, idx) => {
      nodeIdToIndex[node.id] = idx
    })

    const V = nodes.length
    const parent = Array.from({ length: V }, (_, i) => i)
    const rank = Array(V).fill(0)

    // Step 1: Sort all edges
    const localSorted = [...edges].sort((a, b) => a.weight - b.weight)
    setSortedEdges(localSorted)
    setCurrentStep('Sorting all edges by weight...')
    await sleep()

    let weightSum = 0

    for (let i = 0; i < localSorted.length; i++) {
      if (!isRunningRef.current) return
      setCurrentEdgeIdx(i)
      const edge = localSorted[i]
      const uNode = nodes.find(n => n.id === edge.u)
      const vNode = nodes.find(n => n.id === edge.v)

      if (!uNode || !vNode) continue

      const uLabel = uNode.label
      const vLabel = vNode.label

      setCurrentStep(`Considering Edge (${uLabel}, ${vLabel}) with weight ${edge.weight}`)
      await sleep()

      // Convert node IDs to indices
      const uIdx = nodeIdToIndex[edge.u]
      const vIdx = nodeIdToIndex[edge.v]

      const x = find(parent, uIdx)
      const y = find(parent, vIdx)

      if (x !== y) {
        weightSum += edge.weight
        setMstEdges(prev => [...prev, i])
        setTotalWeight(weightSum)
        union(parent, rank, x, y)
        setCurrentStep(`✓ Accepted: Edge (${uLabel}, ${vLabel}) - Total MST weight: ${weightSum}`)
      } else {
        setRejectedEdges(prev => [...prev, i])
        setCurrentStep(`✗ Rejected: Edge (${uLabel}, ${vLabel}) forms a cycle`)
      }
      await sleep()
    }

    setCurrentEdgeIdx(-1)
    setCurrentStep(`✓ Kruskal's Complete! MST Total Weight: ${weightSum}`)
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
      <KruskalSidebar
        isRunning={isRunning}
        mode={mode}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        onModeChange={setMode}
        onRunAlgorithm={runKruskal}
        onReset={() => {
          resetAlgoState()
          setIsRunning(false)
          isRunningRef.current = false
        }}
        onSample={handleSample}
        onClear={handleClear}
        currentStep={currentStep}
        mstEdges={mstEdges}
        totalWeight={totalWeight}
        sortedEdges={sortedEdges}
        rejectedEdges={rejectedEdges}
        nodes={nodes}
        edges={edges}
      />

      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <KruskalCanvas
          ref={svgRef}
          nodes={nodes}
          edges={edges}
          sortedEdges={sortedEdges}
          currentEdgeIdx={currentEdgeIdx}
          mstEdges={mstEdges}
          rejectedEdges={rejectedEdges}
          linkSource={linkSource}
          isRunning={isRunning}
          onCanvasClick={handleCanvasClick}
          onNodeClick={handleNodeClick}
        />

        <KruskalLegend />
      </main>
    </div>
  )
}

export default Kruskal

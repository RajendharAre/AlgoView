import React, { useState, useCallback, useRef, useEffect } from 'react'
import PrimCanvas from './components/PrimCanvas'
import PrimSidebar from './components/PrimSidebar'
import PrimLegend from './components/PrimLegend'
import { COLORS, SPEEDS, INITIAL_NODES, INITIAL_EDGES } from './utils/primUtils'

/**
 * Prim's Algorithm Visualizer
 * Implements Minimum Spanning Tree using greedy node expansion
 */
const Prim = () => {
  const canvasRef = useRef(null)

  // Core data
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)
  const [visited, setVisited] = useState(new Set())
  const [mstEdges, setMstEdges] = useState([])
  const [costs, setCosts] = useState({})
  const [parent, setParent] = useState({})
  const [startNodeId, setStartNodeId] = useState(0)
  const [linkSource, setLinkSource] = useState(null)

  // UI state
  const [mode, setMode] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [currentStep, setCurrentStep] = useState("Prim's grows a tree from a start node by picking the cheapest neighbor.")
  const [activeNode, setActiveNode] = useState(null)
  const [totalWeight, setTotalWeight] = useState(0)

  const speedRef = useRef(SPEEDS[1].value)
  const isRunningRef = useRef(false)

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value
  }, [speedIndex])

  const resetAlgoState = useCallback(() => {
    setVisited(new Set())
    setMstEdges([])
    setActiveNode(null)
    setCosts({})
    setParent({})
    setTotalWeight(0)
    setCurrentStep("Graph modified. Ready to grow Spanning Tree.")
  }, [])

  /**
   * Handle canvas click for ADD mode
   */
  const handleCanvasClick = useCallback((e) => {
    e.stopPropagation()
    if (isRunning || mode !== 'ADD') return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setNodes(prev => [...prev, { id: prev.length, x, y, label: String.fromCharCode(65 + prev.length) }])
    resetAlgoState()
  }, [mode, isRunning, resetAlgoState])

  /**
   * Handle node click for linking and operations
   */
  const handleNodeClick = (e, node) => {
    e.stopPropagation()
    if (isRunning) return

    if (mode === 'DELETE') {
      const newNodes = nodes.filter(n => n.id !== node.id).map((n, i) => ({ ...n, id: i, label: String.fromCharCode(65 + i) }))
      setNodes(newNodes)
      setEdges(prev =>
        prev
          .filter(edge => edge.u !== node.id && edge.v !== node.id)
          .map(edge => ({
            ...edge,
            u: edge.u > node.id ? edge.u - 1 : edge.u,
            v: edge.v > node.id ? edge.v - 1 : edge.v
          }))
      )
      resetAlgoState()
    } else if (mode === 'LINK') {
      if (linkSource === null) {
        setLinkSource(node.id)
        setCurrentStep(`Selected ${node.label}. Click another node to connect.`)
      } else if (linkSource !== node.id) {
        const exists = edges.some(
          edge =>
            (edge.u === linkSource && edge.v === node.id) ||
            (edge.u === node.id && edge.v === linkSource)
        )
        if (!exists) {
          const weight = Math.floor(Math.random() * 15) + 1
          setEdges(prev => [...prev, { u: linkSource, v: node.id, weight }])
          setCurrentStep(`Edge (${nodes.find(n => n.id === linkSource)?.label}-${node.label}) weight ${weight} added`)
        } else {
          setCurrentStep('Edge already exists')
        }
        setLinkSource(null)
        resetAlgoState()
      }
    } else if (mode === 'START') {
      setStartNodeId(node.id)
      setCurrentStep(`Start node set to ${node.label}`)
      resetAlgoState()
    }
  }

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current))

  /**
   * Run Prim's Algorithm
   */
  const runPrims = async () => {
    if (isRunning || nodes.length === 0) return

    setIsRunning(true)
    isRunningRef.current = true
    resetAlgoState()

    const V = nodes.length
    let localVisited = new Set()
    let localCosts = {}
    let localParent = {}
    let localMstEdges = []
    let localWeight = 0

    // Initialize costs
    for (let i = 0; i < V; i++) {
      localCosts[i] = Infinity
    }
    localCosts[startNodeId] = 0

    setCosts({ ...localCosts })
    setCurrentStep(`Initializing: Starting Prim's from Node ${nodes.find(n => n.id === startNodeId)?.label}`)
    await sleep()

    // Prim's main loop
    for (let i = 0; i < V; i++) {
      if (!isRunningRef.current) return

      // Pick the node with minimum cost not yet in MST
      let u = -1
      for (let v = 0; v < V; v++) {
        if (!localVisited.has(v)) {
          if (u === -1 || localCosts[v] < localCosts[u]) {
            u = v
          }
        }
      }

      if (u === -1 || localCosts[u] === Infinity) break

      setActiveNode(u)
      setCurrentStep(`Picking Node ${nodes.find(n => n.id === u)?.label} with min connection cost ${localCosts[u]}`)
      await sleep()

      localVisited.add(u)
      setVisited(new Set(localVisited))

      // Add edge to MST if not root
      if (localParent[u] !== undefined) {
        localMstEdges.push({ u: localParent[u], v: u })
        setMstEdges([...localMstEdges])
        const edgeWeight = edges.find(
          e => (e.u === u && e.v === localParent[u]) || (e.v === u && e.u === localParent[u])
        )?.weight || 0
        localWeight += edgeWeight
        setTotalWeight(localWeight)
      }

      // Update costs for neighbors
      const neighbors = edges
        .filter(e => e.u === u || e.v === u)
        .map(e => ({ target: e.u === u ? e.v : e.u, weight: e.weight }))

      for (let neighbor of neighbors) {
        if (!isRunningRef.current) return
        if (!localVisited.has(neighbor.target) && neighbor.weight < localCosts[neighbor.target]) {
          localCosts[neighbor.target] = neighbor.weight
          localParent[neighbor.target] = u

          setCosts({ ...localCosts })
          setParent({ ...localParent })
          setCurrentStep(`Updating connection to Node ${nodes.find(n => n.id === neighbor.target)?.label} (Cost: ${neighbor.weight})`)
          await sleep()
        }
      }
      setActiveNode(null)
    }

    setCurrentStep(`Prim's Complete. MST Total Weight: ${localWeight}`)
    setIsRunning(false)
    isRunningRef.current = false
  }

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      {/* Sidebar - LEFT */}
      <PrimSidebar
        isRunning={isRunning}
        mode={mode}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        onModeChange={setMode}
        onRunAlgorithm={runPrims}
        onReset={() => {
          setNodes(INITIAL_NODES)
          setEdges(INITIAL_EDGES)
          resetAlgoState()
        }}
        onSample={() => {
          setNodes(INITIAL_NODES)
          setEdges(INITIAL_EDGES)
          resetAlgoState()
        }}
        onClear={() => {
          setNodes([])
          setEdges([])
          resetAlgoState()
        }}
        currentStep={currentStep}
        visited={visited}
        totalWeight={totalWeight}
        costs={costs}
        parent={parent}
        activeNode={activeNode}
        startNodeId={startNodeId}
        nodes={nodes}
        edges={edges}
      />

      {/* Canvas - RIGHT */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <PrimCanvas
          ref={canvasRef}
          nodes={nodes}
          edges={edges}
          visited={visited}
          mstEdges={mstEdges}
          costs={costs}
          parent={parent}
          startNodeId={startNodeId}
          activeNode={activeNode}
          linkSource={linkSource}
          onCanvasClick={handleCanvasClick}
          onNodeClick={handleNodeClick}
        />

        <PrimLegend />
      </main>
    </div>
  )
}

Prim.displayName = 'Prim'

export default Prim

import React, { useState, useCallback, useRef, useEffect } from 'react'
import TopSortCanvas from './components/TopSortCanvas'
import TopSortSidebar from './components/TopSortSidebar'
import TopSortLegend from './components/TopSortLegend'
import { COLORS, SPEEDS, INITIAL_NODES, INITIAL_EDGES } from './utils/topSortUtils'

/**
 * Topological Sort (Kahn's Algorithm) Visualizer
 * Finds linear ordering of vertices in a directed acyclic graph (DAG)
 */
const TopologicalSort = () => {
  const canvasRef = useRef(null)

  // Core data
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)
  const [visited, setVisited] = useState(new Set())
  const [queue, setQueue] = useState([])
  const [traversalOrder, setTraversalOrder] = useState([])
  const [inDegrees, setInDegrees] = useState({})
  const [activeEdges, setActiveEdges] = useState([])
  const [cycleDetected, setCycleDetected] = useState(false)
  const [linkSource, setLinkSource] = useState(null)

  // UI state
  const [mode, setMode] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [currentStep, setCurrentStep] = useState("Kahn's Algorithm resolves nodes with zero dependencies first.")
  const [activeNode, setActiveNode] = useState(null)

  const speedRef = useRef(SPEEDS[1].value)
  const isRunningRef = useRef(false)

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value
  }, [speedIndex])

  const resetAlgoState = useCallback(() => {
    setVisited(new Set())
    setQueue([])
    setActiveNode(null)
    setTraversalOrder([])
    setInDegrees({})
    setActiveEdges([])
    setCycleDetected(false)
    setCurrentStep("Ready to perform topological sort.")
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

    setNodes(prev => [...prev, { id: prev.length, x, y, label: prev.length.toString() }])
    resetAlgoState()
  }, [mode, isRunning, resetAlgoState])

  /**
   * Handle node click for linking and operations
   */
  const handleNodeClick = (e, node) => {
    e.stopPropagation()
    if (isRunning) return

    if (mode === 'DELETE') {
      const newNodes = nodes.filter(n => n.id !== node.id).map((n, i) => ({ ...n, id: i, label: i.toString() }))
      setNodes(newNodes)
      setEdges(prev =>
        prev
          .filter(edge => edge.u !== node.id && edge.v !== node.id)
          .map(edge => ({
            ...edge,
            u: edge.u > node.id ? edge.u - 1 : edge.u,
            v: edge.v > node.id ? edge.v - 1 : edge.v,
          }))
      )
      resetAlgoState()
    } else if (mode === 'LINK') {
      if (linkSource === null) {
        setLinkSource(node.id)
        setCurrentStep(`Selected ${node.label}. Click another node to create directed edge.`)
      } else if (linkSource !== node.id) {
        const exists = edges.some(edge => edge.u === linkSource && edge.v === node.id)
        if (!exists) {
          setEdges(prev => [...prev, { u: linkSource, v: node.id }])
          setCurrentStep(`Directed edge ${nodes.find(n => n.id === linkSource)?.label}→${node.label} added`)
        } else {
          setCurrentStep('Edge already exists')
        }
        setLinkSource(null)
        resetAlgoState()
      }
    }
  }

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current))

  /**
   * Run Kahn's Topological Sort Algorithm
   */
  const runTopologicalSort = async () => {
    if (isRunning || nodes.length === 0) return

    setIsRunning(true)
    isRunningRef.current = true
    resetAlgoState()

    const V = nodes.length
    let localInDegrees = {}
    let localQueue = []
    let localVisited = new Set()
    let localOrder = []

    // Initialize in-degrees
    for (let i = 0; i < V; i++) {
      localInDegrees[i] = 0
    }
    edges.forEach(e => {
      localInDegrees[e.v]++
    })

    setInDegrees({ ...localInDegrees })
    setCurrentStep('Calculating initial in-degrees for all nodes.')
    await sleep()

    // Find all nodes with in-degree 0
    for (let i = 0; i < V; i++) {
      if (localInDegrees[i] === 0) {
        localQueue.push(i)
      }
    }

    setQueue([...localQueue])
    setCurrentStep(`Found ${localQueue.length} nodes with in-degree 0. Adding to queue.`)
    await sleep()

    // Process queue
    while (localQueue.length > 0) {
      if (!isRunningRef.current) return

      const u = localQueue.shift()
      const uNode = nodes.find(n => n.id === u)

      setQueue([...localQueue])
      setActiveNode(u)
      setCurrentStep(`Processing Node ${uNode?.label}: Moving to final order.`)
      await sleep()

      localVisited.add(u)
      localOrder.push(uNode?.label)
      setVisited(new Set(localVisited))
      setTraversalOrder([...localOrder])

      // Find outbound edges from u
      const outboundEdges = edges.filter(e => e.u === u)
      setActiveEdges(outboundEdges.map(e => edges.indexOf(e)))

      if (outboundEdges.length > 0) {
        setCurrentStep(`Removing outbound edges from Node ${uNode?.label}...`)
        await sleep()
      }

      // Decrease in-degree for neighbors
      for (let edge of outboundEdges) {
        if (!isRunningRef.current) return

        localInDegrees[edge.v]--
        setInDegrees({ ...localInDegrees })

        if (localInDegrees[edge.v] === 0) {
          localQueue.push(edge.v)
          setQueue([...localQueue])
          const vNode = nodes.find(n => n.id === edge.v)
          setCurrentStep(`Node ${vNode?.label} dependency resolved. Adding to queue.`)
          await sleep()
        }
      }

      setActiveEdges([])
      setActiveNode(null)
    }

    // Check for cycle
    if (localOrder.length < V) {
      setCycleDetected(true)
      setCurrentStep('Cycle detected! Topological sort only works on Directed Acyclic Graphs (DAGs).')
    } else {
      setCurrentStep('Topological Sort Complete. Sequence represents dependency resolution order.')
    }

    setIsRunning(false)
    isRunningRef.current = false
  }

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      {/* Sidebar - LEFT */}
      <TopSortSidebar
        isRunning={isRunning}
        mode={mode}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        onModeChange={setMode}
        onRunAlgorithm={runTopologicalSort}
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
        queue={queue}
        traversalOrder={traversalOrder}
        inDegrees={inDegrees}
        activeNode={activeNode}
        nodes={nodes}
        cycleDetected={cycleDetected}
      />

      {/* Canvas - RIGHT */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <TopSortCanvas
          ref={canvasRef}
          nodes={nodes}
          edges={edges}
          visited={visited}
          queue={queue}
          activeNode={activeNode}
          inDegrees={inDegrees}
          activeEdges={activeEdges}
          linkSource={linkSource}
          onCanvasClick={handleCanvasClick}
          onNodeClick={handleNodeClick}
        />

        <TopSortLegend />
      </main>
    </div>
  )
}

TopologicalSort.displayName = 'TopologicalSort'

export default TopologicalSort

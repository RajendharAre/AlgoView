import React, { useState, useCallback, useRef, useEffect } from 'react'
import KosarajuCanvas from './components/KosarajuCanvas'
import KosarajuSidebar from './components/KosarajuSidebar'
import KosarajuLegend from './components/KosarajuLegend'
import { COLORS, SPEEDS, INITIAL_NODES, INITIAL_EDGES } from './utils/kosarajuUtils'

/**
 * Kosaraju's Algorithm Visualizer
 * Finds all Strongly Connected Components in a directed graph
 * Two-Pass DFS: Pass 1 (find finishing times), Pass 2 (on transposed graph)
 */
const Kosaraju = () => {
  const canvasRef = useRef(null)

  // Core data
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)
  const [visited, setVisited] = useState(new Set())
  const [finishingStack, setFinishingStack] = useState([])
  const [sccGroups, setSccGroups] = useState([])
  const [currentScc, setCurrentScc] = useState([])
  const [isTransposed, setIsTransposed] = useState(false)
  const [linkSource, setLinkSource] = useState(null)

  // UI state
  const [mode, setMode] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [phase, setPhase] = useState('IDLE')
  const [currentStep, setCurrentStep] = useState('Build a directed graph to find its Strongly Connected Components.')
  const [activeNode, setActiveNode] = useState(null)

  const speedRef = useRef(SPEEDS[1].value)
  const isRunningRef = useRef(false)

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value
  }, [speedIndex])

  const resetAlgoState = useCallback(() => {
    setVisited(new Set())
    setFinishingStack([])
    setActiveNode(null)
    setIsTransposed(false)
    setSccGroups([])
    setCurrentScc([])
    setPhase('IDLE')
    setCurrentStep('Ready to start Pass 1.')
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
   * Pass 1 DFS: Build finishing times stack
   */
  const dfs1 = async (u, localVisited, stack) => {
    if (!isRunningRef.current) return
    localVisited.add(u)
    setVisited(new Set(localVisited))
    setActiveNode(u)
    setCurrentStep(`Pass 1: Discovering Node ${nodes.find(n => n.id === u)?.label}`)
    await sleep()

    const neighbors = edges.filter(e => e.u === u).map(e => e.v)
    for (const v of neighbors) {
      if (!localVisited.has(v)) {
        await dfs1(v, localVisited, stack)
      }
    }

    stack.push(u)
    setFinishingStack([...stack])
    setActiveNode(u)
    setCurrentStep(`Pass 1: Node ${nodes.find(n => n.id === u)?.label} finished. Pushing to stack.`)
    await sleep()
  }

  /**
   * Pass 2 DFS: On transposed graph to find SCCs
   */
  const dfs2 = async (u, localVisited, currentSccGroup) => {
    if (!isRunningRef.current) return
    localVisited.add(u)
    setVisited(new Set(localVisited))
    currentSccGroup.push(u)
    setCurrentScc([...currentSccGroup])
    setActiveNode(u)
    setCurrentStep(`Pass 2: Node ${nodes.find(n => n.id === u)?.label} is part of the current SCC.`)
    await sleep()

    // Neighbors on reversed edges (transposed graph)
    const neighbors = edges.filter(e => e.v === u).map(e => e.u)
    for (const v of neighbors) {
      if (!localVisited.has(v)) {
        await dfs2(v, localVisited, currentSccGroup)
      }
    }
  }

  /**
   * Run Kosaraju's Algorithm
   */
  const runKosaraju = async () => {
    if (isRunning || nodes.length === 0) return

    setIsRunning(true)
    isRunningRef.current = true
    resetAlgoState()

    // Pass 1: Build finishing times stack
    setPhase('PHASE_1')
    const localVisited1 = new Set()
    const stack = []
    for (let i = 0; i < nodes.length; i++) {
      if (!localVisited1.has(i)) {
        await dfs1(i, localVisited1, stack)
      }
    }
    setActiveNode(null)

    // Transpose transition
    setPhase('TRANSPOSE')
    setCurrentStep('Pass 1 finished. Transposing graph (reversing all edges)...')
    await sleep()
    setIsTransposed(true)
    await sleep()

    // Pass 2: DFS on transposed graph
    setPhase('PHASE_2')
    setVisited(new Set())
    const localVisited2 = new Set()
    const groups = []

    const order = [...stack].reverse()
    for (let uId of order) {
      if (!isRunningRef.current) return
      if (!localVisited2.has(uId)) {
        const currentGroup = []
        setCurrentScc([])
        setCurrentStep(`Pass 2: Popping Node ${nodes.find(n => n.id === uId)?.label} from stack to find new SCC.`)
        await sleep()
        await dfs2(uId, localVisited2, currentGroup)
        groups.push(currentGroup)
        setSccGroups([...groups])
        setCurrentScc([])
        setCurrentStep(`SCC Found: {${currentGroup.map(id => nodes.find(n => n.id === id)?.label).join(', ')}}`)
        await sleep()
      }
    }

    setActiveNode(null)
    setPhase('IDLE')
    setCurrentStep(`Kosaraju's Complete. Found ${groups.length} Strongly Connected Components.`)
    setIsRunning(false)
    isRunningRef.current = false
  }

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      {/* Sidebar - LEFT */}
      <KosarajuSidebar
        isRunning={isRunning}
        mode={mode}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        onModeChange={setMode}
        onRunAlgorithm={runKosaraju}
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
        finishingStack={finishingStack}
        sccGroups={sccGroups}
        phase={phase}
        nodes={nodes}
      />

      {/* Canvas - RIGHT */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <KosarajuCanvas
          ref={canvasRef}
          nodes={nodes}
          edges={edges}
          visited={visited}
          activeNode={activeNode}
          isTransposed={isTransposed}
          sccGroups={sccGroups}
          currentScc={currentScc}
          linkSource={linkSource}
          onCanvasClick={handleCanvasClick}
          onNodeClick={handleNodeClick}
        />

        <KosarajuLegend isTransposed={isTransposed} />
      </main>
    </div>
  )
}

Kosaraju.displayName = 'Kosaraju'

export default Kosaraju

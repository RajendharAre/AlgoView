import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  GitGraph,
  Copy,
  Undo2,
} from 'lucide-react'
import EnhancedGraphVisualizer from './EnhancedGraphVisualizer'
import VisualizationControlPanel from './VisualizationControlPanel'

/**
 * Interactive Graph Editor Component
 * Allows users to add/delete nodes and edges dynamically
 * Supports graph visualization and algorithm execution
 */
const InteractiveGraphEditor = () => {
  // Graph data
  const [nodes, setNodes] = useState([
    { id: 'A', label: 'A', x: 400, y: 100 },
    { id: 'B', label: 'B', x: 200, y: 300 },
    { id: 'C', label: 'C', x: 600, y: 300 },
    { id: 'D', label: 'D', x: 400, y: 500 },
    { id: 'E', label: 'E', x: 100, y: 500 },
  ])

  const [edges, setEdges] = useState([
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'E', weight: 2 },
  ])

  // UI state
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [editMode, setEditMode] = useState('view') // 'view', 'addNode', 'addEdge', 'delete'
  const [selectedNodes, setSelectedNodes] = useState([])
  const [newNodeName, setNewNodeName] = useState('')
  const [edgeFromNode, setEdgeFromNode] = useState(null)
  const [edgeToNode, setEdgeToNode] = useState(null)
  const [edgeWeight, setEdgeWeight] = useState(1)
  const [history, setHistory] = useState([{ nodes, edges }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Visualization state
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [step, setStep] = useState({
    description: 'Graph ready - Configure and run algorithms',
    current: null,
    visiting: null,
    frontier: [],
    doneNodes: [],
    visitedEdges: [],
    visitedPath: [],
  })

  // Predefined BFS algorithm steps
  const algorithmSteps = [
    {
      description: 'Starting at node A',
      current: 'A',
      visiting: 'A',
      frontier: ['A'],
      doneNodes: [],
      visitedEdges: [],
      visitedPath: ['A'],
    },
    {
      description: 'Processing node A, visiting neighbors',
      current: 'A',
      visiting: null,
      frontier: ['B', 'C'],
      doneNodes: ['A'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
      ],
      visitedPath: ['A'],
    },
    {
      description: 'Moving to node B',
      current: 'B',
      visiting: 'B',
      frontier: ['C', 'D'],
      doneNodes: ['A'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
      ],
      visitedPath: ['A', 'B'],
    },
    {
      description: 'Processing node B',
      current: 'B',
      visiting: null,
      frontier: ['C', 'D'],
      doneNodes: ['A', 'B'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
      ],
      visitedPath: ['A', 'B'],
    },
    {
      description: 'Moving to node C',
      current: 'C',
      visiting: 'C',
      frontier: ['D', 'D'],
      doneNodes: ['A', 'B'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
      ],
      visitedPath: ['A', 'C'],
    },
    {
      description: 'Processing node C',
      current: 'C',
      visiting: null,
      frontier: ['D', 'D'],
      doneNodes: ['A', 'B', 'C'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
      ],
      visitedPath: ['A', 'C'],
    },
    {
      description: 'Moving to node D',
      current: 'D',
      visiting: 'D',
      frontier: ['E'],
      doneNodes: ['A', 'B', 'C'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E' },
      ],
      visitedPath: ['A', 'B', 'D'],
    },
    {
      description: 'Processing node D',
      current: 'D',
      visiting: null,
      frontier: ['E'],
      doneNodes: ['A', 'B', 'C', 'D'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E' },
      ],
      visitedPath: ['A', 'B', 'D'],
    },
    {
      description: 'Moving to node E',
      current: 'E',
      visiting: 'E',
      frontier: [],
      doneNodes: ['A', 'B', 'C', 'D'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E' },
      ],
      visitedPath: ['A', 'B', 'D', 'E'],
    },
    {
      description: 'BFS Complete - All nodes visited',
      current: null,
      visiting: null,
      frontier: [],
      doneNodes: ['A', 'B', 'C', 'D', 'E'],
      visitedEdges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E' },
      ],
      visitedPath: ['A', 'B', 'C', 'D', 'E'],
    },
  ]

  // Dark mode detection
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const htmlHasDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(prefersDark || htmlHasDark)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      setIsDarkMode(e.matches || document.documentElement.classList.contains('dark'))
    }
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  // Animation loop for algorithms
  useEffect(() => {
    if (!isRunning || algorithmSteps.length === 0) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= algorithmSteps.length - 1) {
          setIsRunning(false)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [isRunning, algorithmSteps.length])

  // Update visualization step
  useEffect(() => {
    if (currentStep < algorithmSteps.length) {
      setStep(algorithmSteps[currentStep])
    }
  }, [currentStep, algorithmSteps])

  // Add node to history
  const saveToHistory = useCallback((newNodes, newEdges) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ nodes: newNodes, edges: newEdges })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Add node
  const handleAddNode = () => {
    if (!newNodeName.trim()) {
      alert('Please enter a node name')
      return
    }

    if (nodes.some((n) => n.id === newNodeName)) {
      alert('Node already exists')
      return
    }

    const angle = (nodes.length / 5) * 2 * Math.PI
    const radius = 150
    const newNode = {
      id: newNodeName.toUpperCase(),
      label: newNodeName.toUpperCase(),
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
    }

    const newNodes = [...nodes, newNode]
    setNodes(newNodes)
    saveToHistory(newNodes, edges)
    setNewNodeName('')
    setEditMode('view')
  }

  // Delete node
  const handleDeleteNode = (nodeId) => {
    const newNodes = nodes.filter((n) => n.id !== nodeId)
    const newEdges = edges.filter((e) => e.from !== nodeId && e.to !== nodeId)
    setNodes(newNodes)
    setEdges(newEdges)
    saveToHistory(newNodes, newEdges)
    setSelectedNodes(selectedNodes.filter((id) => id !== nodeId))
  }

  // Add edge
  const handleAddEdge = (nodeId) => {
    if (editMode !== 'addEdge') return

    if (!edgeFromNode) {
      setEdgeFromNode(nodeId)
    } else if (nodeId === edgeFromNode) {
      alert('Cannot connect a node to itself')
      setEdgeFromNode(null)
    } else {
      setEdgeToNode(nodeId)
    }
  }

  // Confirm edge creation
  const confirmEdge = () => {
    if (!edgeFromNode || !edgeToNode) return

    const edgeExists = edges.some(
      (e) => (e.from === edgeFromNode && e.to === edgeToNode) || (e.from === edgeToNode && e.to === edgeFromNode)
    )

    if (edgeExists) {
      alert('Edge already exists')
      resetEdge()
      return
    }

    const newEdge = {
      from: edgeFromNode,
      to: edgeToNode,
      weight: edgeWeight,
    }

    const newEdges = [...edges, newEdge]
    setEdges(newEdges)
    saveToHistory(nodes, newEdges)
    resetEdge()
    setEditMode('view')
  }

  const resetEdge = () => {
    setEdgeFromNode(null)
    setEdgeToNode(null)
    setEdgeWeight(1)
  }

  // Delete edge
  const handleDeleteEdge = (from, to) => {
    const newEdges = edges.filter((e) => !(e.from === from && e.to === to))
    setEdges(newEdges)
    saveToHistory(nodes, newEdges)
  }

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const { nodes: historyNodes, edges: historyEdges } = history[newIndex]
      setNodes(historyNodes)
      setEdges(historyEdges)
    }
  }

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const { nodes: historyNodes, edges: historyEdges } = history[newIndex]
      setNodes(historyNodes)
      setEdges(historyEdges)
    }
  }

  // Load a new graph (from generator or external source)
  const handleLoadGraph = (newGraph) => {
    if (newGraph.nodes && newGraph.edges) {
      setNodes(newGraph.nodes)
      setEdges(newGraph.edges)
      setCurrentStep(0)
      setIsRunning(false)
      saveToHistory(newGraph.nodes, newGraph.edges)
    }
  }

  // Reset graph
  const handleReset = () => {
    const defaultNodes = [
      { id: 'A', label: 'A', x: 400, y: 100 },
      { id: 'B', label: 'B', x: 200, y: 300 },
      { id: 'C', label: 'C', x: 600, y: 300 },
      { id: 'D', label: 'D', x: 400, y: 500 },
      { id: 'E', label: 'E', x: 100, y: 500 },
    ]

    const defaultEdges = [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 3 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'E', weight: 2 },
    ]

    setNodes(defaultNodes)
    setEdges(defaultEdges)
    saveToHistory(defaultNodes, defaultEdges)
    setCurrentStep(0)
    setIsRunning(false)
  }

  // Play algorithm
  const handlePlay = () => {
    setIsRunning(true)
  }

  // Pause algorithm
  const handlePause = () => {
    setIsRunning(false)
  }

  // Step forward
  const handleStepForward = () => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Step backward
  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <GitGraph className="text-blue-600 dark:text-blue-400" size={40} />
                Interactive Graph Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create, edit, and visualize graphs with real-time algorithm execution
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nodes: {nodes.length} | Edges: {edges.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Graph Visualizer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-4"
            style={{ height: '600px' }}
          >
            <EnhancedGraphVisualizer
              nodes={nodes}
              edges={edges}
              step={step}
              isPlaying={isRunning}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onLoadGraph={handleLoadGraph}
              algorithmName="BFS"
              width={800}
              height={600}
              isDark={isDarkMode}
            />
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Graph Controls</h3>

            {/* Mode Selection */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Edit Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setEditMode('view')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    editMode === 'view'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  View
                </button>
                <button
                  onClick={() => setEditMode('addNode')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    editMode === 'addNode'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Add Node
                </button>
              </div>
              <button
                onClick={() => setEditMode('addEdge')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  editMode === 'addEdge'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                Add Edge
              </button>
            </div>

            {/* Add Node Section */}
            {editMode === 'addNode' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Node Name
                </label>
                <input
                  type="text"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNode()}
                  placeholder="e.g., F"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={handleAddNode}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add
                  </button>
                  <button
                    onClick={() => {
                      setEditMode('view')
                      setNewNodeName('')
                    }}
                    className="px-3 py-2 bg-gray-400 text-white rounded-lg font-medium hover:bg-gray-500 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Add Edge Section */}
            {editMode === 'addEdge' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {edgeFromNode ? `From ${edgeFromNode}` : 'Select source node'} →{' '}
                  {edgeToNode ? `To ${edgeToNode}` : 'Select target node'}
                </p>

                {edgeFromNode && edgeToNode && (
                  <>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Edge Weight
                    </label>
                    <input
                      type="number"
                      value={edgeWeight}
                      onChange={(e) => setEdgeWeight(parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        onClick={confirmEdge}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={resetEdge}
                        className="px-3 py-2 bg-gray-400 text-white rounded-lg font-medium hover:bg-gray-500 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => setEditMode('view')}
                    className="col-span-2 px-3 py-2 bg-gray-400 text-white rounded-lg font-medium hover:bg-gray-500 transition-all"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}

            {/* Nodes List */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Nodes ({nodes.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nodes.map((node) => (
                  <motion.div
                    key={node.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-3 rounded-lg border border-gray-200 dark:border-slate-600"
                  >
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{node.label}</span>
                    <button
                      onClick={() => handleDeleteNode(node.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Edges List */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Edges ({edges.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {edges.map((edge, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-3 rounded-lg border border-gray-200 dark:border-slate-600"
                  >
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {edge.from} → {edge.to} ({edge.weight})
                    </span>
                    <button
                      onClick={() => handleDeleteEdge(edge.from, edge.to)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* History Controls */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Undo2 size={16} /> Undo
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </motion.div>
        </div>

        {/* Algorithm Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-6"
        >
          <VisualizationControlPanel
            isRunning={isRunning}
            currentStep={currentStep}
            totalSteps={algorithmSteps.length}
            speed={1}
            algorithName="Breadth-First Search (BFS)"
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={() => {
              setCurrentStep(0)
              setIsRunning(false)
            }}
            onStepBack={handleStepBack}
            onStepForward={handleStepForward}
            onSpeedChange={() => {}}
          />
        </motion.div>

        {/* Step Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Current Step</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300">{step.description}</p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Nodes Visited</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{step.doneNodes?.length || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Frontier Size</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{step.frontier?.length || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400">Edges Traversed</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {step.visitedEdges?.length || 0}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">How to Use</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>✓ Switch to <strong>Add Node</strong> mode to create new nodes</li>
            <li>✓ Switch to <strong>Add Edge</strong> mode to connect nodes</li>
            <li>✓ Click the <strong>trash icon</strong> to delete nodes or edges</li>
            <li>✓ Use <strong>Undo</strong> to revert changes</li>
            <li>✓ Click <strong>Play</strong> to run the BFS algorithm on your graph</li>
            <li>✓ Use <strong>Step Forward/Back</strong> to manually control animation</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default InteractiveGraphEditor

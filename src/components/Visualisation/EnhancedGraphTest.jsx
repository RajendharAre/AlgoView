import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import EnhancedGraphVisualizer from './EnhancedGraphVisualizer'
import VisualizationControlPanel from './VisualizationControlPanel'
import { bfs } from '../../algorithms/Graph/bfs'

/**
 * Enhanced Graph Test Page
 * Demonstrates the improved graph visualizer with animations
 */
const EnhancedGraphTest = () => {
  // Detect dark mode
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const htmlHasDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(prefersDark || htmlHasDark)
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      setIsDarkMode(e.matches || document.documentElement.classList.contains('dark'))
    }
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])
  
  // Sample graph data
  const [nodes, setNodes] = useState([
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
    { id: 'E', label: 'E' },
  ])

  const [edges, setEdges] = useState([
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'E', weight: 2 },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [step, setStep] = useState({
    description: 'Graph ready - Click Play to start BFS',
    current: null,
    visiting: null,
    frontier: [],
    doneNodes: [],
    visitedEdges: [],
  })

  // Generate algorithm steps using actual BFS algorithm
  const generateAlgorithmSteps = () => {
    if (nodes.length === 0) return []
    
    const graph = { nodes, edges }
    const generator = bfs(graph, nodes[0].id)
    const steps = []
    
    let result = generator.next()
    while (!result.done) {
      steps.push(result.value)
      result = generator.next()
    }
    
    return steps
  }

  const algorithmSteps = generateAlgorithmSteps()

  // Handle play
  const handlePlay = () => {
    setIsRunning(true)
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < algorithmSteps.length - 1) {
          setStep(algorithmSteps[prev + 1])
          return prev + 1
        } else {
          setIsRunning(false)
          clearInterval(interval)
          return prev
        }
      })
    }, 1500)
  }

  // Handle pause
  const handlePause = () => {
    setIsRunning(false)
  }

  // Handle reset
  const handleReset = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setStep({
      description: 'Graph ready - Click Play to start BFS',
      current: null,
      visiting: null,
      frontier: [],
      doneNodes: [],
      visitedEdges: [],
    })
  }

  // Handle step forward
  const handleStepForward = () => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setStep(algorithmSteps[currentStep + 1])
    }
  }

  // Handle step back
  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setStep(algorithmSteps[currentStep - 1])
    }
  }

  // Handle add node
  const handleAddNode = () => {
    const newNodeId = String.fromCharCode(65 + nodes.length) // Generate IDs like F, G, H...
    const newNode = { id: newNodeId, label: newNodeId }
    setNodes([...nodes, newNode])
  }

  // Handle delete node
  const handleDeleteNode = (nodeId) => {
    setNodes(nodes.filter(node => node.id !== nodeId))
    setEdges(edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId))
  }

  // Handle add edge
  const handleAddEdge = (fromNodeId, toNodeId) => {
    // Check if edge already exists
    const edgeExists = edges.some(e => e.from === fromNodeId && e.to === toNodeId)
    if (!edgeExists) {
      const newEdge = { from: fromNodeId, to: toNodeId, weight: 1 }
      setEdges([...edges, newEdge])
    }
  }

  // Reset algorithm when graph changes
  useEffect(() => {
    handleReset()
  }, [nodes, edges])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Graph Algorithm Visualizer</h1>
          <p className="text-gray-600 dark:text-gray-400">Watch Breadth-First Search (BFS) algorithm in action</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Visualizer - Takes 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
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
              onAddNode={handleAddNode}
              onDeleteNode={handleDeleteNode}
              onAddEdge={handleAddEdge}
              width={800}
              height={600}
              isDark={isDarkMode}
            />
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Algorithm Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Algorithm: BFS</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Time Complexity</p>
                  <p className="font-mono text-blue-600 dark:text-blue-400">O(V + E)</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Space Complexity</p>
                  <p className="font-mono text-purple-600 dark:text-purple-400">O(V)</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Current Step</p>
                  <p className="font-mono text-gray-900 dark:text-white">
                    {currentStep + 1} / {algorithmSteps.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Step Description</h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                {step.description || 'Ready to start'}
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nodes Visited:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{step.doneNodes?.length || 0}/{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Edges Traversed:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{step.visitedEdges?.length || 0}/{edges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Frontier Size:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{step.frontier?.length || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VisualizationControlPanel
            isRunning={isRunning}
            currentStep={currentStep}
            totalSteps={algorithmSteps.length}
            speed={1}
            algorithName="Breadth-First Search (BFS)"
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onStepBack={handleStepBack}
            onStepForward={handleStepForward}
            onSpeedChange={() => {}}
          />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About BFS</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How it works:</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>✓ Start from a source node</li>
                <li>✓ Explore all neighbors at current depth</li>
                <li>✓ Move to next depth level</li>
                <li>✓ Continue until all nodes visited</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Use cases:</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>✓ Shortest path in unweighted graphs</li>
                <li>✓ Connected components</li>
                <li>✓ Level-order traversal</li>
                <li>✓ Social network analysis</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EnhancedGraphTest

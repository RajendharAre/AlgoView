import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause, GitGraph, Plus, Minus, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Shuffle } from 'lucide-react'
import { graphGenerators, generateRandomGraph } from '../../utils/graphGenerators'

/**
 * Enhanced Graph Visualizer Component
 * Uses Canvas for better performance and reliability
 * Features: Interactive node management, smooth canvas navigation, responsive design
 */
const EnhancedGraphVisualizer = ({
  nodes = [],
  edges = [],
  step = {},
  isPlaying = false,
  onPlay = () => {},
  onPause = () => {},
  onReset = () => {},
  onAddNode = () => {},
  onDeleteNode = () => {},
  onNodeSelect = () => {},
  onAddEdge = () => {},
  onLoadGraph = () => {},
  algorithmName = null,
  width = 800,
  height = 600,
  isDark = false,
}) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  
  // State management
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [nodePositions, setNodePositions] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showNodeActions, setShowNodeActions] = useState(false)
  const [actionButtonPos, setActionButtonPos] = useState({ x: 0, y: 0 })
  const [isDrawingEdge, setIsDrawingEdge] = useState(false)
  const [edgeStartNode, setEdgeStartNode] = useState(null)
  const [edgeEndPos, setEdgeEndPos] = useState({ x: 0, y: 0 })
  const [isEdgeCreationMode, setIsEdgeCreationMode] = useState(false)
  const [selectedGraphType, setSelectedGraphType] = useState(0) // Index into graphGenerators
  const [showGraphMenu, setShowGraphMenu] = useState(false)
  
  // Responsive canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({ 
    width: width, 
    height: height 
  })
  
  // Detect dark mode from system or document
  const [darkMode, setDarkMode] = useState(isDark)
  
  // Animation ref for smooth panning
  const panningVelocity = useRef({ x: 0, y: 0 })
  const lastMousePos = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    // Check if dark mode is preferred
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const htmlHasDark = document.documentElement.classList.contains('dark')
    setDarkMode(isDark || prefersDark || htmlHasDark)
  }, [isDark])

  // Handle responsive canvas dimensions based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Check if we're in fullscreen mode
      const isFullscreen = document.fullscreenElement !== null || 
                          document.webkitFullscreenElement !== null ||
                          window.innerHeight > 800 // Rough check for larger displays
      
      // Use same size for both fullscreen and small screen: 350×180
      setCanvasDimensions({ width: 350, height: 180 })
    }

    handleResize() // Set initial dimensions
    window.addEventListener('resize', handleResize)
    document.addEventListener('fullscreenchange', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('fullscreenchange', handleResize)
    }
  }, [])

  const COLORS = {
    light: {
      bg: '#ffffff',
      node: '#3b82f6',
      nodeBorder: '#1d4ed8',
      nodeText: '#ffffff',
      edge: '#e5e7eb',
      edgeHovered: '#9ca3af',
      current: '#f59e0b',
      visiting: '#8b5cf6',
      done: '#10b981',
      frontier: '#fbbf24',
      text: '#1f2937',
      selected: '#ff6b6b',
      selectedBorder: '#dc2626',
    },
    dark: {
      bg: '#1e293b',
      node: '#60a5fa',
      nodeBorder: '#2563eb',
      nodeText: '#ffffff',
      edge: '#475569',
      edgeHovered: '#64748b',
      current: '#fbbf24',
      visiting: '#a78bfa',
      done: '#34d399',
      frontier: '#fbbf24',
      text: '#f1f5f9',
      selected: '#ff6b6b',
      selectedBorder: '#dc2626',
    },
  }

  const colors = darkMode ? COLORS.dark : COLORS.light
  const NODE_RADIUS = 12 / zoom

  /**
   * Calculate if a point is near a node
   * Used for hover and click detection
   */
  const getNodeAtPosition = useCallback((canvasX, canvasY) => {
    for (let node of nodes) {
      const pos = nodePositions[node.id]
      if (!pos) continue

      // Transform canvas coordinates to graph coordinates
      const graphX = (canvasX - pan.x) / zoom
      const graphY = (canvasY - pan.y) / zoom

      const distance = Math.sqrt((graphX - pos.x) ** 2 + (graphY - pos.y) ** 2)
      if (distance <= NODE_RADIUS + 5) {
        return node.id
      }
    }
    return null
  }, [nodes, nodePositions, pan, zoom])

  /**
   * Generate a new random graph of the selected type
   */
  const handleGenerateNewGraph = useCallback(() => {
    const generator = graphGenerators[selectedGraphType]
    if (!generator || !onLoadGraph) return
    
    const newGraph = generator.generator()
    onLoadGraph(newGraph)
    setShowGraphMenu(false)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [selectedGraphType, onLoadGraph])

  /**
   * Generate a completely random graph (any type, any node count)
   */
  const handleRandomize = useCallback(() => {
    const newGraph = generateRandomGraph()
    onLoadGraph(newGraph)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [onLoadGraph])

  // Initialize node positions with circular layout
  useEffect(() => {
    if (nodes.length === 0) {
      setNodePositions({})
      return
    }

    const positions = {}
    const centerX = canvasDimensions.width / 2
    const centerY = canvasDimensions.height / 2
    const radius = Math.min(canvasDimensions.width, canvasDimensions.height) / 4

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    setNodePositions(positions)
  }, [nodes, canvasDimensions])

  /**
   * Enhanced Canvas Rendering with Node Highlighting
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Enable high DPI rendering for crisp edges
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasDimensions.width * dpr
    canvas.height = canvasDimensions.height * dpr
    ctx.scale(dpr, dpr)

    // Enable anti-aliasing for smooth lines
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Clear canvas with clean background (no grid)
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height)

    // Save context state for transformations
    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    // Draw edges first (so they appear behind nodes)
    edges.forEach((edge) => {
      const fromPos = nodePositions[edge.from]
      const toPos = nodePositions[edge.to]

      if (fromPos && toPos) {
        // Determine edge color based on state
        let edgeColor = colors.edge
        let edgeWidth = 2 / zoom

        if (step.visitedEdges?.some((e) => e.from === edge.from && e.to === edge.to)) {
          edgeColor = '#3b82f6'
          edgeWidth = 3 / zoom
        }

        // Enable sharp line rendering
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = edgeColor
        ctx.lineWidth = Math.max(edgeWidth, 0.5) // Ensure minimum line width
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)
        ctx.stroke()

        // Draw directional arrow
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x)
        const arrowSize = 10 / zoom
        ctx.fillStyle = edgeColor
        ctx.beginPath()
        ctx.moveTo(toPos.x, toPos.y)
        ctx.lineTo(toPos.x - arrowSize * Math.cos(angle - Math.PI / 6), toPos.y - arrowSize * Math.sin(angle - Math.PI / 6))
        ctx.lineTo(toPos.x - arrowSize * Math.cos(angle + Math.PI / 6), toPos.y - arrowSize * Math.sin(angle + Math.PI / 6))
        ctx.closePath()
        ctx.fill()

        // Draw edge weight if present and algorithm is Dijkstra
        if (edge.weight !== undefined && algorithmName === 'Dijkstra') {
          const midX = (fromPos.x + toPos.x) / 2
          const midY = (fromPos.y + toPos.y) / 2
          ctx.fillStyle = colors.text
          ctx.font = `bold ${12 / zoom}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor = colors.bg
          ctx.shadowBlur = 3
          ctx.fillText(edge.weight, midX, midY - 10 / zoom)
          ctx.shadowBlur = 0
        }
      }
    })

    // Draw nodes with enhanced styling
    nodes.forEach((node) => {
      const pos = nodePositions[node.id]
      if (!pos) return

      // Determine node appearance based on algorithm state
      let nodeColor = colors.node
      let borderColor = colors.nodeBorder
      let borderWidth = 3 / zoom

      // Algorithm state colors (highest priority)
      if (step.current === node.id) {
        nodeColor = colors.current
        borderColor = '#b45309'
        borderWidth = 4 / zoom
      } else if (step.visiting === node.id) {
        nodeColor = colors.visiting
        borderColor = '#6d28d9'
        borderWidth = 4 / zoom
      } else if (step.doneNodes?.includes(node.id)) {
        nodeColor = colors.done
        borderColor = '#047857'
      } else if (step.frontier?.includes(node.id)) {
        nodeColor = colors.frontier
        borderColor = '#f59e0b'
      }

      // Selection highlight (overrides algorithm state for visual clarity)
      if (selectedNode === node.id) {
        nodeColor = colors.selected
        borderColor = colors.selectedBorder
        borderWidth = 5 / zoom
      }

      // Draw glow effect for selected nodes
      if (selectedNode === node.id || hoveredNode === node.id) {
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)'
        ctx.lineWidth = 10 / zoom
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, NODE_RADIUS + 3 / zoom, 0, 2 * Math.PI)
        ctx.stroke()
      }

      // Draw node circle with sharp edges
      ctx.fillStyle = nodeColor
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, NODE_RADIUS, 0, 2 * Math.PI)
      ctx.fill()

      // Draw node border with sharp edges
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      // Draw node label with better rendering
      ctx.fillStyle = colors.nodeText
      ctx.font = `bold ${14 / zoom}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label || node.id, pos.x, pos.y)
    })

    // Draw edge being created (temporary edge while dragging)
    if (isDrawingEdge && edgeStartNode && edgeEndPos) {
      const startPos = nodePositions[edgeStartNode]
      if (startPos) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
        ctx.lineWidth = 2 / zoom
        ctx.setLineDash([5 / zoom, 5 / zoom])
        ctx.beginPath()
        ctx.moveTo(startPos.x, startPos.y)
        // Convert screen coords to graph coords for the end position
        const graphEndX = (edgeEndPos.x - pan.x) / zoom
        const graphEndY = (edgeEndPos.y - pan.y) / zoom
        ctx.lineTo(graphEndX, graphEndY)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    ctx.restore()
  }, [nodes, edges, nodePositions, step, zoom, pan, colors, isDark, canvasDimensions, selectedNode, hoveredNode, isDrawingEdge, edgeStartNode, edgeEndPos])

  /**
   * Handle canvas mouse move for hover detection
   */
  const handleCanvasMouseMove = useCallback((e) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    // Update edge drawing
    if (isDrawingEdge) {
      setEdgeEndPos({ x: canvasX, y: canvasY })
      return
    }

    // Update panning
    if (isDragging) {
      const deltaX = canvasX - dragStart.x
      const deltaY = canvasY - dragStart.y
      
      setPan((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))
      
      setDragStart({ x: canvasX, y: canvasY })
      return
    }

    // Update hover state
    const nodeId = getNodeAtPosition(canvasX, canvasY)
    setHoveredNode(nodeId)
    
    // Update cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = nodeId ? 'pointer' : 'grab'
    }

    lastMousePos.current = { x: canvasX, y: canvasY }
  }, [isDragging, dragStart, getNodeAtPosition])

  /**
   * Handle canvas mouse down
   */
  const handleCanvasMouseDown = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    const nodeId = getNodeAtPosition(canvasX, canvasY)

    if (nodeId && e.shiftKey) {
      // Shift+click on node - start drawing edge
      setIsDrawingEdge(true)
      setEdgeStartNode(nodeId)
      setEdgeEndPos({ x: canvasX, y: canvasY })
    } else if (nodeId) {
      // Node clicked - select it
      setSelectedNode(nodeId)
      onNodeSelect?.(nodeId)
      setShowNodeActions(true)
      setActionButtonPos({ x: canvasX, y: canvasY })
    } else {
      // Empty space clicked - start panning
      setIsDragging(true)
      setDragStart({ x: canvasX, y: canvasY })
      setSelectedNode(null)
      setShowNodeActions(false)
    }
  }, [getNodeAtPosition, onNodeSelect])

  /**
   * Handle canvas mouse up
   */
  const handleCanvasMouseUp = useCallback((e) => {
    if (isDrawingEdge && edgeStartNode) {
      // Complete edge drawing
      const rect = canvasRef.current.getBoundingClientRect()
      const canvasX = e.clientX - rect.left
      const canvasY = e.clientY - rect.top
      
      const endNodeId = getNodeAtPosition(canvasX, canvasY)
      
      if (endNodeId && endNodeId !== edgeStartNode) {
        // Valid edge - add it
        onAddEdge?.(edgeStartNode, endNodeId)
      }
      
      // Clear edge drawing state
      setIsDrawingEdge(false)
      setEdgeStartNode(null)
      setEdgeEndPos({ x: 0, y: 0 })
    } else {
      setIsDragging(false)
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grab'
      }
    }
  }, [isDrawingEdge, edgeStartNode, getNodeAtPosition, onAddEdge])

  /**
   * Handle canvas mouse leave
   */
  const handleCanvasMouseLeave = () => {
    setHoveredNode(null)
    setIsDragging(false)
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab'
    }
  }

  // Handle zoom
  const handleZoom = useCallback((direction) => {
    setZoom((prev) => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2
      return Math.max(0.5, Math.min(3, newZoom))
    })
  }, [])

  // Handle reset view
  const handleResetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedNode(null)
    setShowNodeActions(false)
    onReset?.()
  }, [onReset])

  // Handle canvas wheel for zoom
  const handleWheel = useCallback((e) => {
    // Note: preventDefault removed - browser handles passive event listeners
    // and wheel events are passive by default in modern browsers
    if (canvasRef.current && canvasRef.current.contains(e.target)) {
      handleZoom(e.deltaY > 0 ? 'out' : 'in')
    }
  }, [handleZoom])

  /**
   * Keyboard Navigation for Canvas Panning
   * Arrow keys for smooth movement
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      const panStep = 20
      
      // Only prevent default for keys we handle
      const keysToHandle = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Escape']
      if (!keysToHandle.includes(e.key)) return
      
      const keyActions = {
        'ArrowUp': () => setPan((prev) => ({ ...prev, y: prev.y + panStep })),
        'ArrowDown': () => setPan((prev) => ({ ...prev, y: prev.y - panStep })),
        'ArrowLeft': () => setPan((prev) => ({ ...prev, x: prev.x + panStep })),
        'ArrowRight': () => setPan((prev) => ({ ...prev, x: prev.x - panStep })),
        'Delete': () => selectedNode && onDeleteNode?.(selectedNode),
        'Escape': () => {
          setSelectedNode(null)
          setShowNodeActions(false)
          setIsDrawingEdge(false)
          setEdgeStartNode(null)
          setIsEdgeCreationMode(false)
        },
      }

      if (keyActions[e.key]) {
        e.preventDefault()
        keyActions[e.key]()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, onDeleteNode])

  /**
   * Handle smooth canvas panning
   */
  const handleSmoothPan = useCallback((direction) => {
    const panAmount = 30
    const panMap = {
      'up': { x: 0, y: panAmount },
      'down': { x: 0, y: -panAmount },
      'left': { x: panAmount, y: 0 },
      'right': { x: -panAmount, y: 0 },
    }

    setPan((prev) => ({
      x: prev.x + (panMap[direction]?.x || 0),
      y: prev.y + (panMap[direction]?.y || 0),
    }))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <GitGraph className="text-blue-600 dark:text-blue-400" size={24} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Graph Visualization</h3>
        </div>
        {step.description && <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>}
      </div>

      {/* Canvas Container with All Controls Inside */}
      <div className="flex-1 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 overflow-hidden relative mb-4">
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          onWheel={handleWheel}
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseLeave}
          className="w-full h-full"
          style={{ display: 'block', cursor: 'grab' }}
        />

        {/* Control Panel - Bottom Right Corner Inside Canvas */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 pointer-events-auto">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-r border-white/20 pr-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleZoom('out')}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-all"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </motion.button>
            <span className="text-xs font-medium text-white min-w-8 text-center">{Math.round(zoom * 100)}%</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleZoom('in')}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-all"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </motion.button>
          </div>

          {/* Play/Pause & Reset */}
          <div className="flex items-center gap-1 border-r border-white/20 pr-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={isPlaying ? onPause : onPlay}
              className={`p-1.5 rounded transition-all ${
                isPlaying
                  ? 'bg-blue-500/80 hover:bg-blue-600'
                  : 'bg-white/10 hover:bg-white/20'
              } text-white`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetView}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-all"
              title="Reset view"
            >
              <RotateCcw size={16} />
            </motion.button>
          </div>

          {/* Panning Controls */}
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSmoothPan('up')}
              className="p-1 bg-white/10 hover:bg-white/20 rounded text-white transition-all"
              title="Pan up"
            >
              <ArrowUp size={14} />
            </motion.button>
            <div className="flex gap-0.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSmoothPan('left')}
                className="p-1 bg-white/10 hover:bg-white/20 rounded text-white transition-all"
                title="Pan left"
              >
                <ArrowLeft size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSmoothPan('down')}
                className="p-1 bg-white/10 hover:bg-white/20 rounded text-white transition-all"
                title="Pan down"
              >
                <ArrowDown size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSmoothPan('right')}
                className="p-1 bg-white/10 hover:bg-white/20 rounded text-white transition-all"
                title="Pan right"
              >
                <ArrowRight size={14} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Node Action Buttons - INSIDE CANVAS */}
        <AnimatePresence>
          {selectedNode && actionButtonPos && (
            <>
              {/* Add Node / Start Edge Button */}
              {onAddNode && (
                <motion.button
                  key="add-btn"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  onClick={() => {
                    if (isEdgeCreationMode && edgeStartNode && selectedNode && edgeStartNode !== selectedNode) {
                      // Complete edge creation
                      onAddEdge?.(edgeStartNode, selectedNode)
                      setIsEdgeCreationMode(false)
                      setEdgeStartNode(null)
                      setSelectedNode(null)
                      setShowNodeActions(false)
                    } else if (selectedNode && !isEdgeCreationMode) {
                      // Start edge creation mode
                      setIsEdgeCreationMode(true)
                      setEdgeStartNode(selectedNode)
                    } else {
                      // Add new node (if not in edge mode)
                      onAddNode()
                      setShowNodeActions(false)
                    }
                  }}
                  className={`absolute p-2 text-white rounded-full shadow-lg transition-all pointer-events-auto ${
                    isEdgeCreationMode
                      ? 'bg-blue-500 hover:bg-blue-600 animate-pulse'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  style={{
                    left: `${(actionButtonPos.x / canvasDimensions.width) * 100}%`,
                    top: `${(actionButtonPos.y / canvasDimensions.height) * 100}%`,
                    transform: 'translate(calc(-50% + 30px), -50%)',
                  }}
                  title={isEdgeCreationMode ? 'Click target node to create edge' : 'Add new node or click to create edge'}
                >
                  <Plus size={16} />
                </motion.button>
              )}

              {/* Delete Node Button */}
              {onDeleteNode && (
                <motion.button
                  key="delete-btn"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  onClick={() => {
                    onDeleteNode(selectedNode)
                    setSelectedNode(null)
                    setShowNodeActions(false)
                  }}
                  className="absolute p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all pointer-events-auto"
                  style={{
                    left: `${(actionButtonPos.x / canvasDimensions.width) * 100}%`,
                    top: `${(actionButtonPos.y / canvasDimensions.height) * 100}%`,
                    transform: 'translate(calc(-50% - 30px), -50%)',
                  }}
                  title="Delete selected node"
                >
                  <Minus size={16} />
                </motion.button>
              )}

              {/* Panning Hint */}
              <motion.div
                key="pan-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-16 left-3 text-xs bg-black/70 text-white px-2 py-1 rounded pointer-events-none"
              >
                <div className="flex items-center gap-1">
                  <Move size={12} />
                  <span>Drag to pan | Arrow keys to move</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Keyboard Controls Info - Top Left */}
        {!selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="absolute top-3 left-3 text-xs bg-black/50 text-white px-2 py-1 rounded pointer-events-none"
          >
            <div>Click node • Scroll zoom • Delete key remove • Esc clear</div>
          </motion.div>
        )}
      </div>

      {/* Graph Generator Controls */}
      <div className="mt-3 px-2 flex flex-wrap gap-2 items-center">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGraphMenu(!showGraphMenu)}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg flex items-center gap-2 transition-all shadow-lg"
            title="Select graph type"
          >
            <GitGraph size={14} />
            {graphGenerators[selectedGraphType]?.name}
          </motion.button>

          {/* Graph Type Dropdown */}
          <AnimatePresence>
            {showGraphMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-48"
              >
                {graphGenerators.map((gen, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedGraphType(idx)
                      handleGenerateNewGraph()
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex flex-col ${
                      idx !== graphGenerators.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                    } ${selectedGraphType === idx ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{gen.name}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{gen.description}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Randomize Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRandomize}
          className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg flex items-center gap-2 transition-all shadow-lg"
          title="Generate completely random graph"
        >
          <Shuffle size={14} />
          Randomize
        </motion.button>
      </div>

      {/* Legend - Compact Version */}
      <div className="mt-2 grid grid-cols-5 gap-2 text-xs px-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.node }} />
          <span className="text-gray-700 dark:text-gray-300">Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.current }} />
          <span className="text-gray-700 dark:text-gray-300">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.visiting }} />
          <span className="text-gray-700 dark:text-gray-300">Visiting</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.frontier }} />
          <span className="text-gray-700 dark:text-gray-300">Frontier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.done }} />
          <span className="text-gray-700 dark:text-gray-300">Done</span>
        </div>
      </div>

      {/* Traversal Path Display */}
      {step.visitedPath && step.visitedPath.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-2 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg"
        >
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Traversal Path:</div>
          <div className="text-sm font-mono text-blue-700 dark:text-blue-300">
            {step.visitedPath.join(' → ')}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EnhancedGraphVisualizer

import React, { useCallback } from 'react'
import { COLORS } from '../utils/primUtils'

/**
 * Prim Canvas Component
 * Renders the graph visualization with nodes and edges for Prim's algorithm
 */
const PrimCanvas = React.forwardRef(({
  nodes,
  edges,
  visited,
  mstEdges,
  activeNode,
  costs,
  startNodeId,
  linkSource,
  isRunning,
  onCanvasClick,
  onNodeClick
}, ref) => {
  const renderEdgeStyle = useCallback((edge) => {
    // Check if edge is in MST (compare both directions)
    const isMst = mstEdges.some(
      mstEdge =>
        (mstEdge.u === edge.u && mstEdge.v === edge.v) ||
        (mstEdge.u === edge.v && mstEdge.v === edge.u)
    )
    
    const isCandidate =
      (visited.has(edge.u) && !visited.has(edge.v) && costs[edge.v] === edge.weight) ||
      (visited.has(edge.v) && !visited.has(edge.u) && costs[edge.u] === edge.weight)

    let stroke = COLORS.alabasterGrey
    let width = '2'
    let dash = '0'

    if (isMst) {
      stroke = COLORS.carbonBlack
      width = '4'
      dash = '0'
    } else if (isCandidate) {
      stroke = COLORS.slateGrey
      width = '3'
      dash = '5,5'
    }

    return { stroke, width, dash }
  }, [visited, mstEdges, costs])

  return (
    <svg
      ref={ref}
      className="w-full h-full cursor-crosshair"
      onClick={onCanvasClick}
      style={{ background: 'linear-gradient(to bottom right, #f1f3f5, #e9ecf0)' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#6c757d" />
        </marker>
      </defs>
      {/* Render All Edges */}
      {edges.map((edge, i) => {
        const u = nodes.find(n => n.id === edge.u)
        const v = nodes.find(n => n.id === edge.v)
        if (!u || !v) return null

        const { stroke, width, dash } = renderEdgeStyle(edge)

        return (
          <g key={i}>
            <line
              x1={u.x}
              y1={u.y}
              x2={v.x}
              y2={v.y}
              stroke={stroke}
              strokeWidth={width}
              strokeDasharray={dash}
              className="transition-all duration-300"
            />
            <circle
              cx={(u.x + v.x) / 2}
              cy={(u.y + v.y) / 2}
              r="10"
              fill="white"
              stroke={stroke}
              strokeWidth="1"
            />
            <text
              x={(u.x + v.x) / 2}
              y={(u.y + v.y) / 2}
              textAnchor="middle"
              dy=".3em"
              fontSize="9"
              fontWeight="bold"
              fill={stroke}
            >
              {edge.weight}
            </text>
          </g>
        )
      })}

      {/* Render Nodes */}
      {nodes.map((node) => {
        const inMst = visited.has(node.id)
        const isActive = activeNode === node.id
        const isStart = startNodeId === node.id
        const isSelected = linkSource === node.id
        const hasDiscovery =
          costs[node.id] !== undefined &&
          costs[node.id] !== Infinity &&
          !inMst

        let fill = 'white'
        let stroke = COLORS.alabasterGrey
        let textColor = COLORS.carbonBlack
        let scale = '1'

        if (isActive) {
          fill = COLORS.carbonBlack
          stroke = COLORS.carbonBlack
          textColor = 'white'
          scale = '1.3'
        } else if (inMst) {
          fill = COLORS.slateGrey
          stroke = COLORS.slateGrey
          textColor = 'white'
        } else if (hasDiscovery) {
          fill = COLORS.platinum
          stroke = COLORS.slateGrey
        }

        if (isStart) stroke = COLORS.carbonBlack
        if (isSelected) stroke = COLORS.ironGrey

        return (
          <g
            key={node.id}
            onClick={(e) => onNodeClick(e, node)}
            className="cursor-pointer transition-all duration-300"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${node.x}px ${node.y}px`
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="22"
              fill={fill}
              stroke={stroke}
              strokeWidth={isStart || inMst || isActive ? '3' : '2'}
              className="shadow-md"
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
                y={node.y - 32}
                textAnchor="middle"
                fontSize="7"
                fontWeight="black"
                fill={COLORS.carbonBlack}
              >
                START
              </text>
            )}
            {hasDiscovery && !isActive && (
              <text
                x={node.x}
                y={node.y + 32}
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill={COLORS.slateGrey}
              >
                COST: {costs[node.id]}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
})

PrimCanvas.displayName = 'PrimCanvas'

export default PrimCanvas

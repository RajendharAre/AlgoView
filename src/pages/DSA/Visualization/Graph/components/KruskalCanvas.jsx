import React, { useCallback } from 'react'
import { COLORS } from '../utils/kruskalUtils'

/**
 * Kruskal Canvas Component
 * Renders the graph visualization with nodes and edges
 */
const KruskalCanvas = React.forwardRef(({
  nodes,
  edges,
  sortedEdges,
  currentEdgeIdx,
  mstEdges,
  rejectedEdges,
  linkSource,
  isRunning,
  onCanvasClick,
  onNodeClick
}, ref) => {
  const renderEdgeStroke = useCallback((edgeIndex) => {
    const isCurrent = currentEdgeIdx === edgeIndex
    const inMst = mstEdges.includes(edgeIndex)
    const isRejected = rejectedEdges.includes(edgeIndex)

    let stroke = COLORS.alabasterGrey
    let width = "2"
    let dash = "4,4"

    if (inMst) {
      stroke = COLORS.carbonBlack
      width = "4"
      dash = "0"
    } else if (isRejected) {
      stroke = COLORS.ironGrey
      width = "1"
      dash = "2,2"
    } else if (isCurrent) {
      stroke = COLORS.slateGrey
      width = "4"
      dash = "0"
    }

    return { stroke, width, dash }
  }, [currentEdgeIdx, mstEdges, rejectedEdges])

  return (
    <svg 
      ref={ref}
      className="w-full h-full cursor-crosshair" 
      onClick={onCanvasClick}
    >
      {/* Render All Edges First */}
      {edges.map((edge, i) => {
        const u = nodes.find(n => n.id === edge.u)
        const v = nodes.find(n => n.id === edge.v)
        if (!u || !v) return null

        const sortedIdx = sortedEdges.findIndex(
          se => (se.u === edge.u && se.v === edge.v) || (se.u === edge.v && se.v === edge.u)
        )
        const { stroke, width, dash } = renderEdgeStroke(sortedIdx !== -1 ? sortedIdx : i)

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
        const isSelected = linkSource === node.id
        const isActive = 
          sortedEdges[currentEdgeIdx]?.u === node.id ||
          sortedEdges[currentEdgeIdx]?.v === node.id

        let fill = 'white'
        let stroke = COLORS.alabasterGrey
        let textColor = COLORS.carbonBlack
        let scale = '1'

        if (isActive) {
          fill = COLORS.carbonBlack
          stroke = COLORS.carbonBlack
          textColor = 'white'
          scale = '1.2'
        }
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
              strokeWidth={isSelected || isActive ? "3" : "2"}
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
          </g>
        )
      })}
    </svg>
  )
})

KruskalCanvas.displayName = 'KruskalCanvas'

export default KruskalCanvas

import React from 'react'
import { COLORS } from '../utils/kosarajuUtils'

/**
 * Kosaraju Canvas Component
 * Renders directed graph visualization with SCC detection
 */
const KosarajuCanvas = React.forwardRef(({
  nodes,
  edges,
  visited,
  activeNode,
  isTransposed,
  sccGroups,
  currentScc,
  linkSource,
  onCanvasClick,
  onNodeClick
}, ref) => {
  return (
    <svg
      ref={ref}
      className="w-full h-full cursor-crosshair"
      onClick={onCanvasClick}
      style={{ background: 'linear-gradient(to bottom right, #f1f3f5, #e9ecf0)' }}
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="28"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.slateGrey} />
        </marker>
        <marker
          id="arrow-active"
          viewBox="0 0 10 10"
          refX="28"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.carbonBlack} />
        </marker>
      </defs>

      {/* Render Edges (with Transpose Animation) */}
      {edges.map((edge, i) => {
        const u = nodes.find(n => n.id === edge.u)
        const v = nodes.find(n => n.id === edge.v)
        if (!u || !v) return null

        const sourceX = isTransposed ? v.x : u.x
        const sourceY = isTransposed ? v.y : u.y
        const targetX = isTransposed ? u.x : v.x
        const targetY = isTransposed ? u.y : v.y

        return (
          <line
            key={i}
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
            stroke={COLORS.alabasterGrey}
            strokeWidth="2"
            markerEnd="url(#arrow)"
            className="transition-all duration-700 ease-in-out"
          />
        )
      })}

      {/* Render Nodes */}
      {nodes.map((node) => {
        const isVisited = visited.has(node.id)
        const isActive = activeNode === node.id
        const isSelected = linkSource === node.id
        const inCurrentScc = currentScc.includes(node.id)
        const sccIndex = sccGroups.findIndex(g => g.includes(node.id))

        let fill = 'white'
        let stroke = COLORS.alabasterGrey
        let textColor = COLORS.carbonBlack
        let scale = '1'

        if (isActive || inCurrentScc) {
          fill = COLORS.carbonBlack
          stroke = COLORS.carbonBlack
          textColor = 'white'
          scale = '1.3'
        } else if (sccIndex !== -1) {
          fill = COLORS.slateGrey
          stroke = COLORS.carbonBlack
          textColor = 'white'
        } else if (isVisited) {
          fill = COLORS.platinum
          stroke = COLORS.slateGrey
        }

        if (isSelected) stroke = COLORS.ironGrey

        return (
          <g
            key={node.id}
            onClick={(e) => onNodeClick(e, node)}
            className="cursor-pointer transition-all duration-300"
            style={{ transform: `scale(${scale})`, transformOrigin: `${node.x}px ${node.y}px` }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="22"
              fill={fill}
              stroke={stroke}
              strokeWidth={isActive || inCurrentScc || sccIndex !== -1 ? '3' : '2'}
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

KosarajuCanvas.displayName = 'KosarajuCanvas'

export default KosarajuCanvas

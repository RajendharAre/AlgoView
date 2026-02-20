import React, { useCallback } from 'react'
import { COLORS } from '../utils/topSortUtils'

/**
 * TopSort Canvas Component
 * Renders the directed graph visualization for topological sort algorithm
 */
const TopSortCanvas = React.forwardRef(({
  nodes,
  edges,
  visited,
  queue,
  activeNode,
  inDegrees,
  activeEdges,
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

      {/* Render Edges */}
      {edges.map((edge, i) => {
        const u = nodes.find(n => n.id === edge.u)
        const v = nodes.find(n => n.id === edge.v)
        if (!u || !v) return null

        const isActive = activeEdges.includes(i)
        const isRemoved = visited.has(edge.u)

        return (
          <line
            key={i}
            x1={u.x}
            y1={u.y}
            x2={v.x}
            y2={v.y}
            stroke={isActive ? COLORS.carbonBlack : COLORS.alabasterGrey}
            strokeWidth={isActive ? '4' : '2'}
            strokeDasharray={isRemoved && !isActive ? '4,4' : '0'}
            opacity={isRemoved && !isActive ? 0.3 : 1}
            markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
            className="transition-all duration-300"
          />
        )
      })}

      {/* Render Nodes */}
      {nodes.map((node) => {
        const isVisited = visited.has(node.id)
        const inQueue = queue.includes(node.id)
        const isActive = activeNode === node.id
        const isSelected = linkSource === node.id
        const deg = inDegrees[node.id] ?? edges.filter(e => e.v === node.id).length

        let fill = 'white'
        let stroke = COLORS.alabasterGrey
        let textColor = COLORS.carbonBlack
        let scale = '1'

        if (isActive) {
          fill = COLORS.carbonBlack
          stroke = COLORS.carbonBlack
          textColor = 'white'
          scale = '1.25'
        } else if (isVisited) {
          fill = COLORS.slateGrey
          stroke = COLORS.slateGrey
          textColor = 'white'
        } else if (inQueue) {
          fill = COLORS.platinum
          stroke = COLORS.slateGrey
        }

        if (isSelected) stroke = COLORS.ironGrey

        return (
          <g
            key={node.id}
            onClick={(e) => onNodeClick(e, node)}
            className={`cursor-pointer transition-all duration-300 ${isVisited ? 'opacity-40' : ''}`}
            style={{ transform: `scale(${scale})`, transformOrigin: `${node.x}px ${node.y}px` }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="22"
              fill={fill}
              stroke={stroke}
              strokeWidth={isActive || isSelected ? '3' : '2'}
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

            {/* In-Degree Badge */}
            <g transform={`translate(${node.x + 18}, ${node.y - 18})`}>
              <circle r="8" fill={COLORS.carbonBlack} />
              <text
                textAnchor="middle"
                dy=".3em"
                fontSize="8"
                fontWeight="bold"
                fill="white"
              >
                {deg}
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
})

TopSortCanvas.displayName = 'TopSortCanvas'

export default TopSortCanvas

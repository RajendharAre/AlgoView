import React from 'react'
import { COLORS, NODE_PALETTE } from '../utils/graphColoringUtils'

/**
 * Graph Coloring Canvas
 * SVG-based visualization of the graph and coloring process
 */
const GraphColoringCanvas = ({
  svgRef,
  nodes,
  edges,
  nodeColors,
  activeNode,
  checkingNeighbors,
  linkSource,
  handleCanvasClick,
  handleNodeClick,
}) => {
  return (
    <svg ref={svgRef} className="w-full h-full cursor-crosshair" onClick={handleCanvasClick}>
      {/* Edges */}
      {edges.map((edge, i) => {
        const u = nodes.find(n => n.id === edge.u)
        const v = nodes.find(n => n.id === edge.v)
        if (!u || !v) return null

        const isActive =
          (activeNode === edge.u && checkingNeighbors.includes(edge.v)) ||
          (activeNode === edge.v && checkingNeighbors.includes(edge.u))

        return (
          <line
            key={i}
            x1={u.x}
            y1={u.y}
            x2={v.x}
            y2={v.y}
            stroke={isActive ? COLORS.carbonBlack : COLORS.alabasterGrey}
            strokeWidth={isActive ? '4' : '2'}
            className="transition-all duration-300"
          />
        )
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const isNeighbor = checkingNeighbors.includes(node.id)
        const isActive = activeNode === node.id
        const isSelected = linkSource === node.id
        const colorIdx = nodeColors[node.id]

        const paletteItem =
          colorIdx !== undefined ? NODE_PALETTE[colorIdx % NODE_PALETTE.length] : null

        let fill = paletteItem ? paletteItem.bg : 'white'
        let stroke = COLORS.alabasterGrey
        let textColor = paletteItem ? paletteItem.text : COLORS.carbonBlack
        let scale = '1'

        if (isActive) {
          stroke = COLORS.carbonBlack
          scale = '1.3'
        } else if (isNeighbor) {
          stroke = COLORS.carbonBlack
          scale = '1.15'
        }

        if (isSelected) stroke = COLORS.ironGrey

        return (
          <g
            key={node.id}
            onClick={e => handleNodeClick(e, node)}
            className="cursor-pointer transition-all duration-300"
            style={{ transform: `scale(${scale})`, transformOrigin: `${node.x}px ${node.y}px` }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="22"
              fill={fill}
              stroke={stroke}
              strokeWidth={isActive || isNeighbor || isSelected ? '3' : '2'}
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

            {isActive && (
              <text
                x={node.x}
                y={node.y - 32}
                textAnchor="middle"
                fontSize="8"
                fontWeight="black"
                fill={COLORS.carbonBlack}
              >
                ACTIVE
              </text>
            )}
            {isNeighbor && colorIdx !== undefined && (
              <text
                x={node.x}
                y={node.y + 32}
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill={COLORS.slateGrey}
              >
                RESERVED
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default GraphColoringCanvas

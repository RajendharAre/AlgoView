import React from 'react';
import { COLORS } from '../../../../../constants/visualizationConstants';

/**
 * Reusable SVG-based graph canvas for algorithm visualization
 * Supports node highlighting, edge highlighting, and interactive elements
 */
const GraphCanvas = ({ 
  nodes, 
  edges, 
  handleCanvasClick, 
  handleNodeClick, 
  svgRef,
  // Algorithm-specific props
  highlightNodes = {}, // { nodeId: { fill, stroke, scale, label } }
  highlightEdges = [], // array of edge indices to highlight
  showArrows = false,
  customNodeRenderer,
  customEdgeRenderer
}) => {
  return (
    <svg ref={svgRef} className="w-full h-full cursor-crosshair" onClick={handleCanvasClick}>
      {showArrows && (
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.slateGrey} />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.carbonBlack} />
          </marker>
        </defs>
      )}

      {/* Edges */}
      {edges.map((edge, idx) => {
        const u = nodes.find(n => n.id === edge.u);
        const v = nodes.find(n => n.id === edge.v);
        if (!u || !v) return null;

        const isHighlighted = highlightEdges.includes(idx);
        const strokeWidth = isHighlighted ? "4" : "2";
        const strokeColor = isHighlighted ? COLORS.carbonBlack : COLORS.alabasterGrey;
        const markerEnd = showArrows ? (isHighlighted ? "url(#arrow-active)" : "url(#arrow)") : undefined;

        if (customEdgeRenderer) {
          return customEdgeRenderer(edge, idx, u, v, isHighlighted);
        }

        return (
          <g key={idx}>
            <line 
              x1={u.x} y1={u.y} x2={v.x} y2={v.y} 
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              markerEnd={markerEnd}
            />
            <circle cx={(u.x + v.x) / 2} cy={(u.y + v.y) / 2} r="9" fill="white" stroke={strokeColor} strokeWidth="1" />
            <text x={(u.x + v.x) / 2} y={(u.y + v.y) / 2} textAnchor="middle" dy=".3em" fontSize="9" fontWeight="bold" fill={COLORS.gunmetal}>
              {edge.weight}
            </text>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const highlightConfig = highlightNodes[node.id] || {};
        const {
          fill = 'white',
          stroke = COLORS.alabasterGrey,
          textColor = COLORS.carbonBlack,
          scale = '1',
          label: customLabel,
          showLabel = true
        } = highlightConfig;

        const strokeWidth = Object.keys(highlightNodes).includes(node.id.toString()) ? "3" : "2";

        if (customNodeRenderer) {
          return customNodeRenderer(node, highlightConfig);
        }

        return (
          <g 
            key={node.id} 
            onClick={(e) => handleNodeClick(e, node)} 
            className="cursor-pointer transition-all duration-300" 
            style={{ transform: `scale(${scale})`, transformOrigin: `${node.x}px ${node.y}px` }}
          >
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth={strokeWidth} className="shadow-md" />
            <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fontSize="12" fontWeight="900" fill={textColor}>
              {node.label}
            </text>
            
            {customLabel && showLabel && (
              <text 
                x={node.x} 
                y={node.y + (customLabel.position === 'top' ? -32 : 32)} 
                textAnchor="middle" 
                fontSize="8" 
                fontWeight="bold" 
                fill={customLabel.color || COLORS.carbonBlack}
              >
                {customLabel.text}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default GraphCanvas;
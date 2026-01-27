import React from 'react';
import { COLORS } from '../../../../../constants/visualizationConstants';
import GraphNode from './GraphNode';

const DirectedGraphCanvas = ({ 
  nodes, 
  edges, 
  activeEdgeIdx, 
  finalPath, 
  distances, 
  startNodeId,
  handleCanvasClick, 
  handleNodeClick, 
  svgRef 
}) => {
  return (
    <svg ref={svgRef} className="w-full h-full cursor-crosshair">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.slateGrey} />
        </marker>
        <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.carbonBlack} />
        </marker>
      </defs>
      
      {/* Edges with arrows for directed graph */}
      {edges.map((edge, i) => {
        const u = nodes.find(n => n.id === edge.u); 
        const v = nodes.find(n => n.id === edge.v);
        if (!u || !v) return null;
        
        const isActive = activeEdgeIdx === i;
        const inPath = finalPath.some((id, idx) => {
          if (idx === 0) return false;
          const prevId = finalPath[idx-1];
          return (prevId === edge.u && id === edge.v);
        });

        return (
          <g key={i}>
            <line 
              x1={u.x} y1={u.y} x2={v.x} y2={v.y} 
              stroke={inPath || isActive ? COLORS.carbonBlack : COLORS.alabasterGrey} 
              strokeWidth={inPath || isActive ? "4" : "2"} 
              markerEnd={inPath || isActive ? "url(#arrow-active)" : "url(#arrow)"}
              className="transition-all duration-300"
            />
            <rect 
              x={(u.x + v.x) / 2 - 12} y={(u.y + v.y) / 2 - 10} 
              width="24" height="20" rx="4" fill="white" stroke={isActive ? COLORS.carbonBlack : COLORS.alabasterGrey} strokeWidth="1" 
            />
            <text 
              x={(u.x + v.x) / 2} y={(u.y + v.y) / 2} 
              textAnchor="middle" dy=".35em" fontSize="10" fontWeight="bold" 
              fill={isActive ? COLORS.carbonBlack : COLORS.ironGrey}
            >
              {edge.weight}
            </text>
          </g>
        );
      })}
      
      {/* Render nodes */}
      {nodes.map((node) => (
        <GraphNode
          key={node.id}
          node={node}
          visited={new Set()}
          frontier={[]}
          activeNode={activeEdgeIdx >= 0 && 
            (edges[activeEdgeIdx]?.u === node.id || edges[activeEdgeIdx]?.v === node.id) ? node.id : null}
          startNodeId={startNodeId}
          finalPath={finalPath}
          distances={distances}
          handleNodeClick={handleNodeClick}
        />
      ))}
    </svg>
  );
};

export default DirectedGraphCanvas;
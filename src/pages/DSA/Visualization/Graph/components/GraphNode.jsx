import React from 'react';
import { COLORS } from '../../../../../constants/visualizationConstants';

const GraphNode = ({ 
  node, 
  visited, 
  frontier, 
  activeNode, 
  startNodeId, 
  finalPath, 
  distances, 
  handleNodeClick 
}) => {
  const isVisited = visited.has(node.id);
  const inFrontier = frontier.includes(node.id);
  const isActive = activeNode === node.id;
  const isStart = startNodeId === node.id;
  const inPath = finalPath.includes(node.id);

  let fill = 'white', stroke = COLORS.alabasterGrey, textColor = COLORS.carbonBlack, scale = '1';
  
  if (isActive) { 
    fill = COLORS.carbonBlack; 
    stroke = COLORS.carbonBlack; 
    textColor = 'white'; 
    scale = '1.25'; 
  }
  else if (inPath) { 
    fill = COLORS.carbonBlack; 
    stroke = COLORS.carbonBlack; 
    textColor = 'white'; 
  }
  else if (isVisited) { 
    fill = COLORS.slateGrey; 
    stroke = COLORS.slateGrey; 
    textColor = 'white'; 
  }
  else if (inFrontier) { 
    fill = COLORS.platinum; 
    stroke = COLORS.slateGrey; 
  }

  if (isStart) stroke = COLORS.carbonBlack;

  return (
    <g 
      onClick={(e) => handleNodeClick(e, node)} 
      className="cursor-pointer transition-all duration-300" 
      style={{ transform: `scale(${scale})`, transformOrigin: `${node.x}px ${node.y}px` }}
    >
      <circle 
        cx={node.x} 
        cy={node.y} 
        r="24" 
        fill={fill} 
        stroke={stroke} 
        strokeWidth={isStart || inPath ? "4" : "2"} 
        className="shadow-md" 
      />
      <text 
        x={node.x} 
        y={node.y - 2} 
        textAnchor="middle" 
        dy=".3em" 
        fontSize="12" 
        fontWeight="900" 
        fill={textColor}
      >
        {node.label}
      </text>
      
      {/* Distance Label */}
      <text 
        x={node.x} 
        y={node.y + 12} 
        textAnchor="middle" 
        dy=".3em" 
        fontSize="8" 
        fontWeight="bold" 
        fill={isActive || inPath ? 'white' : COLORS.slateGrey}
      >
        {distances[node.id] === Infinity ? '∞' : (distances[node.id] ?? '')}
      </text>

      {isStart && (
        <text 
          x={node.x} 
          y={node.y - 36} 
          textAnchor="middle" 
          fontSize="7" 
          fontWeight="black" 
          fill={COLORS.carbonBlack}
        >
          SOURCE
        </text>
      )}
    </g>
  );
};

export default GraphNode;
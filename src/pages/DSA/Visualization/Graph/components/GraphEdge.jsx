import React from 'react';
import { COLORS } from '../../../../../constants/visualizationConstants';

const GraphEdge = ({ edge, nodes, finalPath }) => {
  const u = nodes.find(n => n.id === edge.u);
  const v = nodes.find(n => n.id === edge.v);
  
  if (!u || !v) return null;
  
  const inPath = finalPath.some((id, idx) => {
    if (idx === 0) return false;
    const prevId = finalPath[idx-1];
    return (prevId === edge.u && id === edge.v) || (prevId === edge.v && id === edge.u);
  });

  return (
    <g>
      <line 
        x1={u.x} y1={u.y} x2={v.x} y2={v.y} 
        stroke={inPath ? COLORS.carbonBlack : COLORS.alabasterGrey} 
        strokeWidth={inPath ? "4" : "2"} 
      />
      <circle cx={(u.x + v.x) / 2} cy={(u.y + v.y) / 2} r="10" fill="white" stroke={COLORS.alabasterGrey} strokeWidth="1" />
      <text x={(u.x + v.x) / 2} y={(u.y + v.y) / 2} textAnchor="middle" dy=".3em" fontSize="9" fontWeight="bold" fill={COLORS.gunmetal}>
        {edge.weight}
      </text>
    </g>
  );
};

export default GraphEdge;
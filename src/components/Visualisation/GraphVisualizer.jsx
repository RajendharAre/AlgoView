import React from 'react';
import { motion as Motion } from 'framer-motion';

// small subcomponents can be inline or separated
const Edge = ({ from, to, weight, className, isVisited = false }) => {
  // from/to are node objects with x,y
  const x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;
  return (
    <g className={className}>
      <line 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke={isVisited ? "#3b82f6" : "rgba(80,80,90,0.2)"} 
        strokeWidth={isVisited ? "4" : "3"}
        strokeDasharray={isVisited ? "0" : "5,5"}
      />
      {typeof weight !== 'undefined' && (
        <text 
          x={(x1+x2)/2} 
          y={(y1+y2)/2 - 6} 
          fontSize="12" 
          textAnchor="middle" 
          fill={isVisited ? "#1e40af" : "#333"}
          fontWeight="600"
        >
          {weight}
        </text>
      )}
    </g>
  );
};

const GraphVisualizer = ({ nodes = [], edges = [], step = {}, width = 700, height = 380 }) => {
  // step fields
  const current = step?.current;
  const visiting = step?.visiting;
  const frontier = step?.frontier || [];
  const done = step?.doneNodes || [];
  const distances = step?.distances || {};
  const description = step?.description || '';
  const visitedEdges = step?.visitedEdges || [];

  // helper
  const getNodeClass = (id) => {
    if (id === visiting) return 'visiting';
    if (id === current) return 'current';
    if (done.includes(id)) return 'done';
    if (frontier.includes(id)) return 'frontier';
    return 'neutral';
  };

  const isEdgeVisited = (fromId, toId) => {
    return visitedEdges.some(edge => 
      (edge.from === fromId && edge.to === toId) || 
      (edge.from === toId && edge.to === fromId)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-center mb-4">
        <div 
          className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200" 
          style={{ width, height }}
        >
          <svg width={width} height={height}>
            {/* edges behind */}
            {edges.map((e, idx) => {
              const from = nodes.find(n => n.id === e.from);
              const to = nodes.find(n => n.id === e.to);
              if (!from || !to) return null;
              
              const visited = isEdgeVisited(e.from, e.to);
              
              return (
                <Edge 
                  key={idx} 
                  from={from} 
                  to={to} 
                  weight={e.weight} 
                  className="graph-edge" 
                  isVisited={visited}
                />
              );
            })}
            {/* nodes on top */}
            {nodes.map((node) => {
              const nodeClass = getNodeClass(node.id);
              return (
                <Motion.g 
                  key={node.id} 
                  initial={{ scale: 0.9 }} 
                  animate={{ scale: node.id === visiting ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="24" 
                    className={`
                      transition-all duration-300
                      ${nodeClass === 'current' ? 'fill-blue-500 stroke-blue-600' : ''}
                      ${nodeClass === 'visiting' ? 'fill-purple-500 stroke-purple-600' : ''}
                      ${nodeClass === 'frontier' ? 'fill-yellow-400 stroke-yellow-500' : ''}
                      ${nodeClass === 'done' ? 'fill-green-500 stroke-green-600' : ''}
                      ${nodeClass === 'neutral' ? 'fill-white stroke-gray-300' : ''}
                    `}
                    strokeWidth="2"
                  />
                  <text 
                    x={node.x} 
                    y={node.y + 5} 
                    textAnchor="middle" 
                    fontSize="16" 
                    fontWeight="700"
                    fill={nodeClass === 'neutral' ? '#374151' : 'white'}
                  >
                    {node.label ?? node.id}
                  </text>
                  {/* optional distance label for Dijkstra */}
                  {typeof distances[node.id] !== 'undefined' && (
                    <text 
                      x={node.x} 
                      y={node.y + 38} 
                      textAnchor="middle" 
                      fontSize="12" 
                      fill="#374151"
                      fontWeight="600"
                    >
                      {distances[node.id] === Infinity ? '∞' : distances[node.id]}
                    </text>
                  )}
                </Motion.g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* description + legend */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-gray-700 font-medium">
            {description}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Visiting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-gray-600">Frontier</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
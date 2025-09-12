// src/components/Visualization/GraphVisualizer.jsx
import React from 'react';
import { motion as Motion } from 'framer-motion';
import '../../styles/visualizers.css'; // uses palette

// small subcomponents can be inline or separated
const Edge = ({ from, to, weight, className }) => {
  // from/to are node objects with x,y
  const x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;
  return (
    <g className={className}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(80,80,90,0.2)" strokeWidth="3" />
      {typeof weight !== 'undefined' && (
        <text x={(x1+x2)/2} y={(y1+y2)/2 - 6} fontSize="12" textAnchor="middle" fill="#333">{weight}</text>
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

  // helper
  const getNodeClass = (id) => {
    if (id === visiting) return 'graph-node-visiting';
    if (id === current) return 'graph-node-current';
    if (done.includes(id)) return 'graph-node-done';
    if (frontier.includes(id)) return 'graph-node-frontier';
    return 'graph-node-neutral';
  };

  return (
    <div className="graph-visualizer-root">
      <div className="graph-svg-wrap" style={{ width, height }}>
        <svg width={width} height={height}>
          {/* edges behind */}
          {edges.map((e, idx) => {
            const from = nodes.find(n => n.id === e.from);
            const to = nodes.find(n => n.id === e.to);
            if (!from || !to) return null;
            return <Edge key={idx} from={from} to={to} weight={e.weight} className="graph-edge" />;
          })}
          {/* nodes on top */}
          {nodes.map((node) => {
            const cls = getNodeClass(node.id);
            return (
              <Motion.g key={node.id} initial={{ scale: 0.9 }} animate={{ scale: node.id === visiting ? 1.08 : 1 }}>
                <circle cx={node.x} cy={node.y} r="22" className={`graph-node ${cls}`} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fill="#fff" fontWeight="700">
                  {node.label ?? node.id}
                </text>
                {/* optional distance label for Dijkstra */}
                {typeof distances[node.id] !== 'undefined' && (
                  <text x={node.x} y={node.y + 36} textAnchor="middle" fontSize="11" fill="#333">
                    {distances[node.id] === Infinity ? '∞' : distances[node.id]}
                  </text>
                )}
              </Motion.g>
            );
          })}
        </svg>
      </div>

      {/* description + legend */}
      <div className="graph-info-bar">
        <div className="graph-desc">{description}</div>

        <div className="graph-legend">
          <div className="legend-item"><span className="legend-swatch sw-graph-current" /> Current</div>
          <div className="legend-item"><span className="legend-swatch sw-graph-visiting" /> Visiting</div>
          <div className="legend-item"><span className="legend-swatch sw-graph-frontier" /> Frontier</div>
          <div className="legend-item"><span className="legend-swatch sw-graph-done" /> Done</div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;

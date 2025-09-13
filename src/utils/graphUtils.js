// src/utils/graphUtils.js
export function layoutNodesCircle(nodes, width=700, height=380, margin=60) {
  const centerX = width/2, centerY = height/2;
  const radius = Math.min(width, height)/2 - margin;
  const n = nodes.length;
  return nodes.map((node, i) => {
    const theta = (2 * Math.PI * i) / n;
    return {
      ...node,
      x: Math.round(centerX + radius * Math.cos(theta)),
      y: Math.round(centerY + radius * Math.sin(theta))
    };
  });
}

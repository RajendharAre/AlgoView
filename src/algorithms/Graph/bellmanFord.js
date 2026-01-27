/**
 * Bellman-Ford Algorithm Implementation
 * Finds shortest paths from source vertex to all other vertices
 * Can detect negative weight cycles
 */

export const bellmanFord = function*(graph, startNodeId) {
  const { nodes, edges } = graph;
  const distances = {};
  const previous = {};
  
  // Initialize distances
  nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
  });
  
  yield {
    distances: { ...distances },
    previous: { ...previous },
    iteration: 0,
    activeEdge: null,
    description: `Initializing distances. Setting distance to start node ${nodes.find(n => n.id === startNodeId)?.label} as 0.`
  };
  
  const V = nodes.length;
  
  // Relax edges V-1 times
  for (let i = 1; i < V; i++) {
    yield {
      distances: { ...distances },
      previous: { ...previous },
      iteration: i,
      activeEdge: null,
      description: `Pass ${i} of ${V-1}: Relaxing all edges...`
    };
    
    for (let j = 0; j < edges.length; j++) {
      const edge = edges[j];
      const u = edge.from || edge.u;
      const v = edge.to || edge.v;
      const weight = edge.weight;
      
      yield {
        distances: { ...distances },
        previous: { ...previous },
        iteration: i,
        activeEdge: { u, v, index: j },
        description: `Checking edge from ${nodes.find(n => n.id === u)?.label} to ${nodes.find(n => n.id === v)?.label} with weight ${weight}`
      };
      
      // Relax edge
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        previous[v] = u;
        
        yield {
          distances: { ...distances },
          previous: { ...previous },
          iteration: i,
          activeEdge: { u, v, index: j },
          description: `Relaxed edge: Updated distance to ${nodes.find(n => n.id === v)?.label} to ${distances[v]}`
        };
      }
    }
  }
  
  // Check for negative cycles (pass V)
  yield {
    distances: { ...distances },
    previous: { ...previous },
    iteration: V,
    activeEdge: null,
    description: "Checking for negative weight cycles..."
  };
  
  for (let j = 0; j < edges.length; j++) {
    const edge = edges[j];
    const u = edge.from || edge.u;
    const v = edge.to || edge.v;
    const weight = edge.weight;
    
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      yield {
        distances: { ...distances },
        previous: { ...previous },
        iteration: V,
        activeEdge: { u, v, index: j },
        description: "Negative cycle detected!",
        hasNegativeCycle: true
      };
      return; // Exit generator early
    }
  }
  
  yield {
    distances: { ...distances },
    previous: { ...previous },
    iteration: V,
    activeEdge: null,
    description: "Algorithm complete. No negative cycles found.",
    hasNegativeCycle: false
  };
};

export const bellmanFordInfo = {
  name: "Bellman-Ford Algorithm",
  description: "Finds shortest paths from a source vertex to all other vertices in a weighted graph, even with negative edge weights. Can detect negative cycles.",
  complexity: {
    time: {
      worst: "O(VE)",
      average: "O(VE)",
      best: "O(E)"
    },
    space: "O(V)"
  },
  applications: [
    "Network routing protocols",
    "Currency arbitrage detection",
    "Finding shortest paths in graphs with negative weights"
  ],
  advantages: [
    "Handles negative edge weights",
    "Can detect negative cycles",
    "Simple implementation"
  ],
  disadvantages: [
    "Slower than Dijkstra for graphs without negative weights",
    "Cannot handle negative cycles"
  ]
};
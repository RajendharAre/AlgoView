/**
 * Floyd-Warshall Algorithm Implementation
 * Finds shortest paths between all pairs of vertices in a weighted graph
 */

export function* floydWarshall(graph) {
  const { nodes, edges } = graph;
  const n = nodes.length;
  
  // Initialize distance matrix
  const dist = [];
  const next = [];
  
  for (let i = 0; i < n; i++) {
    dist[i] = [];
    next[i] = [];
    for (let j = 0; j < n; j++) {
      dist[i][j] = i === j ? 0 : Infinity;
      next[i][j] = null;
    }
  }
  
  // Fill direct edges
  for (const edge of edges) {
    const uIndex = nodes.findIndex(node => node.id === (edge.from || edge.u));
    const vIndex = nodes.findIndex(node => node.id === (edge.to || edge.v));
    
    if (uIndex !== -1 && vIndex !== -1) {
      dist[uIndex][vIndex] = edge.weight;
      next[uIndex][vIndex] = vIndex;
    }
  }
  
  yield {
    dist: JSON.parse(JSON.stringify(dist)),
    next: JSON.parse(JSON.stringify(next)),
    k: -1,
    i: -1,
    j: -1,
    description: `Initializing ${n}×${n} distance matrix. Setting diagonal to 0, others to ∞.`
  };
  
  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    yield {
      dist: JSON.parse(JSON.stringify(dist)),
      next: JSON.parse(JSON.stringify(next)),
      k,
      i: -1,
      j: -1,
      description: `Processing intermediate node ${nodes[k]?.label || 'Node'+k} (k=${k})`
    };
    
    for (let i = 0; i < n; i++) {
      yield {
        dist: JSON.parse(JSON.stringify(dist)),
        next: JSON.parse(JSON.stringify(next)),
        k,
        i,
        j: -1,
        description: `Processing source node ${nodes[i]?.label || 'Node'+i} (i=${i}) with intermediate ${nodes[k]?.label || 'Node'+k}`
      };
      
      for (let j = 0; j < n; j++) {
        const ik = dist[i][k];
        const kj = dist[k][j];
        const ij = dist[i][j];
        
        yield {
          dist: JSON.parse(JSON.stringify(dist)),
          next: JSON.parse(JSON.stringify(next)),
          k,
          i,
          j,
          description: `Checking if path ${nodes[i]?.label || 'Node'+i}→${nodes[k]?.label || 'Node'+k}→${nodes[j]?.label || 'Node'+j} is shorter than ${nodes[i]?.label || 'Node'+i}→${nodes[j]?.label || 'Node'+j}`
        };
        
        if (ik !== Infinity && kj !== Infinity && (ik + kj) < ij) {
          dist[i][j] = ik + kj;
          next[i][j] = next[i][k];
          
          yield {
            dist: JSON.parse(JSON.stringify(dist)),
            next: JSON.parse(JSON.stringify(next)),
            k,
            i,
            j,
            description: `Found shorter path! New distance from ${nodes[i]?.label || 'Node'+i} to ${nodes[j]?.label || 'Node'+j} is ${dist[i][j]}`
          };
        }
      }
    }
  }
  
  yield {
    dist: JSON.parse(JSON.stringify(dist)),
    next: JSON.parse(JSON.stringify(next)),
    k: -1,
    i: -1,
    j: -1,
    description: "Floyd-Warshall algorithm complete. All shortest paths computed."
  };
};

export const floydWarshallInfo = {
  name: "Floyd-Warshall Algorithm",
  description: "Computes shortest paths between all pairs of vertices in a weighted graph.",
  complexity: {
    time: {
      worst: "O(V³)",
      average: "O(V³)",
      best: "O(V³)"
    },
    space: "O(V²)"
  },
  timeComplexity: {
    best: 'O(V³)',
    average: 'O(V³)',
    worst: 'O(V³)',
    explanation: 'Three nested loops over V vertices for each intermediate vertex. Must check all paths: O(V³) regardless of input.'
  },
  spaceComplexity: {
    value: 'O(V²)',
    explanation: 'Stores distance matrix of size V×V containing shortest path distances between all pairs.'
  },
  applications: [
    "Finding shortest paths in dense graphs",
    "Detecting negative cycles",
    "Transitive closure computation"
  ],
  advantages: [
    "Finds all-pairs shortest paths",
    "Handles negative edge weights",
    "Simple implementation"
  ],
  disadvantages: [
    "Cubic time complexity",
    "Not suitable for sparse graphs"
  ]
};
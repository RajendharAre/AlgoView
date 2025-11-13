/**
 * Graph Generators - Create diverse graphs for visualization
 * Provides 5 different graph patterns with varying node counts
 */

/**
 * Generate a random tree-like graph
 * @param {number} nodeCount - Number of nodes (4-15)
 * @returns {object} { nodes: [], edges: [] }
 */
export const generateRandomTreeGraph = (nodeCount = 6) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `${i}`,
    label: `${i}`,
  }))

  const edges = []
  // Create tree structure: each node connects to 1-3 random nodes before it
  for (let i = 1; i < nodeCount; i++) {
    const parentCount = Math.floor(Math.random() * 2) + 1 // 1-2 parents
    for (let p = 0; p < parentCount; p++) {
      const parentIdx = Math.floor(Math.random() * i)
      if (!edges.some((e) => e.from === `${parentIdx}` && e.to === `${i}`)) {
        edges.push({
          from: `${parentIdx}`,
          to: `${i}`,
          weight: Math.floor(Math.random() * 10) + 1,
        })
      }
    }
  }

  return { nodes, edges }
}

/**
 * Generate a circular/cyclic graph
 * @param {number} nodeCount - Number of nodes (4-15)
 * @returns {object} { nodes: [], edges: [] }
 */
export const generateCircularGraph = (nodeCount = 6) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `${i}`,
    label: `${i}`,
  }))

  const edges = []
  // Create circular connections: i -> (i+1) % nodeCount
  for (let i = 0; i < nodeCount; i++) {
    const nextNode = (i + 1) % nodeCount
    edges.push({
      from: `${i}`,
      to: `${nextNode}`,
      weight: Math.floor(Math.random() * 10) + 1,
    })
  }

  // Add some random cross-edges for complexity
  const crossEdges = Math.floor(nodeCount / 2)
  for (let e = 0; e < crossEdges; e++) {
    const from = Math.floor(Math.random() * nodeCount)
    let to = Math.floor(Math.random() * nodeCount)
    while (to === from || to === (from + 1) % nodeCount) {
      to = Math.floor(Math.random() * nodeCount)
    }
    if (!edges.some((edge) => edge.from === `${from}` && edge.to === `${to}`)) {
      edges.push({
        from: `${from}`,
        to: `${to}`,
        weight: Math.floor(Math.random() * 10) + 1,
      })
    }
  }

  return { nodes, edges }
}

/**
 * Generate a dense connected graph
 * @param {number} nodeCount - Number of nodes (4-15)
 * @returns {object} { nodes: [], edges: [] }
 */
export const generateDenseGraph = (nodeCount = 8) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `${i}`,
    label: `${i}`,
  }))

  const edges = []
  // Create edges between random pairs with higher density
  const edgeCount = Math.floor((nodeCount * (nodeCount - 1)) / 4)
  
  for (let e = 0; e < edgeCount; e++) {
    let from = Math.floor(Math.random() * nodeCount)
    let to = Math.floor(Math.random() * nodeCount)
    
    while (from === to) {
      to = Math.floor(Math.random() * nodeCount)
    }

    if (!edges.some((edge) => edge.from === `${from}` && edge.to === `${to}`)) {
      edges.push({
        from: `${from}`,
        to: `${to}`,
        weight: Math.floor(Math.random() * 15) + 1,
      })
    }
  }

  return { nodes, edges }
}

/**
 * Generate a bipartite graph
 * @param {number} nodeCount - Total nodes (4-15)
 * @returns {object} { nodes: [], edges: [] }
 */
export const generateBipartiteGraph = (nodeCount = 8) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `${i}`,
    label: `${i}`,
  }))

  const edges = []
  const mid = Math.floor(nodeCount / 2)

  // Connect left side to right side
  for (let i = 0; i < mid; i++) {
    const connectCount = Math.floor(Math.random() * 3) + 1
    for (let c = 0; c < connectCount; c++) {
      const rightNode = Math.floor(Math.random() * (nodeCount - mid)) + mid
      if (!edges.some((e) => e.from === `${i}` && e.to === `${rightNode}`)) {
        edges.push({
          from: `${i}`,
          to: `${rightNode}`,
          weight: Math.floor(Math.random() * 10) + 1,
        })
      }
    }
  }

  return { nodes, edges }
}

/**
 * Generate a star graph (one central hub)
 * @param {number} nodeCount - Number of nodes (4-15)
 * @returns {object} { nodes: [], edges: [] }
 */
export const generateStarGraph = (nodeCount = 7) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `${i}`,
    label: `${i}`,
  }))

  const edges = []
  const centerNode = 0

  // Connect all other nodes to the center
  for (let i = 1; i < nodeCount; i++) {
    edges.push({
      from: `${centerNode}`,
      to: `${i}`,
      weight: Math.floor(Math.random() * 10) + 1,
    })

    // Add return edge with probability
    if (Math.random() > 0.5) {
      edges.push({
        from: `${i}`,
        to: `${centerNode}`,
        weight: Math.floor(Math.random() * 10) + 1,
      })
    }
  }

  // Add some edges between outer nodes
  const outerEdges = Math.floor(nodeCount / 3)
  for (let e = 0; e < outerEdges; e++) {
    let from = Math.floor(Math.random() * (nodeCount - 1)) + 1
    let to = Math.floor(Math.random() * (nodeCount - 1)) + 1
    while (from === to) {
      to = Math.floor(Math.random() * (nodeCount - 1)) + 1
    }
    if (!edges.some((edge) => edge.from === `${from}` && edge.to === `${to}`)) {
      edges.push({
        from: `${from}`,
        to: `${to}`,
        weight: Math.floor(Math.random() * 10) + 1,
      })
    }
  }

  return { nodes, edges }
}

/**
 * Get all graph generators
 */
export const graphGenerators = [
  {
    name: 'Random Tree',
    generator: generateRandomTreeGraph,
    description: 'Tree-like structure with hierarchical connections',
  },
  {
    name: 'Circular',
    generator: generateCircularGraph,
    description: 'Circular flow with cross connections',
  },
  {
    name: 'Dense',
    generator: generateDenseGraph,
    description: 'Highly connected mesh network',
  },
  {
    name: 'Bipartite',
    generator: generateBipartiteGraph,
    description: 'Two-sided connections (left-right)',
  },
  {
    name: 'Star',
    generator: generateStarGraph,
    description: 'Central hub with radial connections',
  },
]

/**
 * Get a random graph generator
 */
export const getRandomGraphGenerator = () => {
  return graphGenerators[Math.floor(Math.random() * graphGenerators.length)]
}

/**
 * Generate random node count between 4 and 15
 */
export const getRandomNodeCount = () => {
  return Math.floor(Math.random() * 12) + 4 // 4-15 nodes
}

/**
 * Generate a complete random graph
 */
export const generateRandomGraph = () => {
  const generator = getRandomGraphGenerator()
  const nodeCount = getRandomNodeCount()
  return generator.generator(nodeCount)
}

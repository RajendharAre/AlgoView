/**
 * BFS Algorithm Implementation with Visualization Steps
 */

// Generator function for BFS visualization steps
export function* bfs(graph, startNodeId) {
  const visited = new Set();
  const traversalOrder = [];
  
  // If no start node is provided, use the first node in the graph
  let actualStartNodeId = startNodeId;
  if (!actualStartNodeId && graph.nodes.length > 0) {
    actualStartNodeId = graph.nodes[0].id;
  }
  
  // Check if start node exists in the current graph
  const startNodeExists = graph.nodes.some(node => node.id === actualStartNodeId);
  
  if (!startNodeExists) {
    yield {
      visited: new Set(),
      queue: [],
      activeNode: null,
      traversalOrder: [],
      currentStep: `Start node does not exist in the graph`,
      edges: graph.edges,
      nodes: graph.nodes,
      componentsFound: 0
    };
    return;
  }

  // Initial state
  yield {
    visited: new Set(),
    queue: [],
    activeNode: null,
    traversalOrder: [],
    currentStep: `Starting BFS traversal from Node ${actualStartNodeId}`,
    edges: graph.edges,
    nodes: graph.nodes,
    componentsFound: 0
  };

  // Use the same approach as the original working BFS
  const globalVisited = new Set();
  const fullOrder = [];
  let compCount = 0;

  const allNodeIds = graph.nodes.map(n => n.id);
  const sortedRoots = startNodeId 
    ? [startNodeId, ...allNodeIds.filter(id => id !== startNodeId)] 
    : allNodeIds;

  for (let rootId of sortedRoots) {
    if (globalVisited.has(rootId)) continue;

    compCount++;
    
    const localQueue = [rootId];
    
    yield {
      visited: new Set(globalVisited),
      queue: [...localQueue],
      activeNode: rootId,
      traversalOrder: [...fullOrder],
      currentStep: `Starting traversal at Node ${graph.nodes.find(n => n.id === rootId)?.label}`,
      edges: graph.edges,
      nodes: graph.nodes,
      componentsFound: compCount
    };
    
    while (localQueue.length > 0) {
      const u = localQueue.shift();
      
      yield {
        visited: new Set(globalVisited),
        queue: [...localQueue],
        activeNode: u,
        traversalOrder: [...fullOrder],
        currentStep: `Processing Node ${graph.nodes.find(n => n.id === u)?.label}`,
        edges: graph.edges,
        nodes: graph.nodes,
        componentsFound: compCount
      };
      
      if (globalVisited.has(u)) continue;

      const nodeObj = graph.nodes.find(n => n.id === u);
      globalVisited.add(u);
      fullOrder.push(u);
      
      yield {
        visited: new Set(globalVisited),
        queue: [...localQueue],
        activeNode: u,
        traversalOrder: [...fullOrder],
        currentStep: `Visiting Node ${nodeObj?.label}`,
        edges: graph.edges,
        nodes: graph.nodes,
        componentsFound: compCount
      };

      const neighbors = graph.edges
        .filter(e => e.u === u || e.v === u)
        .map(e => (e.u === u ? e.v : e.u))
        .filter(v => !globalVisited.has(v));

      for (const v of neighbors) {
        if (!localQueue.includes(v)) {
          localQueue.push(v);
          yield {
            visited: new Set(globalVisited),
            queue: [...localQueue],
            activeNode: u,
            traversalOrder: [...fullOrder],
            currentStep: `Neighbor Node ${graph.nodes.find(n => n.id === v)?.label} added to queue`,
            edges: graph.edges,
            nodes: graph.nodes,
            componentsFound: compCount
          };
        }
      }
    }
  }

  yield {
    visited: new Set(globalVisited),
    queue: [],
    activeNode: null,
    traversalOrder: [...fullOrder],
    currentStep: `BFS traversal complete.`,
    edges: graph.edges,
    nodes: graph.nodes,
    componentsFound: compCount
  };
}

// Algorithm info object
export const bfsInfo = {
  name: 'Breadth-First Search',
  category: 'Graph',
  complexity: {
    time: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    space: 'O(V)'
  },
  description: 'Breadth-First Search is an algorithm for traversing graph data structures.',
  explanation: 'BFS explores all vertices at the present depth level before moving on to vertices at the next depth level, using a queue data structure.',
  steps: [
    'Initialize a queue and visited set',
    'Add starting vertex to queue',
    'While queue is not empty:',
    '  Dequeue vertex',
    '  Visit vertex if not visited',
    '  Enqueue all unvisited adjacent vertices',
    'Repeat until queue is empty'
  ],
  generator: bfs
};
// Generator function for DFS visualization steps
export function* dfs(graph, startNodeId) {
  const visited = new Set();
  const traversalOrder = [];
  const callStack = [];
  
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
      callStack: [],
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
    callStack: [],
    activeNode: null,
    traversalOrder: [],
    currentStep: `Starting DFS traversal from Node ${actualStartNodeId}`,
    edges: graph.edges,
    nodes: graph.nodes,
    componentsFound: 0
  };

  // Use the same approach as the original working DFS
  const globalVisited = new Set();
  const fullOrder = [];
  let compCount = 0;

  const allNodeIds = graph.nodes.map(n => n.id);
  const sortedRoots = startNodeId 
    ? [startNodeId, ...allNodeIds.filter(id => id !== startNodeId)] 
    : allNodeIds;

  // DFS visit function (recursive-like using generator)
  function* dfsVisit(nodeId, localCallStack) {
    if (globalVisited.has(nodeId)) return;

    // Discovery phase
    globalVisited.add(nodeId);
    const nodeObj = graph.nodes.find(n => n.id === nodeId);
    fullOrder.push(nodeId);
    
    yield {
      visited: new Set(globalVisited),
      callStack: [...localCallStack, nodeId],
      activeNode: nodeId,
      traversalOrder: [...fullOrder],
      currentStep: `Discovering Node ${nodeObj?.label}`,
      edges: graph.edges,
      nodes: graph.nodes,
      componentsFound: compCount
    };

    // Explore neighbors
    const neighbors = graph.edges
      .filter(e => e.u === nodeId || e.v === nodeId)
      .map(e => (e.u === nodeId ? e.v : e.u))
      .filter(v => !globalVisited.has(v));

    for (const neighborId of neighbors) {
      const neighborObj = graph.nodes.find(n => n.id === neighborId);
      yield {
        visited: new Set(globalVisited),
        callStack: [...localCallStack, nodeId],
        activeNode: nodeId,
        traversalOrder: [...fullOrder],
        currentStep: `Moving from Node ${nodeObj?.label} to unexplored Node ${neighborObj?.label}`,
        edges: graph.edges,
        nodes: graph.nodes,
        componentsFound: compCount
      };

      // Recursively visit neighbor
      yield* dfsVisit(neighborId, [...localCallStack, nodeId]);
      
      // Post-recursion recovery
      yield {
        visited: new Set(globalVisited),
        callStack: [...localCallStack, nodeId],
        activeNode: nodeId,
        traversalOrder: [...fullOrder],
        currentStep: `Backtracking to Node ${nodeObj?.label}`,
        edges: graph.edges,
        nodes: graph.nodes,
        componentsFound: compCount
      };
    }

    // Finished processing node
    yield {
      visited: new Set(globalVisited),
      callStack: [...localCallStack],
      activeNode: nodeId,
      traversalOrder: [...fullOrder],
      currentStep: `Finished processing Node ${nodeObj?.label}`,
      edges: graph.edges,
      nodes: graph.nodes,
      componentsFound: compCount
    };
  }

  // Main DFS loop for connected components
  for (let rootId of sortedRoots) {
    if (globalVisited.has(rootId)) continue;

    compCount++;
    
    yield {
      visited: new Set(globalVisited),
      callStack: [rootId],
      activeNode: rootId,
      traversalOrder: [...fullOrder],
      currentStep: `Starting DFS traversal at Node ${graph.nodes.find(n => n.id === rootId)?.label}`,
      edges: graph.edges,
      nodes: graph.nodes,
      componentsFound: compCount
    };

    // Start DFS from this root
    yield* dfsVisit(rootId, []);
  }

  yield {
    visited: new Set(globalVisited),
    callStack: [],
    activeNode: null,
    traversalOrder: [...fullOrder],
    currentStep: `DFS traversal complete.`,
    edges: graph.edges,
    nodes: graph.nodes,
    componentsFound: compCount
  };
}

// Algorithm info object
export const dfsInfo = {
  name: 'Depth-First Search',
  category: 'Graph',
  complexity: {
    time: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    space: 'O(V)'
  },
  description: 'Depth-First Search is an algorithm for traversing graph data structures.',
  explanation: 'DFS explores as far as possible along each branch before backtracking, using a stack data structure.',
  steps: [
    'Initialize visited set and call stack',
    'Choose starting vertex',
    'Mark vertex as visited',
    'Push vertex onto call stack',
    'For each unvisited adjacent vertex:',
    '  Recursively apply DFS',
    'Pop vertex from call stack when finished',
    'Repeat until all vertices are visited'
  ],
  generator: dfs
};
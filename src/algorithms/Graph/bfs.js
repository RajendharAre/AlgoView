// src/algorithms/Graph/bfs.js
export function* bfs(graph, startId) {
  // graph: { nodes: [{id,label,x,y}], edges: [{from,to}] }
  const nodes = graph.nodes.map(n => ({ ...n }))
  const edges = graph.edges.map(e => ({ ...e }))
  const visited = new Set()
  const q = []
  const done = []
  const visitedEdges = []

  q.push(startId)
  visited.add(startId)

  let stepIndex = 0

  // initial state
  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    frontier: [...q],
    doneNodes: [...done],
    visitedEdges: [...visitedEdges],
    description: `Start BFS at ${startId}`,
    stepIndex: stepIndex++,
  }

  while (q.length > 0) {
    const u = q.shift()
    yield {
      nodes,
      edges,
      current: u,
      visiting: u,
      frontier: [...q],
      doneNodes: [...done],
      visitedEdges: [...visitedEdges],
      description: `Visiting ${u}`,
      stepIndex: stepIndex++,
    }

    // neighbors
    for (const e of edges) {
      if (e.from === u) {
        const v = e.to
        if (!visited.has(v)) {
          visited.add(v)
          q.push(v)
          visitedEdges.push({ from: u, to: v })
          yield {
            nodes,
            edges,
            current: u,
            visiting: v,
            frontier: [...q],
            doneNodes: [...done],
            visitedEdges: [...visitedEdges],
            description: `Discovered ${v} from ${u}`,
            stepIndex: stepIndex++,
          }
        } else {
          // neighbor already seen - optional step
          yield {
            nodes,
            edges,
            current: u,
            visiting: v,
            frontier: [...q],
            doneNodes: [...done],
            visitedEdges: [...visitedEdges],
            description: `${v} already visited`,
            stepIndex: stepIndex++,
          }
        }
      }
    }

    done.push(u)
    yield {
      nodes,
      edges,
      current: null,
      visiting: null,
      frontier: [...q],
      doneNodes: [...done],
      visitedEdges: [...visitedEdges],
      description: `${u} processed`,
      stepIndex: stepIndex++,
    }
  }

  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    frontier: [],
    doneNodes: [...done],
    visitedEdges: [...visitedEdges],
    description: 'BFS complete',
    stepIndex: stepIndex++,
  }
}

/**
 * Algorithm information for Breadth-First Search
 * 
 * @type {Object}
 * @property {string} name - Name of the algorithm
 * @property {string} category - Category of the algorithm
 * @property {Object} complexity - Time and space complexity
 * @property {Object} complexity.time - Time complexity for different cases
 * @property {string} complexity.time.best - Best case time complexity
 * @property {string} complexity.time.average - Average case time complexity
 * @property {string} complexity.time.worst - Worst case time complexity
 * @property {string} complexity.space - Space complexity
 * @property {boolean} stable - Whether the algorithm is stable
 * @property {boolean} inPlace - Whether the algorithm sorts in-place
 * @property {string} description - Brief description of the algorithm
 */
export const bfsInfo = {
  name: 'Breadth-First Search',
  category: 'graph',
  complexity: {
    time: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    space: 'O(V)'
  },
  stable: true,
  inPlace: false,
  description: 'A graph traversal algorithm that explores all vertices at the present depth level before moving on to vertices at the next depth level.',
  code: {
    javascript: `
function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const result = [];
  
  visited.add(startNode);
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    result.push(currentNode);
    
    // Visit all neighbors
    for (const neighbor of graph[currentNode]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
    python: `
from collections import deque

def bfs(graph, start_node):
    visited = set()
    queue = deque([start_node])
    result = []
    
    visited.add(start_node)
    
    while queue:
        current_node = queue.popleft()
        result.append(current_node)
        
        # Visit all neighbors
        for neighbor in graph[current_node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result`,
    java: `
import java.util.*;

public static List<String> bfs(Map<String, List<String>> graph, String startNode) {
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    List<String> result = new ArrayList<>();
    
    visited.add(startNode);
    queue.add(startNode);
    
    while (!queue.isEmpty()) {
        String currentNode = queue.poll();
        result.add(currentNode);
        
        // Visit all neighbors
        for (String neighbor : graph.get(currentNode)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
    
    return result;
}`
  },
  useCases: [
    'Finding the shortest path in unweighted graphs',
    'Level-order traversal of trees',
    'Finding all nodes within one connected component',
    'Broadcasting in networks',
    'Garbage collection in memory management'
  ]
}
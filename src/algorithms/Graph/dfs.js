// src/algorithms/Graph/dfs.js
export function* dfs(graph, startId) {
  const nodes = graph.nodes.map(n => ({ ...n }))
  const edges = graph.edges.map(e => ({ ...e }))
  const visited = new Set()
  const stack = [startId]
  const done = []
  let stepIndex = 0

  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    stack: [...stack],
    doneNodes: [...done],
    description: `Start DFS at ${startId}`,
    stepIndex: stepIndex++,
  }

  while (stack.length > 0) {
    const u = stack.pop()

    if (!visited.has(u)) {
      visited.add(u)
      yield {
        nodes,
        edges,
        current: u,
        visiting: u,
        stack: [...stack],
        doneNodes: [...done],
        description: `Visiting ${u}`,
        stepIndex: stepIndex++,
      }

      // push neighbors (to simulate recursion order, push reverse)
      const neighbors = edges.filter(e => e.from === u).map(e => e.to)
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const v = neighbors[i]
        if (!visited.has(v)) {
          stack.push(v)
          yield {
            nodes,
            edges,
            current: u,
            visiting: v,
            stack: [...stack],
            doneNodes: [...done],
            description: `Pushed ${v} to stack`,
            stepIndex: stepIndex++,
          }
        } else {
          yield {
            nodes,
            edges,
            current: u,
            visiting: v,
            stack: [...stack],
            doneNodes: [...done],
            description: `${v} already visited`,
            stepIndex: stepIndex++,
          }
        }
      }

      done.push(u)
      yield {
        nodes,
        edges,
        current: null,
        visiting: null,
        stack: [...stack],
        doneNodes: [...done],
        description: `${u} finished`,
        stepIndex: stepIndex++,
      }
    }
  }

  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    stack: [],
    doneNodes: [...done],
    description: 'DFS complete',
    stepIndex: stepIndex++,
  }
}

/**
 * Algorithm information for Depth-First Search
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
export const dfsInfo = {
  name: 'Depth-First Search',
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
  description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
  code: {
    javascript: `
function dfs(graph, startNode) {
  const visited = new Set();
  const stack = [startNode];
  const result = [];
  
  while (stack.length > 0) {
    const currentNode = stack.pop();
    
    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      result.push(currentNode);
      
      // Add neighbors to stack (in reverse order for consistent traversal)
      const neighbors = graph[currentNode] || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }
  }
  
  return result;
}`,
    python: `
def dfs(graph, start_node):
    visited = set()
    stack = [start_node]
    result = []
    
    while stack:
        current_node = stack.pop()
        
        if current_node not in visited:
            visited.add(current_node)
            result.append(current_node)
            
            # Add neighbors to stack
            neighbors = graph.get(current_node, [])
            for neighbor in reversed(neighbors):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result`,
    java: `
import java.util.*;

public static List<String> dfs(Map<String, List<String>> graph, String startNode) {
    Set<String> visited = new HashSet<>();
    Stack<String> stack = new Stack<>();
    List<String> result = new ArrayList<>();
    
    stack.push(startNode);
    
    while (!stack.isEmpty()) {
        String currentNode = stack.pop();
        
        if (!visited.contains(currentNode)) {
            visited.add(currentNode);
            result.add(currentNode);
            
            // Add neighbors to stack
            List<String> neighbors = graph.getOrDefault(currentNode, new ArrayList<>());
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                String neighbor = neighbors.get(i);
                if (!visited.contains(neighbor)) {
                    stack.push(neighbor);
                }
            }
        }
    }
    
    return result;
}`
  },
  useCases: [
    'Detecting cycles in graphs',
    'Topological sorting',
    'Finding connected components',
    'Pathfinding and maze solving',
    'Tree and graph traversal'
  ]
}
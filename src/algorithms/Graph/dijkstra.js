// src/algorithms/Graph/dijkstra.js
export function* dijkstra(graph, startId) {
  // graph: { nodes, edges: {from,to,weight} }
  const nodes = graph.nodes.map(n => ({ ...n }))
  const edges = graph.edges.map(e => ({ ...e }))
  const dist = {}
  const prev = {}
  const pq = [] // simple array-based priority queue (for clarity)
  const done = []
  const visitedEdges = []
  let stepIndex = 0

  for (const n of nodes) {
    dist[n.id] = Infinity
    prev[n.id] = null
  }
  dist[startId] = 0
  pq.push({ id: startId, dist: 0 })

  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    pq: [...pq],
    distances: { ...dist },
    prev: { ...prev },
    doneNodes: [...done],
    visitedEdges: [...visitedEdges],
    description: `Start Dijkstra from ${startId}`,
    stepIndex: stepIndex++,
  }

  while (pq.length > 0) {
    // pop smallest
    pq.sort((a, b) => a.dist - b.dist)
    const top = pq.shift()
    const u = top.id
    if (done.includes(u)) continue

    yield {
      nodes,
      edges,
      current: u,
      visiting: u,
      pq: [...pq],
      distances: { ...dist },
      prev: { ...prev },
      doneNodes: [...done],
      visitedEdges: [...visitedEdges],
      description: `Processing node ${u} (dist ${dist[u]})`,
      stepIndex: stepIndex++,
    }

    // neighbors
    for (const e of edges.filter(e => e.from === u)) {
      const v = e.to
      const alt = dist[u] + (e.weight ?? 1)
      yield {
        nodes,
        edges,
        current: u,
        visiting: v,
        edge: e,
        pq: [...pq],
        distances: { ...dist },
        prev: { ...prev },
        doneNodes: [...done],
        visitedEdges: [...visitedEdges],
        description: `Check ${u} -> ${v} (w=${e.weight ?? 1})`,
        stepIndex: stepIndex++,
      }
      if (alt < dist[v]) {
        dist[v] = alt
        prev[v] = u
        pq.push({ id: v, dist: alt })
        visitedEdges.push({ from: u, to: v })
        yield {
          nodes,
          edges,
          current: u,
          visiting: v,
          pq: [...pq],
          distances: { ...dist },
          prev: { ...prev },
          doneNodes: [...done],
          visitedEdges: [...visitedEdges],
          description: `Update dist[${v}] = ${alt}`,
          stepIndex: stepIndex++,
        }
      } else {
        yield {
          nodes,
          edges,
          current: u,
          visiting: v,
          pq: [...pq],
          distances: { ...dist },
          prev: { ...prev },
          doneNodes: [...done],
          visitedEdges: [...visitedEdges],
          description: `No update for ${v}`,
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
      pq: [...pq],
      distances: { ...dist },
      prev: { ...prev },
      doneNodes: [...done],
      visitedEdges: [...visitedEdges],
      description: `Node ${u} settled`,
      stepIndex: stepIndex++,
    }
  }

  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    pq: [],
    distances: { ...dist },
    prev: { ...prev },
    doneNodes: [...done],
    visitedEdges: [...visitedEdges],
    description: 'Dijkstra complete',
    stepIndex: stepIndex++,
  }
}

/**
 * Algorithm information for Dijkstra's Algorithm
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
export const dijkstraInfo = {
  name: 'Dijkstra\'s Algorithm',
  category: 'graph',
  complexity: {
    time: {
      best: 'O(E + V log V)',
      average: 'O(E + V log V)',
      worst: 'O(E + V log V)'
    },
    space: 'O(V)'
  },
  timeComplexity: {
    best: 'O(E + V log V)',
    average: 'O(E + V log V)',
    worst: 'O(E + V log V)',
    explanation: 'Using min-heap priority queue: Extract-min V times: O(V log V). Update-key up to E times: O(E log V). Total: O((V+E) log V).'
  },
  spaceComplexity: {
    value: 'O(V)',
    explanation: 'Stores distances, previous nodes, priority queue, and visited set all of size V.'
  },
  stable: true,
  inPlace: false,
  description: 'An algorithm for finding the shortest paths between nodes in a weighted graph with non-negative edge weights.',
  code: {
    javascript: `
function dijkstra(graph, startNode) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = new PriorityQueue(); // Assume a priority queue implementation
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = node === startNode ? 0 : Infinity;
    previous[node] = null;
  }
  
  pq.enqueue(startNode, 0);
  
  while (!pq.isEmpty()) {
    const { element: currentNode } = pq.dequeue();
    
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);
    
    // Check neighbors
    for (const neighbor in graph[currentNode]) {
      if (!visited.has(neighbor)) {
        const alt = distances[currentNode] + graph[currentNode][neighbor];
        
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = currentNode;
          pq.enqueue(neighbor, alt);
        }
      }
    }
  }
  
  return { distances, previous };
}`,
    python: `
import heapq

def dijkstra(graph, start_node):
    distances = {node: float('infinity') for node in graph}
    previous = {node: None for node in graph}
    visited = set()
    pq = [(0, start_node)]
    
    distances[start_node] = 0
    
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        
        if current_node in visited:
            continue
        visited.add(current_node)
        
        # Check neighbors
        for neighbor, weight in graph[current_node].items():
            if neighbor not in visited:
                alt = current_distance + weight
                
                if alt < distances[neighbor]:
                    distances[neighbor] = alt
                    previous[neighbor] = current_node
                    heapq.heappush(pq, (alt, neighbor))
    
    return distances, previous`,
    java: `
import java.util.*;

public static Map<String, Integer> dijkstra(Map<String, Map<String, Integer>> graph, String startNode) {
    Map<String, Integer> distances = new HashMap<>();
    Map<String, String> previous = new HashMap<>();
    Set<String> visited = new HashSet<>();
    PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.distance));
    
    // Initialize distances
    for (String node : graph.keySet()) {
        distances.put(node, node.equals(startNode) ? 0 : Integer.MAX_VALUE);
        previous.put(node, null);
    }
    
    pq.add(new Node(startNode, 0));
    
    while (!pq.isEmpty()) {
        Node currentNode = pq.poll();
        
        if (visited.contains(currentNode.name)) continue;
        visited.add(currentNode.name);
        
        // Check neighbors
        Map<String, Integer> neighbors = graph.getOrDefault(currentNode.name, new HashMap<>());
        for (Map.Entry<String, Integer> entry : neighbors.entrySet()) {
            String neighbor = entry.getKey();
            int weight = entry.getValue();
            
            if (!visited.contains(neighbor)) {
                int alt = distances.get(currentNode.name) + weight;
                
                if (alt < distances.get(neighbor)) {
                    distances.put(neighbor, alt);
                    previous.put(neighbor, currentNode.name);
                    pq.add(new Node(neighbor, alt));
                }
            }
        }
    }
    
    return distances;
}`
  },
  useCases: [
    'GPS navigation and route planning',
    'Network routing protocols',
    'Social network analysis for finding shortest connections',
    'Game development for pathfinding AI',
    'Telecommunications for finding optimal data transmission paths'
  ]
}
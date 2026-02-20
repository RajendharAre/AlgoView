/**
 * Prim's Algorithm Information
 * Metadata and documentation for Prim's MST algorithm
 */

export const primInfo = {
  name: 'Prim\'s Algorithm',
  category: 'graph',
  complexity: {
    time: {
      best: 'O(V² + E)',
      average: 'O(V² + E)',
      worst: 'O(V² + E)'
    },
    space: 'O(V)'
  },
  stable: false,
  inPlace: false,
  description: 'Prim\'s algorithm is a greedy algorithm that finds a minimum spanning tree (MST) for a weighted undirected graph. Starting from a root node, it repeatedly adds the minimum weight edge that connects a vertex in the MST to a vertex outside the MST.',
  code: {
    javascript: `
function prim(graph, startNode) {
  const visited = new Set();
  const minCost = {};
  const parent = {};
  const mst = [];
  
  // Initialize
  for (let node of graph.nodes) {
    minCost[node] = Infinity;
  }
  minCost[startNode] = 0;
  
  // Grow MST
  for (let i = 0; i < graph.nodes.length; i++) {
    // Find min cost unvisited node
    let u = null;
    for (let node of graph.nodes) {
      if (!visited.has(node) && (u === null || minCost[node] < minCost[u])) {
        u = node;
      }
    }
    
    if (u === null || minCost[u] === Infinity) break;
    visited.add(u);
    
    if (parent[u] !== undefined) {
      mst.push({u: parent[u], v: u});
    }
    
    // Update neighbors
    for (let edge of graph.edges) {
      let neighbor = null;
      let weight = 0;
      
      if (edge.u === u) {
        neighbor = edge.v;
        weight = edge.weight;
      } else if (edge.v === u) {
        neighbor = edge.u;
        weight = edge.weight;
      }
      
      if (neighbor && !visited.has(neighbor) && weight < minCost[neighbor]) {
        minCost[neighbor] = weight;
        parent[neighbor] = u;
      }
    }
  }
  
  return mst;
}`,
    python: `
def prim(graph, start_node):
    visited = set()
    min_cost = {node: float('inf') for node in graph['nodes']}
    parent = {}
    mst = []
    
    min_cost[start_node] = 0
    
    for _ in range(len(graph['nodes'])):
        # Find minimum cost unvisited node
        u = None
        for node in graph['nodes']:
            if node not in visited and (u is None or min_cost[node] < min_cost[u]):
                u = node
        
        if u is None or min_cost[u] == float('inf'):
            break
        
        visited.add(u)
        
        if u in parent:
            mst.append((parent[u], u))
        
        # Update neighbors
        for edge in graph['edges']:
            if edge['u'] == u:
                neighbor, weight = edge['v'], edge['weight']
            elif edge['v'] == u:
                neighbor, weight = edge['u'], edge['weight']
            else:
                continue
            
            if neighbor not in visited and weight < min_cost[neighbor]:
                min_cost[neighbor] = weight
                parent[neighbor] = u
    
    return mst`,
    java: `
public List<Edge> prim(Graph graph, int startNode) {
    Set<Integer> visited = new HashSet<>();
    Map<Integer, Integer> minCost = new HashMap<>();
    Map<Integer, Integer> parent = new HashMap<>();
    List<Edge> mst = new ArrayList<>();
    
    for (int node : graph.nodes) {
        minCost.put(node, Integer.MAX_VALUE);
    }
    minCost.put(startNode, 0);
    
    for (int i = 0; i < graph.nodes.size(); i++) {
        int u = -1;
        for (int node : graph.nodes) {
            if (!visited.contains(node) && (u == -1 || minCost.get(node) < minCost.get(u))) {
                u = node;
            }
        }
        
        if (u == -1 || minCost.get(u) == Integer.MAX_VALUE) break;
        visited.add(u);
        
        if (parent.containsKey(u)) {
            mst.add(new Edge(parent.get(u), u));
        }
        
        for (Edge edge : graph.edges) {
            int neighbor = -1;
            int weight = 0;
            if (edge.u == u) {
                neighbor = edge.v;
                weight = edge.weight;
            } else if (edge.v == u) {
                neighbor = edge.u;
                weight = edge.weight;
            }
            
            if (neighbor != -1 && !visited.contains(neighbor) && weight < minCost.get(neighbor)) {
                minCost.put(neighbor, weight);
                parent.put(neighbor, u);
            }
        }
    }
    
    return mst;
}`
  },
  useCases: [
    'Finding minimum spanning trees efficiently',
    'Network design with growth from a root',
    'Real-time MST computation where the starting point is given',
    'Image processing and clustering',
    'Finding connected components',
    'Sparse graph optimization'
  ],
  keyPoints: [
    'Grows MST outward from a single starting node',
    'Always picks the minimum weight edge to expand the tree',
    'No union-find structure needed (unlike Kruskal)',
    'Naturally handles dense graphs well',
    'Time complexity depends on graph representation',
    'Can be optimized with priority queues for better performance'
  ]
}

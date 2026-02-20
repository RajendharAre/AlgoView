/**
 * Kruskal's Algorithm Information
 * Metadata and documentation for Kruskal's MST algorithm
 */

export const kruskalInfo = {
  name: 'Kruskal\'s Algorithm',
  category: 'graph',
  complexity: {
    time: {
      best: 'O(E log E)',
      average: 'O(E log E)',
      worst: 'O(E log E)'
    },
    space: 'O(V + E)'
  },
  stable: false,
  inPlace: false,
  description: 'Kruskal\'s algorithm is a greedy algorithm that finds a minimum spanning tree (MST) for a weighted undirected graph. It sorts all edges by weight and adds them to the MST if they don\'t form a cycle, using a Disjoint Set Union (DSU) data structure to detect cycles.',
  code: {
    javascript: `
function kruskal(vertices, edges) {
  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);
  
  const parent = Array.from({length: vertices}, (_, i) => i);
  const rank = Array(vertices).fill(0);
  const mst = [];
  
  for (let edge of edges) {
    const x = find(parent, edge.u);
    const y = find(parent, edge.v);
    
    // If adding this edge doesn't form a cycle
    if (x !== y) {
      mst.push(edge);
      union(parent, rank, x, y);
    }
  }
  
  return mst;
}

function find(parent, i) {
  if (parent[i] === i) return i;
  return find(parent, parent[i]);
}

function union(parent, rank, x, y) {
  const xroot = find(parent, x);
  const yroot = find(parent, y);
  if (rank[xroot] < rank[yroot]) parent[xroot] = yroot;
  else if (rank[xroot] > rank[yroot]) parent[yroot] = xroot;
  else {
    parent[yroot] = xroot;
    rank[xroot]++;
  }
}`,
    python: `
def kruskal(vertices, edges):
    # Sort edges by weight
    edges.sort(key=lambda x: x['weight'])
    
    parent = list(range(vertices))
    rank = [0] * vertices
    mst = []
    
    for edge in edges:
        x = find(parent, edge['u'])
        y = find(parent, edge['v'])
        
        # If adding this edge doesn't form a cycle
        if x != y:
            mst.append(edge)
            union(parent, rank, x, y)
    
    return mst

def find(parent, i):
    if parent[i] == i:
        return i
    return find(parent, parent[i])

def union(parent, rank, x, y):
    xroot = find(parent, x)
    yroot = find(parent, y)
    if rank[xroot] < rank[yroot]:
        parent[xroot] = yroot
    elif rank[xroot] > rank[yroot]:
        parent[yroot] = xroot
    else:
        parent[yroot] = xroot
        rank[xroot] += 1`,
    java: `
public List<Edge> kruskal(int vertices, List<Edge> edges) {
    Collections.sort(edges, Comparator.comparingInt(e -> e.weight));
    
    int[] parent = new int[vertices];
    int[] rank = new int[vertices];
    for (int i = 0; i < vertices; i++) parent[i] = i;
    
    List<Edge> mst = new ArrayList<>();
    
    for (Edge edge : edges) {
        int x = find(parent, edge.u);
        int y = find(parent, edge.v);
        
        if (x != y) {
            mst.add(edge);
            union(parent, rank, x, y);
        }
    }
    
    return mst;
}

private int find(int[] parent, int i) {
    if (parent[i] == i) return i;
    return find(parent, parent[i]);
}

private void union(int[] parent, int[] rank, int x, int y) {
    int xroot = find(parent, x);
    int yroot = find(parent, y);
    if (rank[xroot] < rank[yroot]) parent[xroot] = yroot;
    else if (rank[xroot] > rank[yroot]) parent[yroot] = xroot;
    else {
        parent[yroot] = xroot;
        rank[xroot]++;
    }
}`
  },
  useCases: [
    'Finding minimum spanning trees in weighted graphs',
    'Network design and optimization',
    'Circuit design and minimization',
    'Image segmentation and computer vision',
    'Clustering algorithms',
    'Airline route planning'
  ],
  keyPoints: [
    'Greedy algorithm - always picks the cheapest edge that doesn\'t form a cycle',
    'Uses Disjoint Set Union (DSU) for efficient cycle detection',
    'Time complexity is dominated by edge sorting',
    'Produces same MST weight as Prim\'s algorithm but may have different edge selection',
    'Works with disconnected graphs',
    'Optimal for sparse graphs'
  ]
}

/**
 * A* Pathfinding Algorithm Information
 * Metadata and documentation for A* algorithm
 */

export const astarInfo = {
  name: 'A* Pathfinding',
  category: 'pathfinding',
  complexity: {
    time: {
      best: 'O(b^d)',
      average: 'O(b^d)',
      worst: 'O(b^d)'
    },
    space: 'O(b^d)'
  },
  stable: false,
  inPlace: false,
  description: 'A* is an informed search algorithm that finds the optimal path between nodes in a graph. It combines the benefits of Dijkstra\'s algorithm and greedy best-first search by considering both the cost to reach a node and an heuristic estimate of the cost to the goal.',
  code: {
    javascript: `
function aStar(grid, start, goal, heuristic) {
  const openSet = [start];
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  
  gScore.set(start, 0);
  fScore.set(start, heuristic(start, goal));
  
  while (openSet.length > 0) {
    let current = openSet[0];
    if (current === goal) return reconstructPath(cameFrom, current);
    
    openSet.shift();
    for (let neighbor of getNeighbors(current, grid)) {
      const tentativeGScore = gScore.get(current) + distance(current, neighbor);
      if (tentativeGScore < gScore.get(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, gScore.get(neighbor) + heuristic(neighbor, goal));
        if (!openSet.includes(neighbor)) openSet.push(neighbor);
      }
    }
  }
  return null;
}`,
    python: `
import heapq

def a_star(grid, start, goal, heuristic):
    open_set = [start]
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}
    
    while open_set:
        current = min(open_set, key=lambda x: f_score[x])
        if current == goal:
            return reconstruct_path(came_from, current)
        
        open_set.remove(current)
        for neighbor in get_neighbors(current, grid):
            tentative_g_score = g_score[current] + distance(current, neighbor)
            if tentative_g_score < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)
                if neighbor not in open_set:
                    open_set.append(neighbor)
    
    return None`,
    java: `
public List<Node> aStar(Grid grid, Node start, Node goal, Heuristic heuristic) {
    PriorityQueue<Node> openSet = new PriorityQueue<>(Comparator.comparingDouble(Node::getFScore));
    Map<Node, Node> cameFrom = new HashMap<>();
    Map<Node, Double> gScore = new HashMap<>();
    Map<Node, Double> fScore = new HashMap<>();
    
    openSet.add(start);
    gScore.put(start, 0d);
    fScore.put(start, heuristic.estimate(start, goal));
    
    while (!openSet.isEmpty()) {
        Node current = openSet.poll();
        if (current.equals(goal)) return reconstructPath(cameFrom, current);
        
        for (Node neighbor : grid.getNeighbors(current)) {
            double tentativeGScore = gScore.get(current) + distance(current, neighbor);
            if (tentativeGScore < gScore.getOrDefault(neighbor, Double.MAX_VALUE)) {
                cameFrom.put(neighbor, current);
                gScore.put(neighbor, tentativeGScore);
                fScore.put(neighbor, gScore.get(neighbor) + heuristic.estimate(neighbor, goal));
                openSet.add(neighbor);
            }
        }
    }
    return null;
}`
  },
  useCases: [
    'Pathfinding in game AI and robotics',
    'GPS navigation and route planning',
    'Finding optimal solutions with heuristic guidance',
    'Solving puzzles and maze problems',
    'Real-time path computation with admissible heuristics',
    'Computer vision and image processing applications'
  ],
  keyPoints: [
    'Combines actual cost (g) and heuristic estimate (h) to find optimal paths',
    'f(n) = g(n) + h(n) determines node priority in the open set',
    'Requires an admissible heuristic for guaranteed optimal solution',
    'More efficient than Dijkstra when good heuristic is available',
    'Widely used in game development and robotics',
    'Manhattan or Euclidean distance commonly used as heuristics'
  ]
}

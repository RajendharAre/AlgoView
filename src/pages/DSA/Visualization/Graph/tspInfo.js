/**
 * Traveling Salesman Problem (TSP) Algorithm Info
 * Backtracking with pruning approach
 */

const tspInfo = {
  description: 'Backtracking algorithm that finds the shortest possible route visiting each city exactly once and returning to the starting city',
  timeComplexity: {
    best: 'O(n!)',
    average: 'O(n!)',
    worst: 'O(n!)',
    explanation: 'Must explore factorial permutations of cities with pruning optimization'
  },
  spaceComplexity: {
    value: 'O(n)',
    explanation: 'Space for recursion stack and visited set tracking'
  },
  algorithmSteps: [
    'Start from depot (source city)',
    'Use backtracking to explore all possible routes',
    'Track the best route found so far (upper bound)',
    'Prune branches where current cost exceeds best known cost',
    'When all cities visited, calculate return distance to depot',
    'Update best route if current total cost is better',
    'Return optimal cycle and minimum cost'
  ],
  properties: {
    npHard: true,
    backtracking: true,
    pruning: true,
    optimal: true,
    exponential: true
  },
  useCases: [
    'Route optimization for delivery services',
    'Circuit board drilling',
    'Tour planning and logistics',
    'DNA sequencing',
    'Job scheduling',
    'Network optimization'
  ],
  relatedAlgorithms: [
    'Nearest Neighbor Heuristic',
    'Simulated Annealing',
    'Genetic Algorithm',
    'Ant Colony Optimization',
    'Dynamic Programming (Held-Karp)',
    'Branch and Bound'
  ]
};

export default tspInfo;

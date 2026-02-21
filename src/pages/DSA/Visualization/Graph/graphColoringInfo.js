/**
 * Graph Coloring - Algorithm Information
 * Greedy Graph Coloring Algorithm
 */

export const graphColoringInfo = {
  id: 'graphColoring',
  name: 'Graph Coloring',
  category: 'graph',
  difficulty: 'Medium',
  description: 'Greedy algorithm for assigning colors to graph vertices such that no two adjacent vertices share the same color.',
  
  // Time Complexity Analysis
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    explanation: 'Iterate through V vertices once: O(V). For each vertex, check neighbors: O(degree). Sum of all degrees = 2E. Find available color: O(chromatic number). Total: O(V + E).'
  },
  
  spaceComplexity: {
    value: 'O(V)',
    explanation: 'Stores color assignment for each vertex in a hashmap/array and possibly a frequency map of used colors.'
  },
  
  algorithm: {
    name: 'Greedy Graph Coloring',
    approach: 'Greedy',
    steps: [
      '1. Initialize all vertices as unassigned (no color)',
      '2. Assign first color to first vertex',
      '3. For each remaining vertex:',
      '   - Find all colors assigned to its neighbors',
      '   - Assign the first available color not used by neighbors',
      '4. Result: chromatic number is the number of distinct colors used'
    ]
  },
  
  properties: {
    greedy: true,
    approximate: true,
    correctness: 'Produces a valid coloring but may not be optimal',
    chromaticNumber: 'Upper bound depends on vertex ordering'
  },
  
  useCases: [
    'Register allocation in compilers',
    'Frequency assignment in cellular networks',
    'Exam scheduling',
    'Map coloring',
    'Sudoku solving',
    'Game theory and conflict resolution'
  ],
  
  constraints: {
    maxVertices: 1000,
    maxEdges: 5000,
    isDirected: false,
    isWeighted: false
  },
  
  visualization: {
    nodeRadius: 22,
    edgeStrokeWidth: 2,
    animationSpeed: 'Configurable (1x to 3x)',
    colorPaletteSize: 10
  }
}

export default graphColoringInfo

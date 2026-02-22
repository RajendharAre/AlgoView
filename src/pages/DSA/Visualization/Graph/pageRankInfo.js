/**
 * PageRank Algorithm Information
 * Link analysis algorithm for determining node importance
 */

export const pageRankInfo = {
  id: 'pagerank',
  name: 'PageRank',
  category: 'graph',
  difficulty: 'Medium',
  description: 'PageRank is a link analysis algorithm that evaluates the importance of nodes in a directed graph based on incoming links. Nodes become more important if they receive links from other important nodes.',

  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(k(V + E))',
    worst: 'O(k(V + E))',
    explanation: 'Each iteration processes all vertices and edges. k is the number of iterations needed for convergence (typically 10-30).'
  },

  spaceComplexity: {
    value: 'O(V + E)',
    explanation: 'Stores rank values for each vertex and adjacency list for the graph.'
  },

  algorithm: {
    name: 'Iterative Link Analysis',
    approach: 'Power Method / Iterative Computation',
    steps: [
      '1. Initialize each node with rank = 1/N',
      '2. For each iteration:',
      '   - Each node distributes its rank equally among outgoing links',
      '   - Apply damping factor (0.85) to prevent zero ranks',
      '   - Add random teleport probability (0.15)',
      '3. Repeat until convergence or max iterations',
      '4. Final ranks represent node importance'
    ]
  },

  properties: {
    iterative: true,
    convergent: true,
    damping: 0.85,
    teleportProbability: 0.15,
  },

  useCases: [
    'Web page relevance ranking (original use)',
    'Social network influence analysis',
    'Citation network importance',
    'Recommendation systems',
    'Knowledge graph entity ranking',
    'Academic paper impact assessment'
  ],

  assumptions: [
    'Graph may contain cycles',
    'Directed graph (links have direction)',
    'All nodes are reachable (via teleportation)',
    'No self-links assumed in ideal case'
  ],

  relatedAlgorithms: ['HITS', 'Betweenness Centrality', 'Eigenvector Centrality'],

  visualization: {
    nodeSize: 'Proportional to rank',
    color: 'Monochromatic gray scale',
    animation: 'Rank distribution animation',
    leaderboard: 'Live ranking table'
  }
}

export default pageRankInfo

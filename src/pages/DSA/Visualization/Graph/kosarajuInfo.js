/**
 * Kosaraju's Algorithm Metadata
 * Time Complexity Analysis
 */

const kosarajuInfo = {
  id: 'kosaraju',
  name: 'Kosaraju\'s Algorithm',
  category: 'graph',
  subcategory: 'directed-graphs',
  description: 'Finds all strongly connected components in a directed graph using two passes of depth-first search on the original graph and its transpose.',
  algorithm: "Kosaraju's Two-Pass DFS",
  
  // Time Complexity Analysis
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    explanation: 'First DFS on original graph: O(V+E). Graph transpose: O(V+E). Second DFS on transposed graph: O(V+E). Total: O(V+E).'
  },
  
  spaceComplexity: {
    value: 'O(V + E)',
    explanation: 'Stores finishing stack, call stack for DFS recursion, transposed graph, and SCC component groups.'
  },
  
  difficulty: 'Hard',
  prerequisites: ['Graph Basics', 'Directed Graphs', 'DFS', 'Graph Transpose', 'Strongly Connected Components'],
  svg: '🔄',
  color: '#212529',
  useCases: [
    'Finding strongly connected components in social networks',
    'Analyzing web page connectivity and link analysis',
    'Circuit connectivity analysis in electronics',
    'Compiler symbol resolution and dependency graphs',
    'Determining reachability in directed graphs',
    'PageRank algorithm implementation'
  ],
  relatedProblems: [
    'Strongly Connected Components (LeetCode #1192)',
    'Number of Connectivity Components',
    'Weakly Connected Components',
    'Finding Bridges in Graph',
    'Tarjan\'s SCC Algorithm',
    'Network Flow Analysis'
  ]
}

export default kosarajuInfo

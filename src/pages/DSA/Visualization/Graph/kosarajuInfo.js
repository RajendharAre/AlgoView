/**
 * Kosaraju's Algorithm Metadata
 */

const kosarajuInfo = {
  id: 'kosaraju',
  name: 'Kosaraju\'s Algorithm',
  category: 'graph',
  subcategory: 'directed-graphs',
  description: 'Finds all strongly connected components in a directed graph using two passes of depth-first search on the original graph and its transpose.',
  algorithm: "Kosaraju's Two-Pass DFS",
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  difficulty: 'Hard',
  prerequisites: ['Graph Basics', 'Directed Graphs', 'DFS', 'Graph Transpose'],
  svg: '🔄',
  color: '#212529',
  useCases: [
    'Finding strongly connected components in social networks',
    'Analyzing web page connectivity',
    'Circuit connectivity analysis',
    'Compiler symbol resolution',
    'Determining reachability in graphs'
  ],
  relatedProblems: [
    'Strongly Connected Components',
    'Number of Connectivity Components',
    'Weakly Connected Components',
    'Finding Bridges in Graph'
  ]
}

export default kosarajuInfo

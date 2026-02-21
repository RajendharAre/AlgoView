/**
 * Topological Sort (Kahn's Algorithm) Metadata
 * Time Complexity Analysis
 */

const topSortInfo = {
  id: 'topological-sort',
  name: 'Topological Sort',
  category: 'graph',
  subcategory: 'directed-graphs',
  description: 'Finds a linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge u→v, u comes before v in the ordering.',
  algorithm: "Kahn's Algorithm (BFS-based using In-Degrees)",
  
  // Time Complexity Analysis
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    explanation: 'Calculate in-degrees: O(V+E). Process each vertex once: O(V). Process each edge once: O(E). Total: O(V+E).'
  },
  
  spaceComplexity: {
    value: 'O(V + E)',
    explanation: 'Stores in-degrees for each vertex, queue for BFS processing, and adjacency list storing V+E relationships.'
  },
  
  difficulty: 'Medium',
  prerequisites: ['Graph Basics', 'Directed Graphs', 'In-Degrees', 'BFS'],
  svg: '🔄',
  color: '#212529',
  useCases: [
    'Task scheduling with dependencies',
    'Course prerequisite ordering',
    'Compiler symbol dependency resolution',
    'Build system dependency management',
    'Package dependency installation',
    'Detecting cycles in DAGs'
  ],
  relatedProblems: [
    'Course Schedule II',
    'Build Order',
    'Alien Dictionary',
    'Network Delay Time',
    'LeetCode #207, #210, #269'
  ]
}

export default topSortInfo

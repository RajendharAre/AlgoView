/**
 * Topological Sort (Kahn's Algorithm) Metadata
 */

const topSortInfo = {
  id: 'topological-sort',
  name: 'Topological Sort',
  category: 'graph',
  subcategory: 'directed-graphs',
  description: 'Finds a linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge u→v, u comes before v in the ordering.',
  algorithm: "Kahn's Algorithm (BFS-based)",
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  difficulty: 'Medium',
  prerequisites: ['Graph Basics', 'Directed Graphs', 'In-Degrees'],
  svg: '🔄',
  color: '#212529',
  useCases: [
    'Task scheduling with dependencies',
    'Course prerequisite ordering',
    'Compiler symbol dependency resolution',
    'Build system dependency management',
    'Package dependency installation'
  ],
  relatedProblems: [
    'Course Schedule II',
    'Build Order',
    'Alien Dictionary',
    'Network Delay Time'
  ]
}

export default topSortInfo

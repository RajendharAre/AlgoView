import { bfs, bfsInfo } from './bfs'
import { dfs, dfsInfo } from './dfs'
import { dijkstra, dijkstraInfo } from './dijkstra'

export const graphAlgorithms = {
  bfs: {
    function: bfs,
    info: bfsInfo,
    category: 'graph',
    name: 'Breadth-First Search',
  },
  dfs: {
    function: dfs,
    info: dfsInfo,
    category: 'graph',
    name: 'Depth-First Search',
  },
  dijkstra: {
    function: dijkstra,
    info: dijkstraInfo,
    category: 'graph',
    name: 'Dijkstra\'s Algorithm',
  },
}
/**
 * Kruskal's Algorithm Utilities
 * Constants, helper functions, and colors for Kruskal's MST visualizer
 */

export const COLORS = {
  brightSnow: '#f8f9faff',
  platinum: '#e9ecefff',
  alabasterGrey: '#dee2e6ff',
  paleSlate: '#ced4daff',
  paleSlate2: '#adb5bdff',
  slateGrey: '#6c757dff',
  ironGrey: '#495057ff',
  gunmetal: '#343a40ff',
  carbonBlack: '#212529ff',
}

export const SPEEDS = [
  { label: '1x', value: 1200 },
  { label: '1.5x', value: 800 },
  { label: '2x', value: 500 },
  { label: '2.5x', value: 300 },
  { label: '3x', value: 100 },
]

export const INITIAL_NODES = [
  { id: 0, x: 150, y: 150, label: '0' },
  { id: 1, x: 450, y: 120, label: '1' },
  { id: 2, x: 250, y: 350, label: '2' },
  { id: 3, x: 550, y: 300, label: '3' },
  { id: 4, x: 100, y: 400, label: '4' },
]

export const INITIAL_EDGES = [
  { u: 0, v: 1, weight: 4 },
  { u: 0, v: 2, weight: 2 },
  { u: 1, v: 2, weight: 3 },
  { u: 1, v: 3, weight: 10 },
  { u: 2, v: 3, weight: 2 },
  { u: 2, v: 4, weight: 5 },
  { u: 3, v: 4, weight: 6 },
]

/**
 * Disjoint Set Union (DSU) - Find operation with path compression
 */
export const find = (parent, i) => {
  if (parent[i] === i) return i
  // Path compression
  parent[i] = find(parent, parent[i])
  return parent[i]
}

/**
 * Disjoint Set Union (DSU) - Union operation by rank
 */
export const union = (parent, rank, x, y) => {
  const xroot = find(parent, x)
  const yroot = find(parent, y)
  if (rank[xroot] < rank[yroot]) parent[xroot] = yroot
  else if (rank[xroot] > rank[yroot]) parent[yroot] = xroot
  else {
    parent[yroot] = xroot
    rank[xroot]++
  }
}

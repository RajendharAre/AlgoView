/**
 * Graph Coloring Utilities
 * Constants and helper functions for the visualization
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

// Vibrant color palette for node coloring
export const NODE_PALETTE = [
  { name: 'Red', bg: '#ef4444', text: '#ffffff' },
  { name: 'Blue', bg: '#3b82f6', text: '#ffffff' },
  { name: 'Emerald', bg: '#10b981', text: '#ffffff' },
  { name: 'Amber', bg: '#f59e0b', text: '#ffffff' },
  { name: 'Violet', bg: '#8b5cf6', text: '#ffffff' },
  { name: 'Cyan', bg: '#06b6d4', text: '#ffffff' },
  { name: 'Pink', bg: '#ec4899', text: '#ffffff' },
  { name: 'Orange', bg: '#f97316', text: '#ffffff' },
  { name: 'Indigo', bg: '#6366f1', text: '#ffffff' },
  { name: 'Lime', bg: '#84cc16', text: '#000000' },
]

export const SPEEDS = [
  { label: '1x', value: 1000 },
  { label: '1.5x', value: 700 },
  { label: '2x', value: 450 },
  { label: '2.5x', value: 250 },
  { label: '3x', value: 100 },
]

export const INITIAL_NODES = [
  { id: 0, x: 350, y: 100, label: '0' },
  { id: 1, x: 150, y: 250, label: '1' },
  { id: 2, x: 550, y: 250, label: '2' },
  { id: 3, x: 250, y: 450, label: '3' },
  { id: 4, x: 450, y: 450, label: '4' },
]

export const INITIAL_EDGES = [
  { u: 0, v: 1 },
  { u: 0, v: 2 },
  { u: 1, v: 2 },
  { u: 1, v: 3 },
  { u: 2, v: 4 },
  { u: 3, v: 4 },
]

/**
 * Get neighbors of a node
 */
export const getNeighbors = (nodeId, edges) => {
  return edges
    .filter(e => e.u === nodeId || e.v === nodeId)
    .map(e => (e.u === nodeId ? e.v : e.u))
}

/**
 * Get colors used by neighbors
 */
export const getNeighborColors = (nodeId, edges, nodeColors) => {
  const neighbors = getNeighbors(nodeId, edges)
  const usedColors = new Set()
  neighbors.forEach(vId => {
    if (nodeColors[vId] !== undefined) {
      usedColors.add(nodeColors[vId])
    }
  })
  return usedColors
}

/**
 * Find first available color
 */
export const findAvailableColor = (usedColors) => {
  let colorIdx = 0
  while (usedColors.has(colorIdx)) {
    colorIdx++
  }
  return colorIdx
}

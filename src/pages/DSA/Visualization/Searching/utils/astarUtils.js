/**
 * A* Algorithm Utilities
 * Manhattan Distance heuristic and helper functions
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

export const GRID_SIZE = 20

export const SPEEDS = [
  { label: '1x', value: 100 },
  { label: '1.5x', value: 60 },
  { label: '2x', value: 30 },
  { label: '3x', value: 10 },
  { label: 'Max', value: 1 },
]

export const heuristic = (a, b) => {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c)
}

export const initializeGrid = () => {
  const newGrid = []
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = []
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push({ r, c, isWall: false })
    }
    newGrid.push(row)
  }
  return newGrid
}

export const getNeighbors = (current, grid) => {
  const neighbors = []
  const dr = [-1, 1, 0, 0]
  const dc = [0, 0, -1, 1]

  for (let i = 0; i < 4; i++) {
    const nr = current.r + dr[i]
    const nc = current.c + dc[i]
    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
      if (!grid[nr][nc].isWall) {
        neighbors.push(`${nr},${nc}`)
      }
    }
  }
  return neighbors
}

export const reconstructPath = (cameFrom, startKey, targetKey) => {
  const path = []
  let temp = targetKey
  while (cameFrom[temp]) {
    path.push(temp)
    temp = cameFrom[temp]
  }
  path.push(startKey)
  return path
}

/**
 * PageRank Algorithm Utilities
 * Constants and configurations for PageRank visualization
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
  { label: '2.5x', value: 250 },
  { label: '3x', value: 100 },
]

export const DAMPING_FACTOR = 0.85

export const INITIAL_NODES = [
  { id: 0, x: 150, y: 150, label: 'A', rank: 0.25 },
  { id: 1, x: 350, y: 100, label: 'B', rank: 0.25 },
  { id: 2, x: 550, y: 150, label: 'C', rank: 0.25 },
  { id: 3, x: 350, y: 350, label: 'D', rank: 0.25 },
]

export const INITIAL_EDGES = [
  { u: 0, v: 1 },
  { u: 1, v: 2 },
  { u: 2, v: 0 },
  { u: 0, v: 3 },
  { u: 3, v: 2 },
]

/**
 * Kosaraju's Algorithm Constants
 * Strongly Connected Components Detection
 * Monochromatic "Snow to Carbon" Palette
 */

const COLORS = {
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

const SPEEDS = [
  { label: '1x', value: 1000 },
  { label: '1.5x', value: 600 },
  { label: '2x', value: 300 },
  { label: '2.5x', value: 150 },
  { label: '3x', value: 50 },
]

const INITIAL_NODES = [
  { id: 0, x: 150, y: 150, label: '0' },
  { id: 1, x: 350, y: 150, label: '1' },
  { id: 2, x: 250, y: 300, label: '2' },
  { id: 3, x: 550, y: 150, label: '3' },
  { id: 4, x: 550, y: 300, label: '4' },
]

const INITIAL_EDGES = [
  { u: 0, v: 1 },
  { u: 1, v: 2 },
  { u: 2, v: 0 },
  { u: 1, v: 3 },
  { u: 3, v: 4 },
  { u: 4, v: 3 },
]

export { COLORS, SPEEDS, INITIAL_NODES, INITIAL_EDGES }

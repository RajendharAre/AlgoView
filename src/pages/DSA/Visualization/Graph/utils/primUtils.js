/**
 * Prim's Algorithm Utilities
 * Constants and helper functions for Prim's MST visualizer
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
  { label: '1x', value: 1200, delay: 1200 },
  { label: '1.5x', value: 800, delay: 800 },
  { label: '2x', value: 500, delay: 500 },
  { label: '2.5x', value: 300, delay: 300 },
  { label: '3x', value: 100, delay: 100 },
]

export const INITIAL_NODES = [
  { id: 0, x: 150, y: 150, label: 'A' },
  { id: 1, x: 450, y: 120, label: 'B' },
  { id: 2, x: 250, y: 350, label: 'C' },
  { id: 3, x: 550, y: 300, label: 'D' },
  { id: 4, x: 100, y: 400, label: 'E' },
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

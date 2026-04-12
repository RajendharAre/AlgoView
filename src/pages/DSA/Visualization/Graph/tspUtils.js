/**
 * Traveling Salesman Problem (TSP) Utilities
 * Constants and helper functions
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
  { label: '1x', value: 800 },
  { label: '1.5x', value: 400 },
  { label: '2x', value: 150 },
  { label: 'Max', value: 5 },
]

export const INITIAL_NODES = [
  { id: 1, x: 150, y: 150, label: 'A' },
  { id: 2, x: 450, y: 150, label: 'B' },
  { id: 3, x: 150, y: 400, label: 'C' },
  { id: 4, x: 450, y: 400, label: 'D' },
]

export const calculateDistance = (n1, n2) => {
  const dx = n1.x - n2.x
  const dy = n1.y - n2.y
  return Math.round(Math.sqrt(dx * dx + dy * dy) / 10)
}

export const factorial = num => {
  if (num <= 1) return 1
  let res = 1
  for (let i = 2; i <= num; i++) res *= i
  return res
}

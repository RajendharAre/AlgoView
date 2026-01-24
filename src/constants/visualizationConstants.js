// src/constants/visualizationConstants.js

// Monochromatic "Snow to Carbon" color palette
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
};

// Animation speeds configuration
export const SPEEDS = [
  { label: '1x', value: 1000 },
  { label: '1.5x', value: 666 },
  { label: '1.75x', value: 571 },
  { label: '2x', value: 500 },
  { label: '2.5x', value: 400 },
  { label: '3x', value: 333 },
];

// Bucket ranges for algorithms like BucketSort
export const BUCKET_RANGES = [
  { label: '0-19', min: 0, max: 19 },
  { label: '20-39', min: 20, max: 39 },
  { label: '40-59', min: 40, max: 59 },
  { label: '60-79', min: 60, max: 79 },
  { label: '80-99', min: 80, max: 99 },
];

// Default stats structure for algorithms
export const DEFAULT_STATS = {
  comparisons: 0,
  swaps: 0,
  scattered: 0,
  gathered: 0,
};
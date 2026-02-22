/**
 * Climbing Stairs Algorithm Info
 * DP approach: f(n) = f(n-1) + f(n-2)
 */

const climbingStairsInfo = {
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    explanation: 'Linear time: must compute each step once'
  },
  spaceComplexity: {
    value: 'O(n)',
    explanation: 'Stores dp array with n+1 elements'
  },
  algorithmSteps: [
    'Initialize dp array where dp[i] = ways to reach step i',
    'Base case: dp[0] = 1 (ground floor)',
    'Base case: dp[1] = 1 (single 1-step jump)',
    'For each step i from 2 to n:',
    '  - Calculate dp[i] = dp[i-1] + dp[i-2]',
    '  - This means ways to reach i = ways from i-1 + ways from i-2',
    'Return dp[n] as total number of ways'
  ],
  properties: {
    recursive: false,
    iterative: true,
    tabulation: true,
    optimal: true
  },
  useCases: [
    'Number of ways to reach nth step',
    'Fibonacci sequence computation',
    'Combinatorial counting problems',
    'Path finding with limited moves',
    'Staircase problem variations'
  ],
  relatedAlgorithms: [
    'Fibonacci Sequence',
    'Coin Change Problem',
    'Minimum Path Sum',
    'House Robber'
  ]
};

export default climbingStairsInfo;

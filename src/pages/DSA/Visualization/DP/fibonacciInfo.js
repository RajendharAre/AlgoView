/**
 * Fibonacci Algorithm Metadata
 * Complexity Analysis and Information
 */

const fibonacciInfo = {
  name: 'Fibonacci Sequence',
  category: 'Dynamic Programming',
  difficulty: 'Easy',
  description: 'Generate Fibonacci sequence using bottom-up dynamic programming. Each number is the sum of the two preceding ones.',

  // Time & Space Complexity
  complexity: {
    time: 'O(n)',
    space: 'O(n)',
  },

  // Algorithm Steps
  steps: [
    {
      step: 1,
      description: 'Initialize base cases: F(0) = 0, F(1) = 1',
      details: 'These are the foundation of the Fibonacci sequence.',
    },
    {
      step: 2,
      description: 'Iterate from i=2 to n',
      details: 'For each position, calculate by summing the two previous values.',
    },
    {
      step: 3,
      description: 'F(i) = F(i-1) + F(i-2)',
      details: 'Build the sequence bottom-up, storing results to avoid recalculation.',
    },
    {
      step: 4,
      description: 'Return F(n)',
      details: 'The nth Fibonacci number is computed in linear time.',
    },
  ],

  // Use Cases
  usecases: [
    'Population growth modeling',
    'Financial market analysis',
    'Nature patterns (flower petals, spiral shells)',
    'Algorithm optimization research',
  ],

  // Key Insights
  insights: [
    'Bottom-up DP avoids recursion overhead (unlike naive recursion O(2^n))',
    'Memoization stores computed values for instant lookup',
    'Golden ratio emerges in Fibonacci ratios at large n',
    'Can be optimized to O(1) space using two variables',
  ],

  // Code Example
  codeExamples: {
    approach: 'Bottom-Up Dynamic Programming (Tabulation)',
    pseudo: `function fibonacci(n) {
  dp[0] = 0
  dp[1] = 1
  
  for i from 2 to n:
    dp[i] = dp[i-1] + dp[i-2]
  
  return dp[n]
}`,
  },
};

export default fibonacciInfo;

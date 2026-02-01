/**
 * Quick test to verify response generator improvements
 * Run with: node src/pages/AI/utils/test-responses.js
 */

// Mock import.meta.env
globalThis.import = {
  meta: {
    env: {
      VITE_GEMINI_API_KEY: undefined
    }
  }
};

// Import the response generator
const fs = require('fs');
const path = require('path');

// Read and execute the responseGenerator code
const generatorCode = fs.readFileSync(path.join(__dirname, 'responseGenerator.js'), 'utf8');

// Extract just the getDefaultResponse function
const matches = generatorCode.match(/function getDefaultResponse\(input\)\s*{[\s\S]*?^}/m);
if (!matches) {
  console.error('Could not extract getDefaultResponse function');
  process.exit(1);
}

// Create a function from the code
const getDefaultResponse = eval('(' + matches[0] + ')');

// Test cases
const testCases = [
  {
    input: "What is the difference between QuickSort and bubbleSort?",
    shouldInclude: ["QuickSort", "Bubble Sort", "Time", "Complexity", "O(n log n)", "O(n²)"]
  },
  {
    input: "Explain merge sort",
    shouldInclude: ["Merge Sort", "divide and conquer", "O(n log n)"]
  },
  {
    input: "difference between dfs and bfs",
    shouldInclude: ["DFS", "BFS", "O(V + E)"]
  },
  {
    input: "What's the time complexity of QuickSort?",
    shouldInclude: ["QuickSort", "O(n log n)", "complexity"]
  },
  {
    input: "binary search algorithm",
    shouldInclude: ["Binary Search", "O(log n)", "sorted"]
  },
  {
    input: "data structures overview",
    shouldInclude: ["Data Structures", "Array", "Linked List", "Hash Map"]
  }
];

console.log('\n📋 Testing Response Generator\n');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  console.log(`\n✓ Test ${index + 1}: "${test.input}"`);
  const response = getDefaultResponse(test.input);
  
  const allIncluded = test.shouldInclude.every(term => response.includes(term));
  
  if (allIncluded) {
    console.log('  Status: ✅ PASSED');
    console.log('  All required terms found');
    passed++;
  } else {
    console.log('  Status: ❌ FAILED');
    const missing = test.shouldInclude.filter(term => !response.includes(term));
    console.log(`  Missing terms: ${missing.join(', ')}`);
    failed++;
  }
  
  // Show snippet of response
  const snippet = response.substring(0, 100).replace(/\n/g, ' ');
  console.log(`  Response: "${snippet}..."`);
});

console.log('\n' + '='.repeat(70));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All tests passed! Response generator is working correctly.\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please review the response generator.\n');
  process.exit(1);
}

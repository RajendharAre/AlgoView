/**
 * Quick verification of response generator improvements
 * Run with: node src/pages/AI/verify-responses.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the responseGenerator file
const generatorCode = fs.readFileSync(path.join(__dirname, 'utils', 'responseGenerator.js'), 'utf8');

// Extract the getDefaultResponse function
const functionMatch = generatorCode.match(/function getDefaultResponse\(input\)\s*{[\s\S]*?^}/m);
if (!functionMatch) {
  console.error('❌ Could not extract getDefaultResponse function');
  process.exit(1);
}

// Create the function
const getDefaultResponse = eval('(' + functionMatch[0] + ')');

// Test cases - DSA
const dsaTests = [
  {
    name: "QuickSort vs BubbleSort Comparison",
    input: "What is the difference between QuickSort and bubbleSort?",
    shouldInclude: ["QuickSort", "Bubble Sort"]
  },
  {
    name: "Merge Sort Explanation",
    input: "Explain merge sort",
    shouldInclude: ["Merge Sort", "divide and conquer"]
  },
  {
    name: "DFS vs BFS",
    input: "dfs vs bfs",
    shouldInclude: ["Depth-First", "Breadth-First"]
  },
  {
    name: "Binary Search",
    input: "binary search",
    shouldInclude: ["Binary Search"]
  },
  {
    name: "Data Structures",
    input: "data structures",
    shouldInclude: ["Data Structures"]
  }
];

// Test cases - Web Development
const webDevTests = [
  {
    name: "React Framework",
    input: "What is React?",
    shouldInclude: ["React", "components", "hooks"]
  },
  {
    name: "JavaScript Fundamentals",
    input: "Teach me JavaScript",
    shouldInclude: ["JavaScript", "variables", "functions"]
  },
  {
    name: "HTML CSS",
    input: "HTML and CSS basics",
    shouldInclude: ["HTML", "CSS", "structure"]
  },
  {
    name: "Node.js Backend",
    input: "Node.js backend development",
    shouldInclude: ["Node.js", "server", "Express"]
  }
];

// Test cases - Learning Paths
const pathTests = [
  {
    name: "DSA Roadmap",
    input: "DSA learning roadmap",
    shouldInclude: ["Foundations", "Sorting", "Data Structures"]
  },
  {
    name: "Web Dev Roadmap",
    input: "web development learning path",
    shouldInclude: ["Fundamentals", "Frameworks", "React"]
  },
  {
    name: "Resources",
    input: "recommend me resources for learning",
    shouldInclude: ["LeetCode", "GeeksforGeeks", "FreeCodeCamp"]
  }
];

// Test cases - Off-topic rejection
const offTopicTests = [
  {
    name: "Movie Question Rejection",
    input: "What's a good movie to watch?",
    shouldInclude: ["I appreciate", "specifically designed", "algorithms"]
  },
  {
    name: "Music Question Rejection",
    input: "Tell me about music",
    shouldInclude: ["I appreciate", "specifically designed", "Web Development"]
  }
];

console.log('\n✅ ENHANCED RESPONSE GENERATOR VERIFICATION\n');
console.log('='.repeat(70));

let passed = 0;
let total = 0;

// Test DSA
console.log('\n📊 DSA Tests:');
dsaTests.forEach((test) => {
  total++;
  const response = getDefaultResponse(test.input);
  const allIncluded = test.shouldInclude.every(term => 
    response.toLowerCase().includes(term.toLowerCase())
  );
  
  if (allIncluded) {
    console.log(`  ✅ ${test.name}`);
    passed++;
  } else {
    const missing = test.shouldInclude.filter(term => 
      !response.toLowerCase().includes(term.toLowerCase())
    );
    console.log(`  ❌ ${test.name} (Missing: ${missing.join(', ')})`);
  }
});

// Test Web Development
console.log('\n💻 Web Development Tests:');
webDevTests.forEach((test) => {
  total++;
  const response = getDefaultResponse(test.input);
  const allIncluded = test.shouldInclude.every(term => 
    response.toLowerCase().includes(term.toLowerCase())
  );
  
  if (allIncluded) {
    console.log(`  ✅ ${test.name}`);
    passed++;
  } else {
    const missing = test.shouldInclude.filter(term => 
      !response.toLowerCase().includes(term.toLowerCase())
    );
    console.log(`  ❌ ${test.name} (Missing: ${missing.join(', ')})`);
  }
});

// Test Learning Paths
console.log('\n🗺️ Learning Path Tests:');
pathTests.forEach((test) => {
  total++;
  const response = getDefaultResponse(test.input);
  const allIncluded = test.shouldInclude.every(term => 
    response.toLowerCase().includes(term.toLowerCase())
  );
  
  if (allIncluded) {
    console.log(`  ✅ ${test.name}`);
    passed++;
  } else {
    const missing = test.shouldInclude.filter(term => 
      !response.toLowerCase().includes(term.toLowerCase())
    );
    console.log(`  ❌ ${test.name} (Missing: ${missing.join(', ')})`);
  }
});

// Test Off-topic Rejection
console.log('\n🚫 Off-Topic Rejection Tests:');
offTopicTests.forEach((test) => {
  total++;
  const response = getDefaultResponse(test.input);
  const allIncluded = test.shouldInclude.every(term => 
    response.toLowerCase().includes(term.toLowerCase())
  );
  
  if (allIncluded) {
    console.log(`  ✅ ${test.name}`);
    passed++;
  } else {
    const missing = test.shouldInclude.filter(term => 
      !response.toLowerCase().includes(term.toLowerCase())
    );
    console.log(`  ❌ ${test.name} (Missing: ${missing.join(', ')})`);
  }
});

console.log('\n' + '='.repeat(70));
console.log(`\n📊 FINAL RESULTS: ${passed}/${total} tests passed\n`);

if (passed === total) {
  console.log('✅ ALL TESTS PASSED! Enhanced response generator is working perfectly.\n');
} else {
  console.log(`⚠️  ${total - passed} test(s) failed.\n`);
}


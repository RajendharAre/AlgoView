import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Validate that all required environment variables are set
const requiredEnvVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_AUTH_DOMAIN'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  console.error('\n📝 Create a .env.local file with your Firebase credentials');
  console.error('📄 See .env.example for the required format\n');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleBlogs = [
  {
    title: "Quick Sort Algorithm: Complete Guide with Implementation",
    slug: "quick-sort-algorithm",
    excerpt: "Learn quick sort algorithm with interactive visualization and implementation in JavaScript. Master partitioning, pivot selection, and time complexity analysis.",
    category: "DSA & Algorithms",
    tags: ["sorting", "algorithms", "advanced", "implementation"],
    keywords: ["quick sort", "partition algorithm", "sorting algorithms", "divide and conquer"],
    relatedVisualizer: "/dsa/algorithms/sorting",
    content: `## Quick Sort Algorithm

Quick Sort is one of the most efficient sorting algorithms. It uses the divide-and-conquer strategy to sort data by partitioning arrays around a pivot element.

### How Quick Sort Works

Quick sort works by:
1. Selecting a pivot element
2. Partitioning the array into two parts (elements less than pivot and greater than pivot)
3. Recursively sorting both partitions

### Time Complexity Analysis

- Best Case: O(n log n) - When pivot divides array evenly
- Average Case: O(n log n) - Most common scenario
- Worst Case: O(n²) - When pivot is always smallest/largest
- Space Complexity: O(log n) - Due to recursion stack

### Implementation

\`\`\`javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
\`\`\`

### Practical Applications

- ✅ Database sorting and indexing
- ✅ Real-time data processing
- ✅ General-purpose sorting in production systems
- ✅ External sorting for large datasets

### Advantages

- Very efficient for large datasets
- In-place sorting (minimal extra space)
- Cache-friendly due to sequential access
- Average case is superior to other O(n log n) algorithms

### Disadvantages

- Unstable sorting (doesn't preserve equal elements' order)
- Worst case O(n²) with poor pivot selection
- Not adaptive (doesn't benefit from partially sorted arrays)`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "8 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Merge Sort: Stable Sorting with O(n log n) Guarantee",
    slug: "merge-sort-algorithm",
    excerpt: "Master merge sort algorithm with complete implementation guide. Learn why it's stable, guaranteed O(n log n), and perfect for linked lists.",
    category: "DSA & Algorithms",
    tags: ["sorting", "algorithms", "beginner-friendly"],
    keywords: ["merge sort", "stable sorting", "divide and conquer", "linked list sorting"],
    relatedVisualizer: "/dsa/algorithms/sorting",
    content: `## Merge Sort Algorithm

Merge Sort is a stable, divide-and-conquer sorting algorithm that guarantees O(n log n) time complexity in all cases - best, average, and worst.

### Key Characteristics

- Stable: Equal elements maintain their relative order
- Guaranteed O(n log n): Works consistently regardless of input
- Divide-and-Conquer: Recursive approach for efficient sorting
- Extra Space: Requires O(n) additional space

### How Merge Sort Works

1. Divide: Split array into two halves recursively
2. Conquer: Sort each half
3. Combine: Merge sorted halves back together

### Time and Space Complexity

| Scenario | Time | Space |
|----------|------|-------|
| Best Case | O(n log n) | O(n) |
| Average Case | O(n log n) | O(n) |
| Worst Case | O(n log n) | O(n) |

### Implementation Example

\`\`\`javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i), right.slice(j));
}
\`\`\`

### When to Use Merge Sort

- When you need stable sorting
- When consistent O(n log n) performance is required
- Sorting linked lists efficiently
- External sorting of large datasets
- When space isn't a primary constraint`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "7 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Binary Search: Log-Time Searching in Sorted Arrays",
    slug: "binary-search-algorithm",
    excerpt: "Complete guide to binary search algorithm with implementation and problem-solving strategies. Master logarithmic time complexity searching.",
    category: "DSA & Algorithms",
    tags: ["searching", "algorithms", "beginner"],
    keywords: ["binary search", "log n", "searching algorithms", "sorted arrays"],
    relatedVisualizer: "/dsa/algorithms/searching",
    content: `## Binary Search Algorithm

Binary Search is a highly efficient algorithm for finding an element in a sorted array by repeatedly dividing the search interval in half.

### Time Complexity

- Best Case: O(1) - Element at center position
- Average Case: O(log n)
- Worst Case: O(log n)
- Space: O(1) for iterative, O(log n) for recursive

### How Binary Search Works

Binary Search works by:
1. Start with the entire sorted array
2. Compare target with middle element
3. If match found, return index
4. If target < middle, search left half
5. If target > middle, search right half
6. Repeat until found or search space is empty

### Iterative Implementation

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}
\`\`\`

### Recursive Implementation

\`\`\`javascript
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}
\`\`\`

### Real-World Applications

- Search functionality in large databases
- Version control systems (finding bugs)
- Machine learning (hyperparameter tuning)
- API rate limit checks
- Library systems and catalogs

### Important Notes

- Array MUST be sorted before using binary search
- Works only with random-access data structures
- Much faster than linear search for large datasets`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "6 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Dynamic Programming: Master Optimization Techniques",
    slug: "dynamic-programming-guide",
    excerpt: "Learn dynamic programming from basics to advanced. Master memoization, tabulation, and solve classic problems like Fibonacci and Knapsack.",
    category: "DSA & Algorithms",
    tags: ["dynamic-programming", "algorithms", "optimization"],
    keywords: ["DP", "memoization", "tabulation", "optimization"],
    relatedVisualizer: "/dsa/algorithms/dp",
    content: `## Dynamic Programming Fundamentals

Dynamic Programming is an optimization technique for solving complex problems by breaking them down into simpler subproblems and storing their solutions to avoid redundant calculations.

### Core Principles

#### 1. Optimal Substructure
The solution contains optimal solutions to subproblems.

#### 2. Overlapping Subproblems
The same subproblems are solved multiple times.

### Two Main Approaches

#### Memoization (Top-Down)
- Start with main problem
- Recursively solve subproblems
- Cache results to avoid recalculation

\`\`\`javascript
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}
\`\`\`

#### Tabulation (Bottom-Up)
- Build solution iteratively
- Create table for subproblems
- More efficient space usage in some cases

\`\`\`javascript
function fibonacciTab(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
\`\`\`

### Classic Problems

- ✅ Fibonacci Series
- ✅ 0/1 Knapsack Problem
- ✅ Longest Common Subsequence
- ✅ Edit Distance
- ✅ Coin Change Problem
- ✅ Matrix Chain Multiplication

### When to Use DP

- Problems with overlapping subproblems
- Problems with optimal substructure
- Need for optimization over brute force
- Recurrence relations exist`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "9 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Graph Algorithms: DFS, BFS, and Path Finding",
    slug: "graph-algorithms-guide",
    excerpt: "Complete guide to essential graph algorithms. Learn DFS, BFS, shortest path algorithms, and practical implementations with examples.",
    category: "DSA & Algorithms",
    tags: ["graphs", "algorithms", "searching"],
    keywords: ["DFS", "BFS", "Dijkstra", "graph algorithms"],
    relatedVisualizer: "/dsa/algorithms/graph",
    content: `## Graph Algorithms Explained

Graphs are fundamental data structures used in countless applications. This guide covers essential graph traversal and pathfinding algorithms.

### Graph Representation

#### Adjacency List
- Efficient space complexity
- Better for sparse graphs
- \`\`\`javascript
const graph = {
  'A': ['B', 'C'],
  'B': ['A', 'D'],
  'C': ['A', 'E'],
  'D': ['B'],
  'E': ['C']
};
\`\`\`

#### Adjacency Matrix
- Good for dense graphs
- O(1) edge lookup
- Uses more space

### Depth-First Search (DFS)

Explores as far as possible along each branch before backtracking.

\`\`\`javascript
function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  console.log(node);
  
  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}
\`\`\`

### Breadth-First Search (BFS)

Explores vertices in layers, visiting all neighbors before moving deeper.

\`\`\`javascript
function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
\`\`\`

### Applications

- ✅ Social networks (friend connections)
- ✅ Web crawling and indexing
- ✅ GPS navigation and route planning
- ✅ Game AI pathfinding`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "10 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Linked Lists: Construction, Manipulation, and Operations",
    slug: "linked-lists-complete-guide",
    excerpt: "Master linked lists from basics to advanced operations. Learn node structure, insertion, deletion, reversal, and common problems.",
    category: "DSA & Algorithms",
    tags: ["data-structures", "linked-lists", "beginner"],
    keywords: ["linked list", "nodes", "pointers", "data structures"],
    relatedVisualizer: "/dsa/data-structures/linked-list",
    content: `## Linked Lists Structure

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node through a reference (pointer).

### Node Structure

\`\`\`javascript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
}
\`\`\`

### Common Operations

#### Insertion at Beginning
- Time: O(1)
- Space: O(1)

\`\`\`javascript
insertAtBeginning(data) {
  const newNode = new Node(data);
  newNode.next = this.head;
  this.head = newNode;
}
\`\`\`

#### Deletion
- Time: O(n)
- Space: O(1)

#### Reversal
- Time: O(n)
- Space: O(1)

### Advantages vs Arrays

- Dynamic size
- Efficient insertions/deletions
- No memory wastage

### Disadvantages

- No random access
- Extra space for pointers
- Cache unfriendly`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "7 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Time and Space Complexity: The Complete Reference",
    slug: "time-space-complexity-guide",
    excerpt: "Master Big O notation, time complexity analysis, and space optimization. Learn to analyze algorithm efficiency with practical examples.",
    category: "DSA & Algorithms",
    tags: ["fundamentals", "complexity", "optimization"],
    keywords: ["Big O", "time complexity", "space complexity", "algorithm analysis"],
    relatedVisualizer: "/dsa/concepts/complexity",
    content: `## Understanding Complexity Analysis

Complexity analysis helps us understand how algorithms scale with input size. We use Big O notation to describe this behavior.

### Time Complexity Classes

#### O(1) - Constant
Execution time doesn't depend on input size.

#### O(log n) - Logarithmic
Time grows proportionally to log of input size.

#### O(n) - Linear
Time grows linearly with input size.

#### O(n log n) - Linearithmic
Efficient sorting algorithms (merge sort, quick sort).

#### O(n²) - Quadratic
Nested loops - bubble sort, selection sort.

#### O(2ⁿ) - Exponential
Very poor scaling - brute force subsets.

### Space Complexity

Space refers to auxiliary memory used by algorithm.

\`\`\`javascript
// O(1) space
function sumArray(arr) {
  let sum = 0;
  for (let num of arr) sum += num;
  return sum;
}

// O(n) space
function reverseArray(arr) {
  const reversed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}
\`\`\`

### Complexity Comparison Table

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| Bubble Sort | O(n²) | O(1) | Small arrays |
| Quick Sort | O(n log n) | O(log n) | General use |
| Merge Sort | O(n log n) | O(n) | Linked lists |
| Heap Sort | O(n log n) | O(1) | Large arrays |

### Key Takeaways

- Analyze both time and space complexity
- Consider best, average, and worst cases
- Trade-offs between time and space
- Optimize for your specific constraints`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "8 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Array and String Problems: Practical Interview Questions",
    slug: "array-string-problems",
    excerpt: "Solve classic array and string problems. Master two-pointer technique, sliding window, and common interview challenges.",
    category: "DSA & Algorithms",
    tags: ["arrays", "strings", "problems"],
    keywords: ["two pointer", "sliding window", "array problems", "string manipulation"],
    relatedVisualizer: "/dsa/problems/arrays",
    content: `## Essential Array Problems

Arrays and strings are fundamental to coding interviews. Master these patterns and techniques.

### Two-Pointer Technique

Used for problems requiring comparison of elements from both ends.

\`\`\`javascript
// Reverse string
function reverseString(str) {
  const arr = str.split('');
  let left = 0, right = arr.length - 1;
  
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  
  return arr.join('');
}
\`\`\`

### Sliding Window Pattern

Efficient for finding subarrays with specific properties.

\`\`\`javascript
// Maximum sum subarray of size k
function maxSumSubarray(arr, k) {
  let maxSum = 0;
  let currentSum = 0;
  
  for (let i = 0; i < k; i++) {
    currentSum += arr[i];
  }
  maxSum = currentSum;
  
  for (let i = k; i < arr.length; i++) {
    currentSum = currentSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}
\`\`\`

### Common Problems

- ✅ Two Sum
- ✅ Longest Substring Without Repeating Characters
- ✅ Container With Most Water
- ✅ Remove Duplicates from Sorted Array
- ✅ Rotate Array`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "8 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Boolean Algebra and Logic Gates: Computer Architecture Basics",
    slug: "boolean-algebra-logic-gates",
    excerpt: "Learn boolean algebra, truth tables, and logic gates. Understand the foundation of digital circuits and computer architecture.",
    category: "Web Development",
    tags: ["fundamentals", "computer-science", "logic"],
    keywords: ["boolean algebra", "logic gates", "digital circuits", "boolean logic"],
    relatedVisualizer: "/concepts/boolean-logic",
    content: `## Boolean Algebra Fundamentals

Boolean algebra is the mathematical foundation of digital computing. It uses binary values (0/1 or true/false) and logical operations.

### Basic Operations

#### AND (&&)
Both operands must be true.

\`\`\`
Truth Table:
| A | B | A AND B |
|---|---|---------|
| 0 | 0 |    0    |
| 0 | 1 |    0    |
| 1 | 0 |    0    |
| 1 | 1 |    1    |
\`\`\`

#### OR (||)
At least one operand must be true.

#### NOT (!)
Inverts the boolean value.

### De Morgan's Laws

- NOT (A AND B) = (NOT A) OR (NOT B)
- NOT (A OR B) = (NOT A) AND (NOT B)

### JavaScript Implementation

\`\`\`javascript
// AND
true && true  // true
true && false // false

// OR
true || false // true
false || false // false

// NOT
!true  // false
!false // true
\`\`\`

### Logic Gates in Hardware

- AND Gate: Output 1 only when both inputs are 1
- OR Gate: Output 1 when at least one input is 1
- NOT Gate: Inverts input
- XOR Gate: Output 1 when inputs differ
- NAND/NOR: Negations of AND/OR

### Applications

- ✅ Conditional logic in programming
- ✅ Digital circuit design
- ✅ Search filter combinations
- ✅ Access control systems`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "6 min",
    createdAt: serverTimestamp()
  },
  {
    title: "Binary Trees: Structure, Traversal, and Applications",
    slug: "binary-trees-guide",
    excerpt: "Master binary trees including BST properties, traversal methods (in-order, pre-order, post-order), balancing techniques, and real-world applications in interview problems.",
    category: "DSA & Algorithms",
    tags: ["trees", "data-structures", "algorithms", "advanced"],
    keywords: ["binary trees", "BST", "tree traversal", "balanced trees", "interview"],
    relatedVisualizer: "/dsa/algorithms/graph",
    content: `## Binary Trees: Complete Guide

Binary Trees are fundamental hierarchical data structures where each node has at most two children (left and right). They're essential for interviews and real-world applications.

### Core Concepts

A binary tree node structure:
\`\`\`javascript
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
\`\`\`

### Binary Tree Properties

- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to specific node
- **Balanced Tree**: Height difference at each node ≤ 1
- **Perfect Tree**: All levels completely filled

### Tree Traversal Methods

#### 1. In-Order Traversal (Left → Root → Right)
Used for BST to get sorted output.

\`\`\`javascript
function inOrder(node, result = []) {
  if (node === null) return result;
  
  inOrder(node.left, result);
  result.push(node.val);
  inOrder(node.right, result);
  
  return result;
}
\`\`\`

**Output Example**: For BST [5,3,7,2,4], output: [2,3,4,5,7]

#### 2. Pre-Order Traversal (Root → Left → Right)
Useful for creating tree copy or serialization.

\`\`\`javascript
function preOrder(node, result = []) {
  if (node === null) return result;
  
  result.push(node.val);
  preOrder(node.left, result);
  preOrder(node.right, result);
  
  return result;
}
\`\`\`

#### 3. Post-Order Traversal (Left → Right → Root)
Used for deletion (delete children before parent).

\`\`\`javascript
function postOrder(node, result = []) {
  if (node === null) return result;
  
  postOrder(node.left, result);
  postOrder(node.right, result);
  result.push(node.val);
  
  return result;
}
\`\`\`

#### 4. Level-Order Traversal (BFS)
Breadth-first traversal useful for finding patterns by levels.

\`\`\`javascript
function levelOrder(root) {
  if (!root) return [];
  
  const queue = [root];
  const result = [];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}
\`\`\`

### Binary Search Trees (BST)

BST is a special binary tree with ordering property:
- Left subtree values < Node value
- Right subtree values > Node value

#### BST Operations

**Search Operation - Time: O(log n) average, O(n) worst**
\`\`\`javascript
function search(node, target) {
  if (node === null) return false;
  if (node.val === target) return true;
  
  if (target < node.val) {
    return search(node.left, target);
  } else {
    return search(node.right, target);
  }
}
\`\`\`

**Insertion - Maintains BST property**
\`\`\`javascript
function insert(node, val) {
  if (node === null) {
    return new TreeNode(val);
  }
  
  if (val < node.val) {
    node.left = insert(node.left, val);
  } else if (val > node.val) {
    node.right = insert(node.right, val);
  }
  
  return node;
}
\`\`\`

### Self-Balancing Trees

**AVL Trees**: Maintain balance with rotations (height diff ≤ 1)
- Rotations: Left, Right, Left-Right, Right-Left
- Search/Insert/Delete: O(log n) guaranteed

**Red-Black Trees**: Color-based balancing with relaxed constraints
- Used in Java TreeMap and C++ std::map
- All operations: O(log n)

### Common Interview Problems

| Problem | Difficulty | Key Insight |
|---------|-----------|-----------|
| Lowest Common Ancestor | Medium | Post-order traversal or path tracking |
| Max Path Sum | Hard | DFS calculating through each node |
| Serialize/Deserialize | Hard | Pre-order with markers for structure |
| Binary Tree Level Order | Easy | BFS with level tracking |
| Kth Smallest in BST | Medium | In-order gives sorted output |
| Validate BST | Easy | Track min-max constraints |

### Time & Space Complexity Summary

| Operation | Average | Worst | Space |
|-----------|---------|-------|-------|
| Search BST | O(log n) | O(n) | O(log n) |
| Insert BST | O(log n) | O(n) | O(log n) |
| Delete BST | O(log n) | O(n) | O(log n) |
| Tree Traversal | O(n) | O(n) | O(h) |
| Level-Order | O(n) | O(n) | O(w) |

### Real-World Applications

✅ **File Systems**: Directory structure hierarchies
✅ **Database Indexing**: B-trees for I/O optimization
✅ **Expression Trees**: Parse and evaluate mathematical expressions
✅ **DOM Trees**: HTML/XML document structure
✅ **Game State**: Game trees in AI (Chess, Tic-Tac-Toe)
✅ **Autocomplete**: Trie (prefix tree) for search suggestions

### Tips for Interview Success

1. **Practice Recursion**: Most tree problems need recursive thinking
2. **Understand Traversals**: Pick the right traversal for each problem
3. **Edge Cases**: Empty trees, single nodes, skewed trees
4. **Time Complexity**: Know when problem needs self-balancing
5. **Visualization**: Draw the tree to understand patterns

### Practice Recommendations

- Start with basic traversals and medium difficulty problems
- Master "Validate BST" before attempting complex validation problems
- Practice building trees from traversal outputs
- Solve at least 5 LeetCode hard tree problems before interview`,
    author: "Algorithm Visualizer",
    authorId: "seed-user",
    authorEmail: "admin@algoview.com",
    status: "published",
    views: 0,
    readTime: "9 min",
    createdAt: serverTimestamp()
  }
];

async function populateBlogs() {
  let count = 0;
  try {
    const blogsRef = collection(db, 'blogs');
    console.log('Adding 10 sample blogs to Firestore...\n');

    for (const blog of sampleBlogs) {
      const docData = {
        ...blog,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(blogsRef, docData);
      count++;
      console.log(`✅ Added blog ${count}/10: ${blog.title}`);
    }

    console.log(`\n✨ Successfully added ${count} sample blogs!`);
    console.log('🎉 Now go to http://localhost:5173/blog to see them!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating blogs:', error.message);
    process.exit(1);
  }
}

populateBlogs();

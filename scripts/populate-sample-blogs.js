import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleBlogs = [
  {
    title: 'Understanding Big O Notation: A Complete Guide for Beginners',
    slug: 'understanding-big-o-notation-complete-guide',
    excerpt:
      'Learn how to analyze algorithm efficiency using Big O notation. Master time and space complexity concepts that every developer must know.',
    content: `# Understanding Big O Notation: A Complete Guide for Beginners

Big O notation is fundamental to computer science and algorithm design. It helps us understand how algorithms scale as the input size grows.

## What is Big O Notation?

Big O notation describes the worst-case scenario of an algorithm's time or space complexity. It answers the question: "How does the runtime grow as the input size increases?"

## Common Big O Notations

### O(1) - Constant Time
Operations that take the same time regardless of input size.

\`\`\`javascript
function getFirstElement(arr) {
  return arr[0]; // Always takes same time
}
\`\`\`

### O(n) - Linear Time
Operations that grow linearly with input size.

\`\`\`javascript
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}
\`\`\`

### O(n²) - Quadratic Time
Operations with nested loops over the input.

\`\`\`javascript
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
\`\`\`

### O(log n) - Logarithmic Time
Efficient algorithms that reduce the problem size by half each iteration.

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
\`\`\`

## Why Does Big O Matter?

1. **Scalability**: Helps predict performance with large datasets
2. **Optimization**: Identify bottlenecks in your code
3. **Interviews**: Essential knowledge for technical interviews
4. **Real-world impact**: Difference between solution taking 1 second vs 1 hour

## Quick Reference Chart

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Hash table lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Simple loop |
| O(n log n) | Linearithmic | Merge sort, Quick sort |
| O(n²) | Quadratic | Bubble sort, Selection sort |
| O(2ⁿ) | Exponential | Recursive fibonacci |
| O(n!) | Factorial | Generating permutations |

## Key Takeaways

- Big O describes worst-case complexity
- Always aim for better complexity when possible
- Never ignore the constant factors in real-world scenarios
- Practice analyzing algorithms to build intuition

Master Big O notation and you'll write more efficient code!`,
    category: 'DSA & Algorithms',
    tags: ['Big O', 'Complexity Analysis', 'Algorithms', 'Beginner'],
    keywords:
      'Big O notation, time complexity, space complexity, algorithm analysis, computer science',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 245,
    readTime: '8 min',
  },
  {
    title: 'Bubble Sort Explained: Step-by-Step Tutorial with Visualizations',
    slug: 'bubble-sort-explained-tutorial',
    excerpt:
      'Master the fundamentals of sorting with our comprehensive bubble sort guide. Includes code examples and interactive visualizations.',
    content: `# Bubble Sort Explained: Step-by-Step Tutorial

Bubble Sort is one of the simplest sorting algorithms and a perfect starting point for learning about sorting.

## What is Bubble Sort?

Bubble Sort works by repeatedly stepping through the array, comparing adjacent elements, and swapping them if they're in the wrong order. It "bubbles" the largest elements to the end with each pass.

## Algorithm Steps

1. Start at the beginning of the array
2. Compare the first two elements
3. If the first is larger than the second, swap them
4. Move to the next pair and repeat
5. After each pass, the largest unsorted element is in its correct position
6. Repeat until the array is sorted

## Code Implementation

\`\`\`javascript
function bubbleSort(arr) {
  const n = arr.length;
  
  // Outer loop for each pass
  for (let i = 0; i < n - 1; i++) {
    // Inner loop for comparisons
    for (let j = 0; j < n - i - 1; j++) {
      // Swap if elements are in wrong order
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}

// Example
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// Output: [11, 12, 22, 25, 34, 64, 90]
\`\`\`

## Optimized Bubble Sort

We can optimize by stopping if no swaps occur in a pass:

\`\`\`javascript
function optimizedBubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swaps, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}
\`\`\`

## Complexity Analysis

- **Time Complexity**: 
  - Best Case: O(n) - when array is already sorted (with optimization)
  - Average Case: O(n²)
  - Worst Case: O(n²) - when array is reverse sorted
- **Space Complexity**: O(1) - only uses constant extra space
- **Stable**: Yes - equal elements maintain their relative order

## When to Use Bubble Sort

✓ Educational purposes
✓ Small datasets
✓ Nearly sorted data (with optimization)
✗ Large datasets
✗ Performance-critical applications

Use AlgoView's interactive visualizer to see bubble sort in action!`,
    category: 'DSA & Algorithms',
    tags: ['Sorting', 'Bubble Sort', 'Algorithms', 'Tutorial'],
    keywords: 'bubble sort, sorting algorithm, algorithm tutorial, step-by-step guide',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 189,
    readTime: '6 min',
  },
  {
    title: 'Binary Search: The Fast Way to Find Elements',
    slug: 'binary-search-complete-guide',
    excerpt:
      'Discover how binary search achieves O(log n) time complexity. Perfect for sorted arrays and interview preparation.',
    content: `# Binary Search: Find Elements in Logarithmic Time

Binary search is one of the most elegant and efficient algorithms for searching in sorted arrays.

## How Binary Search Works

Binary search uses the divide-and-conquer approach:

1. Start with the entire sorted array
2. Look at the middle element
3. If it matches the target, return it
4. If target is smaller, search the left half
5. If target is larger, search the right half
6. Repeat until found or array is exhausted

## Step-by-Step Example

Looking for 25 in [11, 12, 22, 25, 34, 64, 90]:

\`\`\`
Initial: [11, 12, 22, 25, 34, 64, 90]
         Left=0, Right=6, Mid=3, arr[3]=25
         
Found! Return 3
\`\`\`

## Implementation

### Iterative Approach
\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}
\`\`\`

### Recursive Approach
\`\`\`javascript
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1; // Not found
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}
\`\`\`

## Complexity Analysis

- **Time Complexity**: O(log n) - halves search space each iteration
- **Space Complexity**: 
  - Iterative: O(1)
  - Recursive: O(log n) for call stack
- **Requirement**: Array must be sorted!

## Real-World Applications

- Dictionary lookups
- Database indexing
- Auto-completion systems
- Version control systems
- Library card systems

## Practice Problem

Implement a function that finds the first position where a target value should be inserted in a sorted array to keep it sorted.`,
    category: 'DSA & Algorithms',
    tags: ['Binary Search', 'Searching', 'Algorithms', 'Intermediate'],
    keywords: 'binary search, search algorithm, logarithmic time, divide and conquer',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 312,
    readTime: '7 min',
  },
  {
    title: 'Dynamic Programming 101: Solve Problems with Memoization',
    slug: 'dynamic-programming-memoization',
    excerpt:
      'Learn dynamic programming concepts and memoization techniques to optimize recursive solutions dramatically.',
    content: `# Dynamic Programming 101: Solve Problems Efficiently

Dynamic Programming (DP) is a powerful technique for solving optimization problems by breaking them into simpler subproblems.

## Core Concepts

### What is Dynamic Programming?

DP is applicable when a problem:
1. Has overlapping subproblems (same calculations repeated)
2. Has optimal substructure (solution built from subproblem solutions)

### The Fibonacci Example

Standard recursive approach - SLOW:
\`\`\`javascript
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// fib(5) = 15 calculations! 
// fib(40) = MILLIONS of calculations
\`\`\`

## Technique 1: Memoization (Top-Down)

Cache results to avoid recalculation:

\`\`\`javascript
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n]; // Return cached result
  if (n <= 1) return n;
  
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// fib(40) now takes microseconds!
\`\`\`

## Technique 2: Tabulation (Bottom-Up)

Build solution iteratively:

\`\`\`javascript
function fibTab(n) {
  const dp = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}
\`\`\`

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Recursive | O(2ⁿ) | O(n) |
| Memoization | O(n) | O(n) |
| Tabulation | O(n) | O(n) |

## Classic DP Problems

1. **Coin Change**: Minimum coins for a value
2. **Longest Common Subsequence**: Find common sequence
3. **Knapsack Problem**: Maximize value with weight limit
4. **Edit Distance**: Transform one string to another
5. **House Robber**: Maximum non-adjacent values

## When to Use DP

✓ Optimization problems
✓ Overlapping subproblems
✓ Problems with multiple paths
✗ Problems without optimal substructure

Master DP with AlgoView's interactive tutorials!`,
    category: 'DSA & Algorithms',
    tags: ['Dynamic Programming', 'Optimization', 'Algorithms', 'Advanced'],
    keywords: 'dynamic programming, memoization, tabulation, optimization problem',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 156,
    readTime: '9 min',
  },
  {
    title: 'Mastering Arrays and Linked Lists: Core Data Structures',
    slug: 'arrays-linked-lists-data-structures',
    excerpt:
      'Comprehensive guide comparing arrays and linked lists. Understand when to use each data structure for optimal performance.',
    content: `# Arrays and Linked Lists: Choosing the Right Data Structure

Arrays and linked lists are fundamental data structures with different strengths and weaknesses.

## Arrays

### Definition
Contiguous memory locations storing elements of the same type.

### Advantages
✓ Fast access: O(1) time to access any element
✓ Cache-friendly: Sequential memory layout
✓ Simple implementation
✓ Minimal memory overhead

### Disadvantages
✗ Fixed size (in many languages)
✗ Slow insertion/deletion: O(n) in middle
✗ Wasted space if not full

### Code Example

\`\`\`javascript
const arr = [1, 2, 3, 4, 5];

// Access - O(1)
console.log(arr[2]); // 3

// Insertion - O(n)
arr.splice(2, 0, 99); // [1, 2, 99, 3, 4, 5]

// Deletion - O(n)
arr.splice(2, 1); // [1, 2, 3, 4, 5]
\`\`\`

## Linked Lists

### Definition
Nodes connected via pointers, with each node containing data and a reference to the next node.

### Advantages
✓ Dynamic size
✓ Fast insertion/deletion: O(1) if position known
✓ No memory waste
✓ Flexible structure

### Disadvantages
✗ Slow access: O(n) to reach an element
✗ Extra memory for pointers
✗ More complex implementation
✗ Cache-unfriendly

### Code Example

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
  
  insert(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
  }
  
  delete(data) {
    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      if (current.next.data === data) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }
}
\`\`\`

## Complexity Comparison

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access | O(1) | O(n) |
| Search | O(n) | O(n) |
| Insertion | O(n) | O(1)* |
| Deletion | O(n) | O(1)* |

*If position is known

## When to Use Each

### Use Arrays When:
- Need fast random access
- Data size is fixed and known
- Memory efficiency is critical
- Working with cache-sensitive code

### Use Linked Lists When:
- Frequent insertions/deletions
- Size varies significantly
- Don't need random access
- Memory allocation pattern is unknown

## Interview Tips

1. Understand trade-offs clearly
2. Know how to implement both
3. Practice implementing operations
4. Think about space vs time trade-off
5. Consider cache locality in discussions`,
    category: 'DSA & Algorithms',
    tags: ['Data Structures', 'Arrays', 'Linked Lists', 'Intermediate'],
    keywords: 'arrays, linked lists, data structures, comparison, when to use',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 278,
    readTime: '8 min',
  },
  {
    title: 'Graph Algorithms: BFS, DFS, and Dijkstra Explained',
    slug: 'graph-algorithms-bfs-dfs-dijkstra',
    excerpt:
      'Master essential graph traversal and shortest path algorithms. Complete with implementations and real-world applications.',
    content: `# Graph Algorithms: BFS, DFS, and Dijkstra

Graphs are everywhere in computer science. Learn the most important graph algorithms.

## What is a Graph?

A graph is a collection of nodes (vertices) connected by edges.

Types:
- **Directed**: Edges have direction
- **Undirected**: Edges have no direction
- **Weighted**: Edges have weights/costs
- **Unweighted**: All edges equal

## Breadth-First Search (BFS)

Explores level-by-level, perfect for finding shortest path in unweighted graphs.

\`\`\`javascript
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
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

**Time Complexity**: O(V + E)
**Space Complexity**: O(V)

## Depth-First Search (DFS)

Explores deeply before backtracking. Great for topological sorting and cycle detection.

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

**Time Complexity**: O(V + E)
**Space Complexity**: O(V) for recursion stack

## Dijkstra's Algorithm

Finds shortest path in weighted graphs with non-negative weights.

\`\`\`javascript
function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  
  // Initialize
  for (const node in graph) {
    distances[node] = node === start ? 0 : Infinity;
  }
  
  while (visited.size < Object.keys(graph).length) {
    // Find unvisited node with min distance
    let current = null;
    let minDist = Infinity;
    
    for (const node in distances) {
      if (!visited.has(node) && distances[node] < minDist) {
        current = node;
        minDist = distances[node];
      }
    }
    
    visited.add(current);
    
    // Update distances
    for (const [neighbor, weight] of graph[current]) {
      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
      }
    }
  }
  
  return distances;
}
\`\`\`

**Time Complexity**: O(V²) basic, O((V+E)logV) with heap
**Space Complexity**: O(V)

## Comparison

| Algorithm | Type | Use Case |
|-----------|------|----------|
| BFS | Traversal | Shortest path (unweighted) |
| DFS | Traversal | Cycle detection, topological sort |
| Dijkstra | Shortest Path | Weighted graphs, GPS navigation |

## Real-World Applications

- **BFS**: Social networks (find friends), maze solving
- **DFS**: Website crawling, topology sort
- **Dijkstra**: GPS/Maps, network routing

Use AlgoView to visualize these algorithms in action!`,
    category: 'DSA & Algorithms',
    tags: ['Graphs', 'Algorithms', 'BFS', 'DFS', 'Dijkstra'],
    keywords: 'graph algorithms, BFS, DFS, Dijkstra, shortest path, traversal',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 401,
    readTime: '11 min',
  },
  {
    title: 'JavaScript ES6 Features Every Developer Should Know',
    slug: 'javascript-es6-features-guide',
    excerpt:
      'Learn modern JavaScript features: arrow functions, destructuring, promises, async/await, and more. Essential for web development.',
    content: `# JavaScript ES6 Features: Modern Development Guide

ES6 (ECMAScript 2015) revolutionized JavaScript. Let's explore must-know features.

## Arrow Functions

Concise syntax for function expressions:

\`\`\`javascript
// Traditional
const add = function(a, b) {
  return a + b;
};

// Arrow function
const add = (a, b) => a + b;

// Implicit return with objects
const createUser = (name, age) => ({ name, age });
\`\`\`

## Destructuring

Extract values from objects and arrays:

\`\`\`javascript
// Object destructuring
const user = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age } = user;

// Array destructuring
const colors = ['red', 'green', 'blue'];
const [primary, secondary] = colors;

// Function parameters
const greet = ({ name, age }) => \`Hello \${name}, age \${age}\`;
\`\`\`

## Template Literals

String interpolation with backticks:

\`\`\`javascript
const name = 'Alice';
const age = 30;

// Old way
const message = 'Hello ' + name + ', age ' + age;

// ES6 way
const message = \`Hello \${name}, age \${age}\`;

// Multi-line strings
const poem = \`
  Roses are red,
  Violets are blue,
  ES6 is awesome
\`;
\`\`\`

## Let and Const

Block-scoped variables replacing var:

\`\`\`javascript
// var - function scoped (avoid!)
if (true) {
  var x = 1;
}
console.log(x); // 1 (leaked out!)

// let - block scoped
if (true) {
  let y = 1;
}
console.log(y); // ReferenceError

// const - block scoped, immutable reference
const z = 1;
z = 2; // Error
\`\`\`

## Classes

Object-oriented programming made easy:

\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(\`\${this.name} makes a sound\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} barks\`);
  }
}

const dog = new Dog('Rex');
dog.speak(); // Rex barks
\`\`\`

## Promises

Handle async operations:

\`\`\`javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data fetched!');
    }, 1000);
  });
};

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

## Async/Await

Cleaner async code:

\`\`\`javascript
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## Modules

Import/Export for code organization:

\`\`\`javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

export default class Calculator {
  // ...
}

// app.js
import Calculator, { add, subtract } from './math.js';

console.log(add(5, 3)); // 8
\`\`\`

## Spread Operator

Expand arrays and objects:

\`\`\`javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1,2,3,4,5]

// Objects
const user = { name: 'Alice', age: 30 };
const extended = { ...user, city: 'NYC' }; // {name, age, city}

// Function arguments
const numbers = [1, 2, 3];
Math.max(...numbers); // 3
\`\`\`

## Key Takeaways

1. Use const by default, let when reassignment needed
2. Arrow functions for most callbacks
3. Destructuring improves code readability
4. Always use async/await over .then() chains
5. Use classes for object-oriented code
6. Understand promises for async operations

Master ES6 and write cleaner, more maintainable code!`,
    category: 'Web Development',
    tags: ['JavaScript', 'ES6', 'Web Development', 'Beginner'],
    keywords: 'ES6, JavaScript, arrow functions, async/await, destructuring, modern JavaScript',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 523,
    readTime: '12 min',
  },
  {
    title: 'React Hooks Guide: useState, useEffect, and Custom Hooks',
    slug: 'react-hooks-complete-guide',
    excerpt:
      'Master React Hooks to write functional components with state and side effects. Includes custom hooks patterns.',
    content: `# React Hooks: Modern Functional Component Development

Hooks let you use state and other features in functional components. They're essential modern React.

## What Are Hooks?

Hooks are functions that let you "hook into" React features:
- State management
- Side effects
- Context
- Performance optimization

## useState Hook

Manage component state:

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

Multiple state variables:

\`\`\`javascript
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </div>
  );
}
\`\`\`

## useEffect Hook

Handle side effects (API calls, subscriptions, etc.):

\`\`\`javascript
import { useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  // Run on mount
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []); // Empty dependency array = run once
  
  return <div>{data}</div>;
}
\`\`\`

Dependency arrays:

\`\`\`javascript
// Run only once on mount
useEffect(() => { /* */ }, []);

// Run whenever dependencies change
useEffect(() => { /* */ }, [count, name]);

// Run after every render (use rarely!)
useEffect(() => { /* */ });

// Cleanup function for subscriptions
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);
  
  return () => clearInterval(timer); // Cleanup
}, []);
\`\`\`

## Creating Custom Hooks

Reusable logic for multiple components:

\`\`\`javascript
// useFetch.js
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function App() {
  const { data, loading, error } = useFetch('/api/users');
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return <div>{/* render data */}</div>;
}
\`\`\`

## Other Important Hooks

### useContext
Share state across components:

\`\`\`javascript
const ThemeContext = React.createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Component />
    </ThemeContext.Provider>
  );
}

function Component() {
  const theme = useContext(ThemeContext);
  return <div>Theme: {theme}</div>;
}
\`\`\`

### useReducer
Complex state logic:

\`\`\`javascript
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  function reducer(state, action) {
    switch(action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      case 'DECREMENT':
        return { count: state.count - 1 };
      default:
        return state;
    }
  }
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}
\`\`\`

## Hook Rules

1. Only call hooks at top level (not in loops/conditions)
2. Only call hooks from React functions
3. Use the ESLint plugin: eslint-plugin-react-hooks

## Best Practices

- ✓ Use multiple useState calls for independent state
- ✓ Custom hooks for reusable logic
- ✓ Dependency arrays for performance
- ✗ Don't forget cleanup functions
- ✗ Don't ignore lint warnings

Master hooks and write cleaner React code!`,
    category: 'Web Development',
    tags: ['React', 'Hooks', 'Web Development', 'Frontend'],
    keywords: 'React Hooks, useState, useEffect, custom hooks, functional components',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 456,
    readTime: '13 min',
  },
  {
    title: 'Time Complexity vs Space Complexity: Finding the Balance',
    slug: 'time-complexity-space-complexity-tradeoff',
    excerpt:
      'Understand the fundamental trade-off between time and space complexity. Learn optimization strategies for real-world programs.',
    content: `# Time vs Space Complexity: The Trade-Off

Every programmer must understand the fundamental tension between time and space efficiency.

## What is Time Complexity?

Time complexity measures how a program's runtime grows with input size.

\`\`\`javascript
// O(1) - Constant
function getFirst(arr) {
  return arr[0];
}

// O(n) - Linear
function findSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// O(n²) - Quadratic
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
\`\`\`

## What is Space Complexity?

Space complexity measures how additional memory usage grows with input size.

\`\`\`javascript
// O(1) - Constant space
function sum(arr) {
  let result = 0; // Only one variable
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
  }
  return result;
}

// O(n) - Linear space
function createArray(n) {
  const newArr = []; // Array grows with n
  for (let i = 0; i < n; i++) {
    newArr.push(i);
  }
  return newArr;
}

// O(n) - Recursion stack space
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Stack grows to depth n
}
\`\`\`

## The Trade-Off

### Example: Memoization

**Without Memoization (Fast Time, Low Space)**
\`\`\`javascript
// O(2^n) time, O(n) space
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
\`\`\`

**With Memoization (Fast Time, Medium Space)**
\`\`\`javascript
// O(n) time, O(n) space - MUCH BETTER
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}
\`\`\`

### Example: Sorting

**In-Place Bubble Sort (Low Space, Slow Time)**
\`\`\`javascript
// O(n²) time, O(1) space
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
\`\`\`

**Merge Sort (More Space, Much Faster)**
\`\`\`javascript
// O(n log n) time, O(n) space - BETTER OVERALL
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
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}
\`\`\`

## Decision Framework

### Choose Fast (Optimize Time)
- Interactive applications (UI/games)
- Real-time systems
- Large datasets being processed
- Performance-critical sections

### Choose Space-Efficient
- Embedded systems/IoT devices
- Memory-constrained environments
- Huge datasets that fit in time constraints
- Cloud computing (avoid high memory bills)

### Choose Balanced
- Most modern applications
- When both matter equally

## Real-World Example

For a web app with 1 million user queries:

**Option 1: Fast Time, More Space**
- Caching all results: 5ms response, 500GB memory

**Option 2: Slower Time, Less Space**  
- Computing on demand: 500ms response, 1GB memory

**Best Choice**: Usually Option 1 with reasonable caching limits!

## Key Insights

1. **Modern systems have cheap memory**: Time optimization often takes priority
2. **Context matters**: Embedded vs web vs AI has different needs
3. **Hybrid approaches work**: Use caching for hot data, compute others
4. **Profile before optimizing**: Don't guess which matters

## Interview Tips

- Always discuss both complexities
- Offer trade-off explanations
- Show you can optimize in both directions
- Understand the domain's priorities

Remember: "Premature optimization is the root of all evil" - Donald Knuth

Make conscious choices about this trade-off!`,
    category: 'DSA & Algorithms',
    tags: ['Complexity Analysis', 'Optimization', 'Time Complexity', 'Space Complexity'],
    keywords: 'time complexity, space complexity, trade-off, optimization, memoization',
    authorEmail: 'admin@algovieww.me',
    authorId: 'admin-user',
    status: 'published',
    views: 334,
    readTime: '10 min',
  },
]

const populateBlogs = async () => {
  try {
    console.log('📝 Starting to populate sample blogs...')

    const blogsRef = collection(db, 'blogs')
    let count = 0

    for (const blog of sampleBlogs) {
      const docData = {
        ...blog,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await addDoc(blogsRef, docData)
      count++
      console.log(`✅ Added blog ${count}/${sampleBlogs.length}: ${blog.title}`)
    }

    console.log(`\n✨ Successfully added ${count} sample blogs!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error populating blogs:', error)
    process.exit(1)
  }
}

populateBlogs()

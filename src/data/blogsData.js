// SEO-Optimized Blog Posts Data
// Status: 'published' (visible to all), 'draft' (pending admin approval), 'archived'

export const blogsData = [
  {
    id: 1,
    slug: 'bubble-sort-explained-animation',
    title: 'Bubble Sort Explained: Step-by-Step Animation & Code',
    exceprt: 'Learn bubble sort algorithm with interactive visualization. Understand time complexity, space complexity, and when to use bubble sort in real-world applications.',
    content: `
## Understanding Bubble Sort

Bubble sort is one of the simplest sorting algorithms and a great starting point for learning algorithmic thinking. Despite being less efficient than advanced algorithms, it's perfect for beginners and helps build foundational understanding.

### How Bubble Sort Works

Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process continues until the list is sorted.

**Key Characteristics:**
- **Time Complexity**: O(n²) worst/average case, O(n) best case
- **Space Complexity**: O(1) - in-place sorting
- **Stability**: Yes - maintains relative order of equal elements
- **In-Place**: Yes - doesn't require extra space

### Step-by-Step Process

1. Start from the first element
2. Compare it with the next element
3. If current > next, swap them
4. Move to the next pair
5. Repeat until no more swaps needed

### When to Use Bubble Sort

✅ **Good for:**
- Learning algorithms
- Small datasets (< 50 elements)
- Nearly sorted data
- Educational purposes

❌ **Avoid for:**
- Large datasets
- Performance-critical applications
- Real-time systems

### Example Code

\`\`\`javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// Output: [11, 12, 22, 25, 34, 64, 90]
\`\`\`

### Visualization

Try our interactive bubble sort visualizer to see exactly how the algorithm works in real-time!

**Want deeper learning?** Visit our [Sorting Algorithms Visualizer](/dsa/algorithms/sorting) to experiment with different array sizes and speeds.
    `,
    author: 'AlgoView Team',
    category: 'DSA',
    tags: ['sorting', 'bubble-sort', 'algorithms', 'beginner', 'visualization'],
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    readTime: '6 min',
    status: 'published',
    keywords: 'bubble sort, sorting algorithm, algorithm visualization, DSA, learn algorithms, bubble sort animation, O(n2)',
    relatedVisualizer: '/dsa/algorithms/sorting',
    views: 325
  },
  {
    id: 2,
    slug: 'graph-algorithms-dfs-vs-bfs',
    title: 'Graph Algorithms Explained: DFS vs BFS Visualization',
    exceprt: 'Master Depth-First Search and Breadth-First Search. Understand when to use each, implementation details, and real-world applications of graph traversal.',
    content: `
## Graph Traversal: DFS vs BFS

Graph traversal is fundamental to computer science. Both DFS and BFS are essential algorithms for exploring graph structures, but they work differently and have different use cases.

### Depth-First Search (DFS)

DFS explores a graph by going as deep as possible along each branch before backtracking.

**Characteristics:**
- **Time Complexity**: O(V + E) where V = vertices, E = edges
- **Space Complexity**: O(V) for recursion stack
- **Uses**: Stack (LIFO) - naturally recursive
- **Applications**: Topological sorting, cycle detection, path finding

**Code Example:**
\`\`\`javascript
function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  console.log(node);
  
  for (let neighbor of graph[node]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  return visited;
}
\`\`\`

### Breadth-First Search (BFS)

BFS explores a graph level by level, visiting all neighbors before going deeper.

**Characteristics:**
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V) for queue
- **Uses**: Queue (FIFO) - iterative approach
- **Applications**: Shortest path (unweighted), level-order traversal, peer-to-peer networks

**Code Example:**
\`\`\`javascript
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
\`\`\`

### DFS vs BFS Comparison

| Aspect | DFS | BFS |
|--------|-----|-----|
| Data Structure | Stack | Queue |
| Memory | Less (for sparse graphs) | More (stores entire level) |
| Shortest Path | ❌ No | ✅ Yes (unweighted) |
| Cycle Detection | ✅ Yes | ✅ Yes |
| Speed | Depends on structure | Systematic |
| Real-World | Backtracking, puzzles | Networks, maps |

### Interactive Visualization

See both algorithms in action with our [Graph Algorithms Visualizer](/dsa/algorithms/graph). Watch how they explore the same graph differently!

### Practice Problems

- Find shortest path in unweighted graph → Use BFS
- Detect cycle in directed graph → Use DFS
- Topological sort → Use DFS
- Level-order traversal → Use BFS
    `,
    author: 'AlgoView Team',
    category: 'DSA',
    tags: ['graphs', 'dfs', 'bfs', 'algorithms', 'traversal'],
    createdAt: '2026-03-18',
    updatedAt: '2026-03-18',
    readTime: '8 min',
    status: 'published',
    keywords: 'DFS, BFS, graph algorithms, depth-first search, breadth-first search, algorithm visualization, graph traversal',
    relatedVisualizer: '/dsa/algorithms/graph',
    views: 412
  },
  {
    id: 3,
    slug: 'dynamic-programming-for-beginners',
    title: 'Dynamic Programming for Beginners: From Recursion to DP',
    exceprt: 'Learn dynamic programming fundamentals. Understand memoization and tabulation with real examples you can actually understand.',
    content: `
## Dynamic Programming Explained Simply

Dynamic programming seems scary, but it's just smart problem-solving. Instead of solving the same subproblem repeatedly, you solve it once and remember the answer.

### The Core Idea

**DP = Recursion + Memory**

When your recursive solution recalculates the same values many times, you have optimal substructure - perfect for DP!

### Classic Example: Fibonacci

**Without DP (Recursive - Slow):**
\`\`\`javascript
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);  // Calculates fib(5) many times!
}

fib(6);  // Makes 25 function calls!
\`\`\`

**With DP (Memoization - Fast):**
\`\`\`javascript
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

fib(6);  // Makes only 13 function calls!
\`\`\`

### Two DP Approaches

#### 1. Memoization (Top-Down)
- Start with the problem
- Break into subproblems
- Cache results
- More intuitive
- Natural recursion

#### 2. Tabulation (Bottom-Up)
- Start with base cases
- Build up to solution
- Fill table iteratively
- No recursion overhead
- Better space optimization

**Tabulation Example:**
\`\`\`javascript
function fib(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
\`\`\`

### Real-World Problems

✅ **Coin Change** - Find minimum coins for amount
✅ **0/1 Knapsack** - Maximum value in weight constraint  
✅ **Longest Common Subsequence** - String matching
✅ **Edit Distance** - Text similarity
✅ **House Robber** - Maximum non-adjacent sum

### Practice with AlgoView

Try solving these DP problems in our [Interactive Problem Solver](/dsa/problems). Start with "Fibonacci" and work your way up to advanced problems!

### Key Lesson

Every time you see:
- "Find maximum/minimum"
- "Count ways to do X"
- "Make optimal decision"
- "Overlapping subproblems"

→ Think DP!
    `,
    author: 'AlgoView Team',
    category: 'DSA',
    tags: ['dynamic-programming', 'dp', 'algorithms', 'recursion', 'optimization'],
    createdAt: '2026-03-20',
    updatedAt: '2026-03-20',
    readTime: '10 min',
    status: 'published',
    keywords: 'dynamic programming, memoization, tabulation, algorithm optimization, DP practice, learn DP',
    relatedVisualizer: '/dsa/problems',
    views: 578
  },
  {
    id: 4,
    slug: 'react-hooks-complete-guide',
    title: 'React Hooks Complete Guide: From useState to Custom Hooks',
    exceprt: 'Master React Hooks with real examples. Learn useState, useEffect, useContext, and how to create your own custom hooks.',
    content: `
## React Hooks: A Complete Guide

React Hooks revolutionized how we write React components. No more confusing class lifecycle methods - just simple, functional components.

### What Are Hooks?

Hooks are functions that let you "hook into" React features:
- State management
- Side effects
- Context
- Reducers
- Refs

**Rule 1**: Only call hooks at the top level (not in loops or conditions)
**Rule 2**: Only call hooks from React components or custom hooks

### useState - Managing Component State

The most common hook. It lets functional components have state.

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

**Key Points:**
- Initial value: \`useState(0)\`
- Returns array: \`[state, setterFunction]\`
- Setter can take value or function
- Each call creates independent state

### useEffect - Side Effects

Handle side effects like API calls, subscriptions, or DOM manipulation.

\`\`\`javascript
useEffect(() => {
  // This runs AFTER every render
  console.log('Component rendered');
}, []); // Empty dependency array = run once

useEffect(() => {
  // Runs when count changes
  document.title = \`Count: \${count}\`;
}, [count]); // Dependency array

// Cleanup function
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  return () => clearInterval(timer); // Cleanup
}, []);
\`\`\`

### useContext - Global State

Share data without prop drilling.

\`\`\`javascript
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Main />
      <Footer />
    </ThemeContext.Provider>
  );
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>;
}
\`\`\`

### Custom Hooks - Reusable Logic

Extract component logic into reusable functions.

\`\`\`javascript
// useFirebaseUser - Custom hook
function useFirebaseUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  return { user, loading };
}

// Usage in any component
function Dashboard() {
  const { user, loading } = useFirebaseUser();
  if (loading) return <Loader />;
  return <h1>Welcome, {user.name}</h1>;
}
\`\`\`

### Common Hooks Summary

| Hook | Purpose | Example |
|------|---------|---------|
| useState | Manage state | count, setCount |
| useEffect | Side effects | Fetch data, subscriptions |
| useContext | Global state | Theme, Auth |
| useReducer | Complex state | Redux-like logic |
| useCallback | Memoize functions | Prevent child re-renders |
| useMemo | Memoize values | Expensive computations |
| useRef | DOM access | Focus input, timer ID |

### Best Practices

✅ Custom hooks start with "use" prefix
✅ Extract login into hooks for reusability
✅ Use useCallback when passing functions to children
✅ Use useMemo for expensive computations
❌ Don't conditionally call hooks
❌ Don't call hooks from regular functions

### Practice Building

Build interactive components using hooks in our [Development Section](/development/tutorials). Create a todo app, weather app, or build your own project!
    `,
    author: 'AlgoView Team',
    category: 'Web Development',
    tags: ['react', 'hooks', 'javascript', 'frontend', 'react-hooks'],
    createdAt: '2026-03-22',
    updatedAt: '2026-03-22',
    readTime: '12 min',
    status: 'published',
    keywords: 'React hooks, useState, useEffect, useContext, custom hooks, React tutorial, learn React',
    relatedVisualizer: '/development/tutorials',
    views: 689
  },
  {
    id: 5,
    slug: 'javascript-promises-async-await',
    title: 'JavaScript Promises and Async/Await: Mastering Asynchronous Code',
    exceprt: 'Understand promises, async/await, and how to handle asynchronous operations properly. Stop callback hell forever.',
    content: `
## Asynchronous JavaScript Explained

JavaScript is single-threaded but can handle asynchronous operations. This guide takes you from callbacks through promises to async/await.

### The Problem: Callback Hell

\`\`\`javascript
// Callback hell - Hard to read and maintain
loadUser(userId, function(user) {
  loadPosts(user.id, function(posts) {
    loadComments(posts[0].id, function(comments) {
      console.log(comments); // Finally!
    });
  });
});
\`\`\`

### Solution 1: Promises

A promise represents a value that may not be available yet but will be at some point.

\`\`\`javascript
// Promise creation
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

// Promise consumption
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));
\`\`\`

**Promise States:**
- 🟡 **Pending**: Initial state, operation hasn't finished
- 🟢 **Resolved**: Operation completed successfully
- 🔴 **Rejected**: Operation failed

### Solution 2: Async/Await (Modern!)

Syntactic sugar over promises - makes async code look synchronous.

\`\`\`javascript
async function loadUserData(userId) {
  try {
    const user = await loadUser(userId);
    const posts = await loadPosts(user.id);
    const comments = await loadComments(posts[0].id);
    console.log(comments); // Clean!
    return comments;
  } catch (error) {
    console.error('Failed to load:', error);
  }
}
\`\`\`

### Parallel vs Sequential

**Sequential (Slower - Wait for each):**
\`\`\`javascript
const user = await fetchUser();      // Wait 1s
const posts = await fetchPosts();    // Wait 1s
// Total: 2s
\`\`\`

**Parallel (Faster - Do together):**
\`\`\`javascript
const [user, posts] = await Promise.all([
  fetchUser(),     // Start now
  fetchPosts()     // Start now
]);
// Total: 1s
\`\`\`

### Real-World Example

\`\`\`javascript
async function algorithm(n) {
  try {
    // Fetch algorithm data
    const response = await fetch(\`/api/algorithm/\${n}\`);
    const data = await response.json();
    
    // Animation simulation
    await animate(data);
    
    // Save user progress
    await saveProgress(n);
    
    return { success: true, data };
  } catch (error) {
    console.error('Algorithm failed:', error);
    return { success: false, error };
  }
}
\`\`\`

### Promise Methods

- **Promise.all()** - Wait for all, fail if any fails
- **Promise.race()** - First one wins
- **Promise.allSettled()** - Wait for all (don't fail)
- **Promise.any()** - First success wins

### Tips & Tricks

✅ Use async/await for cleaner code
✅ Always use try/catch with async/await
✅ Use Promise.all() for parallel operations
✅ Avoid mixing promises and async/await
❌ Never forget await on async functions
❌ Don't create unnecessary promises

### Practice

Build a project that fetches data from APIs. Try our [Development Tutorials](/development/tutorials) with real API interactions!
    `,
    author: 'AlgoView Team',
    category: 'Web Development',
    tags: ['javascript', 'async', 'promises', 'async-await', 'frontend'],
    createdAt: '2026-03-24',
    updatedAt: '2026-03-24',
    readTime: '11 min',
    status: 'published',
    keywords: 'JavaScript promises, async await, asynchronous programming, JavaScript tutorial, callbacks, fetch API',
    relatedVisualizer: '/development/tutorials',
    views: 524
  }
];

// Helper functions
export function getBlogBySlug(slug) {
  return blogsData.find(blog => blog.slug === slug);
}

export function getPublishedBlogs() {
  return blogsData.filter(blog => blog.status === 'published').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getBlogsByCategory(category) {
  return blogsData.filter(blog => blog.status === 'published' && blog.category === category);
}

export function getBlogsByTag(tag) {
  return blogsData.filter(blog => blog.status === 'published' && blog.tags.includes(tag));
}

export function searchBlogs(query) {
  const lower = query.toLowerCase();
  return blogsData.filter(blog => 
    blog.status === 'published' && (
      blog.title.toLowerCase().includes(lower) ||
      blog.exceprt.toLowerCase().includes(lower) ||
      blog.content.toLowerCase().includes(lower) ||
      blog.tags.some(tag => tag.toLowerCase().includes(lower))
    )
  );
}

// Sample data for Phase 1 MVP
// This file contains initial data to populate Firestore collections

export const sampleTutorials = [
  {
    title: "Array Fundamentals - Complete Guide",
    description: "Learn everything about arrays from basics to advanced techniques. Covers array operations, manipulation, and best practices.",
    category: "DSA",
    difficulty: "Beginner",
    duration: 15,
    author: "AlgoView Team",
    tags: ["arrays", "basics", "data-structures"],
    content: `
      <h2>Arrays: The Foundation of Data Structures</h2>
      <p>Arrays are the most fundamental data structure in computer science...</p>
      <h3>Key Topics:</h3>
      <ul>
        <li>Array Declaration and Initialization</li>
        <li>Accessing Elements</li>
        <li>Array Operations (Insert, Delete, Update)</li>
        <li>Time Complexity Analysis</li>
        <li>Common Array Problems</li>
      </ul>
    `,
    rating: 4.8,
    ratingCount: 245,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Arrays"
  },
  {
    title: "Sorting Algorithms Explained",
    description: "Master all major sorting algorithms: Bubble Sort, Quick Sort, Merge Sort, Heap Sort with visual explanations.",
    category: "DSA",
    difficulty: "Intermediate",
    duration: 25,
    author: "AlgoView Team",
    tags: ["sorting", "algorithms", "complexity"],
    content: `<h2>Sorting Algorithms</h2><p>Comprehensive guide to sorting...</p>`,
    rating: 4.7,
    ratingCount: 189,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Sorting"
  },
  {
    title: "Binary Search - Master the Technique",
    description: "Deep dive into binary search, its variants, and problem-solving approach for search-based problems.",
    category: "DSA",
    difficulty: "Beginner",
    duration: 12,
    author: "AlgoView Team",
    tags: ["searching", "binary-search", "optimization"],
    content: `<h2>Binary Search</h2><p>One of the most important searching techniques...</p>`,
    rating: 4.9,
    ratingCount: 312,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Binary+Search"
  },
  {
    title: "Linked Lists Complete Tutorial",
    description: "Learn singly, doubly, and circular linked lists. Includes implementation and common operations.",
    category: "DSA",
    difficulty: "Intermediate",
    duration: 20,
    author: "AlgoView Team",
    tags: ["linked-lists", "data-structures", "pointers"],
    content: `<h2>Linked Lists</h2><p>A comprehensive guide to linked list data structures...</p>`,
    rating: 4.6,
    ratingCount: 167,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Linked+Lists"
  },
  {
    title: "Stack & Queue - Essential Data Structures",
    description: "Understand stacks and queues, their applications, and how to implement them efficiently.",
    category: "DSA",
    difficulty: "Beginner",
    duration: 18,
    author: "AlgoView Team",
    tags: ["stack", "queue", "data-structures"],
    content: `<h2>Stack & Queue</h2><p>Understanding LIFO and FIFO data structures...</p>`,
    rating: 4.7,
    ratingCount: 198,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Stack+Queue"
  },
  {
    title: "Hash Tables & Hashing",
    description: "Master hash tables, collision handling, and hashing techniques for efficient data retrieval.",
    category: "DSA",
    difficulty: "Intermediate",
    duration: 22,
    author: "AlgoView Team",
    tags: ["hash-tables", "hashing", "optimization"],
    content: `<h2>Hash Tables</h2><p>Efficient data structures for fast lookups...</p>`,
    rating: 4.8,
    ratingCount: 143,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Hash+Tables"
  },
  {
    title: "Trees - Binary Trees & BST",
    description: "Learn binary trees, binary search trees, tree traversals, and common tree problems.",
    category: "DSA",
    difficulty: "Intermediate",
    duration: 28,
    author: "AlgoView Team",
    tags: ["trees", "binary-trees", "bst"],
    content: `<h2>Binary Trees</h2><p>Hierarchical data structures and their applications...</p>`,
    rating: 4.9,
    ratingCount: 287,
    isPremium: true,
    imageUrl: "https://via.placeholder.com/300x200?text=Binary+Trees"
  },
  {
    title: "Graphs - DFS & BFS",
    description: "Complete guide to graph algorithms including DFS, BFS, and practical applications.",
    category: "DSA",
    difficulty: "Advanced",
    duration: 32,
    author: "AlgoView Team",
    tags: ["graphs", "dfs", "bfs", "traversal"],
    content: `<h2>Graph Algorithms</h2><p>Exploring graph data structures and traversal methods...</p>`,
    rating: 4.8,
    ratingCount: 156,
    isPremium: true,
    imageUrl: "https://via.placeholder.com/300x200?text=Graphs"
  },
  {
    title: "Dynamic Programming Fundamentals",
    description: "Introduction to DP, memoization, tabulation, and solving classic DP problems.",
    category: "DSA",
    difficulty: "Advanced",
    duration: 35,
    author: "AlgoView Team",
    tags: ["dynamic-programming", "optimization", "advanced"],
    content: `<h2>Dynamic Programming</h2><p>Solving complex problems efficiently...</p>`,
    rating: 4.7,
    ratingCount: 203,
    isPremium: true,
    imageUrl: "https://via.placeholder.com/300x200?text=Dynamic+Programming"
  },
  {
    title: "JavaScript ES6+ Features",
    description: "Modern JavaScript features: arrow functions, destructuring, promises, async/await.",
    category: "Web",
    difficulty: "Beginner",
    duration: 20,
    author: "AlgoView Team",
    tags: ["javascript", "es6", "web-dev"],
    content: `<h2>Modern JavaScript</h2><p>Master modern JavaScript features...</p>`,
    rating: 4.8,
    ratingCount: 267,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=JavaScript"
  }
];

export const sampleCodeExamples = [
  {
    title: "Binary Search Implementation",
    description: "Clean implementation of binary search algorithm",
    code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}`,
    language: "javascript",
    complexity: "O(log n)",
    tags: ["searching", "binary-search"],
    copies: 145,
    rating: 4.9
  },
  {
    title: "Merge Sort Implementation",
    description: "Efficient merge sort with divide and conquer",
    code: `function mergeSort(arr) {
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
}`,
    language: "javascript",
    complexity: "O(n log n)",
    tags: ["sorting", "algorithms"],
    copies: 198,
    rating: 4.8
  },
  {
    title: "Quick Sort in Python",
    description: "Quick sort implementation with excellent average performance",
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)`,
    language: "python",
    complexity: "O(n log n) avg, O(n²) worst",
    tags: ["sorting", "divide-and-conquer"],
    copies: 167,
    rating: 4.7
  },
  {
    title: "Hash Table Implementation",
    description: "Simple hash table with collision handling",
    code: `class HashTable {
  constructor(size = 50) {
    this.table = new Array(size);
    this.size = size;
  }
  
  hash(key) {
    let hashValue = 0;
    for (let i = 0; i < key.length; i++) {
      hashValue += key.charCodeAt(i);
    }
    return hashValue % this.size;
  }
  
  set(key, value) {
    const index = this.hash(key);
    if (this.table[index] === undefined) {
      this.table[index] = {};
    }
    this.table[index][key] = value;
  }
  
  get(key) {
    const index = this.hash(key);
    return this.table[index]?.[key];
  }
}`,
    language: "javascript",
    complexity: "O(1) avg",
    tags: ["hash-table", "data-structures"],
    copies: 123,
    rating: 4.6
  },
  {
    title: "Fibonacci Dynamic Programming",
    description: "DP solution for Fibonacci with memoization",
    code: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// Tabulation approach
function fibonacciTab(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
    language: "javascript",
    complexity: "O(n)",
    tags: ["dynamic-programming", "recursion"],
    copies: 234,
    rating: 4.9
  }
];

export const sampleVideoCourses = [
  {
    title: "Data Structures & Algorithms Complete Course",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=example1",
    thumbnail: "https://via.placeholder.com/300x170?text=DSA+Course",
    duration: "15 hours",
    category: "DSA",
    author: "freeCodeCamp",
    rating: 4.9,
    isPremium: false
  },
  {
    title: "JavaScript Advanced Concepts",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=example2",
    thumbnail: "https://via.placeholder.com/300x170?text=JS+Advanced",
    duration: "8 hours",
    category: "Web",
    author: "Web Dev Simplified",
    rating: 4.8,
    isPremium: false
  },
  {
    title: "Leetcode Problem Solving Masterclass",
    platform: "Udemy",
    url: "https://www.udemy.com/example3",
    thumbnail: "https://via.placeholder.com/300x170?text=Leetcode",
    duration: "12 hours",
    category: "DSA",
    author: "Coding Interview Expert",
    rating: 4.7,
    isPremium: false
  },
  {
    title: "React JS Complete Guide 2024",
    platform: "Udemy",
    url: "https://www.udemy.com/example4",
    thumbnail: "https://via.placeholder.com/300x170?text=React+2024",
    duration: "50 hours",
    category: "Web",
    author: "Acadmind",
    rating: 4.9,
    isPremium: false
  },
  {
    title: "System Design Interview Preparation",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=example5",
    thumbnail: "https://via.placeholder.com/300x170?text=System+Design",
    duration: "10 hours",
    category: "DevOps",
    author: "TechLead",
    rating: 4.6,
    isPremium: true
  }
];

export const sampleDocs = [
  {
    title: "MDN Web Docs - JavaScript",
    category: "JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    description: "Official Mozilla documentation for JavaScript",
    type: "official",
    rating: 4.9,
    isPremium: false
  },
  {
    title: "React Official Documentation",
    category: "React",
    url: "https://react.dev",
    description: "React's official documentation and guides",
    type: "official",
    rating: 4.9,
    isPremium: false
  },
  {
    title: "Node.js Documentation",
    category: "Node.js",
    url: "https://nodejs.org/docs/",
    description: "Complete Node.js API documentation",
    type: "official",
    rating: 4.8,
    isPremium: false
  },
  {
    title: "Python Official Documentation",
    category: "Python",
    url: "https://docs.python.org/3/",
    description: "Python 3 official documentation",
    type: "official",
    rating: 4.9,
    isPremium: false
  },
  {
    title: "Firebase Documentation",
    category: "Firebase",
    url: "https://firebase.google.com/docs",
    description: "Firebase platform documentation",
    type: "official",
    rating: 4.7,
    isPremium: false
  }
];

export const sampleCommunity = [
  {
    platform: "Discord",
    name: "AlgoView Community",
    url: "https://discord.gg/algoview",
    members: 5234,
    description: "Official AlgoView community server for discussions and help"
  },
  {
    platform: "Telegram",
    name: "AlgoView DSA Group",
    url: "https://t.me/algoviewdsa",
    members: 8956,
    description: "Telegram group for quick tips and problem discussions"
  },
  {
    platform: "Reddit",
    name: "r/AlgoView",
    url: "https://reddit.com/r/algoview",
    members: 12500,
    description: "Reddit community for sharing resources and asking questions"
  },
  {
    platform: "GitHub",
    name: "AlgoView Repository",
    url: "https://github.com/algoview",
    members: 3400,
    description: "Open source code and solutions on GitHub"
  }
];

export const sampleQA = [
  {
    question: "What is the difference between DFS and BFS?",
    description: "I'm confused about when to use DFS vs BFS. Can someone explain the key differences?",
    category: "Graphs",
    answers: [
      {
        text: "DFS uses a stack (or recursion) and explores as far as possible along each branch, while BFS uses a queue and explores level by level...",
        author: "Expert User",
        votes: 245
      }
    ],
    views: 3421,
    votes: 456,
    isPremium: false,
    difficulty: "Intermediate"
  },
  {
    question: "How to approach dynamic programming problems?",
    description: "I struggle with identifying DP problems. What's the systematic approach?",
    category: "Dynamic Programming",
    answers: [
      {
        text: "The key is to identify overlapping subproblems and optimal substructure...",
        author: "DP Master",
        votes: 312
      }
    ],
    views: 5678,
    votes: 678,
    isPremium: false,
    difficulty: "Advanced"
  },
  {
    question: "Best way to learn React hooks?",
    description: "I'm new to React. Should I learn class components first or go straight to hooks?",
    category: "React",
    answers: [
      {
        text: "Modern React recommends learning hooks first as they are the current standard...",
        author: "React Dev",
        votes: 189
      }
    ],
    views: 2345,
    votes: 289,
    isPremium: false,
    difficulty: "Beginner"
  }
];

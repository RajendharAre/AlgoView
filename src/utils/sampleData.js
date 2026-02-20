// Sample data for Phase 1 MVP
// This file contains initial data to populate Firestore collections

export const sampleTutorials = [
  {
    title: "React Hooks - Complete Guide",
    description: "Learn useState, useEffect, useContext, useRef and custom hooks with practical examples for modern React development.",
    category: "Web",
    difficulty: "Beginner",
    duration: 20,
    author: "AlgoView Team",
    tags: ["react", "hooks", "frontend"],
    content: `<h2>React Hooks</h2><p>Master modern React development with hooks...</p>`,
    rating: 4.9,
    ratingCount: 312,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=React+Hooks"
  },
  {
    title: "Node.js REST API Development",
    description: "Build production-ready REST APIs with Node.js, Express, and MongoDB. Covers authentication, validation, and deployment.",
    category: "Web",
    difficulty: "Intermediate",
    duration: 30,
    author: "AlgoView Team",
    tags: ["nodejs", "express", "api", "backend"],
    content: `<h2>REST API with Node.js</h2><p>Build robust APIs with Express...</p>`,
    rating: 4.8,
    ratingCount: 245,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Node.js+API"
  },
  {
    title: "CSS Grid & Flexbox Mastery",
    description: "Master modern CSS layout techniques with Grid and Flexbox. Build responsive layouts for any screen size.",
    category: "Web",
    difficulty: "Beginner",
    duration: 18,
    author: "AlgoView Team",
    tags: ["css", "grid", "flexbox", "responsive"],
    content: `<h2>CSS Grid & Flexbox</h2><p>Modern layout techniques...</p>`,
    rating: 4.7,
    ratingCount: 198,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=CSS+Layout"
  },
  {
    title: "TypeScript for React Developers",
    description: "Add type safety to your React projects with TypeScript. Covers generics, interfaces, and advanced patterns.",
    category: "Web",
    difficulty: "Intermediate",
    duration: 25,
    author: "AlgoView Team",
    tags: ["typescript", "react", "types"],
    content: `<h2>TypeScript with React</h2><p>Type-safe React development...</p>`,
    rating: 4.8,
    ratingCount: 189,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=TypeScript"
  },
  {
    title: "Docker & Containerization",
    description: "Learn Docker from scratch. Build, ship, and run applications in containers with Docker Compose and best practices.",
    category: "DevOps",
    difficulty: "Intermediate",
    duration: 28,
    author: "AlgoView Team",
    tags: ["docker", "containers", "devops"],
    content: `<h2>Docker Essentials</h2><p>Containerize your applications...</p>`,
    rating: 4.6,
    ratingCount: 167,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Docker"
  },
  {
    title: "Next.js Full-Stack Development",
    description: "Build full-stack web applications with Next.js 14. Server components, API routes, and deployment strategies.",
    category: "Web",
    difficulty: "Advanced",
    duration: 35,
    author: "AlgoView Team",
    tags: ["nextjs", "react", "fullstack", "ssr"],
    content: `<h2>Next.js Full-Stack</h2><p>Modern full-stack development...</p>`,
    rating: 4.9,
    ratingCount: 287,
    isPremium: true,
    imageUrl: "https://via.placeholder.com/300x200?text=Next.js"
  },
  {
    title: "Tailwind CSS Advanced Techniques",
    description: "Go beyond basics with Tailwind CSS. Custom plugins, design systems, dark mode, and animation patterns.",
    category: "Web",
    difficulty: "Beginner",
    duration: 15,
    author: "AlgoView Team",
    tags: ["tailwind", "css", "design-system"],
    content: `<h2>Tailwind CSS Advanced</h2><p>Master utility-first CSS...</p>`,
    rating: 4.8,
    ratingCount: 143,
    isPremium: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Tailwind+CSS"
  },
  {
    title: "CI/CD Pipeline with GitHub Actions",
    description: "Automate testing, building, and deployment with GitHub Actions. Covers workflows, secrets, and deployment strategies.",
    category: "DevOps",
    difficulty: "Advanced",
    duration: 32,
    author: "AlgoView Team",
    tags: ["ci-cd", "github-actions", "automation"],
    content: `<h2>CI/CD with GitHub Actions</h2><p>Automate your deployment pipeline...</p>`,
    rating: 4.7,
    ratingCount: 156,
    isPremium: true,
    imageUrl: "https://via.placeholder.com/300x200?text=CI+CD"
  },
  {
    title: "MongoDB & Mongoose Complete Guide",
    description: "Learn MongoDB with Mongoose ODM. Schema design, queries, aggregation pipeline, and performance optimization.",
    category: "Web",
    difficulty: "Intermediate",
    duration: 22,
    author: "AlgoView Team",
    tags: ["mongodb", "mongoose", "database", "backend"],
    content: `<h2>MongoDB & Mongoose</h2><p>Master NoSQL database development...</p>`,
    rating: 4.8,
    ratingCount: 203,
    isPremium: true,
    imageUrl: "https://via.placeholder.com/300x200?text=MongoDB"
  },
  {
    title: "AWS Cloud Deployment Guide",
    description: "Deploy web applications on AWS. EC2, S3, Lambda, CloudFront, and infrastructure as code with Terraform.",
    category: "Cloud",
    difficulty: "Advanced",
    duration: 40,
    author: "AlgoView Team",
    tags: ["aws", "cloud", "deployment", "terraform"],
    content: `<h2>AWS Deployment</h2><p>Cloud infrastructure for developers...</p>`,
    rating: 4.7,
    ratingCount: 267,
    isPremium: true,
    imageUrl: "https://via.placeholder.com/300x200?text=AWS+Cloud"
  }
];

export const sampleCodeExamples = [
  {
    title: "React Custom Hook - useLocalStorage",
    description: "Reusable custom hook for persisting state in localStorage",
    code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["react", "hooks", "localStorage"],
    copies: 287,
    rating: 4.9
  },
  {
    title: "Express.js REST API with CRUD",
    description: "Complete REST API boilerplate with Express and error handling",
    code: `const express = require('express');
const router = express.Router();

// GET all items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create item
router.post('/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;`,
    language: "javascript",
    complexity: "O(n)",
    tags: ["express", "api", "rest", "backend"],
    copies: 198,
    rating: 4.8
  },
  {
    title: "Python Flask API with JWT Auth",
    description: "Secure Flask API endpoint with JWT token authentication",
    code: `from flask import Flask, request, jsonify
from functools import wraps
import jwt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/protected')
@token_required
def protected():
    return jsonify({'message': 'Access granted'})`,
    language: "python",
    complexity: "O(1)",
    tags: ["flask", "jwt", "authentication", "python"],
    copies: 167,
    rating: 4.7
  },
  {
    title: "React useReducer State Pattern",
    description: "Complex state management with useReducer and TypeScript-style actions",
    code: `import { useReducer } from 'react';

const initialState = { items: [], loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    default:
      return state;
  }
}

function useItemManager() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}

export default useItemManager;`,
    language: "javascript",
    complexity: "O(n)",
    tags: ["react", "useReducer", "state-management"],
    copies: 234,
    rating: 4.9
  },
  {
    title: "Go HTTP Server with Middleware",
    description: "Production-ready Go HTTP server with logging and CORS middleware",
    code: `package main

import (
  "fmt"
  "log"
  "net/http"
  "time"
)

func loggingMiddleware(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    start := time.Now()
    next.ServeHTTP(w, r)
    log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
  })
}

func corsMiddleware(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    next.ServeHTTP(w, r)
  })
}

func main() {
  mux := http.NewServeMux()
  mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "OK")
  })
  handler := loggingMiddleware(corsMiddleware(mux))
  log.Fatal(http.ListenAndServe(":8080", handler))
}`,
    language: "go",
    complexity: "O(1)",
    tags: ["go", "http", "middleware", "backend"],
    copies: 145,
    rating: 4.6
  },
  {
    title: "Two Pointers Algorithm - Remove Duplicates",
    description: "Interview classic: Remove duplicates from sorted array in-place",
    code: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  
  let left = 0;  // pointer for unique elements
  
  for (let right = 1; right < nums.length; right++) {
    if (nums[right] !== nums[left]) {
      left++;
      nums[left] = nums[right];
    }
  }
  
  return left + 1;  // length of array with unique elements
}

// Time: O(n), Space: O(1)
const arr = [1, 1, 2, 2, 3, 4, 4, 5];
console.log(removeDuplicates(arr));  // Output: 5`,
    language: "javascript",
    complexity: "O(n)",
    tags: ["algorithms", "two-pointers", "interview"],
    copies: 412,
    rating: 4.8
  },
  {
    title: "Binary Search Implementation",
    description: "Efficient searching in sorted arrays - fundamental interview question",
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;  // Found
    } else if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1;  // Search left half
    }
  }
  
  return -1;  // Not found
}

// Time: O(log n), Space: O(1)
const sorted = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(sorted, 7));  // Output: 3`,
    language: "javascript",
    complexity: "O(log n)",
    tags: ["algorithms", "binary-search", "interview"],
    copies: 356,
    rating: 4.9
  },
  {
    title: "LRU Cache Implementation - System Design",
    description: "Least Recently Used Cache with O(1) get and set operations",
    code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);  // Mark as recently used
    return value;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size === this.capacity) {
      const LRUkey = this.cache.keys().next().value;
      this.cache.delete(LRUkey);  // Remove least recently used
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.set(1, 'a');
lru.set(2, 'b');
console.log(lru.get(1));  // 'a'`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["system-design", "cache", "data-structures"],
    copies: 298,
    rating: 4.9
  },
  {
    title: "Rate Limiter - System Design Pattern",
    description: "Token bucket rate limiting for API endpoints - production pattern",
    code: `class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  isAllowed(clientId) {
    const now = Date.now();
    const clientWindow = this.requests.get(clientId) || [];
    
    // Remove old requests outside window
    const validRequests = clientWindow.filter(
      time => now - time < this.windowMs
    );
    
    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      this.requests.set(clientId, validRequests);
      return true;
    }
    return false;
  }
}

const limiter = new RateLimiter(5, 60000);  // 5 requests per minute
console.log(limiter.isAllowed('user1'));  // true`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["system-design", "rate-limiting", "nodejs"],
    copies: 234,
    rating: 4.8
  },
  {
    title: "Database Connection Pool - Node.js",
    description: "Efficient database connection pooling for production applications",
    code: `const mysql = require('mysql2/promise');

class ConnectionPool {
  constructor(config, poolSize = 10) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: poolSize,
      queueLimit: 0,
      enableTimeout: true,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0
    });
  }
  
  async query(sql, values) {
    const connection = await this.pool.getConnection();
    try {
      const [results] = await connection.query(sql, values);
      return results;
    } finally {
      connection.release();
    }
  }
  
  async close() {
    await this.pool.end();
  }
}

const pool = new ConnectionPool({ host: 'localhost', user: 'root', password: '', database: 'mydb' });
const users = await pool.query('SELECT * FROM users WHERE id = ?', [1]);`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["nodejs", "database", "connection-pooling"],
    copies: 187,
    rating: 4.7
  },
  {
    title: "SQL Query Optimization - DBMS",
    description: "Optimized SQL queries with indexing strategies and query patterns",
    code: `-- Index creation for performance optimization
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_user_date ON orders(user_id, created_at);

-- Query 1: Efficient pagination with cursor
SELECT * FROM users 
WHERE id > ? 
ORDER BY id ASC 
LIMIT 20;

-- Query 2: Join with proper filtering
SELECT u.id, u.name, COUNT(o.id) as total_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id
HAVING COUNT(o.id) > 0
ORDER BY total_orders DESC
LIMIT 100;

-- Query 3: Avoid N+1 problem with subquery
SELECT * FROM users 
WHERE id IN (SELECT DISTINCT user_id FROM orders WHERE amount > 100);

-- Query 4: Window function for ranking
SELECT id, name, amount,
  ROW_NUMBER() OVER (ORDER BY amount DESC) as rank
FROM orders
WHERE year = 2025;`,
    language: "sql",
    complexity: "O(n log n)",
    tags: ["dbms", "sql", "optimization"],
    copies: 312,
    rating: 4.8
  },
  {
    title: "Sliding Window Pattern - String Matching",
    description: "Optimal sliding window for substring and array problems",
    code: `function longestSubstringWithoutRepeating(s) {
  const charIndex = new Map();
  let maxLength = 0;
  let windowStart = 0;
  
  for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
    const char = s[windowEnd];
    
    if (charIndex.has(char)) {
      windowStart = Math.max(windowStart, charIndex.get(char) + 1);
    }
    
    charIndex.set(char, windowEnd);
    maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
  }
  
  return maxLength;
}

// Time: O(n), Space: O(min(n, alphabet_size))
console.log(longestSubstringWithoutRepeating("abcabcbb"));  // 3
console.log(longestSubstringWithoutRepeating("bbbbb"));     // 1
console.log(longestSubstringWithoutRepeating("pwwkew"));    // 3`,
    language: "javascript",
    complexity: "O(n)",
    tags: ["algorithms", "sliding-window", "interview"],
    copies: 289,
    rating: 4.9
  },
  {
    title: "Event Emitter Pattern - Node.js",
    description: "Custom event-driven architecture implementation",
    code: `class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  
  emit(eventName, ...args) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(callback => {
      callback(...args);
    });
  }
  
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    );
  }
}

const emitter = new EventEmitter();
emitter.on('user:login', (user) => console.log(\`\${user} logged in\`));
emitter.emit('user:login', 'John');  // Output: "John logged in"`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["nodejs", "design-patterns", "event-driven"],
    copies: 223,
    rating: 4.7
  },
  {
    title: "Cursor-based Pagination - Node.js",
    description: "Efficient pagination pattern for large datasets",
    code: `async function getPaginatedUsers(cursor = null, limit = 20) {
  let query = 'SELECT * FROM users';
  let params = [];
  
  // Cursor-based filtering (more efficient than OFFSET)
  if (cursor) {
    query += ' WHERE id > ?';
    params.push(cursor);
  }
  
  query += ' ORDER BY id ASC LIMIT ?';
  params.push(limit + 1);  // Get one extra to check if more exists
  
  const users = await db.query(query, params);
  
  const hasMore = users.length > limit;
  const items = hasMore ? users.slice(0, -1) : users;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  
  return {
    data: items,
    nextCursor,
    hasMore
  };
}

// Usage in Express
app.get('/users', async (req, res) => {
  const { cursor } = req.query;
  const result = await getPaginatedUsers(cursor);
  res.json(result);
});`,
    language: "javascript",
    complexity: "O(n)",
    tags: ["nodejs", "pagination", "database"],
    copies: 198,
    rating: 4.8
  },
  {
    title: "Worker Threads - Node.js CPU Intensive Tasks",
    description: "Handle blocking CPU operations without freezing the event loop",
    code: `const { Worker } = require('worker_threads');
const path = require('path');

function runWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker.js'));
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(\`Worker stopped with code \${code}\`));
      }
    });
    
    worker.postMessage(data);
  });
}

// In Express route
app.post('/calculate', async (req, res) => {
  try {
    const result = await runWorker({ numbers: req.body.numbers });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// worker.js (separate file)
const { parentPort } = require('worker_threads');
parentPort.on('message', (data) => {
  const result = data.numbers.reduce((a, b) => a + b, 0);
  parentPort.postMessage(result);
});`,
    language: "javascript",
    complexity: "O(n)",
    tags: ["nodejs", "performance", "concurrency"],
    copies: 156,
    rating: 4.7
  },
  {
    title: "React useContext - Global State Management",
    description: "Manage global state without Redux using React Context API",
    code: `import React, { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Context Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage in component
function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["react", "hooks", "context-api", "state-management"],
    copies: 323,
    rating: 4.9
  },
  {
    title: "React useMemo - Performance Optimization",
    description: "Prevent unnecessary recalculations with useMemo hook",
    code: `import React, { useMemo, useState } from 'react';

// Expensive computation
function expensiveCalculation(items) {
  console.log('Computing total...');
  return items.reduce((sum, item) => sum + item.price, 0);
}

function ShoppingCart({ items, taxRate }) {
  const [count, setCount] = useState(0);
  
  // Memoize the expensive calculation
  const total = useMemo(() => {
    return expensiveCalculation(items);
  }, [items]);  // Only recompute when items change
  
  const taxAmount = useMemo(() => {
    return total * (taxRate / 100);
  }, [total, taxRate]);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Render count: {count}
      </button>
      <p>Total: \${total.toFixed(2)}</p>
      <p>Tax: \${taxAmount.toFixed(2)}</p>
    </div>
  );
}

export default ShoppingCart;`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["react", "hooks", "performance", "optimization"],
    copies: 287,
    rating: 4.8
  },
  {
    title: "React useCallback - Memoize Functions",
    description: "Prevent function recreation to optimize child component renders",
    code: `import React, { useCallback, useState, memo } from 'react';

// Memoized child component
const Button = memo(({ onClick, label }) => {
  console.log('Button rendered');
  return <button onClick={onClick}>{label}</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Without useCallback, this function is recreated on every render
  // causing Button to re-render even though props didn't change
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);  // Empty dependency array - function never changes
  
  const handleNameChange = useCallback((e) => {
    setName(e.target.value);
  }, []);
  
  return (
    <div>
      <input value={name} onChange={handleNameChange} placeholder="Name" />
      <p>Count: {count}</p>
      <Button onClick={handleIncrement} label="Increment" />
    </div>
  );
}

export default ParentComponent;`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["react", "hooks", "callback", "performance"],
    copies: 245,
    rating: 4.8
  },
  {
    title: "React useRef - DOM Access and Mutable Values",
    description: "Access DOM elements directly and persist values without causing re-renders",
    code: `import React, { useRef, useState } from 'react';

function TextInput() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  const [text, setText] = useState('');
  
  // This doesn't cause a re-render
  renderCount.current += 1;
  
  const handleFocus = () => {
    inputRef.current.focus();
  };
  
  const handleSelect = () => {
    inputRef.current.select();
  };
  
  const handleGetValue = () => {
    alert(\`Input value: \${inputRef.current.value}\`);
  };
  
  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <button onClick={handleFocus}>Focus</button>
      <button onClick={handleSelect}>Select</button>
      <button onClick={handleGetValue}>Get Value</button>
      <p>Render count: {renderCount.current}</p>
    </div>
  );
}

export default TextInput;`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["react", "hooks", "useRef", "dom-access"],
    copies: 267,
    rating: 4.8
  },
  {
    title: "React Custom Hook - useAsync",
    description: "Reusable hook for handling async operations with loading and error states",
    code: `import { useState, useEffect } from 'react';

function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  const execute = async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
    }
  };
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);
  
  return { execute, status, data, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, status, error } = useAsync(
    () => fetch(\`/api/users/\${userId}\`).then(r => r.json())
  );
  
  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'error') return <p>Error: {error.message}</p>;
  if (user) return <div>User: {user.name}</div>;
  return null;
}

export { useAsync };`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["react", "hooks", "custom-hooks", "async"],
    copies: 298,
    rating: 4.9
  },
  {
    title: "React useEffect - Advanced Patterns",
    description: "Master useEffect with cleanup, dependencies, and common patterns",
    code: `import { useEffect, useState } from 'react';

function AdvancedEffectExample() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  
  // Effect with cleanup - subscribe and unsubscribe
  useEffect(() => {
    const subscription = someEventEmitter.subscribe(() => {
      console.log('Event fired');
    });
    
    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []);  // Run once on mount
  
  // Effect with dependencies
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(\`/api/data?id=\${count}\`);
      setData(await result.json());
    };
    
    fetchData();
  }, [count]);  // Run when count changes
  
  // Multiple effects
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Timer executed');
    }, 1000);
    
    return () => clearTimeout(timer);  // Cleanup timer
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {data && <p>Data: {JSON.stringify(data)}</p>}
    </div>
  );
}

export default AdvancedEffectExample;`,
    language: "javascript",
    complexity: "O(1)",
    tags: ["react", "hooks", "useEffect", "lifecycle"],
    copies: 234,
    rating: 4.9
  },
  {
    title: "SQL Transactions - ACID Compliance",
    description: "Implement atomic transactions for data consistency",
    code: `-- Explicit transaction with COMMIT and ROLLBACK
START TRANSACTION;

BEGIN;
  INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
  INSERT INTO accounts (user_id, balance) VALUES (2, 500);
COMMIT;

-- Transaction with error handling
START TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;
  
  -- If error occurs, rollback everything
  ROLLBACK;  -- Undo all changes
  -- Or
  COMMIT;    -- Save all changes

-- Savepoint for partial rollback
START TRANSACTION;
  INSERT INTO logs (message) VALUES ('Operation started');
  SAVEPOINT sp1;
  
  UPDATE accounts SET balance = balance - 50 WHERE user_id = 1;
  
  ROLLBACK TO sp1;  -- Undo to savepoint
  
  INSERT INTO logs (message) VALUES ('Operation completed');
COMMIT;`,
    language: "sql",
    complexity: "O(n)",
    tags: ["dbms", "sql", "transactions", "acid"],
    copies: 213,
    rating: 4.8
  },
  {
    title: "SQL Window Functions - Advanced Analytics",
    description: "Perform complex analytics with ROW_NUMBER, RANK, and DENSE_RANK",
    code: `-- ROW_NUMBER - Unique sequential number
SELECT 
  employee_id, 
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- RANK with ties
SELECT 
  employee_id, 
  salary,
  department_id,
  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as dept_rank,
  DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as dense_rank
FROM employees;

-- LAG and LEAD - Access previous/next row
SELECT 
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) as prev_month_revenue,
  LEAD(revenue) OVER (ORDER BY month) as next_month_revenue,
  revenue - LAG(revenue) OVER (ORDER BY month) as revenue_change
FROM monthly_sales;

-- Running totals
SELECT 
  date,
  daily_sales,
  SUM(daily_sales) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total
FROM sales
ORDER BY date;`,
    language: "sql",
    complexity: "O(n log n)",
    tags: ["dbms", "sql", "window-functions", "analytics"],
    copies: 189,
    rating: 4.8
  },
  {
    title: "SQL Subqueries and CTEs - Complex Queries",
    description: "Master Common Table Expressions and correlated subqueries",
    code: `-- Common Table Expression (CTE)
WITH active_users AS (
  SELECT id, name, email, created_at
  FROM users
  WHERE deleted_at IS NULL AND status = 'active'
),
user_orders AS (
  SELECT 
    au.id,
    au.name,
    COUNT(o.id) as total_orders,
    SUM(o.amount) as total_spent
  FROM active_users au
  LEFT JOIN orders o ON au.id = o.user_id
  GROUP BY au.id, au.name
)
SELECT * FROM user_orders WHERE total_spent > 1000;

-- Recursive CTE (useful for hierarchies)
WITH RECURSIVE category_tree AS (
  -- Base case
  SELECT id, name, parent_id, 0 as level
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case
  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
  WHERE ct.level < 10
)
SELECT * FROM category_tree ORDER BY level, name;

-- Correlated subquery
SELECT 
  o.id,
  o.user_id,
  o.amount,
  (SELECT AVG(amount) FROM orders WHERE user_id = o.user_id) as user_avg
FROM orders o
WHERE o.amount > (SELECT AVG(amount) FROM orders);`,
    language: "sql",
    complexity: "O(n²)",
    tags: ["dbms", "sql", "cte", "subqueries"],
    copies: 167,
    rating: 4.7
  },
  {
    title: "SQL JSON Operations - Data Extraction",
    description: "Work with JSON data types in modern SQL databases",
    code: `-- Extract JSON values
SELECT 
  id,
  metadata->>'name' as name,           -- Text extraction
  (metadata->>'age')::INTEGER as age,  -- Convert to integer
  metadata->'tags' as tags_array       -- JSON array
FROM users
WHERE metadata @> '{"active": true}';  -- Check if contains

-- Create JSON from rows
SELECT 
  id,
  user_id,
  json_build_object(
    'id', id,
    'user_id', user_id,
    'amount', amount,
    'created_at', created_at
  ) as order_json
FROM orders;

-- Aggregate to JSON array
SELECT 
  user_id,
  json_agg(
    json_build_object(
      'order_id', id,
      'amount', amount,
      'date', created_at
    )
  ) as orders
FROM orders
GROUP BY user_id;

-- Parse and expand JSON array
SELECT 
  id,
  jsonb_array_elements(tags) as tag
FROM items
WHERE tags IS NOT NULL;`,
    language: "sql",
    complexity: "O(n)",
    tags: ["dbms", "sql", "json", "postgresql"],
    copies: 145,
    rating: 4.7
  },
  {
    title: "SQL Performance - Query Execution Plans",
    description: "Analyze and optimize query performance with EXPLAIN",
    code: `-- Analyze query execution plan
EXPLAIN ANALYZE
SELECT u.id, u.name, COUNT(o.id) as total_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
ORDER BY total_orders DESC
LIMIT 100;

-- Show detailed timing information
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders
WHERE user_id = 1
  AND created_at BETWEEN '2024-01-01' AND '2024-12-31';

-- Compare indexes effectiveness
CREATE INDEX idx_user_created ON users(id, created_at);

EXPLAIN SELECT * FROM users WHERE id = 1 AND created_at > NOW();

-- Identify slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;`,
    language: "sql",
    complexity: "O(1)",
    tags: ["dbms", "sql", "performance", "profiling"],
    copies: 178,
    rating: 4.8
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

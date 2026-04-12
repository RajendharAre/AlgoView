// Sample Q&A Data for Development Hub
// Curated interview questions and answers organized by category

export const sampleQAData = [
  // ─── React & Frontend ──────────────────────────────
  {
    id: 'qa-react-001',
    question: 'What is the Virtual DOM and how does React use it?',
    answer: `The Virtual DOM (VDOM) is a lightweight JavaScript representation of the actual DOM. When state changes in a React component, React creates a new Virtual DOM tree and compares it with the previous one using a process called **"diffing"**. Only the differences (minimal set of changes) are then applied to the real DOM — this is called **"reconciliation"**.

**Why it matters:**
- Direct DOM manipulation is expensive (reflow, repaint).
- The VDOM allows React to batch updates and minimize actual DOM operations.
- React's reconciliation algorithm runs in O(n) time using heuristics (same-type elements produce same trees, keys help identify moved elements).

\`\`\`jsx
// React internally does something like:
const prevVDOM = render(prevState);
const nextVDOM = render(nextState);
const patches = diff(prevVDOM, nextVDOM);
applyPatches(realDOM, patches);
\`\`\``,
    category: 'React & Frontend',
    difficulty: 'Beginner',
    tags: ['react', 'virtual-dom', 'performance'],
    author: 'AlgoView Team',
    upvotes: 142,
    views: 2840,
    createdAt: '2026-01-15',
    isVerified: true,
  },
  {
    id: 'qa-react-002',
    question: 'Explain the difference between useEffect and useLayoutEffect.',
    answer: `Both hooks run after rendering, but they differ in **timing**:

| Hook | When it runs | Use case |
|------|-------------|---------|
| \`useEffect\` | After paint (asynchronous) | Data fetching, subscriptions, logging |
| \`useLayoutEffect\` | Before paint (synchronous) | DOM measurements, scroll position, preventing visual flicker |

**useEffect** runs asynchronously after the browser has painted. This is the default and preferred hook — it doesn't block the browser.

**useLayoutEffect** runs synchronously after all DOM mutations but before the browser paints. Use it when you need to read layout from the DOM and re-render synchronously.

\`\`\`jsx
// useEffect — runs after paint
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);

// useLayoutEffect — runs before paint
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setPosition({ top: rect.top, left: rect.left });
}, []);
\`\`\`

**Rule of thumb:** Start with \`useEffect\`. Only switch to \`useLayoutEffect\` if you see visual flickering.`,
    category: 'React & Frontend',
    difficulty: 'Intermediate',
    tags: ['react', 'hooks', 'useEffect'],
    author: 'AlgoView Team',
    upvotes: 98,
    views: 1920,
    createdAt: '2026-01-20',
    isVerified: true,
  },
  {
    id: 'qa-react-003',
    question: 'What are React Server Components and how do they differ from Client Components?',
    answer: `React Server Components (RSC) render on the server and send the result as a serialized tree to the client — **zero JavaScript is shipped for server components**.

**Key Differences:**

| Feature | Server Components | Client Components |
|---------|------------------|-------------------|
| Rendering | Server only | Client (+ optional SSR) |
| JavaScript bundle | None | Included in bundle |
| State/Effects | Cannot use useState, useEffect | Full access |
| Data fetching | Direct DB/API access | Fetch from client |
| Interactivity | None (no event handlers) | Full interactivity |

**When to use which:**
- **Server Components** → Static content, data fetching, heavy dependencies (markdown, syntax highlighting)
- **Client Components** → Interactive UI, forms, state management, browser APIs

\`\`\`jsx
// Server Component (default in Next.js App Router)
async function PostList() {
  const posts = await db.posts.findMany(); // Direct DB access
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

// Client Component
'use client';
function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>❤️</button>;
}
\`\`\``,
    category: 'React & Frontend',
    difficulty: 'Advanced',
    tags: ['react', 'server-components', 'nextjs'],
    author: 'AlgoView Team',
    upvotes: 76,
    views: 1560,
    createdAt: '2026-02-01',
    isVerified: true,
  },
  {
    id: 'qa-react-004',
    question: "How does React's reconciliation algorithm work?",
    answer: `React's reconciliation (diffing) algorithm uses two key heuristics to achieve O(n) performance:

**1. Different types → Different trees**
If an element changes type (e.g., \`<div>\` to \`<span>\`), React destroys the old tree and builds a new one from scratch.

**2. Keys identify stable elements**
Keys help React identify elements in a list that have moved, been added, or removed.

**The diffing process:**
1. Compare root elements — if types differ, tear down and rebuild
2. Same type DOM elements — update only changed attributes
3. Same type component elements — update props, re-render
4. Recurse on children — use keys to match children across renders

\`\`\`jsx
// BAD: Without keys, React can't optimize
{items.map(item => <Item data={item} />)}

// GOOD: Keys help React track each element
{items.map(item => <Item key={item.id} data={item} />)}

// BAD: Using index as key with reorderable lists
{items.map((item, index) => <Item key={index} data={item} />)}
\`\`\`

**Never use array index as key** when the list can be reordered, filtered, or items added/removed.`,
    category: 'React & Frontend',
    difficulty: 'Advanced',
    tags: ['react', 'reconciliation', 'performance'],
    author: 'AlgoView Team',
    upvotes: 89,
    views: 1780,
    createdAt: '2026-01-28',
    isVerified: true,
  },
  {
    id: 'qa-react-005',
    question: 'What is the difference between controlled and uncontrolled components?',
    answer: `**Controlled Components** — React state is the "single source of truth." The component's value is driven by React state and updated via event handlers.

**Uncontrolled Components** — The DOM itself holds the state. You use a \`ref\` to read values when needed.

| Feature | Controlled | Uncontrolled |
|---------|-----------|-------------|
| State management | React state | DOM (ref) |
| Validation | Real-time | On submit |
| Re-renders | On every change | Minimal |
| Best for | Complex forms, validation | Simple forms, file inputs |

\`\`\`jsx
// Controlled
function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

// Uncontrolled
function UncontrolledInput() {
  const inputRef = useRef(null);
  const handleSubmit = () => console.log(inputRef.current.value);
  return <input ref={inputRef} defaultValue="" />;
}
\`\`\`

**Best practice:** Use controlled components for most forms. Use uncontrolled for file inputs (\`<input type="file">\`) and when integrating with non-React code.`,
    category: 'React & Frontend',
    difficulty: 'Beginner',
    tags: ['react', 'forms', 'state'],
    author: 'AlgoView Team',
    upvotes: 112,
    views: 2100,
    createdAt: '2026-01-10',
    isVerified: true,
  },

  // ─── JavaScript Core ───────────────────────────────
  {
    id: 'qa-js-001',
    question: 'Explain closures in JavaScript with a practical example.',
    answer: `A **closure** is a function that has access to variables from its outer (enclosing) function's scope, even after the outer function has returned.

**How it works:**
When a function is created, it captures a reference to the variables in its lexical scope. This reference persists even when the function is executed outside that scope.

\`\`\`javascript
function createCounter(initialValue = 0) {
  let count = initialValue; // enclosed variable

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.getCount();  // 12
// 'count' is not accessible directly — it's private!
\`\`\`

**Common use cases:**
- **Data privacy** — Encapsulate variables (module pattern)
- **Function factories** — Create specialized functions
- **Callbacks & event handlers** — Remember context
- **Memoization** — Cache computed results

**Common pitfall — loop closures:**
\`\`\`javascript
// BUG: All callbacks log 3
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// FIX 1: Use let (block scoping)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// FIX 2: Use IIFE to capture value
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i); // 0, 1, 2
}
\`\`\``,
    category: 'JavaScript Core',
    difficulty: 'Intermediate',
    tags: ['javascript', 'closures', 'scope'],
    author: 'AlgoView Team',
    upvotes: 156,
    views: 3200,
    createdAt: '2026-01-05',
    isVerified: true,
  },
  {
    id: 'qa-js-002',
    question: 'What is the event loop and how does JavaScript handle asynchronous operations?',
    answer: `JavaScript is **single-threaded** but handles async operations through the **event loop** mechanism.

**The key components:**

1. **Call Stack** — Executes synchronous code (LIFO)
2. **Web APIs / Node APIs** — Handle async operations (setTimeout, fetch, DOM events)
3. **Callback Queue (Task Queue)** — Stores callbacks from Web APIs
4. **Microtask Queue** — Stores Promise callbacks, MutationObserver (higher priority)
5. **Event Loop** — Moves tasks from queues to call stack when stack is empty

**Execution order:**
1. Execute all synchronous code on the call stack
2. When stack is empty, process ALL microtasks (Promises)
3. Process ONE macrotask (setTimeout, setInterval)
4. Repeat from step 2

\`\`\`javascript
console.log('1 - Sync');

setTimeout(() => console.log('2 - Macrotask'), 0);

Promise.resolve().then(() => console.log('3 - Microtask'));

console.log('4 - Sync');

// Output: 1 - Sync → 4 - Sync → 3 - Microtask → 2 - Macrotask
\`\`\`

**Why this matters in interviews:**
- Explains why \`setTimeout(fn, 0)\` doesn't run immediately
- Shows understanding of Promise execution timing
- Critical for debugging race conditions`,
    category: 'JavaScript Core',
    difficulty: 'Intermediate',
    tags: ['javascript', 'event-loop', 'async'],
    author: 'AlgoView Team',
    upvotes: 178,
    views: 3800,
    createdAt: '2026-01-08',
    isVerified: true,
  },
  {
    id: 'qa-js-003',
    question: 'What is the difference between == and === in JavaScript?',
    answer: `**\`==\` (Loose Equality)** — Compares values after type coercion.
**\`===\` (Strict Equality)** — Compares values AND types without coercion.

\`\`\`javascript
// Loose equality (==) — type coercion happens
0 == ''        // true  (both coerce to 0)
0 == '0'       // true  (string '0' coerces to number 0)
'' == '0'      // false (no numeric coercion for string-string)
false == '0'   // true  (false → 0, '0' → 0)
null == undefined // true (special case)
NaN == NaN     // false (NaN is not equal to anything)

// Strict equality (===) — no coercion
0 === ''       // false (number vs string)
0 === '0'      // false (number vs string)
false === '0'  // false (boolean vs string)
null === undefined // false (different types)
\`\`\`

**Best Practice:** Always use \`===\` (strict equality). The only acceptable use of \`==\` is checking for \`null\` or \`undefined\`:

\`\`\`javascript
// This is the ONLY acceptable use of ==
if (value == null) {
  // catches both null and undefined
}
\`\`\``,
    category: 'JavaScript Core',
    difficulty: 'Beginner',
    tags: ['javascript', 'operators', 'fundamentals'],
    author: 'AlgoView Team',
    upvotes: 134,
    views: 2900,
    createdAt: '2026-01-03',
    isVerified: true,
  },
  {
    id: 'qa-js-004',
    question: 'What are Promises and how do async/await work under the hood?',
    answer: `A **Promise** is an object representing the eventual completion or failure of an asynchronous operation. It has three states: **pending**, **fulfilled**, **rejected**.

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});

promise
  .then(result => console.log(result))  // 'Done!'
  .catch(error => console.error(error))
  .finally(() => console.log('Cleanup'));
\`\`\`

**async/await** is syntactic sugar over Promises:
- \`async\` function always returns a Promise
- \`await\` pauses execution until the Promise settles
- Under the hood, the engine uses generator functions and iterators

\`\`\`javascript
// Promise chain
function fetchUser(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .then(user => fetch(\`/api/posts?userId=\${user.id}\`))
    .then(res => res.json());
}

// Same thing with async/await — cleaner!
async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  const user = await res.json();
  const postsRes = await fetch(\`/api/posts?userId=\${user.id}\`);
  return postsRes.json();
}
\`\`\`

**Error handling patterns:**
\`\`\`javascript
// try-catch with async/await
async function getData() {
  try {
    const data = await fetchSomething();
    return data;
  } catch (error) {
    console.error('Failed:', error);
    throw error; // re-throw if needed
  }
}
\`\`\``,
    category: 'JavaScript Core',
    difficulty: 'Intermediate',
    tags: ['javascript', 'promises', 'async-await'],
    author: 'AlgoView Team',
    upvotes: 145,
    views: 3100,
    createdAt: '2026-01-12',
    isVerified: true,
  },
  {
    id: 'qa-js-005',
    question: 'Explain prototypal inheritance in JavaScript.',
    answer: `In JavaScript, objects can inherit properties from other objects through the **prototype chain**. Every object has an internal \`[[Prototype]]\` link.

\`\`\`javascript
// Constructor function pattern
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return \`\${this.name} makes a sound.\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return \`\${this.name} barks!\`;
};

const dog = new Dog('Rex', 'Labrador');
dog.speak(); // "Rex makes a sound." — inherited
dog.bark();  // "Rex barks!" — own method
\`\`\`

**Modern ES6 class syntax** (same mechanism underneath):
\`\`\`javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound.\`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  bark() { return \`\${this.name} barks!\`; }
}
\`\`\`

**Prototype chain lookup:**
\`dog.bark()\` → found on Dog.prototype ✓
\`dog.speak()\` → not on Dog.prototype → found on Animal.prototype ✓
\`dog.toString()\` → not on Animal.prototype → found on Object.prototype ✓`,
    category: 'JavaScript Core',
    difficulty: 'Advanced',
    tags: ['javascript', 'prototypes', 'inheritance'],
    author: 'AlgoView Team',
    upvotes: 98,
    views: 2100,
    createdAt: '2026-01-18',
    isVerified: true,
  },

  // ─── Node.js & Backend ─────────────────────────────
  {
    id: 'qa-node-001',
    question: "How does Node.js handle concurrent requests if it's single-threaded?",
    answer: `Node.js uses a **single-threaded event loop** combined with **non-blocking I/O** to handle thousands of concurrent connections efficiently.

**How it works:**

1. **Main thread** handles JavaScript execution
2. **libuv** (C library) manages a thread pool (default 4 threads) for heavy I/O:
   - File system operations
   - DNS lookups
   - Compression
3. **OS kernel** handles network operations natively (epoll/kqueue/IOCP)

\`\`\`
Client Requests
      ↓
  Event Loop (single thread)
      ↓
  ┌──────────────────┐
  │ Non-blocking I/O │ → OS kernel handles network
  │ File operations  │ → libuv thread pool (4 threads)
  │ Callbacks        │ → Back to event loop
  └──────────────────┘
\`\`\`

**When Node.js shines:**
- API servers, real-time apps, microservices
- I/O-heavy workloads (database queries, file serving)

**When Node.js struggles:**
- CPU-intensive tasks (image processing, encryption)
- Use \`worker_threads\` for CPU-bound work

\`\`\`javascript
// This is non-blocking — event loop stays free
app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users'); // non-blocking
  res.json(users);
});

// This BLOCKS the event loop — BAD!
app.get('/hash', (req, res) => {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  res.json({ hash }); // blocks all other requests during computation
});
\`\`\``,
    category: 'Node.js & Backend',
    difficulty: 'Intermediate',
    tags: ['nodejs', 'event-loop', 'concurrency'],
    author: 'AlgoView Team',
    upvotes: 167,
    views: 3400,
    createdAt: '2026-01-14',
    isVerified: true,
  },
  {
    id: 'qa-node-002',
    question: 'What is middleware in Express.js and how does the middleware chain work?',
    answer: `Middleware functions are functions that have access to the **request**, **response**, and **next** function. They execute in the order they are defined.

**Middleware types:**
1. **Application-level** — \`app.use()\`, \`app.get()\`
2. **Router-level** — \`router.use()\`
3. **Error-handling** — 4 parameters: \`(err, req, res, next)\`
4. **Built-in** — \`express.json()\`, \`express.static()\`
5. **Third-party** — \`cors\`, \`helmet\`, \`morgan\`

\`\`\`javascript
const express = require('express');
const app = express();

// 1. Built-in middleware
app.use(express.json());

// 2. Custom logging middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url} - \${new Date().toISOString()}\`);
  next(); // MUST call next() to continue the chain
});

// 3. Auth middleware (route-specific)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (e) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// 4. Protected route
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// 5. Error-handling middleware (must be LAST)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
\`\`\`

**Middleware execution flow:**
Request → Middleware 1 → Middleware 2 → Route Handler → Response`,
    category: 'Node.js & Backend',
    difficulty: 'Beginner',
    tags: ['nodejs', 'express', 'middleware'],
    author: 'AlgoView Team',
    upvotes: 128,
    views: 2600,
    createdAt: '2026-01-22',
    isVerified: true,
  },
  {
    id: 'qa-node-003',
    question: 'How do you handle authentication with JWT in a Node.js API?',
    answer: `**JWT (JSON Web Token)** is a stateless authentication mechanism. The server generates a signed token that the client stores and sends with each request.

**JWT Structure:** \`header.payload.signature\`

\`\`\`javascript
// 1. User registration/login → generate token
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
  
  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  res.json({ accessToken });
});

// 2. Auth middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authorized' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token expired' });
  }
};

// 3. Protected route
app.get('/api/dashboard', protect, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json({ user });
});
\`\`\`

**Security best practices:**
- Short-lived access tokens (15 min)
- Long-lived refresh tokens in httpOnly cookies
- Password hashing with bcrypt (salt rounds ≥ 10)
- HTTPS only in production`,
    category: 'Node.js & Backend',
    difficulty: 'Intermediate',
    tags: ['nodejs', 'jwt', 'authentication', 'security'],
    author: 'AlgoView Team',
    upvotes: 156,
    views: 3200,
    createdAt: '2026-02-05',
    isVerified: true,
  },
  {
    id: 'qa-node-004',
    question: 'What is the difference between SQL and NoSQL databases? When should you use each?',
    answer: `**SQL (Relational)** — Structured data in tables with defined schemas, relationships via foreign keys.
**NoSQL (Non-Relational)** — Flexible schemas, various data models (document, key-value, graph, columnar).

| Feature | SQL (PostgreSQL, MySQL) | NoSQL (MongoDB, Redis) |
|---------|------------------------|----------------------|
| Schema | Fixed, predefined | Flexible, dynamic |
| Scaling | Vertical (bigger server) | Horizontal (more servers) |
| Relationships | JOINs, foreign keys | Denormalization, embedding |
| ACID | Full support | Varies (eventual consistency) |
| Query language | SQL standard | Database-specific |
| Best for | Complex queries, transactions | High throughput, flexible data |

**Use SQL when:**
- Data has clear relationships (users → orders → products)
- You need transactions (banking, e-commerce)
- Complex queries with JOINs are common
- Data integrity is critical

**Use NoSQL when:**
- Schema changes frequently (early-stage products)
- High read/write throughput needed
- Data is naturally hierarchical (blog posts with comments)
- Horizontal scaling is a priority

\`\`\`javascript
// SQL (PostgreSQL with Prisma)
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true, profile: true }
});

// NoSQL (MongoDB with Mongoose)
const user = await User.findById(userId).populate('posts');
\`\`\``,
    category: 'Node.js & Backend',
    difficulty: 'Beginner',
    tags: ['database', 'sql', 'nosql', 'mongodb'],
    author: 'AlgoView Team',
    upvotes: 134,
    views: 2800,
    createdAt: '2026-01-25',
    isVerified: true,
  },

  // ─── Data Structures & Algorithms ──────────────────
  {
    id: 'qa-dsa-001',
    question: 'What is the time complexity of common array operations?',
    answer: `Here's a comprehensive breakdown of array time complexities:

| Operation | Array | Dynamic Array (ArrayList) |
|-----------|-------|--------------------------|
| Access by index | O(1) | O(1) |
| Search (unsorted) | O(n) | O(n) |
| Search (sorted) | O(log n) — binary search | O(log n) |
| Insert at end | O(1)* | O(1) amortized |
| Insert at beginning | O(n) | O(n) |
| Insert at middle | O(n) | O(n) |
| Delete at end | O(1) | O(1) |
| Delete at beginning | O(n) | O(n) |
| Delete at middle | O(n) | O(n) |

*Static array requires pre-allocated space.

**Why \`push()\` is O(1) amortized:**
Dynamic arrays double in size when full. Most push operations are O(1), but occasionally an O(n) resize happens. Averaged out over n operations → O(1) per operation.

\`\`\`javascript
// O(1) — Direct access
const val = arr[5];

// O(n) — Linear search
const index = arr.indexOf(target);

// O(log n) — Binary search on sorted array
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

// O(n) — Shift elements for insertion
arr.splice(2, 0, newElement); // insert at index 2
\`\`\``,
    category: 'Data Structures & Algorithms',
    difficulty: 'Beginner',
    tags: ['arrays', 'complexity', 'big-o'],
    author: 'AlgoView Team',
    upvotes: 189,
    views: 4200,
    createdAt: '2026-01-02',
    isVerified: true,
  },
  {
    id: 'qa-dsa-002',
    question: 'Explain the difference between BFS and DFS. When would you use each?',
    answer: `**BFS (Breadth-First Search)** — Explores level by level using a **queue**.
**DFS (Depth-First Search)** — Explores as deep as possible using a **stack** (or recursion).

| Feature | BFS | DFS |
|---------|-----|-----|
| Data structure | Queue | Stack / Recursion |
| Space complexity | O(w) — width | O(h) — height |
| Finds shortest path | Yes (unweighted) | No |
| Complete | Yes | Yes (finite graphs) |
| Use case | Shortest path, level-order | Topological sort, cycle detection |

\`\`\`javascript
// BFS — Level-order traversal
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  
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

// DFS — Deep traversal
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}
\`\`\`

**When to use BFS:**
- Finding shortest path in unweighted graphs
- Level-order tree traversal
- Finding connected components

**When to use DFS:**
- Detecting cycles
- Topological sorting
- Path finding in mazes
- Tree traversals (inorder, preorder, postorder)`,
    category: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    tags: ['bfs', 'dfs', 'graphs', 'searching'],
    author: 'AlgoView Team',
    upvotes: 167,
    views: 3600,
    createdAt: '2026-01-16',
    isVerified: true,
  },
  {
    id: 'qa-dsa-003',
    question: 'What is Dynamic Programming? Explain with the Fibonacci example.',
    answer: `**Dynamic Programming (DP)** is an optimization technique that solves problems by breaking them into overlapping subproblems and storing their solutions to avoid redundant computation.

**Two approaches:**
1. **Top-Down (Memoization)** — Recursive + cache
2. **Bottom-Up (Tabulation)** — Iterative + table

**Fibonacci Example:**

\`\`\`javascript
// Naive recursive — O(2^n) time, O(n) space
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Top-Down (Memoization) — O(n) time, O(n) space
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Bottom-Up (Tabulation) — O(n) time, O(n) space
function fibTab(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Space-optimized — O(n) time, O(1) space
function fibOptimal(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}
\`\`\`

**When to use DP:**
1. Problem has **optimal substructure** (optimal solution contains optimal sub-solutions)
2. Problem has **overlapping subproblems** (same subproblems solved multiple times)

**Classic DP problems:** Knapsack, LCS, LIS, Coin Change, Edit Distance, Matrix Chain Multiplication`,
    category: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    tags: ['dynamic-programming', 'algorithms', 'optimization'],
    author: 'AlgoView Team',
    upvotes: 198,
    views: 4500,
    createdAt: '2026-01-20',
    isVerified: true,
  },
  {
    id: 'qa-dsa-004',
    question: 'What is a Hash Table and how does it handle collisions?',
    answer: `A **Hash Table** is a data structure that maps keys to values using a hash function for O(1) average-case operations.

**How it works:**
1. Key → Hash Function → Index
2. Value stored at that index in an array

**Collision Resolution Strategies:**

**1. Chaining (Separate Chaining)**
Each bucket stores a linked list of key-value pairs.

\`\`\`javascript
class HashTable {
  constructor(size = 53) {
    this.table = new Array(size);
  }
  
  _hash(key) {
    let total = 0;
    const PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      total = (total * PRIME + key.charCodeAt(i)) % this.table.length;
    }
    return total;
  }
  
  set(key, value) {
    const index = this._hash(key);
    if (!this.table[index]) this.table[index] = [];
    // Update if key exists
    const existing = this.table[index].find(([k]) => k === key);
    if (existing) existing[1] = value;
    else this.table[index].push([key, value]);
  }
  
  get(key) {
    const index = this._hash(key);
    const pair = this.table[index]?.find(([k]) => k === key);
    return pair ? pair[1] : undefined;
  }
}
\`\`\`

**2. Open Addressing (Linear Probing)**
If a collision occurs, check the next slot.

| Operation | Average | Worst (all collisions) |
|-----------|---------|----------------------|
| Insert | O(1) | O(n) |
| Search | O(1) | O(n) |
| Delete | O(1) | O(n) |

**Load Factor** = n/k (items / buckets). Resize when > 0.75 to maintain O(1) performance.`,
    category: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    tags: ['hash-table', 'data-structures', 'hashing'],
    author: 'AlgoView Team',
    upvotes: 145,
    views: 3100,
    createdAt: '2026-02-10',
    isVerified: true,
  },

  // ─── System Design ─────────────────────────────────
  {
    id: 'qa-sd-001',
    question: 'How would you design a URL shortener like bit.ly?',
    answer: `**Functional Requirements:**
- Shorten a long URL → short URL
- Redirect short URL → original URL
- Optional: custom aliases, expiration, analytics

**Non-Functional Requirements:**
- Highly available (reads >> writes)
- Low latency redirects
- Short URLs should not be predictable

**High-Level Design:**

\`\`\`
Client → Load Balancer → API Servers → Cache (Redis) → Database
\`\`\`

**URL Generation Approaches:**

1. **Base62 encoding** of auto-increment ID
   - ID 12345 → \`dnh\` (base62)
   - Pro: unique, compact
   - Con: predictable

2. **MD5/SHA256 hash** of URL (take first 7 chars)
   - Pro: deterministic
   - Con: collisions possible

3. **Counter + Zookeeper** for distributed unique IDs

**Database Schema:**
\`\`\`sql
CREATE TABLE urls (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  click_count BIGINT DEFAULT 0
);
\`\`\`

**Read Flow:**
1. User visits \`short.ly/abc123\`
2. Check Redis cache → if hit, return 301 redirect
3. Cache miss → query database → cache result → redirect
4. Increment click counter (async)

**Scale Estimates (100M URLs/month):**
- Writes: ~40 URLs/sec
- Reads: ~4000 redirects/sec (100:1 read-write ratio)
- Storage: ~100M × 500 bytes = ~50GB/month

**Key Decisions:**
- 301 vs 302 redirect (301 = permanent, better SEO; 302 = temporary, better analytics)
- Cache eviction: LRU policy
- Database: NoSQL (DynamoDB) for key-value lookups or SQL with read replicas`,
    category: 'System Design',
    difficulty: 'Advanced',
    tags: ['system-design', 'url-shortener', 'scalability'],
    author: 'AlgoView Team',
    upvotes: 187,
    views: 4100,
    createdAt: '2026-01-30',
    isVerified: true,
  },
  {
    id: 'qa-sd-002',
    question: 'What are the key differences between monolithic and microservices architecture?',
    answer: `**Monolithic** — Single deployable unit containing all business logic.
**Microservices** — Multiple independent services communicating over network.

| Aspect | Monolithic | Microservices |
|--------|-----------|---------------|
| Deployment | Single unit | Independent per service |
| Scaling | Scale everything | Scale specific services |
| Tech stack | Single stack | Polyglot (mix & match) |
| Data | Shared database | Database per service |
| Complexity | Simple to start | Complex infrastructure |
| Team structure | One large team | Small, autonomous teams |
| Failure impact | Whole app affected | Isolated failures |
| Development speed | Fast initially | Faster at scale |

**When to use Monolithic:**
- Small teams (< 10 developers)
- Early-stage products / MVPs
- Simple domain, few integrations
- Low traffic expectations

**When to use Microservices:**
- Large teams working on different features
- High scalability requirements
- Different components have different scaling needs
- Need independent deployments

**Communication Patterns:**
\`\`\`
Synchronous:  Service A → HTTP/gRPC → Service B
Asynchronous: Service A → Message Queue (RabbitMQ/Kafka) → Service B
\`\`\`

**Common Challenges with Microservices:**
- Service discovery
- Distributed transactions (Saga pattern)
- Data consistency
- Monitoring & debugging
- Network latency`,
    category: 'System Design',
    difficulty: 'Intermediate',
    tags: ['system-design', 'architecture', 'microservices'],
    author: 'AlgoView Team',
    upvotes: 154,
    views: 3300,
    createdAt: '2026-02-08',
    isVerified: true,
  },
  {
    id: 'qa-sd-003',
    question: 'Explain caching strategies — when to use which?',
    answer: `Caching stores frequently accessed data in fast storage to reduce latency and database load.

**Cache Strategies:**

**1. Cache-Aside (Lazy Loading)**
\`\`\`
Read: App checks cache → miss → read DB → write to cache
Write: App updates DB → invalidate cache
\`\`\`
Best for: Read-heavy workloads where stale data is acceptable.

**2. Write-Through**
\`\`\`
Write: App writes to cache → cache writes to DB (synchronously)
Read: Always from cache
\`\`\`
Best for: Data consistency is critical.

**3. Write-Behind (Write-Back)**
\`\`\`
Write: App writes to cache → cache writes to DB (asynchronously)
Read: Always from cache
\`\`\`
Best for: Write-heavy workloads, acceptable data loss risk.

**4. Read-Through**
\`\`\`
Read: App reads from cache → cache reads from DB on miss
\`\`\`
Best for: When cache can manage data loading logic.

**Cache Eviction Policies:**
| Policy | Description |
|--------|-------------|
| LRU | Least Recently Used — removes oldest accessed |
| LFU | Least Frequently Used — removes least popular |
| TTL | Time-To-Live — expires after set duration |
| FIFO | First In, First Out |

**Redis Example:**
\`\`\`javascript
// Cache-aside pattern
async function getUser(userId) {
  // 1. Check cache
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) return JSON.parse(cached);
  
  // 2. Cache miss → query DB
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  
  // 3. Set cache with TTL (1 hour)
  await redis.setex(\`user:\${userId}\`, 3600, JSON.stringify(user));
  
  return user;
}
\`\`\`

**Cache Invalidation** — "one of the two hard things in computer science":
- Time-based (TTL)
- Event-based (invalidate on write)
- Version-based (cache key includes version)`,
    category: 'System Design',
    difficulty: 'Advanced',
    tags: ['caching', 'redis', 'system-design', 'performance'],
    author: 'AlgoView Team',
    upvotes: 176,
    views: 3800,
    createdAt: '2026-02-15',
    isVerified: true,
  },

  // ─── Behavioral / HR Interview ─────────────────────
  {
    id: 'qa-beh-001',
    question: 'Tell me about a time you had a conflict with a team member. How did you handle it?',
    answer: `Use the **STAR method** to structure your answer:

**S — Situation:** Set the context
**T — Task:** What was your responsibility?
**A — Action:** What did you specifically do?
**R — Result:** What was the outcome?

**Example Answer:**

> **Situation:** During a sprint, a senior developer and I disagreed on the architecture for a new feature. They wanted a monolithic approach while I advocated for a modular design.
>
> **Task:** As the feature lead, I needed to ensure we chose the right approach while maintaining a positive team dynamic.
>
> **Action:** Instead of pushing my viewpoint, I suggested we both prepare a brief technical analysis. I created a comparison document covering maintainability, scalability, and development time. We presented both approaches to the team in a 30-minute design review. I actively listened to their concerns about the learning curve of a modular approach.
>
> **Result:** The team voted for a hybrid approach—modular architecture for the core logic with simpler patterns for less critical parts. The feature shipped on time, and the senior developer later thanked me for the structured discussion. We established design reviews as a standard practice.

**Key principles:**
- Never badmouth anyone — focus on the **problem**, not the person
- Show **empathy** and willingness to compromise
- Highlight **what you learned**
- End with a **positive outcome**`,
    category: 'Behavioral / HR Interview',
    difficulty: 'Beginner',
    tags: ['behavioral', 'conflict-resolution', 'teamwork'],
    author: 'AlgoView Team',
    upvotes: 134,
    views: 2900,
    createdAt: '2026-02-12',
    isVerified: true,
  },
  {
    id: 'qa-beh-002',
    question: 'Why should we hire you? What makes you unique?',
    answer: `**Framework for answering:**

1. **Match your skills to the role** — Reference specific requirements
2. **Quantify your impact** — Use numbers and metrics
3. **Show cultural fit** — Align with company values
4. **Unique differentiator** — What do you bring that others don't?

**Example Answer Template:**

> "I believe I'm a strong fit for this role for three reasons:
>
> **First**, my technical skills directly align with your stack. I've built [specific project] using [technologies they use], handling [specific challenge] that resulted in [metric].
>
> **Second**, I bring a unique combination of [skill 1] and [skill 2]. In my previous role, I [specific example] which improved [metric] by [percentage].
>
> **Third**, I'm passionate about [something relevant to the company]. I've [specific action that shows this passion — open source, blog posts, side projects].
>
> What excites me most about this role is [specific aspect of the job]. I'd love to bring my experience in [area] to help the team [achieve goal]."

**Tips:**
- Be specific — avoid generic statements
- Practice but don't memorize word-for-word
- Research the company's recent projects/values
- Show enthusiasm without being over-the-top
- End by connecting back to the role`,
    category: 'Behavioral / HR Interview',
    difficulty: 'Beginner',
    tags: ['behavioral', 'self-presentation', 'interview'],
    author: 'AlgoView Team',
    upvotes: 112,
    views: 2400,
    createdAt: '2026-02-18',
    isVerified: true,
  },
  {
    id: 'qa-beh-003',
    question: 'Describe a situation where you had to learn a new technology quickly.',
    answer: `**STAR Answer Example:**

> **Situation:** Our team needed to migrate a legacy PHP backend to a Node.js microservices architecture within 6 weeks. I had no prior experience with Node.js or microservices.
>
> **Task:** I was responsible for designing and implementing the user authentication service — one of the most critical microservices.
>
> **Action:**
> - **Week 1:** Immersed myself in Node.js fundamentals — built 3 small projects following official docs and FreeCodeCamp tutorials
> - **Week 2:** Studied our existing PHP auth logic and created a detailed migration plan
> - **Week 3-4:** Implemented the auth service with Express, JWT, and Redis for sessions. Set up CI/CD pipeline
> - **Week 5:** Wrote comprehensive tests (95% coverage) and documentation
> - **Week 6:** Deployed to staging, ran load tests, fixed edge cases
>
> I also paired with a senior Node.js developer twice a week for code reviews.
>
> **Result:** The auth service launched on time with zero downtime during migration. Response times improved by 40% compared to the PHP version. The architecture I designed was adopted as a template for other microservices. I was later asked to mentor new team members on Node.js.

**What this shows:**
- **Learning agility** — Can ramp up quickly
- **Structured approach** — Didn't just dive in blind
- **Collaboration** — Sought help from experts
- **Results-oriented** — Delivered on time with measurable improvements`,
    category: 'Behavioral / HR Interview',
    difficulty: 'Intermediate',
    tags: ['behavioral', 'learning', 'adaptability'],
    author: 'AlgoView Team',
    upvotes: 98,
    views: 2100,
    createdAt: '2026-02-20',
    isVerified: true,
  },

  // ─── General Web Development ───────────────────────
  {
    id: 'qa-web-001',
    question: 'What happens when you type a URL in the browser and press Enter?',
    answer: `This is a classic web development interview question. Here's the complete flow:

**1. URL Parsing**
Browser parses the URL: protocol (https), domain (example.com), path (/page), query params

**2. DNS Resolution**
\`\`\`
Browser cache → OS cache → Router cache → ISP DNS → Root DNS → TLD DNS → Authoritative DNS
→ Returns IP address (e.g., 93.184.216.34)
\`\`\`

**3. TCP Connection**
- Browser initiates TCP 3-way handshake:
  - SYN →
  - ← SYN-ACK
  - ACK →
- For HTTPS: TLS handshake follows (certificate exchange, key negotiation)

**4. HTTP Request**
\`\`\`
GET /page HTTP/2
Host: example.com
User-Agent: Chrome/120
Accept: text/html
Cookie: session=abc123
\`\`\`

**5. Server Processing**
- Web server (Nginx) receives request
- Reverse proxy routes to application server
- Application processes request (database queries, business logic)
- Response generated

**6. HTTP Response**
\`\`\`
HTTP/2 200 OK
Content-Type: text/html
Cache-Control: max-age=3600
Content-Encoding: gzip

<!DOCTYPE html>...
\`\`\`

**7. Browser Rendering (Critical Rendering Path)**
1. **Parse HTML** → Build DOM tree
2. **Parse CSS** → Build CSSOM tree
3. **Combine** → Render tree
4. **Layout** → Calculate positions and dimensions
5. **Paint** → Fill pixels
6. **Composite** → Layer composition

**8. JavaScript Execution**
- Parser encounters \`<script>\` → pauses DOM construction
- \`async\` scripts: download in parallel, execute when ready
- \`defer\` scripts: download in parallel, execute after DOM is ready

**9. Additional Resources**
- CSS, images, fonts, JS files → separate HTTP requests
- HTTP/2 multiplexing sends multiple resources over one connection`,
    category: 'General Web Development',
    difficulty: 'Intermediate',
    tags: ['web', 'networking', 'browser', 'http'],
    author: 'AlgoView Team',
    upvotes: 210,
    views: 5200,
    createdAt: '2026-01-01',
    isVerified: true,
  },
  {
    id: 'qa-web-002',
    question: 'What is CORS and how do you fix CORS errors?',
    answer: `**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that restricts web pages from making requests to a different origin (domain, protocol, or port) than the one that served the page.

**Same-origin example:**
\`\`\`
Page:     https://mysite.com/page
API:      https://mysite.com/api  ✅ Same origin
\`\`\`

**Cross-origin example:**
\`\`\`
Page:     https://mysite.com
API:      https://api.mysite.com  ❌ Different subdomain
API:      http://mysite.com       ❌ Different protocol
API:      https://mysite.com:8080 ❌ Different port
\`\`\`

**How CORS works:**
1. Browser sends **preflight request** (OPTIONS) for non-simple requests
2. Server responds with allowed origins, methods, headers
3. If allowed, browser sends actual request

**Fix CORS on the server (Express):**
\`\`\`javascript
const cors = require('cors');

// Allow all origins (development only!)
app.use(cors());

// Production: specific origins
app.use(cors({
  origin: ['https://mysite.com', 'https://www.mysite.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // allow cookies
  maxAge: 86400 // cache preflight for 24h
}));
\`\`\`

**Common CORS headers:**
\`\`\`
Access-Control-Allow-Origin: https://mysite.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
\`\`\`

**Development workarounds:**
- Vite/CRA proxy configuration
- Browser extensions (dev only!)
- Nginx reverse proxy`,
    category: 'General Web Development',
    difficulty: 'Beginner',
    tags: ['cors', 'security', 'http', 'web'],
    author: 'AlgoView Team',
    upvotes: 156,
    views: 3400,
    createdAt: '2026-01-07',
    isVerified: true,
  },
  {
    id: 'qa-web-003',
    question: 'What are Web Performance optimization techniques?',
    answer: `**Core Web Vitals (Google metrics):**
- **LCP (Largest Contentful Paint)** — < 2.5s (loading)
- **FID/INP (Interaction to Next Paint)** — < 200ms (interactivity)
- **CLS (Cumulative Layout Shift)** — < 0.1 (visual stability)

**Optimization Techniques:**

**1. Reduce Bundle Size**
\`\`\`javascript
// Code splitting with React.lazy
const Dashboard = lazy(() => import('./Dashboard'));

// Tree shaking — import only what you need
import { debounce } from 'lodash-es'; // ✅
import _ from 'lodash'; // ❌ imports entire library
\`\`\`

**2. Image Optimization**
- Use WebP/AVIF formats (30-50% smaller than JPEG)
- Lazy load below-fold images: \`<img loading="lazy">\`
- Responsive images: \`<img srcset="...">\`
- Use CDN for static assets

**3. Caching**
\`\`\`
Cache-Control: public, max-age=31536000 (static assets)
Cache-Control: no-cache (HTML pages)
ETag: "abc123" (conditional requests)
\`\`\`

**4. Network Optimization**
- HTTP/2 multiplexing
- Preload critical resources: \`<link rel="preload">\`
- Prefetch future pages: \`<link rel="prefetch">\`
- gzip/Brotli compression

**5. Rendering Optimization**
\`\`\`javascript
// Debounce expensive operations
const handleResize = debounce(() => { /* ... */ }, 250);

// Use requestAnimationFrame for visual updates
requestAnimationFrame(() => updateUI());

// Virtualize long lists (react-window)
import { FixedSizeList } from 'react-window';
\`\`\`

**6. JavaScript Optimization**
- Defer non-critical JS: \`<script defer>\`
- Move heavy computation to Web Workers
- Avoid layout thrashing (batch DOM reads/writes)`,
    category: 'General Web Development',
    difficulty: 'Advanced',
    tags: ['performance', 'optimization', 'web-vitals'],
    author: 'AlgoView Team',
    upvotes: 143,
    views: 3000,
    createdAt: '2026-02-03',
    isVerified: true,
  },
  {
    id: 'qa-web-004',
    question: 'Explain the difference between localStorage, sessionStorage, and cookies.',
    answer: `All three are client-side storage mechanisms, but they differ in scope, persistence, and behavior:

| Feature | localStorage | sessionStorage | Cookies |
|---------|-------------|----------------|---------|
| Capacity | ~5-10 MB | ~5-10 MB | ~4 KB |
| Persistence | Until cleared | Until tab closes | Until expiration |
| Sent with requests | No | No | Yes (every request) |
| Accessible from | Same origin | Same origin + tab | Same origin (configurable) |
| Server access | No | No | Yes (via headers) |
| API | Web Storage API | Web Storage API | document.cookie |

\`\`\`javascript
// localStorage — persists across sessions
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme'); // 'dark'
localStorage.removeItem('theme');
localStorage.clear(); // remove all

// sessionStorage — cleared when tab closes
sessionStorage.setItem('formDraft', JSON.stringify(formData));
sessionStorage.getItem('formDraft');

// Cookies — sent to server with every request
document.cookie = "token=abc123; path=/; max-age=3600; Secure; SameSite=Strict";

// Modern cookie API (experimental)
await cookieStore.set({ name: 'token', value: 'abc123', expires: Date.now() + 3600000 });
\`\`\`

**When to use what:**
- **localStorage** — Theme preference, user settings, cached data
- **sessionStorage** — Form drafts, temporary UI state, wizard progress
- **Cookies** — Authentication tokens, session IDs, server-side tracking

**Security considerations:**
- Never store sensitive data (passwords, PII) in localStorage
- Use \`httpOnly\` cookies for auth tokens (not accessible via JS)
- Set \`Secure\` flag for HTTPS-only cookies
- Use \`SameSite=Strict\` to prevent CSRF attacks`,
    category: 'General Web Development',
    difficulty: 'Beginner',
    tags: ['storage', 'cookies', 'web-apis', 'security'],
    author: 'AlgoView Team',
    upvotes: 167,
    views: 3600,
    createdAt: '2026-01-19',
    isVerified: true,
  },
]

// Helper functions
export const getQACategories = () => {
  const categories = new Set(sampleQAData.map(q => q.category))
  return Array.from(categories).sort()
}

export const getQADifficulties = () => ['Beginner', 'Intermediate', 'Advanced']

export const filterQAData = ({
  data = sampleQAData,
  searchQuery = '',
  category = '',
  difficulty = '',
  sortBy = 'upvotes',
}) => {
  let filtered = [...data]

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      q =>
        q.question.toLowerCase().includes(query) ||
        q.answer.toLowerCase().includes(query) ||
        q.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(q => q.category === category)
  }

  if (difficulty && difficulty !== 'All') {
    filtered = filtered.filter(q => q.difficulty === difficulty)
  }

  // Sort
  switch (sortBy) {
    case 'upvotes':
      filtered.sort((a, b) => b.upvotes - a.upvotes)
      break
    case 'views':
      filtered.sort((a, b) => b.views - a.views)
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'difficulty':
      const diffOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 }
      filtered.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty])
      break
    default:
      break
  }

  return filtered
}

/**
 * Documentation Configuration
 * Scalable structure for documentation entries grouped by category
 * Supports embedded viewing and external links
 */

export const documentationConfig = [
  // React Documentation
  {
    id: 'react-basics-001',
    title: 'React Fundamentals & JSX',
    category: 'React',
    description: 'Understanding React components, JSX syntax, and component lifecycle. Learn functional components and hooks.',
    difficulty: 'Beginner',
    docUrl: 'https://react.dev/learn',
    embedAllowed: false,
    icon: 'FaReact'
  },
  {
    id: 'react-hooks-002',
    title: 'React Hooks Deep Dive',
    category: 'React',
    description: 'Master useState, useEffect, useContext, useReducer, and custom hooks. Build stateful components efficiently.',
    difficulty: 'Intermediate',
    docUrl: 'https://react.dev/reference/react/hooks',
    embedAllowed: false,
    icon: 'FaReact'
  },
  {
    id: 'react-performance-003',
    title: 'React Performance Optimization',
    category: 'React',
    description: 'Optimize renders with useMemo, useCallback, memo. Understand reconciliation and key strategies.',
    difficulty: 'Advanced',
    docUrl: 'https://react.dev/learn/render-and-commit',
    embedAllowed: false,
    icon: 'FaReact'
  },
  {
    id: 'react-testing-004',
    title: 'React Testing Library',
    category: 'React',
    description: 'Write unit and integration tests for React components. Best practices and testing patterns.',
    difficulty: 'Intermediate',
    docUrl: 'https://testing-library.com/docs/react-testing-library/intro/',
    embedAllowed: false,
    icon: 'FaReact'
  },

  // JavaScript Documentation
  {
    id: 'js-es6-001',
    title: 'ES6+ Syntax & Features',
    category: 'JavaScript',
    description: 'Arrow functions, destructuring, spread operator, async/await. Modern JavaScript essentials.',
    difficulty: 'Beginner',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    embedAllowed: false,
    icon: 'FaJsSquare'
  },
  {
    id: 'js-async-002',
    title: 'Asynchronous Programming',
    category: 'JavaScript',
    description: 'Callbacks, Promises, async/await. Handle asynchronous operations and error handling.',
    difficulty: 'Intermediate',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous',
    embedAllowed: false,
    icon: 'FaJsSquare'
  },
  {
    id: 'js-closures-003',
    title: 'Closures & Scope',
    category: 'JavaScript',
    description: 'Understanding lexical scope, closures, and the scope chain. Common pitfalls and best practices.',
    difficulty: 'Advanced',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
    embedAllowed: false,
    icon: 'FaJsSquare'
  },
  {
    id: 'js-prototypes-004',
    title: 'Prototypal Inheritance',
    category: 'JavaScript',
    description: 'Prototype chain, Object creation patterns, and class syntax. Master object-oriented JavaScript.',
    difficulty: 'Advanced',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain',
    embedAllowed: false,
    icon: 'FaJsSquare'
  },

  // Node.js Documentation
  {
    id: 'nodejs-basics-001',
    title: 'Node.js Fundamentals',
    category: 'Node.js',
    description: 'Modules, NPM, event loop, and streams. Get started with server-side JavaScript.',
    difficulty: 'Beginner',
    docUrl: 'https://nodejs.org/en/docs/guides/getting-started-guide/',
    embedAllowed: false,
    icon: 'FaNode'
  },
  {
    id: 'nodejs-express-002',
    title: 'Express.js Server Framework',
    category: 'Node.js',
    description: 'Build REST APIs with Express. Routing, middleware, error handling, and authentication.',
    difficulty: 'Intermediate',
    docUrl: 'https://expressjs.com/en/starter/basic-routing.html',
    embedAllowed: false,
    icon: 'FaNode'
  },
  {
    id: 'nodejs-streams-003',
    title: 'Streams & File Handling',
    category: 'Node.js',
    description: 'Working with streams for efficient data processing. File operations and best practices.',
    difficulty: 'Advanced',
    docUrl: 'https://nodejs.org/en/docs/guides/backpressuring-in-streams/',
    embedAllowed: false,
    icon: 'FaNode'
  },

  // Firebase Documentation
  {
    id: 'firebase-auth-001',
    title: 'Firebase Authentication',
    category: 'Firebase',
    description: 'Implement user authentication. Email/password, social login, and user management.',
    difficulty: 'Intermediate',
    docUrl: 'https://firebase.google.com/docs/auth',
    embedAllowed: false,
    icon: 'FaFire'
  },
  {
    id: 'firebase-firestore-002',
    title: 'Firestore Database',
    category: 'Firebase',
    description: 'Cloud Firestore for real-time data storage. Collections, documents, queries, and security rules.',
    difficulty: 'Intermediate',
    docUrl: 'https://firebase.google.com/docs/firestore',
    embedAllowed: false,
    icon: 'FaFire'
  },
  {
    id: 'firebase-storage-003',
    title: 'Firebase Storage',
    category: 'Firebase',
    description: 'Store and retrieve user files. Upload, download, and manage file permissions.',
    difficulty: 'Beginner',
    docUrl: 'https://firebase.google.com/docs/storage',
    embedAllowed: false,
    icon: 'FaFire'
  },
  {
    id: 'firebase-security-004',
    title: 'Firebase Security Rules',
    category: 'Firebase',
    description: 'Write security rules for Firestore and Storage. Protect user data and enforce access control.',
    difficulty: 'Advanced',
    docUrl: 'https://firebase.google.com/docs/firestore/security/start',
    embedAllowed: false,
    icon: 'FaFire'
  },

  // Data Structures Documentation
  {
    id: 'dsa-arrays-001',
    title: 'Arrays & Lists',
    category: 'Data Structures',
    description: 'Understand arrays, dynamic arrays, and list operations. Time and space complexity analysis.',
    difficulty: 'Beginner',
    docUrl: 'https://www.geeksforgeeks.org/array-data-structure/',
    embedAllowed: false,
    icon: 'FaDatabase'
  },
  {
    id: 'dsa-linkedlist-002',
    title: 'Linked Lists',
    category: 'Data Structures',
    description: 'Singly, doubly, and circular linked lists. Implementation and common operations.',
    difficulty: 'Intermediate',
    docUrl: 'https://www.geeksforgeeks.org/data-structures/linked-list/',
    embedAllowed: false,
    icon: 'FaDatabase'
  },
  {
    id: 'dsa-trees-003',
    title: 'Trees & Binary Search Trees',
    category: 'Data Structures',
    description: 'Tree structures, BSTs, AVL trees, and traversal methods (in-order, pre-order, post-order).',
    difficulty: 'Intermediate',
    docUrl: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/',
    embedAllowed: false,
    icon: 'FaDatabase'
  },
  {
    id: 'dsa-graphs-004',
    title: 'Graphs & Graph Algorithms',
    category: 'Data Structures',
    description: 'Graph representation, BFS, DFS, shortest paths, and spanning trees.',
    difficulty: 'Advanced',
    docUrl: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
    embedAllowed: false,
    icon: 'FaDatabase'
  },
  {
    id: 'dsa-hashtables-005',
    title: 'Hash Tables & Hashing',
    category: 'Data Structures',
    description: 'Hash functions, collision resolution, and hash table implementation. O(1) lookups.',
    difficulty: 'Intermediate',
    docUrl: 'https://www.geeksforgeeks.org/hashing-set-1-introduction/',
    embedAllowed: false,
    icon: 'FaDatabase'
  },
  {
    id: 'dsa-heaps-006',
    title: 'Heaps & Priority Queues',
    category: 'Data Structures',
    description: 'Min/max heaps, priority queues, and heap sort. Applications and implementation.',
    difficulty: 'Advanced',
    docUrl: 'https://www.geeksforgeeks.org/binary-heap/',
    embedAllowed: false,
    icon: 'FaDatabase'
  },

  // Algorithms Documentation
  {
    id: 'algo-sorting-001',
    title: 'Sorting Algorithms',
    category: 'Algorithms',
    description: 'Bubble, merge, quick, heap sort. Time/space complexity and use cases.',
    difficulty: 'Intermediate',
    docUrl: 'https://www.geeksforgeeks.org/sorting-algorithms/',
    embedAllowed: false,
    icon: 'FaCodeBranch'
  },
  {
    id: 'algo-searching-002',
    title: 'Searching Algorithms',
    category: 'Algorithms',
    description: 'Linear search, binary search, and advanced search techniques. Optimal implementation.',
    difficulty: 'Beginner',
    docUrl: 'https://www.geeksforgeeks.org/searching-algorithms/',
    embedAllowed: false,
    icon: 'FaCodeBranch'
  },
  {
    id: 'algo-dp-003',
    title: 'Dynamic Programming',
    category: 'Algorithms',
    description: 'Memoization vs tabulation. Common DP problems: knapsack, LCS, LIS, coin change.',
    difficulty: 'Advanced',
    docUrl: 'https://www.geeksforgeeks.org/dynamic-programming/',
    embedAllowed: false,
    icon: 'FaCodeBranch'
  },
  {
    id: 'algo-greedy-004',
    title: 'Greedy Algorithms',
    category: 'Algorithms',
    description: 'Greedy approach, activity selection, Huffman coding, and Kruskal/Prim algorithms.',
    difficulty: 'Intermediate',
    docUrl: 'https://www.geeksforgeeks.org/greedy-algorithms/',
    embedAllowed: false,
    icon: 'FaCodeBranch'
  },

  // System Design Documentation
  {
    id: 'sysdesign-scalability-001',
    title: 'Scalability & Load Balancing',
    category: 'System Design',
    description: 'Horizontal/vertical scaling, load balancing strategies, and distributed systems basics.',
    difficulty: 'Advanced',
    docUrl: 'https://www.geeksforgeeks.org/system-design-tutorial/',
    embedAllowed: false,
    icon: 'FaServer'
  },
  {
    id: 'sysdesign-caching-002',
    title: 'Caching Strategies',
    category: 'System Design',
    description: 'Cache invalidation, Redis, CDNs, and caching patterns. LRU, TTL, and consistency.',
    difficulty: 'Advanced',
    docUrl: 'https://www.geeksforgeeks.org/system-design-caching/',
    embedAllowed: false,
    icon: 'FaServer'
  },
  {
    id: 'sysdesign-databases-003',
    title: 'Database Design & Optimization',
    category: 'System Design',
    description: 'SQL vs NoSQL, indexing, normalization, replication, and sharding strategies.',
    difficulty: 'Advanced',
    docUrl: 'https://www.geeksforgeeks.org/database-design-tutorial/',
    embedAllowed: false,
    icon: 'FaServer'
  },

  // Web Development Documentation
  {
    id: 'webdev-html-001',
    title: 'HTML5 & Semantic Markup',
    category: 'Web Development',
    description: 'Semantic HTML5 elements, accessibility, and SEO best practices.',
    difficulty: 'Beginner',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    embedAllowed: false,
    icon: 'FaCode'
  },
  {
    id: 'webdev-css-002',
    title: 'CSS3 & Responsive Design',
    category: 'Web Development',
    description: 'Flexbox, CSS Grid, media queries, and responsive design patterns.',
    difficulty: 'Intermediate',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    embedAllowed: false,
    icon: 'FaCode'
  },
  {
    id: 'webdev-tailwind-003',
    title: 'Tailwind CSS Framework',
    category: 'Web Development',
    description: 'Utility-first CSS. Rapid UI development, responsive utilities, and customization.',
    difficulty: 'Intermediate',
    docUrl: 'https://tailwindcss.com/docs',
    embedAllowed: false,
    icon: 'FaCode'
  },
  {
    id: 'webdev-a11y-004',
    title: 'Web Accessibility (A11y)',
    category: 'Web Development',
    description: 'WCAG standards, ARIA attributes, keyboard navigation, and screen reader support.',
    difficulty: 'Intermediate',
    docUrl: 'https://www.w3.org/WAI/ARIA/apg/',
    embedAllowed: false,
    icon: 'FaCode'
  },

  // Interview Preparation
  {
    id: 'interview-behavioral-001',
    title: 'Behavioral Interview Prep',
    category: 'Interview Preparation',
    description: 'STAR method, common questions, and strategies for tech interviews.',
    difficulty: 'Beginner',
    docUrl: 'https://www.geeksforgeeks.org/behavioral-interview-questions/',
    embedAllowed: false,
    icon: 'FaBriefcase'
  },
  {
    id: 'interview-coding-002',
    title: 'Coding Interview Strategy',
    category: 'Interview Preparation',
    description: 'Problem-solving approach, coding patterns, and optimization strategies.',
    difficulty: 'Intermediate',
    docUrl: 'https://www.geeksforgeeks.org/coding-interview-preparation/',
    embedAllowed: false,
    icon: 'FaBriefcase'
  },
  {
    id: 'interview-systemdesign-003',
    title: 'System Design Interview',
    category: 'Interview Preparation',
    description: 'Design scalable systems. Practice problems and expected solutions.',
    difficulty: 'Advanced',
    docUrl: 'https://www.geeksforgeeks.org/design-a-system-for-interview/',
    embedAllowed: false,
    icon: 'FaBriefcase'
  }
];

/**
 * Get unique categories
 */
export const getDocCategories = () => {
  const categoriesSet = new Set(documentationConfig.map(doc => doc.category));
  return Array.from(categoriesSet).sort();
};

/**
 * Get unique difficulties
 */
export const getDocDifficulties = () => {
  return ['Beginner', 'Intermediate', 'Advanced'];
};

/**
 * Get all unique tags
 */
export const getAllDocTags = () => {
  return [];
};

/**
 * Filter documentation by criteria
 */
export const filterDocumentation = ({ 
  docs = documentationConfig,
  searchQuery = '', 
  category = null, 
  difficulty = null, 
  selectedTags = [] 
}) => {
  let filtered = [...docs];

  // Search by title and description
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (category && category !== 'All') {
    filtered = filtered.filter(doc => doc.category === category);
  }

  // Filter by difficulty
  if (difficulty && difficulty !== 'All') {
    filtered = filtered.filter(doc => doc.difficulty === difficulty);
  }

  return filtered;
};

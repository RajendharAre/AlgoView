/**
 * AI Response Generator
 * Uses Gemini API with intelligent prompts as primary response generator
 * Returns markdown-formatted responses (not HTML) for clean rendering
 * 
 * IMPORTANT: This system prioritizes Gemini API responses with proper system prompts
 * Fallback to hardcoded responses only when API is unavailable
 */

/**
 * Check if user is requesting a table format
 * @param {string} input - User input
 * @returns {boolean} True if user is asking for a table
 */
function isTableRequest(input) {
  const tableKeywords = ['table', 'spreadsheet', 'grid', 'format', 'structure', 'list', 'comparison', 'problems solved', 'problem tracking', 'chart', 'organize'];
  const inputLower = input.toLowerCase();
  
  return tableKeywords.some(keyword => inputLower.includes(keyword));
}

/**
 * Get enhanced system prompt for table generation
 * @param {string} input - User input
 * @returns {string} System prompt with table-specific instructions
 */
function getTableFormattingPrompt(input) {
  return `You are a data formatter.

CRITICAL: When the user asks for a table or structured data:

STRICT RULES:
- Return ONLY a valid GitHub-flavored Markdown table
- Do NOT write any text before the table
- Do NOT write any explanation after the table
- Do NOT use bullet points inside cells
- Do NOT wrap lines inside cells
- Every row MUST have the exact same number of columns
- Use plain text only (no special formatting, no paragraphs)
- For missing values, use "-"

TABLE COLUMNS (for problem tracking):
Problem Name | Platform | Problem Link | Topics | Difficulty | Status | Date Solved | Time Taken (min) | Time Complexity | Space Complexity | Solution Link | Notes

STRUCTURE:
| Column 1 | Column 2 | Column 3 | ... |
|---|---|---|---|
| Data | Data | Data | ... |

EXAMPLE:
| Problem Name | Platform | Problem Link | Topics | Difficulty | Status | Date Solved | Time Taken (min) | Time Complexity | Space Complexity | Solution Link | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Two Sum | LeetCode | https://leetcode.com/problems/two-sum | Array, Hash Map | Easy | Solved | 2023-01-15 | 15 | O(n) | O(n) | https://github.com/user/solutions | Use hash map |

Original user request: "${input}"

Now generate the table following the rules above.`;
}

/**
 * System prompt that guides the AI behavior
 * This tells Gemini how to act and what to prioritize
 */
const SYSTEM_PROMPT = `You are AlgoView AI, a comprehensive educational assistant specializing in helping users learn about:

1. **Algorithms & Data Structures (DSA)**
   - Sorting algorithms (Quick, Merge, Bubble, etc.)
   - Searching algorithms (Binary, Linear)
   - Graph algorithms (DFS, BFS, Dijkstra, etc.)
   - Data structures (Arrays, Trees, Hash Maps, Heaps, etc.)
   - Time/Space complexity analysis

2. **Web Development**
   - Frontend: HTML, CSS, JavaScript, React, Vue, Angular
   - Backend: Node.js, Express, databases
   - Full-stack concepts and best practices
   - Development tools and workflows

3. **Learning Roadmaps & Career Guidance**
   - Structured learning paths for DSA, Web Dev, Full-Stack
   - Interview preparation guidance
   - Career progression and specialization paths

4. **Resources & Recommendations**
   - Books, online courses, tutorial platforms
   - Practice websites and communities
   - Learning strategies and best practices

**RESPONSE FORMATTING RULES (IMPORTANT):**
- Use clear markdown headers: # for main topics, ## for subtopics, ### for sections
- Use **bold** for key concepts, terms, and important points
- Use \`inline code\` for variables, functions, syntax elements
- Use fenced code blocks with language labels for all code examples:
  \`\`\`javascript
  // code here
  \`\`\`
- Separate explanations from code blocks with blank lines
- Use bullet points (-) for lists, numbered (1.) for steps
- Break content into logical sections with proper spacing
- Create visual hierarchy: big ideas → details → examples
- Use --- to separate major sections when needed
- Keep paragraphs concise and scannable

**TABLE FORMATTING (CRITICAL):**
When generating tables, you MUST follow these strict rules:
- Return ONLY a valid GitHub-flavored Markdown table
- Do NOT write any text before or after the table
- Do NOT explain anything around the table
- Do NOT use bullet points inside cells
- Do NOT wrap lines - keep cells on single lines
- Every row MUST have the exact same number of columns
- Use plain text only inside cells (no inline paragraphs, no special formatting)
- Use "-" for any missing or empty values
- For Problem Tracking Tables specifically, use these exact columns in this order:
  Problem Name | Platform | Problem Link | Topics | Difficulty | Status | Date Solved | Time Taken (min) | Time Complexity | Space Complexity | Solution Link | Notes

**EXAMPLE TABLE FORMAT:**
| Problem Name | Platform | Problem Link | Topics | Difficulty | Status | Date Solved | Time Taken (min) | Time Complexity | Space Complexity | Solution Link | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Two Sum | LeetCode | https://leetcode.com/problems/two-sum | Array, Hash Map | Easy | Solved | 2023-01-15 | 15 | O(n) | O(n) | https://github.com/user/solutions | Use hash map for O(n) solution |
| Merge Intervals | LeetCode | https://leetcode.com/problems/merge-intervals | Array, Sorting | Medium | Solved | 2023-02-10 | 30 | O(n log n) | O(n) | https://github.com/user/solutions | Sort by start time |

**EXAMPLE FORMAT (for non-table responses):**
## Topic Name

Brief introduction explaining the concept.

### Key Points
- Point 1 with explanation
- Point 2 with explanation
- Point 3 with explanation

### Example
Here's a practical example:

\`\`\`javascript
// Code example here
\`\`\`

**Explanation**: Brief explanation of what the code does.

---

**BEHAVIOR GUIDELINES:**
- Always provide clear, educational explanations
- Include time/space complexity for algorithms
- Suggest learning paths when appropriate
- Recommend resources (books, courses, platforms)
- Use markdown formatting for maximum readability
- Be encouraging and supportive

**IMPORTANT: Off-Topic Handling**
If user asks about topics NOT related to learning (movies, music, jokes, celebrities, sports, etc.):
- Politely acknowledge the question
- Explain that you focus on education: algorithms, web development, learning paths, and resources
- Suggest an educational topic they could learn about instead
- Stay friendly and helpful

**TONE:**
- Professional but friendly
- Clear and concise explanations
- Educational focus
- Helpful and encouraging

You are an expert educator. Provide the best possible learning experience with clean, ChatGPT-style formatting.`;

/**
 * Generate AI response based on user input
 * @param {string} input - User input text
 * @returns {Promise<string>} Markdown formatted response from Gemini AI
 */
export async function generateResponse(input) {
  // Check if Gemini API key is available
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('🤖 Initializing AI response generator...');
  console.log('Gemini API Key available:', geminiApiKey ? '✅ Yes' : '❌ No');
  
  // Detect if user is asking for a table
  const requestingTable = isTableRequest(input);
  const systemPrompt = requestingTable ? getTableFormattingPrompt(input) : SYSTEM_PROMPT;
  
  if (requestingTable) {
    console.log('📊 Detected table request - using specialized table formatting prompt');
  }
  
  // Try to use Gemini API with system prompt
  if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
    try {
      console.log('📡 Connecting to Gemini API...');
      console.log('👤 User query:', input);
      const response = await callGeminiAPI(input, systemPrompt);
      console.log('✅ Gemini AI response received successfully');
      return response;
    } catch (error) {
      console.warn('⚠️ Gemini API Error:', error.message);
      console.log('📋 Falling back to default response...');
      return getDefaultResponse(input);
    }
  } else {
    console.log('⚠️ Gemini API key not configured');
    console.log('💾 Using default response (add VITE_GEMINI_API_KEY to .env for better AI responses)');
    return getDefaultResponse(input);
  }
}

/**
 * Call the Gemini API with system prompt
 * @param {string} input - User input
 * @param {string} systemPrompt - System prompt to guide AI behavior
 * @returns {Promise<string>} Markdown formatted AI response
 */
async function callGeminiAPI(input, systemPrompt) {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  try {
    console.log('🔄 Preparing API request with system prompt...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: systemPrompt
          }]
        },
        contents: [{
          parts: [{
            text: input
          }]
        }]
      })
    });
    
    console.log('📨 API request sent, waiting for response...');
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('📦 Response data received from Gemini');
    
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!textResponse) {
      console.warn('⚠️ Empty response from Gemini API');
      throw new Error('Empty response from Gemini API');
    }
    
    console.log('✅ AI response extracted successfully');
    return textResponse;
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Get default response when API is not available
 * Returns markdown formatted response (not HTML)
 * @param {string} input - User input text
 * @returns {string} Markdown formatted response
 */
function getDefaultResponse(input) {
  const text = input.toLowerCase();

  // ============================================
  // OFF-TOPIC FILTER - Politely redirect non-educational queries
  // ============================================
  const offTopicKeywords = ['movie', 'film', 'music', 'song', 'game', 'sports', 'celebrity', 'entertainment', 'joke', 'meme', 'weather', 'news', 'politics'];
  const isOffTopic = offTopicKeywords.some(keyword => text.includes(keyword));
  
  if (isOffTopic && !text.includes('algorithm') && !text.includes('code') && !text.includes('development') && !text.includes('learn')) {
    return `I appreciate the question, but I'm specifically designed to help with:

### 📚 What I Can Help With:
- **Algorithms & Data Structures** (Sorting, Searching, Graph algorithms, etc.)
- **Web Development** (HTML, CSS, JavaScript, React, Node.js, etc.)
- **Learning Roadmaps** (DSA paths, Web dev paths, career guidance)
- **Resources & Tutorials** (Books, courses, practice platforms)
- **Code Explanations** (How does this code work?)
- **Interview Prep** (Algorithm problems, coding questions)

### ❌ What I Can't Help With:
- Movies, music, entertainment
- Sports, celebrities, current events
- General trivia or non-educational topics

**Feel free to ask me about algorithms, web development, or learning paths!** 🚀`;
  }

  // ============================================
  // WEB DEVELOPMENT PATTERNS
  // ============================================

  // HTML/CSS/JavaScript fundamentals
  if ((text.includes("html") || text.includes("css")) && !text.includes("algorithm")) {
    return `### HTML & CSS Fundamentals

**HTML (HyperText Markup Language):**
- Structure and semantic meaning
- Tags, elements, attributes
- Best practices and accessibility
- SEO optimization

**CSS (Cascading Style Sheets):**
- Selectors and properties
- Box model, flexbox, grid
- Responsive design
- Animations and transitions

**Getting Started:**
1. Learn HTML basics (semantic tags)
2. Learn CSS fundamentals (layout, positioning)
3. Practice responsive design
4. Learn CSS frameworks (Tailwind, Bootstrap)

**Resources:**
- MDN Web Docs
- CSS-Tricks
- Codecademy
- FreeCodeCamp`;
  }

  // React framework
  if (text.includes("react") && !text.includes("react native")) {
    return `### React.js Explained

**What is React?**
A JavaScript library for building user interfaces with reusable components.

**Core Concepts:**
- **Components** - Functional and class-based
- **JSX** - JavaScript XML syntax
- **State** - Component data management
- **Props** - Component properties/arguments
- **Hooks** - useState, useEffect, useContext, etc.
- **Virtual DOM** - Efficient rendering

**Learning Path:**
1. JavaScript fundamentals (ES6+)
2. JSX and components
3. State and props
4. Hooks (useEffect, useState, etc.)
5. Context API and state management
6. Routing (React Router)
7. Advanced patterns

**Popular Tools:**
- Vite (fast build tool)
- Create React App (project setup)
- Redux or Zustand (state management)
- React Router (routing)

**Best for:** Interactive web applications, SPAs, dynamic UIs`;
  }

  // JavaScript fundamentals
  if (text.includes("javascript") && !text.includes("java ")) {
    return `### JavaScript Fundamentals

**Core Concepts:**
- Variables and scope
- Data types and type coercion
- Functions and closures
- Objects and arrays
- Async/await and promises
- Event handling
- DOM manipulation

**ES6+ Features:**
- Arrow functions
- Destructuring
- Template literals
- Classes and inheritance
- Modules (import/export)
- Spread operator
- Default parameters

**Learning Path:**
1. Basic syntax and variables
2. Functions and scope
3. Objects and arrays
4. Async programming
5. DOM manipulation
6. ES6+ modern features
7. Advanced patterns

**Common Use Cases:**
- Frontend development
- Backend (Node.js)
- Full-stack applications
- Automation and scripting`;
  }

  // Node.js backend
  if (text.includes("node") && (text.includes("backend") || text.includes("server"))) {
    return `### Node.js Backend Development

**What is Node.js?**
JavaScript runtime for building server-side applications.

**Core Concepts:**
- Modules and NPM packages
- File system operations
- HTTP servers
- Middleware
- Routing
- Databases
- Authentication

**Popular Frameworks:**
- **Express.js** - Web framework
- **FastAPI** - Data validation
- **Socket.io** - Real-time communication
- **Sequelize/Mongoose** - ORMs

**Learning Path:**
1. Node.js basics and modules
2. Express.js fundamentals
3. REST API development
4. Database integration (SQL/NoSQL)
5. Authentication and authorization
6. Deployment and DevOps

**Common Tasks:**
- Build REST APIs
- Handle requests/responses
- Work with databases
- Implement authentication`;
  }

  // Database questions
  if ((text.includes("database") || text.includes("sql") || text.includes("mongodb")) && !text.includes("algorithm")) {
    return `### Databases & SQL

**SQL (Relational):**
- PostgreSQL, MySQL, MariaDB
- Structured data with tables
- Strong consistency (ACID)
- Complex queries with joins

**NoSQL (Non-Relational):**
- MongoDB, Firebase, DynamoDB
- Document/JSON-based storage
- Flexible schemas
- Good for unstructured data

**Key Concepts:**
- Tables/Collections
- CRUD operations (Create, Read, Update, Delete)
- Relationships and normalization
- Indexes for performance
- Transactions and constraints

**Learning Path:**
1. Understand ACID properties
2. Learn SQL basics (SELECT, INSERT, UPDATE, DELETE)
3. Learn JOINs and relationships
4. Understand indexing
5. Learn about NoSQL for unstructured data
6. Optimization and scaling

**When to Use:**
- SQL: Structured data, complex relationships
- NoSQL: Flexible schema, rapid scaling`;
  }

  // ============================================
  // LEARNING ROADMAPS & PATHS
  // ============================================

  // DSA learning roadmap
  if ((text.includes("dsa") || text.includes("data structure")) && (text.includes("roadmap") || text.includes("path") || text.includes("learning"))) {
    return `### Data Structures & Algorithms Learning Roadmap

**Level 1: Foundations (1-2 weeks)**
- Big O Notation and complexity analysis
- Arrays and linked lists
- Basic operations (insert, delete, search)
- Time/space complexity concepts

**Level 2: Sorting & Searching (2-3 weeks)**
- Bubble Sort, Insertion Sort
- Merge Sort, Quick Sort
- Binary Search, Linear Search
- When to use each algorithm

**Level 3: Data Structures (3-4 weeks)**
- Stacks and Queues
- Trees (Binary, BST, AVL)
- Hash Maps and Hash Sets
- Heaps and Priority Queues

**Level 4: Graphs (2-3 weeks)**
- Graph representation
- DFS and BFS
- Dijkstra's algorithm
- Topological sorting

**Level 5: Advanced (4+ weeks)**
- Dynamic Programming
- Greedy algorithms
- Backtracking
- Graph algorithms (Floyd-Warshall, etc.)

**Resources:**
- LeetCode (practice problems)
- GeeksforGeeks (tutorials)
- AlgoExpert (video course)
- InterviewBit (interview prep)`;
  }

  // Web development roadmap
  if ((text.includes("web") || text.includes("frontend") || text.includes("fullstack")) && (text.includes("roadmap") || text.includes("path") || text.includes("learning"))) {
    return `### Web Development Learning Roadmap

**Level 1: Fundamentals (2-3 weeks)**
- HTML basics (semantic tags)
- CSS fundamentals (box model, flexbox)
- JavaScript basics (variables, functions)
- DOM manipulation

**Level 2: Intermediate (3-4 weeks)**
- Advanced CSS (grid, animations)
- ES6+ JavaScript features
- Async programming (promises, async/await)
- APIs and HTTP requests

**Level 3: Frameworks (4-6 weeks)**
- React.js (components, hooks, state)
- React Router (client-side routing)
- State management (Redux, Context API)
- Component libraries

**Level 4: Backend Basics (3-4 weeks)**
- Node.js fundamentals
- Express.js (REST APIs)
- Database integration
- Authentication and authorization

**Level 5: Advanced (4+ weeks)**
- TypeScript for type safety
- Testing (Jest, React Testing Library)
- Deployment and DevOps
- Scalability and performance optimization

**Recommended Path:**
Frontend Focus → React → Backend → Full-stack

**Resources:**
- FreeCodeCamp (YouTube courses)
- The Odin Project (full curriculum)
- Codecademy (interactive learning)
- MDN Web Docs (reference)`;
  }

  // Career/interview roadmap
  if ((text.includes("interview") || text.includes("career") || text.includes("job")) && text.includes("roadmap")) {
    return `### Interview Preparation Roadmap

**Phase 1: Foundation Building (4 weeks)**
- Master DSA concepts
- Practice 50+ easy problems
- Learn system design basics
- Understand Big O analysis

**Phase 2: Problem Solving (8 weeks)**
- Practice 100+ medium problems
- Learn common patterns:
  - Sliding window
  - Two pointers
  - Binary search
  - Dynamic programming
  - Graph traversal

**Phase 3: System Design (6 weeks)**
- Database design
- API design
- Scalability concepts
- Caching and optimization
- Practice design interviews

**Phase 4: Interview Skills (2 weeks)**
- Mock interviews
- Behavioral questions
- Communication skills
- Time management

**Key Topics to Master:**
1. Arrays, Strings, Linked Lists
2. Stacks, Queues
3. Trees, Graphs
4. Sorting, Searching
5. Dynamic Programming
6. System Design

**Practice Platforms:**
- LeetCode (1500+ problems)
- HackerRank (interactive)
- InterviewBit (curated)
- Pramp (mock interviews)`;
  }

  // ============================================
  // RESOURCES & RECOMMENDATIONS
  // ============================================

  // Resources request
  if (text.includes("resource") || text.includes("book") || text.includes("course") || text.includes("tutorial")) {
    return `### Recommended Learning Resources

**Books:**
- **CLRS** - Introduction to Algorithms (comprehensive)
- **Cracking the Coding Interview** - Interview prep
- **Design Patterns** - Software architecture
- **Eloquent JavaScript** - JavaScript fundamentals

**Online Platforms:**
- **LeetCode** - Algorithm practice (coding interview prep)
- **GeeksforGeeks** - DSA tutorials and articles
- **InterviewBit** - Curated interview questions
- **FreeCodeCamp** - Full courses (YouTube/web)
- **The Odin Project** - Complete web dev curriculum
- **Codecademy** - Interactive learning

**YouTube Channels:**
- **Abdul Bari** - DSA fundamentals
- **Errichto** - Competitive programming
- **Traversy Media** - Web development
- **Kevin Powell** - CSS mastery
- **FreeCodeCamp** - Complete courses

**Communities:**
- Stack Overflow (Q&A)
- GitHub (open source)
- Reddit (r/learnprogramming)
- Discord communities

**Choose Based On:**
- Your learning style (video, text, interactive)
- Your level (beginner, intermediate, advanced)
- Your goal (DSA, web dev, interview prep)
- Your pace (self-paced, structured)`;
  }

  // Handle DFS vs BFS comparison
  if ((text.includes("dfs") || text.includes("depth first")) && (text.includes("bfs") || text.includes("breadth first")) && (text.includes("vs") || text.includes("compare") || text.includes("difference"))) {
    return `### DFS vs BFS

| Feature | DFS | BFS |
|---------|-----|-----|
| **Algorithm** | Depth-First | Breadth-First |
| **Data Structure** | Stack | Queue |
| **Time Complexity** | O(V + E) | O(V + E) |
| **Space Complexity** | O(V) | O(V) |
| **Implementation** | Recursive/Iterative | Iterative (Queue) |
| **Traversal Order** | Goes deep first | Goes level-by-level |

**When to use DFS:**
- Topological sorting
- Cycle detection
- Path finding in mazes
- Connected components

**When to use BFS:**
- Shortest path (unweighted)
- Level-order traversal
- Social network distances
- Finding closest node`;
  }

  // Handle comparisons (difference between X and Y)
  if ((text.includes("difference") || text.includes("compare")) && (text.includes("quick") || text.includes("quicksort")) && (text.includes("bubble") || text.includes("bubblesort"))) {
    return `### QuickSort vs Bubble Sort

| Feature | Quick Sort | Bubble Sort |
|---------|-----------|-----------|
| **Algorithm Type** | Divide and Conquer | Comparison-based |
| **Best Case** | O(n log n) | O(n) |
| **Average Case** | O(n log n) | O(n²) |
| **Worst Case** | O(n²) | O(n²) |
| **Space Complexity** | O(log n) | O(1) |
| **Stable** | No | Yes |
| **In-place** | Yes | Yes |

**When to use Quick Sort:**
- General purpose sorting
- Large datasets
- When performance is critical

**When to use Bubble Sort:**
- Nearly sorted data
- Educational purposes
- Tiny datasets`;
  }

  // Merge Sort
  if (text.includes("merge") && text.includes("sort")) {
    return `### Merge Sort Explained

**Merge Sort** is a **divide and conquer** algorithm.

**Steps:**
1. Divide the array into halves
2. Recursively sort each half
3. Merge the sorted halves

**Complexity:**
- **Time:** O(n log n) - guaranteed
- **Space:** O(n)

**Best for:** 
- When you need guaranteed O(n log n)
- External sorting
- Stable sorting is required`;
  }

  // Bubble Sort
  if (text.includes("bubble") && text.includes("sort")) {
    return `### Bubble Sort Explained

Bubble Sort repeatedly compares adjacent elements and swaps them.

**Algorithm:**
1. Compare each pair of adjacent elements
2. Swap if they're in wrong order
3. Repeat until array is sorted

**Complexity:**
- **Time:** O(n²) average and worst, O(n) best
- **Space:** O(1)

**Best for:** 
- Educational purposes
- Nearly sorted arrays
- When space is critical`;
  }

  // Quick Sort
  if (text.includes("quick") && text.includes("sort")) {
    return `### Quick Sort Explained

**Quick Sort** is a **divide and conquer** algorithm that picks a pivot element.

**Steps:**
1. Choose a pivot element
2. Partition array around pivot
3. Recursively sort sub-arrays

**Complexity:**
- **Time:** O(n log n) average, O(n²) worst case
- **Space:** O(log n)

**Best for:** 
- General purpose sorting
- Good cache locality
- Most practical sorting algorithm`;
  }

  // Binary Search
  if (text.includes("binary") && text.includes("search")) {
    return `### Binary Search Explained

Binary Search works on **sorted arrays** by repeatedly halving the search space.

**Algorithm:**
1. Compare target with middle element
2. Eliminate half of remaining elements
3. Repeat until found

**Complexity:**
- **Time:** O(log n)
- **Space:** O(1) iterative, O(log n) recursive

**Requirements:**
- Input must be sorted
- Random access needed`;
  }

  // Linear Search
  if (text.includes("linear") && text.includes("search")) {
    return `### Linear Search Explained

Linear Search checks each element sequentially.

**Algorithm:**
1. Start from first element
2. Compare with target
3. Move to next if not found

**Complexity:**
- **Time:** O(n)
- **Space:** O(1)

**Best for:**
- Unsorted data
- Small datasets
- Simple implementation`;
  }

  // DFS
  if ((text.includes("dfs") || text.includes("depth")) && text.includes("search")) {
    return `### Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking.

**Implementation:** Uses stack (recursive or iterative)

**Complexity:**
- **Time:** O(V + E) where V=vertices, E=edges
- **Space:** O(V) for recursion stack

**Use Cases:**
- Topological sorting
- Cycle detection
- Path finding
- Maze solving`;
  }

  // BFS
  if ((text.includes("bfs") || text.includes("breadth")) && text.includes("search")) {
    return `### Breadth-First Search (BFS)

BFS explores all neighbors at current depth before going deeper.

**Implementation:** Uses queue data structure

**Complexity:**
- **Time:** O(V + E) where V=vertices, E=edges
- **Space:** O(V) for queue

**Use Cases:**
- Shortest path in unweighted graphs
- Level-order traversal
- Connected components`;
  }

  // Dijkstra
  if (text.includes("dijkstra")) {
    return `### Dijkstra's Algorithm

Dijkstra finds shortest path from a source to all other vertices.

**Steps:**
1. Initialize distances (source=0, others=infinity)
2. Use priority queue to visit closest unvisited vertex
3. Update distances to neighbors
4. Repeat until all visited

**Complexity:**
- **Time:** O((V + E) log V) with binary heap
- **Space:** O(V)

**Requirements:**
- Non-negative edge weights`;
  }

  // General algorithm questions
  if (text.includes("time complexity") || text.includes("space complexity")) {
    return `### Complexity Analysis

**Big O Notation (from best to worst):**
- O(1) - Constant time
- O(log n) - Logarithmic
- O(n) - Linear
- O(n log n) - Linearithmic
- O(n²) - Quadratic
- O(n³) - Cubic
- O(2ⁿ) - Exponential
- O(n!) - Factorial

**Time Complexity** - How runtime grows with input size
**Space Complexity** - How memory usage grows with input size`;
  }

  // Data structures
  if (text.includes("data structure")) {
    return `### Common Data Structures

**Linear:**
- **Array** - O(1) access, O(n) insertion
- **Linked List** - O(n) access, O(1) insertion
- **Stack** - LIFO, O(1) operations
- **Queue** - FIFO, O(1) operations

**Tree:**
- **Binary Search Tree** - O(log n) average
- **Balanced BST** - O(log n) guaranteed
- **Heap** - O(log n) insertion/deletion

**Hash:**
- **Hash Map** - O(1) average lookup
- **Hash Set** - Fast membership testing`;
  }

  // Default welcome message (only if nothing matched)
  return `### 👋 Welcome to AlgoView AI

I'm your AI assistant for **Algorithms**, **Data Structures**, and **Web Development**!

**📚 I can help with:**

**Algorithms & DSA:**
- Sorting: QuickSort, MergeSort, BubbleSort, etc.
- Searching: Binary Search, Linear Search
- Graph: DFS, BFS, Dijkstra, Bellman-Ford
- Data Structures: Trees, Linked Lists, Hash Maps, Heaps
- Complexity: Big O notation, Time/Space analysis

**💻 Web Development:**
- HTML/CSS fundamentals
- JavaScript (ES6+, async programming)
- React.js (components, hooks, state)
- Node.js backend development
- Databases (SQL, NoSQL)

**🗺️ Learning Paths:**
- DSA learning roadmap
- Web development roadmap
- Interview preparation guide
- Career guidance

**📖 Resources:**
- Books, courses, and tutorials
- Best learning platforms
- Practice websites
- Communities and forums

**Try asking:**
- Algorithm: "Explain QuickSort" or "DFS vs BFS"
- Web Dev: "What is React?" or "HTML/CSS basics"
- Roadmap: "Web development learning path"
- Resources: "Best books for algorithms"

What would you like to learn today?`;
}

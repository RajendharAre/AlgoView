/**
 * AI Response Generator
 * Generates responses for algorithm-related queries, with fallback when API key is unavailable
 */

/**
 * Generate AI response based on user input
 * @param {string} input - User input text
 * @returns {Promise<string>} HTML formatted response
 */
export async function generateResponse(input) {
  // Check if Gemini API key is available
  // Handle both browser (Vite) and Node.js environments
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Debug log to see what we're getting
  console.log('Gemini API Key loaded:', geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'undefined');
  
  // If API key is available and not the placeholder, try to call the API
  if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
    try {
      // Attempt to call Gemini API
      console.log('Calling Gemini API for input:', input);
      const response = await callGeminiAPI(input);
      console.log('Gemini API response:', response);
      return response;
    } catch (error) {
      console.warn('Gemini API call failed, falling back to default response:', error);
      // Fall back to default response
      const fallbackResponse = getDefaultResponse(input);
      console.log('Returning fallback response:', fallbackResponse);
      return fallbackResponse;
    }
  } else {
    // No API key available, return default response
    console.log('No API key available, returning default response for input:', input);
    const defaultResponse = getDefaultResponse(input);
    console.log('Default response:', defaultResponse);
    return defaultResponse;
  }
}

/**
 * Call the Gemini API
 * @param {string} input - User input
 * @returns {Promise<string>} API response
 */
async function callGeminiAPI(input) {
  // Handle both browser (Vite) and Node.js environments
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI assistant designed to help users understand algorithms and data structures. The user has asked: "${input}". Provide a helpful response related to algorithms, data structures, or computer science concepts. If the query is about a specific algorithm, explain how it works, its time/space complexity, and use cases. If it's code-related, explain the code and suggest improvements if applicable. Format your response in HTML with proper tags for headings, paragraphs, lists, etc.`
          }]
        }]
      })
    });
    
    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Gemini API response data:', data);
    let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Convert plain text to basic HTML formatting
    const htmlResponse = convertTextToHtml(textResponse);
    console.log('Converted HTML response:', htmlResponse);
    return htmlResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Convert plain text to basic HTML formatting
 * @param {string} text - Plain text response
 * @returns {string} HTML formatted response
 */
function convertTextToHtml(text) {
  let html = text;
  
  // Remove markdown code block wrappers if present
  html = html.replace(/```html\n?/gi, '').replace(/```\n?/gi, '');
  
  // If it looks like a complete HTML document, extract just the body content
  if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
    // Extract content between body tags
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      html = bodyMatch[1];
    }
  }
  
  // Clean up the HTML content
  html = html
    .replace(/\n\s*\n/g, '</p><p>') // Multiple line breaks to paragraphs
    .replace(/\n/g, '<br/>') // Single line breaks
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>') // List items
    .replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>') // Wrap consecutive list items
    .trim();
  
  // Wrap in div with ai-response class if not already wrapped
  if (!html.includes('ai-response')) {
    html = `<div class="ai-response">${html}</div>`;
  }
  
  // Clean up multiple paragraph tags
  html = html.replace(/<\/p><p><\/p><p>/g, '</p><p>');
  
  return html;
}

/**
 * Get default response when API is not available
 * @param {string} input - User input text
 * @returns {string} Default HTML formatted response
 */
function getDefaultResponse(input) {
  const text = input.toLowerCase();

  if (text.includes("merge sort")) {
    return (
      `<div class="ai-response">
        <h3>Merge Sort Explained</h3>
        <p>Merge Sort is a <strong>divide and conquer</strong> algorithm.</p>
        <p><strong>Steps:</strong></p>
        <ol>
          <li>Divide the array into halves</li>
          <li>Recursively sort each half</li>
          <li>Merge the sorted halves</li>
        </ol>
        <p><strong>Time Complexity:</strong> O(n log n)<br/>
        <strong>Space Complexity:</strong> O(n)</p>
      </div>`
    );
  }

  if (text.includes("bubble sort")) {
    return (
      `<h3>Bubble Sort Explained</h3>
      <p>Bubble Sort repeatedly compares adjacent elements and swaps them.</p>
      <p><strong>Time Complexity:</strong> O(n²)<br/>
      <strong>Best Case:</strong> O(n)<br/>
      <strong>Space Complexity:</strong> O(1)</p>`
    );
  }

  if (text.includes("binary search")) {
    return (
      `<h3>Binary Search Explained</h3>
      <p>Binary Search works on <strong>sorted arrays</strong> by repeatedly halving the search space.</p>
      <p><strong>Time Complexity:</strong> O(log n)<br/>
      <strong>Space Complexity:</strong> O(1)</p>`
    );
  }

  if (text.includes("quick sort")) {
    return (
      `<h3>Quick Sort Explained</h3>
      <p>Quick Sort is a <strong>divide and conquer</strong> algorithm that picks a pivot element.</p>
      <p><strong>Steps:</strong></p>
      <ol>
        <li>Choose a pivot element</li>
        <li>Partition array around pivot</li>
        <li>Recursively sort sub-arrays</li>
      </ol>
      <p><strong>Time Complexity:</strong> O(n log n) average, O(n²) worst<br/>
      <strong>Space Complexity:</strong> O(log n)</p>`
    );
  }

  if (text.includes("dfs") || text.includes("depth first")) {
    return (
      `<h3>Depth-First Search (DFS) Explained</h3>
      <p>DFS explores as far as possible along each branch before backtracking.</p>
      <p><strong>Implementation:</strong> Uses stack (recursive or iterative)</p>
      <p><strong>Time Complexity:</strong> O(V + E) where V=vertices, E=edges<br/>
      <strong>Space Complexity:</strong> O(V) for recursion stack</p>
      <p><strong>Use Cases:</strong> Topological sorting, cycle detection, path finding</p>`
    );
  }

  if (text.includes("bfs") || text.includes("breadth first")) {
    return (
      `<h3>Breadth-First Search (BFS) Explained</h3>
      <p>BFS explores all neighbors at current depth before going deeper.</p>
      <p><strong>Implementation:</strong> Uses queue data structure</p>
      <p><strong>Time Complexity:</strong> O(V + E) where V=vertices, E=edges<br/>
      <strong>Space Complexity:</strong> O(V) for queue</p>
      <p><strong>Use Cases:</strong> Shortest path in unweighted graphs, level-order traversal</p>`
    );
  }

  return (
    `<div class="ai-response">
      <p>I am an AI assistant designed to help you understand algorithms and data structures. I can explain how different algorithms work, their time and space complexity, and help with code analysis.</p>
      <p><strong>You can ask me about:</strong></p>
      <ul>
        <li>Sorting algorithms (Merge Sort, Quick Sort, Bubble Sort, etc.)</li>
        <li>Searching algorithms (Binary Search, Linear Search)</li>
        <li>Graph algorithms (DFS, BFS, Dijkstra, etc.)</li>
        <li>Data structures (Trees, Linked Lists, Hash Maps, etc.)</li>
        <li>Code explanation and optimization</li>
      </ul>
      <p>Feel free to ask any question about algorithms or paste code for analysis!</p>
    </div>`
  );
}
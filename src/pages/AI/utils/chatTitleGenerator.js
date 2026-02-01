/**
 * Chat title generation utilities
 * Generates appropriate titles based on message content
 */

/**
 * Generate chat title based on message content
 * @param {string} messageContent - The user's message content
 * @returns {string} Generated chat title
 */
export function generateChatTitle(messageContent) {
  if (!messageContent || typeof messageContent !== 'string') {
    return 'New Chat';
  }

  const trimmedContent = messageContent.trim();
  
  // Check if content is code (simple heuristic)
  if (isCodeContent(trimmedContent)) {
    return 'Code Discussion';
  }

  // For very short messages
  if (trimmedContent.length < 10) {
    return 'New Chat';
  }

  // Extract first 4-6 words for title
  const words = trimmedContent.split(/\s+/);
  const titleWords = words.slice(0, 6);
  
  let title = titleWords.join(' ');
  
  // Truncate if too long
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  // Capitalize first letter
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }
  
  return title || 'New Chat';
}

/**
 * Check if content appears to be code
 * @param {string} content - Message content to check
 * @returns {boolean} True if content appears to be code
 */
function isCodeContent(content) {
  // Simple heuristics for code detection
  const codeIndicators = [
    /function\s+\w+\s*\(/,           // function declarations
    /const\s+\w+\s*=/,               // const declarations
    /let\s+\w+\s*=/,                 // let declarations
    /var\s+\w+\s*=/,                 // var declarations
    /class\s+\w+/,                   // class declarations
    /import\s+.*from/,               // import statements
    /export\s+(default\s+)?(function|class|const)/, // export statements
    /{\s*[\w\s:]+:\s*[\w\s]+[,}]/,   // object literals
    /for\s*\([^)]*\)\s*{/,           // for loops
    /if\s*\([^)]*\)\s*{/,            // if statements
    /while\s*\([^)]*\)\s*{/,         // while loops
    /console\.(log|error|warn)/,     // console statements
    /document\.(getElement|query)/,  // DOM manipulation
    /=>\s*{/,                        // arrow functions
    /[\w]+\s*\([^)]*\)\s*{/,         // function calls with braces
    /```[\s\S]*```/,                 // markdown code blocks
    /`[^`]+`/                        // inline code
  ];

  // Check for code indicators
  const hasCodeIndicators = codeIndicators.some(pattern => pattern.test(content));
  
  // Check for code-like structure
  const hasCodeStructure = (
    content.includes('{') && content.includes('}') ||
    content.includes('()') ||
    content.includes('=>') ||
    content.includes('===') ||
    content.includes('!==') ||
    content.includes('&&') ||
    content.includes('||')
  );
  
  // Check for programming keywords
  const programmingKeywords = [
    'function', 'const', 'let', 'var', 'class', 'import', 'export',
    'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'finally',
    'async', 'await', 'new', 'this', 'super', 'extends', 'static'
  ];
  
  const keywordCount = programmingKeywords.filter(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(content)
  ).length;
  
  return hasCodeIndicators || hasCodeStructure || keywordCount >= 2;
}

/**
 * Update chat title in Firestore
 * @param {string} userId - User ID
 * @param {string} chatId - Chat ID
 * @param {string} newTitle - New title to set
 * @returns {Promise<void>}
 */
export async function updateChatTitle(userId, chatId, newTitle) {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('../../../lib/firebase');
    
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    await updateDoc(chatRef, {
      title: newTitle
    });
  } catch (error) {
    console.error('Error updating chat title:', error);
    throw new Error('Failed to update chat title');
  }
}
/**
 * Markdown to JSX renderer for chat messages
 * Converts markdown text to clean, readable JSX components
 */

/**
 * Simple markdown parser that converts text to react-friendly HTML
 * Handles: headings, bold, italic, code, lists, links
 */
export function parseMarkdown(text) {
  if (!text) return '';

  let html = text;

  // Headers (h1-h6)
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold (** or __)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic (* or _)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

  // Code blocks with language
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto my-2"><code class="text-sm font-mono">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Unordered lists
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)/s, '<ul class="list-disc list-inside ml-2">$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');

  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;

  // Clean up multiple paragraph tags
  html = html.replace(/<\/p><p>/g, '</p><p>');
  html = html.replace(/<p><\/p>/g, '');

  return html;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Extract plain text from message content for copy functionality
 * Removes markdown syntax and HTML
 */
export function extractPlainText(content) {
  let text = content;

  // Remove markdown syntax
  text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
  text = text.replace(/__(.*?)__/g, '$1'); // Bold alt
  text = text.replace(/\*(.*?)\*/g, '$1'); // Italic
  text = text.replace(/_(.*?)_/g, '$1'); // Italic alt
  text = text.replace(/`([^`]+)`/g, '$1'); // Inline code
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '$2'); // Code blocks
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Links
  text = text.replace(/^#+\s/gm, ''); // Headers
  text = text.replace(/^[\*\-]\s/gm, ''); // Lists
  text = text.replace(/^\d+\.\s/gm, ''); // Ordered lists

  // Clean up extra whitespace
  text = text.replace(/\n\n+/g, '\n');

  return text.trim();
}

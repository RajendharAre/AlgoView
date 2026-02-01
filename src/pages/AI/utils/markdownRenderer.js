/**
 * Markdown to JSX renderer for chat messages
 * Converts markdown text to clean, readable JSX components
 * 
 * NOTE: Code blocks are now handled by CodeBlock component in FormattedResponse
 * This renderer processes inline markdown and returns HTML for regular content
 */

/**
 * Simple markdown parser that converts text to react-friendly HTML
 * Handles: headings, bold, italic, inline code, lists, links
 * Code blocks are extracted separately for component rendering
 */
export function parseMarkdown(text) {
  if (!text) return '';

  let html = text;

  // SKIP code blocks here - they will be handled by CodeBlock component
  // Just mark them for later extraction
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    return `<div class="code-placeholder" data-code="${btoa(match)}"></div>`;
  });

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="divider">');
  html = html.replace(/^===+$/gm, '<hr class="divider">');

  // Headers (h1-h6) - must be before bold replacement
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold (** or __) - must be before italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic (* or _) - but not in words
  html = html.replace(/(?<!\w)\*(.*?)\*(?!\w)/g, '<em>$1</em>');
  html = html.replace(/(?<!\w)_(.*?)_(?!\w)/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Unordered lists
  html = html.replace(/^[\*\-] (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="markdown-list">$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');

  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>');

  // Paragraph spacing
  let paragraphs = html.split(/\n\n+/);
  paragraphs = paragraphs.map(p => {
    if (p.match(/<(h[1-6]|ul|code-placeholder|hr|li|div)/)) {
      return p;
    }
    if (p.trim() && !p.match(/^<(h|ul|li|hr|code|pre)/)) {
      return `<p>${p.trim()}</p>`;
    }
    return p;
  });
  html = paragraphs.join('');

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

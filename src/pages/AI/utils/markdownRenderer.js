/**
 * Markdown to JSX renderer for chat messages
 * Converts markdown text to clean, readable JSX components
 * 
 * NOTE: Code blocks are now handled by CodeBlock component in FormattedResponse
 * This renderer processes inline markdown and returns HTML for regular content
 */

/**
 * Parse markdown tables
 */
function parseMarkdownTables(text) {
  const tableRegex = /^(\|.*?\|)\n(\|[-\s|:]*\|)\n((?:\|.*?\|\n?)*)/gm;
  
  return text.replace(tableRegex, (match) => {
    const lines = match.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) return match;

    // Parse header cells
    const headerLine = lines[0].split('|').filter((cell, idx, arr) => {
      // Skip empty first and last elements from split
      return idx !== 0 && idx !== arr.length - 1;
    });
    const headerCells = headerLine.map(cell => cell.trim()).filter(cell => cell);
    const colCount = headerCells.length;
    
    // Validate separator line
    const separatorLine = lines[1].split('|').filter((cell, idx, arr) => {
      return idx !== 0 && idx !== arr.length - 1;
    });
    
    if (colCount === 0 || separatorLine.length !== colCount) return match;

    let table = '<table class="markdown-table"><thead><tr>';
    
    headerCells.forEach(cell => {
      table += `<th>${cell}</th>`;
    });
    
    table += '</tr></thead><tbody>';
    
    // Process body rows
    for (let i = 2; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const rowCells = lines[i].split('|').filter((cell, idx, arr) => {
        return idx !== 0 && idx !== arr.length - 1;
      });
      
      // Ensure row has correct number of cells
      while (rowCells.length < colCount) {
        rowCells.push('-');
      }
      rowCells.length = colCount; // Trim if too many
      
      table += '<tr>';
      rowCells.forEach((cell, cellIdx) => {
        const trimmedCell = cell.trim();
        let formattedCell = trimmedCell || '-';
        
        // Format links properly - ensure https:// prefix
        if (formattedCell && formattedCell !== '-') {
          // Check if it's a markdown link already
          if (formattedCell.match(/^\[.*?\]\(.*?\)$/)) {
            // Already formatted - keep it
          } else if (formattedCell.match(/^https?:\/\//)) {
            // URL without markdown formatting
            const urlText = formattedCell.substring(0, 25).replace(/\/$/, '');
            formattedCell = `<a href="${formattedCell}" target="_blank" rel="noopener noreferrer" class="markdown-link">${urlText}</a>`;
          } else if (formattedCell.includes('.com') || formattedCell.includes('.org') || formattedCell.includes('.io')) {
            // Partial URL, add https://
            const fullUrl = formattedCell.startsWith('http') ? formattedCell : `https://${formattedCell}`;
            const urlText = formattedCell.substring(0, 25);
            formattedCell = `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="markdown-link">${urlText}</a>`;
          }
        }
        
        table += `<td>${formattedCell}</td>`;
      });
      table += '</tr>';
    }
    
    table += '</tbody></table>';
    return table;
  });
}

/**
 * Simple markdown parser that converts text to react-friendly HTML
 * Handles: tables, headings, bold, italic, inline code, lists, blockquotes, links
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

  // Parse tables FIRST before other transformations
  html = parseMarkdownTables(html);

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="divider">');
  html = html.replace(/^===+$/gm, '<hr class="divider">');

  // Headers (h1-h6) - must be before bold replacement
  html = html.replace(/^#+\s+(.*?)$/gm, (match, content) => {
    const level = match.match(/^#+/)[0].length;
    if (level <= 6) {
      return `<h${level}>${content}</h${level}>`;
    }
    return match;
  });

  // Blockquotes - handle lines starting with >
  html = html.replace(/^>\s+(.*?)$/gm, '<blockquote>$1</blockquote>');

  // Bold (** or __) - must be before italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic (* or _) - surrounded by spaces or at boundaries
  html = html.replace(/(?:^|\s)\*([^\*\n]+?)\*(?=\s|$)/gm, ' <em>$1</em>');
  html = html.replace(/(?:^|\s)_([^_\n]+?)_(?=\s|$)/gm, ' <em>$1</em>');

  // Inline code - single backticks
  html = html.replace(/`([^`\n]+?)`/g, '<code class="inline-code">$1</code>');

  // Unordered lists (handle multiple lines)
  const ulRegex = /(?:^|\n)((?:[\*\-+]\s+[^\n]*(?:\n|$))+)/gm;
  html = html.replace(ulRegex, (match) => {
    let lines = match.trim().split('\n');
    let items = lines.filter(line => line.trim().match(/^[\*\-+]\s+/));
    if (items.length === 0) return match;
    let list = '<ul class="markdown-list">';
    items.forEach(item => {
      let content = item.trim().replace(/^[\*\-+]\s+/, '');
      list += `<li>${content}</li>`;
    });
    list += '</ul>';
    return '\n' + list;
  });

  // Ordered lists (handle multiple lines)
  const olRegex = /(?:^|\n)((?:\d+\.\s+[^\n]*(?:\n|$))+)/gm;
  html = html.replace(olRegex, (match) => {
    let lines = match.trim().split('\n');
    let items = lines.filter(line => line.trim().match(/^\d+\.\s+/));
    if (items.length === 0) return match;
    let list = '<ol class="markdown-list">';
    items.forEach(item => {
      let content = item.trim().replace(/^\d+\.\s+/, '');
      list += `<li>${content}</li>`;
    });
    list += '</ol>';
    return '\n' + list;
  });

  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>');

  // Paragraph spacing - wrap text not in tags
  let paragraphs = html.split(/\n\n+/);
  paragraphs = paragraphs.map(p => {
    if (p.match(/<(h[1-6]|ul|ol|table|code-placeholder|hr|li|blockquote|div)/)) {
      return p;
    }
    if (p.trim() && !p.match(/^<(h|ul|ol|li|hr|code|pre|table|blockquote|strong|em)/)) {
      return `<p>${p.trim()}</p>`;
    }
    return p;
  });
  html = paragraphs.join('\n\n');

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

  // Remove code blocks with language specifier
  text = text.replace(/```[\w]*\n([\s\S]*?)```/g, '$1');
  
  // Remove markdown syntax
  text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
  text = text.replace(/__(.*?)__/g, '$1'); // Bold alt
  text = text.replace(/\*(.*?)\*/g, '$1'); // Italic
  text = text.replace(/_(.*?)_/g, '$1'); // Italic alt
  text = text.replace(/`([^`]+)`/g, '$1'); // Inline code
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Links
  text = text.replace(/^#+\s/gm, ''); // Headers
  text = text.replace(/^>\s+/gm, ''); // Blockquotes
  text = text.replace(/^[\*\-\+]\s+/gm, ''); // Unordered lists
  text = text.replace(/^\d+\.\s+/gm, ''); // Ordered lists
  text = text.replace(/\|/g, ' '); // Table pipes
  text = text.replace(/^-+\|-+/gm, ''); // Table separators
  
  // Clean up extra whitespace
  text = text.replace(/\n\n+/g, '\n');

  return text.trim();
}

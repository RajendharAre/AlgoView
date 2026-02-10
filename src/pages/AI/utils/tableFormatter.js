/**
 * Table Formatter for AI Responses
 * Validates and formats markdown tables for problem tracking
 */

/**
 * Parse and validate problem tracking table
 * Expected columns: Problem Name | Platform | Link | Topics | Difficulty | Status | Date Solved | Time Taken | Time Complexity | Space Complexity | Notes
 */
export function formatProblemTable(content) {
  const tableRegex = /\|.*Problem\s+Name.*?\n([\s\S]*?)(?=\n\n|\n$|$)/i;
  const match = content.match(tableRegex);

  if (!match) return content;

  const tableContent = match[0];
  const lines = tableContent.split('\n').filter(line => line.trim());

  if (lines.length < 3) return content; // Need header, separator, at least one data row

  const headerLine = lines[0];
  const separatorLine = lines[1];

  // Expected columns in order
  const expectedColumns = [
    'Problem Name',
    'Platform',
    'Link',
    'Topics',
    'Difficulty',
    'Status',
    'Date Solved',
    'Time Taken',
    'Time Complexity',
    'Space Complexity',
    'Notes'
  ];

  // Parse header
  const headerCells = parseTableRow(headerLine);
  
  // Validate column count
  if (headerCells.length !== expectedColumns.length) {
    return content; // Return unchanged if column count doesn't match
  }

  // Format table with proper spacing
  const formattedRows = [];
  
  // Add header
  formattedRows.push('| ' + headerCells.map(cell => padCell(cell, 15)).join(' | ') + ' |');
  
  // Add separator
  const separatorCells = expectedColumns.map(() => '---');
  formattedRows.push('| ' + separatorCells.map(cell => padCell(cell, 15)).join(' | ') + ' |');

  // Process data rows
  for (let i = 2; i < lines.length; i++) {
    const rowCells = parseTableRow(lines[i]);
    
    // Pad or trim to match column count
    while (rowCells.length < expectedColumns.length) {
      rowCells.push('-');
    }
    rowCells.length = expectedColumns.length;

    // Format URLs - ensure they start with https://
    const formattedCells = rowCells.map((cell, idx) => {
      if (idx === 2) { // Link column
        if (cell !== '-' && cell.trim()) {
          const trimmed = cell.trim();
          if (!trimmed.startsWith('http')) {
            return `[link](https://${trimmed})`;
          }
          return `[link](${trimmed})`;
        }
      }
      return cell.trim() || '-';
    });

    formattedRows.push('| ' + formattedCells.map(cell => padCell(cell, 15)).join(' | ') + ' |');
  }

  const formattedTable = formattedRows.join('\n');
  return content.replace(tableContent, formattedTable);
}

/**
 * Parse a table row and extract cells
 */
function parseTableRow(line) {
  return line
    .split('|')
    .filter((cell, idx, arr) => idx !== 0 && idx !== arr.length - 1)
    .map(cell => cell.trim());
}

/**
 * Pad cell content to minimum width
 */
function padCell(text, minWidth) {
  text = String(text).substring(0, 50); // Limit cell content width
  return text.padEnd(minWidth, ' ');
}

/**
 * Validate if a cell contains a valid URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

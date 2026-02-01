import React from 'react';
import { parseMarkdown, extractPlainText } from '../utils/markdownRenderer';
import DOMPurify from 'dompurify';
import CodeBlock from './CodeBlock';

/**
 * FormattedResponse Component
 * Uses react-syntax-highlighter for better code block rendering
 * Processes markdown and extracts code blocks for component rendering
 */

const FormattedResponse = ({ content }) => {
  if (!content || typeof content !== 'string') {
    return <div className="text-gray-400 italic text-sm">No response</div>;
  }

  // Extract code blocks BEFORE markdown processing
  const codeBlockRegex = /```([\w]*)\n([\s\S]*?)```/g;
  const codeBlocks = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1] || 'text',
      code: match[2],
    });
  }

  // Replace code blocks with placeholders for markdown processing
  let processedContent = content;
  codeBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(
      /```[\w]*\n[\s\S]*?```/,
      `<CODE_BLOCK_${index}>`
    );
  });

  try {
    // Process remaining markdown
    const htmlContent = parseMarkdown(processedContent);
    const cleanHtml = DOMPurify.sanitize(htmlContent);

    return (
      <div className="text-sm markdown-content text-gray-100 dark:text-gray-200 space-y-3">
        {/* Split by code block placeholders and render mixed content */}
        {cleanHtml.split(/<CODE_BLOCK_\d+>/g).map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {/* Render markdown section */}
            {section && (
              <div
                dangerouslySetInnerHTML={{ __html: section }}
              />
            )}
            
            {/* Render code block if exists */}
            {sectionIndex < codeBlocks.length && codeBlocks[sectionIndex] && (
              <CodeBlock
                language={codeBlocks[sectionIndex].language}
                code={codeBlocks[sectionIndex].code}
              />
            )}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error rendering markdown:', error);
    // Fallback to plain text
    return (
      <div className="text-gray-300 dark:text-gray-200 whitespace-pre-wrap text-sm">
        {content}
      </div>
    );
  }
};

export default FormattedResponse;

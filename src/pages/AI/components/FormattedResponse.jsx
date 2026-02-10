import React, { useState } from 'react';
import { parseMarkdown, extractPlainText } from '../utils/markdownRenderer';
import DOMPurify from 'dompurify';
import CodeBlock from './CodeBlock';
import { Download, Copy, Check } from 'lucide-react';

/**
 * FormattedResponse Component
 * Uses react-syntax-highlighter for better code block rendering
 * Processes markdown and extracts code blocks for component rendering
 * Includes download functionality for responses
 */

const FormattedResponse = ({ content }) => {
  const [copyStatus, setCopyStatus] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(false);

  if (!content || typeof content !== 'string') {
    return <div className="text-gray-400 italic text-sm">No response</div>;
  }

  // Handle copy
  const handleCopy = () => {
    const plainText = extractPlainText(content);
    navigator.clipboard.writeText(plainText).then(() => {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    });
  };

  // Handle download
  const handleDownload = () => {
    const plainText = extractPlainText(content);
    const element = document.createElement('a');
    const file = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `response_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setDownloadStatus(true);
    setTimeout(() => setDownloadStatus(false), 2000);
  };

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
      <div className="text-sm markdown-content text-gray-900 dark:text-gray-100 space-y-3 overflow-hidden">
        {/* Action buttons */}
        <div className="flex justify-end gap-2 mb-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Copy response"
            aria-label="Copy response"
          >
            {copyStatus ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copyStatus ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Download response"
            aria-label="Download response"
          >
            {downloadStatus ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
            {downloadStatus ? 'Downloaded' : 'Download'}
          </button>
        </div>

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

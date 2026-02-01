/**
 * CodeBlock Component
 * Renders syntax-highlighted code blocks using react-syntax-highlighter
 * Much faster and cleaner than string manipulation
 */

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ language = 'text', code = '' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="code-language">{language}</span>
        <button
          onClick={handleCopy}
          className="code-copy-button"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          backgroundColor: '#0d0d0d',
          padding: '1rem',
          fontSize: '0.9rem',
          lineHeight: '1.5',
        }}
        wrapLongLines={true}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

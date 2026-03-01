import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { extractPlainText } from '../utils/markdownRenderer';
import CodeBlock from './CodeBlock';
import { Download, Copy, Check } from 'lucide-react';

/**
 * FormattedResponse Component
 * Uses react-markdown + remark-gfm for full GitHub-Flavored Markdown rendering.
 * Tables, code blocks, lists, blockquotes, links — all handled natively.
 * No custom regex parser or DOMPurify needed.
 */

const FormattedResponse = ({ content }) => {
  const [copyStatus, setCopyStatus] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(false);

  if (!content || typeof content !== 'string') {
    return (
      <div
        style={{ color: 'var(--text-secondary, #8e8ea0)' }}
        className="italic text-sm"
      >
        No response
      </div>
    );
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

  return (
    <div className="text-sm markdown-content text-[var(--text-primary,#ececf1)] space-y-3 overflow-hidden">
      {/* Action buttons */}
      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-[var(--bg-user-msg,#2b2f36)] hover:bg-[#3a3f46] text-[var(--text-primary,#ececf1)] transition-colors"
          title="Copy response"
          aria-label="Copy response"
        >
          {copyStatus ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copyStatus ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-[var(--bg-user-msg,#2b2f36)] hover:bg-[#3a3f46] text-[var(--text-primary,#ececf1)] transition-colors"
          title="Download response"
          aria-label="Download response"
        >
          {downloadStatus ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
          {downloadStatus ? 'Downloaded' : 'Download'}
        </button>
      </div>

      {/* ── Markdown rendered via react-markdown + remark-gfm ── */}
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* ── Fenced code blocks → CodeBlock with syntax highlighting ── */
          pre({ children }) {
            const childArray = React.Children.toArray(children);
            const child = childArray[0];

            if (child && typeof child === 'object' && child.props) {
              const className = child.props.className || '';
              const match = /language-(\w+)/.exec(className);
              const language = match ? match[1] : 'text';
              const codeText = String(child.props.children || '').replace(
                /\n$/,
                '',
              );
              return <CodeBlock language={language} code={codeText} />;
            }
            return <pre>{children}</pre>;
          },

          /* ── Inline code → styled <code> ── */
          code({ children, className, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match) {
              // Block code inside <pre> — keep className so pre() can read it
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },

          /* ── Tables → scrollable wrapper div (matches markdown.css) ── */
          table({ children }) {
            return (
              <div className="markdown-table">
                <table>{children}</table>
              </div>
            );
          },

          /* ── Links → open in new tab ── */
          a({ href, children, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="markdown-link"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default FormattedResponse;

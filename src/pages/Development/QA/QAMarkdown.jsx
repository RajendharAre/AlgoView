import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import QACodeBlock from './QACodeBlock'
import './qa-markdown.css'

/**
 * QAMarkdown — renders markdown answer content with light-theme styling.
 * Uses react-markdown + remark-gfm for full GFM support (tables, strikethrough, etc.)
 */
const QAMarkdown = ({ content }) => {
  if (!content || typeof content !== 'string') return null

  return (
    <div className="qa-markdown-content">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* Fenced code blocks → QACodeBlock with syntax highlighting */
          pre({ children }) {
            const childArray = React.Children.toArray(children)
            const child = childArray[0]

            if (child && typeof child === 'object' && child.props) {
              const className = child.props.className || ''
              const match = /language-(\w+)/.exec(className)
              const language = match ? match[1] : 'text'
              const codeText = String(child.props.children || '').replace(/\n$/, '')
              return <QACodeBlock language={language} code={codeText} />
            }
            return <pre>{children}</pre>
          },

          /* Inline code → styled span */
          code({ children, className, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            if (match) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className="inline-code" {...props}>
                {children}
              </code>
            )
          },

          /* Tables → scrollable wrapper */
          table({ children }) {
            return (
              <div className="qa-markdown-table">
                <table>{children}</table>
              </div>
            )
          },

          /* Links → open in new tab */
          a({ href, children, ...props }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}

export default QAMarkdown

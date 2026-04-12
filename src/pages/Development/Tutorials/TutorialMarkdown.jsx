import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TutorialCodeBlock from './TutorialCodeBlock'
import './tutorial-reading.css'

export default function TutorialMarkdown({ content }) {
  if (!content || typeof content !== 'string') return null

  const makeId = text => {
    const str =
      typeof text === 'string'
        ? text
        : React.Children.toArray(text)
            .map(c => (typeof c === 'string' ? c : c?.props?.children || ''))
            .join('')
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className="tutorial-markdown-content">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children }) {
            return <h2 id={makeId(children)}>{children}</h2>
          },
          h3({ children }) {
            return <h3 id={makeId(children)}>{children}</h3>
          },
          pre({ children }) {
            const childArray = React.Children.toArray(children)
            const child = childArray[0]
            if (child && typeof child === 'object' && child.props) {
              const className = child.props.className || ''
              const match = /language-(\w+)/.exec(className)
              const language = match ? match[1] : 'text'
              const codeText = String(child.props.children || '').replace(/\n$/, '')
              return <TutorialCodeBlock language={language} code={codeText} />
            }
            return <pre>{children}</pre>
          },
          code({ children, className, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            if (match)
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            return (
              <code className="inline-code" {...props}>
                {children}
              </code>
            )
          },
          table({ children }) {
            return (
              <div className="tutorial-markdown-table">
                <table>{children}</table>
              </div>
            )
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
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

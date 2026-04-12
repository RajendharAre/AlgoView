/**
 * Thinking Indicator — ChatGPT-style three-dot bounce animation
 */

import { Bot } from 'lucide-react'

export function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 py-3">
      {/* Bot Avatar — matches MessageBubble */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-[var(--accent,#10a37f)] text-white mt-0.5"
        role="img"
        aria-label="AI Assistant is thinking"
      >
        <Bot className="w-4 h-4" />
      </div>

      {/* Thinking bubble */}
      <div className="bg-[var(--bg-assistant-msg,#444654)] rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--text-secondary,#8e8ea0)] thinking-dot" />
          <span
            className="w-2 h-2 rounded-full bg-[var(--text-secondary,#8e8ea0)] thinking-dot"
            style={{ animationDelay: '0.15s' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[var(--text-secondary,#8e8ea0)] thinking-dot"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      </div>

      {/* Bounce keyframes */}
      <style>{`
        .thinking-dot {
          animation: thinking-bounce 1.4s ease-in-out infinite;
        }
        @keyframes thinking-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

/**
 * Chat window component with real-time Firestore integration
 * Handles message subscription, real-time updates, and intelligent auto-scrolling
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { MessageBubble } from './MessageBubble'
import { ThinkingIndicator } from './ThinkingIndicator'

/**
 * Chat window component
 * @param {Object} props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.isLoading - Whether AI is generating response
 * @param {Function} props.onCopy - Copy message handler
 */
export function ChatWindow({ messages = [], isLoading = false, onCopy }) {
  const scrollContainerRef = useRef(null)
  const [isUserNearBottom, setIsUserNearBottom] = useState(true)
  const messagesEndRef = useRef(null)

  // Check if user is near bottom of chat
  const checkIfNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const threshold = 100 // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Handle scroll events to track user position
  const handleScroll = useCallback(() => {
    setIsUserNearBottom(checkIfNearBottom())
  }, [checkIfNearBottom])

  // Scroll when messages change and user is near bottom
  useEffect(() => {
    if (isUserNearBottom) {
      scrollToBottom()
    }
  }, [messages, isLoading, isUserNearBottom, scrollToBottom])

  return (
    <main
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden h-full bg-[var(--bg-primary,#343541)]"
    >
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Empty state — ChatGPT-style centered prompt */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32">
            <div className="w-14 h-14 mb-5 rounded-full bg-[var(--bg-assistant-msg,#444654)] flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[var(--accent,#10a37f)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary,#ececf1)] mb-2 text-center">
              How can I help you today?
            </h3>
            <p className="text-sm text-[var(--text-secondary,#8e8ea0)] max-w-sm mx-auto text-center leading-relaxed">
              Ask about algorithms, data structures, or paste code for analysis.
            </p>
          </div>
        )}

        {/* Messages list */}
        <div className="space-y-1">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} onCopy={onCopy} />
          ))}

          {/* Thinking indicator */}
          {isLoading && <ThinkingIndicator />}
        </div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </main>
  )
}

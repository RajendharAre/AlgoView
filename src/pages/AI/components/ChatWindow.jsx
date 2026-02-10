/**
 * Chat window component with real-time Firestore integration
 * Handles message subscription, real-time updates, and intelligent auto-scrolling
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { ThinkingIndicator } from './ThinkingIndicator';

/**
 * Chat window component
 * @param {Object} props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.isLoading - Whether AI is generating response
 * @param {Function} props.onCopy - Copy message handler
 */
export function ChatWindow({ 
  messages = [], 
  isLoading = false,
  onCopy
}) {
  const scrollContainerRef = useRef(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const messagesEndRef = useRef(null);

  // Check if user is near bottom of chat
  const checkIfNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const threshold = 100; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle scroll events to track user position
  const handleScroll = useCallback(() => {
    setIsUserNearBottom(checkIfNearBottom());
  }, [checkIfNearBottom]);

  // Scroll when messages change and user is near bottom
  useEffect(() => {
    if (isUserNearBottom) {
      scrollToBottom();
    }
  }, [messages, isLoading, isUserNearBottom, scrollToBottom]);

  return (
    <main 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto h-full bg-white dark:bg-gray-800"
    >
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to AlgoView AI
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Ask me about algorithms, data structures, or paste code for analysis. I'm here to help you understand computer science concepts.
            </p>
          </div>
        )}

        {/* Messages list */}
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={onCopy}
            />
          ))}
          
          {/* Thinking indicator */}
          {isLoading && <ThinkingIndicator />}
        </div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}

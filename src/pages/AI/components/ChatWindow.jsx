/**
 * Chat window component with real-time Firestore integration
 * Handles message subscription, real-time updates, and intelligent auto-scrolling
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { MessageBubble } from './MessageBubble';

/**
 * Chat window component
 * @param {Object} props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isSending - Sending state
 * @param {Function} props.onCopy - Copy message handler
 * @param {string} props.loadingText - Custom loading text
 */
export function ChatWindow({ 
  messages = [], 
  isLoading = false, 
  isSending = false,
  onCopy,
  loadingText = "AI is thinking..."
}) {
  const scrollContainerRef = useRef(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

  // Check if user is near bottom of chat
  const checkIfNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const threshold = 100; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Auto-scroll to bottom when appropriate
  const scrollToBottom = useCallback((force = false) => {
    if (!scrollContainerRef.current) return;
    
    if (force || isUserNearBottom) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [isUserNearBottom]);

  // Handle scroll events to track user position
  const handleScroll = useCallback(() => {
    setIsUserNearBottom(checkIfNearBottom());
  }, [checkIfNearBottom]);

  // Scroll when messages change, but only if user is near bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Scroll when loading state changes
  useEffect(() => {
    if (isLoading || isSending) {
      scrollToBottom(true); // Force scroll when showing loading
    }
  }, [isLoading, isSending, scrollToBottom]);

  // Set initial scroll position
  useEffect(() => {
    if (messages.length === 0) {
      setIsUserNearBottom(true);
    }
  }, [messages.length]);

  // Memoize messages to ensure proper re-rendering
  const processedMessages = useMemo(() => {
    return messages;
  }, [messages]);
  return (
    <main 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto h-full"
    >
      <div className="pb-32 pt-6"> {/* pb-32 adds bottom padding for input area */}
        <div className="max-w-3xl mx-auto px-4">
          {/* Empty state */}
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 text-indigo-500 dark:text-indigo-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to AlgoView AI
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Ask me about algorithms, data structures, or paste code for analysis. I'm here to help you understand and visualize computer science concepts.
              </p>
            </div>
          )}

          {/* Messages */}
          {processedMessages.map((message) => (
            <MessageBubble
              key={message.id || message.tempId || `msg-${Date.now()}-${Math.random()}`}
              message={message}
              onCopy={onCopy}
            />
          ))}

          {/* Scroll to bottom helper */}
          {!isUserNearBottom && (processedMessages.length > 0 || isLoading) && (
            <div className="sticky bottom-4 flex justify-center">
              <button
                onClick={() => scrollToBottom(true)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>New messages</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

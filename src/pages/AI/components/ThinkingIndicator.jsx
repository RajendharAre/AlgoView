/**
 * Thinking Indicator Component
 * Shows AI is generating a response with animated typing effect
 */

import { Bot } from 'lucide-react';

export function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      {/* Bot Avatar */}
      <div 
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        role="img"
        aria-label="AI Assistant"
      >
        <Bot className="w-4 h-4" />
      </div>

      {/* Thinking Message */}
      <div className="bg-transparent text-gray-900 dark:text-gray-100 rounded-lg px-0 py-2 rounded-bl-none">
        <div className="flex items-center gap-2">
          <span className="text-sm">AlgoView is thinking</span>
          
          {/* Animated dots */}
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse" 
              style={{ animation: 'pulse 1.4s infinite' }}>
            </span>
            <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse" 
              style={{ animation: 'pulse 1.4s infinite 0.2s' }}>
            </span>
            <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse" 
              style={{ animation: 'pulse 1.4s infinite 0.4s' }}>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

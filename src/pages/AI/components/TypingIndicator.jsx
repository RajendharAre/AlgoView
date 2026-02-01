/**
 * Typing indicator component for AI responses
 * Shows animated dots when AI is processing a response
 */

import { motion } from 'framer-motion';

/**
 * Typing indicator component
 * @param {Object} props
 * @param {string} props.text - Optional text to display (default: "AI is thinking...")
 */
export function TypingIndicator({ text = "AI is thinking..." }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 max-w-3xl mx-auto" role="status" aria-live="polite">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0" data-testid="typing-avatar">
        <div className="w-4 h-4 text-gray-600 dark:text-gray-300" data-testid="checkmark-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 py-1">
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {text}
        </div>
        
        {/* Animated dots */}
        <div className="flex items-center gap-1 mt-1" data-testid="dots-container">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
              data-testid="typing-dot"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
/**
 * Message bubble component for displaying individual chat messages
 * Renders messages with clean markdown styling, no animations
 */

import { User, Bot, Copy } from 'lucide-react';
import { parseMarkdown, extractPlainText } from '../utils/markdownRenderer';
import DOMPurify from 'dompurify';
import FormattedResponse from './FormattedResponse';

/**
 * Message bubble component
 * @param {Object} props
 * @param {Object} props.message - Message object with id, role, content, createdAt
 * @param {Function} props.onCopy - Copy message handler
 */
export function MessageBubble({ message, onCopy }) {
  const isUser = message.role === 'user';
  
  const handleCopy = (e) => {
    e.stopPropagation();
    if (onCopy && message.content) {
      // Copy clean text, not HTML
      const plainText = isUser ? message.content : extractPlainText(message.content);
      onCopy(plainText);
    }
  };

  // Parse markdown to clean HTML
  const renderContent = () => {
    if (isUser) {
      // User messages: plain text, preserve line breaks
      return <div className="text-sm whitespace-pre-wrap">{message.content}</div>;
    } else {
      // AI messages: use FormattedResponse for proper structure
      return <FormattedResponse content={message.content} />;
    }
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      data-testid="message-bubble"
    >
      <div className="flex items-start gap-3 max-w-2xl">
        {/* Avatar */}
        {!isUser && (
          <div 
            className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            role="img"
            aria-label="AI Assistant"
          >
            <Bot className="w-4 h-4" data-testid="bot-icon" />
          </div>
        )}
        
        {/* Message content */}
        <div 
          className={`
            relative px-4 py-3 rounded-lg
            ${isUser 
              ? 'bg-blue-500 text-white rounded-br-none ml-auto' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
            }
          `}
        >
          {renderContent()}
          
          {/* Copy button (only for AI messages) */}
          {!isUser && onCopy && (
            <button
              onClick={handleCopy}
              className="
                absolute top-2 right-2 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700
                text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                transition-colors
              "
              title="Copy message"
              aria-label="Copy message"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User avatar */}
        {isUser && (
          <div 
            className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-blue-500 text-white"
            role="img"
            aria-label="You"
          >
            <User className="w-4 h-4" data-testid="user-icon" />
          </div>
        )}
      </div>
    </div>
  );
}


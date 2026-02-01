/**
 * Message bubble component for displaying individual chat messages
 * Handles both user and assistant messages with proper styling
 */

import { User, Bot, Copy } from 'lucide-react';
import DOMPurify from 'dompurify';

/**
 * Message bubble component
 * @param {Object} props
 * @param {Object} props.message - Message object with id, role, content, createdAt
 * @param {Function} props.onCopy - Copy message handler
 */
export function MessageBubble({ message, onCopy }) {
  const isUser = message.role === 'user';
  const isOptimistic = message.isOptimistic || false;
  
  const handleCopy = (e) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy(message.content);
    }
  };
  
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${isOptimistic ? 'opacity-70' : ''}`}
      data-testid="message-bubble"
    >
      <div className="flex items-start gap-3 max-w-[calc(100%-50px)]">
        {/* Avatar */}
        <div 
          className={`
            flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center
            ${isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }
          `}
        >
          {isUser ? (
            <User className="w-4 h-4" data-testid="user-icon" />
          ) : (
            <Bot className="w-4 h-4" data-testid="bot-icon" />
          )}
        </div>
        
        {/* Message content */}
        <div 
          className={`
            relative px-4 py-3 rounded-lg
            ${isUser 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700'
            }
          `}
        >
          {isUser ? (
            <div className="text-sm whitespace-pre-wrap">{message.content || '...'}</div>
          ) : (
            <div>
              <div className="text-xs text-gray-500 mb-1">AI Response:</div>
              <div 
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: message.content || '<p>Processing response...</p>' }} 
              />
            </div>
          )}
          
          {/* Copy button (only for AI messages with onCopy handler) */}
          {!isUser && onCopy && (
            <button
              onClick={handleCopy}
              className="
                absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 
                rounded-full border border-gray-200 dark:border-gray-600 
                flex items-center justify-center opacity-0 group-hover:opacity-100 
                hover:bg-gray-50 dark:hover:bg-gray-700
                shadow-sm
              "
              aria-label="Copy message"
            >
              <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

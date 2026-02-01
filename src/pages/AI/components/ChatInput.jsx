/**
 * Chat input component with auto-resizing textarea and smart submit handling
 * Handles user input, auto-resizing, and proper keyboard interactions
 */

import { useEffect, useRef } from 'react';
import { Copy, Send, RefreshCw } from 'lucide-react';

/**
 * Chat input component
 * @param {Object} props
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Input change handler
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCopy - Copy input handler
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.placeholder - Input placeholder
 */
export function ChatInput({ 
  value = '',
  onChange,
  onSubmit,
  onCopy,
  isLoading = false,
  disabled = false,
  placeholder = 'Message AlgoView AI...'
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && !isLoading && value.trim() && onSubmit) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSubmit = !disabled && !isLoading && value.trim();

  return (
    <div className="flex items-end gap-3">
      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          rows={1}
          disabled={disabled || isLoading}
          onKeyDown={handleKeyDown}
          className={`
            w-full px-4 py-3 pl-4 pr-12 rounded-xl border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${disabled || isLoading
              ? 'opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
              : 'hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
          style={{
            minHeight: '44px',
            maxHeight: '200px',
            height: 'auto',
            overflow: 'hidden'
          }}
        />
        

      </div>

      {/* Action buttons */}
      <div className="flex gap-1 flex-shrink-0">
        {/* Copy button */}
        {onCopy && value.trim() && (
          <button
            type="button"
            onClick={() => onCopy(value)}
            disabled={disabled}
            className="
              p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 
              text-gray-600 dark:text-gray-300
            "
            aria-label="Copy input"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}

        {/* Send button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            p-3 rounded-lg flex items-center justify-center
            ${canSubmit
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label={isLoading ? 'Sending message' : 'Send message'}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}


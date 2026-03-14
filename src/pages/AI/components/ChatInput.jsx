/**
 * Chat input — ChatGPT-style dark auto-resizing textarea with send button
 */

import { useEffect, useRef } from 'react';
import { Copy, Send, RefreshCw } from 'lucide-react';

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && !isLoading && value.trim() && onSubmit) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSubmit = !disabled && !isLoading && value.trim();

  return (
    <div className="flex items-end gap-2 sm:gap-3">
      {/* Textarea wrapper */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={1}
          disabled={disabled || isLoading}
          onKeyDown={handleKeyDown}
          className={`
            w-full px-3 sm:px-4 py-3 rounded-xl
            border border-[var(--input-border,#2b2f36)]
            bg-[var(--input-bg,#40414f)]
            text-[var(--input-text,#111827)]
            placeholder:text-[var(--input-placeholder,#6b7280)]
            text-sm sm:text-base
            resize-none
            focus:outline-none focus:ring-2 focus:ring-[var(--accent,#10a37f)] focus:border-transparent
            ${disabled || isLoading
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:border-[#565869]'
            }
          `}
          style={{ minHeight: '44px', maxHeight: '200px', overflow: 'hidden' }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-1 flex-shrink-0 pb-0.5">
        {/* Copy */}
        {onCopy && value.trim() && (
          <button
            type="button"
            onClick={() => onCopy(value)}
            disabled={disabled}
            className="p-2.5 sm:p-3 rounded-lg bg-[var(--bg-user-msg,#2b2f36)] hover:bg-[#3a3f46] text-[var(--text-primary,#ececf1)] transition-colors"
            aria-label="Copy input"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}

        {/* Send */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            p-2.5 sm:p-3 rounded-lg flex items-center justify-center transition-colors
            ${canSubmit
              ? 'bg-[var(--accent,#10a37f)] hover:brightness-110 text-white'
              : 'bg-[var(--bg-user-msg,#2b2f36)] text-[var(--text-secondary,#8e8ea0)] cursor-not-allowed'
            }
          `}
          aria-label={isLoading ? 'Sending message' : 'Send message'}
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}


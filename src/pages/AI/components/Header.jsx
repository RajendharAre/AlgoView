/**
 * Chat header component — ChatGPT-style compact dark header
 * Displays chat title, API status indicator, and clear button
 */

import { Bot, Trash2, AlertCircle } from 'lucide-react'

export function Header({
  title = 'AlgoView AI',
  subtitle = 'AI-Powered Educational Assistant',
  isOnline = true,
  onClear,
  disabled = false,
}) {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY
  const hasApiKey = geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here'

  return (
    <div className="flex items-center justify-between flex-1" role="banner">
      <div className="flex items-center gap-3 min-w-0">
        {/* Bot icon — hidden on very small screens */}
        <div className="p-1.5 rounded-md bg-[var(--bg-assistant-msg,#444654)] hidden sm:flex">
          <Bot className="w-5 h-5 text-[var(--accent,#10a37f)]" data-testid="bot-icon" />
        </div>
        <div className="min-w-0">
          <h1 className="font-semibold text-[var(--text-primary,#ececf1)] text-sm sm:text-base truncate">
            {title}
          </h1>
          <div className="text-[11px] text-[var(--text-secondary,#8e8ea0)] flex items-center gap-2 truncate">
            <span className="hidden sm:inline truncate">{subtitle}</span>
            <span
              className={`flex items-center gap-1 ${hasApiKey ? 'text-[var(--accent,#10a37f)]' : 'text-amber-400'}`}
            >
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-[var(--accent,#10a37f)]' : 'bg-[var(--text-secondary,#8e8ea0)]'}`}
              />
              {hasApiKey ? (
                'Online'
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" /> Default Responses
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onClear && (
          <button
            onClick={onClear}
            disabled={disabled}
            className="p-2 rounded-lg bg-[var(--bg-user-msg,#2b2f36)] hover:bg-[#3a3f46] text-[var(--text-primary,#ececf1)] disabled:opacity-40 transition-colors"
            aria-label={disabled ? 'Clear chat disabled' : 'Clear chat'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

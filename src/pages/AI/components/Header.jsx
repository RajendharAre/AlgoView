/**
 * Chat header component
 * Displays chat title, status, and clear button
 */

import { Bot, Trash2 } from 'lucide-react';
import { UI } from '../constants/ui';
import { ROLE_LABELS } from '../constants/roles';

/**
 * Chat header component
 * @param {Object} props
 * @param {string} props.title - Chat title
 * @param {string} props.subtitle - Chat subtitle/status
 * @param {boolean} props.isOnline - Online status
 * @param {Function} props.onClear - Clear chat handler
 * @param {boolean} props.disabled - Disable clear button
 */
export function Header({ 
  title = 'AlgoView AI', 
  subtitle = 'Algorithm Assistant', 
  isOnline = true, 
  onClear, 
  disabled = false 
}) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 flex items-center justify-between" role="banner">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
          <Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" data-testid="bot-icon" />
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          <div className="text-xs text-gray-500 flex items-center">
            {isOnline && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" data-testid="online-status"></div>
                <span className="font-medium text-green-600 dark:text-green-400">Online</span>
              </>
            )}
            {!isOnline && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span className="font-medium text-red-600 dark:text-red-400">Offline</span>
              </>
            )}
            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
            <span className="text-gray-600 dark:text-gray-300">{subtitle}</span>
          </div>
        </div>
      </div>

      {onClear && (
        <button
          onClick={onClear}
          disabled={disabled}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          aria-label={disabled ? "Clear chat disabled" : "Clear chat"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </header>
  );
}


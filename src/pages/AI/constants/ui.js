/**
 * UI constants for the chat interface
 */

export const UI = {
  // Class names
  CONTAINER: 'h-screen flex flex-col bg-slate-50 dark:bg-gray-900',
  HEADER: 'flex items-center justify-between px-6 py-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur',
  MAIN: 'flex-1 overflow-y-auto px-4 py-6',
  FOOTER: 'border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur px-4 py-4',
  
  // Message bubble styles
  USER_BUBBLE: 'bg-indigo-500 text-white rounded-tr-none',
  ASSISTANT_BUBBLE: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none',
  
  // Button styles
  PRIMARY_BUTTON: 'p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-50',
  SECONDARY_BUTTON: 'flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
  
  // Input styles
  TEXTAREA: 'flex-1 resize-none rounded-xl border px-4 py-3 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500',
  
  // Animation classes
  PULSE: 'animate-pulse',
  SPIN: 'animate-spin'
};

export const SIZES = {
  MAX_WIDTH: 'max-w-3xl',
  MESSAGE_MAX_WIDTH: 'max-w-[85%]',
  AVATAR_SIZE: 'w-9 h-9',
  ICON_SIZE: 'w-4 h-4',
  SMALL_ICON: 'w-3 h-3'
};

export const TIMING = {
  AUTO_SCROLL_DELAY: 100,
  MESSAGE_DELAY: 900,
  TYPING_INDICATOR_DELAY: 300
};
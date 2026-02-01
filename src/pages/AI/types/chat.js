/**
 * Chat system type definitions
 */

/**
 * @typedef {Object} ChatHistory
 * @property {string} id - Chat session ID
 * @property {string} userId - User ID
 * @property {Array<ChatMessage>} messages - Array of messages
 * @property {Date} createdAt - Chat creation timestamp
 * @property {Date} lastActive - Last activity timestamp
 * @property {Object} settings - Chat settings
 */

/**
 * @typedef {Object} ChatSettings
 * @property {boolean} autoScroll - Auto-scroll to new messages
 * @property {string} theme - Chat theme (light|dark)
 * @property {boolean} showTimestamps - Show message timestamps
 * @property {string} fontSize - Font size (small|medium|large)
 */

/**
 * @typedef {Object} ChatState
 * @property {Array<Message>} messages - Current messages
 * @property {boolean} isLoading - Loading state
 * @property {string} input - Current input text
 * @property {Error|null} error - Current error
 * @property {ChatSettings} settings - Chat settings
 */
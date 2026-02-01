/**
 * Message type definitions for the AI chat system
 */

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
};

export const MESSAGE_TYPES = {
  WELCOME: 'welcome',
  RESPONSE: 'response',
  CODE: 'code',
  QUESTION: 'question',
  SYSTEM: 'system'
};

/**
 * @typedef {Object} Message
 * @property {number} id - Unique message identifier
 * @property {string} role - Message role (user|assistant|system)
 * @property {string} content - Message content (HTML formatted)
 * @property {Date} timestamp - Message creation timestamp
 * @property {string} type - Message type classification
 * @property {Object} [metadata] - Optional metadata
 * @property {string} [metadata.language] - Programming language detected
 * @property {number} [metadata.tokens] - Token count
 * @property {string} [metadata.complexity] - Algorithm complexity
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id - Firestore document ID
 * @property {string} userId - User who sent the message
 * @property {string} content - Message content
 * @property {string} role - Message role
 * @property {Object} metadata - Message metadata
 * @property {firebase.firestore.Timestamp} createdAt - Firestore timestamp
 * @property {firebase.firestore.Timestamp} updatedAt - Firestore timestamp
 */
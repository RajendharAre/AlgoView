/**
 * Role constants for chat messages
 */

export const ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
};

export const ROLE_LABELS = {
  [ROLES.USER]: 'You',
  [ROLES.ASSISTANT]: 'AlgoView AI',
  [ROLES.SYSTEM]: 'System'
};

export const ROLE_COLORS = {
  [ROLES.USER]: 'bg-indigo-500',
  [ROLES.ASSISTANT]: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  [ROLES.SYSTEM]: 'bg-gray-500'
};
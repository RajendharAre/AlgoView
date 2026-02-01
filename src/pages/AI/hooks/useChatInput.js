/**
 * Custom hook for managing chat input state
 * Handles input value, changes, and utility functions
 */

import { useState, useCallback } from 'react';

export function useChatInput() {
  const [input, setInput] = useState('');

  // Clear input
  const clearInput = useCallback(() => {
    setInput('');
  }, []);

  // Check if input has content
  const hasInput = input.trim().length > 0;

  return {
    input,
    setInput,
    clearInput,
    hasInput
  };
}
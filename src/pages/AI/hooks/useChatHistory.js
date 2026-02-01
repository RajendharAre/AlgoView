/**
 * Custom hook for managing chat history with Firebase Firestore
 * Handles real-time message synchronization and chat state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  createChatSession, 
  addMessage, 
  subscribeToMessages, 
  updateChatTimestamp,
  formatMessageForStorage,
  formatMessageForDisplay
} from '../utils/firebaseChatStorage';
import { MESSAGE_ROLES, MESSAGE_TYPES } from '../types/message';

/**
 * Hook for managing chat history and Firebase synchronization
 * @param {string} userId - Current user ID
 * @param {Object} initialSettings - Initial chat settings
 * @returns {Object} Chat state and management functions
 */
export function useChatHistory(userId, initialSettings = {}) {
  // State management
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [settings, setSettings] = useState({
    autoScroll: true,
    theme: 'system',
    showTimestamps: true,
    fontSize: 'medium',
    ...initialSettings
  });

  // Refs for cleanup and state tracking
  const unsubscribeRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize chat session
  const initializeChat = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create new chat session
      const newChatId = await createChatSession(userId, 'AlgoView AI Chat');
      setChatId(newChatId);
      isInitializedRef.current = true;
      
      // Set up real-time subscription
      unsubscribeRef.current = subscribeToMessages(userId, newChatId, (firestoreMessages, subscriptionError) => {
        if (subscriptionError) {
          setError(subscriptionError);
          return;
        }
        
        // Format messages for display
        const formattedMessages = firestoreMessages.map(formatMessageForDisplay);
        setMessages(formattedMessages);
        setIsLoading(false);
      });
      
    } catch (err) {
      console.error('Error initializing chat:', err);
      setError(err);
      setIsLoading(false);
    }
  }, [userId]);

  // Send message
  const sendMessage = useCallback(async (content, role = MESSAGE_ROLES.USER, metadata = {}) => {
    if (!chatId || !content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message
      const userMessage = {
        content,
        role,
        metadata: metadata
      };
      
      await addMessage(userId, chatId, formatMessageForStorage(userMessage));
      
      // Update chat timestamp
      await updateChatTimestamp(userId, chatId);
      
      setIsLoading(false);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err);
      setIsLoading(false);
    }
  }, [chatId, userId]);

  // Add system message
  const addSystemMessage = useCallback(async (content, metadata = {}) => {
    await sendMessage(content, MESSAGE_ROLES.SYSTEM, {
      type: MESSAGE_TYPES.SYSTEM,
      ...metadata
    });
  }, [sendMessage]);

  // Clear chat
  const clearChat = useCallback(async () => {
    if (!chatId) return;
    
    try {
      // Add system message about clearing
      await addSystemMessage('Chat cleared. Starting new conversation.');
      
      // Reset local state
      setMessages(prev => prev.filter(msg => msg.role === MESSAGE_ROLES.SYSTEM));
      
    } catch (err) {
      console.error('Error clearing chat:', err);
      setError(err);
    }
  }, [chatId, addSystemMessage]);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Initialize chat on mount
  useEffect(() => {
    if (userId && !isInitializedRef.current) {
      initializeChat();
    }
  }, [userId, initializeChat]);

  // Auto-scroll when messages change (if enabled)
  useEffect(() => {
    if (settings.autoScroll && messages.length > 0) {
      // Scroll to bottom logic would be handled by parent component
      // via ref forwarding or callback
    }
  }, [messages, settings.autoScroll]);

  return {
    // State
    messages,
    isLoading,
    error,
    chatId,
    settings,
    
    // Actions
    initializeChat,
    sendMessage,
    addSystemMessage,
    clearChat,
    updateSettings,
    
    // Status
    isInitialized: isInitializedRef.current,
    hasMessages: messages.length > 0
  };
}

// Helper hook for chat input management
export function useChatInput() {
  const [input, setInput] = useState('');
  
  const clearInput = useCallback(() => {
    setInput('');
  }, []);
  
  const setInputValue = useCallback((value) => {
    setInput(value);
  }, []);
  
  return {
    input,
    setInput: setInputValue,
    clearInput,
    hasInput: input.trim().length > 0
  };
}

// Helper hook for chat scrolling
export function useChatScroll() {
  const scrollRef = useRef(null);
  
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  return {
    scrollRef,
    scrollToBottom
  };
}
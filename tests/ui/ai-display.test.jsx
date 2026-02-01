/**
 * UI Test for AI Display Functionality
 * Tests that AI responses are properly displayed in the chat window
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import AI from '../../src/pages/AI/AI';
import { AuthProvider } from '../../src/context/AuthContext';
import { useChatHistoryFirebase } from '../../src/pages/AI/hooks/useChatHistoryFirebase';
import { useChatInput } from '../../src/pages/AI/hooks/useChatInput';
import { generateResponse } from '../../src/pages/AI/utils/responseGenerator';

// Mock all hooks and dependencies
vi.mock('../../src/pages/AI/hooks/useChatHistoryFirebase', () => ({
  useChatHistoryFirebase: vi.fn()
}));

vi.mock('../../src/pages/AI/hooks/useChatInput', () => ({
  useChatInput: vi.fn()
}));

vi.mock('../../src/pages/AI/utils/responseGenerator', () => ({
  generateResponse: vi.fn()
}));

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'test-user-id', email: 'test@example.com' } })
}));

vi.mock('firebase/firestore', async () => {
  const actual = await import('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn(),
    addDoc: vi.fn(),
    serverTimestamp: vi.fn(() => new Date()),
    doc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(),
  };
});

vi.mock('firebase/auth', async () => {
  const actual = await import('firebase/auth');
  return {
    ...actual,
    onAuthStateChanged: vi.fn(),
  };
});

describe('AI Display Tests', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Default mock implementations
    useChatHistoryFirebase.mockReturnValue({
      chats: [],
      messages: [],
      activeChatId: 'test-chat-id',
      loading: false,
      isSending: false,
      error: null,
      sendMessage: vi.fn().mockResolvedValue('message-id'),
      createNewChat: vi.fn().mockResolvedValue('new-chat-id'),
      selectChat: vi.fn(),
      deleteChat: vi.fn(),
      clearError: vi.fn()
    });
    
    useChatInput.mockReturnValue({
      input: '',
      setInput: vi.fn(),
      clearInput: vi.fn()
    });
    
    generateResponse.mockResolvedValue('<p>Test AI response</p>');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display user message correctly', async () => {
    const mockMessages = [
      { id: '1', role: 'user', content: 'Hello', createdAt: new Date() }
    ];
    
    useChatHistoryFirebase.mockReturnValue({
      chats: [{ id: 'test-chat-id', title: 'Test Chat' }],
      messages: mockMessages,
      activeChatId: 'test-chat-id',
      loading: false,
      isSending: false,
      error: null,
      sendMessage: vi.fn(),
      createNewChat: vi.fn(),
      selectChat: vi.fn(),
      deleteChat: vi.fn(),
      clearError: vi.fn()
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <AI />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('should display AI message correctly', async () => {
    const mockMessages = [
      { id: '1', role: 'user', content: 'Hello', createdAt: new Date() },
      { id: '2', role: 'assistant', content: '<p>Test AI response</p>', createdAt: new Date() }
    ];
    
    useChatHistoryFirebase.mockReturnValue({
      chats: [{ id: 'test-chat-id', title: 'Test Chat' }],
      messages: mockMessages,
      activeChatId: 'test-chat-id',
      loading: false,
      isSending: false,
      error: null,
      sendMessage: vi.fn(),
      createNewChat: vi.fn(),
      selectChat: vi.fn(),
      deleteChat: vi.fn(),
      clearError: vi.fn()
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <AI />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Test AI response')).toBeInTheDocument();
    });
  });

  it('should render HTML content in AI messages', async () => {
    const mockMessages = [
      { id: '1', role: 'assistant', content: '<p>This is a <strong>bold</strong> statement</p>', createdAt: new Date() }
    ];
    
    useChatHistoryFirebase.mockReturnValue({
      chats: [{ id: 'test-chat-id', title: 'Test Chat' }],
      messages: mockMessages,
      activeChatId: 'test-chat-id',
      loading: false,
      isSending: false,
      error: null,
      sendMessage: vi.fn(),
      createNewChat: vi.fn(),
      selectChat: vi.fn(),
      deleteChat: vi.fn(),
      clearError: vi.fn()
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <AI />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for the component to render
    await waitFor(() => {
      const strongElement = screen.getByText('bold');
      expect(strongElement).toBeInTheDocument();
      expect(strongElement.tagName).toBe('STRONG');
    });
  });

  it('should handle empty messages list', async () => {
    useChatHistoryFirebase.mockReturnValue({
      chats: [],
      messages: [],
      activeChatId: null,
      loading: false,
      isSending: false,
      error: null,
      sendMessage: vi.fn(),
      createNewChat: vi.fn(),
      selectChat: vi.fn(),
      deleteChat: vi.fn(),
      clearError: vi.fn()
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <AI />
        </AuthProvider>
      </MemoryRouter>
    );

    // Should show welcome message when no messages exist
    await waitFor(() => {
      expect(screen.getByText('Welcome to AlgoView AI')).toBeInTheDocument();
    });
  });
});
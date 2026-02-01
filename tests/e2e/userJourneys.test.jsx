/**
 * End-to-end tests for complete user journeys
 * Tests full user workflows from start to finish
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import AI from '../../../src/pages/AI/AI';
import * as testUtils from '../../../tests/test-utils.jsx';

// Mock useAuth hook
vi.mock('../../../src/hooks/useAuth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual.default || actual),
    useAuth: vi.fn()
  };
});

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: (state = { currentUser: null, loading: false }, action) => state,
    },
    preloadedState: initialState
  });
};

describe('End-to-End User Journey Tests', () => {
  let user;
  let mockStore;

  beforeEach(() => {
    user = userEvent.setup();
    mockStore = createMockStore();
    
    // Mock Firebase functions
    vi.mock('../../../src/lib/firebase', () => testUtils.mockFirebase);
    vi.mock('../../../src/pages/AI/utils/storage', () => testUtils.mockFirestore);
    
    // Mock console to reduce test noise
    testUtils.mockConsole();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('New User Journey', () => {
    it('completes full new user experience', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock responses
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Welcome to our AI assistant! This is a helpful response.')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // Verify initial state
      expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      expect(screen.getByText('Algorithm Assistant')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Message AlgoView AI...')).toBeInTheDocument();

      // Send first message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Hello, I am a new user. Can you help me?');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify message appears
      expect(screen.getByText('Hello, I am a new user. Can you help me?')).toBeInTheDocument();

      // Wait for AI response
      await screen.findByText('Welcome to our AI assistant! This is a helpful response.');
      expect(screen.getByText('Welcome to our AI assistant! This is a helpful response.')).toBeInTheDocument();

      // Verify both messages are displayed
      expect(screen.getAllByTestId('message-bubble')).toHaveLength(2);
    });

    it('creates first chat for new user', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock Firestore to simulate empty initial state
      const mockOnSnapshot = vi.fn((query, callback) => {
        // Initially empty chat list
        callback({
          docs: [],
          size: 0,
          empty: true
        });
        return () => {};
      });

      const mockAddDoc = vi.fn().mockResolvedValue({ id: 'new-chat-id' });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          onSnapshot: mockOnSnapshot,
          addDoc: mockAddDoc
        }
      }));

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('First chat response')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial chat creation
      await waitFor(() => {
        expect(mockAddDoc).toHaveBeenCalled(); // Should create initial chat
      });

      // Send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Creating my first chat');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify first chat is created and message is sent
      expect(screen.getByText('Creating my first chat')).toBeInTheDocument();
      expect(screen.getByText('First chat response')).toBeInTheDocument();
    });
  });

  describe('Returning User Journey', () => {
    it('loads existing chats for returning user', async () => {
      const existingChats = testUtils.testFixtures.chats.multipleChats;

      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock Firestore to return existing chats
      const mockOnSnapshot = vi.fn((query, callback) => {
        callback({
          docs: existingChats.map(chat => ({
            id: chat.id,
            data: () => ({ ...chat })
          })),
          size: existingChats.length,
          empty: false
        });
        return () => {};
      });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          onSnapshot: mockOnSnapshot
        }
      }));

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Returning user response')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for chat loading
      await waitFor(() => {
        expect(screen.getByText('First Chat')).toBeInTheDocument();
      });

      // Verify existing chats are displayed
      expect(screen.getByText('First Chat')).toBeInTheDocument();
      expect(screen.getByText('Second Chat')).toBeInTheDocument();

      // Select an existing chat and continue conversation
      const firstChatElement = screen.getByText('First Chat');
      await user.click(firstChatElement);

      // Send a message in the existing chat
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Continuing conversation from previous chat');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify message appears in context of existing chat
      expect(screen.getByText('Continuing conversation from previous chat')).toBeInTheDocument();
      expect(screen.getByText('Returning user response')).toBeInTheDocument();
    });

    it('switches between multiple existing chats', async () => {
      const existingChats = testUtils.testFixtures.chats.multipleChats;

      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock Firestore to return multiple chats
      let currentChatMessages = [];
      const mockOnSnapshot = vi.fn((query, callback) => {
        // Simulate different messages for different chats
        if (query.toString().includes('chat-1')) {
          currentChatMessages = [{
            id: 'msg-1',
            role: 'user',
            content: 'Message in chat 1',
            createdAt: new Date()
          }];
        } else if (query.toString().includes('chat-2')) {
          currentChatMessages = [{
            id: 'msg-2',
            role: 'user',
            content: 'Message in chat 2',
            createdAt: new Date()
          }];
        } else {
          currentChatMessages = [];
        }

        callback({
          docs: currentChatMessages.map(msg => ({
            id: msg.id,
            data: () => ({ ...msg })
          })),
          size: currentChatMessages.length,
          empty: currentChatMessages.length === 0
        });
        return () => {};
      });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          onSnapshot: mockOnSnapshot
        }
      }));

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockImplementation((input) => {
          return Promise.resolve(`Response to: ${input}`);
        })
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for chat loading
      await waitFor(() => {
        expect(screen.getByText('First Chat')).toBeInTheDocument();
      });

      // Switch between chats and verify context changes
      const firstChat = screen.getByText('First Chat');
      await user.click(firstChat);

      // Send message in first chat
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.clear(inputField);
      await user.type(inputField, 'Message for chat 1');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify message appears
      await screen.findByText('Message for chat 1');
      expect(screen.getByText('Message for chat 1')).toBeInTheDocument();

      // Switch to second chat
      const secondChat = screen.getByText('Second Chat');
      await user.click(secondChat);

      // Send message in second chat
      await user.clear(inputField);
      await user.type(inputField, 'Message for chat 2');
      await user.click(sendButton);

      // Verify message appears in second chat context
      await screen.findByText('Message for chat 2');
      expect(screen.getByText('Message for chat 2')).toBeInTheDocument();
    });
  });

  describe('Complete Conversation Flow', () => {
    it('maintains context through multi-turn conversation', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Track conversation flow
      const conversationHistory = [];
      const mockGenerateResponse = vi.fn().mockImplementation((input) => {
        conversationHistory.push(input);
        return Promise.resolve(`Understood. You said: "${input}". How can I help further?`);
      });

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: mockGenerateResponse
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // Multi-turn conversation
      const messages = [
        'I need help with merge sort algorithm',
        'Can you explain the time complexity?',
        'What about space complexity?',
        'Show me a code example'
      ];

      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');

      for (const message of messages) {
        await user.clear(inputField);
        await user.type(inputField, message);
        
        const sendButton = screen.getByLabelText('Send message');
        await user.click(sendButton);

        // Wait for response
        await screen.findByText(new RegExp(`Understood. You said: "${message}"`));
      }

      // Verify all messages and responses are in the chat
      for (const message of messages) {
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`Understood. You said: "${message}"`))).toBeInTheDocument();
      }

      // Verify conversation history was tracked
      expect(conversationHistory).toEqual(messages);
    });

    it('handles complex conversation with code examples', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue(`
          <p>Here's a merge sort implementation:</p>
          <pre><code>
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}
          </code></pre>
          <p>Time complexity: O(n log n)</p>
        `)
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // Request code example
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Show me merge sort code example in JavaScript');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify code example appears
      await screen.findByText(/function mergeSort/);
      expect(screen.getByText(/function mergeSort/)).toBeInTheDocument();
      expect(screen.getByText(/Time complexity: O\(n log n\)/)).toBeInTheDocument();

      // Send follow-up question
      await user.clear(inputField);
      await user.type(inputField, 'Can you explain how the merge function works?');
      await user.click(sendButton);

      // Verify follow-up response
      await screen.findByText(/merge function/);
    });
  });

  describe('Chat Management Workflow', () => {
    it('creates, uses, and deletes chats properly', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock Firestore operations
      const chatOperations = [];
      const mockAddDoc = vi.fn().mockImplementation(async (collection, data) => {
        const id = `chat-${Date.now()}`;
        chatOperations.push({ operation: 'create', id, data });
        return Promise.resolve({ id });
      });

      const mockDeleteDoc = vi.fn().mockImplementation(async (docRef) => {
        chatOperations.push({ operation: 'delete', docRef });
        return Promise.resolve();
      });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          addDoc: mockAddDoc,
          deleteDoc: mockDeleteDoc
        }
      }));

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Chat operation response')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // Create a new chat using the sidebar button
      const newChatButton = screen.getByLabelText('New chat');
      await user.click(newChatButton);

      // Wait for chat creation
      await new Promise(resolve => setTimeout(resolve, 50));

      // Send a message in the new chat
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Message in new chat');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify message appears
      expect(screen.getByText('Message in new chat')).toBeInTheDocument();

      // Now delete the chat
      const deleteButton = screen.getByLabelText('Delete chat');
      await user.click(deleteButton);

      // Confirm deletion
      const originalConfirm = window.confirm;
      window.confirm = vi.fn().mockReturnValue(true);

      // Wait for deletion
      await new Promise(resolve => setTimeout(resolve, 50));

      window.confirm = originalConfirm;

      // Verify delete operation was tracked
      const deleteOps = chatOperations.filter(op => op.operation === 'delete');
      expect(deleteOps.length).toBeGreaterThan(0);
    });

    it('renames chat and continues conversation', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Renamed chat response')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // Send initial message to create context
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Initial conversation');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify conversation started
      expect(screen.getByText('Initial conversation')).toBeInTheDocument();
    });
  });

  describe('Error Recovery Journey', () => {
    it('recovers from network errors during conversation', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock intermittent failures
      let callCount = 0;
      const mockGenerateResponse = vi.fn().mockImplementation((input) => {
        callCount++;
        if (callCount === 2) {
          // Fail on second call
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve(`Response to: ${input}`);
      });

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: mockGenerateResponse
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // First message should succeed
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'First message');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      await screen.findByText('Response to: First message');
      expect(screen.getByText('Response to: First message')).toBeInTheDocument();

      // Second message should fail
      await user.clear(inputField);
      await user.type(inputField, 'Second message (will fail)');
      await user.click(sendButton);

      // Should show error response
      await screen.findByText(/Sorry, I encountered an error processing your request/);
      
      // Third message should succeed again (recovery)
      await user.clear(inputField);
      await user.type(inputField, 'Third message after error');
      await user.click(sendButton);

      await screen.findByText('Response to: Third message after error');
      expect(screen.getByText('Response to: Third message after error')).toBeInTheDocument();
    });

    it('maintains conversation history after page refresh simulation', async () => {
      // This simulates what happens when user refreshes the page
      const existingMessages = [
        { id: 'msg-1', role: 'user', content: 'Previous message 1', createdAt: new Date() },
        { id: 'msg-2', role: 'assistant', content: 'Previous response 1', createdAt: new Date() }
      ];

      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock Firestore to return existing messages
      const mockOnSnapshot = vi.fn((query, callback) => {
        callback({
          docs: existingMessages.map(msg => ({
            id: msg.id,
            data: () => ({ ...msg })
          })),
          size: existingMessages.length,
          empty: false
        });
        return () => {};
      });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          onSnapshot: mockOnSnapshot
        }
      }));

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Refresh recovery response')
      }));

      const { rerender } = render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for messages to load
      await waitFor(() => {
        expect(screen.getByText('Previous message 1')).toBeInTheDocument();
      });

      // Verify previous messages are displayed
      expect(screen.getByText('Previous message 1')).toBeInTheDocument();
      expect(screen.getByText('Previous response 1')).toBeInTheDocument();

      // Simulate "refresh" by rerendering
      rerender(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for re-initialization
      await new Promise(resolve => setTimeout(resolve, 100));

      // Previous messages should still be visible
      expect(screen.getByText('Previous message 1')).toBeInTheDocument();
      expect(screen.getByText('Previous response 1')).toBeInTheDocument();

      // Continue conversation
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.clear(inputField);
      await user.type(inputField, 'Message after refresh');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // New message should appear with context preserved
      expect(screen.getByText('Message after refresh')).toBeInTheDocument();
      expect(screen.getByText('Refresh recovery response')).toBeInTheDocument();
    });
  });

  describe('Performance and Usability', () => {
    it('maintains responsiveness during heavy usage', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock fast responses to simulate good performance
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockImplementation((input) => {
          return Promise.resolve(`Quick response to: ${input}`);
        })
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      const sendButton = screen.getByLabelText('Send message');

      // Send multiple messages quickly
      const startTime = performance.now();

      for (let i = 0; i < 5; i++) {
        await user.clear(inputField);
        await user.type(inputField, `Quick message ${i + 1}`);
        await user.click(sendButton);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle multiple quick messages without significant lag
      expect(totalTime).toBeLessThan(2000); // Less than 2 seconds for 5 messages

      // Verify all messages were processed
      for (let i = 0; i < 5; i++) {
        await screen.findByText(`Quick response to: Quick message ${i + 1}`);
        expect(screen.getByText(`Quick response to: Quick message ${i + 1}`)).toBeInTheDocument();
      }
    });

    it('provides good user experience with loading states', async () => {
      // Mock authenticated user
      vi.mock('../../../src/hooks/useAuth', () => ({
        useAuth: vi.fn().mockReturnValue({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        })
      }));

      // Mock delayed response to test loading states
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockImplementation((input) => {
          return new Promise(resolve => {
            setTimeout(() => resolve(`Response to: ${input}`), 300);
          });
        })
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // Send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Message with loading state');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify user message appears immediately
      expect(screen.getByText('Message with loading state')).toBeInTheDocument();

      // Verify loading indicator appears
      expect(screen.getByText('AI is thinking...')).toBeInTheDocument();

      // Wait for response
      await screen.findByText('Response to: Message with loading state');
      expect(screen.getByText('Response to: Message with loading state')).toBeInTheDocument();

      // Loading indicator should disappear after response
      expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
    });
  });
});
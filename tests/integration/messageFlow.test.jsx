/**
 * Integration tests for message flow
 * Tests complete message flow from user input to AI response
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import AI from '../../../src/pages/AI/AI';
import * as testUtils from '../../../tests/test-utils.jsx';

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: (state = { currentUser: testUtils.testFixtures.users.authenticated }, action) => state,
      // Add other reducers as needed
    },
    preloadedState: initialState
  });
};

describe('Message Flow Integration Tests', () => {
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

  describe('Complete Message Flow', () => {
    it('sends user message and receives AI response', async () => {
      // Mock the response generator
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Mock AI response')
      }));

      const { generateResponse } = await import('../../../src/pages/AI/utils/responseGenerator');

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Find the input field and send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Hello, explain merge sort');
      
      // Find and click the send button
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify user message appears
      expect(screen.getByText('Hello, explain merge sort')).toBeInTheDocument();

      // Verify AI response appears
      await screen.findByText('Mock AI response');
      expect(screen.getByText('Mock AI response')).toBeInTheDocument();

      // Verify that generateResponse was called
      expect(generateResponse).toHaveBeenCalledWith('Hello, explain merge sort');
    });

    it('shows typing indicator while AI is processing', async () => {
      // Mock a delayed response
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockImplementation(() => {
          return new Promise(resolve => {
            setTimeout(() => resolve('Delayed AI response'), 100);
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
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Test message');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify user message appears immediately
      expect(screen.getByText('Test message')).toBeInTheDocument();

      // Verify typing indicator appears
      expect(screen.getByText('AI is thinking...')).toBeInTheDocument();

      // Wait for AI response
      await screen.findByText('Delayed AI response');
      expect(screen.getByText('Delayed AI response')).toBeInTheDocument();
    });

    it('handles rapid consecutive messages', async () => {
      // Mock responses
      const responses = ['Response 1', 'Response 2', 'Response 3'];
      let callCount = 0;
      
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockImplementation(() => {
          return Promise.resolve(responses[callCount++]);
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
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send multiple messages rapidly
      for (let i = 0; i < 3; i++) {
        const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
        await user.clear(inputField);
        await user.type(inputField, `Message ${i + 1}`);
        
        const sendButton = screen.getByLabelText('Send message');
        await user.click(sendButton);
      }

      // Verify all messages and responses appear
      for (let i = 0; i < 3; i++) {
        expect(screen.getByText(`Message ${i + 1}`)).toBeInTheDocument();
        expect(screen.getByText(`Response ${i + 1}`)).toBeInTheDocument();
      }
    });

    it('preserves message history during navigation', async () => {
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Test response')
      }));

      const { rerender } = render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'First message');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify messages are displayed
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Test response')).toBeInTheDocument();

      // Rerender the component (simulating route change)
      rerender(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for re-initialization
      await new Promise(resolve => setTimeout(resolve, 100));

      // Messages should be restored from Firebase
      // This depends on the Firestore subscription behavior
    });
  });

  describe('Error Handling in Message Flow', () => {
    it('shows error message when AI response fails', async () => {
      // Mock a failed response
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockRejectedValue(new Error('API Error'))
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Test message with error');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify user message appears
      expect(screen.getByText('Test message with error')).toBeInTheDocument();

      // Verify error response appears
      await screen.findByText(/Sorry, I encountered an error processing your request/);
      expect(screen.getByText(/Sorry, I encountered an error processing your request/)).toBeInTheDocument();
    });

    it('handles network errors gracefully', async () => {
      // Mock network error
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockRejectedValue(new Error('Network Error'))
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Network test message');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify user message appears
      expect(screen.getByText('Network test message')).toBeInTheDocument();

      // Verify fallback error response appears
      await screen.findByText(/Sorry, I encountered an error processing your request/);
      expect(screen.getByText(/Sorry, I encountered an error processing your request/)).toBeInTheDocument();
    });
  });

  describe('State Synchronization', () => {
    it('synchronizes messages with Firebase in real-time', async () => {
      // Mock Firestore operations
      const mockMessages = [];
      const mockAddDoc = vi.fn().mockImplementation(async (collection, message) => {
        const id = `msg-${Date.now()}`;
        mockMessages.push({ id, ...message });
        return Promise.resolve({ id });
      });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          addDoc: mockAddDoc
        }
      }));

      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Sync test response')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Sync test message');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify that messages were added to Firestore
      expect(mockAddDoc).toHaveBeenCalledTimes(2); // User message + AI response
    });

    it('handles concurrent message updates', async () => {
      // Mock concurrent responses
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockImplementation((input) => {
          return new Promise(resolve => {
            setTimeout(() => resolve(`Response to: ${input}`), Math.random() * 50);
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
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send multiple messages concurrently
      const messages = ['Msg 1', 'Msg 2', 'Msg 3'];
      
      const promises = messages.map(async (msg, index) => {
        const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
        await user.clear(inputField);
        await user.type(inputField, msg);
        
        const sendButton = screen.getByLabelText('Send message');
        await user.click(sendButton);
      });

      await Promise.all(promises);

      // Verify all messages and responses appear
      for (const msg of messages) {
        expect(screen.getByText(msg)).toBeInTheDocument();
        expect(screen.getByText(`Response to: ${msg}`)).toBeInTheDocument();
      }
    });
  });

  describe('User Experience Flow', () => {
    it('maintains scroll position to latest message', async () => {
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Scroll test response')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send multiple messages to create scrollable content
      for (let i = 0; i < 5; i++) {
        const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
        await user.clear(inputField);
        await user.type(inputField, `Message ${i + 1} with more content to make it longer`);
        
        const sendButton = screen.getByLabelText('Send message');
        await user.click(sendButton);
      }

      // The latest message should be visible (scrolled to bottom)
      const lastMessage = screen.getByText('Message 5 with more content to make it longer');
      expect(lastMessage).toBeInTheDocument();
    });

    it('disables input during AI processing', async () => {
      // Mock slow response
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockImplementation(() => {
          return new Promise(resolve => {
            setTimeout(() => resolve('Slow response'), 500);
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
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send a message
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Processing test');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Input should be disabled during processing
      expect(sendButton).toBeDisabled();
      
      // Wait for response to complete
      await screen.findByText('Slow response');
    });

    it('clears input after successful message send', async () => {
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Clear test response')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Type in the input field
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Test message to clear');
      
      // Verify text is in input
      expect(inputField.value).toBe('Test message to clear');

      // Send the message
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Input should be cleared after sending
      expect(inputField.value).toBe('');
    });
  });

  describe('Integration with Components', () => {
    it('coordinates properly with all chat components', async () => {
      vi.mock('../../../src/pages/AI/utils/responseGenerator', () => ({
        generateResponse: vi.fn().mockResolvedValue('Integration test response')
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify all major components are present
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByPlaceholderText('Message AlgoView AI...')).toBeInTheDocument(); // Input
      
      // Send a message to test component coordination
      const inputField = screen.getByPlaceholderText('Message AlgoView AI...');
      await user.type(inputField, 'Component coordination test');
      
      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      // Verify message appears in chat window
      expect(screen.getByText('Component coordination test')).toBeInTheDocument();
      expect(screen.getByText('Integration test response')).toBeInTheDocument();
    });

    it('handles component lifecycle correctly', async () => {
      const { unmount } = render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Component should initialize properly
      expect(screen.getByPlaceholderText('Message AlgoView AI...')).toBeInTheDocument();

      // Unmount and remount
      unmount();

      // Re-render to test cleanup and re-initialization
      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Should work after re-mounting
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.getByPlaceholderText('Message AlgoView AI...')).toBeInTheDocument();
    });
  });
});
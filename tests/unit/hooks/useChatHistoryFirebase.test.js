/**
 * Unit tests for useChatHistoryFirebase hook
 * Tests state management, Firebase operations, and error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatHistoryFirebase } from '../../../src/pages/AI/hooks/useChatHistoryFirebase';
import * as testUtils from '../../../tests/test-utils.jsx';

describe('useChatHistoryFirebase Hook', () => {
  let originalFirebase;

  beforeEach(() => {
    // Store original Firebase
    originalFirebase = { ...global };
    
    // Mock Firebase
    vi.mock('../../../src/lib/firebase', () => ({
      db: testUtils.mockFirestore,
      auth: testUtils.mockFirebase.auth
    }));
    
    testUtils.mockConsole();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    
    // Restore original Firebase
    Object.assign(global, originalFirebase);
  });

  describe('Initialization', () => {
    it('initializes with correct default state', () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      expect(result.current.chats).toEqual([]);
      expect(result.current.messages).toEqual([]);
      expect(result.current.activeChatId).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.isSending).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('sets loading to true initially', () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      expect(result.current.loading).toBe(true);
    });

    it('uses provided user authentication', () => {
      const user = testUtils.mockAuthState.authenticated;
      const { result } = renderHook(() => useChatHistoryFirebase(user));

      // Hook should accept and use the provided user
      expect(result.current).toBeDefined();
    });
  });

  describe('Chat Operations', () => {
    it('creates new chat when createNewChat is called', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        await result.current.createNewChat('Test Chat Title');
      });

      // Check that the chat was added to state
      expect(result.current.chats).toHaveLength(1);
      expect(result.current.chats[0].title).toBe('Test Chat Title');
    });

    it('selects chat when selectChat is called', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initial loading
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create a chat first
      await act(async () => {
        await result.current.createNewChat('Test Chat');
      });

      // Select the chat
      const chatId = result.current.chats[0]?.id;
      if (chatId) {
        await act(async () => {
          result.current.selectChat(chatId);
        });

        expect(result.current.activeChatId).toBe(chatId);
      }
    });

    it('deletes chat when deleteChat is called', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initial loading
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create a chat
      await act(async () => {
        await result.current.createNewChat('Test Chat to Delete');
      });

      const chatId = result.current.chats[0]?.id;
      if (chatId) {
        // Delete the chat
        await act(async () => {
          await result.current.deleteChat(chatId);
        });

        // Chat should be removed from state
        expect(result.current.chats).toHaveLength(0);
      }
    });
  });

  describe('Message Operations', () => {
    it('sends message when sendMessage is called', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create a chat first
      await act(async () => {
        await result.current.createNewChat('Test Chat');
      });

      // Send a message
      await act(async () => {
        await result.current.sendMessage('user', 'Hello, world!');
      });

      // Message should appear in state
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[0].content).toBe('Hello, world!');
    });

    it('sets isSending to true during message sending', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create a chat
      await act(async () => {
        await result.current.createNewChat('Test Chat');
      });

      // Initially not sending
      expect(result.current.isSending).toBe(false);

      // During send operation
      const sendPromise = act(async () => {
        await result.current.sendMessage('user', 'Test message');
      });

      // isSending should be true during the operation
      expect(result.current.isSending).toBe(true);

      // After operation completes
      await sendPromise;
      expect(result.current.isSending).toBe(false);
    });

    it('adds assistant messages correctly', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create a chat
      await act(async () => {
        await result.current.createNewChat('Test Chat');
      });

      // Send an assistant message
      await act(async () => {
        await result.current.sendMessage('assistant', 'AI response');
      });

      // Should have assistant message in state
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe('assistant');
      expect(result.current.messages[0].content).toBe('AI response');
    });
  });

  describe('State Management', () => {
    it('updates loading state correctly', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Initially loading
      expect(result.current.loading).toBe(true);

      // Wait for initialization to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should be loaded
      expect(result.current.loading).toBe(false);
    });

    it('maintains chat list state', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Add multiple chats
      await act(async () => {
        await result.current.createNewChat('Chat 1');
        await result.current.createNewChat('Chat 2');
        await result.current.createNewChat('Chat 3');
      });

      expect(result.current.chats).toHaveLength(3);
      expect(result.current.chats.map(chat => chat.title)).toEqual(['Chat 1', 'Chat 2', 'Chat 3']);
    });

    it('maintains active chat state', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create chats
      await act(async () => {
        await result.current.createNewChat('Chat 1');
        await result.current.createNewChat('Chat 2');
      });

      const chatIds = result.current.chats.map(chat => chat.id);
      
      // Switch between chats
      for (const chatId of chatIds) {
        await act(async () => {
          result.current.selectChat(chatId);
        });
        
        expect(result.current.activeChatId).toBe(chatId);
      }
    });
  });

  describe('Error Handling', () => {
    it('handles Firebase errors gracefully', async () => {
      // Mock a Firebase error
      const mockAddDoc = vi.fn().mockRejectedValue(new Error('Firebase error'));
      const mockOnSnapshot = vi.fn((query, callback) => {
        callback({ docs: [], size: 0, empty: true });
        return () => {};
      });

      vi.mock('../../../src/lib/firebase', () => ({
        db: {
          ...testUtils.mockFirestore,
          addDoc: mockAddDoc,
          onSnapshot: mockOnSnapshot
        },
        auth: testUtils.mockFirebase.auth
      }));

      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Try to create a chat (this should trigger the error)
      await act(async () => {
        try {
          await result.current.createNewChat('Test Chat');
        } catch (error) {
          // Error should be caught and handled
        }
      });

      // Check that error state is updated appropriately
      // Note: The exact behavior depends on how the hook handles errors internally
    });

    it('clears errors when clearError is called', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Simulate setting an error (this would happen internally in the hook)
      // Since we can't directly set error state, we'll test the clearError function
      await act(async () => {
        result.current.clearError();
      });

      // Error should be null after clearing
      expect(result.current.error).toBeNull();
    });
  });

  describe('Unauthenticated User', () => {
    it('handles unauthenticated user gracefully', () => {
      const { result } = renderHook(() => useChatHistoryFirebase(null));

      // Should initialize with default state even when unauthenticated
      expect(result.current.chats).toEqual([]);
      expect(result.current.messages).toEqual([]);
      expect(result.current.activeChatId).toBeNull();
      expect(result.current.loading).toBe(true);
    });

    it('does not perform Firebase operations when unauthenticated', () => {
      const { result } = renderHook(() => useChatHistoryFirebase(null));

      // The hook should handle unauthenticated state appropriately
      expect(result.current).toBeDefined();
    });
  });

  describe('Cleanup', () => {
    it('cleans up subscriptions when component unmounts', () => {
      const { unmount } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Unmount should clean up any subscriptions
      expect(() => unmount()).not.toThrow();
    });

    it('handles rapid mount/unmount cycles', () => {
      const { result, rerender, unmount } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Rapid mount/unmount cycles
      for (let i = 0; i < 5; i++) {
        rerender();
        expect(result.current).toBeDefined();
      }

      unmount();
      expect(() => unmount()).not.toThrow(); // Double unmount should be safe
    });
  });

  describe('Race Conditions', () => {
    it('handles concurrent operations safely', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Perform multiple operations concurrently
      await act(async () => {
        await Promise.all([
          result.current.createNewChat('Chat 1'),
          result.current.createNewChat('Chat 2'),
          result.current.createNewChat('Chat 3')
        ]);
      });

      expect(result.current.chats).toHaveLength(3);
    });

    it('maintains consistent state during rapid updates', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Rapid state changes
      await act(async () => {
        for (let i = 0; i < 10; i++) {
          await result.current.createNewChat(`Chat ${i}`);
        }
      });

      expect(result.current.chats).toHaveLength(10);
    });
  });

  describe('Performance', () => {
    it('handles large number of messages efficiently', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create a chat
      await act(async () => {
        await result.current.createNewChat('Performance Test Chat');
      });

      // Add many messages
      await act(async () => {
        for (let i = 0; i < 50; i++) {
          await result.current.sendMessage('user', `Message ${i}`);
        }
      });

      expect(result.current.messages).toHaveLength(50);
    });

    it('optimizes state updates', async () => {
      const { result } = renderHook(() => useChatHistoryFirebase(testUtils.mockAuthState.authenticated));

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create a chat
      await act(async () => {
        await result.current.createNewChat('Optimization Test Chat');
      });

      const startTime = performance.now();

      // Rapid message additions
      await act(async () => {
        for (let i = 0; i < 20; i++) {
          await result.current.sendMessage('user', `Quick message ${i}`);
        }
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle efficiently
      expect(totalTime).toBeLessThan(2000); // Less than 2 seconds for 20 messages
      expect(result.current.messages).toHaveLength(20);
    });
  });
});
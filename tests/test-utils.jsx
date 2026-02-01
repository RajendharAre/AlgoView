/**
 * Test utilities and mock setup for AI chat system testing
 * Provides common testing utilities, mock implementations, and test data
 */

import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock Firebase services
export const mockFirebase = {
  auth: {
    currentUser: {
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User'
    },
    onAuthStateChanged: vi.fn((callback) => {
      callback(mockFirebase.auth.currentUser);
      return () => {};
    }),
    signOut: vi.fn().mockResolvedValue(undefined)
  },
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    onSnapshot: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    serverTimestamp: vi.fn(() => new Date())
  }
};

// Mock Firestore functions
export const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'test-doc-id' }),
  getDoc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  onSnapshot: vi.fn((query, callback) => {
    callback({
      docs: [],
      size: 0,
      empty: true
    });
    return () => {};
  }),
  query: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn(() => new Date())
};

// Mock authentication state
export const mockAuthState = {
  authenticated: {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null
  },
  unauthenticated: null
};

// Test data fixtures
export const testFixtures = {
  // Test messages
  messages: {
    userMessage: {
      id: 'msg-1',
      role: 'user',
      content: 'Hello, explain merge sort',
      createdAt: new Date()
    },
    assistantMessage: {
      id: 'msg-2',
      role: 'assistant',
      content: '<p>Merge Sort is a divide and conquer algorithm...</p>',
      createdAt: new Date()
    },
    emptyMessage: {
      id: 'msg-3',
      role: 'user',
      content: '',
      createdAt: new Date()
    }
  },

  // Test chats
  chats: {
    emptyChatList: [],
    singleChat: [
      {
        id: 'chat-1',
        title: 'Test Conversation',
        userId: 'test-user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: 'Hello there'
      }
    ],
    multipleChats: [
      {
        id: 'chat-1',
        title: 'First Chat',
        userId: 'test-user-123',
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 1800000),
        lastMessage: 'Hello'
      },
      {
        id: 'chat-2',
        title: 'Second Chat',
        userId: 'test-user-123',
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(),
        lastMessage: 'How are you?'
      }
    ]
  },

  // Test users
  users: {
    authenticated: {
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User'
    },
    unauthenticated: null
  }
};

// Custom render function with providers
export const renderWithProviders = (ui, { router = true, ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => {
    if (router) {
      return <BrowserRouter>{children}</BrowserRouter>;
    }
    return children;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock console methods to reduce test noise
export const mockConsole = () => {
  const originalConsole = { ...console };
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
  return originalConsole;
};

// Restore console methods
export const restoreConsole = (originalConsole) => {
  Object.assign(console, originalConsole);
};

// Wait for async operations
export const waitForAsync = async (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for async operation'));
        } else {
          setTimeout(check, 10);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    check();
  });
};

// Mock resize observer for testing auto-resizing components
export const mockResizeObserver = () => {
  const originalResizeObserver = window.ResizeObserver;
  
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }));
  
  return () => {
    window.ResizeObserver = originalResizeObserver;
  };
};

// Mock scroll behavior
export const mockScrollBehavior = () => {
  const originalScrollTo = window.scrollTo;
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  
  return () => {
    window.scrollTo = originalScrollTo;
    Element.prototype.scrollIntoView = originalScrollIntoView;
  };
};

// Create mock event handlers
export const createMockHandlers = () => ({
  onSubmit: vi.fn(),
  onChange: vi.fn(),
  onClick: vi.fn(),
  onCopy: vi.fn(),
  onSelectChat: vi.fn(),
  onCreateChat: vi.fn().mockResolvedValue('new-chat-id'),
  onDeleteChat: vi.fn().mockResolvedValue(undefined),
  onError: vi.fn()
});

// Test helpers for common assertions
export const testHelpers = {
  // Check if element has specific classes
  hasClasses: (element, classes) => {
    const classList = element.className.split(' ');
    return classes.every(cls => classList.includes(cls));
  },

  // Check if element contains text
  containsText: (element, text) => {
    return element.textContent.includes(text);
  },

  // Wait for element to appear
  waitForElement: async (query, options = {}) => {
    const { timeout = 1000, interval = 50 } = options;
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = query();
      if (element) return element;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Element not found within timeout');
  }
};

export default {
  mockFirebase,
  mockFirestore,
  mockAuthState,
  testFixtures,
  renderWithProviders,
  mockConsole,
  restoreConsole,
  waitForAsync,
  mockResizeObserver,
  mockScrollBehavior,
  createMockHandlers,
  testHelpers
};
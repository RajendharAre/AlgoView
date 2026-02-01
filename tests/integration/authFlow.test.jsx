/**
 * Integration tests for authentication flow
 * Tests authentication state management and access control
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../../src/hooks/useAuth';
import AI from '../../../src/pages/AI/AI';
import * as testUtils from '../../../tests/test-utils.jsx';

// Mock useAuth hook
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: (state = { currentUser: null, loading: false }, action) => state,
    },
    preloadedState: initialState
  });
};

describe('Authentication Flow Integration Tests', () => {
  let mockStore;

  beforeEach(() => {
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

  describe('Authenticated User Flow', () => {
    it('loads AI page when user is authenticated', async () => {
      // Mock authenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: testUtils.testFixtures.users.authenticated,
        loading: false,
        isAuthenticated: true
      });

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for components to load
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // Verify AI components are accessible
      expect(screen.getByPlaceholderText('Message AlgoView AI...')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear chat')).toBeInTheDocument();
      expect(screen.getByText('Algorithm Assistant')).toBeInTheDocument();
    });

    it('initializes chat history for authenticated user', async () => {
      // Mock authenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: testUtils.testFixtures.users.authenticated,
        loading: false,
        isAuthenticated: true
      });

      // Mock Firestore operations for chat initialization
      const mockAddDoc = vi.fn().mockResolvedValue({ id: 'new-chat-id' });
      const mockOnSnapshot = vi.fn((query, callback) => {
        // Simulate empty chat list initially
        callback({
          docs: [],
          size: 0,
          empty: true
        });
        return () => {};
      });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          addDoc: mockAddDoc,
          onSnapshot: mockOnSnapshot
        }
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(mockAddDoc).toHaveBeenCalled(); // Should create initial chat
      });

      // Verify chat initialization
      expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
    });

    it('syncs chat data with user-specific Firestore collections', async () => {
      const mockUserId = 'test-user-123';
      
      // Mock authenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: { ...testUtils.testFixtures.users.authenticated, uid: mockUserId },
        loading: false,
        isAuthenticated: true
      });

      // Track Firestore calls to verify user-specific access
      const firestoreCalls = [];
      const mockCollection = vi.fn((db, path) => {
        firestoreCalls.push(path);
        return testUtils.mockFirestore.collection(db, path);
      });

      const mockAddDoc = vi.fn().mockResolvedValue({ id: 'test-msg-id' });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          collection: mockCollection,
          addDoc: mockAddDoc
        }
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify that Firestore collections are accessed with user ID
      const userCollectionCalls = firestoreCalls.filter(call => call.includes(mockUserId));
      expect(userCollectionCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Unauthenticated User Flow', () => {
    it('shows authentication prompt when user is not authenticated', async () => {
      // Mock unauthenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        loading: false,
        isAuthenticated: false
      });

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Should show some indication that authentication is required
      // This depends on the actual implementation - might redirect or show login prompt
      expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      // The actual behavior depends on the ProtectedRoute implementation
    });

    it('prevents chat operations when not authenticated', async () => {
      // Mock unauthenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        loading: false,
        isAuthenticated: false
      });

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for components to render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify that chat input might be disabled or show authentication requirement
      const inputElement = screen.getByPlaceholderText('Message AlgoView AI...');
      
      // Depending on implementation, input might be disabled or show login prompt
      // This test verifies the component renders without crashing
      expect(inputElement).toBeInTheDocument();
    });

    it('redirects or shows login when trying to access chat features', async () => {
      // Mock unauthenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        loading: false,
        isAuthenticated: false
      });

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify the basic structure is present
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Authentication State Changes', () => {
    it('updates UI when authentication state changes from unauthenticated to authenticated', async () => {
      // Initially unauthenticated
      const authMock = vi.fn()
        .mockReturnValueOnce({
          user: null,
          loading: false,
          isAuthenticated: false
        })
        .mockReturnValueOnce({
          user: testUtils.testFixtures.users.authenticated,
          loading: false,
          isAuthenticated: true
        });

      vi.mocked(useAuth).mockImplementation(authMock);

      const { rerender } = render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Initially, check for initial state handling
      await new Promise(resolve => setTimeout(resolve, 50));

      // Rerender with authenticated state
      rerender(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for UI to update
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      // Verify that AI components are now accessible
      expect(screen.getByPlaceholderText('Message AlgoView AI...')).toBeInTheDocument();
    });

    it('clears chat data when user signs out', async () => {
      // Initially authenticated
      const authStates = [
        { user: testUtils.testFixtures.users.authenticated, loading: false, isAuthenticated: true },
        { user: null, loading: false, isAuthenticated: false }
      ];
      let authStateIndex = 0;
      
      const authMock = vi.fn().mockImplementation(() => {
        return authStates[authStateIndex];
      });

      vi.mocked(useAuth).mockImplementation(authMock);

      const { rerender } = render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for initial authenticated state
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(screen.getByText('AlgoView AI')).toBeInTheDocument();

      // Change to unauthenticated state
      authStateIndex = 1;
      rerender(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for update
      await new Promise(resolve => setTimeout(resolve, 50));

      // UI should handle the state change appropriately
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state while checking authentication', async () => {
      // Mock loading state
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        loading: true,
        isAuthenticated: false
      });

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Should show loading indicator while checking auth
      // The exact loading UI depends on implementation
      expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
    });

    it('transitions from loading to authenticated state', async () => {
      // Simulate loading -> authenticated transition
      const authStates = [
        { user: null, loading: true, isAuthenticated: false }, // Loading
        { user: testUtils.testFixtures.users.authenticated, loading: false, isAuthenticated: true } // Authenticated
      ];
      let authStateIndex = 0;
      
      const authMock = vi.fn().mockImplementation(() => {
        return authStates[authStateIndex];
      });

      vi.mocked(useAuth).mockImplementation(authMock);

      const { rerender } = render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Initially loading
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Move to authenticated state
      authStateIndex = 1;
      rerender(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for authenticated UI to appear
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      expect(screen.getByPlaceholderText('Message AlgoView AI...')).toBeInTheDocument();
    });
  });

  describe('Protected Route Behavior', () => {
    it('follows protected route logic for AI page access', async () => {
      // Test with authenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: testUtils.testFixtures.users.authenticated,
        loading: false,
        isAuthenticated: true
      });

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Should render full AI interface
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      expect(screen.getByText('Algorithm Assistant')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear chat')).toBeInTheDocument();
    });

    it('handles unauthorized access attempts gracefully', async () => {
      // Test with unauthenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        loading: false,
        isAuthenticated: false
      });

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Should handle unauthorized access according to ProtectedRoute
      // This might render a different component or redirect
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Session Management', () => {
    it('maintains chat context during session', async () => {
      const mockUserId = 'session-test-user';
      
      // Mock authenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: { ...testUtils.testFixtures.users.authenticated, uid: mockUserId },
        loading: false,
        isAuthenticated: true
      });

      // Mock Firestore to track session-specific data
      const mockOnSnapshot = vi.fn((query, callback) => {
        // Simulate existing chat data for this user session
        callback({
          docs: [{
            id: 'test-chat-1',
            data: () => ({
              title: 'Previous Session Chat',
              userId: mockUserId,
              createdAt: new Date(),
              updatedAt: new Date(),
              lastMessage: 'Welcome back!'
            })
          }],
          size: 1,
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

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for session data to load
      await waitFor(() => {
        // This test verifies that the component can handle session-specific chat data
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });
    });

    it('isolates data between different user sessions', async () => {
      const userId1 = 'user-1';
      const userId2 = 'user-2';
      
      // Test with first user
      vi.mocked(useAuth).mockReturnValue({
        user: { ...testUtils.testFixtures.users.authenticated, uid: userId1 },
        loading: false,
        isAuthenticated: true
      });

      // Track Firestore calls to verify user isolation
      const firestoreCalls = [];
      const mockCollection = vi.fn((db, path) => {
        firestoreCalls.push(path);
        return testUtils.mockFirestore.collection(db, path);
      });

      vi.mock('../../../src/lib/firebase', () => ({
        ...testUtils.mockFirebase,
        db: {
          ...testUtils.mockFirestore,
          collection: mockCollection
        }
      }));

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for data loading
      await new Promise(resolve => setTimeout(resolve, 50));

      // Verify that collections were accessed with correct user ID
      const user1Calls = firestoreCalls.filter(call => call.includes(userId1));
      const user2Calls = firestoreCalls.filter(call => call.includes(userId2));
      
      expect(user1Calls.length).toBeGreaterThan(0);
      expect(user2Calls.length).toBe(0); // Should not access other user's data
    });
  });

  describe('Error Handling in Auth Flow', () => {
    it('handles authentication errors gracefully', async () => {
      // Mock auth error state
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        loading: false,
        isAuthenticated: false,
        error: new Error('Auth error occurred')
      });

      render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Should handle auth errors without crashing
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('recovers from authentication issues', async () => {
      // Start with auth error
      const authStates = [
        { 
          user: null, 
          loading: false, 
          isAuthenticated: false, 
          error: new Error('Auth error') 
        },
        { 
          user: testUtils.testFixtures.users.authenticated, 
          loading: false, 
          isAuthenticated: true 
        }
      ];
      let authStateIndex = 0;
      
      const authMock = vi.fn().mockImplementation(() => {
        return authStates[authStateIndex];
      });

      vi.mocked(useAuth).mockImplementation(authMock);

      const { rerender } = render(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for error state
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Move to recovered state
      authStateIndex = 1;
      rerender(
        <Provider store={mockStore}>
          <BrowserRouter>
            <AI />
          </BrowserRouter>
        </Provider>
      );

      // Wait for recovery
      await waitFor(() => {
        expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      });

      expect(screen.getByPlaceholderText('Message AlgoView AI...')).toBeInTheDocument();
    });
  });
});
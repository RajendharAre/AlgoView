import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProtectedRoute from '../../../../src/components/Layout/ProtectedRoute'

// Create a mock store
const createMockStore = (preloadedState) => {
  return configureStore({
    reducer: {
      user: (state = { currentUser: null, loading: false, error: null }, action) => {
        switch (action.type) {
          case 'user/setUser':
            return { ...state, currentUser: action.payload }
          case 'user/setLoading':
            return { ...state, loading: action.payload }
          default:
            return state
        }
      }
    },
    preloadedState
  })
}

describe('ProtectedRoute Component', () => {
  it('shows loading spinner when user state is loading', () => {
    const store = createMockStore({
      user: {
        currentUser: null,
        loading: true,
        error: null
      }
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    )

    // Check for the loading spinner by its class names instead of role
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated and not loading', () => {
    const store = createMockStore({
      user: {
        currentUser: null,
        loading: false,
        error: null
      }
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    )

    // Since we're using BrowserRouter, we can't directly test navigation
    // But we can verify that the protected content is not rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User'
    }

    const store = createMockStore({
      user: {
        currentUser: mockUser,
        loading: false,
        error: null
      }
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
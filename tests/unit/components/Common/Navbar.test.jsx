import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Navbar from '../../../../src/components/Common/Navbar'

// Mock the Firebase auth module
vi.mock('../../../../src/lib/firebase', () => ({
  auth: {
    signOut: vi.fn()
  }
}))

// Mock the Firebase auth functions
vi.mock('firebase/auth', () => ({
  signOut: vi.fn()
}))

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

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <div>{children}</div>
}))

describe('Navbar Component', () => {
  let store

  beforeEach(() => {
    store = createMockStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders navbar with logo and navigation links', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )

    // Check if logo is rendered
    expect(screen.getByText('AlgorithmVis')).toBeInTheDocument()

    // Check if navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('DSA')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('Rewards')).toBeInTheDocument()
  })

  it('shows login/register buttons when user is not authenticated', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  it('shows user profile and sign out when user is authenticated', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User'
    }

    const storeWithUser = createMockStore({
      user: {
        currentUser: mockUser,
        loading: false,
        error: null
      }
    })

    render(
      <Provider store={storeWithUser}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )

    // Click on the user dropdown to reveal the menu
    const userButton = screen.getByRole('button', { name: /Test User/i })
    fireEvent.click(userButton)
    
    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })
})
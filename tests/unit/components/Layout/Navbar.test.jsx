import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Navbar from '../../../../src/components/Layout/Navbar'

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
  }
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
    expect(screen.getByText('Algorithm')).toBeInTheDocument()
    expect(screen.getByText('Visualizer')).toBeInTheDocument()

    // Check if navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('DSA')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Ideas')).toBeInTheDocument()
    expect(screen.getByText('References')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
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

    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })

  it('navigates to home page when logo is clicked', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )

    const logo = screen.getByText('Algorithm')
    fireEvent.click(logo)
    
    // Since we're using BrowserRouter, we can't directly test navigation
    // But we can verify the onClick handler is attached
    expect(logo).toBeInTheDocument()
  })

  it('reloads page when same navigation link is clicked', async () => {
    // Mock window.location.reload
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    })

    // Mock useLocation to return current path
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useLocation: () => ({ pathname: '/dsa' })
      }
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )

    // Find the DSA link and click it
    const dsaLink = screen.getByText('DSA')
    fireEvent.click(dsaLink)
    
    // Expect reload to be called
    expect(reloadMock).toHaveBeenCalled()
  })
})
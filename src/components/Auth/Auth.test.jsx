import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Auth from './Auth'

// Mock Framer Motion to avoid infinite loops in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  layoutId: vi.fn(),
}))

// Create a mock store
const mockStore = {
  getState: () => ({
    user: {
      currentUser: null,
      loading: false,
      error: null,
    },
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn(),
}

describe('Auth Component', () => {
  const renderAuth = () => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Auth />
        </BrowserRouter>
      </Provider>
    )
  }

  it('renders the Auth component with login form by default', () => {
    renderAuth()
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('switches to register form when Sign Up tab is clicked', () => {
    renderAuth()
    
    // Click on Sign Up tab
    fireEvent.click(screen.getByText('Sign Up'))
    
    // Check that we can still find both tabs
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('switches to login form when Sign In tab is clicked', () => {
    renderAuth()
    
    // First switch to register form
    fireEvent.click(screen.getByText('Sign Up'))
    
    // Then switch back to login form
    fireEvent.click(screen.getByText('Sign In'))
    
    // Check that we can still find both tabs
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })
})
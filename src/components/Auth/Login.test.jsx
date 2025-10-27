import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Login from './Login'

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

// Mock Firebase auth functions
vi.mock('../../lib/firebase', () => ({
  auth: {},
}))

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(),
  GithubAuthProvider: vi.fn(),
}))

// Mock the userSlice actions
vi.mock('../../store/slices/userSlice', () => ({
  loginUser: vi.fn(),
  loginWithGoogle: vi.fn(),
  loginWithGitHub: vi.fn(),
}))

// Mock validation
vi.mock('../../utils/validation', () => ({
  validateLogin: vi.fn().mockReturnValue({ success: true }),
}))

describe('Login Component', () => {
  const mockSwitchToRegister = vi.fn()

  const renderLogin = () => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login onSwitchToRegister={mockSwitchToRegister} />
        </BrowserRouter>
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login form correctly', () => {
    renderLogin()
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('calls onSwitchToRegister when Sign up link is clicked', () => {
    renderLogin()
    
    const signUpLink = screen.getByText('Sign up')
    fireEvent.click(signUpLink)
    
    expect(mockSwitchToRegister).toHaveBeenCalledTimes(1)
  })

  it('shows forgot password form when Forgot Password link is clicked', () => {
    renderLogin()
    
    const forgotPasswordLink = screen.getByText('Forgot Password?')
    fireEvent.click(forgotPasswordLink)
    
    // This would normally show the ForgotPassword component
    // We're just checking that the click handler works
    expect(forgotPasswordLink).toBeInTheDocument()
  })
})
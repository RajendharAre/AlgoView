import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Register from './Register'

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

// Mock Firebase functions
vi.mock('../../lib/firebase', () => ({
  auth: {},
  db: {},
}))

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  GithubAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
}))

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
}))

// Mock validation
vi.mock('../../utils/validation', () => ({
  validateRegister: vi.fn().mockReturnValue({ success: true }),
}))

describe('Register Component', () => {
  const mockSwitchToLogin = vi.fn()

  const renderRegister = () => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Register onSwitchToLogin={mockSwitchToLogin} />
        </BrowserRouter>
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the register form correctly', () => {
    renderRegister()
    
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Create a password (min. 6 characters)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  it('calls onSwitchToLogin when Sign in here link is clicked', () => {
    renderRegister()
    
    const signInLink = screen.getByText('Sign in here')
    fireEvent.click(signInLink)
    
    expect(mockSwitchToLogin).toHaveBeenCalledTimes(1)
  })
})
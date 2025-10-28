import { describe, it, expect, vi, beforeEach } from 'vitest'
import userSlice, {
  setUser,
  setLoading,
  clearError,
  registerUser,
  loginUser,
  loginWithGoogle,
  loginWithGitHub,
  signOut,
  initializeAuthListener
} from '../../../src/store/slices/userSlice'

// Mock Firebase functions
const mockCreateUserWithEmailAndPassword = vi.fn()
const mockSignInWithEmailAndPassword = vi.fn()
const mockGoogleAuthProvider = vi.fn()
const mockGithubAuthProvider = vi.fn()
const mockSignInWithPopup = vi.fn()
const mockSignOut = vi.fn()
const mockOnAuthStateChanged = vi.fn()

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args) => mockCreateUserWithEmailAndPassword(...args),
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args),
  GoogleAuthProvider: mockGoogleAuthProvider,
  GithubAuthProvider: mockGithubAuthProvider,
  signInWithPopup: (...args) => mockSignInWithPopup(...args),
  signOut: (...args) => mockSignOut(...args),
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args)
}))

describe('userSlice', () => {
  const initialState = {
    currentUser: null,
    loading: true,
    error: null
  }

  it('should return the initial state', () => {
    expect(userSlice(undefined, { type: '' })).toEqual(initialState)
  })

  it('should handle setUser', () => {
    const user = { uid: '123', email: 'test@example.com' }
    const actual = userSlice(initialState, setUser(user))
    expect(actual.currentUser).toEqual(user)
  })

  it('should handle setLoading', () => {
    const actual = userSlice(initialState, setLoading(false))
    expect(actual.loading).toBe(false)
  })

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' }
    const actual = userSlice(stateWithError, clearError())
    expect(actual.error).toBeNull()
  })

  describe('Async Thunks', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should handle registerUser pending', () => {
      const action = { type: registerUser.pending.type }
      const actual = userSlice(initialState, action)
      expect(actual.loading).toBe(true)
      expect(actual.error).toBeNull()
    })

    it('should handle registerUser fulfilled', () => {
      const user = { uid: '123', email: 'test@example.com' }
      const action = { type: registerUser.fulfilled.type, payload: user }
      const actual = userSlice(initialState, action)
      expect(actual.loading).toBe(false)
      expect(actual.currentUser).toEqual(user)
    })

    it('should handle registerUser rejected', () => {
      const errorMessage = 'Registration failed'
      const action = { type: registerUser.rejected.type, payload: errorMessage }
      const actual = userSlice(initialState, action)
      expect(actual.loading).toBe(false)
      expect(actual.error).toBe(errorMessage)
    })

    it('should handle loginUser pending', () => {
      const action = { type: loginUser.pending.type }
      const actual = userSlice(initialState, action)
      expect(actual.loading).toBe(true)
      expect(actual.error).toBeNull()
    })

    it('should handle loginUser fulfilled', () => {
      const user = { uid: '123', email: 'test@example.com' }
      const action = { type: loginUser.fulfilled.type, payload: user }
      const actual = userSlice(initialState, action)
      expect(actual.loading).toBe(false)
      expect(actual.currentUser).toEqual(user)
    })

    it('should handle loginUser rejected', () => {
      const errorMessage = 'Login failed'
      const action = { type: loginUser.rejected.type, payload: errorMessage }
      const actual = userSlice(initialState, action)
      expect(actual.loading).toBe(false)
      expect(actual.error).toBe(errorMessage)
    })

    it('should handle signOut fulfilled', () => {
      const stateWithUser = { ...initialState, currentUser: { uid: '123' } }
      const action = { type: signOut.fulfilled.type }
      const actual = userSlice(stateWithUser, action)
      expect(actual.currentUser).toBeNull()
      expect(actual.loading).toBe(false)
    })
  })

  describe('extractUserData function', () => {
    it('should extract serializable user data', () => {
      const mockFirebaseUser = {
        uid: '123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
        providerData: [
          {
            providerId: 'google.com',
            uid: '456',
            displayName: 'Test User',
            email: 'test@example.com',
            phoneNumber: null,
            photoURL: 'https://example.com/photo.jpg'
          }
        ],
        metadata: {
          creationTime: '2023-01-01T00:00:00.000Z',
          lastSignInTime: '2023-01-02T00:00:00.000Z'
        }
      }

      // Import the extractUserData function from the actual slice
      const { extractUserData } = require('../../../src/store/slices/userSlice')
      const extractedData = extractUserData(mockFirebaseUser)

      expect(extractedData).toEqual({
        uid: '123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
        providerData: [
          {
            providerId: 'google.com',
            uid: '456',
            displayName: 'Test User',
            email: 'test@example.com',
            phoneNumber: null,
            photoURL: 'https://example.com/photo.jpg'
          }
        ],
        metadata: {
          creationTime: '2023-01-01T00:00:00.000Z',
          lastSignInTime: '2023-01-02T00:00:00.000Z'
        }
      })
    })

    it('should return null for null user', () => {
      const { extractUserData } = require('../../../src/store/slices/userSlice')
      const extractedData = extractUserData(null)
      expect(extractedData).toBeNull()
    })
  })
})
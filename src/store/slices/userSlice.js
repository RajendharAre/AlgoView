import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../../lib/firebase'

// Define initial state
const initialState = {
  currentUser: null,
  loading: true, // Start with loading true to check auth state
  error: null,
}

// Helper function to extract serializable user data
const extractUserData = (user) => {
  if (!user) return null
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    tenantId: user.tenantId,
    providerData: user.providerData?.map(provider => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      photoURL: provider.photoURL
    })) || [],
    metadata: {
      creationTime: user.metadata?.creationTime,
      lastSignInTime: user.metadata?.lastSignInTime
    }
  }
}

// Initialize auth state listener
export const initializeAuthListener = createAsyncThunk(
  'user/initializeAuthListener',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(setUser(extractUserData(user)))
        } else {
          dispatch(setUser(null))
        }
        dispatch(setLoading(false))
        resolve()
      })
      
      // Return unsubscribe function as meta
      return unsubscribe
    })
  }
)

// Async thunks
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return extractUserData(userCredential.user)
    } catch (error) {
      return rejectWithValue(getFriendlyErrorMessage(error))
    }
  }
)

// Maps Firebase error codes to user-friendly messages
const getFriendlyErrorMessage = (error) => {
  const code = error.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or create a new account.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.'
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.'
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. You can try again when ready.'
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. You can try again when ready.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized. Please contact support.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.'
    default:
      // Catch any raw Firebase error string and replace with friendly text
      if (error.message?.startsWith('Firebase:') || error.message?.includes('auth/')) {
        return 'Authentication failed. Please try again.'
      }
      return error.message || 'Something went wrong. Please try again.'
  }
}

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return extractUserData(userCredential.user)
    } catch (error) {
      return rejectWithValue(getFriendlyErrorMessage(error))
    }
  }
)

export const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      return extractUserData(userCredential.user)
    } catch (error) {
      return rejectWithValue(getFriendlyErrorMessage(error))
    }
  }
)

export const loginWithGitHub = createAsyncThunk(
  'user/loginWithGitHub',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GithubAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      return extractUserData(userCredential.user)
    } catch (error) {
      return rejectWithValue(getFriendlyErrorMessage(error))
    }
  }
)

export const signOut = createAsyncThunk('user/signOut', async (_, { rejectWithValue }) => {
  try {
    await firebaseSignOut(auth)
    return null
  } catch (error) {
    return rejectWithValue(getFriendlyErrorMessage(error))
  }
})

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    // Register user
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login user
      .addCase(loginUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Google login
      .addCase(loginWithGoogle.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // GitHub login
      .addCase(loginWithGitHub.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithGitHub.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(loginWithGitHub.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Sign out
      .addCase(signOut.fulfilled, state => {
        state.currentUser = null
        state.loading = false
      })
      // Initialize auth listener
      .addCase(initializeAuthListener.pending, state => {
        state.loading = true
      })
      .addCase(initializeAuthListener.fulfilled, state => {
        // Loading state is handled in the thunk
      })
      .addCase(initializeAuthListener.rejected, state => {
        state.loading = false
      })
  },
})

// Export actions
export const { setUser, setLoading, clearError } = userSlice.actions

// Export selectors
export const selectCurrentUser = state => state.user.currentUser
export const selectUserLoading = state => state.user.loading
export const selectUserError = state => state.user.error

// Export reducer
export default userSlice.reducer

// Initialize the auth listener when the app starts
export const initAuth = () => (dispatch) => {
  dispatch(initializeAuthListener())
}

// Export state type for documentation
/**
 * @typedef {Object} UserState
 * @property {Object|null} currentUser - The current authenticated user
 * @property {boolean} loading - Whether an auth operation is in progress
 * @property {string|null} error - Any error message from auth operations
 */
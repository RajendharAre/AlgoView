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

// Function to serialize Firebase user object
const serializeUser = (user) => {
  if (!user) return null
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    providerData: user.providerData?.map(provider => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName,
      email: provider.email,
      photoURL: provider.photoURL
    })) || []
  }
}

// Define initial state
const initialState = {
  currentUser: null,
  loading: true, // Start with loading true to check auth state
  error: null,
}

// Initialize auth state listener
export const initializeAuthListener = createAsyncThunk(
  'user/initializeAuthListener',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(setUser(serializeUser(user)))
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
      return serializeUser(userCredential.user)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return serializeUser(userCredential.user)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      return serializeUser(userCredential.user)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginWithGitHub = createAsyncThunk(
  'user/loginWithGitHub',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GithubAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      return serializeUser(userCredential.user)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const signOut = createAsyncThunk('user/signOut', async (_, { rejectWithValue }) => {
  try {
    await firebaseSignOut(auth)
    return null
  } catch (error) {
    return rejectWithValue(error.message)
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
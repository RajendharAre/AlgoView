import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

// Define initial state
const initialState = {
  resources: [],
  categories: [],
  filters: {
    category: 'all',
    type: 'all',
    searchTerm: '',
  },
  loading: false,
  error: null,
}

// Async thunks for CRUD operations
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'resources'))
      const resources = []
      querySnapshot.forEach(doc => {
        resources.push({ id: doc.id, ...doc.data() })
      })
      return resources
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createResource = createAsyncThunk(
  'resources/createResource',
  async (resourceData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'resources'), {
        ...resourceData,
        createdAt: new Date(),
      })
      return { id: docRef.id, ...resourceData }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const resourceRef = doc(db, 'resources', id)
      await updateDoc(resourceRef, updateData)
      return { id, ...updateData }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'resources', id))
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Create slice
const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearError: state => {
      state.error = null
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
  },
  extraReducers: builder => {
    builder
      // Fetch resources
      .addCase(fetchResources.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false
        state.resources = action.payload
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create resource
      .addCase(createResource.fulfilled, (state, action) => {
        state.resources.push(action.payload)
      })
      .addCase(createResource.rejected, (state, action) => {
        state.error = action.payload
      })
      // Update resource
      .addCase(updateResource.fulfilled, (state, action) => {
        const index = state.resources.findIndex(resource => resource.id === action.payload.id)
        if (index !== -1) {
          state.resources[index] = { ...state.resources[index], ...action.payload }
        }
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.error = action.payload
      })
      // Delete resource
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter(resource => resource.id !== action.payload)
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

// Export actions
export const { setFilters, clearError, setCategories } = resourcesSlice.actions

// Export selectors
export const selectResources = state => state.resources.resources
export const selectCategories = state => state.resources.categories
export const selectResourcesLoading = state => state.resources.loading
export const selectResourcesError = state => state.resources.error
export const selectResourceFilters = state => state.resources.filters

// Export reducer
export default resourcesSlice.reducer

// Export state type for documentation
/**
 * @typedef {Object} ResourcesState
 * @property {Array} resources - Array of resource objects
 * @property {Array} categories - Array of resource categories
 * @property {Object} filters - Filter options for resources
 * @property {boolean} loading - Whether resources are being fetched
 * @property {string|null} error - Any error message
 */

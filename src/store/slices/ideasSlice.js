import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Define initial state
const initialState = {
  ideas: [],
  selectedIdea: null,
  filters: {
    category: 'all',
    sortBy: 'newest',
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchIdeas = createAsyncThunk(
  'ideas/fetchIdeas',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ideas'));
      const ideas = [];
      querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
      });
      return ideas;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createIdea = createAsyncThunk(
  'ideas/createIdea',
  async (ideaData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'ideas'), {
        ...ideaData,
        createdAt: new Date(),
        likes: 0,
        likedBy: [],
      });
      return { id: docRef.id, ...ideaData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateIdea = createAsyncThunk(
  'ideas/updateIdea',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const ideaRef = doc(db, 'ideas', id);
      await updateDoc(ideaRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteIdea = createAsyncThunk(
  'ideas/deleteIdea',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'ideas', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeIdea = createAsyncThunk(
  'ideas/likeIdea',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      // In a real app, you would fetch the current idea data first
      // and then update the likedBy array and likes count
      // This is a simplified version
      return { id, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    setSelectedIdea: (state, action) => {
      state.selectedIdea = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ideas
      .addCase(fetchIdeas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = action.payload;
      })
      .addCase(fetchIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create idea
      .addCase(createIdea.fulfilled, (state, action) => {
        state.ideas.push(action.payload);
      })
      .addCase(createIdea.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update idea
      .addCase(updateIdea.fulfilled, (state, action) => {
        const index = state.ideas.findIndex(idea => idea.id === action.payload.id);
        if (index !== -1) {
          state.ideas[index] = { ...state.ideas[index], ...action.payload };
        }
      })
      .addCase(updateIdea.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete idea
      .addCase(deleteIdea.fulfilled, (state, action) => {
        state.ideas = state.ideas.filter(idea => idea.id !== action.payload);
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Like idea
      .addCase(likeIdea.fulfilled, (state, action) => {
        const { id, userId } = action.payload;
        const idea = state.ideas.find(idea => idea.id === id);
        if (idea) {
          // Toggle like for the user
          if (idea.likedBy && idea.likedBy.includes(userId)) {
            idea.likedBy = idea.likedBy.filter(id => id !== userId);
            idea.likes = Math.max(0, idea.likes - 1);
          } else {
            idea.likedBy = idea.likedBy ? [...idea.likedBy, userId] : [userId];
            idea.likes = (idea.likes || 0) + 1;
          }
        }
      })
      .addCase(likeIdea.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setSelectedIdea, setFilters, clearError } = ideasSlice.actions;

// Export selectors
export const selectIdeas = (state) => state.ideas.ideas;
export const selectSelectedIdea = (state) => state.ideas.selectedIdea;
export const selectIdeasLoading = (state) => state.ideas.loading;
export const selectIdeasError = (state) => state.ideas.error;
export const selectFilters = (state) => state.ideas.filters;

// Export reducer
export default ideasSlice.reducer;

// Export state type for documentation
/**
 * @typedef {Object} IdeasState
 * @property {Array} ideas - Array of idea objects
 * @property {Object|null} selectedIdea - The currently selected idea
 * @property {Object} filters - Filter options for ideas
 * @property {boolean} loading - Whether ideas are being fetched
 * @property {string|null} error - Any error message
 */
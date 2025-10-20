import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Define initial state
const initialState = {
  selectedAlgorithm: 'bubbleSort',
  isRunning: false,
  speed: 500,
  currentStep: 0,
  inputData: [64, 34, 25, 12, 22, 11, 90],
  steps: [],
  searchTarget: 25,
};

// Async thunk to save user state to Firestore
export const saveUserState = createAsyncThunk(
  'algorithm/saveUserState',
  async (userState, { rejectWithValue }) => {
    try {
      // Assuming userState contains userId and algorithm data
      if (!userState.userId) {
        throw new Error('User ID is required to save state');
      }
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'userStates'), {
        ...userState,
        createdAt: new Date(),
      });
      
      return { id: docRef.id, ...userState };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const algorithmSlice = createSlice({
  name: 'algorithm',
  initialState,
  reducers: {
    setAlgorithm: (state, action) => {
      state.selectedAlgorithm = action.payload;
    },
    play: (state) => {
      state.isRunning = true;
    },
    pause: (state) => {
      state.isRunning = false;
    },
    reset: (state) => {
      state.isRunning = false;
      state.currentStep = 0;
      state.steps = [];
    },
    setSpeed: (state, action) => {
      state.speed = action.payload;
    },
    updateStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setInputData: (state, action) => {
      state.inputData = action.payload;
    },
    setSteps: (state, action) => {
      state.steps = action.payload;
    },
    setSearchTarget: (state, action) => {
      state.searchTarget = action.payload;
    },
    updateAlgorithmState: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUserState.pending, () => {
        // Could add a saving state if needed
      })
      .addCase(saveUserState.fulfilled, (state, action) => {
        // State saved successfully
        console.log('User state saved with ID:', action.payload.id);
      })
      .addCase(saveUserState.rejected, (state, action) => {
        // Handle error
        console.error('Failed to save user state:', action.payload);
      });
  },
});

// Export actions
export const {
  setAlgorithm,
  play,
  pause,
  reset,
  setSpeed,
  updateStep,
  setInputData,
  setSteps,
  setSearchTarget,
  updateAlgorithmState,
} = algorithmSlice.actions;

// Export selectors
export const selectAlgorithm = (state) => state.algorithm.selectedAlgorithm;
export const selectIsRunning = (state) => state.algorithm.isRunning;
export const selectSpeed = (state) => state.algorithm.speed;
export const selectCurrentStep = (state) => state.algorithm.currentStep;
export const selectInputData = (state) => state.algorithm.inputData;
export const selectSteps = (state) => state.algorithm.steps;
export const selectSearchTarget = (state) => state.algorithm.searchTarget;

// Export reducer
export default algorithmSlice.reducer;

// Export state type for documentation
/**
 * @typedef {Object} AlgorithmState
 * @property {string} selectedAlgorithm - The currently selected algorithm
 * @property {boolean} isRunning - Whether the algorithm is currently running
 * @property {number} speed - The speed of the algorithm visualization
 * @property {number} currentStep - The current step in the algorithm
 * @property {Array} inputData - The input data for the algorithm
 * @property {Array} steps - The steps of the algorithm
 * @property {number} searchTarget - The target value for search algorithms
 */
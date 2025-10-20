import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import algorithmReducer from './slices/algorithmSlice';
import uiReducer from './slices/uiSlice';
import ideasReducer from './slices/ideasSlice';
import resourcesReducer from './slices/resourcesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    algorithm: algorithmReducer,
    ui: uiReducer,
    ideas: ideasReducer,
    resources: resourcesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these Firebase and DOM specific actions
        ignoredActions: [
          'user/loginUser/fulfilled',
          'user/registerUser/fulfilled',
          'user/loginWithGoogle/fulfilled',
        ],
      },
    }),
  devTools: true,
});

// Export types for use in components
// In a JS project, we can't use TypeScript types but can document them
/**
 * @typedef {Object} RootState
 * @property {import('./slices/userSlice').UserState} user
 * @property {import('./slices/algorithmSlice').AlgorithmState} algorithm
 * @property {import('./slices/uiSlice').UIState} ui
 * @property {import('./slices/ideasSlice').IdeasState} ideas
 * @property {import('./slices/resourcesSlice').ResourcesState} resources
 */

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */
# Redux Store Implementation

This directory contains the Redux Toolkit store configuration for the Algorithm Visualizer application.

## Store Structure

```
src/store/
├── store.js              # Main store configuration
└── slices/
    ├── userSlice.js      # User authentication state
    ├── algorithmSlice.js # Algorithm visualization state
    ├── uiSlice.js        # UI state management
    ├── ideasSlice.js     # Ideas management
    └── resourcesSlice.js # Resources management
```

## Features Implemented

### 1. Main Store (`store.js`)
- Configured Redux Toolkit store with all slices
- Proper middleware configuration for Firebase
- Redux DevTools integration
- TypeScript-style documentation for state types

### 2. User Slice (`userSlice.js`)
**State:**
- `currentUser`: Current authenticated user
- `loading`: Authentication operation status
- `error`: Error messages

**Async Thunks:**
- `registerUser`: Register new user with email/password
- `loginUser`: Login with email/password
- `loginWithGoogle`: Google OAuth login
- `loginWithGitHub`: GitHub OAuth login
- `signOut`: Sign out current user

**Reducers:**
- `setUser`: Set current user
- `clearError`: Clear authentication errors

### 3. Algorithm Slice (`algorithmSlice.js`)
**State:**
- `selectedAlgorithm`: Currently selected algorithm
- `isRunning`: Algorithm execution status
- `speed`: Visualization speed
- `currentStep`: Current step in algorithm
- `inputData`: Input data for algorithm
- `steps`: Algorithm steps
- `searchTarget`: Target for search algorithms

**Reducers:**
- `setAlgorithm`: Set selected algorithm
- `play`: Start algorithm execution
- `pause`: Pause algorithm execution
- `reset`: Reset algorithm state
- `setSpeed`: Set visualization speed
- `updateStep`: Update current step
- `setInputData`: Set input data
- `setSteps`: Set algorithm steps
- `setSearchTarget`: Set search target
- `updateAlgorithmState`: Update multiple state properties

**Async Thunks:**
- `saveUserState`: Save user state to Firestore

### 4. UI Slice (`uiSlice.js`)
**State:**
- `theme`: Current theme (light/dark)
- `sidebarOpen`: Sidebar visibility
- `modalOpen`: Modal visibility
- `notifications`: Notification array

**Reducers:**
- `toggleTheme`: Toggle between light/dark theme
- `setTheme`: Set specific theme
- `toggleSidebar`: Toggle sidebar visibility
- `setSidebarOpen`: Set sidebar visibility
- `openModal`: Open modal
- `closeModal`: Close modal
- `addNotification`: Add new notification
- `removeNotification`: Remove specific notification
- `clearNotifications`: Clear all notifications

### 5. Ideas Slice (`ideasSlice.js`)
**State:**
- `ideas`: Array of idea objects
- `selectedIdea`: Currently selected idea
- `filters`: Filter options
- `loading`: Loading status
- `error`: Error messages

**Async Thunks:**
- `fetchIdeas`: Fetch all ideas from Firestore
- `createIdea`: Create new idea
- `updateIdea`: Update existing idea
- `deleteIdea`: Delete idea
- `likeIdea`: Like/unlike an idea

**Reducers:**
- `setSelectedIdea`: Set currently selected idea
- `setFilters`: Update filter options
- `clearError`: Clear errors

### 6. Resources Slice (`resourcesSlice.js`)
**State:**
- `resources`: Array of resource objects
- `categories`: Resource categories
- `filters`: Filter options
- `loading`: Loading status
- `error`: Error messages

**Async Thunks:**
- `fetchResources`: Fetch all resources from Firestore
- `createResource`: Create new resource
- `updateResource`: Update existing resource
- `deleteResource`: Delete resource

**Reducers:**
- `setFilters`: Update filter options
- `clearError`: Clear errors
- `setCategories`: Set resource categories

## Usage

To use the Redux store in your components:

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { setAlgorithm, play } from '../store/slices/algorithmSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { selectedAlgorithm, isRunning } = useSelector(state => state.algorithm);
  
  const handlePlay = () => {
    dispatch(play());
  };
  
  return (
    // Your component JSX
  );
};
```

## Error Handling

All async operations include proper error handling with:
- Pending states for loading indicators
- Fulfilled states for successful operations
- Rejected states for error handling

## Firebase Integration

All slices that interact with Firebase:
- Use proper async/await patterns
- Handle errors with rejectWithValue
- Include proper TypeScript documentation
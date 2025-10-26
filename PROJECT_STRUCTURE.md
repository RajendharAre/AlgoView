# Algorithm Visualizer - Project Structure

## Overview

This document provides a comprehensive overview of the Algorithm Visualizer project structure, component relationships, and key implementation details.

## Project Structure

```
algorithm-visualizer/
├── src/
│   ├── algorithms/              # Algorithm implementations
│   │   ├── Sorting/            # Sorting algorithms (bubble, merge, quick, etc.)
│   │   ├── Searching/          # Searching algorithms (linear, binary)
│   │   ├── Graph/              # Graph algorithms (BFS, DFS, Dijkstra)
│   │   └── DP/                 # Dynamic programming algorithms
│   ├── components/             # Reusable UI components
│   │   ├── Auth/               # Authentication components
│   │   ├── Layout/             # Layout components (Navbar, Sidebar)
│   │   ├── Visualisation/      # Algorithm visualization components
│   │   └── Common/             # Shared components
│   ├── pages/                  # Page components for routing
│   │   ├── DSA/                # Data Structures & Algorithms section
│   │   ├── Development/        # Development resources
│   │   ├── Ideas/              # Ideas platform
│   │   └── Profile/            # User profile pages
│   ├── store/                  # Redux store and slices
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── lib/                    # External library configurations
│   └── styles/                 # Global styles and CSS
├── public/                     # Static assets
├── docs/                       # Documentation
└── tests/                      # Test files
```

## Key Components

### 1. Authentication System

**Location:** `src/components/Auth/`

- **Auth.jsx**: Main authentication component with tab switching between login/register
- **Login.jsx**: Login form with email/password and social login options
- **Register.jsx**: Registration form with validation
- **ForgotPassword.jsx**: Password reset functionality

**Integration:**
- Uses Firebase Authentication for user management
- Integrates with Redux for state management
- Implements form validation with Zod

### 2. Algorithm Visualization System

**Location:** `src/algorithms/` and `src/components/Visualisation/`

**Core Files:**
- **algorithmConstants.js**: Maps algorithm IDs to their implementations
- **useAlgorithm.js**: Custom hook for algorithm execution and state management
- **VisualizationPage.jsx**: Main visualization page component
- **ArrayVisualizer.jsx**: Renders array-based algorithm visualizations
- **GraphVisualizer.jsx**: Renders graph-based algorithm visualizations
- **AlgorithmController.jsx**: Playback controls for visualizations

**Algorithm Categories:**
- Sorting: Bubble Sort, Merge Sort, Quick Sort, etc.
- Searching: Linear Search, Binary Search
- Graph: BFS, DFS, Dijkstra
- Dynamic Programming: Fibonacci, Knapsack

### 3. Routing System

**Location:** `src/routes.jsx`

**Features:**
- React Router v6 with createBrowserRouter
- Protected routes for authenticated users
- Public routes for unauthenticated users
- Nested routing for DSA section
- Lazy loading for all route components
- Error boundaries and 404 handling

**Key Routes:**
- `/` - Home page
- `/about` - About page
- `/login` - Login page
- `/register` - Registration page
- `/dsa` - DSA section with nested routes
- `/dashboard` - User dashboard
- Various other sections (Development, Ideas, Profile, etc.)

### 4. Redux State Management

**Location:** `src/store/`

**Slices:**
- **userSlice.js**: User authentication state
- **algorithmSlice.js**: Algorithm visualization state
- **uiSlice.js**: UI state (theme, sidebar, etc.)
- **resourcesSlice.js**: Development resources
- **ideasSlice.js**: Ideas platform data

**Features:**
- Redux Toolkit implementation
- Async thunks for API calls
- Firebase middleware integration
- Proper error handling

### 5. DSA (Data Structures & Algorithms) Section

**Location:** `src/pages/DSA/`

**Components:**
- **DSA.jsx**: Main DSA page with sidebar layout
- **Sidebar.jsx**: Algorithm navigation sidebar
- **Visualization.jsx**: Algorithm visualization page
- **Algorithms/**: Algorithm library pages
- **Problems/**: Problem sheets and practice
- **Practice/**: Integrated IDE for practice
- **Contribute/**: Content contribution platform
- **Discussions/**: Community discussions
- **Rewards/**: Rewards and leaderboard system

## Key Implementation Details

### Algorithm Execution Flow

1. User selects an algorithm from the sidebar
2. Route changes to `/dsa/visualization/:algorithmId`
3. DSAVisualization component loads the algorithm info
4. VisualizationPage component initializes the algorithm
5. useAlgorithm hook executes the generator function
6. Steps are stored and can be navigated through
7. ArrayVisualizer/GraphVisualizer renders each step

### Authentication Flow

1. User visits login/register page
2. Auth component provides unified interface
3. Forms validate input with Zod
4. Firebase Authentication handles credentials
5. Redux store updates with user state
6. ProtectedRoute component guards authenticated routes
7. User redirected to intended destination

### State Management

- **User State**: Authentication status, loading, errors
- **Algorithm State**: Current algorithm, steps, playback status
- **UI State**: Theme, sidebar visibility, modal states
- **Resources State**: Development resources and categories
- **Ideas State**: Community ideas and discussions

## Technologies Used

- **React**: Core UI library
- **React Router v6**: Client-side routing
- **Redux Toolkit**: State management
- **Firebase**: Authentication and database
- **Framer Motion**: Animations and transitions
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Zod**: Form validation

## Development Guidelines

### Adding New Algorithms

1. Create algorithm implementation in `src/algorithms/[Category]/`
2. Add algorithm info to `src/utils/algorithmConstants.js`
3. Create specific visualizer if needed in `src/components/Visualisation/`
4. Update sidebar in `src/components/Layout/Sidebar.jsx` if appropriate

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route to `src/routes.jsx`
3. Add navigation link if appropriate
4. Implement proper authentication guards

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow existing color scheme and design patterns
- Ensure responsive design for all components
- Use Framer Motion for animations

## File Relationships

### Authentication Flow
```
routes.jsx → Auth.jsx → Login.jsx/Register.jsx → userSlice.js → Firebase
```

### Algorithm Visualization Flow
```
routes.jsx → DSA.jsx → Sidebar.jsx → DSAVisualization.jsx → 
VisualizationPage.jsx → useAlgorithm.js → algorithmConstants.js → 
algorithms/[Category]/[algorithm].js → ArrayVisualizer.jsx/GraphVisualizer.jsx
```

### State Management Flow
```
store/store.js → [slice].js → components/pages using useSelector/useDispatch
```

## Best Practices

1. **Lazy Loading**: All routes use lazy loading for performance
2. **Error Boundaries**: Components handle errors gracefully
3. **Responsive Design**: All components work on mobile and desktop
4. **Accessibility**: Proper semantic HTML and ARIA attributes
5. **Performance**: Optimized animations and minimal re-renders
6. **Security**: Proper authentication and data validation
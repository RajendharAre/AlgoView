# Algorithm Visualizer

An interactive web application for visualizing algorithms with step-by-step animations.

## Features

- 🎨 **Beautiful Algorithm Visualizations** - Sorting, searching, and graph algorithms with smooth animations
- 🎮 **Interactive Controls** - Step through algorithms at your own pace
- 🔐 **Secure Authentication** - Firebase auth with Email/Password, Google, and GitHub OAuth
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark/Light Mode** - Theme switcher for comfortable viewing
- 📊 **Comprehensive DSA Learning** - Problems, practice, discussions, and contributions
- ⚡ **Modern & Fast** - Built with React 19, Vite, and optimized for performance

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Quick Start

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd algorithm-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:ui` | Open test UI dashboard |
| `npm run test:run` | Run tests once |
| `npm run lint` | Check code for linting errors |

## Technologies Used

- **Frontend Framework:** React 19 with JSX
- **Build Tool:** Vite (⚡ Lightning-fast)
- **State Management:** Redux Toolkit
- **Authentication & Database:** Firebase (Auth, Firestore, Storage)
- **Styling:** Tailwind CSS + Framer Motion
- **Visualizations:** Cytoscape.js (graphs), Custom Canvas (arrays)
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library
- **Code Quality:** ESLint + Prettier

## Project Structure

```
src/
├── algorithms/           # Algorithm implementations (Sorting, Searching, Graph, DP)
├── components/
│   ├── Auth/            # Authentication (Login, Register, etc.)
│   ├── Common/          # Shared components (Navbar, Loader, ErrorBoundary)
│   ├── Layout/          # Layout components (Sidebar, ProtectedRoute)
│   ├── DSA/             # DSA-specific components
│   └── Visualisation/   # Algorithm visualization components
├── features/            # Feature modules (auth, algorithms, interview, profile)
├── hooks/               # Custom React hooks
├── lib/                 # Firebase configuration & utilities
├── pages/               # Page components (Home, Dashboard, DSA, etc.)
├── store/               # Redux store configuration
├── styles/              # Global styles
├── utils/               # Utility functions & constants
└── App.jsx              # Main app component
```

## Documentation

- 📖 [Components Guide](docs/components.md)
- 🎯 [Hooks Documentation](docs/hooks.md)
- 🔤 [Algorithms](docs/algorithms.md)
- 🛠️ [Utilities & Libraries](docs/utils-lib.md)
- 🔑 [Firebase OAuth Setup](FIREBASE_OAUTH_SETUP.md)

## Supported Algorithms

### Sorting
- Bubble Sort
- Insertion Sort
- Selection Sort
- Merge Sort
- Quick Sort
- Radix Sort

### Searching
- Linear Search
- Binary Search

### Graph Algorithms
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm

### Dynamic Programming
- Knapsack Problem

## Contributing

We love contributions! Here's how to get involved:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

Have questions or found a bug? Please open an issue on GitHub!

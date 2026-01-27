# AlgoView

An interactive web application for visualizing algorithms with step-by-step animations. Built with modern React and Firebase, AlgoView helps students and developers master Data Structures and Algorithms through intuitive visualizations and hands-on practice.

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-10+-blue.svg" alt="Features"></a>
  <a href="#supported-algorithms"><img src="https://img.shields.io/badge/Algorithms-20+-green.svg" alt="Algorithms"></a>
  <a href="#technologies-used"><img src="https://img.shields.io/badge/Tech-Stack-orange.svg" alt="Tech Stack"></a>
  <a href="https://github.com/RajendharAre/AlgoView"><img src="https://img.shields.io/github/license/RajendharAre/AlgoView" alt="License"></a>
</p>

## 🚀 Features

### Core Functionality
- 🎨 **Interactive Algorithm Visualizations** - Step-by-step animations for sorting, searching, graph, and dynamic programming algorithms
- 🎮 **Granular Control** - Play, pause, step forward/backward, and speed control for detailed learning
- 🔍 **Real-time Insights** - Variable tracking, complexity analysis, and performance metrics
- 📊 **Progress Tracking** - Save learning progress, bookmark algorithms, and track completion

### User Experience
- 🔐 **Secure Authentication** - Firebase Auth with Email/Password, Google, and GitHub OAuth
- 🌙 **Theme Support** - Dark/light mode with system preference detection
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Lightning Fast** - Built with React 19 and Vite for optimal performance
- 🎯 **Intuitive Interface** - Clean, modern UI with smooth transitions and animations

### Learning Platform
- 🏆 **DSA Practice System** - Integrated LeetCode problem verification and practice tracking
- 💰 **Reward System** - Points-based rewards for engagement and achievements
- 👥 **Community Features** - Discussion forums and peer learning
- 📈 **Analytics Dashboard** - Personal learning statistics and progress insights

## 🛠️ Prerequisites

- **Node.js**: v16 or higher
- **Package Manager**: npm (v8+) or yarn (v1.22+)
- **Firebase Account**: For authentication and database services
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## 🚀 Quick Start

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/RajendharAre/AlgoView.git
   cd algoview
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Optional: Gemini API for AI features
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Application Settings
   VITE_APP_NAME=AlgoView
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # Server will start at http://localhost:3000
   ```

5. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

### Alternative Setup Options

**Using Docker:**
```bash
# Build and run with Docker
docker-compose up -d
```

**Using Vercel for Deployment:**
```bash
# Deploy to Vercel
vercel --prod
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (port 3000) |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run serve` | Serve production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:ui` | Open interactive test UI dashboard |
| `npm run test:run` | Run all tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code for linting errors |
| `npm run lint:fix` | Automatically fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Clean build artifacts and cache |
| `npm run analyze` | Analyze bundle size |

### Development Workflow

```bash
# Start development
npm run dev

# Run tests during development
npm run test

# Check code quality
npm run lint && npm run format

# Prepare for production
npm run build && npm run preview
```

## 🧰 Technologies Used

### Core Stack
- **Frontend Framework:** React 19 with JSX
- **Build Tool:** Vite (⚡ Ultra-fast builds)
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Storage:** Firebase Cloud Storage

### UI & Styling
- **Styling Framework:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Component Library:** Custom-built components
- **Charts:** Recharts (for analytics)

### Algorithm Visualization
- **Graph Visualization:** Cytoscape.js
- **Array Visualization:** Custom Canvas Implementation
- **Tree Visualization:** D3.js integration
- **Animation Engine:** CSS3 + JavaScript

### Development & Testing
- **Testing Framework:** Vitest + React Testing Library
- **Code Quality:** ESLint + Prettier
- **Type Checking:** PropTypes (planned: TypeScript migration)
- **CI/CD:** GitHub Actions (planned)
- **Deployment:** Vercel/Firebase Hosting

### APIs & Services
- **LeetCode Integration:** Custom backend proxy
- **AI Assistance:** Google Gemini API (optional)
- **Analytics:** Firebase Analytics
- **Performance Monitoring:** Sentry (planned)

## 📁 Project Structure

```
algoview/
├── public/                 # Static assets and favicon
├── server/                 # Backend API server
│   ├── controllers/       # Route controllers
│   ├── routes/           # API route definitions
│   ├── middleware/       # Express middleware
│   └── server.js         # Main server entry point
├── src/
│   ├── algorithms/        # Algorithm implementations
│   │   ├── Sorting/      # Sorting algorithms (Bubble, Quick, Merge, etc.)
│   │   ├── Searching/    # Search algorithms (Binary, Linear)
│   │   ├── Graph/        # Graph algorithms (BFS, DFS, Dijkstra, etc.)
│   │   ├── DP/           # Dynamic Programming algorithms
│   │   └── index.js      # Algorithm registry
│   ├── components/
│   │   ├── Auth/         # Authentication components (Login, Register)
│   │   ├── Common/       # Shared components (Navbar, Footer, Loader)
│   │   ├── Layout/       # Layout components (Sidebar, ProtectedRoute)
│   │   ├── DSA/          # DSA-specific components
│   │   └── Visualization/# Algorithm visualization components
│   ├── features/         # Feature-based modules
│   │   ├── auth/         # Authentication feature
│   │   ├── algorithms/   # Algorithm visualization feature
│   │   ├── dsa/          # DSA practice feature
│   │   └── profile/      # User profile feature
│   ├── hooks/            # Custom React hooks
│   │   ├── useAlgorithm.js
│   │   ├── useAuth.js
│   │   └── useVisualization.js
│   ├── lib/              # External library configurations
│   │   ├── firebase.js   # Firebase initialization
│   │   └── firebase-mock.js # Mock Firebase for testing
│   ├── pages/            # Page components
│   │   ├── Home.jsx      # Landing page
│   │   ├── DSA.jsx       # DSA dashboard
│   │   ├── Practice.jsx  # Practice interface
│   │   ├── About.jsx     # About page
│   │   └── ...           # Other pages
│   ├── store/            # Redux store
│   │   ├── slices/       # Redux slices
│   │   └── index.js      # Store configuration
│   ├── styles/           # Global styles and Tailwind config
│   ├── utils/            # Utility functions and constants
│   │   ├── algorithmUtils.js
│   │   └── helpers.js
│   ├── constants/        # Application constants
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── tests/                # Test files
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests
├── docs/                 # Documentation
├── .github/              # GitHub workflows
├── .vscode/              # VS Code settings
├── .env.example          # Environment variables template
├── firebase.json         # Firebase configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── package.json          # Project dependencies and scripts
```

## 📚 Documentation

### Developer Guides
- 📖 [Components Guide](docs/components.md) - Component architecture and usage
- 🎯 [Hooks Documentation](docs/hooks.md) - Custom hooks API reference
- 🔤 [Algorithms Documentation](docs/algorithms.md) - Algorithm implementations
- 🛠️ [Utilities & Libraries](docs/utils-lib.md) - Helper functions and utilities
- 🔑 [Firebase OAuth Setup](FIREBASE_OAUTH_SETUP.md) - Authentication configuration

### User Guides
- 🎓 [Getting Started Guide](docs/getting-started.md) - User onboarding
- 🎮 [Algorithm Visualization Tutorial](docs/visualization-tutorial.md) - How to use visualizations
- 🏆 [DSA Practice Guide](docs/dsa-practice.md) - Practice system walkthrough
- ⚙️ [Settings & Preferences](docs/settings.md) - User configuration

### API Documentation
- 🌐 [Backend API Reference](docs/api-reference.md) - REST API documentation
- 🔌 [LeetCode Integration](docs/leetcode-integration.md) - Problem verification system
- 📊 [Analytics API](docs/analytics-api.md) - Progress tracking endpoints

## 🧠 Supported Algorithms

### 🔢 Sorting Algorithms
- **Bubble Sort** - Simple comparison-based sorting
- **Insertion Sort** - Efficient for small datasets
- **Selection Sort** - In-place comparison sort
- **Merge Sort** - Divide-and-conquer approach
- **Quick Sort** - Efficient partition-based sorting
- **Heap Sort** - Binary heap-based sorting
- **Radix Sort** - Non-comparison integer sorting
- **Bucket Sort** - Distribution-based sorting

### 🔍 Searching Algorithms
- **Linear Search** - Sequential search through array
- **Binary Search** - Efficient sorted array search

### 🌐 Graph Algorithms
- **Breadth-First Search (BFS)** - Level-order traversal
- **Depth-First Search (DFS)** - Depth-wise traversal
- **Dijkstra's Algorithm** - Shortest path in weighted graphs
- **Bellman-Ford Algorithm** - Shortest path with negative weights
- **Floyd-Warshall Algorithm** - All-pairs shortest path

### 🧮 Dynamic Programming
- **0/1 Knapsack Problem** - Classic optimization problem
- **Longest Common Subsequence** - String similarity
- **Coin Change Problem** - Minimum coins required

### 📊 Data Structures
- **Binary Search Tree** - Sorted tree structure
- **AVL Tree** - Self-balancing binary search tree
- **Heap** - Priority queue implementation

*More algorithms being actively developed!*

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve AlgoView:

### Getting Started
1. **Fork the Repository** - Click the fork button at the top right
2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AlgoView.git
   cd algoview
   ```
3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-amazing-feature
   ```

### Development Guidelines

#### Code Standards
- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Include tests for new features
- Update documentation when necessary
- Ensure all tests pass before submitting PR

#### Pull Request Process
1. **Update Documentation** - Update README.md and relevant docs
2. **Run Tests** - `npm run test` and ensure all pass
3. **Check Linting** - `npm run lint` and fix any issues
4. **Squash Commits** - Keep commit history clean
5. **Submit PR** - Provide detailed description of changes

### Areas Needing Contribution
- ✨ New algorithm visualizations
- 🐛 Bug fixes and performance improvements
- 📖 Documentation enhancements
- 🎨 UI/UX improvements
- 🧪 Additional test coverage
- 🌍 Internationalization support

### Community Guidelines
- Be respectful and constructive
- Help others in issues and discussions
- Follow the code of conduct
- Share knowledge and mentor newcomers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Rajendhar Are

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🚀 Future Enhancements

### Planned Features (v2.0 Roadmap)

#### Advanced Algorithms
- 🔥 **Advanced Graph Algorithms**
  - Minimum Spanning Tree (Prim's, Kruskal's)
  - Topological Sorting
  - Strongly Connected Components
  - Network Flow Algorithms

- 🧠 **Machine Learning Visualizations**
  - Neural Network architectures
  - Decision Trees and Random Forests
  - Clustering algorithms (K-means, DBSCAN)
  - Gradient Descent visualization

- 📊 **Advanced Data Structures**
  - Red-Black Trees
  - B-Trees and B+ Trees
  - Trie and Suffix Trees
  - Segment Trees and Fenwick Trees

#### Enhanced Learning Experience
- 🎓 **Adaptive Learning Path**
  - Personalized curriculum based on skill level
  - Intelligent difficulty adjustment
  - Spaced repetition system
  - Mastery-based progression

- 🤖 **AI-Powered Assistance**
  - Intelligent code hint system
  - Natural language algorithm explanation
  - Automated complexity analysis
  - Personalized learning recommendations

- 🎮 **Gamification Improvements**
  - Leaderboards and rankings
  - Achievement badges and milestones
  - Competitive coding challenges
  - Peer collaboration features

#### Technical Improvements
- ⚡ **Performance Optimization**
  - WebAssembly integration for heavy computations
  - Progressive Web App (PWA) support
  - Offline mode capabilities
  - Improved rendering performance

- 🌐 **Platform Expansion**
  - Mobile app development (React Native)
  - Desktop application (Electron)
  - VS Code extension
  - Browser extension

- 🔧 **Developer Experience**
  - TypeScript migration
  - Comprehensive API documentation
  - Plugin architecture for custom algorithms
  - Export/import functionality for custom visualizations

### Long-term Vision
- 🌍 **Global Accessibility**
  - Multi-language support (10+ languages)
  - Cultural adaptation for different regions
  - Accessibility features for disabled users
  - Low-bandwidth optimized versions

- 🤝 **Community Platform**
  - User-generated algorithm visualizations
  - Collaborative learning spaces
  - Mentorship programs
  - Open-source algorithm library

- 🏢 **Enterprise Solutions**
  - LMS integration for educational institutions
  - Corporate training platforms
  - Interview preparation suites
  - Certification programs

## 🆘 Support & Community

### Getting Help
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/RajendharAre/AlgoView/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/RajendharAre/AlgoView/discussions)
- 📧 **Email Support**: arerajendhar33@gmail.com
- 📱 **Social Media**: [@AlgoViewPlatform](https://twitter.com/AlgoViewPlatform)

### Community Resources
- 📚 **Wiki**: Comprehensive documentation and tutorials
- 🎥 **Video Tutorials**: YouTube channel with walkthroughs
- 📖 **Blog**: Technical articles and release announcements
- 🗣️ **Slack/Discord**: Real-time community chat

### Contributing to Support
- Answer questions in discussions
- Create tutorial content
- Report documentation issues
- Translate content to other languages

---

<p align="center">
  Made with ❤️ by the AlgoView Community
</p>

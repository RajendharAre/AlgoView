# AlgoView - Complete Project Documentation

**Project Name:** AlgoView  
**Domain:** https://algovieww.me  
**Type:** Full-Stack Web Application for Algorithm Visualization & DSA Learning  
**Version:** 1.0.0  
**Last Updated:** April 12, 2026  
**Status:** ✅ Production Ready with Active Development  
**Developer:** Rajendhar Are | Full Stack Developer | Problem Solver  
**Portfolio:** https://rajendharare.tech  
**GitHub:** https://github.com/RajendharAre  
**LinkedIn:** https://www.linkedin.com/in/rajendhar-are/

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database & Firebase](#database--firebase)
7. [Configuration Files](#configuration-files)
8. [Key Features](#key-features)
9. [Scripts & Utilities](#scripts--utilities)
10. [Development Workflow](#development-workflow)

---

## Project Overview

**AlgoView** is an interactive web application designed to help students and developers learn Data Structures and Algorithms (DSA) through:

- **Interactive Algorithm Visualizations** - Step-by-step animations for various algorithms
- **Real-time Learning** - Pause, play, and step through algorithm execution
- **DSA Practice System** - Integrated LeetCode problem verification
- **Community Features** - Discussion forums and peer learning
- **Admin Panel** - Content moderation and management system
- **Analytics Dashboard** - Learning progress tracking
- **Secure Authentication** - Firebase Auth with multiple OAuth providers

### Core Objectives

✅ Visualize complex algorithms in an intuitive, interactive way  
✅ Provide hands-on DSA practice with real problems  
✅ Build a collaborative learning community  
✅ Track user progress and learning analytics  
✅ Maintain professional content through admin moderation  
✅ Optimize for SEO and organic reach  
✅ Track user engagement through analytics  
✅ Enable community notifications and updates  

---

## Technology Stack

### Frontend
- **React 19.1.1** - UI framework with latest hooks and features
- **React Router 7.9.4** - Client-side routing and navigation
- **Redux Toolkit 2.8.2** - State management
- **Vite 7.1.2** - Modern bundler and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Smooth animations and transitions
- **React Icons 5.5.0** - Icon library for UI components
- **React Markdown 10.1.0** - Markdown rendering
- **React Syntax Highlighter 16.1.0** - Code highlighting
- **Cytoscape 3.33.1** - Graph visualization library
- **DOMPurify 3.3.1** - HTML sanitization

### Backend
- **Firebase Cloud Functions** - Serverless backend logic
- **Nodemailer/SendGrid** - Email notification system
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **Firebase Admin SDK 13.6.1** - Server-side Firebase operations
- **CORS** - Cross-origin resource sharing

### Database & Services
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Authentication** - User authentication & OAuth
- **Firebase Storage** - File storage
- **Firebase Cloud Functions** - Serverless backend
- **Firebase Hosting** - Web hosting

### Development & Build Tools
- **npm** - Package manager
- **ESLint 9.33.0** - Code linting
- **Prettier 3.6.2** - Code formatting
- **Vitest 4.0.2** - Unit testing framework
- **jsdom 27.0.1** - DOM implementation for testing
- **PostCSS 8.5.6** - CSS transformations

### Analytics & SEO
- **React GA4 3.0.1** - Google Analytics 4 integration
- **Schema Markup** - Structured data for SEO

---

## Project Structure

### Root Level Files

```
├── package.json                 # Project dependencies and scripts
├── vite.config.js              # Vite build configuration
├── vitest.config.js            # Vitest testing configuration
├── eslint.config.js            # ESLint rules configuration
├── tailwind.config.js          # Tailwind CSS theme configuration
├── postcss.config.js           # PostCSS plugins configuration
├── tsconfig.json               # TypeScript configuration (if needed)
├── firebase.json               # Firebase project configuration
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore index definitions
├── storage.rules               # Firebase Storage security rules
├── index.html                  # HTML entry point
├── jsconfig.json               # JavaScript configuration
├── README.md                   # Project readme
├── ADMIN_SETUP_GUIDE.md        # Admin panel setup documentation
├── FIRESTORE_SETUP.md          # Firestore collections setup guide
└── project_info.md             # This file
```

### Public Directory (`/public`)

```
public/
├── index.html                  # Main HTML file
├── robots.txt                  # SEO robots configuration
├── sitemap.xml                 # XML sitemap for search engines (UPDATED: uses algovieww.me)
├── google0fa1f9354b97dee2.html # Google verification file
└── images/
    ├── code-examples/          # Code example images
    └── tutorials/              # Tutorial images
```

### Source Directory (`/src`)

#### Main Entry Files

```
src/
├── main.jsx                    # Application entry point
├── App.jsx                     # Root React component
├── routes.jsx                  # All routes configuration
├── App.css                     # Global app styles
├── index.css                   # Global CSS resets
└── setupProxy.js               # Proxy configuration for API calls
```

#### Directories Overview

### `/src/pages` - Page Components (24+ pages)

Application pages representing different features:

**Public Pages:**
- **Home.jsx** - Landing page with features overview
- **About.jsx** - About AlgoView with three tabs: Overview (platform story & values), Mission (vision & objectives), Team (Meet Rajendhar - sole developer with portfolio & social links)
- **Features.jsx** - Features showcase
- **Contact.jsx** - Contact page
- **Support.jsx** - Help and support
- **Documentation.jsx** - User guide
- **Legal.jsx** - Legal information hub
- **References.jsx** - External references and resources

**Policy Pages:**
- **PrivacyPolicy.jsx** - Privacy policy
- **TermsOfService.jsx** - Terms of service
- **CookiePolicy.jsx** - Cookie policy

**Authentication & User:**
- **Dashboard.jsx** - User dashboard
- **Payment.jsx** - Payment processing
- **Profile.jsx** - User profile management
- **Settings.jsx** - User settings
- **Unauthorized.jsx** - Unauthorized access page
- **NotFound.jsx** - 404 error page (includes Travelling Salesperson)
  - Problems/ - LeetCode problem integration
  - Practice/ - Practice problem interface with verification popup system
  - Discussions/ - Community discussions
  - Visualization/ - Algorithm visualization viewer with Cytoscape
  - Rewards/ - Achievement system
  - Contribute/ - Community contribution
  - Notifications/ - User notifications for updates and announcementstion
  - Practice/ - Practice problem interface
  - Discussions/ - Community discussions
  - Visualization/ - Algorithm visualization viewer
  - Rewards/ - Achievement system
  - Contribute/ - Community contribution

**Development Resources:**
- **Development.jsx** - Development hub
- **Development/** subdirectory:
  - Tutorials/ - Tutorial listings and reading
  - CodeExamples/ - Code snippets and examples
  - Videos/ - Video courses
  - Documentation/ - Technical documentation
  - Community/ - Community resources
  - QA/ - Q&A section

**Specialized:**
- **Ideas.jsx** - Innovation ideas platform
- **Ideas/** subdirectory:
  - Detail.jsx - Idea detail view
  - New.jsx - Create new idea
- **AI/** - AI-powered features
- **Analytics/** - Analytics dashboard
- **Blog/** - Blog platform
- **Admin/** - Admin panel
  - AdminLogin.jsx - Admin login page
  - AdminDashboard.jsx - Admin dashboard

### `/src/components` - Reusable Components

```
src/components/
├── MainApp.jsx                 # Main layout wrapper (navbar, footer, content)
├── InteractiveFeatureCard.jsx  # Feature card component
├── Testimonial3DCard.jsx       # 3D testimonial display
│
├── Common/                     # Shared components
│   ├── Navbar.jsx              # Navigation bar
│   ├── Footer.jsx              # Footer component
│   ├── Loader.jsx              # Loading spinner
│   ├── ErrorBoundary.jsx       # Error boundary wrapper
│   ├── ProtectedRoute.jsx      # Protected route wrapper
│   ├── SchemaMarkup.jsx        # SEO schema markup
│   ├── ThemeToggle.jsx         # Dark/light mode toggle
│   ├── UserProfile.jsx         # User profile popover
│   └── StyledDropdown.jsx      # Custom dropdown component
│
├── Auth/                       # Authentication components
│   ├── Auth.jsx                # Main auth component
│   ├── Login.jsx               # Login form
│   ├── Register.jsx            # Registration form
│   ├── ForgotPassword.jsx      # Password reset form
│   ├── VerificationScreen.jsx  # Email verification
│   ├── Auth.test.jsx           # Auth component tests
│   ├── Login.test.jsx          # Login tests
│   ├── Register.test.jsx       # Register tests
│   └── ForgotPassword.test.jsx # Password reset tests
│
├── Analytics/                  # Analytics components
│   └── PageTracker.jsx         # Google Analytics tracking
│
├── Layout/                     # Layout components
│   └── ProtectedRoute.jsx      # Route protection
│
├── DSA/                        # DSA-specific components
│   ├── AlgorithmCard.jsx       # Algorithm display card
│   ├── ProblemCard.jsx         # Problem display
│   └── ... (other DSA components)
│
└── Visualisation/              # Visualization components
    ├── Canvas/                 # Rendering components
    ├── Controls/               # Visualization controls
    └── ... (other viz components)
```

### `/src/pages/Admin` - Admin Panel Components

```
src/pages/Admin/
├── AdminLogin.jsx              # Admin authentication page
├── AdminDashboard.jsx          # Main admin dashboard
└── sections/
    ├── ContentModeration.jsx   # Moderate blogs & experiences
    ├── NotificationsManagement.jsx - Publish notifications
    ├── CMSManagement.jsx       # Manage tutorials, code, videos, FAQs
    └── PolicyManagement.jsx    # Edit privacy, terms, cookies
```

**Admin Features:**
- Real-time Firebase Firestore integration
- Content moderation for user submissions
- Notification publishing system
- CMS for tutorials, code examples, videos, FAQs
- Policy/document management
- Responsive design (mobile, tablet, desktop)
- Password reset functionality
- Role-based access (admin-only: arerajendhar33@gmail.com)

### `/src/algorithms` - Algorithm Implementations

```
src/algorithms/
├── Sorting/                    # Sorting algorithms
│   ├── BubbleSort.js
│   ├── QuickSort.js
│   ├── MergeSort.js
│   ├── SelectionSort.js
│   ├── InsertionSort.js
│   └── ... (more sorting)
│
├── Searching/                  # Searching algorithms
│   ├── LinearSearch.js
│   ├── BinarySearch.js
│   └── ... (more searching)
│
├── Graph/                      # Graph algorithms
│   ├── BFS.js
│   ├── DFS.js
│   ├── Dijkstra.js
│   └── ... (more graph)
│
└── DP/                         # Dynamic Programming
    ├── Fibonacci.js
    ├── LongestCommonSubsequence.js
    └── ... (more DP)
```

Each algorithm includes:
- Step-by-step execution logic
- Animation state management
- Complexity information
- Test cases

### `/src/store` - Redux State Management

```
src/store/
├── store.js                    # Redux store configuration
└── slices/
    ├── userSlice.js            # User state (auth, profile)
    ├── uiSlice.js              # UI state (theme, modals)
    ├── ideasSlice.js           # Ideas state
    └── resourcesSlice.js       # Resources state (tutorials, videos)
```

**Redux Store Structure:**
```
Store = {
  user: { currentUser, loading, error, profile, favorites },
  ui: { isDarkMode, sidebarOpen, notifications },
  ideas: { ideas, selectedIdea, loading },
  resources: { tutorials, videos, codeExamples, loading }
}
```

### `/src/hooks` - Custom React Hooks

- **useAuth.js** - User authentication state and methods
- **useAlgorithm.js** - Algorithm visualization logic
- **useContentFilter.js** - Content filtering utilities
- **useDebounce.js** - Debounce hook for search/input
- **usePageMeta.js** - Page meta management for SEO
- **useProfile.js** - User profile management

### `/src/lib` - Utility Libraries

- **firebase.js** - Firebase initialization and exports (auth, db, app)
- **firebase-utils.js** - Firebase helper functions
- **firebase-mock.js** - Firebase mock for testing
- **analytics.js** - Google Analytics 4 integration (trackPageView, trackEvent)
- **animations.js** - Reusable animation configurations
- **cytoscape.js** - Cytoscape graph library setup
- **cytoscape-config.js** - Cytoscape configuration

### `/src/services` - API & External Services

- **leetcodeService.js** - LeetCode API integration
- **blogsService.js** - Blog operations (CRUD)
- **experienceService.js** - User experience submissions
- **ideasService.js** - Innovation ideas management
- **developmentService.js** - Development resources
- **supportService.js** - Support/help management

### `/src/context` - React Context API

- **ThemeContext.jsx** - Theme switching context (dark/light mode)

### `/src/constants` - App Constants

- **sitePalette.js** - Color palette and shadows for UI
- **visualizationConstants.js** - Visualization-related constants

### `/src/utils` - Utility Functions

- **algorithmConstants.js** - Algorithm-related constants
- **algorithmUtils.js** - Algorithm helper functions
- **communityConfig.js** - Community features configuration
- **documentationConfig.js** - Documentation structure
- **sampleData.js** - Sample/mock data for development
- **sampleQAData.js** - Q&A sample data
- **themeUtils.js** - Theme utility functions
- **validation.js** - Form and data validation
- **validation.test.js** - Validation tests
- **verificationUtils.js** - Email verification helpers
- **videosConfig.js** - Video configuration

### `/src/data` - Data Files

- **blogsData.js** - Blog content and metadata

### `/src/styles` - Global Styles

- **globals.css** - Global CSS variables and styles
- **dropdown.css** - Dropdown/select styles

### `/server` - Backend Server

```
server/
├── server.js                   # Express server entry point
├── package.json                # Backend dependencies
│
├── routes/
│   ├── leetcodeRoutes.js       # LeetCode API endpoints
│   └── supportRoutes.js        # Support/email endpoints
│
├── controllers/
│   ├── leetcodeController.js   # LeetCode API logic
│   └── supportController.js    # Support ticket handling
│
└── README.md                   # Server documentation
```

**Server Features:**
- Express.js REST API
- LeetCode problem verification
- Support ticket management
- Email notifications
- CORS enabled
- Error handling middleware

### `/functions` - Firebase Cloud Functions

```
functions/
├── index.js                    # Cloud functions entry
└── package.json                # Functions dependencies
```

**Available Functions:**
- sendVerificationEmail - Email verification
- sendEmail - Generic email sending
- sendWelcomeEmail - Welcome email
- sendContactEmail - Contact form emails
- sendPasswordResetCode - Password reset

### `/scripts` - Utility Scripts

- **setup-firebase-images.js** - Upload images to Firebase Storage
- **upload-and-generate-urls.js/.mjs** - Generate signed URLs for images
- **map-firebase-urls.js** - Map image URLs
- **apply-image-mapping.js** - Apply URL mappings
- **populate-sample-blogs.js** - Seed sample blog data
- **update-sample-data.js** - Update sample data
- **check-blogs.js** - Validate blog data
- **deduplicate-blogs.js/.mjs** - Remove duplicate blogs
- **deduplicate-firebase.mjs** - Remove duplicates from Firebase
- **fix-populate-blogs.mjs** - Fix blog population issues
- **test-blog.js** - Test blog functionality

### `/tests` - Testing Suite

```
tests/
├── run-tests.js                # Test runner
├── setup.js                    # Test setup
├── test-utils.jsx              # Test utilities
├── TESTING_GUIDELINES.md       # Testing standards
├── TEST_SUMMARY.md             # Test summary report
│
├── unit/                       # Unit tests
├── integration/                # Integration tests
├── e2e/                        # End-to-end tests
├── ui/                         # UI tests
├── selenium/                   # Selenium tests
└── practice-page-tests.js      # Practice page tests
```

---

## Frontend Architecture

### State Management

**Redux Store** handles:
- User authentication and profile
- UI state (theme, sidebar, modals)
- Ideas and resources caching
- Loading and error states

### Routing Structure

**Route Hierarchy:**
```
/                                  # MainApp (wrapper)
├── / (home)
├── /about
├── /features
├── /contact
├── /dsa                          # DSA learning hub
│   ├── /dsa/algorithms
│   ├── /dsa/problems
│   ├── /dsa/practice
│   ├── /dsa/discussions
│   └── /dsa/visualization
├── /blog
├── /development                  # Dev resources
├── /ideas                        # Community ideas
├── /dashboard                    # User dashboard (protected)
├── /profile                      # User profile (protected)
├── /settings                     # User settings (protected)
├── /admin/login                  # Admin login
└── /admin/dashboard              # Admin panel (protected)
```

### Component Hierarchy

**MainApp** (root wrapper)
- Navbar
- Outlet (page content)
  - Various page components
  - Sub-components
- Footer
- PageTracker (analytics)
- SchemaMarkup (SEO)

### Styling Approach

- **Tailwind CSS** - Utility-first CSS framework
- **Custom Colors** - tekhelet (purple), medium-slate-blue, selective-yellow
- **Dark Mode** - Class-based dark mode with system preference detection
- **Responsive Design** - Mobile-first approach with breakpoints

### Performance Optimization

- **Code Splitting** - Lazy loading pages with React.lazy()
- **Image Optimization** - Firebase Storage with CDN
- **Caching** - Redux cache for resources
- **Debouncing** - useDebounce hook for search input
- **Memoization** - React.memo for expensive components

---

## Backend Architecture

### Server Structure

**Express.js Server** (`server/server.js`)
- Runs on port 5000
- Routes:
  - `/api/leetcode` - LeetCode problem verification
  - `/api/support` - Support ticket management
  - Health check endpoint: `/`

### API Routes

**LeetCode Routes** (`/api/leetcode`)
- Verify problem solution
- Get problem details
- Track problem completion

**Support Routes** (`/api/support`)
- Submit support tickets
- Send emails
- Track support requests

### Cloud Functions

Firebase Cloud Functions handle:
- Email sending via Nodemailer/SendGrid
- Background tasks
- Scheduled jobs
- Real-time notifications

---

## Database & Firebase

### Firestore Collections

**User Related:**
- `users/` - User profiles and preferences
  - Fields: name, email, avatar, joinDate, stats
  - Sub-collections: achievements, bookmarks

**Content Related:**
- `blogs/` - Blog articles (status: pending, published, rejected)
- `experiences/` - User experiences (status: pending, approved, rejected)
- `tutorials/` - Learning tutorials
- `codeExamples/` - Code snippets
- `videos/` - Video courses
- `faqs/` - Frequently asked questions

**Moderation & Admin:**
- `notifications/` - App notifications
- `policies/` - Platform policies
- `supportTickets/` - Support requests

**Community:**
- `ideas/` - Community innovation ideas
- `discussions/` - Forum discussions
- `comments/` - Comment threads

**Analytics:**
- `userProgress/` - Learning progress tracking
- `activityLogs/` - User activity logs

### Firestore Security Rules

**Admin Access:**
- Only admin email (arerajendhar33@gmail.com) can modify content

**Public Read:**
- Published content visible to all users
- Policies visible to all

**User-Specific:**
- Users can only modify their own profiles

### Authentication

**Methods:**
- Email/Password
- Google OAuth
- GitHub OAuth

**User State Persistence:**
- Uses Firebase Auth session
- Stored in Redux store
- LocalStorage for user preferences

---

## Configuration Files

### `/vite.config.js`

```javascript
- Plugin: React with SWC (faster builds)
- Dev server port: 3000
- API proxies:
  - /api/leetcode → http://localhost:5000
  - /api/support → http://localhost:5000
  - /cf → Firebase Cloud Functions
```

### `/vitest.config.js`

Unit testing configuration with jsdom environment

### `/tailwind.config.js`

- Custom color palette (tekhelet, medium-slate-blue, selective-yellow)
- Dark mode enabled
- Extended theme configurations

### `/eslint.config.js`

- React hooks validation
- React refresh support
- Prettier integration
- Custom rules: unused vars, prettier formatting

### `/firebase.json`

```
- Firestore database: asia-south1
- Hosting site: algorithm-visualizer-b963c
- Cloud Functions mapping
- Security rules references
```

### `/.env` Variables

Required environment variables:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_GA4_MEASUREMENT_ID
```

---

## Key Features

### 1. Algorithm Visualization

- **Sorting Algorithms:** Bubble, Quick, Merge, Selection, Insertion
- **Searching Algorithms:** Linear, Binary
- **Graph Algorithms:** BFS, DFS, Dijkstra
- **Dynamic Programming:** Fibonacci, LCS, etc.

Features:
- Step-by-step execution with pause/play
- Speed control
- Variable tracking
- Complexity analysis

### 2. DSA Practice System

- LeetCode problem integration
- Problem solving tracker
- Difficulty levels (Easy, Medium, Hard)
- Solution verification

### 3. Content Management

**For Users:**
- Blog articles with community contributions
- Tutorial library
- Code examples and snippets
- Video courses

**For Admin:**
- Content moderation dashboard
- Approve/reject submissions
- Real-time notifications
- Policy management

### 4. Community Features

- Discussion forums
- Peer-to-peer learning
- Innovation ideas platform
- Q&A sections

### 5. Authentication & Profiles

- Secure user registration
- Email verification
- OAuth integration (Google, GitHub)
- User profiles with progress tracking

### 6. Analytics & Progress

- Learning progress dashboard
- Achievement badges
- Time tracking
- Problem completion stats

### 7. Admin Panel

**New Feature: Comprehensive Admin Dashboard**

Sections:
- **Content Moderation:** Review/approve blogs and experiences
- **Notifications:** Publish announcements, maintenance updates, promotions
- **CMS:** Manage tutorials, code examples, videos, FAQs
- **Policies:** Edit privacy policy, terms of service, cookie policy

Features:
- Real-time Firebase synchronization
- Responsive design (mobile to desktop)
- Secure login with password reset
- Graceful error handling with setup guidance
- Role-based access control

---

## Scripts & Utilities

### npm Scripts

```json
{
  "dev": "vite",                    # Start dev server
  "build": "vite build",            # Production build
  "lint": "eslint .",               # Run ESLint
  "preview": "vite preview",        # Preview production build
  "test": "vitest",                 # Run tests in watch mode
  "test:ui": "vitest --ui",         # Test UI dashboard
  "test:run": "vitest run",         # Run tests once
  "upload-images": "node scripts/setup-firebase-images.js",
  "map-urls": "node scripts/map-firebase-urls.js",
  "apply-mapping": "node scripts/apply-image-mapping.js"
}
```

### Utility Functions

**Firebase Utils:**
- Authentication helpers
- Firestore queries
- Storage operations

**Algorithm Utils:**
- Sorting helpers
- Array operations
- Complexity calculations

**Validation Utils:**
- Email validation
- Form validation
- Data type validation

---

## Development Workflow

### Setup Process

1. Clone repository
2. Install dependencies: `npm install`
3. Configure `.env` with Firebase credentials
4. Start dev server: `npm run dev`
5. Access at `http://localhost:3000`

### Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Testing
npm run test            # Run tests in watch mode
npm run test:ui         # Interactive test UI
npm run test:run        # Run tests once

# Code Quality
npm run lint            # Check code style
npm run lint:fix        # Auto-fix linting issues

# Building
npm run build           # Production build
npm run preview         # Preview build locally

# Utilities
npm run upload-images    # Upload images to Firebase
npm run map-urls        # Generate image URLs
npm run apply-mapping   # Apply URL mappings
```

### Git Workflow

- Feature branches from `main`
- Pull requests for code review
- Automated tests on PR
- Merge to `main` for deployment

### Deployment

**Hosting:** Firebase Hosting on `algovieww.me`

**Build Process:**
1. npm run build → Creates `/dist` folder
2. Firebase Deploy → Uploads to hosting
3. CDN Caching → Automatic content delivery

**Cloud Functions:** Auto-deployed from `/functions` directory

### Environment Configuration

**.env.local** (development):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GA4_MEASUREMENT_ID=G-...
```

### Error Handling

- Error Boundary component catches React errors
- Firebase error handling in async operations
- Validation on all user inputs
- Graceful fallbacks in UI

- ✅ Schema markup for structured data with proper JSON-LD
- ✅ Meta tags on every page (title, description, keywords)
- ✅ Sitemap.xml (updated and verified with algovieww.me domain)
- ✅ robots.txt for crawler guidance
- ✅ OpenGraph tags for social media sharing
- ✅ Structured data for algorithms, tutorials, and educational content
- ✅ Dynamic meta tags for algorithm detail pages

### 2. Analytics Dashboard

- ✅ Google Analytics 4 integration (trackPageView, trackEvent)
- ✅ Page view tracking for all routes
- ✅ Custom event tracking for user interactions
- ✅ UseNotification System

- ✅ Real-time in-app notifications
- ✅ User notification preferences
- ✅ Admin notification publishing
- ✅ Email notification support (via Cloud Functions)
- ✅ Notification history tracking
- ✅ Announcement and maintenance updates

### 4. Theme System

- Light/Dark mode toggle
- System preference detection
- Theme persistence in localStorage
- Smooth transitions
- Consistent color palette across platform

### 5. Responsive Design

- Mobile-first approach
- Tablet optimizations (iPad, Android tablets)
- Desktop layouts with curved designs
- Touchscreen support for all interactions
- Tested on multiple device sizes

### 6. Performance & Security
8+  
**Total Components:** 55+  
**Algorithm Implementations:** 16+ (including Travelling Salesperson Problem)  
**Collections:** 10+  
**Cloud Functions:** 7+  
**Firebase Storage Buckets:** 2 (public images, user uploads)

**Code Organization:**
- Modular component structure
- Feature-based organization
- Separation of concerns
- Reusable utilities and hooks
- Well-documented code with comments
- Consistent naming convention
### 5. Performance

- Code splitting with React.lazy()
- Image optimization via Firebase CDN
- Compression and minification
- Lazy loading components
- Debounced search and input

---

## Project Statistics

**Total Pages:** 24+  
**Total Components:** 50+  
**Algorithm Implementations:** 15+  
**Collections:** 8+  
**Cloud Functions:** 5+

**Code Organization:**
- Modular component structure
- Feature-based organization
- Separation of concerns
- Reusable utilities and hooks

---

## Dependencies Summary

### Core Dependencies (23)
- React ecosystem (react, react-dom, react-router, react-redux)
- Firebase (firebase, firebase-admin)
- UI/Animations (framer-motion, cytoscape, react-icons)
- Code utilities (highlight.js, react-markdown, react-syntax-highlighter)
- State management (@reduxjs/toolkit)
- Other utilities (dompurify, crypto-js, zod, dotenv)

### Dev Dependencies (17)
- Build tools (vite, @vitejs plugins)
- Testing (@testing-library, vitest, jsdom)
- Styling (tailwindcss, postcss, autoprefixer)
- Linting (eslint, prettier)
- TypeScript support (@types/react, @types/react-dom)
 (April 3, 2026)**

### Latest Improvements
- ✅ Travelling Salesperson Algorithm implementation
- ✅ Real-time notifications system for users
- ✅ Enhanced SEO with schema markup optimization
- ✅ Google Analytics 4 implementation
- ✅ Dynamic blog content with real testimonials
- ✅ Advanced verification popup system (Practice page)
- ✅ Email-based contact form with NodeMailer
- ✅ Terms of Service and privacy policy pages
- ✅ gitignore and build configuration updates
- ✅ Image mapping for Firebase storage URLs
- ✅ Firestore deduplication scripts
- ✅ Dynamic experiences section with carousel

### v0.9.0 - Recent Releases
- Algorithm visualization enhancements
- DSA practice interface improvements
- Community features expansion
- Admin panel deployment
- Initial Firebase setup
- User authentication system

---

## 🔴 RECENT SEO ISSUE & RESOLUTION (April 12, 2026)

### Issue Identified:
**22 algorithm pages not indexed by Google Search Console**

- Last crawled: 1970-01-01 (Never crawled)
- Status: "Discovered - currently not indexed"
- Pages affected: Sorting, searching, graph, DP algorithms + main pages

### Root Cause:
**Incomplete XML sitemap** - Algorithm detail pages were missing from sitemap.xml

### Solution Implemented:
✅ Updated `public/sitemap.xml` with 22 missing URLs  
✅ Created 5 comprehensive SEO documentation files  
✅ Defined action items for GSC submission  
✅ Provided monitoring checklist

### Next Steps:
1. Submit updated sitemap to Google Search Console
2. Request indexing for top 5 algorithm pages
3. Monitor GSC Coverage Report weekly
4. Expected indexation within 2 weeks
5. Expected organic traffic increase: 30-50%

### Reference Files:
- [SEO_INDEXING_FIX_GUIDE.md](SEO_INDEXING_FIX_GUIDE.md) - Technical details
- [SEO_ACTION_CHECKLIST.md](SEO_ACTION_CHECKLIST.md) - Action items
- [SEO_ISSUE_SUMMARY.md](SEO_ISSUE_SUMMARY.md) - Problem overview
- [SEO_URLS_QUICK_REFERENCE.md](SEO_URLS_QUICK_REFERENCE.md) - URLs list
- [SEO_IMPLEMENTATION_COMPLETE.md](SEO_IMPLEMENTATION_COMPLETE.md) - Full summary

---

### Latest Git History
```
90668c0 - Gitignore update
eebc4ee - Update files
7060130 - Notifications view add
02df89b - Added Travelling Salesperson Algorithm
5c499b0 - Updated the blogs
0746374 - Updated scripts
7eb4346 - Added the blog pages dynamic nature
cb56bfb - Deleted (cleanup)
cd3f321 - Added dynamic nature for the experiences
e841178 - Update on dynamic feedback
cb0f044 - Links update at home
ce97158 - Added Real testimonials
9ec2d30 - Improved the codes to add SEO keys
22ebc99 - SEO optimisation pages
cf047e8 - Analytics folder added for the web analytics
ab6a632 - Add Schema Markup
58667c5 - Update service file
4c29fca - Add app
2177146 - Added the contact page logic email sending
12ae373 - Terms of Service page added
```

---

## Notes for Future Development

1. **Phase 2 AI Features:** Implement AI-powered code review and suggestions
2. **User Management:** Enhanced admin user management panel
3. **Advanced Analytics:** Expand analytics with heatmaps and user journey tracking
4. **Gamification:** Leaderboards, badges, and streak tracking
5. **Mobile App:** Consider React Native migration for native apps
6. **Internationalization:** Multi-language support (Hindi, Spanish, Chinese)
7. **Performance:** Further optimization with Redis caching
8. **Monitoring:** Enhanced error tracking with Sentry integration
9. **Advanced Search:** Elasticsearch integration for better content discovery
10. **Video Integration:** Enhanced video hosting with adaptive streaming

---

## Development Environment

### Required Setup
1. Node.js 16+ and npm 8+
2. Firebase emulator (for local development)
3. Git for version control
4. VSCode recommended IDE

### Quick Start
```bash
# Clone and install
git clone <repo-url>
cd algorithm-visualizer
npm install

# Setup environment
cp .env.example .env.local
# Add Firebase credentials

# Start development
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Production Deployment
```bash
npm run build
firebase deploy
```

---

## About the Developer

**Rajendhar Are** | Full Stack Developer | Problem Solver

A tech enthusiast and developer specializing in creating impactful web projects and exploring the future of algorithms. Passionate about turning creative ideas into functional code that solves real-world problems.

**Skills & Expertise:**
- Full Stack Development (React, Node.js, Firebase)
- Algorithm Visualization & DSA
- Web Application Architecture
- Database Design & Optimization
- Cloud Infrastructure (Firebase, Deployment)
- UI/UX Implementation

**Connect With Me:**
- 🌐 Portfolio: [rajendharare.tech](https://rajendharare.tech)
- 💼 LinkedIn: [linkedin.com/in/rajendhar-are/](https://www.linkedin.com/in/rajendhar-are/)
- 🐙 GitHub: [@RajendharAre](https://github.com/RajendharAre)
- 📧 Email: arerajendhar33@gmail.com

---

**Last Updated:** April 12, 2026  
**Project Status:** ✅ Production Ready with Active Development  
**Live Domain:** https://algovieww.me  
**Created By:** Rajendhar Are  
**Portfolio:** https://rajendharare.tech  
**GitHub Repository:** https://github.com/RajendharAre/algorithm-visualizer  
**Repository Type:** Public (Open Source)  
**Version:** v1.0.0 - Current

**Key Features in v1.0.0:**
- Complete project setup with full stack architecture
- Algorithm visualization system with 50+ algorithms
- DSA practice platform with LeetCode integration
- Community features (discussions, ideas, experiences)
- Admin panel with real-time Firebase sync
- Google Analytics 4 integration
- SEO optimization with sitemap and schema markup

---

## Notes for Future Development

1. **User Management:** Add admin user management panel
2. **Analytics:** Expand analytics with more metrics
3. **Gamification:** Enhance reward and achievement system
4. **Mobile App:** Consider React Native migration
5. **Internationalization:** Multi-language support
6. **Performance:** Further optimization and caching strategies
7. **Monitoring:** Enhanced error tracking and logs

---

**Last Updated:** April 12, 2026  
**Project Status:** ✅ Production Ready  
**Live Domain:** https://algovieww.me  
**Created By:** Rajendhar Are  
**Portfolio:** https://rajendharare.tech  
**GitHub Repository:** https://github.com/RajendharAre/algorithm-visualizer

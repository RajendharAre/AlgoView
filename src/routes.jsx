import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/Layout/ProtectedRoute'
import MainApp from './components/MainApp'

// Lazy load all route components
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Auth = lazy(() => import('./components/Auth/Auth'))
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const DSA = lazy(() => import('./pages/DSA'))
const DSAAlgorithms = lazy(() => import('./pages/DSA/Algorithms'))
const DSAAlgorithmCategory = lazy(() => import('./pages/DSA/Algorithms/Category'))
const DSAProblems = lazy(() => import('./pages/DSA/Problems'))
const DSAProblemSheet = lazy(() => import('./pages/DSA/Problems/Sheet'))
const DSAPractice = lazy(() => import('./pages/DSA/Practice/Practice'))
const DSAProblemPractice = lazy(() => import('./pages/DSA/Practice/Problem'))
const DSAContribute = lazy(() => import('./pages/DSA/Contribute'))
const DSAContributeNew = lazy(() => import('./pages/DSA/Contribute/New'))
const DSADiscussions = lazy(() => import('./pages/DSA/Discussions'))
const DSADiscussionDetail = lazy(() => import('./pages/DSA/Discussions/Discussion'))
const DSADiscussionNew = lazy(() => import('./pages/DSA/Discussions/New'))
const AlgorithmVisualization = lazy(() => import('./pages/DSA/Visualization/AlgorithmVisualization'));
const DynamicAlgorithmVisualization = lazy(() => import('./pages/DSA/Visualization/DynamicAlgorithmVisualization'));
const SelectionSortVisualization = lazy(() => import('./pages/DSA/Visualization/Sorting/SelectionSort'))
const Development = lazy(() => import('./pages/Development'))
const TutorialsList = lazy(() => import('./pages/Development/Tutorials/TutorialsList'))
const CodeExamplesList = lazy(() => import('./pages/Development/CodeExamples/CodeExamplesList'))
const VideosPage = lazy(() => import('./pages/Development/Videos/VideosPage'))
const Ideas = lazy(() => import('./pages/Ideas'))
const AI = lazy(() => import('./pages/AI/AI'))
const IdeaDetail = lazy(() => import('./pages/Ideas/Detail'))
const NewIdea = lazy(() => import('./pages/Ideas/New'))
const References = lazy(() => import('./pages/References'))
const Profile = lazy(() => import('./pages/Profile'))
const UserProfile = lazy(() => import('./pages/Profile/User'))
const Settings = lazy(() => import('./pages/Settings'))
const Payment = lazy(() => import('./pages/Payment'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

// Public route wrapper
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useSelector((state) => state.user)
  
  // Show loading spinner while checking auth status
  if (loading) {
    return <LoadingSpinner />
  }
  
  // If user is authenticated, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainApp />,
    children: [
      // Public routes
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <About />
          </Suspense>
        )
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Auth />
            </Suspense>
          </PublicRoute>
        )
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Auth />
            </Suspense>
          </PublicRoute>
        )
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <ForgotPassword />
            </Suspense>
          </PublicRoute>
        )
      },
      
      // Protected routes
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'dsa',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <DSA />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                {/* Empty element for the main DSA page */}
                <div></div>
              </Suspense>
            )
          },
          {
            path: 'algorithms',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSAAlgorithms />
              </Suspense>
            )
          },
          {
            path: 'algorithms/:category',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSAAlgorithmCategory />
              </Suspense>
            )
          },
          {
            path: 'problems',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSAProblems />
              </Suspense>
            )
          },
          {
            path: 'problems/:sheetId',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSAProblemSheet />
              </Suspense>
            )
          },
          {
            path: 'practice',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSAPractice />
              </Suspense>
            )
          },
          {
            path: 'practice/:problemId',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSAProblemPractice />
              </Suspense>
            )
          },
          {
            path: 'contribute',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSAContribute />
              </Suspense>
            )
          },
          {
            path: 'contribute/new',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSAContributeNew />
              </Suspense>
            )
          },
          {
            path: 'discussions',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSADiscussions />
              </Suspense>
            )
          },
          {
            path: 'discussions/:discussionId',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSADiscussionDetail />
              </Suspense>
            )
          },
          {
            path: 'discussions/new',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DSADiscussionNew />
              </Suspense>
            )
          },
          {
            path: 'visualization/:algorithmId',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AlgorithmVisualization />
              </Suspense>
            )
          }
          // Removed Rewards routes as requested
        ]
      },
      {
        path: 'development',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Development />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'development/tutorials',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <TutorialsList />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'development/code-examples',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <CodeExamplesList />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'development/videos',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <VideosPage />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'ideas',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Ideas />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'ai',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <AI />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'ideas/:ideaId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <IdeaDetail />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'ideas/new',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <NewIdea />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'references',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <References />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'profile/:userId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <UserProfile />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'payment',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Payment />
            </Suspense>
          </ProtectedRoute>
        )
      },
      
      // Error routes
      {
        path: '404',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotFound />
          </Suspense>
        )
      },
      {
        path: 'unauthorized',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Unauthorized />
          </Suspense>
        )
      },
      
      // 404 Not Found
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  }
])

export default router
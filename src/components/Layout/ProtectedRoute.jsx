import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useSelector((state) => state.user)
  const navigate = useNavigate()
  
  console.log('ProtectedRoute rendered');
  console.log('Current user:', currentUser);
  console.log('Loading:', loading);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !currentUser) {
      console.log('No user found, redirecting to login');
      navigate('/login')
    }
  }, [currentUser, loading, navigate])

  // Show loading state while checking auth
  if (loading) {
    console.log('Still loading user auth state');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" aria-label="Loading"></div>
      </div>
    )
  }

  // If user exists, render children
  console.log('User authenticated, rendering children');
  return currentUser ? children : null
}

export default ProtectedRoute
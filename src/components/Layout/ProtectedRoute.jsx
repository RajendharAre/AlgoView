import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !currentUser) {
      navigate('/login')
    }
  }, [currentUser, loading, navigate])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" aria-label="Loading"></div>
      </div>
    )
  }

  // If user exists, render children
  return currentUser ? children : null
}

export default ProtectedRoute
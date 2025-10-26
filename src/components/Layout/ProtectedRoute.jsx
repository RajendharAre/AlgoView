import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useSelector((state) => state.user)
  const location = useLocation()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Set authChecked to true once loading is complete
    if (!loading) {
      setAuthChecked(true)
    }
  }, [loading])

  // If still checking auth status, show loading
  if (loading || !authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </motion.div>
      </div>
    )
  }

  // If user is not authenticated, redirect to login
  if (!currentUser) {
    // Save the intended destination in localStorage
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search)
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // User is authenticated, render children
  return children
}

export default ProtectedRoute;
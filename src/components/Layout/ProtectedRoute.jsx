import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../Common/Loader'

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
    return <Loader />
  }

  // If user exists, render children
  console.log('User authenticated, rendering children');
  return currentUser ? children : null
}

export default ProtectedRoute
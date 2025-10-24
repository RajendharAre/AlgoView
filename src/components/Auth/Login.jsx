import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import ForgotPassword from './ForgotPassword'
import { validateLogin } from '../../utils/validation'

const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate form using Zod
    const validation = validateLogin({ email, password })
    if (!validation.success) {
      setError(Object.values(validation.errors)[0])
      setLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Login successful - user will be redirected automatically
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async provider => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Social login successful:', result.user)
    } catch (error) {
      // Only log unexpected errors, not user actions
      if (
        error.code !== 'auth/popup-closed-by-user' &&
        error.code !== 'auth/cancelled-popup-request'
      ) {
        console.error('Social login error:', error)
      }

      switch (error.code) {
        case 'auth/popup-blocked':
          setError('Popup blocked by browser. Please allow popups for this site and try again.')
          break
        case 'auth/popup-closed-by-user':
          // User closed the popup - this is not an error, just reset the state
          setSuccess('Sign in cancelled. You can try again or use email/password.') // Inform user
          setError('') // Clear any error message
          // Immediately reset loading state for better UX
          setLoading(false)
          return
        case 'auth/cancelled-popup-request':
          // User cancelled the request - not an error
          setSuccess('Sign in cancelled. You can try again or use email/password.')
          setError('')
          // Immediately reset loading state for better UX
          setLoading(false)
          return
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.')
          break
        case 'auth/invalid-credential':
          setError('Invalid credentials. Please try again.')
          break
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.')
          break
        case 'auth/unauthorized-domain':
          setError('This domain is not authorized for OAuth operations. Please contact support.')
          break
        case 'auth/operation-not-allowed':
          setError('Social login is not enabled. Please contact support.')
          break
        case 'auth/redirect-uri-mismatch':
          setError(
            'OAuth configuration error. Please check that the redirect URI is properly configured in Firebase and GitHub.'
          )
          break
        default:
          // More user-friendly default messages
          if (error.message.includes('redirect_uri')) {
            setError(
              'GitHub OAuth configuration error. Please ensure the redirect URI is correctly set up in both Firebase and GitHub settings.'
            )
          } else if (error.message.includes('auth/')) {
            setError('Social sign in failed. Please try again.')
          } else {
            setError('An unexpected error occurred. Please try again.')
          }
      }
    } finally {
      // Only set loading to false if we haven't already done so
      // This prevents conflicts with the immediate reset in error cases
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider()
    handleSocialLogin(provider)
  }

  const handleGithubLogin = () => {
    const provider = new GithubAuthProvider()
    handleSocialLogin(provider)
  }

  const handleError = error => {
    console.error('Authentication error:', error)
    switch (error.code) {
      case 'auth/user-not-found':
        setError('This email is not registered. Please sign up first.')
        break
      case 'auth/wrong-password':
        setError('Invalid email or password. Please try again.')
        break
      case 'auth/invalid-email':
        setError('Please enter a valid email address.')
        break
      case 'auth/user-disabled':
        setError('This account has been disabled. Please contact support.')
        break
      case 'auth/popup-closed-by-user':
        // This should not happen for regular login, but if it does, clear state
        setError('')
        break
      case 'auth/account-exists-with-different-credential':
        setError(
          'An account already exists with this email. Please sign in using your original method.'
        )
        break
      case 'auth/invalid-credential':
        setError('Invalid email or password. Please check your credentials.')
        break
      case 'auth/too-many-requests':
        setError('Too many failed attempts. Please try again later.')
        break
      case 'auth/network-request-failed':
        setError('Network error. Please check your connection and try again.')
        break
      default:
        // More user-friendly default messages
        if (error.message.includes('auth/')) {
          setError('Please check your credentials and try again.')
        } else {
          setError('An unexpected error occurred. Please try again.')
        }
    }
  }

  // Show ForgotPassword component when needed
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-blue-500 hover:underline transition-colors"
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2" size={18} />
            </>
          )}
        </button>
      </form>

      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
        <button
          onClick={handleGithubLogin}
          disabled={loading}
          className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
        >
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
            />
          </svg>
          GitHub
        </button>
      </div>

      <p className="text-center mt-6 text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="font-medium text-blue-500 hover:text-blue-600 transition-colors"
          disabled={loading}
        >
          Sign up
        </button>
      </p>
    </div>
  )
}

export default Login

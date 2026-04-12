import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { validateRegister } from '../../utils/validation'
import {
  generateVerificationCode,
  hashVerificationCode,
  verifyCodeHash,
  isCodeExpired,
  getCodeExpiryTime,
} from '../../utils/verificationUtils'
import VerificationScreen from './VerificationScreen'

/**
 * Convert Firebase/Firestore errors into user-friendly messages.
 * Our own throw new Error(...) strings pass through unchanged.
 */
const getFriendlyAuthError = error => {
  const code = error.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please log in or use a different email.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.'
    default:
      // If the message looks like a raw Firebase error, replace it
      if (error.message?.startsWith('Firebase:') || error.message?.includes('auth/')) {
        return 'Something went wrong. Please try again.'
      }
      // Our own throw new Error('...') strings are already friendly
      return error.message || 'Something went wrong. Please try again.'
  }
}

const Register = ({ onSwitchToLogin }) => {
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // UI States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Verification States
  const [verificationStep, setVerificationStep] = useState(false) // false = signup form, true = verification screen
  const [verificationEmail, setVerificationEmail] = useState('')
  const [resendAttempts, setResendAttempts] = useState(0)

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const validateForm = () => {
    const validation = validateRegister(formData)
    if (!validation.success) {
      setError(Object.values(validation.errors)[0])
      return false
    }
    return true
  }

  /**
   * Step 1: Check existence → Create Pending Record → Send Code
   *
   * Flow:
   *   1. Validate form inputs
   *   2. Check Firebase Auth — block if email already registered
   *   3. Check Firestore pendingVerifications — if non-expired exists, resume
   *   4. Clean up any expired records, then create a fresh pending record
   *   5. Send 6-digit code via Cloud Function
   *   6. Show verification UI
   */
  const handleRegister = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      // ── Step 1: Check if email is already registered in Firebase Auth ──
      const signInMethods = await fetchSignInMethodsForEmail(auth, formData.email)
      if (signInMethods && signInMethods.length > 0) {
        setError('This email is already in use. Please log in or use a different email.')
        setLoading(false)
        return
      }

      // ── Step 2: Check for existing pending verification in Firestore ──
      const pendingQuery = query(
        collection(db, 'pendingVerifications'),
        where('email', '==', formData.email)
      )
      const pendingDocs = await getDocs(pendingQuery)

      if (!pendingDocs.empty) {
        const pendingData = pendingDocs.docs[0].data()

        if (!isCodeExpired(pendingData.expiryTime)) {
          // Active verification exists — resume without sending a duplicate email
          setVerificationEmail(formData.email)
          setVerificationStep(true)
          setResendAttempts(pendingData.resendCount || 0)
          setSuccess(
            'A verification code was already sent to this email. Please check your inbox or request a new code.'
          )
          setLoading(false)
          return
        }

        // Expired — clean up stale records before proceeding
        const deletePromises = pendingDocs.docs.map(d =>
          deleteDoc(doc(db, 'pendingVerifications', d.id))
        )
        await Promise.all(deletePromises)
      }

      // ── Step 3: Generate verification code ──
      const verificationCode = generateVerificationCode()
      const codeHash = hashVerificationCode(verificationCode)
      const expiryTime = getCodeExpiryTime(10) // 10 minutes

      // ── Step 4: Create pending verification record in Firestore ──
      // NOTE: Password & name are kept in component state only — never stored in Firestore
      const pendingVerificationId = `${formData.email}_${Date.now()}`
      await setDoc(doc(db, 'pendingVerifications', pendingVerificationId), {
        email: formData.email,
        codeHash: codeHash,
        expiryTime: expiryTime,
        createdAt: new Date(),
        used: false,
        resendCount: 0,
        attempts: 0,
      })

      // ── Step 5: Send verification email via Cloud Function ──
      const response = await fetch('/cf/sendVerificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: verificationCode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send verification email. Please try again.')
      }

      // ── Step 6: Transition to verification screen ──
      setVerificationEmail(formData.email)
      setVerificationStep(true)
      setResendAttempts(0)
      setSuccess('Verification code sent! Check your email.')
    } catch (error) {
      console.error('Registration error:', error)
      setError(getFriendlyAuthError(error))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Step 2: Verify Code & Create Auth User
   */
  const handleVerifyCode = async verificationCode => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Find pending verification record
      const verificationsRef = collection(db, 'pendingVerifications')
      const q = query(verificationsRef, where('email', '==', verificationEmail))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error('Verification record not found. Please sign up again.')
      }

      const pendingDoc = querySnapshot.docs[0]
      const pendingData = pendingDoc.data()

      // Check if code has expired
      if (isCodeExpired(pendingData.expiryTime)) {
        throw new Error('Verification code has expired. Please sign up again.')
      }

      // Verify code hash
      if (!verifyCodeHash(verificationCode, pendingData.codeHash)) {
        // Increment failed attempts
        const updatedAttempts = (pendingData.attempts || 0) + 1
        await setDoc(
          doc(db, 'pendingVerifications', pendingDoc.id),
          { attempts: updatedAttempts },
          { merge: true }
        )

        // Lock after 5 failed attempts
        if (updatedAttempts >= 5) {
          await deleteDoc(doc(db, 'pendingVerifications', pendingDoc.id))
          throw new Error('Too many failed attempts. Please sign up again.')
        }

        throw new Error(`Invalid code. ${5 - updatedAttempts} attempts remaining.`)
      }

      // Code verified! Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        emailVerified: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        algorithmsCompleted: 0,
        favoriteAlgorithms: [],
      })

      // Delete pending verification record
      await deleteDoc(doc(db, 'pendingVerifications', pendingDoc.id))

      console.log('User registered and verified successfully:', userCredential.user)
      setSuccess('Email verified successfully! Welcome to AlgoView.')
      setVerificationStep(false)
    } catch (error) {
      console.error('Verification error:', error)
      setError(getFriendlyAuthError(error))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Step 3: Resend Verification Code
   */
  const handleResendCode = async () => {
    setLoading(true)
    setError('')

    try {
      // Limited resend attempts
      if (resendAttempts >= 3) {
        throw new Error('Maximum resend attempts reached. Please sign up again.')
      }

      // Generate new code
      const verificationCode = generateVerificationCode()
      const codeHash = hashVerificationCode(verificationCode)
      const expiryTime = getCodeExpiryTime(10)

      // Find and update pending verification record
      const verificationsRef = collection(db, 'pendingVerifications')
      const q = query(verificationsRef, where('email', '==', verificationEmail))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error('Verification record not found. Please sign up again.')
      }

      const pendingDoc = querySnapshot.docs[0]

      // Update with new code
      await setDoc(
        doc(db, 'pendingVerifications', pendingDoc.id),
        {
          codeHash: codeHash,
          expiryTime: expiryTime,
          resendCount: (pendingDoc.data().resendCount || 0) + 1,
          attempts: 0, // Reset attempts on resend
        },
        { merge: true }
      )

      // Send new verification email
      const response = await fetch('/cf/sendVerificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: verificationEmail,
          verificationCode: verificationCode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to resend verification email')
      }

      setResendAttempts(prev => prev + 1)
      setSuccess('New verification code sent to your email!')
    } catch (error) {
      console.error('Resend error:', error)
      setError(getFriendlyAuthError(error))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Change Email (go back to signup form)
   */
  const handleChangeEmail = () => {
    setVerificationStep(false)
    setVerificationEmail('')
    setResendAttempts(0)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    setError('')
    setSuccess('')
  }

  const handleSocialLogin = async provider => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Social login successful:', result.user)

      // Create user document in Firestore for social login users
      await setDoc(
        doc(db, 'users', result.user.uid),
        {
          uid: result.user.uid,
          name: result.user.displayName || result.user.email.split('@')[0],
          email: result.user.email,
          emailVerified: result.user.emailVerified || true,
          createdAt: new Date(),
          lastLogin: new Date(),
          algorithmsCompleted: 0,
          favoriteAlgorithms: [],
        },
        { merge: true }
      )

      setSuccess('Signed up successfully! Redirecting...')
    } catch (error) {
      if (
        error.code !== 'auth/popup-closed-by-user' &&
        error.code !== 'auth/cancelled-popup-request'
      ) {
        console.error('Social registration error:', error)
      }

      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          setError(
            'An account already exists with this email. Please sign in using your original method.'
          )
          break
        case 'auth/popup-closed-by-user':
          setSuccess(
            'Sign up cancelled. You can try again or create an account with email/password.'
          )
          setError('')
          setLoading(false)
          return
        case 'auth/cancelled-popup-request':
          setSuccess(
            'Sign up cancelled. You can try again or create an account with email/password.'
          )
          setError('')
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
        case 'auth/redirect-uri-mismatch':
          setError(
            'OAuth configuration error. Please check that the redirect URI is properly configured in Firebase and GitHub.'
          )
          break
        case 'auth/operation-not-allowed':
          setError('Social sign up is not enabled. Please contact support.')
          break
        default:
          if (error.message.includes('redirect_uri')) {
            setError(
              'GitHub OAuth configuration error. Please ensure the redirect URI is correctly set up in both Firebase and GitHub settings.'
            )
          } else if (error.message.includes('auth/')) {
            setError('Social sign up failed. Please try again.')
          } else {
            setError('Failed to sign up with social account. Please try again.')
          }
      }
    } finally {
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

  // If in verification step, show verification screen
  if (verificationStep) {
    return (
      <VerificationScreen
        email={verificationEmail}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        onChangeEmail={handleChangeEmail}
        loading={loading}
        error={error}
        success={success}
      />
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-sm text-gray-500 mt-1">Join AlgoView and master algorithms</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="John Doe"
            disabled={loading}
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Min. 6 characters"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Confirm your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-start gap-2 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm"
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm"
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Sending code...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs font-medium text-gray-400 uppercase tracking-wider">
            or
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
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
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 border border-gray-900 rounded-xl text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-all duration-200"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
            />
          </svg>
          GitHub
        </button>
      </div>

      {/* Switch to Login */}
      <p className="text-center mt-6 text-sm text-gray-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          disabled={loading}
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register

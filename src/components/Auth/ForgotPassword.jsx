import { useState, useEffect } from 'react'
import { db } from '../../lib/firebase'
import { doc, setDoc, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, KeyRound, Lock, Eye, EyeOff } from 'lucide-react'
import { validateResetPassword } from '../../utils/validation'
import {
  generateVerificationCode,
  hashVerificationCode,
  verifyCodeHash,
  isCodeExpired,
  getCodeExpiryTime,
} from '../../utils/verificationUtils'

const ForgotPassword = ({ onBackToLogin }) => {
  // ── Step tracking ──
  // 'email' → enter email
  // 'code'  → enter 6-digit code
  // 'newPassword' → enter new password
  // 'success' → done
  const [step, setStep] = useState('email')

  // Form state
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const [resendAttempts, setResendAttempts] = useState(0)
  const MAX_RESEND_ATTEMPTS = 3

  useEffect(() => {
    let interval
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCountdown])

  // ────────────────────────────────────────────────
  // Step 1: Validate email → Check existence → Send code
  // ────────────────────────────────────────────────
  const handleSendCode = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const validation = validateResetPassword({ email })
    if (!validation.success) {
      setError(Object.values(validation.errors)[0])
      setLoading(false)
      return
    }

    try {
      // Check for existing non-expired reset record
      const existingQuery = query(
        collection(db, 'pendingPasswordResets'),
        where('email', '==', email)
      )
      const existingDocs = await getDocs(existingQuery)

      if (!existingDocs.empty) {
        const existingData = existingDocs.docs[0].data()
        if (!isCodeExpired(existingData.expiryTime)) {
          // Active code exists — go directly to code step
          setStep('code')
          setResendAttempts(existingData.resendCount || 0)
          setSuccess(
            'A reset code was already sent to your email. Please check your inbox or request a new code.'
          )
          setLoading(false)
          return
        }
        // Expired — clean up
        const deletePromises = existingDocs.docs.map(d =>
          deleteDoc(doc(db, 'pendingPasswordResets', d.id))
        )
        await Promise.all(deletePromises)
      }

      // Generate code
      const resetCode = generateVerificationCode()
      const codeHash = hashVerificationCode(resetCode)
      const expiryTime = getCodeExpiryTime(10)

      // Store in Firestore
      const resetId = `reset_${email}_${Date.now()}`
      await setDoc(doc(db, 'pendingPasswordResets', resetId), {
        email: email,
        codeHash: codeHash,
        expiryTime: expiryTime,
        createdAt: new Date(),
        used: false,
        resendCount: 0,
        attempts: 0,
      })

      // Send code via Cloud Function
      const response = await fetch('/cf/sendPasswordResetCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode }),
      })

      if (!response.ok) {
        throw new Error('Failed to send reset code. Please try again.')
      }

      setStep('code')
      setResendAttempts(0)
      setResendCountdown(60)
      setSuccess('Reset code sent! Check your email inbox.')
    } catch (error) {
      console.error('Password reset error:', error)
      if (error.message?.startsWith('Firebase:') || error.message?.includes('auth/')) {
        setError('Something went wrong. Please try again.')
      } else {
        setError(error.message || 'Failed to send reset code. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ────────────────────────────────────────────────
  // Step 2: Verify the 6-digit code
  // ────────────────────────────────────────────────
  const handleVerifyCode = async () => {
    const codeString = code.join('')
    if (codeString.length !== 6) {
      setError('Please enter the complete 6-digit code.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const resetsRef = collection(db, 'pendingPasswordResets')
      const q = query(resetsRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error('Reset record not found. Please request a new code.')
      }

      const resetDoc = querySnapshot.docs[0]
      const resetData = resetDoc.data()

      if (isCodeExpired(resetData.expiryTime)) {
        await deleteDoc(doc(db, 'pendingPasswordResets', resetDoc.id))
        throw new Error('Reset code has expired. Please request a new code.')
      }

      if (!verifyCodeHash(codeString, resetData.codeHash)) {
        const updatedAttempts = (resetData.attempts || 0) + 1
        await setDoc(
          doc(db, 'pendingPasswordResets', resetDoc.id),
          { attempts: updatedAttempts },
          { merge: true }
        )

        if (updatedAttempts >= 5) {
          await deleteDoc(doc(db, 'pendingPasswordResets', resetDoc.id))
          throw new Error('Too many failed attempts. Please request a new code.')
        }

        throw new Error(`Invalid code. ${5 - updatedAttempts} attempts remaining.`)
      }

      // Code verified — move to new password step
      setStep('newPassword')
      setSuccess('Code verified! Please enter your new password.')
    } catch (error) {
      console.error('Code verification error:', error)
      setError(error.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ────────────────────────────────────────────────
  // Step 3: Set new password via Cloud Function
  // ────────────────────────────────────────────────
  const handleResetPassword = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      // Call Cloud Function to reset password via Admin SDK
      const response = await fetch('/cf/resetUserPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password.')
      }

      // Clean up pending reset record
      const resetsRef = collection(db, 'pendingPasswordResets')
      const q = query(resetsRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)
      const deletePromises = querySnapshot.docs.map(d =>
        deleteDoc(doc(db, 'pendingPasswordResets', d.id))
      )
      await Promise.all(deletePromises)

      setStep('success')
      setSuccess('Password reset successfully! You can now sign in with your new password.')
    } catch (error) {
      console.error('Password reset error:', error)
      setError(error.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ────────────────────────────────────────────────
  // Resend reset code
  // ────────────────────────────────────────────────
  const handleResendCode = async () => {
    if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
      setError('Maximum resend attempts reached. Please start over.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const resetCode = generateVerificationCode()
      const codeHash = hashVerificationCode(resetCode)
      const expiryTime = getCodeExpiryTime(10)

      // Find and update existing record
      const resetsRef = collection(db, 'pendingPasswordResets')
      const q = query(resetsRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error('Reset record not found. Please start over.')
      }

      const resetDoc = querySnapshot.docs[0]
      await setDoc(
        doc(db, 'pendingPasswordResets', resetDoc.id),
        {
          codeHash: codeHash,
          expiryTime: expiryTime,
          resendCount: (resetDoc.data().resendCount || 0) + 1,
          attempts: 0,
        },
        { merge: true }
      )

      const response = await fetch('/cf/sendPasswordResetCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode }),
      })

      if (!response.ok) {
        throw new Error('Failed to resend reset code.')
      }

      setResendAttempts(prev => prev + 1)
      setResendCountdown(60)
      setCode(['', '', '', '', '', ''])
      setSuccess('New reset code sent to your email!')
    } catch (error) {
      console.error('Resend error:', error)
      setError(error.message || 'Failed to resend code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Code input handlers ──
  const handleCodeChange = (index, value) => {
    const numValue = value.replace(/[^0-9]/g, '')
    if (numValue.length > 1) return

    const newCode = [...code]
    newCode[index] = numValue
    setCode(newCode)

    if (numValue && index < 5) {
      const nextInput = document.querySelector(`input[data-reset-code-index="${index + 1}"]`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-reset-code-index="${index - 1}"]`)
      prevInput?.focus()
    }
  }

  const handlePaste = e => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, 6)
    if (pastedData.length === 6) {
      setCode(pastedData.split(''))
    }
  }

  // ── Step indicator ──
  const steps = [
    { key: 'email', label: 'Email' },
    { key: 'code', label: 'Verify' },
    { key: 'newPassword', label: 'Reset' },
  ]
  const currentStepIndex = step === 'success' ? 3 : steps.findIndex(s => s.key === step)

  // ── Error & Success alerts ──
  const AlertError = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm"
    >
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </motion.div>
  )

  const AlertSuccess = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm"
    >
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </motion.div>
  )

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
          <KeyRound className="text-blue-600" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {step === 'success' ? 'Password Reset' : 'Reset Password'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {step === 'email' && 'Enter your email to receive a reset code'}
          {step === 'code' && `Enter the 6-digit code sent to ${email}`}
          {step === 'newPassword' && 'Create your new password'}
          {step === 'success' && 'Your password has been updated'}
        </p>
      </div>

      {/* Step Progress */}
      {step !== 'success' && (
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  i < currentStepIndex
                    ? 'bg-green-500 text-white'
                    : i === currentStepIndex
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i < currentStepIndex ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 rounded ${i < currentStepIndex ? 'bg-green-400' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Step: Email ── */}
      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.form
            key="email-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSendCode}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setError('')
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
                placeholder="you@example.com"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            {error && <AlertError message={error} />}
            {success && <AlertSuccess message={success} />}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Sending...
                </>
              ) : (
                'Send Reset Code'
              )}
            </button>
          </motion.form>
        )}

        {/* ── Step: Code Verification ── */}
        {step === 'code' && (
          <motion.div
            key="code-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* Code Inputs */}
            <div className="flex justify-center gap-2.5">
              {code.map((digit, index) => (
                <input
                  key={index}
                  data-reset-code-index={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleCodeChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && <AlertError message={error} />}
            {success && <AlertSuccess message={success} />}

            <button
              onClick={handleVerifyCode}
              disabled={loading || code.join('').length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>

            {/* Resend */}
            <div className="text-center">
              {resendCountdown > 0 ? (
                <p className="text-sm text-gray-400">
                  Resend code in{' '}
                  <span className="font-semibold text-gray-600">{resendCountdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendCode}
                  disabled={loading || resendAttempts >= MAX_RESEND_ATTEMPTS}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
                >
                  {resendAttempts >= MAX_RESEND_ATTEMPTS
                    ? 'Maximum resend attempts reached'
                    : "Didn't receive the code? Resend"}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Step: New Password ── */}
        {step === 'newPassword' && (
          <motion.form
            key="password-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleResetPassword}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => {
                    setNewPassword(e.target.value)
                    setError('')
                  }}
                  className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  placeholder="Min. 6 characters"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value)
                    setError('')
                  }}
                  className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  placeholder="Confirm your new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <AlertError message={error} />}
            {success && <AlertSuccess message={success} />}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </motion.form>
        )}

        {/* ── Step: Success ── */}
        {step === 'success' && (
          <motion.div
            key="success-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <AlertSuccess message={success} />
            <button
              onClick={onBackToLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-blue-500/20"
            >
              Go to Sign In
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to login */}
      {step !== 'success' && (
        <div className="text-center mt-5">
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </button>
        </div>
      )}

      {/* Security Note */}
      {step === 'email' && (
        <div className="mt-5 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
            <Lock size={12} className="flex-shrink-0" />
            <span>The reset code will be sent from hello@algovieww.me to your inbox.</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword

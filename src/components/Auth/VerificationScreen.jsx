import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'

const VerificationScreen = ({
  email,
  onVerify,
  onResend,
  onChangeEmail,
  loading = false,
  error = '',
  success = '',
}) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
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

  const handleCodeChange = (index, value) => {
    const numValue = value.replace(/[^0-9]/g, '')
    if (numValue.length > 1) return

    const newCode = [...code]
    newCode[index] = numValue
    setCode(newCode)

    if (numValue && index < 5) {
      const nextInput = document.querySelector(`input[data-code-index="${index + 1}"]`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-code-index="${index - 1}"]`)
      prevInput?.focus()
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    const verificationCode = code.join('')
    if (verificationCode.length !== 6) return
    onVerify(verificationCode)
  }

  const handleResend = async () => {
    if (resendAttempts >= MAX_RESEND_ATTEMPTS) return
    setResendCountdown(30)
    setResendAttempts(prev => prev + 1)
    await onResend()
  }

  const canResend = resendCountdown === 0 && resendAttempts < MAX_RESEND_ATTEMPTS
  const codeComplete = code.every(digit => digit !== '')

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
          <svg
            className="w-7 h-7 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-sm text-gray-500 mt-1">
          We sent a 6-digit code to
          <br />
          <span className="font-semibold text-gray-700">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Code Input Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter Verification Code
          </label>
          <div className="flex gap-2.5 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                data-code-index={index}
                value={digit}
                onChange={e => handleCodeChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={e => {
                  e.preventDefault()
                  const pastedText = e.clipboardData.getData('text')
                  const digits = pastedText.replace(/[^0-9]/g, '').split('')
                  const newCode = [...code]
                  digits.forEach((d, i) => {
                    if (index + i < 6) newCode[index + i] = d
                  })
                  setCode(newCode)
                }}
                maxLength="1"
                className="w-11 h-13 text-center text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={loading}
                autoComplete="off"
              />
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">Code expires in 10 minutes</p>
        </div>

        {/* Error */}
        {error && (
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
            {error}
          </motion.div>
        )}

        {/* Success */}
        {success && (
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
            {success}
          </motion.div>
        )}

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading || !codeComplete}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>
      </form>

      {/* Resend Code */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500 mb-2">Didn't receive the code?</p>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend Code
          </button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Resend available in{' '}
              <span className="font-semibold text-gray-600">{resendCountdown}s</span>
            </p>
            {resendAttempts >= MAX_RESEND_ATTEMPTS && (
              <p className="text-xs text-red-500 mt-1">Maximum resend attempts reached</p>
            )}
          </div>
        )}
      </div>

      {/* Change Email Link */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onChangeEmail}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={15} />
          Use different email
        </button>
      </div>

      <div className="mt-5 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
          <Lock size={12} className="flex-shrink-0" />
          <span>We'll never share your email. This code is for verification only.</span>
        </p>
      </div>
    </div>
  )
}

export default VerificationScreen

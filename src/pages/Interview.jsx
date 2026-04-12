import { useState, useEffect } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { useSelector } from 'react-redux'
import { Calendar, Clock, Zap, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import { APP_COLORS, APP_SHADOWS } from '../constants/sitePalette'

const COLORS = APP_COLORS
const SHADOWS = APP_SHADOWS

const Interview = () => {
  const [selectedType, setSelectedType] = useState(null)
  const [formData, setFormData] = useState({
    topic: 'DSA',
    difficulty: 'Intermediate',
    duration: '30',
  })
  const [status, setStatus] = useState('selection') // selection, form, waiting, ready, review, timeout
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [meetLink, setMeetLink] = useState('')
  const [error, setError] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [reviewData, setReviewData] = useState({
    rating: 5,
    feedback: '',
  })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const { currentUser } = useSelector(state => state.user)

  // Set page meta for SEO
  usePageMeta(
    'Mock Interview - Practice DSA & System Design',
    'Practice live mock interviews with professionals or AI. Build confidence for technical interviews with expert guidance.',
    'mock interview, interview prep, DSA interview, system design, technical interview'
  )

  const interviewTopics = [
    'DSA',
    'System Design',
    'HR Round',
    'Web Development',
    'Backend',
    'Frontend',
  ]

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced']
  const durations = ['15', '30', '45']

  // Countdown timer effect
  useEffect(() => {
    let interval
    if (status === 'waiting' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStatus('timeout')
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status, timeLeft])

  // Poll for session status updates
  useEffect(() => {
    let pollInterval
    if (status === 'waiting' && sessionId) {
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/interview/${sessionId}`)
          const data = await response.json()

          if (data.success && data.session.status === 'accepted') {
            setMeetLink(data.session.meetLink)
            setStatus('ready')
            clearInterval(pollInterval)
          }
        } catch (err) {
          console.error('Error polling session:', err)
        }
      }, 2000) // Poll every 2 seconds
    }
    return () => clearInterval(pollInterval)
  }, [status, sessionId])

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleJoinInterview = async () => {
    if (!currentUser) {
      setError('Please log in to join an interview')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('🎯 Sending interview request with data:', {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'User',
        userEmail: currentUser.email,
        topic: formData.topic,
        difficulty: formData.difficulty,
        duration: formData.duration,
      })

      // Send interview request to server
      const response = await fetch('/api/interview/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          userName: currentUser.displayName || 'User',
          userEmail: currentUser.email,
          topic: formData.topic,
          difficulty: formData.difficulty,
          duration: formData.duration,
        }),
      })

      console.log('📊 Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Response error:', errorData)
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        )
      }

      const data = await response.json()
      console.log('✅ Interview request successful:', data)
      
      setSessionId(data.sessionId)
      setMeetLink(data.meetLink)
      setStatus('waiting')
      setTimeLeft(300) // Reset timer
    } catch (err) {
      const errorMsg = err.message || 'Unknown error'
      setError(`Error: ${errorMsg}`)
      console.error('❌ Interview error:', err)
    } finally {
      setLoading(false)
    }
  }

  // AI Interview Card
  const AIInterviewCard = () => (
    <div
      className="border rounded-lg p-8 text-center transition-all hover:shadow-lg relative"
      style={{
        backgroundColor: COLORS.bg.surface,
        borderColor: COLORS.border.light,
        boxShadow: SHADOWS.sm,
        opacity: 0.7,
      }}
    >
      <div className="absolute top-4 right-4">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: '#fbbf24', color: '#1f2937' }}
        >
          Coming Soon
        </span>
      </div>

      <div className="flex justify-center mb-6">
        <Zap className="h-12 w-12" style={{ color: COLORS.text.primary }} />
      </div>

      <h3 className="text-2xl font-bold mb-3" style={{ color: COLORS.text.primary }}>
        AI Mock Interview
      </h3>

      <p className="mb-6" style={{ color: COLORS.text.secondary }}>
        Practice with our AI-powered interviewer that adapts to your skill level and provides
        real-time feedback
      </p>

      <button
        disabled
        className="px-6 py-3 rounded-lg font-semibold transition-opacity cursor-not-allowed"
        style={{
          backgroundColor: COLORS.text.primary,
          color: COLORS.bg.surface,
          opacity: 0.5,
        }}
      >
        Coming Soon
      </button>

      <p className="text-xs mt-4" style={{ color: COLORS.text.secondary }}>
        Expected Q2 2026
      </p>
    </div>
  )

  // Human Interview Card
  const HumanInterviewCard = () => (
    <div
      className="border rounded-lg p-8 text-center transition-all hover:shadow-lg cursor-pointer"
      onClick={() => {
        setSelectedType('human')
        setStatus('form')
      }}
      style={{
        backgroundColor: selectedType === 'human' ? COLORS.bg.secondary : COLORS.bg.surface,
        borderColor: selectedType === 'human' ? COLORS.text.primary : COLORS.border.light,
        boxShadow: selectedType === 'human' ? SHADOWS.md : SHADOWS.sm,
      }}
    >
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-12 w-12" style={{ color: COLORS.text.primary }} />
      </div>

      <h3 className="text-2xl font-bold mb-3" style={{ color: COLORS.text.primary }}>
        Professional Interview
      </h3>

      <p className="mb-6" style={{ color: COLORS.text.secondary }}>
        Get real feedback from professional interviewers. Book a live session and practice with
        experts
      </p>

      <button
        className="px-6 py-3 rounded-lg font-semibold transition-all"
        style={{
          backgroundColor: COLORS.text.primary,
          color: COLORS.bg.surface,
          boxShadow: SHADOWS.sm,
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = SHADOWS.md)}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = SHADOWS.sm)}
      >
        Select
      </button>
    </div>
  )

  // Interview Form
  const InterviewForm = () => (
    <div
      className="border rounded-lg p-8 max-w-2xl mx-auto"
      style={{
        backgroundColor: COLORS.bg.surface,
        borderColor: COLORS.border.light,
        boxShadow: SHADOWS.sm,
      }}
    >
      <h3 className="text-2xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
        Configure Your Interview
      </h3>

      <div className="space-y-6">
        {/* Topic Selection */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: COLORS.text.primary }}
          >
            Interview Topic
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interviewTopics.map(topic => (
              <button
                key={topic}
                onClick={() => handleFormChange('topic', topic)}
                className="p-3 rounded-lg font-medium transition-all border"
                style={{
                  backgroundColor:
                    formData.topic === topic ? COLORS.text.primary : COLORS.bg.secondary,
                  color: formData.topic === topic ? COLORS.bg.surface : COLORS.text.primary,
                  borderColor: formData.topic === topic ? COLORS.text.primary : COLORS.border.light,
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: COLORS.text.primary }}
          >
            Difficulty Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {difficultyLevels.map(level => (
              <button
                key={level}
                onClick={() => handleFormChange('difficulty', level)}
                className="p-3 rounded-lg font-medium transition-all border"
                style={{
                  backgroundColor:
                    formData.difficulty === level ? COLORS.text.primary : COLORS.bg.secondary,
                  color: formData.difficulty === level ? COLORS.bg.surface : COLORS.text.primary,
                  borderColor:
                    formData.difficulty === level ? COLORS.text.primary : COLORS.border.light,
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: COLORS.text.primary }}
          >
            Session Duration
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {durations.map(duration => (
              <button
                key={duration}
                onClick={() => handleFormChange('duration', duration)}
                className="p-3 rounded-lg font-medium transition-all border flex items-center justify-center gap-2"
                style={{
                  backgroundColor:
                    formData.duration === duration ? COLORS.text.primary : COLORS.bg.secondary,
                  color: formData.duration === duration ? COLORS.bg.surface : COLORS.text.primary,
                  borderColor:
                    formData.duration === duration ? COLORS.text.primary : COLORS.border.light,
                }}
              >
                <Clock className="h-4 w-4" />
                {duration} min
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-4 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => {
              setSelectedType(null)
              setStatus('selection')
              setError('')
            }}
            className="flex-1 px-6 py-3 rounded-lg font-semibold border transition-colors"
            style={{
              color: COLORS.text.primary,
              borderColor: COLORS.border.light,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = COLORS.bg.secondary)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Back
          </button>
          <button
            onClick={handleJoinInterview}
            disabled={loading || !currentUser}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: COLORS.text.primary,
              color: COLORS.bg.surface,
              opacity: loading || !currentUser ? 0.6 : 1,
              boxShadow: SHADOWS.sm,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = SHADOWS.md)}
            onMouseLeave={e => !loading && (e.currentTarget.style.boxShadow = SHADOWS.sm)}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Join Interview'
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Waiting Screen
  const WaitingScreen = () => (
    <div
      className="border rounded-lg p-8 max-w-2xl mx-auto text-center"
      style={{
        backgroundColor: COLORS.bg.surface,
        borderColor: COLORS.border.light,
        boxShadow: SHADOWS.sm,
      }}
    >
      <div className="flex justify-center mb-6">
        <div className="relative w-20 h-20">
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: `conic-gradient(${COLORS.text.primary}, ${COLORS.bg.secondary}, ${COLORS.text.primary})`,
            }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{ backgroundColor: COLORS.bg.surface }}
          />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
        Connecting with Interviewer
      </h3>

      <p className="mb-6" style={{ color: COLORS.text.secondary }}>
        Please wait while we find a professional interviewer for your session...
      </p>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bg.secondary }}>
          <div className="text-sm" style={{ color: COLORS.text.secondary }}>
            Topic
          </div>
          <div className="font-bold text-lg" style={{ color: COLORS.text.primary }}>
            {formData.topic}
          </div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bg.secondary }}>
          <div className="text-sm" style={{ color: COLORS.text.secondary }}>
            Difficulty
          </div>
          <div className="font-bold text-lg" style={{ color: COLORS.text.primary }}>
            {formData.difficulty}
          </div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bg.secondary }}>
          <div className="text-sm" style={{ color: COLORS.text.secondary }}>
            Duration
          </div>
          <div className="font-bold text-lg" style={{ color: COLORS.text.primary }}>
            {formData.duration} min
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
          Time remaining
        </div>
        <div
          className="text-4xl font-bold font-mono"
          style={{ color: timeLeft < 60 ? '#ef4444' : COLORS.text.primary }}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setSelectedType(null)
            setStatus('selection')
            setTimeLeft(300)
          }}
          className="flex-1 px-6 py-3 rounded-lg font-semibold border transition-colors"
          style={{
            color: COLORS.text.primary,
            borderColor: COLORS.border.light,
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = COLORS.bg.secondary)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Cancel
        </button>
      </div>
    </div>
  )

  // Timeout Screen
  const TimeoutScreen = () => (
    <div
      className="border rounded-lg p-8 max-w-2xl mx-auto text-center"
      style={{
        backgroundColor: COLORS.bg.surface,
        borderColor: '#fca5a5',
        boxShadow: SHADOWS.sm,
      }}
    >
      <div className="flex justify-center mb-6">
        <AlertCircle className="h-16 w-16" style={{ color: '#ef4444' }} />
      </div>

      <h3 className="text-2xl font-bold mb-4" style={{ color: '#dc2626' }}>
        No Interviewer Available
      </h3>

      <p className="mb-6" style={{ color: COLORS.text.secondary }}>
        Unfortunately, no interviewer was available within the 5-minute window. Please try again
        later or check back during peak hours.
      </p>

      <button
        onClick={() => {
          setSelectedType(null)
          setStatus('selection')
          setTimeLeft(300)
        }}
        className="px-6 py-3 rounded-lg font-semibold transition-all"
        style={{
          backgroundColor: COLORS.text.primary,
          color: COLORS.bg.surface,
          boxShadow: SHADOWS.sm,
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = SHADOWS.md)}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = SHADOWS.sm)}
      >
        Try Again
      </button>
    </div>
  )

  // Review Screen - User submits rating and feedback
  const ReviewScreen = () => (
    <div
      className="border rounded-lg p-8 max-w-2xl mx-auto"
      style={{
        backgroundColor: COLORS.bg.surface,
        borderColor: COLORS.border.light,
        boxShadow: SHADOWS.sm,
      }}
    >
      <h3 className="text-2xl font-bold mb-2 text-center" style={{ color: COLORS.text.primary }}>
        Interview Review
      </h3>
      <p className="text-center mb-6" style={{ color: COLORS.text.secondary }}>
        Please rate your interview experience with the interviewer
      </p>

      {/* Star Rating */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-4" style={{ color: COLORS.text.primary }}>
          How would you rate this interview?
        </label>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setReviewData({ ...reviewData, rating: star })}
              className="text-3xl transition-all hover:scale-110"
              style={{
                color: star <= reviewData.rating ? '#fbbf24' : '#d1d5db',
                cursor: 'pointer',
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Text Area */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text.primary }}>
          Additional Feedback (Optional)
        </label>
        <textarea
          value={reviewData.feedback}
          onChange={e => {
            console.log('📝 Feedback update:', e.target.value)
            setReviewData({ ...reviewData, feedback: e.target.value })
          }}
          placeholder="Tell us about your interview experience, strengths shown, areas to improve, etc."
          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
          style={{
            backgroundColor: COLORS.bg.primary,
            borderColor: COLORS.border.light,
            color: COLORS.text.primary,
            minHeight: '120px',
            fontFamily: 'inherit',
            fontSize: '14px',
          }}
          rows="4"
        />
        <div className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>
          {reviewData.feedback.length} characters
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmitReview}
          disabled={reviewSubmitting}
          className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: reviewSubmitting ? '#9ca3af' : '#10b981',
            color: '#ffffff',
            boxShadow: SHADOWS.sm,
            opacity: reviewSubmitting ? 0.6 : 1,
          }}
          onMouseEnter={e => !reviewSubmitting && (e.currentTarget.style.boxShadow = SHADOWS.md)}
          onMouseLeave={e => !reviewSubmitting && (e.currentTarget.style.boxShadow = SHADOWS.sm)}
        >
          {reviewSubmitting ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Submit Review
            </>
          )}
        </button>
        <button
          onClick={() => {
            setSelectedType(null)
            setStatus('selection')
            setTimeLeft(300)
            setReviewData({ rating: 5, feedback: '' })
          }}
          disabled={reviewSubmitting}
          className="flex-1 px-6 py-3 rounded-lg font-semibold border transition-colors"
          style={{
            color: COLORS.text.primary,
            borderColor: COLORS.border.light,
            opacity: reviewSubmitting ? 0.6 : 1,
          }}
          onMouseEnter={e => !reviewSubmitting && (e.currentTarget.style.backgroundColor = COLORS.bg.secondary)}
          onMouseLeave={e => !reviewSubmitting && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Skip
        </button>
      </div>
    </div>
  )

  // Submit review function
  const handleSubmitReview = async () => {
    try {
      setReviewSubmitting(true)
      setError('')

      const requestPayload = {
        userId: currentUser.uid,
        rating: reviewData.rating,
        feedback: reviewData.feedback,
      }

      console.log('📝 Submitting review for session:', sessionId)
      console.log('📤 Request payload:', requestPayload)

      const response = await fetch(`/api/interview/${sessionId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      console.log('📊 Response status:', response.status, response.statusText)

      const data = await response.json()
      console.log('📥 Response data:', data)

      if (!response.ok) {
        console.error('❌ Server error:', data)
        throw new Error(data.message || `Server error: ${response.status}`)
      }

      console.log('✅ Review submitted successfully to Firebase!')
      console.log('✅ Review ID:', data.reviewId)

      // Show success message and reset
      alert(`Thank you for your review! 🙏\n\nYour feedback helps us improve our interview process.\n\nReview saved with ID: ${data.reviewId}`)
      setSelectedType(null)
      setStatus('selection')
      setTimeLeft(300)
      setReviewData({ rating: 5, feedback: '' })
      setSessionId('')
    } catch (err) {
      const errorMsg = err.message || 'Error submitting review'
      console.error('❌ Review submission error:', errorMsg)
      console.error('❌ Full error:', err)
      setError(errorMsg)
      alert(`Error submitting review: ${errorMsg}`)
    } finally {
      setReviewSubmitting(false)
    }
  }

  // Ready Screen - Interviewer Accepted
  const ReadyScreen = () => (
    <div
      className="border rounded-lg p-8 max-w-2xl mx-auto text-center"
      style={{
        backgroundColor: COLORS.bg.surface,
        borderColor: COLORS.border.light,
        boxShadow: SHADOWS.sm,
      }}
    >
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16" style={{ color: '#10b981' }} />
      </div>

      <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
        Interviewer Accepted!
      </h3>

      <p className="mb-6" style={{ color: COLORS.text.secondary }}>
        The interviewer is ready to start your session. Click the button below to join the Google
        Meet call.
      </p>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bg.secondary }}>
          <div className="text-sm" style={{ color: COLORS.text.secondary }}>
            Topic
          </div>
          <div className="font-bold text-lg" style={{ color: COLORS.text.primary }}>
            {formData.topic}
          </div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bg.secondary }}>
          <div className="text-sm" style={{ color: COLORS.text.secondary }}>
            Difficulty
          </div>
          <div className="font-bold text-lg" style={{ color: COLORS.text.primary }}>
            {formData.difficulty}
          </div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bg.secondary }}>
          <div className="text-sm" style={{ color: COLORS.text.secondary }}>
            Duration
          </div>
          <div className="font-bold text-lg" style={{ color: COLORS.text.primary }}>
            {formData.duration} min
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4">
        <a
          href={meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            boxShadow: SHADOWS.sm,
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = SHADOWS.md)}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = SHADOWS.sm)}
        >
          <CheckCircle className="h-5 w-5" />
          Start Interview
        </a>
        
        <button
          onClick={() => {
            setStatus('review')
          }}
          className="px-6 py-3 rounded-lg font-semibold border transition-colors"
          style={{
            color: '#10b981',
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)')}
        >
          Complete Interview & Review
        </button>

        <button
          onClick={() => {
            setSelectedType(null)
            setStatus('selection')
            setTimeLeft(300)
          }}
          className="px-6 py-3 rounded-lg font-semibold border transition-colors"
          style={{
            color: COLORS.text.primary,
            borderColor: COLORS.border.light,
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = COLORS.bg.secondary)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: COLORS.bg.primary, minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="py-16" style={{ backgroundColor: COLORS.bg.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              style={{ color: COLORS.text.primary }}
            >
              Mock Interview Practice
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto"
              style={{ color: COLORS.text.secondary }}
            >
              Build confidence and improve your interview performance with expert guidance
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16" style={{ backgroundColor: COLORS.bg.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {status === 'selection' && (
            <>
              <div className="text-center mb-12">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-4"
                  style={{ color: COLORS.text.primary }}
                >
                  Choose Your Interview Type
                </h2>
                <p style={{ color: COLORS.text.secondary }}>
                  Select how you want to practice your interview skills
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <AIInterviewCard />
                <HumanInterviewCard />
              </div>
            </>
          )}

          {status === 'form' && selectedType === 'human' && <InterviewForm />}

          {status === 'waiting' && <WaitingScreen />}

          {status === 'ready' && <ReadyScreen />}

          {status === 'review' && <ReviewScreen />}

          {status === 'timeout' && <TimeoutScreen />}
        </div>
      </div>

      {/* Info Section */}
      {status === 'selection' && (
        <div className="py-16" style={{ backgroundColor: COLORS.bg.surface }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-4" style={{ color: COLORS.text.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                  Flexible Scheduling
                </h3>
                <p style={{ color: COLORS.text.secondary }}>
                  Book interviews at your convenience with time slots from 15 to 45 minutes
                </p>
              </div>
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-4" style={{ color: COLORS.text.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                  Real Feedback
                </h3>
                <p style={{ color: COLORS.text.secondary }}>
                  Get actionable feedback from professional interviewers to improve your performance
                </p>
              </div>
              <div className="text-center">
                <CheckCircle
                  className="h-8 w-8 mx-auto mb-4"
                  style={{ color: COLORS.text.primary }}
                />
                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                  Multiple Topics
                </h3>
                <p style={{ color: COLORS.text.secondary }}>
                  Practice across DSA, System Design, HR rounds, and more
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Interview

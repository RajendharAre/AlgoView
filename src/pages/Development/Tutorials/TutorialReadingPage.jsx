import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import {
  FaArrowLeft,
  FaClock,
  FaStar,
  FaCrown,
  FaStickyNote,
  FaPaperPlane,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaComment,
  FaLightbulb,
  FaBug,
  FaUser,
  FaBookOpen,
  FaCheckCircle,
  FaEye,
} from 'react-icons/fa'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Timestamp,
  increment,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { sampleTutorials } from '@/utils/sampleData'
import TutorialMarkdown from './TutorialMarkdown'

const COLORS = {
  bg: { primary: '#f8f9fa', secondary: '#e9ecef', tertiary: '#dee2e6', dark: '#343a40' },
  text: {
    primary: '#212529',
    secondary: '#495057',
    tertiary: '#6c757d',
    muted: '#adb5bd',
    light: '#f8f9fa',
  },
  border: { light: '#dee2e6', medium: '#ced4da' },
  star: '#f59e0b',
}

const FEEDBACK_TYPES = {
  feedback: { label: 'Feedback', icon: FaComment, bg: '#e9ecef', color: '#495057' },
  improvement: { label: 'Improvement', icon: FaLightbulb, bg: '#dbeafe', color: '#1e40af' },
  bug: { label: 'Bug Report', icon: FaBug, bg: '#fee2e2', color: '#991b1b' },
}

const CATEGORY_COLORS = {
  Web: { bg: '#dbeafe', text: '#1e40af' },
  DevOps: { bg: '#d1fae5', text: '#065f46' },
  Cloud: { bg: '#ede9fe', text: '#5b21b6' },
  AI: { bg: '#fef3c7', text: '#92400e' },
}

const DIFFICULTY_COLORS = {
  Beginner: { bg: '#d1fae5', text: '#065f46' },
  Intermediate: { bg: '#fef3c7', text: '#92400e' },
  Advanced: { bg: '#fee2e2', text: '#991b1b' },
}

// ─── Star Rating Input ──────────────────────────────────────────────────
function StarRatingInput({ rating, onRate, size = 24, readonly = false }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => !readonly && onRate(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: readonly ? 'default' : 'pointer',
            padding: 2,
          }}
        >
          <FaStar
            size={size}
            style={{
              color: (hovered || rating) >= star ? COLORS.star : COLORS.border.light,
              transition: 'color 0.15s, transform 0.15s',
              transform: !readonly && hovered === star ? 'scale(1.15)' : 'scale(1)',
            }}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Reading Progress Bar ───────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        background: COLORS.bg.tertiary,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: COLORS.bg.dark,
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  )
}

// ─── Rating Section ─────────────────────────────────────────────────────
function RatingSection({ tutorialId, defaultRating, defaultRatingCount }) {
  const { currentUser } = useSelector(state => state.user)
  const [avgRating, setAvgRating] = useState(defaultRating)
  const [totalRatings, setTotalRatings] = useState(defaultRatingCount)
  const [userRating, setUserRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Real-time listener for rating aggregates
  useEffect(() => {
    const ratingDocRef = doc(db, 'tutorialRatings', tutorialId)
    const unsubscribe = onSnapshot(
      ratingDocRef,
      snap => {
        if (snap.exists()) {
          const data = snap.data()
          setAvgRating(data.averageRating ?? defaultRating)
          setTotalRatings(data.totalRatings ?? defaultRatingCount)
        }
      },
      err => {
        console.error('[RatingSection] onSnapshot error:', err.code, err.message)
      }
    )
    return () => unsubscribe()
  }, [tutorialId, defaultRating, defaultRatingCount])

  // Check if user already rated
  useEffect(() => {
    if (!currentUser?.uid) return
    const userRatingRef = doc(db, 'tutorialRatings', tutorialId, 'userRatings', currentUser.uid)
    getDoc(userRatingRef)
      .then(snap => {
        if (snap.exists()) {
          setUserRating(snap.data().rating)
          setHasRated(true)
        }
      })
      .catch(err => console.error('[RatingSection] getDoc error:', err.code))
  }, [tutorialId, currentUser])

  const handleRate = useCallback(
    async stars => {
      if (!currentUser?.uid || submitting) return
      setSubmitting(true)
      setUserRating(stars)

      try {
        const ratingDocRef = doc(db, 'tutorialRatings', tutorialId)
        const userRatingRef = doc(db, 'tutorialRatings', tutorialId, 'userRatings', currentUser.uid)

        // Atomic transaction — prevents race conditions between users
        await runTransaction(db, async transaction => {
          const ratingSnap = await transaction.get(ratingDocRef)
          let newTotal, newSum

          if (ratingSnap.exists()) {
            const data = ratingSnap.data()
            if (hasRated) {
              const oldUserSnap = await transaction.get(userRatingRef)
              const oldRating = oldUserSnap.exists() ? oldUserSnap.data().rating : 0
              newSum = (data.sumRatings || 0) - oldRating + stars
              newTotal = data.totalRatings || 1
            } else {
              newSum = (data.sumRatings || 0) + stars
              newTotal = (data.totalRatings || 0) + 1
            }
          } else {
            newSum = defaultRating * defaultRatingCount + stars
            newTotal = defaultRatingCount + 1
          }

          const newAvg = Math.round((newSum / newTotal) * 10) / 10
          transaction.set(
            ratingDocRef,
            { averageRating: newAvg, totalRatings: newTotal, sumRatings: newSum },
            { merge: true }
          )
          transaction.set(userRatingRef, {
            rating: stars,
            userId: currentUser.uid,
            updatedAt: Timestamp.now(),
          })
        })

        setHasRated(true)
      } catch (err) {
        console.error('[RatingSection] transaction error:', err.code, err.message)
      }
      setSubmitting(false)
    },
    [currentUser, tutorialId, hasRated, submitting, defaultRating, defaultRatingCount]
  )

  return (
    <div
      style={{
        background: COLORS.bg.primary,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: 10,
        padding: 20,
      }}
    >
      <h3
        style={{
          color: COLORS.text.primary,
          fontWeight: 700,
          fontSize: 15,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <FaStar size={14} color={COLORS.star} /> Course Rating
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.text.primary, lineHeight: 1 }}>
            {avgRating}
          </div>
          <div style={{ fontSize: 11, color: COLORS.text.muted, marginTop: 2 }}>out of 5</div>
        </div>
        <div style={{ flex: 1 }}>
          <StarRatingInput rating={Math.round(avgRating)} onRate={() => {}} readonly size={18} />
          <div
            style={{
              marginTop: 6,
              height: 6,
              background: COLORS.bg.tertiary,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${((avgRating / 5) * 100).toFixed(0)}%`,
                background: COLORS.star,
                borderRadius: 3,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: COLORS.text.tertiary, marginTop: 4 }}>
            {totalRatings} total ratings
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${COLORS.border.light}`, paddingTop: 14 }}>
        <p style={{ fontSize: 13, color: COLORS.text.secondary, marginBottom: 8, fontWeight: 500 }}>
          {hasRated ? 'Your rating (click to update):' : 'Rate this tutorial:'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StarRatingInput rating={userRating} onRate={handleRate} size={26} />
          {hasRated && <FaCheckCircle size={14} color="#065f46" />}
        </div>
        {!currentUser && (
          <p style={{ fontSize: 12, color: COLORS.text.muted, marginTop: 8 }}>
            Sign in to rate this tutorial
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Feedback Section ───────────────────────────────────────────────────
function FeedbackSection({ tutorialId }) {
  const { currentUser } = useSelector(state => state.user)
  const [feedbacks, setFeedbacks] = useState([])
  const [text, setText] = useState('')
  const [type, setType] = useState('feedback')
  const [submitting, setSubmitting] = useState(false)
  const [expanded, setExpanded] = useState(true)

  // Real-time feedback listener — same pattern as Ideas comments
  useEffect(() => {
    const feedbacksCol = collection(db, 'tutorialFeedbacks', tutorialId, 'items')
    const q = query(feedbacksCol, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const items = []
        snapshot.forEach(d => {
          items.push({ id: d.id, ...d.data() })
        })
        setFeedbacks(items)
      },
      error => {
        console.error('Error fetching feedbacks:', error)
      }
    )
    return () => unsubscribe()
  }, [tutorialId])

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      const trimmed = text.trim()
      if (!trimmed || !currentUser?.uid || submitting) return
      setSubmitting(true)
      setText('')

      try {
        const feedbacksCol = collection(db, 'tutorialFeedbacks', tutorialId, 'items')
        await addDoc(feedbacksCol, {
          text: trimmed,
          type,
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
          createdAt: serverTimestamp(),
        })
      } catch (err) {
        console.error('Error submitting feedback:', err)
        setText(trimmed)
      }
      setSubmitting(false)
    },
    [text, type, currentUser, tutorialId, submitting]
  )

  return (
    <div
      style={{
        background: COLORS.bg.primary,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: 10,
        padding: 20,
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          justifyContent: 'space-between',
          padding: 0,
        }}
      >
        <h3
          style={{
            color: COLORS.text.primary,
            fontWeight: 700,
            fontSize: 15,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FaComment size={14} color={COLORS.text.tertiary} /> Feedback & Improvements
          {feedbacks.length > 0 && (
            <span style={{ fontSize: 11, color: COLORS.text.muted, fontWeight: 500 }}>
              ({feedbacks.length})
            </span>
          )}
        </h3>
        {expanded ? (
          <FaChevronUp size={12} color={COLORS.text.muted} />
        ) : (
          <FaChevronDown size={12} color={COLORS.text.muted} />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {currentUser ? (
              <form onSubmit={handleSubmit} style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {Object.entries(FEEDBACK_TYPES).map(([key, { label, icon: Icon, bg, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        border:
                          type === key
                            ? `1.5px solid ${color}`
                            : `1px solid ${COLORS.border.light}`,
                        background: type === key ? bg : COLORS.bg.primary,
                        color: type === key ? color : COLORS.text.tertiary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Icon size={10} /> {label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    rows={3}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border.light}`,
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      fontSize: 13,
                      color: COLORS.text.primary,
                      background: COLORS.bg.secondary,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!text.trim() || submitting}
                    style={{
                      padding: '0 14px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: text.trim() ? 'pointer' : 'not-allowed',
                      background: text.trim() ? COLORS.bg.dark : COLORS.bg.tertiary,
                      color: COLORS.text.light,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <FaPaperPlane size={12} />
                  </button>
                </div>
              </form>
            ) : (
              <p style={{ color: COLORS.text.muted, fontSize: 13, marginTop: 14 }}>
                Sign in to share feedback
              </p>
            )}

            {feedbacks.length > 0 && (
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {feedbacks.map(fb => {
                  const fbType = FEEDBACK_TYPES[fb.type] || FEEDBACK_TYPES.feedback
                  const FbIcon = fbType.icon
                  return (
                    <div
                      key={fb.id}
                      style={{ background: COLORS.bg.secondary, borderRadius: 8, padding: 10 }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: COLORS.text.primary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <FaUser size={9} color={COLORS.text.muted} /> {fb.userName}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: fbType.bg,
                            color: fbType.color,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <FbIcon size={8} /> {fb.type}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: COLORS.text.secondary,
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {fb.text}
                      </p>
                      {fb.createdAt?.seconds && (
                        <span
                          style={{
                            fontSize: 10,
                            color: COLORS.text.muted,
                            marginTop: 4,
                            display: 'block',
                          }}
                        >
                          {new Date(fb.createdAt.seconds * 1000).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Notes Section (localStorage) ───────────────────────────────────────
function NotesSection({ tutorialId }) {
  const storageKey = `tutorialNotes_${tutorialId}`
  const [notes, setNotes] = useState(() => localStorage.getItem(storageKey) || '')
  const [saved, setSaved] = useState(true)

  const handleChange = e => {
    setNotes(e.target.value)
    setSaved(false)
  }
  const handleSave = () => {
    localStorage.setItem(storageKey, notes)
    setSaved(true)
  }
  const handleClear = () => {
    setNotes('')
    localStorage.removeItem(storageKey)
    setSaved(true)
  }

  return (
    <div
      style={{
        background: COLORS.bg.primary,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: 10,
        padding: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <h3
          style={{
            color: COLORS.text.primary,
            fontWeight: 700,
            fontSize: 15,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FaStickyNote size={13} color={COLORS.text.tertiary} /> My Notes
        </h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {!saved && (
            <span style={{ fontSize: 10, color: COLORS.star, fontWeight: 600 }}>Unsaved</span>
          )}
          <button
            onClick={handleSave}
            style={{
              padding: '3px 10px',
              fontSize: 11,
              borderRadius: 5,
              border: `1px solid ${COLORS.border.light}`,
              background: saved ? COLORS.bg.secondary : COLORS.bg.dark,
              color: saved ? COLORS.text.tertiary : COLORS.text.light,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
          {notes && (
            <button
              onClick={handleClear}
              style={{
                padding: '3px 7px',
                fontSize: 11,
                borderRadius: 5,
                border: `1px solid ${COLORS.border.light}`,
                background: COLORS.bg.secondary,
                color: COLORS.text.tertiary,
                cursor: 'pointer',
              }}
            >
              <FaTrash size={9} />
            </button>
          )}
        </div>
      </div>
      <textarea
        value={notes}
        onChange={handleChange}
        onBlur={() => {
          if (!saved) handleSave()
        }}
        placeholder="Key concepts, code snippets, things to remember..."
        rows={5}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 8,
          border: `1px solid ${COLORS.border.light}`,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 12,
          lineHeight: 1.6,
          color: COLORS.text.primary,
          background: COLORS.bg.secondary,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

// ─── Table of Contents ──────────────────────────────────────────────────
function TableOfContents({ content }) {
  const headings = useMemo(() => {
    if (!content) return []
    return content
      .split('\n')
      .filter(line => /^#{2,3}\s/.test(line))
      .map((line, i) => {
        const level = line.startsWith('###') ? 3 : 2
        const text = line.replace(/^#{2,3}\s+/, '').trim()
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        return { id, text, level, index: i }
      })
  }, [content])

  if (headings.length < 3) return null

  const scrollTo = id => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      style={{
        background: COLORS.bg.primary,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: 10,
        padding: 20,
      }}
    >
      <h3
        style={{
          color: COLORS.text.primary,
          fontWeight: 700,
          fontSize: 15,
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <FaBookOpen size={13} color={COLORS.text.tertiary} /> Contents
      </h3>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {headings.map((h, i) => (
          <button
            key={i}
            onClick={() => scrollTo(h.id)}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              padding: '4px 0',
              paddingLeft: h.level === 3 ? 14 : 0,
              fontSize: h.level === 2 ? 13 : 12,
              fontWeight: h.level === 2 ? 600 : 400,
              color: h.level === 2 ? COLORS.text.secondary : COLORS.text.tertiary,
              lineHeight: 1.4,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => {
              e.target.style.color = COLORS.text.primary
            }}
            onMouseLeave={e => {
              e.target.style.color = h.level === 2 ? COLORS.text.secondary : COLORS.text.tertiary
            }}
          >
            {h.text}
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── Main Tutorial Reading Page ─────────────────────────────────────────
export default function TutorialReadingPage() {
  const { tutorialId } = useParams()
  const navigate = useNavigate()
  const tutorial = sampleTutorials.find(t => t.id === tutorialId)
  const [viewCount, setViewCount] = useState(0)

  // Increment view count on mount & listen for real-time updates
  useEffect(() => {
    if (!tutorialId) return
    const statsRef = doc(db, 'tutorialStats', tutorialId)

    // Increment once per page visit
    setDoc(statsRef, { viewCount: increment(1) }, { merge: true }).catch(err =>
      console.error('Error incrementing views:', err)
    )

    // Real-time listener for view count
    const unsub = onSnapshot(
      statsRef,
      snap => {
        if (snap.exists()) {
          setViewCount(snap.data().viewCount || 0)
        }
      },
      err => console.error('Error listening to views:', err)
    )
    return () => unsub()
  }, [tutorialId])

  if (!tutorial) {
    return (
      <div
        style={{
          background: COLORS.bg.primary,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h2 style={{ color: COLORS.text.primary, fontWeight: 700 }}>Tutorial Not Found</h2>
        <p style={{ color: COLORS.text.tertiary, fontSize: 14 }}>
          The tutorial you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('/development/tutorials')}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: COLORS.bg.dark,
            color: COLORS.text.light,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Back to Tutorials
        </button>
      </div>
    )
  }

  const catColor = CATEGORY_COLORS[tutorial.category] || {
    bg: COLORS.bg.tertiary,
    text: COLORS.text.secondary,
  }
  const diffColor = DIFFICULTY_COLORS[tutorial.difficulty] || {
    bg: COLORS.bg.tertiary,
    text: COLORS.text.secondary,
  }
  const contentToRender = tutorial.fullContent || tutorial.content

  return (
    <div style={{ background: COLORS.bg.secondary, minHeight: '100vh' }}>
      <ReadingProgress />

      {/* Header */}
      <div
        style={{ background: COLORS.bg.primary, borderBottom: `1px solid ${COLORS.border.light}` }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px' }}>
          <button
            onClick={() => navigate('/development/tutorials')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: COLORS.bg.secondary,
              border: `1px solid ${COLORS.border.light}`,
              padding: '7px 14px',
              borderRadius: 7,
              cursor: 'pointer',
              color: COLORS.text.secondary,
              fontWeight: 600,
              fontSize: 13,
              marginBottom: 16,
              transition: 'all 0.15s',
            }}
          >
            <FaArrowLeft size={11} /> Back to Tutorials
          </button>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span
              style={{
                background: catColor.bg,
                color: catColor.text,
                padding: '3px 10px',
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              {tutorial.category}
            </span>
            <span
              style={{
                background: diffColor.bg,
                color: diffColor.text,
                padding: '3px 10px',
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {tutorial.difficulty}
            </span>
            {tutorial.isPremium && (
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '3px 10px',
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <FaCrown size={9} color="#d97706" /> Premium
              </span>
            )}
          </div>

          <h1
            style={{
              color: COLORS.text.primary,
              fontSize: 26,
              fontWeight: 800,
              margin: '0 0 6px',
              lineHeight: 1.25,
            }}
          >
            {tutorial.title}
          </h1>
          <p
            style={{
              color: COLORS.text.secondary,
              fontSize: 14,
              margin: '0 0 10px',
              maxWidth: 680,
              lineHeight: 1.5,
            }}
          >
            {tutorial.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
              fontSize: 13,
            }}
          >
            <span
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: COLORS.text.tertiary }}
            >
              <FaClock size={12} /> {tutorial.duration} min read
            </span>
            <span style={{ color: COLORS.text.tertiary }}>
              By{' '}
              <strong style={{ color: COLORS.text.primary, fontWeight: 600 }}>
                {tutorial.author}
              </strong>
            </span>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 3, color: COLORS.text.tertiary }}
            >
              <FaStar size={12} color={COLORS.star} />
              <strong style={{ color: COLORS.text.primary, fontWeight: 600 }}>
                {tutorial.rating}
              </strong>
              <span>({tutorial.ratingCount})</span>
            </div>
            <span
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: COLORS.text.tertiary }}
            >
              <FaEye size={12} /> {viewCount} views
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div
        className="tutorial-content-grid"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}
      >
        <main className="tutorial-main">
          <div
            style={{
              background: COLORS.bg.primary,
              border: `1px solid ${COLORS.border.light}`,
              borderRadius: 10,
              padding: '28px 32px',
            }}
          >
            <TutorialMarkdown content={contentToRender} />
          </div>
        </main>

        <aside className="tutorial-sidebar">
          <TableOfContents content={contentToRender} />
          <RatingSection
            tutorialId={tutorial.id}
            defaultRating={tutorial.rating}
            defaultRatingCount={tutorial.ratingCount}
          />
          <NotesSection tutorialId={tutorial.id} />
          <FeedbackSection tutorialId={tutorial.id} />
        </aside>
      </div>

      <style>{`
        .tutorial-content-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }
        .tutorial-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 20px;
        }
        @media (max-width: 960px) {
          .tutorial-content-grid {
            grid-template-columns: 1fr !important;
          }
          .tutorial-sidebar {
            position: static !important;
          }
        }
      `}</style>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db, auth } from '../../lib/firebase'
import { FaTimes, FaWrench, FaBullhorn, FaStar } from 'react-icons/fa'

const NotificationBanner = () => {
  const [allNotifications, setAllNotifications] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const unsubscribesRef = useRef([])

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUserId(user?.uid || null)
    })
    return () => unsubscribe()
  }, [])

  // Fetch both global important notifications AND user-specific important notifications
  useEffect(() => {
    if (!userId) {
      setAllNotifications([])
      setLoading(false)
      unsubscribesRef.current.forEach(unsub => unsub())
      unsubscribesRef.current = []
      return
    }

    try {
      setLoading(true)
      const combinedNotifications = []
      let globalLoaded = false
      let userLoaded = false

      // Cleanup previous listeners
      unsubscribesRef.current.forEach(unsub => unsub())
      unsubscribesRef.current = []

      // 1. Listen to GLOBAL important notifications (maintenance, announcements)
      const globalQuery = query(
        collection(db, 'notifications'),
        where('active', '==', true),
        where('type', 'in', ['maintenance', 'announcement'])
      )

      const unsubGlobal = onSnapshot(
        globalQuery,
        snapshot => {
          const globalNotifs = snapshot.docs.map(doc => ({
            id: `global_${doc.id}`,
            originalId: doc.id,
            ...doc.data(),
            source: 'global',
          }))

          const filtered = combinedNotifications.filter(n => n.source !== 'global')
          filtered.push(...globalNotifs)
          combinedNotifications.length = 0
          combinedNotifications.push(...filtered)

          globalLoaded = true
          updateNotifications(combinedNotifications)
          if (userLoaded) setLoading(false)
        },
        error => {
          console.error('Error fetching global important notifications:', error)
          globalLoaded = true
          if (userLoaded) setLoading(false)
        }
      )
      unsubscribesRef.current.push(unsubGlobal)

      // 2. Listen to USER-SPECIFIC important notifications (high priority, etc)
      const userNotifRef = collection(db, 'users', userId, 'notifications')
      const userQuery = query(
        userNotifRef,
        where('status', '!=', 'deleted'),
        where('priority', '==', 'high')
      )

      const unsubUser = onSnapshot(
        userQuery,
        snapshot => {
          const userNotifs = snapshot.docs.map(doc => ({
            id: `user_${doc.id}`,
            originalId: doc.id,
            ...doc.data(),
            source: 'user',
          }))

          const filtered = combinedNotifications.filter(n => n.source !== 'user')
          filtered.push(...userNotifs)
          combinedNotifications.length = 0
          combinedNotifications.push(...filtered)

          userLoaded = true
          updateNotifications(combinedNotifications)
          if (globalLoaded) setLoading(false)
        },
        error => {
          console.error('Error fetching user important notifications:', error)
          userLoaded = true
          if (globalLoaded) setLoading(false)
        }
      )
      unsubscribesRef.current.push(unsubUser)

      function updateNotifications(notifications) {
        // Sort: maintenance > announcement > others, then by date
        const sorted = notifications.sort((a, b) => {
          const typeOrder = { maintenance: 0, announcement: 1 }
          const aOrder = typeOrder[a.type] || 2
          const bOrder = typeOrder[b.type] || 2

          if (aOrder !== bOrder) return aOrder - bOrder

          const dateA = a.createdAt?.toMillis?.() || 0
          const dateB = b.createdAt?.toMillis?.() || 0
          return dateB - dateA
        })

        setAllNotifications(sorted)
        setCurrentIndex(0)
      }

      return () => {
        unsubscribesRef.current.forEach(unsub => unsub())
        unsubscribesRef.current = []
      }
    } catch (error) {
      console.error('Setup error:', error)
      setLoading(false)
    }
  }, [userId])

  // Mark notification as deleted (soft delete)
  const handleClose = async notificationId => {
    if (!userId) return

    try {
      const notification = allNotifications.find(n => n.id === notificationId)
      if (!notification) return

      if (notification.source === 'user') {
        // User-specific notification
        const notifRef = doc(db, 'users', userId, 'notifications', notification.originalId)
        await updateDoc(notifRef, { status: 'deleted' })
      } else if (notification.source === 'global') {
        // For global notifications, we'd need to track per-user dismissal
        // For now, just move to next
      }
    } catch (error) {
      console.error('Error closing notification:', error)
    }
  }

  // Don't show banner if user not logged in or no notifications
  if (!userId) {
    return null
  }

  const visibleNotifications = allNotifications.filter(n => {
    if (n.source === 'global') return n.active === true
    if (n.source === 'user') return n.status !== 'deleted'
    return true
  })

  if (visibleNotifications.length === 0) return null

  const notification = visibleNotifications[currentIndex]
  if (!notification) return null

  // Get icon and color based on type
  const typeConfig = {
    maintenance: {
      Icon: FaWrench,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-900',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    announcement: {
      Icon: FaBullhorn,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    update: {
      Icon: FaStar,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  }

  const config = typeConfig[notification.type] || typeConfig.announcement
  const IconComponent = config.Icon
  const isGlobal = notification.source === 'global'

  return (
    <div
      className={`${config.bgColor} border-b-2 ${config.borderColor} ${config.textColor} px-4 py-3 shadow-md`}
    >
      <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
        {/* Left: Icon + Content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="text-2xl flex-shrink-0">
            <IconComponent size={24} />
          </div>
          <div className="flex-1 min-w-0">
            {/* Title with Badge */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-lg">{notification.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${config.badgeColor} whitespace-nowrap`}
              >
                {notification.type.toUpperCase()} • {notification.priority?.toUpperCase()}
              </span>
              {isGlobal && (
                <span className="text-xs bg-opacity-40 bg-black px-2 py-1 rounded-full font-semibold whitespace-nowrap flex items-center gap-1">
                  <FaBell size={10} /> For All Users
                </span>
              )}
            </div>
            {/* Message */}
            <p className="text-sm line-clamp-2">{notification.message}</p>
            {/* Content preview if exists */}
            {notification.content && (
              <p className="text-xs mt-1 opacity-75 line-clamp-1">{notification.content}</p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Navigation dots */}
          {visibleNotifications.length > 1 && (
            <div className="flex gap-1">
              {visibleNotifications.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === currentIndex ? 'bg-current' : 'bg-current opacity-30'
                  }`}
                  title={`Notification ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Close Button - PROMINENT */}
          <button
            onClick={() => handleClose(notification.id)}
            className="p-2 hover:bg-black hover:bg-opacity-10 hover:scale-110 rounded-md transition-all duration-200 flex-shrink-0 cursor-pointer group"
            title="Close notification"
            aria-label="Close notification"
          >
            <FaTimes size={18} className="group-hover:scale-125 transition-transform" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>

      {/* Navigation - only show if multiple notifications */}
      {visibleNotifications.length > 1 && (
        <div className="mt-2 flex justify-center gap-2 text-xs opacity-75">
          <span>
            Notification {currentIndex + 1} of {visibleNotifications.length}
          </span>
        </div>
      )}
    </div>
  )
}

export default NotificationBanner

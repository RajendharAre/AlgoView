import { useState, useEffect, useRef } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  writeBatch,
  getDocs,
} from 'firebase/firestore'
import { db, auth } from '../../lib/firebase'
import { FaBell, FaTimes, FaEnvelope, FaStar, FaTag, FaGift, FaUser, FaCheck } from 'react-icons/fa'

const NotificationBell = () => {
  const [allNotifications, setAllNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const unsubscribesRef = useRef([])

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUserId(user?.uid || null)
    })
    return () => unsubscribe()
  }, [])

  // Fetch both global casual notifications AND user-specific notifications
  useEffect(() => {
    if (!userId) {
      setAllNotifications([])
      setUnreadCount(0)
      setLoading(false)
      // Unsubscribe all listeners
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

      // 1. Listen to GLOBAL casual notifications (updates, discounts, offers)
      const globalQuery = query(
        collection(db, 'notifications'),
        where('active', '==', true),
        where('type', 'in', ['update', 'discount', 'offer'])
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

          // Update combined list
          const filtered = combinedNotifications.filter(n => n.source !== 'global')
          filtered.push(...globalNotifs)
          combinedNotifications.length = 0
          combinedNotifications.push(...filtered)

          globalLoaded = true
          updateNotifications(combinedNotifications)
          if (userLoaded) setLoading(false)
        },
        error => {
          console.error('Error fetching global notifications:', error)
          globalLoaded = true
          if (userLoaded) setLoading(false)
        }
      )
      unsubscribesRef.current.push(unsubGlobal)

      // 2. Listen to USER-SPECIFIC casual notifications (welcome, completion, user messages)
      const userNotifRef = collection(db, 'users', userId, 'notifications')
      const userQuery = query(
        userNotifRef,
        where('status', '!=', 'deleted'),
        where('type', 'in', ['update', 'discount', 'welcome', 'completion', 'offer'])
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

          // Update combined list
          const filtered = combinedNotifications.filter(n => n.source !== 'user')
          filtered.push(...userNotifs)
          combinedNotifications.length = 0
          combinedNotifications.push(...filtered)

          userLoaded = true
          updateNotifications(combinedNotifications)
          if (globalLoaded) setLoading(false)
        },
        error => {
          console.error('Error fetching user notifications:', error)
          userLoaded = true
          if (globalLoaded) setLoading(false)
        }
      )
      unsubscribesRef.current.push(unsubUser)

      function updateNotifications(notifications) {
        // Sort: global first, then by date
        const sorted = notifications.sort((a, b) => {
          if (a.source !== b.source) return a.source === 'global' ? -1 : 1
          const dateA = a.createdAt?.toMillis?.() || 0
          const dateB = b.createdAt?.toMillis?.() || 0
          return dateB - dateA
        })

        setAllNotifications(sorted)
        // Count unread: only user-specific with status === "unread"
        const unreadCount = sorted.filter(
          n => n.source !== 'global' && n.status === 'unread'
        ).length
        setUnreadCount(unreadCount)
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

  // Dismiss user-specific notification (soft delete)
  const handleDismiss = async notificationId => {
    if (!userId) return

    try {
      const notification = allNotifications.find(n => n.id === notificationId)
      if (!notification || notification.source === 'global') return // Can't dismiss global

      const notifRef = doc(db, 'users', userId, 'notifications', notification.originalId)
      await updateDoc(notifRef, { status: 'deleted' })
    } catch (error) {
      console.error('Error dismissing notification:', error)
    }
  }

  // Clear all user-specific notifications (soft delete all)
  const handleDismissAll = async () => {
    if (!userId) return

    try {
      const userNotifs = allNotifications.filter(n => n.source === 'user')
      if (userNotifs.length === 0) return

      const batch = writeBatch(db)

      userNotifs.forEach(notification => {
        const notifRef = doc(db, 'users', userId, 'notifications', notification.originalId)
        batch.update(notifRef, { status: 'deleted' })
      })

      await batch.commit()
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  // Type icons and colors mapping
  const typeConfig = {
    update: { Icon: FaStar, badge: 'bg-purple-100 text-purple-800', border: 'border-purple-200' },
    discount: { Icon: FaTag, badge: 'bg-green-100 text-green-800', border: 'border-green-200' },
    offer: { Icon: FaGift, badge: 'bg-pink-100 text-pink-800', border: 'border-pink-200' },
    welcome: { Icon: FaUser, badge: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
    completion: {
      Icon: FaCheck,
      badge: 'bg-emerald-100 text-emerald-800',
      border: 'border-emerald-200',
    },
    announcement: { Icon: FaBell, badge: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
  }

  // Don't show bell if user not logged in
  if (!userId) {
    return null
  }

  const visibleNotifications = allNotifications.filter(n => {
    if (n.source === 'global') return n.active === true
    if (n.source === 'user') return n.status !== 'deleted'
    return true
  })

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        title="Notifications"
        aria-label="Notifications"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-blue-600" size={18} />
              <div>
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-600">
                  {loading
                    ? 'Loading...'
                    : unreadCount === 0
                      ? 'All caught up!'
                      : `${unreadCount} new notification${unreadCount !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            {unreadCount > 0 && !loading && (
              <button
                onClick={handleDismissAll}
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition"
                title="Clear all user notifications"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <div className="text-gray-400">Loading notifications...</div>
              </div>
            ) : visibleNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-3xl mb-2">
                  <FaEnvelope className="mx-auto text-gray-300" size={40} />
                </div>
                <p className="text-gray-600">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {visibleNotifications.map(notification => {
                  const config = typeConfig[notification.type] || typeConfig.announcement
                  const IconComponent = config.Icon
                  const isGlobal = notification.source === 'global'

                  return (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 transition border-l-4 ${config.border}`}
                    >
                      {/* Title with Close Button (only for user notifications) */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <IconComponent size={16} className="flex-shrink-0" />
                          <h4 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                            {notification.title}
                          </h4>
                        </div>
                        {!isGlobal && (
                          <button
                            onClick={() => handleDismiss(notification.id)}
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-1 rounded transition-all duration-150 flex-shrink-0 hover:scale-110 group"
                            title="Close notification"
                            aria-label={`Close ${notification.title}`}
                          >
                            <FaTimes
                              size={14}
                              className="group-hover:scale-125 transition-transform"
                            />
                            <span className="sr-only">Close</span>
                          </button>
                        )}
                      </div>

                      {/* Message */}
                      <p className="text-gray-700 text-xs line-clamp-2 mb-2">
                        {notification.message}
                      </p>

                      {/* Type badge and source indicator */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${config.badge}`}
                        >
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                        {isGlobal && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                            <FaBell size={10} /> For All
                          </span>
                        )}
                        {!isGlobal && notification.status === 'unread' && (
                          <span className="text-xs text-red-500 font-semibold">● NEW</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {visibleNotifications.length > 0 && (
            <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* Close on outside click */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

export default NotificationBell

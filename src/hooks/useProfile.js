import { useState, useEffect } from 'react'
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Real-time listener for profile data
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const profileRef = doc(db, 'users', userId)
    
    const unsubscribe = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile({
            id: docSnap.id,
            ...docSnap.data()
          })
        } else {
          // Initialize profile document if it doesn't exist
          const initialProfile = {
            displayName: '',
            email: '',
            bio: '',
            location: '',
            alternateEmail: '',
            mobileNumber: '',
            skills: [],
            socialLinks: {
              leetcode: '',
              hackerrank: '',
              linkedin: '',
              twitter: ''
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }
          setProfile(initialProfile)
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId])

  // Save profile data to Firestore
  const saveProfile = async (profileData) => {
    if (!userId) return

    try {
      const profileRef = doc(db, 'users', userId)
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp()
      }
      
      await setDoc(profileRef, updateData, { merge: true })
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  // Extract LeetCode username from URL
  const getLeetCodeUsername = () => {
    if (!profile?.socialLinks?.leetcode) return null
    
    const url = profile.socialLinks.leetcode
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      
      // Handle different LeetCode URL formats
      if (pathname.startsWith('/u/')) {
        return pathname.split('/')[2]
      } else if (pathname.startsWith('/profile/')) {
        return pathname.split('/')[2]
      } else {
        // Try to extract username from various URL patterns
        const parts = pathname.split('/').filter(part => part)
        if (parts.length > 0) {
          return parts[parts.length - 1]
        }
      }
    } catch (e) {
      // If it's not a valid URL, treat it as a username
      return url
    }
    
    return null
  }

  return {
    profile,
    loading,
    error,
    saveProfile,
    getLeetCodeUsername
  }
}
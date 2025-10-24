// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe // Cleanup subscription
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return { user, loading, logout }
}

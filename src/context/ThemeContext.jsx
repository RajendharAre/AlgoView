import React, { createContext, useContext, useEffect, useState } from 'react'
import { THEME_MODES, getCurrentTheme, setTheme } from '../utils/themeUtils'

/**
 * Theme Context for managing light/dark mode throughout the app
 */
const ThemeContext = createContext()

/**
 * Theme Provider Component
 */
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || THEME_MODES.SYSTEM
    }
    return THEME_MODES.SYSTEM
  })

  const [isDark, setIsDark] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      const currentTheme = getCurrentTheme()
      setIsDark(currentTheme === THEME_MODES.DARK)
      setTheme(mode)
    }

    initializeTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      if (mode === THEME_MODES.SYSTEM) {
        setIsDark(e.matches)
        setTheme(mode)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode])

  // Update theme when mode changes
  useEffect(() => {
    const currentTheme = getCurrentTheme()
    setIsDark(currentTheme === THEME_MODES.DARK)
  }, [mode])

  const toggleTheme = () => {
    const newMode = isDark ? THEME_MODES.LIGHT : THEME_MODES.DARK
    setMode(newMode)
    setTheme(newMode)
  }

  const setThemeMode = (newMode) => {
    setMode(newMode)
    setTheme(newMode)
  }

  const value = {
    mode,
    isDark,
    toggleTheme,
    setThemeMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to use theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

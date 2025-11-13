/**
 * Theme Configuration and Utilities
 * Manages light/dark mode and color schemes
 */

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

export const COLORS = {
  light: {
    // Background colors
    bg: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      hover: '#e2e8f0',
    },
    // Text colors
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      light: '#94a3b8',
    },
    // Brand colors
    brand: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4',
    },
    // Border colors
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    // Background colors
    bg: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      hover: '#475569',
    },
    // Text colors
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      light: '#64748b',
    },
    // Brand colors
    brand: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
      info: '#22d3ee',
    },
    // Border colors
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
}

/**
 * Get the current theme mode
 */
export const getCurrentTheme = () => {
  const stored = localStorage.getItem('theme')
  if (stored && stored !== THEME_MODES.SYSTEM) {
    return stored
  }

  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? THEME_MODES.DARK : THEME_MODES.LIGHT
  }

  return THEME_MODES.LIGHT
}

/**
 * Set theme mode and persist to localStorage
 */
export const setTheme = (mode) => {
  localStorage.setItem('theme', mode)

  if (mode === THEME_MODES.SYSTEM) {
    document.documentElement.classList.remove('dark')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
  } else if (mode === THEME_MODES.DARK) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

/**
 * Get colors based on current theme
 */
export const getThemeColors = (isDark) => {
  return isDark ? COLORS.dark : COLORS.light
}

/**
 * Generate CSS variables for the theme
 */
export const generateCSSVariables = (isDark) => {
  const colors = getThemeColors(isDark)
  const cssVars = {}

  // Background variables
  cssVars['--bg-primary'] = colors.bg.primary
  cssVars['--bg-secondary'] = colors.bg.secondary
  cssVars['--bg-tertiary'] = colors.bg.tertiary
  cssVars['--bg-hover'] = colors.bg.hover

  // Text variables
  cssVars['--text-primary'] = colors.text.primary
  cssVars['--text-secondary'] = colors.text.secondary
  cssVars['--text-tertiary'] = colors.text.tertiary
  cssVars['--text-light'] = colors.text.light

  // Brand colors
  cssVars['--brand-primary'] = colors.brand.primary
  cssVars['--brand-secondary'] = colors.brand.secondary
  cssVars['--brand-success'] = colors.brand.success
  cssVars['--brand-warning'] = colors.brand.warning
  cssVars['--brand-danger'] = colors.brand.danger
  cssVars['--brand-info'] = colors.brand.info

  // Border and shadow
  cssVars['--border-color'] = colors.border
  cssVars['--shadow-color'] = colors.shadow

  return cssVars
}

/**
 * Initialize theme on app load
 */
export const initializeTheme = () => {
  const currentTheme = getCurrentTheme()
  setTheme(currentTheme)
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import './styles/globals.css'
import './styles/dropdown.css'
import { store } from './store/store'
import { router } from './routes'
import { initAuth } from './store/slices/userSlice'
import { initializeGA } from './lib/analytics'

console.log('App starting up...')

// Initialize Google Analytics 4
// Replace 'G-YOUR_MEASUREMENT_ID' with your actual GA4 measurement ID from Google Analytics
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-YOUR_MEASUREMENT_ID'
if (GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== 'G-YOUR_MEASUREMENT_ID') {
  initializeGA(GA4_MEASUREMENT_ID)
  console.log('✅ Google Analytics initialized')
} else {
  console.warn('⚠️ GA4 Measurement ID not configured. Set VITE_GA4_MEASUREMENT_ID in .env')
}

// Initialize auth when the app starts
console.log('Initializing auth...')
store.dispatch(initAuth())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)

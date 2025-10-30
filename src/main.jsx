import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import './styles/globals.css'
import { store } from './store/store'
import { router } from './routes'
import { initAuth } from './store/slices/userSlice'

console.log('App starting up...');

// Initialize auth when the app starts
console.log('Initializing auth...');
store.dispatch(initAuth())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
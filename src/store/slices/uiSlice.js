import { createSlice } from '@reduxjs/toolkit'

// Define initial state
const initialState = {
  theme: 'light',
  sidebarOpen: true,
  modalOpen: false,
  notifications: [],
}

// Create slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    openModal: state => {
      state.modalOpen = true
    },
    closeModal: state => {
      state.modalOpen = false
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: state => {
      state.notifications = []
    },
  },
})

// Export actions
export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions

// Export selectors
export const selectTheme = state => state.ui.theme
export const selectSidebarOpen = state => state.ui.sidebarOpen
export const selectModalOpen = state => state.ui.modalOpen
export const selectNotifications = state => state.ui.notifications

// Export reducer
export default uiSlice.reducer

// Export state type for documentation
/**
 * @typedef {Object} UIState
 * @property {'light'|'dark'} theme - The current theme
 * @property {boolean} sidebarOpen - Whether the sidebar is open
 * @property {boolean} modalOpen - Whether a modal is open
 * @property {Array} notifications - Array of notification objects
 */

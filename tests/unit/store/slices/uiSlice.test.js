import { describe, it, expect } from 'vitest'
import uiSlice, {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  clearNotifications
} from '../../../src/store/slices/uiSlice'

describe('uiSlice', () => {
  const initialState = {
    theme: 'light',
    sidebarOpen: true,
    modalOpen: false,
    notifications: []
  }

  it('should return the initial state', () => {
    expect(uiSlice(undefined, { type: '' })).toEqual(initialState)
  })

  it('should handle toggleTheme', () => {
    const actual = uiSlice(initialState, toggleTheme())
    expect(actual.theme).toBe('dark')
    
    const actual2 = uiSlice(actual, toggleTheme())
    expect(actual2.theme).toBe('light')
  })

  it('should handle setTheme', () => {
    const actual = uiSlice(initialState, setTheme('dark'))
    expect(actual.theme).toBe('dark')
  })

  it('should handle toggleSidebar', () => {
    const actual = uiSlice(initialState, toggleSidebar())
    expect(actual.sidebarOpen).toBe(false)
    
    const actual2 = uiSlice(actual, toggleSidebar())
    expect(actual2.sidebarOpen).toBe(true)
  })

  it('should handle setSidebarOpen', () => {
    const actual = uiSlice(initialState, setSidebarOpen(false))
    expect(actual.sidebarOpen).toBe(false)
    
    const actual2 = uiSlice(actual, setSidebarOpen(true))
    expect(actual2.sidebarOpen).toBe(true)
  })

  it('should handle openModal', () => {
    const actual = uiSlice(initialState, openModal())
    expect(actual.modalOpen).toBe(true)
  })

  it('should handle closeModal', () => {
    const stateWithModalOpen = { ...initialState, modalOpen: true }
    const actual = uiSlice(stateWithModalOpen, closeModal())
    expect(actual.modalOpen).toBe(false)
  })

  it('should handle addNotification', () => {
    const notification = {
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info'
    }
    
    const actual = uiSlice(initialState, addNotification(notification))
    expect(actual.notifications).toHaveLength(1)
    expect(actual.notifications[0]).toMatchObject(notification)
    expect(actual.notifications[0].id).toBeDefined()
  })

  it('should handle removeNotification', () => {
    const stateWithNotifications = {
      ...initialState,
      notifications: [
        { id: 1, title: 'Notification 1' },
        { id: 2, title: 'Notification 2' },
        { id: 3, title: 'Notification 3' }
      ]
    }
    
    const actual = uiSlice(stateWithNotifications, removeNotification(2))
    expect(actual.notifications).toHaveLength(2)
    expect(actual.notifications.find(n => n.id === 2)).toBeUndefined()
  })

  it('should handle clearNotifications', () => {
    const stateWithNotifications = {
      ...initialState,
      notifications: [
        { id: 1, title: 'Notification 1' },
        { id: 2, title: 'Notification 2' }
      ]
    }
    
    const actual = uiSlice(stateWithNotifications, clearNotifications())
    expect(actual.notifications).toHaveLength(0)
  })
})
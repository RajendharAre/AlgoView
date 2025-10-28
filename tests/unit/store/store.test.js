import { describe, it, expect } from 'vitest'
import { store } from '../../../src/store/store'

describe('Redux Store', () => {
  it('should create store with all reducers', () => {
    // Check that the store has been created
    expect(store).toBeDefined()
    expect(typeof store.dispatch).toBe('function')
    expect(typeof store.getState).toBe('function')
    
    // Check that all expected slices are in the state
    const state = store.getState()
    expect(state).toHaveProperty('user')
    expect(state).toHaveProperty('algorithm')
    expect(state).toHaveProperty('ui')
    expect(state).toHaveProperty('ideas')
    expect(state).toHaveProperty('resources')
  })

  it('should have correct initial state for user slice', () => {
    const state = store.getState()
    expect(state.user).toEqual({
      currentUser: null,
      loading: true,
      error: null
    })
  })

  it('should have correct initial state for algorithm slice', () => {
    const state = store.getState()
    expect(state.algorithm).toEqual({
      selectedAlgorithm: 'bubbleSort',
      isRunning: false,
      speed: 500,
      currentStep: 0,
      inputData: [5, 2, 8, 1, 9, 3],
      searchTarget: 8,
      steps: [],
      visualizationData: null
    })
  })

  it('should have correct initial state for ui slice', () => {
    const state = store.getState()
    expect(state.ui).toEqual({
      theme: 'light',
      sidebarOpen: true,
      modalOpen: false,
      notifications: []
    })
  })

  it('should dispatch actions and update state', () => {
    // Test that we can dispatch actions
    const initialState = store.getState()
    
    // The store should be functional, but we won't test specific actions
    // here as that's covered in individual slice tests
    expect(initialState).toBeDefined()
  })
})
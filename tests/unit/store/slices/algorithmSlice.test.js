import { describe, it, expect } from 'vitest'
import algorithmSlice, {
  setAlgorithm,
  play,
  pause,
  reset,
  setSpeed,
  updateStep,
  setInputData,
  setSearchTarget,
  setVisualizationData
} from '../../../src/store/slices/algorithmSlice'

describe('algorithmSlice', () => {
  const initialState = {
    selectedAlgorithm: 'bubbleSort',
    isRunning: false,
    speed: 500,
    currentStep: 0,
    inputData: [5, 2, 8, 1, 9, 3],
    searchTarget: 8,
    steps: [],
    visualizationData: null
  }

  it('should return the initial state', () => {
    expect(algorithmSlice(undefined, { type: '' })).toEqual(initialState)
  })

  it('should handle setAlgorithm', () => {
    const actual = algorithmSlice(initialState, setAlgorithm('quickSort'))
    expect(actual.selectedAlgorithm).toBe('quickSort')
    expect(actual.currentStep).toBe(0)
    expect(actual.steps).toEqual([])
  })

  it('should handle play', () => {
    const actual = algorithmSlice(initialState, play())
    expect(actual.isRunning).toBe(true)
  })

  it('should handle pause', () => {
    const stateRunning = { ...initialState, isRunning: true }
    const actual = algorithmSlice(stateRunning, pause())
    expect(actual.isRunning).toBe(false)
  })

  it('should handle reset', () => {
    const stateModified = {
      ...initialState,
      isRunning: true,
      currentStep: 5,
      steps: [{ step: 1 }, { step: 2 }]
    }
    
    const actual = algorithmSlice(stateModified, reset())
    expect(actual.isRunning).toBe(false)
    expect(actual.currentStep).toBe(0)
    expect(actual.steps).toEqual([])
  })

  it('should handle setSpeed', () => {
    const actual = algorithmSlice(initialState, setSpeed(1000))
    expect(actual.speed).toBe(1000)
  })

  it('should handle updateStep', () => {
    const actual = algorithmSlice(initialState, updateStep(3))
    expect(actual.currentStep).toBe(3)
  })

  it('should handle setInputData', () => {
    const newData = [1, 2, 3, 4, 5]
    const actual = algorithmSlice(initialState, setInputData(newData))
    expect(actual.inputData).toEqual(newData)
  })

  it('should handle setSearchTarget', () => {
    const actual = algorithmSlice(initialState, setSearchTarget(15))
    expect(actual.searchTarget).toBe(15)
  })

  it('should handle setVisualizationData', () => {
    const visualizationData = {
      nodes: [{ id: '1', value: 5 }],
      edges: [{ from: '1', to: '2' }]
    }
    
    const actual = algorithmSlice(initialState, setVisualizationData(visualizationData))
    expect(actual.visualizationData).toEqual(visualizationData)
  })
})
/**
 * Unit tests for Bubble Sort Algorithm
 */

import { bubbleSort } from '../../../../src/algorithms/Sorting/bubbleSort'

describe('Bubble Sort Algorithm', () => {
  test('should sort an array of numbers in ascending order', () => {
    const input = [64, 34, 25, 12, 22, 11, 90]
    const expected = [11, 12, 22, 25, 34, 64, 90]
    
    // Collect all steps from the generator
    const steps = []
    for (const step of bubbleSort(input)) {
      steps.push(step)
    }
    
    // The final step should contain the sorted array
    const finalStep = steps[steps.length - 1]
    expect(finalStep.array).toEqual(expected)
  })

  test('should handle an already sorted array', () => {
    const input = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3, 4, 5]
    
    // Collect all steps from the generator
    const steps = []
    for (const step of bubbleSort(input)) {
      steps.push(step)
    }
    
    // The final step should contain the sorted array
    const finalStep = steps[steps.length - 1]
    expect(finalStep.array).toEqual(expected)
  })

  test('should handle an array with duplicate elements', () => {
    const input = [5, 2, 8, 2, 9, 1, 5]
    const expected = [1, 2, 2, 5, 5, 8, 9]
    
    // Collect all steps from the generator
    const steps = []
    for (const step of bubbleSort(input)) {
      steps.push(step)
    }
    
    // The final step should contain the sorted array
    const finalStep = steps[steps.length - 1]
    expect(finalStep.array).toEqual(expected)
  })

  test('should handle an empty array', () => {
    const input = []
    const expected = []
    
    // Collect all steps from the generator
    const steps = []
    for (const step of bubbleSort(input)) {
      steps.push(step)
    }
    
    // The final step should contain the sorted array
    const finalStep = steps[steps.length - 1]
    expect(finalStep.array).toEqual(expected)
  })

  test('should handle a single element array', () => {
    const input = [42]
    const expected = [42]
    
    // Collect all steps from the generator
    const steps = []
    for (const step of bubbleSort(input)) {
      steps.push(step)
    }
    
    // The final step should contain the sorted array
    const finalStep = steps[steps.length - 1]
    expect(finalStep.array).toEqual(expected)
  })

  test('should yield steps with proper structure', () => {
    const input = [3, 1, 2]
    
    // Collect all steps from the generator
    const steps = []
    for (const step of bubbleSort(input)) {
      steps.push(step)
    }
    
    // Check that steps have the required properties
    steps.forEach(step => {
      expect(step).toHaveProperty('array')
      expect(step).toHaveProperty('compared')
      expect(step).toHaveProperty('swapped')
      expect(step).toHaveProperty('doneIndex')
      expect(step).toHaveProperty('description')
    })
    
    // Check that the first step has the initial array
    expect(steps[0].array).toEqual(input)
    
    // Check that the last step indicates completion
    const finalStep = steps[steps.length - 1]
    expect(finalStep.description).toBe('Sorting complete!')
  })
})
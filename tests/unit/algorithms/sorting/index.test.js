/**
 * Unit tests for Sorting Algorithms Registry
 */

import { sortingAlgorithms } from '../../../../src/algorithms/Sorting/index'

describe('Sorting Algorithms Registry', () => {
  test('should have all sorting algorithms registered', () => {
    expect(sortingAlgorithms).toHaveProperty('bubbleSort')
    expect(sortingAlgorithms).toHaveProperty('selectionSort')
    expect(sortingAlgorithms).toHaveProperty('insertionSort')
    expect(sortingAlgorithms).toHaveProperty('mergeSort')
    expect(sortingAlgorithms).toHaveProperty('quickSort')
  })

  test('should have bubbleSort algorithm with correct structure', () => {
    const bubbleSort = sortingAlgorithms.bubbleSort
    expect(bubbleSort).toHaveProperty('function')
    expect(bubbleSort).toHaveProperty('info')
    expect(bubbleSort).toHaveProperty('category', 'sorting')
    expect(bubbleSort).toHaveProperty('name', 'Bubble Sort')
  })

  test('should have selectionSort algorithm with correct structure', () => {
    const selectionSort = sortingAlgorithms.selectionSort
    expect(selectionSort).toHaveProperty('function')
    expect(selectionSort).toHaveProperty('info')
    expect(selectionSort).toHaveProperty('category', 'sorting')
    expect(selectionSort).toHaveProperty('name', 'Selection Sort')
  })

  test('should have insertionSort algorithm with correct structure', () => {
    const insertionSort = sortingAlgorithms.insertionSort
    expect(insertionSort).toHaveProperty('function')
    expect(insertionSort).toHaveProperty('info')
    expect(insertionSort).toHaveProperty('category', 'sorting')
    expect(insertionSort).toHaveProperty('name', 'Insertion Sort')
  })

  test('should have mergeSort algorithm with correct structure', () => {
    const mergeSort = sortingAlgorithms.mergeSort
    expect(mergeSort).toHaveProperty('function')
    expect(mergeSort).toHaveProperty('info')
    expect(mergeSort).toHaveProperty('category', 'sorting')
    expect(mergeSort).toHaveProperty('name', 'Merge Sort')
  })

  test('should have quickSort algorithm with correct structure', () => {
    const quickSort = sortingAlgorithms.quickSort
    expect(quickSort).toHaveProperty('function')
    expect(quickSort).toHaveProperty('info')
    expect(quickSort).toHaveProperty('category', 'sorting')
    expect(quickSort).toHaveProperty('name', 'Quick Sort')
  })

  test('should have algorithm info objects with required properties', () => {
    Object.values(sortingAlgorithms).forEach(algorithm => {
      const info = algorithm.info
      expect(info).toHaveProperty('name')
      expect(info).toHaveProperty('category')
      expect(info).toHaveProperty('complexity')
      expect(info.complexity).toHaveProperty('time')
      expect(info.complexity).toHaveProperty('space')
      expect(info).toHaveProperty('stable')
      expect(info).toHaveProperty('inPlace')
      expect(info).toHaveProperty('description')
      expect(info).toHaveProperty('code')
      expect(info).toHaveProperty('useCases')
    })
  })

  test('should have generator functions for all algorithms', () => {
    Object.values(sortingAlgorithms).forEach(algorithm => {
      expect(typeof algorithm.function).toBe('function')
      // Test that it returns a generator
      const gen = algorithm.function([])
      expect(typeof gen.next).toBe('function')
      expect(typeof gen[Symbol.iterator]).toBe('function')
    })
  })
})
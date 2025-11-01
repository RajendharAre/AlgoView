/**
 * Unit tests for Algorithm Utilities
 */

import { 
  createStep, 
  validateInput, 
  generateRandomArray, 
  delay,
  STEP_TYPES,
  algorithmGenerator
} from '../../../src/utils/algorithmUtils'

describe('Algorithm Utilities', () => {
  describe('createStep', () => {
    test('should create a step object with default values', () => {
      const array = [1, 2, 3]
      const step = createStep(array)
      
      expect(step).toHaveProperty('array')
      expect(step).toHaveProperty('compared')
      expect(step).toHaveProperty('swapped')
      expect(step).toHaveProperty('description')
      expect(step).toHaveProperty('type')
      expect(step).toHaveProperty('timestamp')
      
      expect(step.array).toEqual(array)
      expect(step.compared).toEqual([])
      expect(step.swapped).toEqual([])
      expect(step.description).toBe('')
      expect(step.type).toBe(STEP_TYPES.VISIT)
    })

    test('should create a step object with custom values', () => {
      const array = [3, 1, 2]
      const options = {
        compared: [0, 1],
        swapped: [0, 1],
        description: 'Swapped elements',
        type: STEP_TYPES.SWAP
      }
      
      const step = createStep(array, options)
      
      expect(step.array).toEqual(array)
      expect(step.compared).toEqual([0, 1])
      expect(step.swapped).toEqual([0, 1])
      expect(step.description).toBe('Swapped elements')
      expect(step.type).toBe(STEP_TYPES.SWAP)
    })

    test('should create a copy of the array to avoid mutation', () => {
      const originalArray = [1, 2, 3]
      const step = createStep(originalArray)
      
      // Modify the original array
      originalArray.push(4)
      
      // Step array should not be affected
      expect(step.array).toEqual([1, 2, 3])
      expect(step.array).not.toEqual(originalArray)
    })
  })

  describe('validateInput', () => {
    test('should validate array input', () => {
      expect(validateInput([1, 2, 3], 'array')).toBe(true)
      expect(validateInput([], 'array')).toBe(false)
      expect(validateInput('not an array', 'array')).toBe(false)
      expect(validateInput(null, 'array')).toBe(false)
    })

    test('should validate number input', () => {
      expect(validateInput(42, 'number')).toBe(true)
      expect(validateInput(3.14, 'number')).toBe(true)
      expect(validateInput('42', 'number')).toBe(false)
      expect(validateInput(NaN, 'number')).toBe(false)
    })

    test('should validate positive integer input', () => {
      expect(validateInput(5, 'positive_integer')).toBe(true)
      expect(validateInput(1, 'positive_integer')).toBe(true)
      expect(validateInput(0, 'positive_integer')).toBe(false)
      expect(validateInput(-1, 'positive_integer')).toBe(false)
      expect(validateInput(3.14, 'positive_integer')).toBe(false)
    })

    test('should validate non-negative integer input', () => {
      expect(validateInput(5, 'non_negative_integer')).toBe(true)
      expect(validateInput(0, 'non_negative_integer')).toBe(true)
      expect(validateInput(1, 'non_negative_integer')).toBe(true)
      expect(validateInput(-1, 'non_negative_integer')).toBe(false)
      expect(validateInput(3.14, 'non_negative_integer')).toBe(false)
    })

    test('should validate string input', () => {
      expect(validateInput('hello', 'string')).toBe(true)
      expect(validateInput('', 'string')).toBe(false)
      expect(validateInput(42, 'string')).toBe(false)
    })
  })

  describe('generateRandomArray', () => {
    test('should generate array with default parameters', () => {
      const array = generateRandomArray()
      
      expect(Array.isArray(array)).toBe(true)
      expect(array.length).toBe(10)
      array.forEach(element => {
        expect(typeof element).toBe('number')
        expect(element).toBeGreaterThanOrEqual(1)
        expect(element).toBeLessThanOrEqual(100)
      })
    })

    test('should generate array with custom size', () => {
      const array = generateRandomArray(5)
      
      expect(array.length).toBe(5)
    })

    test('should generate array with custom range', () => {
      const array = generateRandomArray(10, 50, 60)
      
      array.forEach(element => {
        expect(element).toBeGreaterThanOrEqual(50)
        expect(element).toBeLessThanOrEqual(60)
      })
    })

    test('should throw error for invalid parameters', () => {
      expect(() => generateRandomArray(-1)).toThrow()
      expect(() => generateRandomArray(5, 10, 5)).toThrow()
    })
  })

  describe('delay', () => {
    test('should resolve after specified time', async () => {
      const start = Date.now()
      await delay(10)
      const end = Date.now()
      
      // Allow for some tolerance
      expect(end - start).toBeGreaterThanOrEqual(5)
    })
  })

  describe('STEP_TYPES', () => {
    test('should have all required step types', () => {
      expect(STEP_TYPES).toHaveProperty('COMPARE')
      expect(STEP_TYPES).toHaveProperty('SWAP')
      expect(STEP_TYPES).toHaveProperty('SORTED')
      expect(STEP_TYPES).toHaveProperty('PIVOT')
      expect(STEP_TYPES).toHaveProperty('VISIT')
      expect(STEP_TYPES).toHaveProperty('MERGE')
      expect(STEP_TYPES).toHaveProperty('SPLIT')
      expect(STEP_TYPES).toHaveProperty('INSERT')
      expect(STEP_TYPES).toHaveProperty('DELETE')
      expect(STEP_TYPES).toHaveProperty('SEARCH')
    })
  })

  describe('algorithmGenerator', () => {
    test('should return a generator function', () => {
      const mockAlgorithm = jest.fn()
      const generator = algorithmGenerator(mockAlgorithm)
      
      expect(typeof generator).toBe('function')
      // Test that it returns a generator
      const gen = generator()
      expect(typeof gen.next).toBe('function')
      expect(typeof gen[Symbol.iterator]).toBe('function')
    })
  })
})
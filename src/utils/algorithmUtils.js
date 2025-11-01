/**
 * Utility functions for algorithm implementations
 */

/**
 * Step types enum for consistent step categorization
 * @enum {string}
 */
export const STEP_TYPES = {
  COMPARE: 'compare',
  SWAP: 'swap',
  SORTED: 'sorted',
  PIVOT: 'pivot',
  VISIT: 'visit',
  MERGE: 'merge',
  SPLIT: 'split',
  INSERT: 'insert',
  DELETE: 'delete',
  SEARCH: 'search'
}

/**
 * Creates a standardized step object for algorithm visualization
 * 
 * @param {number[]} array - The current state of the array
 * @param {Object} options - Optional properties for the step
 * @param {number[]} options.compared - Indices being compared
 * @param {number[]} options.swapped - Indices that were swapped
 * @param {string} options.description - Description of the current step
 * @param {string} options.type - Type of step from STEP_TYPES enum
 * @param {number} options.timestamp - Timestamp of the step (auto-generated if not provided)
 * @returns {Object} Standardized step object
 */
export const createStep = (array, options = {}) => {
  return {
    array: [...array], // Create a copy to avoid mutation
    compared: options.compared || [],
    swapped: options.swapped || [],
    description: options.description || '',
    type: options.type || STEP_TYPES.VISIT,
    timestamp: options.timestamp || Date.now()
  }
}

/**
 * Validates input based on the specified type
 * 
 * @param {*} input - The input to validate
 * @param {string} type - The type of validation to perform
 * @returns {boolean} Whether the input is valid
 */
export const validateInput = (input, type) => {
  switch (type) {
    case 'array':
      return Array.isArray(input) && input.length > 0
    case 'number':
      return typeof input === 'number' && !isNaN(input)
    case 'positive_integer':
      return Number.isInteger(input) && input > 0
    case 'non_negative_integer':
      return Number.isInteger(input) && input >= 0
    case 'string':
      return typeof input === 'string' && input.length > 0
    default:
      return false
  }
}

/**
 * Generates a random array of integers
 * 
 * @param {number} size - Size of the array (default: 10)
 * @param {number} min - Minimum value (default: 1)
 * @param {number} max - Maximum value (default: 100)
 * @returns {number[]} Array of random integers
 */
export const generateRandomArray = (size = 10, min = 1, max = 100) => {
  // Validate inputs
  if (!validateInput(size, 'positive_integer')) {
    throw new Error('Size must be a positive integer')
  }
  
  if (!validateInput(min, 'number') || !validateInput(max, 'number')) {
    throw new Error('Min and max must be numbers')
  }
  
  if (min >= max) {
    throw new Error('Min must be less than max')
  }
  
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

/**
 * Creates a delay for controlled execution
 * 
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after the specified delay
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Base generator function template for algorithm implementations
 * 
 * @param {Function} algorithmFn - The algorithm function to wrap
 * @returns {Function} Generator function that yields steps
 */
export const algorithmGenerator = (algorithmFn) => {
  return function* (...args) {
    // This is a template that algorithm implementations should follow
    // Actual implementations will have their own specific logic
    yield createStep([], { 
      description: 'Algorithm started',
      type: STEP_TYPES.VISIT
    })
    
    // Algorithm-specific implementation would go here
    // yield* algorithmFn(...args)
    
    yield createStep([], { 
      description: 'Algorithm completed',
      type: STEP_TYPES.SORTED
    })
  }
}
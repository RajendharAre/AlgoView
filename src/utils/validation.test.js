import { describe, it, expect } from 'vitest'
import { validateLogin, validateRegister, validateResetPassword } from './validation'

describe('Validation Functions', () => {
  describe('validateLogin', () => {
    it('should validate correct login data', () => {
      const result = validateLogin({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = validateLogin({
        email: 'invalid-email',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const result = validateLogin({
        email: 'test@example.com',
        password: '123',
      })
      expect(result.success).toBe(false)
    })

    it('should reject disposable email', () => {
      const result = validateLogin({
        email: 'test@10minutemail.com',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('validateRegister', () => {
    it('should validate correct registration data', () => {
      const result = validateRegister({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const result = validateRegister({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
      })
      expect(result.success).toBe(false)
    })

    it('should reject disposable email', () => {
      const result = validateRegister({
        name: 'Test User',
        email: 'test@guerrillamail.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('validateResetPassword', () => {
    it('should validate correct email for password reset', () => {
      const result = validateResetPassword({
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email for password reset', () => {
      const result = validateResetPassword({
        email: 'invalid-email',
      })
      expect(result.success).toBe(false)
    })

    it('should reject disposable email for password reset', () => {
      const result = validateResetPassword({
        email: 'test@mailinator.com',
      })
      expect(result.success).toBe(false)
    })
  })
})

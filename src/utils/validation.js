import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

// Register validation schema
export const registerSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Password reset validation schema
export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

// Validate login form data
export const validateLogin = (data) => {
  try {
    loginSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
};

// Validate register form data
export const validateRegister = (data) => {
  try {
    registerSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
};

// Validate password reset form data
export const validateResetPassword = (data) => {
  try {
    resetPasswordSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
};
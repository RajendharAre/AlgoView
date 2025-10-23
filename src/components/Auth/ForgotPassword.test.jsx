import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForgotPassword from './ForgotPassword';

// Mock Firebase auth functions
vi.mock('../../lib/firebase', () => ({
  auth: {}
}));

// Mock sendPasswordResetEmail
vi.mock('firebase/auth', () => ({
  sendPasswordResetEmail: vi.fn()
}));

describe('ForgotPassword Component', () => {
  it('renders correctly', () => {
    render(<ForgotPassword onBackToLogin={vi.fn()} />);
    
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByText('Send Reset Link')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(<ForgotPassword onBackToLogin={vi.fn()} />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const submitButton = screen.getByText('Send Reset Link');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    // Wait for validation to occur
    await screen.findByText('Please enter a valid email address');
  });

  it('shows validation error for disposable email', async () => {
    render(<ForgotPassword onBackToLogin={vi.fn()} />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const submitButton = screen.getByText('Send Reset Link');
    
    fireEvent.change(emailInput, { target: { value: 'test@10minutemail.com' } });
    fireEvent.click(submitButton);
    
    // Wait for validation to occur
    await screen.findByText('Please use a legitimate email provider (Gmail, Yahoo, Outlook, etc.)');
  });
});
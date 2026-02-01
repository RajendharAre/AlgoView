/**
 * Unit tests for ChatInput component
 * Tests input handling, auto-resize functionality, and submit behavior
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../../../src/pages/AI/components/ChatInput';
import * as testUtils from '../../../tests/test-utils.jsx';

describe('ChatInput Component', () => {
  let mockHandlers;
  let user;

  beforeEach(() => {
    mockHandlers = testUtils.createMockHandlers();
    user = userEvent.setup();
    // Mock console to reduce test noise
    testUtils.mockConsole();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders textarea with correct placeholder', () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          placeholder="Test placeholder"
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea.placeholder).toBe('Test placeholder');
    });

    it('renders with default placeholder when not provided', () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea.placeholder).toBe('Message AlgoView AI...');
    });

    it('displays copy button when input has content', () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          onCopy={mockHandlers.onCopy}
        />
      );

      const copyButton = screen.getByLabelText('Copy input');
      expect(copyButton).toBeInTheDocument();
    });

    it('does not display copy button when input is empty', () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          onCopy={mockHandlers.onCopy}
        />
      );

      const copyButtons = screen.queryByLabelText('Copy input');
      expect(copyButtons).not.toBeInTheDocument();
    });

    it('renders send button', () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const sendButton = screen.getByLabelText('Send message');
      expect(sendButton).toBeInTheDocument();
    });
  });

  describe('Input Handling', () => {
    it('calls onChange when user types', async () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello World');
      
      expect(mockHandlers.onChange).toHaveBeenCalledWith('Hello World');
    });

    it('maintains input value through props', () => {
      const { rerender } = render(
        <ChatInput
          value="Initial value"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea.value).toBe('Initial value');

      rerender(
        <ChatInput
          value="Updated value"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      expect(textarea.value).toBe('Updated value');
    });
  });

  describe('Submit Behavior', () => {
    it('calls onSubmit when send button is clicked with valid content', async () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      expect(mockHandlers.onSubmit).toHaveBeenCalledWith('Test message');
    });

    it('calls onSubmit when Enter is pressed with valid content', async () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '{Enter}');

      expect(mockHandlers.onSubmit).toHaveBeenCalledWith('Test message');
    });

    it('allows Shift+Enter for new lines without submitting', async () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '{Shift>}{Enter}{/Shift}');

      expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
    });

    it('does not submit when input is empty', async () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
    });

    it('does not submit when disabled', async () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          disabled={true}
        />
      );

      const sendButton = screen.getByLabelText('Send message');
      await user.click(sendButton);

      expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
    });

    it('does not submit when loading', async () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          isLoading={true}
        />
      );

      const sendButton = screen.getByLabelText('Sending message');
      await user.click(sendButton);

      expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Copy Functionality', () => {
    it('calls onCopy when copy button is clicked', async () => {
      render(
        <ChatInput
          value="Test message to copy"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          onCopy={mockHandlers.onCopy}
        />
      );

      const copyButton = screen.getByLabelText('Copy input');
      await user.click(copyButton);

      expect(mockHandlers.onCopy).toHaveBeenCalledWith('Test message to copy');
    });

    it('does not show copy button when onCopy is not provided', () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const copyButtons = screen.queryByLabelText('Copy input');
      expect(copyButtons).not.toBeInTheDocument();
    });
  });

  describe('Auto-resize Functionality', () => {
    it('textarea resizes based on content length', async () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox');
      const initialHeight = textarea.style.height;

      // Type a long message
      await user.type(textarea, 'This is a very long message that should cause the textarea to resize and accommodate multiple lines of content.');

      // Height should have changed
      expect(textarea.style.height).not.toBe(initialHeight);
    });

    it('textarea has maximum height limit', async () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox');
      
      // Type a very long message
      const longText = 'A'.repeat(500);
      await user.type(textarea, longText);

      // Should not exceed maximum height (120px)
      const heightValue = parseInt(textarea.style.height);
      expect(heightValue).toBeLessThanOrEqual(120);
    });
  });

  describe('Accessibility', () => {
    it('textarea has proper ARIA attributes', () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', undefined);
      expect(textarea).toHaveAttribute('role', 'textbox');
    });

    it('send button has proper aria-label based on loading state', () => {
      const { rerender } = render(
        <ChatInput
          value="Test"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          isLoading={false}
        />
      );

      let sendButton = screen.getByRole('button');
      expect(sendButton).toHaveAttribute('aria-label', 'Send message');

      rerender(
        <ChatInput
          value="Test"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          isLoading={true}
        />
      );

      sendButton = screen.getByRole('button');
      expect(sendButton).toHaveAttribute('aria-label', 'Sending message');
    });

    it('copy button has proper aria-label', () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          onCopy={mockHandlers.onCopy}
        />
      );

      const copyButton = screen.getByLabelText('Copy input');
      expect(copyButton).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('send button is disabled when input is empty', () => {
      render(
        <ChatInput
          value=""
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const sendButton = screen.getByLabelText('Send message');
      expect(sendButton).toBeDisabled();
    });

    it('send button is enabled when input has content', () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const sendButton = screen.getByLabelText('Send message');
      expect(sendButton).not.toBeDisabled();
    });

    it('shows loading spinner when isLoading is true', () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          isLoading={true}
        />
      );

      const sendButton = screen.getByLabelText('Sending message');
      expect(sendButton).toBeInTheDocument();
      // Check for spinner icon (assuming it uses animate-spin class)
      const spinner = sendButton.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('textarea has disabled styling when disabled', () => {
      render(
        <ChatInput
          value="Test message"
          onChange={mockHandlers.onChange}
          onSubmit={mockHandlers.onSubmit}
          disabled={true}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('opacity-70', 'cursor-not-allowed');
    });
  });
});
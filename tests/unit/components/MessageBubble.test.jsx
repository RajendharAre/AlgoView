/**
 * Unit tests for MessageBubble component
 * Tests message rendering, user/assistant differentiation, and copy functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '../../../src/pages/AI/components/MessageBubble';
import * as testUtils from '../../../tests/test-utils.jsx';

describe('MessageBubble Component', () => {
  let mockHandlers;

  beforeEach(() => {
    mockHandlers = testUtils.createMockHandlers();
    testUtils.mockConsole();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders user message with correct styling', () => {
      const userMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'Hello, this is a user message',
        createdAt: new Date()
      };

      render(<MessageBubble message={userMessage} onCopy={mockHandlers.onCopy} />);

      // Check for user-specific elements
      const userBubble = screen.getByText('Hello, this is a user message');
      expect(userBubble).toBeInTheDocument();
      
      // Check for user avatar
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toBeInTheDocument();
    });

    it('renders assistant message with correct styling', () => {
      const assistantMessage = {
        id: 'msg-2',
        role: 'assistant',
        content: '<p>Hello, this is an AI response</p>',
        createdAt: new Date()
      };

      render(<MessageBubble message={assistantMessage} onCopy={mockHandlers.onCopy} />);

      // Check for assistant-specific elements
      const assistantBubble = screen.getByText('Hello, this is an AI response');
      expect(assistantBubble).toBeInTheDocument();
      
      // Check for assistant avatar
      const botIcon = screen.getByTestId('bot-icon');
      expect(botIcon).toBeInTheDocument();
    });

    it('renders HTML content properly for assistant messages', () => {
      const htmlMessage = {
        id: 'msg-3',
        role: 'assistant',
        content: '<p><strong>Bold text</strong> and <em>italic text</em></p><ul><li>Item 1</li><li>Item 2</li></ul>',
        createdAt: new Date()
      };

      render(<MessageBubble message={htmlMessage} onCopy={mockHandlers.onCopy} />);

      // Check that HTML is rendered (not escaped)
      expect(screen.getByText('Bold text')).toBeInTheDocument();
      expect(screen.getByText('italic text')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders plain text for user messages', () => {
      const userMessage = {
        id: 'msg-4',
        role: 'user',
        content: 'Plain text message with <strong>HTML tags</strong>',
        createdAt: new Date()
      };

      render(<MessageBubble message={userMessage} onCopy={mockHandlers.onCopy} />);

      // User messages should render as plain text (HTML should be escaped)
      const messageElement = screen.getByText('Plain text message with <strong>HTML tags</strong>');
      expect(messageElement).toBeInTheDocument();
    });
  });

  describe('User vs Assistant Differentiation', () => {
    it('applies user-specific styling classes', () => {
      const userMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'User message',
        createdAt: new Date()
      };

      const { container } = render(<MessageBubble message={userMessage} onCopy={mockHandlers.onCopy} />);
      
      // Check for user-specific classes (justify-end for user messages)
      const messageContainer = container.firstChild;
      expect(messageContainer).toHaveClass('justify-end');
    });

    it('applies assistant-specific styling classes', () => {
      const assistantMessage = {
        id: 'msg-2',
        role: 'assistant',
        content: 'Assistant message',
        createdAt: new Date()
      };

      const { container } = render(<MessageBubble message={assistantMessage} onCopy={mockHandlers.onCopy} />);
      
      // Check for assistant-specific classes (justify-start for assistant messages)
      const messageContainer = container.firstChild;
      expect(messageContainer).toHaveClass('justify-start');
    });

    it('shows copy button only for assistant messages', () => {
      const assistantMessage = {
        id: 'msg-1',
        role: 'assistant',
        content: 'Assistant message',
        createdAt: new Date()
      };

      render(<MessageBubble message={assistantMessage} onCopy={mockHandlers.onCopy} />);

      // Copy button should be visible for assistant messages
      const copyButton = screen.getByLabelText('Copy message');
      expect(copyButton).toBeInTheDocument();
    });

    it('does not show copy button for user messages', () => {
      const userMessage = {
        id: 'msg-2',
        role: 'user',
        content: 'User message',
        createdAt: new Date()
      };

      render(<MessageBubble message={userMessage} onCopy={mockHandlers.onCopy} />);

      // Copy button should not be present for user messages
      const copyButtons = screen.queryByLabelText('Copy message');
      expect(copyButtons).not.toBeInTheDocument();
    });
  });

  describe('Copy Functionality', () => {
    it('calls onCopy with message content when copy button is clicked', () => {
      const assistantMessage = {
        id: 'msg-1',
        role: 'assistant',
        content: 'Message to copy',
        createdAt: new Date()
      };

      render(<MessageBubble message={assistantMessage} onCopy={mockHandlers.onCopy} />);

      const copyButton = screen.getByLabelText('Copy message');
      copyButton.click();

      expect(mockHandlers.onCopy).toHaveBeenCalledWith('Message to copy');
    });

    it('copy button is not displayed when onCopy is not provided', () => {
      const assistantMessage = {
        id: 'msg-1',
        role: 'assistant',
        content: 'Assistant message',
        createdAt: new Date()
      };

      render(<MessageBubble message={assistantMessage} />);

      const copyButtons = screen.queryByLabelText('Copy message');
      expect(copyButtons).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-labels for interactive elements', () => {
      const assistantMessage = {
        id: 'msg-1',
        role: 'assistant',
        content: 'Assistant message',
        createdAt: new Date()
      };

      render(<MessageBubble message={assistantMessage} onCopy={mockHandlers.onCopy} />);

      const copyButton = screen.getByLabelText('Copy message');
      expect(copyButton).toBeInTheDocument();
    });

    it('message content is readable by screen readers', () => {
      const userMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'Screen reader content',
        createdAt: new Date()
      };

      render(<MessageBubble message={userMessage} onCopy={mockHandlers.onCopy} />);

      const messageContent = screen.getByText('Screen reader content');
      expect(messageContent).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty message content', () => {
      const emptyMessage = {
        id: 'msg-1',
        role: 'user',
        content: '',
        createdAt: new Date()
      };

      render(<MessageBubble message={emptyMessage} onCopy={mockHandlers.onCopy} />);

      // Should render without errors
      const messageContainer = screen.getByTestId('message-bubble');
      expect(messageContainer).toBeInTheDocument();
    });

    it('handles very long message content', () => {
      const longMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'A'.repeat(1000),
        createdAt: new Date()
      };

      render(<MessageBubble message={longMessage} onCopy={mockHandlers.onCopy} />);

      // Should render without errors
      const messageContent = screen.getByText('A'.repeat(1000));
      expect(messageContent).toBeInTheDocument();
    });

    it('handles special characters in content', () => {
      const specialMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'Message with <>&"\' special characters',
        createdAt: new Date()
      };

      render(<MessageBubble message={specialMessage} onCopy={mockHandlers.onCopy} />);

      // Should render special characters properly
      const messageContent = screen.getByText('Message with <>&"\' special characters');
      expect(messageContent).toBeInTheDocument();
    });

    it('handles messages with only whitespace', () => {
      const whitespaceMessage = {
        id: 'msg-1',
        role: 'user',
        content: '   \n\t  ',
        createdAt: new Date()
      };

      render(<MessageBubble message={whitespaceMessage} onCopy={mockHandlers.onCopy} />);

      // Should render without errors (whitespace may not be visible but element exists)
      const messageContainer = screen.getByTestId('message-bubble');
      expect(messageContainer).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('renders user avatar with correct icon', () => {
      const userMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'User message',
        createdAt: new Date()
      };

      render(<MessageBubble message={userMessage} onCopy={mockHandlers.onCopy} />);

      // Check for user icon (User component from lucide-react)
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toBeInTheDocument();
    });

    it('renders assistant avatar with correct icon', () => {
      const assistantMessage = {
        id: 'msg-1',
        role: 'assistant',
        content: 'Assistant message',
        createdAt: new Date()
      };

      render(<MessageBubble message={assistantMessage} onCopy={mockHandlers.onCopy} />);

      // Check for bot icon (Bot component from lucide-react)
      const botIcon = screen.getByTestId('bot-icon');
      expect(botIcon).toBeInTheDocument();
    });

    it('applies correct background colors', () => {
      const userMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'User message',
        createdAt: new Date()
      };

      const { container } = render(<MessageBubble message={userMessage} onCopy={mockHandlers.onCopy} />);
      
      // Check for user background color classes
      const messageBubble = container.querySelector('.bg-blue-500');
      expect(messageBubble).toBeInTheDocument();
    });

    it('handles timestamp display', () => {
      const messageWithTimestamp = {
        id: 'msg-1',
        role: 'user',
        content: 'Message with timestamp',
        createdAt: new Date('2023-01-01T12:00:00Z')
      };

      render(<MessageBubble message={messageWithTimestamp} onCopy={mockHandlers.onCopy} />);

      // Message should render with timestamp information
      const messageContent = screen.getByText('Message with timestamp');
      expect(messageContent).toBeInTheDocument();
    });
  });
});
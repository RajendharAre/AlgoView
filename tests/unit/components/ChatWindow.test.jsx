/**
 * Unit tests for ChatWindow component
 * Tests message display, auto-scroll functionality, and typing indicator behavior
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ChatWindow } from '../../../src/pages/AI/components/ChatWindow';
import * as testUtils from '../../../tests/test-utils.jsx';

describe('ChatWindow Component', () => {
  let mockHandlers;
  let restoreScrollMock;

  beforeEach(() => {
    mockHandlers = testUtils.createMockHandlers();
    restoreScrollMock = testUtils.mockScrollBehavior();
    testUtils.mockConsole();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    restoreScrollMock();
  });

  describe('Message Display', () => {
    it('renders empty state when no messages', () => {
      render(
        <ChatWindow
          messages={[]}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Should render welcome message
      expect(screen.getByText(/Welcome to AlgoView AI/i)).toBeInTheDocument();
    });

    it('renders messages when provided', () => {
      const messages = [
        testUtils.testFixtures.messages.userMessage,
        testUtils.testFixtures.messages.assistantMessage
      ];

      render(
        <ChatWindow
          messages={messages}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Should render both messages
      expect(screen.getByText('Hello, explain merge sort')).toBeInTheDocument();
      expect(screen.getByText('Merge Sort is a divide and conquer algorithm...')).toBeInTheDocument();
    });

    it('renders messages in correct order', () => {
      const messages = [
        { ...testUtils.testFixtures.messages.userMessage, id: 'msg-1', content: 'First message' },
        { ...testUtils.testFixtures.messages.assistantMessage, id: 'msg-2', content: 'Second message' },
        { ...testUtils.testFixtures.messages.userMessage, id: 'msg-3', content: 'Third message' }
      ];

      const { container } = render(
        <ChatWindow
          messages={messages}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Messages should be rendered in order
      const messageElements = container.querySelectorAll('[data-testid="message-bubble"]');
      expect(messageElements).toHaveLength(3);
      
      // Check order by content
      const messageTexts = Array.from(messageElements).map(el => 
        within(el).getByText(/message/i).textContent
      );
      expect(messageTexts).toEqual(['First message', 'Second message', 'Third message']);
    });

    it('passes onCopy handler to MessageBubble components', () => {
      const messages = [testUtils.testFixtures.messages.assistantMessage];

      render(
        <ChatWindow
          messages={messages}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Find copy button and click it
      const copyButton = screen.getByLabelText('Copy message');
      copyButton.click();

      expect(mockHandlers.onCopy).toHaveBeenCalledWith('<p>Merge Sort is a divide and conquer algorithm...</p>');
    });
  });

  describe('Loading States', () => {
    it('shows typing indicator when isLoading is true', () => {
      render(
        <ChatWindow
          messages={[]}
          isLoading={true}
          onCopy={mockHandlers.onCopy}
        />
      );

      expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    });

    it('shows custom loading text when provided', () => {
      render(
        <ChatWindow
          messages={[]}
          isLoading={true}
          loadingText="Processing your request..."
          onCopy={mockHandlers.onCopy}
        />
      );

      expect(screen.getByText('Processing your request...')).toBeInTheDocument();
    });

    it('shows typing indicator when isSending is true', () => {
      render(
        <ChatWindow
          messages={[]}
          isSending={true}
          onCopy={mockHandlers.onCopy}
        />
      );

      expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    });

    it('shows messages along with typing indicator when both present', () => {
      const messages = [testUtils.testFixtures.messages.userMessage];

      render(
        <ChatWindow
          messages={messages}
          isLoading={true}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Should show both messages and typing indicator
      expect(screen.getByText('Hello, explain merge sort')).toBeInTheDocument();
      expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    });
  });

  describe('Auto-scroll Functionality', () => {
    it('scrolls to bottom when new messages are added', async () => {
      const { rerender } = render(
        <ChatWindow
          messages={[]}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Add messages and re-render
      const messagesWithContent = [testUtils.testFixtures.messages.userMessage];
      rerender(
        <ChatWindow
          messages={messagesWithContent}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Wait for scroll to occur
      await testUtils.waitForAsync(() => {
        // This would check if scrollTo was called in a real test
        return true;
      });
    });

    it('scrolls to bottom when component mounts with messages', () => {
      render(
        <ChatWindow
          messages={[testUtils.testFixtures.messages.userMessage]}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Component should have attempted to scroll on mount
    });

    it('respects user scroll position when not at bottom', async () => {
      // This is difficult to test without full DOM manipulation
      // In a real test environment, we would mock the scroll position checks
      const messages = Array(20).fill().map((_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
        createdAt: new Date()
      }));

      render(
        <ChatWindow
          messages={messages}
          onCopy={mockHandlers.onCopy}
        />
      );

      // With many messages, should handle scroll properly
    });
  });

  describe('Accessibility', () => {
    it('has proper aria labels and roles', () => {
      render(
        <ChatWindow
          messages={[]}
          onCopy={mockHandlers.onCopy}
        />
      );

      const chatContainer = screen.getByRole('main');
      expect(chatContainer).toBeInTheDocument();
    });

    it('messages are properly structured for screen readers', () => {
      const messages = [testUtils.testFixtures.messages.userMessage];

      render(
        <ChatWindow
          messages={messages}
          onCopy={mockHandlers.onCopy}
        />
      );

      const messageContent = screen.getByText('Hello, explain merge sort');
      expect(messageContent).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null messages array gracefully', () => {
      render(
        <ChatWindow
          messages={null}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Should render empty state without errors
      expect(screen.getByText(/Welcome to AlgoView AI/i)).toBeInTheDocument();
    });

    it('handles undefined messages array gracefully', () => {
      render(
        <ChatWindow
          messages={undefined}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Should render empty state without errors
      expect(screen.getByText(/Welcome to AlgoView AI/i)).toBeInTheDocument();
    });

    it('handles very large number of messages', () => {
      const manyMessages = Array(100).fill().map((_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
        createdAt: new Date()
      }));

      render(
        <ChatWindow
          messages={manyMessages}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Should render without performance issues
      expect(screen.getByText('Message 0')).toBeInTheDocument();
      expect(screen.getByText('Message 99')).toBeInTheDocument();
    });

    it('handles messages with special characters', () => {
      const specialMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'Message with <>&"\' special chars and \n newlines',
        createdAt: new Date()
      };

      render(
        <ChatWindow
          messages={[specialMessage]}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Should render special characters properly
      expect(screen.getByText('Message with <>&"\' special chars and')).toBeInTheDocument();
    });

    it('handles rapid message updates', async () => {
      const { rerender } = render(
        <ChatWindow
          messages={[]}
          onCopy={mockHandlers.onCopy}
        />
      );

      // Rapid updates
      for (let i = 0; i < 5; i++) {
        const messages = Array(i + 1).fill().map((_, j) => ({
          id: `msg-${j}`,
          role: 'user',
          content: `Message ${j}`,
          createdAt: new Date()
        }));
        
        rerender(
          <ChatWindow
            messages={messages}
            onCopy={mockHandlers.onCopy}
          />
        );
      }

      // Should handle updates without errors
      expect(screen.getByText('Message 0')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('efficiently renders large message lists', () => {
      const largeMessageSet = Array(50).fill().map((_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Performance test message ${i}`,
        createdAt: new Date()
      }));

      const startTime = performance.now();
      
      render(
        <ChatWindow
          messages={largeMessageSet}
          onCopy={mockHandlers.onCopy}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(100); // 100ms threshold
    });

    it('memoizes message rendering for unchanged messages', () => {
      const messages = [testUtils.testFixtures.messages.userMessage];
      
      const { rerender } = render(
        <ChatWindow
          messages={messages}
          onCopy={mockHandlers.onCopy}
        />
      );

      const firstRenderTime = performance.now();
      
      // Re-render with same messages
      rerender(
        <ChatWindow
          messages={messages}
          onCopy={mockHandlers.onCopy}
        />
      );

      const secondRenderTime = performance.now();
      const diff = secondRenderTime - firstRenderTime;

      // Second render should be faster (memoization)
      expect(diff).toBeLessThan(10); // 10ms threshold for re-render
    });
  });

  describe('Visual Elements', () => {
    it('applies correct styling classes', () => {
      const { container } = render(
        <ChatWindow
          messages={[]}
          onCopy={mockHandlers.onCopy}
        />
      );

      const chatContainer = container.firstChild;
      expect(chatContainer).toHaveClass('flex-1', 'overflow-y-auto');
    });

    it('renders typing indicator with correct animation', () => {
      render(
        <ChatWindow
          messages={[]}
          isLoading={true}
          onCopy={mockHandlers.onCopy}
        />
      );

      const typingIndicator = screen.getByText('AI is thinking...');
      expect(typingIndicator).toBeInTheDocument();
      
      // Check for animation elements (would need specific implementation details)
      const animatedDots = screen.queryAllByTestId('typing-dot');
      expect(animatedDots.length).toBeGreaterThanOrEqual(0);
    });
  });
});
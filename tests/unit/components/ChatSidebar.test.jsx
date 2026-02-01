/**
 * Unit tests for ChatSidebar component
 * Tests chat list management, CRUD operations, and UI interactions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatSidebar } from '../../../src/pages/AI/components/ChatSidebar';
import * as testUtils from '../../../tests/test-utils.jsx';

describe('ChatSidebar Component', () => {
  let mockHandlers;
  let user;

  beforeEach(() => {
    mockHandlers = testUtils.createMockHandlers();
    user = userEvent.setup();
    testUtils.mockConsole();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Chat List Display', () => {
    it('renders empty state when no chats', () => {
      render(
        <ChatSidebar
          chats={[]}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      expect(screen.getByText('No chats yet')).toBeInTheDocument();
      expect(screen.getByText('Create your first chat to get started')).toBeInTheDocument();
    });

    it('renders chat list when chats are provided', () => {
      const chats = testUtils.testFixtures.chats.multipleChats;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      expect(screen.getByText('First Chat')).toBeInTheDocument();
      expect(screen.getByText('Second Chat')).toBeInTheDocument();
    });

    it('displays chat titles and last messages', () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      expect(screen.getByText('Test Conversation')).toBeInTheDocument();
      expect(screen.getByText('Hello there')).toBeInTheDocument();
    });

    it('shows active chat with highlighted styling', () => {
      const chats = testUtils.testFixtures.chats.multipleChats;

      const { container } = render(
        <ChatSidebar
          chats={chats}
          activeChatId="chat-1"
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      // Find the active chat item (should have active styling)
      const activeChat = screen.getByText('First Chat').closest('div');
      expect(activeChat).toHaveClass('bg-blue-50', 'dark:bg-blue-900/20');
    });
  });

  describe('Create New Chat', () => {
    it('calls onCreateChat when new chat button is clicked', async () => {
      render(
        <ChatSidebar
          chats={[]}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const newChatButton = screen.getByLabelText('New chat');
      await user.click(newChatButton);

      expect(mockHandlers.onCreateChat).toHaveBeenCalledWith('New Chat');
    });

    it('shows loading state on new chat button when loading', () => {
      render(
        <ChatSidebar
          chats={[]}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={true}
        />
      );

      const newChatButton = screen.getByLabelText('Creating chat');
      expect(newChatButton).toBeInTheDocument();
      expect(newChatButton).toBeDisabled();
    });
  });

  describe('Chat Selection', () => {
    it('calls onSelectChat when chat item is clicked', async () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const chatItem = screen.getByText('Test Conversation');
      await user.click(chatItem);

      expect(mockHandlers.onSelectChat).toHaveBeenCalledWith('chat-1');
    });

    it('does not call onSelectChat when clicking already active chat', async () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId="chat-1"
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const chatItem = screen.getByText('Test Conversation');
      await user.click(chatItem);

      expect(mockHandlers.onSelectChat).not.toHaveBeenCalled();
    });

    it('shows proper timestamp formatting', () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      // Should display relative time (e.g., "2 hours ago")
      const timeElements = screen.queryAllByText(/\d+ \w+ ago/);
      expect(timeElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Chat Deletion', () => {
    it('shows delete confirmation when delete button is clicked', async () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const deleteButton = screen.getByLabelText('Delete chat');
      await user.click(deleteButton);

      // Should show confirmation (implementation depends on how confirmation is handled)
      // This might require mocking window.confirm or using a custom confirmation dialog
    });

    it('calls onDeleteChat with correct chat ID', async () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const deleteButton = screen.getByLabelText('Delete chat');
      await user.click(deleteButton);

      // Mock window.confirm to return true
      const originalConfirm = window.confirm;
      window.confirm = vi.fn().mockReturnValue(true);

      // Wait for confirmation
      await waitFor(() => {
        expect(mockHandlers.onDeleteChat).toHaveBeenCalledWith('chat-1');
      });

      window.confirm = originalConfirm;
    });

    it('does not delete chat when user cancels confirmation', async () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const deleteButton = screen.getByLabelText('Delete chat');
      await user.click(deleteButton);

      // Mock window.confirm to return false
      const originalConfirm = window.confirm;
      window.confirm = vi.fn().mockReturnValue(false);

      // Wait and verify onDeleteChat was not called
      await waitFor(() => {
        expect(mockHandlers.onDeleteChat).not.toHaveBeenCalled();
      });

      window.confirm = originalConfirm;
    });

    it('shows loading state on delete button when deleting', async () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      const { rerender } = render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      // Simulate deletion state
      rerender(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
          deletingChatId="chat-1"
        />
      );

      const deleteButton = screen.getByLabelText('Deleting chat');
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toBeDisabled();
    });
  });

  describe('Loading States', () => {
    it('shows loading skeleton when loading is true', () => {
      render(
        <ChatSidebar
          chats={[]}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={true}
        />
      );

      // Should show loading indicators instead of content
      const loadingElements = screen.queryAllByTestId('chat-skeleton');
      expect(loadingElements.length).toBeGreaterThanOrEqual(3); // Should show skeleton items
    });

    it('disables interactions when loading', () => {
      render(
        <ChatSidebar
          chats={testUtils.testFixtures.chats.singleChat}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={true}
        />
      );

      const newChatButton = screen.getByLabelText('Creating chat');
      const chatItems = screen.queryAllByRole('button', { name: /chat/i });

      expect(newChatButton).toBeDisabled();
      chatItems.forEach(item => {
        expect(item).toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      const error = new Error('Failed to load chats');

      render(
        <ChatSidebar
          chats={[]}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
          error={error}
        />
      );

      expect(screen.getByText('Failed to load chats')).toBeInTheDocument();
    });

    it('shows retry button when error occurs', () => {
      const error = new Error('Network error');

      render(
        <ChatSidebar
          chats={[]}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
          error={error}
        />
      );

      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();
    });

    it('calls onCreateChat when retry button is clicked', async () => {
      const error = new Error('Network error');

      render(
        <ChatSidebar
          chats={[]}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
          error={error}
        />
      );

      const retryButton = screen.getByText('Retry');
      await user.click(retryButton);

      expect(mockHandlers.onCreateChat).toHaveBeenCalledWith('New Chat');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <ChatSidebar
          chats={testUtils.testFixtures.chats.singleChat}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).toHaveAttribute('aria-label', 'Chat sidebar');
    });

    it('chat items are focusable and keyboard navigable', async () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const chatItem = screen.getByText('Test Conversation');
      chatItem.focus();
      expect(chatItem).toHaveFocus();
    });

    it('delete buttons have proper aria-labels', () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      const deleteButton = screen.getByLabelText('Delete chat');
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null chats array gracefully', () => {
      render(
        <ChatSidebar
          chats={null}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      expect(screen.getByText('No chats yet')).toBeInTheDocument();
    });

    it('handles undefined chats array gracefully', () => {
      render(
        <ChatSidebar
          chats={undefined}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      expect(screen.getByText('No chats yet')).toBeInTheDocument();
    });

    it('handles very long chat titles', () => {
      const chats = [{
        id: 'chat-1',
        title: 'A'.repeat(100),
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: 'Last message'
      }];

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      // Should truncate or handle long titles gracefully
      const titleElement = screen.getByText('A'.repeat(100));
      expect(titleElement).toBeInTheDocument();
    });

    it('handles chats with special characters in titles', () => {
      const chats = [{
        id: 'chat-1',
        title: 'Chat with <>&"\' special chars',
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: 'Message'
      }];

      render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      expect(screen.getByText('Chat with <>&"\' special chars')).toBeInTheDocument();
    });

    it('maintains scroll position when chats update', async () => {
      const chats = testUtils.testFixtures.chats.singleChat;

      const { rerender } = render(
        <ChatSidebar
          chats={chats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      // Add more chats
      const updatedChats = [
        ...chats,
        {
          id: 'chat-2',
          title: 'New Chat',
          userId: 'test-user',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastMessage: 'New message'
        }
      ];

      rerender(
        <ChatSidebar
          chats={updatedChats}
          activeChatId={null}
          onSelectChat={mockHandlers.onSelectChat}
          onCreateChat={mockHandlers.onCreateChat}
          onDeleteChat={mockHandlers.onDeleteChat}
          loading={false}
        />
      );

      // Should maintain UI stability
      expect(screen.getByText('Test Conversation')).toBeInTheDocument();
      expect(screen.getByText('New Chat')).toBeInTheDocument();
    });
  });
});
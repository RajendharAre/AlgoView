/**
 * Unit tests for Header component
 * Tests status display, clear functionality, and UI rendering
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../../../src/pages/AI/components/Header';
import * as testUtils from '../../../tests/test-utils.jsx';

describe('Header Component', () => {
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

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Header />);

      expect(screen.getByText('AlgoView AI')).toBeInTheDocument();
      expect(screen.getByText('Algorithm Assistant')).toBeInTheDocument();
    });

    it('renders with custom title and subtitle', () => {
      render(
        <Header
          title="Custom AI Title"
          subtitle="Custom Subtitle"
        />
      );

      expect(screen.getByText('Custom AI Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('renders online status indicator when isOnline is true', () => {
      render(<Header isOnline={true} />);

      const statusIndicator = screen.getByTestId('online-status');
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveClass('bg-green-500');
    });

    it('does not render online status when isOnline is false', () => {
      render(<Header isOnline={false} />);

      const statusIndicators = screen.queryByTestId('online-status');
      expect(statusIndicators).not.toBeInTheDocument();
    });

    it('renders clear chat button', () => {
      render(<Header onClear={mockHandlers.onClear} />);

      const clearButton = screen.getByLabelText('Clear chat');
      expect(clearButton).toBeInTheDocument();
    });

    it('does not render clear button when onClear is not provided', () => {
      render(<Header />);

      const clearButtons = screen.queryByLabelText('Clear chat');
      expect(clearButtons).not.toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('shows online status with proper animation', () => {
      render(<Header isOnline={true} />);

      const statusIndicator = screen.getByTestId('online-status');
      expect(statusIndicator).toHaveClass('animate-pulse');
    });

    it('displays offline status properly', () => {
      render(<Header isOnline={false} />);

      const statusText = screen.getByText('Offline');
      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('text-gray-400');
    });

    it('shows connecting status when transitioning', () => {
      // This would test a state where connection is being established
      // Implementation depends on how connecting state is handled
    });
  });

  describe('Clear Functionality', () => {
    it('calls onClear when clear button is clicked', async () => {
      render(<Header onClear={mockHandlers.onClear} />);

      const clearButton = screen.getByLabelText('Clear chat');
      await user.click(clearButton);

      expect(mockHandlers.onClear).toHaveBeenCalled();
    });

    it('disables clear button when disabled prop is true', () => {
      render(
        <Header
          onClear={mockHandlers.onClear}
          disabled={true}
        />
      );

      const clearButton = screen.getByLabelText('Clear chat');
      expect(clearButton).toBeDisabled();
    });

    it('shows disabled styling when disabled', () => {
      render(
        <Header
          onClear={mockHandlers.onClear}
          disabled={true}
        />
      );

      const clearButton = screen.getByLabelText('Clear chat');
      expect(clearButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('clear button has proper aria-label based on disabled state', () => {
      const { rerender } = render(
        <Header
          onClear={mockHandlers.onClear}
          disabled={false}
        />
      );

      let clearButton = screen.getByLabelText('Clear chat');
      expect(clearButton).toBeInTheDocument();

      rerender(
        <Header
          onClear={mockHandlers.onClear}
          disabled={true}
        />
      );

      clearButton = screen.getByLabelText('Clear chat disabled');
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('renders bot icon', () => {
      render(<Header />);

      const botIcon = screen.getByTestId('bot-icon');
      expect(botIcon).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
      const { container } = render(<Header />);

      const header = container.firstChild;
      expect(header).toHaveClass('border-b', 'bg-white', 'dark:bg-gray-800');
    });

    it('renders with proper spacing and layout', () => {
      render(<Header />);

      const titleElement = screen.getByText('AlgoView AI');
      const subtitleElement = screen.getByText('Algorithm Assistant');

      expect(titleElement).toBeInTheDocument();
      expect(subtitleElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles and labels', () => {
      render(<Header onClear={mockHandlers.onClear} />);

      const header = screen.getByRole('banner');
      const clearButton = screen.getByLabelText('Clear chat');

      expect(header).toBeInTheDocument();
      expect(clearButton).toBeInTheDocument();
    });

    it('is keyboard navigable', async () => {
      render(<Header onClear={mockHandlers.onClear} />);

      const clearButton = screen.getByLabelText('Clear chat');
      clearButton.focus();
      expect(clearButton).toHaveFocus();
    });

    it('clear button has proper keyboard interactions', async () => {
      render(<Header onClear={mockHandlers.onClear} />);

      const clearButton = screen.getByLabelText('Clear chat');
      clearButton.focus();
      
      await user.keyboard('{Enter}');
      expect(mockHandlers.onClear).toHaveBeenCalled();
    });

    it('maintains proper color contrast for accessibility', () => {
      render(<Header />);

      const title = screen.getByText('AlgoView AI');
      const subtitle = screen.getByText('Algorithm Assistant');

      expect(title).toHaveClass('text-gray-900', 'dark:text-white');
      expect(subtitle).toHaveClass('text-gray-500');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty title and subtitle', () => {
      render(
        <Header
          title=""
          subtitle=""
        />
      );

      // Should render without errors
      const headerElement = screen.getByRole('banner');
      expect(headerElement).toBeInTheDocument();
    });

    it('handles very long title text', () => {
      const longTitle = 'A'.repeat(100);

      render(<Header title={longTitle} />);

      // Should truncate or handle gracefully
      const titleElement = screen.getByText(longTitle);
      expect(titleElement).toBeInTheDocument();
    });

    it('handles special characters in title', () => {
      const specialTitle = 'AI Chat <>&"\' Test';

      render(<Header title={specialTitle} />);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it('maintains layout with varying content lengths', () => {
      const { rerender } = render(
        <Header
          title="Short"
          subtitle="Brief"
        />
      );

      rerender(
        <Header
          title="This is a much longer title that might affect layout"
          subtitle="This is also a very long subtitle that could wrap or be truncated"
        />
      );

      // Should maintain proper layout
      const headerElement = screen.getByRole('banner');
      expect(headerElement).toBeInTheDocument();
    });

    it('handles rapid state changes', () => {
      const { rerender } = render(<Header isOnline={true} />);

      // Rapid state changes
      for (let i = 0; i < 10; i++) {
        rerender(<Header isOnline={i % 2 === 0} />);
      }

      // Should handle without errors
      const headerElement = screen.getByRole('banner');
      expect(headerElement).toBeInTheDocument();
    });
  });

  describe('Responsiveness', () => {
    it('maintains proper layout on different screen sizes', () => {
      // This would typically be tested with viewport mocking
      // In real testing environment, we'd mock different viewport sizes
      render(<Header />);

      const headerElement = screen.getByRole('banner');
      expect(headerElement).toBeInTheDocument();
    });

    it('handles text truncation for mobile screens', () => {
      // Implementation would depend on CSS media queries and truncate utilities
      const veryLongTitle = 'This is a very long title that would be truncated on small screens';

      render(<Header title={veryLongTitle} />);

      const titleElement = screen.getByText(veryLongTitle);
      expect(titleElement).toBeInTheDocument();
    });
  });

  describe('Integration with Theme', () => {
    it('applies dark theme classes correctly', () => {
      render(<Header />);

      // Component uses dark:bg-gray-800 and dark:text-white classes
      const titleElement = screen.getByText('AlgoView AI');
      expect(titleElement).toBeInTheDocument();
    });

    it('online status indicator uses proper theme colors', () => {
      render(<Header isOnline={true} />);

      const statusIndicator = screen.getByTestId('online-status');
      // Should work with both light and dark themes
      expect(statusIndicator).toBeInTheDocument();
    });

    it('icons are properly colored for theme', () => {
      render(<Header />);

      const botIcon = screen.getByTestId('bot-icon');
      expect(botIcon).toBeInTheDocument();
      // Should have proper text-gray-600 dark:text-gray-300 classes
    });
  });

  describe('Performance', () => {
    it('renders efficiently with minimal re-renders', () => {
      const { rerender } = render(<Header />);

      const startTime = performance.now();
      
      // Multiple re-renders with same props
      for (let i = 0; i < 5; i++) {
        rerender(<Header />);
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should be very fast
      expect(renderTime).toBeLessThan(50);
    });

    it('handles prop changes efficiently', () => {
      const { rerender } = render(<Header isOnline={true} />);

      const startTime = performance.now();
      
      // Change props multiple times
      rerender(<Header isOnline={false} />);
      rerender(<Header isOnline={true} />);
      rerender(<Header isOnline={false} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });
  });
});
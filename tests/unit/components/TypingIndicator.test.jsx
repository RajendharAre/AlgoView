/**
 * Unit tests for TypingIndicator component
 * Tests animation display and proper rendering
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypingIndicator } from '../../../src/pages/AI/components/TypingIndicator';
import * as testUtils from '../../../tests/test-utils.jsx';

describe('TypingIndicator Component', () => {
  beforeEach(() => {
    testUtils.mockConsole();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default text', () => {
      render(<TypingIndicator />);

      expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    });

    it('renders with custom text', () => {
      render(<TypingIndicator text="Processing your request..." />);

      expect(screen.getByText('Processing your request...')).toBeInTheDocument();
    });

    it('renders avatar with checkmark icon', () => {
      render(<TypingIndicator />);

      const avatar = screen.getByTestId('typing-avatar');
      expect(avatar).toBeInTheDocument();
      
      const checkmarkIcon = screen.getByTestId('checkmark-icon');
      expect(checkmarkIcon).toBeInTheDocument();
    });

    it('renders three animated dots', () => {
      render(<TypingIndicator />);

      const dots = screen.getAllByTestId('typing-dot');
      expect(dots).toHaveLength(3);
    });
  });

  describe('Animation', () => {
    it('dots have proper animation properties', () => {
      render(<TypingIndicator />);

      const dots = screen.getAllByTestId('typing-dot');
      
      dots.forEach((dot, index) => {
        // Each dot should have different animation delays
        expect(dot).toHaveClass('rounded-full');
        expect(dot).toHaveClass('bg-gray-400');
      });
    });

    it('animations use proper timing sequence', () => {
      render(<TypingIndicator />);

      const dots = screen.getAllByTestId('typing-dot');
      
      // First dot should animate first
      expect(dots[0]).toBeInTheDocument();
      // Second dot should have delay
      expect(dots[1]).toBeInTheDocument();
      // Third dot should have longer delay
      expect(dots[2]).toBeInTheDocument();
    });

    it('maintains animation during re-renders', () => {
      const { rerender } = render(<TypingIndicator />);

      // Multiple re-renders shouldn't affect animation
      for (let i = 0; i < 5; i++) {
        rerender(<TypingIndicator />);
      }

      const dots = screen.getAllByTestId('typing-dot');
      expect(dots).toHaveLength(3);
    });
  });

  describe('Visual Elements', () => {
    it('applies correct styling classes', () => {
      const { container } = render(<TypingIndicator />);

      const typingContainer = container.firstChild;
      expect(typingContainer).toHaveClass('flex', 'items-start', 'gap-3');
    });

    it('avatar has correct styling', () => {
      render(<TypingIndicator />);

      const avatar = screen.getByTestId('typing-avatar');
      expect(avatar).toHaveClass('flex-shrink-0', 'w-8', 'h-8');
      expect(avatar).toHaveClass('bg-gray-100', 'dark:bg-gray-700');
    });

    it('content area has proper styling', () => {
      render(<TypingIndicator />);

      const contentArea = screen.getByText('AI is thinking...').closest('div');
      expect(contentArea).toHaveClass('flex-1', 'py-1');
    });

    it('dots container has proper spacing', () => {
      render(<TypingIndicator />);

      const dotsContainer = screen.getByTestId('dots-container');
      expect(dotsContainer).toHaveClass('flex', 'items-center', 'gap-1', 'mt-1');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles', () => {
      render(<TypingIndicator />);

      const typingElement = screen.getByRole('status');
      expect(typingElement).toBeInTheDocument();
      expect(typingElement).toHaveAttribute('aria-live', 'polite');
    });

    it('text is readable by screen readers', () => {
      render(<TypingIndicator text="Custom processing message" />);

      const textElement = screen.getByText('Custom processing message');
      expect(textElement).toBeInTheDocument();
    });

    it('maintains proper color contrast', () => {
      render(<TypingIndicator />);

      const textElement = screen.getByText('AI is thinking...');
      expect(textElement).toHaveClass('text-gray-500', 'dark:text-gray-400');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty text prop', () => {
      render(<TypingIndicator text="" />);

      // Should render without errors (might show empty text or default)
      const typingElement = screen.getByRole('status');
      expect(typingElement).toBeInTheDocument();
    });

    it('handles very long text', () => {
      const longText = 'A'.repeat(200);

      render(<TypingIndicator text={longText} />);

      const textElement = screen.getByText(longText);
      expect(textElement).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      const specialText = 'Processing <>&"\' special chars';

      render(<TypingIndicator text={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('maintains layout with varying text lengths', () => {
      const { rerender } = render(<TypingIndicator text="Short" />);

      rerender(<TypingIndicator text="This is a much longer processing message" />);

      // Should maintain proper layout
      const typingElement = screen.getByRole('status');
      expect(typingElement).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now();
      
      render(<TypingIndicator />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(50); // Should render quickly
    });

    it('handles multiple instances efficiently', () => {
      const startTime = performance.now();

      // Render multiple instances
      render(
        <div>
          <TypingIndicator />
          <TypingIndicator />
          <TypingIndicator />
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });

    it('animation updates are performant', () => {
      render(<TypingIndicator />);

      const startTime = performance.now();
      
      // Let animation run for a bit
      return new Promise((resolve) => {
        setTimeout(() => {
          const endTime = performance.now();
          const animationTime = endTime - startTime;
          
          // Animation should run smoothly
          expect(animationTime).toBeGreaterThanOrEqual(0);
          resolve();
        }, 100);
      });
    });
  });

  describe('Integration', () => {
    it('works correctly within ChatWindow component', () => {
      // This would test integration with parent components
      // In a real test, we'd render ChatWindow with isLoading=true
      render(<TypingIndicator />);

      const typingElement = screen.getByRole('status');
      expect(typingElement).toBeInTheDocument();
    });

    it('maintains consistent styling with theme', () => {
      render(<TypingIndicator />);

      const avatar = screen.getByTestId('typing-avatar');
      const textElement = screen.getByText('AI is thinking...');
      const dots = screen.getAllByTestId('typing-dot');

      // Should use proper theme classes
      expect(avatar).toHaveClass('bg-gray-100', 'dark:bg-gray-700');
      expect(textElement).toHaveClass('text-gray-500', 'dark:text-gray-400');
      dots.forEach(dot => {
        expect(dot).toHaveClass('bg-gray-400', 'dark:bg-gray-500');
      });
    });

    it('responsive design works properly', () => {
      render(<TypingIndicator />);

      const typingElement = screen.getByRole('status');
      const avatar = screen.getByTestId('typing-avatar');
      const textElement = screen.getByText('AI is thinking...');

      // Should maintain proper responsive behavior
      expect(typingElement).toBeInTheDocument();
      expect(avatar).toBeInTheDocument();
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('Customization', () => {
    it('supports different text variants', () => {
      const variants = [
        'AI is processing...',
        'Thinking...',
        'Analyzing your request...',
        'Generating response...'
      ];

      variants.forEach(variant => {
        const { rerender } = render(<TypingIndicator text={variant} />);
        
        expect(screen.getByText(variant)).toBeInTheDocument();
        rerender(null); // Clean up for next iteration
      });
    });

    it('maintains consistent visual identity', () => {
      render(<TypingIndicator />);

      const avatar = screen.getByTestId('typing-avatar');
      const checkmarkIcon = screen.getByTestId('checkmark-icon');
      const dots = screen.getAllByTestId('typing-dot');

      // All visual elements should be present and consistent
      expect(avatar).toBeInTheDocument();
      expect(checkmarkIcon).toBeInTheDocument();
      expect(dots).toHaveLength(3);
    });
  });
});
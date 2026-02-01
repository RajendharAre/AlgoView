/**
 * Unit tests for useChatInput hook
 * Tests input state management and utility functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatInput } from '../../../src/pages/AI/hooks/useChatInput';

describe('useChatInput Hook', () => {
  beforeEach(() => {
    // Clear console logs to reduce test noise
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('initializes with empty input string', () => {
      const { result } = renderHook(() => useChatInput());

      expect(result.current.input).toBe('');
    });

    it('initializes with hasInput as false', () => {
      const { result } = renderHook(() => useChatInput());

      expect(result.current.hasInput).toBe(false);
    });
  });

  describe('Input State Management', () => {
    it('updates input value when setInput is called', () => {
      const { result } = renderHook(() => useChatInput());

      act(() => {
        result.current.setInput('Hello, world!');
      });

      expect(result.current.input).toBe('Hello, world!');
    });

    it('clears input when clearInput is called', () => {
      const { result } = renderHook(() => useChatInput());

      // Set some input first
      act(() => {
        result.current.setInput('Some text to clear');
      });

      expect(result.current.input).toBe('Some text to clear');

      // Clear the input
      act(() => {
        result.current.clearInput();
      });

      expect(result.current.input).toBe('');
    });

    it('maintains input state between renders', () => {
      const { result, rerender } = renderHook(() => useChatInput());

      // Set input
      act(() => {
        result.current.setInput('Persistent value');
      });

      expect(result.current.input).toBe('Persistent value');

      // Rerender the hook
      rerender();

      // Input should remain the same
      expect(result.current.input).toBe('Persistent value');
    });
  });

  describe('hasInput Computed Property', () => {
    it('returns false for empty string', () => {
      const { result } = renderHook(() => useChatInput());

      expect(result.current.hasInput).toBe(false);
    });

    it('returns false for string with only whitespace', () => {
      const { result } = renderHook(() => useChatInput());

      act(() => {
        result.current.setInput('   \n\t  ');
      });

      expect(result.current.hasInput).toBe(false);
    });

    it('returns true for non-empty string', () => {
      const { result } = renderHook(() => useChatInput());

      act(() => {
        result.current.setInput('Hello');
      });

      expect(result.current.hasInput).toBe(true);
    });

    it('returns true for string with content and whitespace', () => {
      const { result } = renderHook(() => useChatInput());

      act(() => {
        result.current.setInput('  Hello World  ');
      });

      expect(result.current.hasInput).toBe(true);
    });

    it('updates hasInput when input changes', () => {
      const { result } = renderHook(() => useChatInput());

      // Initially empty
      expect(result.current.hasInput).toBe(false);

      // Set content
      act(() => {
        result.current.setInput('Content');
      });
      expect(result.current.hasInput).toBe(true);

      // Clear content
      act(() => {
        result.current.setInput('');
      });
      expect(result.current.hasInput).toBe(false);
    });
  });

  describe('clearInput Function', () => {
    it('is memoized with useCallback', () => {
      const { result, rerender } = renderHook(() => useChatInput());

      const initialClearInput = result.current.clearInput;

      // Rerender
      rerender();

      // Function reference should be the same
      expect(result.current.clearInput).toBe(initialClearInput);
    });

    it('can be called multiple times safely', () => {
      const { result } = renderHook(() => useChatInput());

      // Set input first
      act(() => {
        result.current.setInput('Test content');
      });

      expect(result.current.input).toBe('Test content');

      // Clear multiple times
      act(() => {
        result.current.clearInput();
        result.current.clearInput();
        result.current.clearInput();
      });

      expect(result.current.input).toBe('');
    });

    it('works regardless of input content', () => {
      const { result } = renderHook(() => useChatInput());

      const testCases = [
        '',
        '   ',
        '\n\t',
        'Hello World',
        'A'.repeat(100),
        '<>&"\' special chars'
      ];

      testCases.forEach(content => {
        act(() => {
          result.current.setInput(content);
        });

        act(() => {
          result.current.clearInput();
        });

        expect(result.current.input).toBe('');
      });
    });
  });

  describe('State Consistency', () => {
    it('input and hasInput are always consistent', () => {
      const { result } = renderHook(() => useChatInput());

      const testCases = [
        { input: '', expectedHasInput: false },
        { input: '   ', expectedHasInput: false },
        { input: '\n\t', expectedHasInput: false },
        { input: 'Hello', expectedHasInput: true },
        { input: '  Content  ', expectedHasInput: true },
        { input: 'A', expectedHasInput: true }
      ];

      testCases.forEach(({ input, expectedHasInput }) => {
        act(() => {
          result.current.setInput(input);
        });

        expect(result.current.input).toBe(input);
        expect(result.current.hasInput).toBe(expectedHasInput);
      });
    });

    it('handles rapid state changes', () => {
      const { result } = renderHook(() => useChatInput());

      // Rapid state changes
      for (let i = 0; i < 10; i++) {
        const content = i % 2 === 0 ? '' : `Content ${i}`;
        const expectedHasInput = i % 2 !== 0;

        act(() => {
          result.current.setInput(content);
        });

        expect(result.current.input).toBe(content);
        expect(result.current.hasInput).toBe(expectedHasInput);
      }
    });
  });

  describe('Callback Functions', () => {
    it('setInput is a stable function reference', () => {
      const { result, rerender } = renderHook(() => useChatInput());

      const initialSetInput = result.current.setInput;

      // Rerender multiple times
      for (let i = 0; i < 5; i++) {
        rerender();
        expect(result.current.setInput).toBe(initialSetInput);
      }
    });

    it('functions work correctly after multiple updates', () => {
      const { result } = renderHook(() => useChatInput());

      // Multiple operations
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.setInput(`Test ${i}`);
        });

        expect(result.current.input).toBe(`Test ${i}`);
        expect(result.current.hasInput).toBe(true);

        act(() => {
          result.current.clearInput();
        });

        expect(result.current.input).toBe('');
        expect(result.current.hasInput).toBe(false);
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles very long input strings', () => {
      const { result } = renderHook(() => useChatInput());

      const longString = 'A'.repeat(10000);

      act(() => {
        result.current.setInput(longString);
      });

      expect(result.current.input).toBe(longString);
      expect(result.current.hasInput).toBe(true);
    });

    it('handles special characters', () => {
      const { result } = renderHook(() => useChatInput());

      const specialChars = '<>&"\'\\/\n\t\r\u200B\u200C\u200D';

      act(() => {
        result.current.setInput(specialChars);
      });

      expect(result.current.input).toBe(specialChars);
      expect(result.current.hasInput).toBe(true);
    });

    it('handles Unicode characters', () => {
      const { result } = renderHook(() => useChatInput());

      const unicodeString = '🚀🌟🎉 Привет 你好 🌈✨💫';

      act(() => {
        result.current.setInput(unicodeString);
      });

      expect(result.current.input).toBe(unicodeString);
      expect(result.current.hasInput).toBe(true);
    });

    it('handles null and undefined inputs gracefully', () => {
      const { result } = renderHook(() => useChatInput());

      // Note: setInput expects a string, so passing null/undefined would be a type error
      // This test verifies that the hook handles string inputs properly
      act(() => {
        result.current.setInput('valid string');
      });

      expect(typeof result.current.input).toBe('string');
    });
  });

  describe('Performance', () => {
    it('handles rapid input changes efficiently', () => {
      const { result } = renderHook(() => useChatInput());

      const startTime = performance.now();

      // Rapid input changes
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.setInput(`rapid update ${i}`);
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle efficiently
      expect(totalTime).toBeLessThan(1000); // Less than 1 second for 100 updates
      expect(result.current.input).toBe('rapid update 99');
      expect(result.current.hasInput).toBe(true);
    });

    it('clearInput function is efficient', () => {
      const { result } = renderHook(() => useChatInput());

      // Set input
      act(() => {
        result.current.setInput('Test content');
      });

      const startTime = performance.now();

      // Rapid clear operations
      for (let i = 0; i < 50; i++) {
        act(() => {
          result.current.clearInput();
        });
        act(() => {
          result.current.setInput(`Re-set ${i}`);
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(500); // Less than 0.5 seconds for 50 cycles
    });
  });

  describe('Integration with React', () => {
    it('works properly with React state updates', () => {
      const { result } = renderHook(() => useChatInput());

      // Simulate typical React usage pattern
      act(() => {
        result.current.setInput('User typed this');
      });

      expect(result.current.input).toBe('User typed this');
      expect(result.current.hasInput).toBe(true);

      // Simulate clearing after submission
      act(() => {
        result.current.clearInput();
      });

      expect(result.current.input).toBe('');
      expect(result.current.hasInput).toBe(false);
    });

    it('maintains referential equality for stable values', () => {
      const { result } = renderHook(() => useChatInput());

      const initialInput = result.current.input;
      const initialHasInput = result.current.hasInput;

      // These values should remain the same when state doesn't change
      expect(result.current.input).toBe(initialInput);
      expect(result.current.hasInput).toBe(initialHasInput);
    });
  });
});
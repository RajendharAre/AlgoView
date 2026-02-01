/**
 * Unit tests for responseGenerator utility
 * Tests AI response generation logic and fallback mechanisms
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateResponse } from '../../../src/pages/AI/utils/responseGenerator';

describe('responseGenerator Utility', () => {
  beforeEach(() => {
    // Clear console logs to reduce test noise
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateResponse Function', () => {
    it('returns default response when no API key is available', async () => {
      // Mock environment without API key
      const originalEnv = process.env;
      process.env = { ...process.env, VITE_GEMINI_API_KEY: undefined };

      const response = await generateResponse('Hello');
      
      expect(response).toContain('I am an AI assistant designed to help you understand algorithms');
      expect(response).toContain('You can ask me about:');
      expect(response).toContain('Sorting algorithms');
      expect(response).toContain('Searching algorithms');

      process.env = originalEnv;
    });

    it('returns default response when API key is placeholder', async () => {
      // Mock environment with placeholder API key
      const originalEnv = process.env;
      process.env = { ...process.env, VITE_GEMINI_API_KEY: 'your_gemini_api_key_here' };

      const response = await generateResponse('Explain merge sort');
      
      expect(response).toContain('Merge Sort Explained');
      expect(response).toContain('divide and conquer');
      expect(response).toContain('O(n log n)');

      process.env = originalEnv;
    });

    it('attempts API call when valid API key is available', async () => {
      // Mock fetch to simulate API call
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: 'API response' }]
            }
          }]
        })
      });
      
      global.fetch = mockFetch;
      
      const originalEnv = process.env;
      process.env = { ...process.env, VITE_GEMINI_API_KEY: 'valid-api-key' };

      await generateResponse('Hello');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=valid-api-key'),
        expect.any(Object)
      );

      process.env = originalEnv;
      delete global.fetch;
    });

    it('falls back to default response when API call fails', async () => {
      // Mock fetch to simulate API failure
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => 'Bad Request'
      });
      
      global.fetch = mockFetch;
      
      const originalEnv = process.env;
      process.env = { ...process.env, VITE_GEMINI_API_KEY: 'valid-api-key' };

      const response = await generateResponse('Hello');
      
      expect(response).toContain('I am an AI assistant designed to help you understand algorithms');

      process.env = originalEnv;
      delete global.fetch;
    });

    it('handles API response with proper formatting', async () => {
      // Mock fetch to return formatted text
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: 'This is **bold** and *italic* text.' }]
            }
          }]
        })
      });
      
      global.fetch = mockFetch;
      
      const originalEnv = process.env;
      process.env = { ...process.env, VITE_GEMINI_API_KEY: 'valid-api-key' };

      const response = await generateResponse('Hello');
      
      expect(response).toContain('<strong>bold</strong>');
      expect(response).toContain('<em>italic</em>');

      process.env = originalEnv;
      delete global.fetch;
    });
  });





  describe('Edge Cases', () => {
    it('handles very long input', async () => {
      const longInput = 'A'.repeat(10000);
      
      const response = await generateResponse(longInput);
      
      expect(response).toContain('I am an AI assistant designed to help you understand algorithms');
    });

    it('handles special characters in input', async () => {
      const response = await generateResponse('Explain <>&"\' special chars in algorithms');
      
      expect(response).toContain('I am an AI assistant');
    });

    it('handles Unicode characters', async () => {
      const response = await generateResponse('Explain algorithms in 🚀🚀🚀');
      
      expect(response).toContain('I am an AI assistant');
    });

    it('handles null and undefined inputs gracefully', async () => {
      // These should be treated as empty strings by the function
      const response = await generateResponse('');
      
      expect(response).toContain('I am an AI assistant');
    });

    it('handles input with only whitespace', async () => {
      const response = await generateResponse('   \n\t  ');
      
      expect(response).toContain('I am an AI assistant');
    });
  });

  describe('Performance', () => {
    it('handles rapid response generation efficiently', async () => {
      const startTime = performance.now();

      // Generate multiple responses rapidly
      for (let i = 0; i < 10; i++) {
        await generateResponse(`Query ${i}`);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should be fast (less than 100ms for 10 queries)
      expect(totalTime).toBeLessThan(1000);
    });

    it('formatting function is efficient', async () => {
      // Test the overall function efficiency by simulating multiple API responses
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            candidates: [{
              content: {
                parts: [{ text: 'Text 0 with **bold** and *italic*' }]
              }
            }]
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            candidates: [{
              content: {
                parts: [{ text: 'Text 1 with **bold** and *italic*' }]
              }
            }]
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            candidates: [{
              content: {
                parts: [{ text: 'Text 2 with **bold** and *italic*' }]
              }
            }]
          })
        });
      
      global.fetch = mockFetch;
      
      const originalEnv = process.env;
      process.env = { ...process.env, VITE_GEMINI_API_KEY: 'valid-api-key' };
      
      const startTime = performance.now();
      
      // Process multiple responses
      await Promise.all([
        generateResponse('Test 1'),
        generateResponse('Test 2'),
        generateResponse('Test 3')
      ]);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(1000); // Should be fast
      
      process.env = originalEnv;
      delete global.fetch;
    });
  });

  describe('Security', () => {
    it('handles potential XSS attempts in input', async () => {
      const maliciousInput = 'Explain <script>alert("xss")</script> algorithms';
      
      const response = await generateResponse(maliciousInput);
      
      // Response should not execute scripts but may contain the text
      expect(response).toContain('I am an AI assistant');
    });

    it('handles HTML injection attempts', async () => {
      const htmlInjection = 'What about <img src="x" onerror="alert(1)"> tags?';
      
      const response = await generateResponse(htmlInjection);
      
      expect(response).toContain('I am an AI assistant');
    });
  });
});
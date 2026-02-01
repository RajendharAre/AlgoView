/**
 * Test Gemini API - Check daily limit and API functionality
 * Usage: node test-gemini-api.js
 * 
 * This script tests:
 * 1. API key configuration
 * 2. Basic API connectivity
 * 3. Daily quota usage
 * 4. Response generation
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`),
};

async function testGeminiAPI() {
  log.header('GEMINI API TEST SUITE');

  // Test 1: Check API Key
  log.info('Test 1: Checking API Key...');
  if (!API_KEY) {
    log.error('VITE_GEMINI_API_KEY not found in .env file');
    log.info('Please add VITE_GEMINI_API_KEY=your_api_key to .env');
    return;
  }
  log.success(`API Key found (length: ${API_KEY.length})`);

  // Test 2: Basic connectivity
  log.info('\nTest 2: Testing basic API connectivity...');
  const testPayload = {
    contents: [
      {
        parts: [
          {
            text: 'Say "Hello, API is working!" in one sentence.',
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const data = await response.json();

    if (response.status === 200) {
      log.success('API connectivity successful');
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        log.success(`Response: "${data.candidates[0].content.parts[0].text}"`);
      }
    } else if (response.status === 429) {
      log.error('QUOTA EXCEEDED: Daily limit (20 requests/day) reached');
      log.warning('Please try again tomorrow or upgrade your API quota');
      if (data.error?.message) {
        log.info(`Error details: ${data.error.message}`);
      }
      return;
    } else if (response.status === 401 || response.status === 403) {
      log.error('AUTHENTICATION ERROR: Invalid API key');
      log.warning('Please check your VITE_GEMINI_API_KEY in .env file');
      if (data.error?.message) {
        log.info(`Error: ${data.error.message}`);
      }
      return;
    } else {
      log.error(`API Error (${response.status}): ${data.error?.message || 'Unknown error'}`);
      return;
    }
  } catch (error) {
    log.error(`Network error: ${error.message}`);
    log.info('Make sure you have internet connection');
    return;
  }

  // Test 3: System prompt functionality
  log.info('\nTest 3: Testing with system prompt (Educational focus)...');
  const systemPromptPayload = {
    contents: [
      {
        parts: [
          {
            text: 'What is a binary search tree?',
          },
        ],
      },
    ],
    system: [
      {
        parts: [
          {
            text: 'You are an AI educational assistant specialized in algorithms, data structures, and computer science. Provide clear, educational responses focused on learning.',
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(systemPromptPayload),
    });

    const data = await response.json();

    if (response.status === 200) {
      log.success('System prompt test successful');
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const responseText = data.candidates[0].content.parts[0].text;
        const preview = responseText.substring(0, 150);
        log.info(`Response preview: "${preview}${responseText.length > 150 ? '...' : ''}"`);
      }
    } else if (response.status === 429) {
      log.error('QUOTA EXCEEDED: Daily limit reached');
      log.warning('You have reached the 20 requests/day limit');
      return;
    } else {
      log.error(`API Error: ${data.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    log.error(`Network error: ${error.message}`);
  }

  // Test 4: Check rate limiting info
  log.info('\nTest 4: Checking rate limit headers...');
  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const headers = response.headers.raw ? response.headers.raw() : Object.fromEntries(response.headers);
    
    // Check for rate limit headers
    const rateLimitHeaders = Object.keys(headers).filter(h => 
      h.toLowerCase().includes('rate') || 
      h.toLowerCase().includes('quota') ||
      h.toLowerCase().includes('limit') ||
      h.toLowerCase().includes('remaining')
    );

    if (rateLimitHeaders.length > 0) {
      log.success('Rate limit info found:');
      rateLimitHeaders.forEach(header => {
        log.info(`  ${header}: ${headers[header]}`);
      });
    } else {
      log.warning('No explicit rate limit headers returned');
      log.info('Note: Gemini API has a daily limit of 20 free requests/day');
      log.info('If you get 429 errors, you have exceeded the daily quota');
    }
  } catch (error) {
    log.warning(`Could not retrieve rate limit info: ${error.message}`);
  }

  // Summary
  log.header('TEST SUMMARY');
  log.success('All tests completed!');
  log.info('If you received a 429 error, your daily limit is exceeded.');
  log.info('Daily limit: 20 requests/day for free tier');
  log.info('Next reset: Tomorrow UTC');
}

testGeminiAPI().catch(console.error);

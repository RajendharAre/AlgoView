/**
 * Service to interact with LeetCode API for fetching recent submissions
 * This is a mock implementation for demonstration purposes
 */

/**
 * Fetch recent submissions for a given LeetCode username
 * @param {string} username - LeetCode username
 * @returns {Promise<Array>} Array of recent submissions
 */
export const fetchRecentSubmissions = async (username) => {
  console.log('\n=== LEETCODE API DEBUG ===');
  console.log('fetchRecentSubmissions called for username:', username);
  
  // In a real implementation, this would call your backend API
  // that acts as a proxy to LeetCode's API to avoid CORS issues
  
  try {
    // Attempt to call the real API first
    // The proxy in setupProxy.js will forward this request to http://localhost:5000
    console.log('Making API request to /api/leetcode/', username, '/recent-submissions');
    
    const startTime = Date.now();
    const response = await fetch(`/api/leetcode/${username}/recent-submissions`);
    const endTime = Date.now();
    
    console.log('API response received with status:', response.status);
    console.log('Response time:', endTime - startTime, 'ms');
    
    if (!response.ok) {
      console.warn(`❌ API call failed with status ${response.status}`);
      console.warn('Response text:', await response.text());
      
      // Check if it's a 404 (user not found) or other error
      if (response.status === 404) {
        console.log('User not found on LeetCode, falling back to mock data');
      } else if (response.status === 500) {
        console.log('Backend server error, falling back to mock data');
      } else {
        console.log('Other API error, falling back to mock data');
      }
      
      // If the API call fails, fall back to mock data
      console.log('Falling back to mock data for development/testing');
      return mockFetchRecentSubmissions(username);
    }
    
    const data = await response.json();
    console.log('✅ API response data received:', data);
    
    if (data.submissions) {
      console.log('Found submissions array with', data.submissions.length, 'items');
      console.log('Sample submission:', data.submissions[0]);
    } else {
      console.log('⚠️ No submissions array in response');
      console.log('Full response structure:', Object.keys(data));
    }
    
    return data.submissions || [];
    
  } catch (error) {
    console.error('❌ Error fetching LeetCode submissions:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Specific error handling
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('Network error - backend server may not be running on localhost:5000');
    }
    
    // In case of network error (backend not running), fallback to mock data
    console.log('Using mock data for development - backend may not be running');
    return mockFetchRecentSubmissions(username);
  } finally {
    console.log('=== LEETCODE API DEBUG END ===\n');
  }
};

/**
 * Validate if a user has solved a specific problem recently
 * @param {string} username - LeetCode username
 * @param {string} problemSlug - Problem slug (e.g., 'two-sum')
 * @param {number} sessionTimestamp - Timestamp when user started solving
 * @returns {Promise<boolean>} True if problem was solved after session started
 */
export const validateProblemSolved = async (username, problemSlug, sessionTimestamp) => {
  console.log('validateProblemSolved called with:', { username, problemSlug, sessionTimestamp });
  
  try {
    if (!problemSlug) {
      console.error('Problem slug is undefined or null, validation will fail');
      return false;
    }
    
    const submissions = await fetchRecentSubmissions(username);
    console.log('Received submissions for validation:', submissions);
    
    // Find if there's an accepted submission for this problem after the session started
    const successfulSubmission = submissions.find(submission => 
      submission.titleSlug === problemSlug &&
      submission.status === 'Accepted' &&
      submission.timestamp * 1000 > sessionTimestamp  // Convert to milliseconds
    );
    
    console.log('Searching for slug:', problemSlug, 'with timestamp after:', new Date(sessionTimestamp));
    console.log('Successful submission found:', successfulSubmission);
    return !!successfulSubmission;
  } catch (error) {
    console.error('Error validating problem solution:', error);
    // In case of API error, we could implement a fallback strategy
    // For now, re-throw the error to be handled by the calling function
    throw error;
  }
};

/**
 * Alternative method to validate problem solving with fallback options
 * This could be used if the primary API fails
 */
export const validateProblemSolvedWithFallback = async (username, problemSlug, sessionTimestamp) => {
  try {
    // Try primary validation
    return await validateProblemSolved(username, problemSlug, sessionTimestamp);
  } catch (primaryError) {
    console.warn('Primary validation failed, attempting fallback:', primaryError.message);
    
    // Fallback: could implement alternative validation methods here
    // For example, showing a manual verification option to the user
    throw primaryError; // Re-throw for now, but could implement UI for manual verification
  }
};

/**
 * Mock function to simulate API call to LeetCode
 * This would be replaced with actual API calls in a real implementation
 */
export const mockFetchRecentSubmissions = async (username) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data - in a real implementation, this would come from LeetCode API
  return [
    {
      id: 1,
      title: "Two Sum",
      titleSlug: "two-sum",
      status: "Accepted",
      lang: "javascript",
      timestamp: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      url: `https://leetcode.com/submissions/detail/123456789/`
    },
    {
      id: 2,
      title: "Add Two Numbers",
      titleSlug: "add-two-numbers",
      status: "Accepted",
      lang: "javascript",
      timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      url: `https://leetcode.com/submissions/detail/123456788/`
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      titleSlug: "longest-substring-without-repeating-characters",
      status: "Wrong Answer",
      lang: "python3",
      timestamp: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      url: `https://leetcode.com/submissions/detail/123456787/`
    }
  ];
};
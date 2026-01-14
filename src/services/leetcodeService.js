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
  // In a real implementation, this would call your backend API
  // that acts as a proxy to LeetCode's API to avoid CORS issues
  
  try {
    // Attempt to call the real API first
    // The proxy in setupProxy.js will forward this request to http://localhost:5000
    const response = await fetch(`/api/leetcode/${username}/recent-submissions`);
    
    if (!response.ok) {
      console.warn(`API call failed with status ${response.status}, falling back to mock data`);
      // If the API call fails, fall back to mock data
      return mockFetchRecentSubmissions(username);
    }
    
    const data = await response.json();
    return data.submissions || [];
    
  } catch (error) {
    console.error('Error fetching LeetCode submissions:', error);
    // In case of network error (backend not running), fallback to mock data
    console.log('Using mock data for development - backend may not be running');
    return mockFetchRecentSubmissions(username);
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
  try {
    const submissions = await fetchRecentSubmissions(username);
    
    // Find if there's an accepted submission for this problem after the session started
    const successfulSubmission = submissions.find(submission => 
      submission.titleSlug === problemSlug &&
      submission.status === 'Accepted' &&
      submission.timestamp * 1000 > sessionTimestamp  // Convert to milliseconds
    );
    
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
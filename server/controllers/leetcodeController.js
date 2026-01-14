/**
 * Controller to handle LeetCode API integration
 * This would be part of a backend service that acts as a proxy to LeetCode's API
 */

const axios = require('axios');

/**
 * Fetch recent submissions for a given LeetCode username
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRecentSubmissions = async (req, res) => {
  const { username } = req.params;
  
  try {
    // LeetCode API endpoint for user profile
    // Note: This is based on reverse-engineered LeetCode API, subject to change
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: `
          query getUserProfile($username: String!) {
            recentAcSubmissionList(username: $username, limit: 20) {
              id
              title
              titleSlug
              status
              lang
              timestamp
              url
            }
          }
        `,
        variables: { username }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    if (response.data && response.data.data) {
      res.json({
        submissions: response.data.data.recentAcSubmissionList || []
      });
    } else {
      res.status(404).json({ 
        error: 'Could not fetch submissions. Make sure the username is correct and the profile is public.' 
      });
    }
  } catch (error) {
    console.error('Error fetching LeetCode submissions:', error);
    
    // Check if it's a 404 (user not found) or other error
    if (error.response && error.response.status === 404) {
      res.status(404).json({ 
        error: 'LeetCode user not found. Please check the username.' 
      });
    } else if (error.response && error.response.status === 403) {
      res.status(403).json({ 
        error: 'Access forbidden. The user\'s profile may be private.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch submissions from LeetCode. Please try again later.' 
      });
    }
  }
};

module.exports = {
  getRecentSubmissions
};
/**
 * Routes for LeetCode API integration
 */

const express = require('express');
const router = express.Router();
const { getRecentSubmissions } = require('../controllers/leetcodeController');

// Route to get recent submissions for a user
router.get('/:username/recent-submissions', getRecentSubmissions);

module.exports = router;
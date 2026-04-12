const express = require('express')
const router = express.Router()
const {
  requestInterview,
  acceptInterview,
  getInterviewSession,
  completeInterview,
  getAllSessions,
  submitReview,
} = require('../controllers/interviewController')

/**
 * POST /api/interview/request
 * Request a new interview session
 */
router.post('/request', requestInterview)

/**
 * GET /api/interview/accept
 * Accept an interview request (triggered by email link)
 */
router.get('/accept', acceptInterview)

/**
 * GET /api/interview/admin/sessions
 * Get all active interview sessions (admin only)
 * ⚠️ IMPORTANT: This MUST come BEFORE /:sessionId route!
 */
router.get('/admin/sessions', getAllSessions)

/**
 * POST /api/interview/:sessionId/review
 * Submit review and rating for an interview
 * ⚠️ IMPORTANT: This MUST come BEFORE GET /:sessionId route!
 */
router.post('/:sessionId/review', submitReview)

/**
 * POST /api/interview/:sessionId/complete
 * Complete an interview and submit feedback
 * ⚠️ IMPORTANT: This MUST come BEFORE GET /:sessionId route!
 */
router.post('/:sessionId/complete', completeInterview)

/**
 * GET /api/interview/:sessionId
 * Get details of a specific interview session
 * ⚠️ IMPORTANT: This is LAST because it matches any session ID!
 */
router.get('/:sessionId', getInterviewSession)

module.exports = router

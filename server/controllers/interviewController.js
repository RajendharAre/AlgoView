const nodemailer = require('nodemailer')

// Configure your email service using SMTP from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
})

// Store active interview requests (in production, use a database like Firebase/MongoDB)
const activeInterviews = new Map()

// Google Meet links - add more URLs here as needed in the future
const interviewMeetLinks = [
  'https://meet.google.com/dsd-rosb-rvo'
]

// Get a meet link (can assign different links for different interviewers later)
const generateMeetLink = () => {
  return interviewMeetLinks[0] // Currently using the first link, can expand later
}

/**
 * Request an interview session
 * POST /api/interview/request
 */
exports.requestInterview = async (req, res) => {
  try {
    console.log('📨 Received interview request:', req.body)
    
    const { userId, userName, userEmail, topic, difficulty, duration } = req.body

    // Validate required fields
    if (!userId || !userEmail || !topic || !difficulty || !duration) {
      console.warn('❌ Validation failed - missing fields:', {
        userId: !!userId,
        userEmail: !!userEmail,
        topic: !!topic,
        difficulty: !!difficulty,
        duration: !!duration,
      })
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      })
    }

    console.log('✅ Validation passed')

    // Generate a unique session ID
    const sessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('🔑 Generated session ID:', sessionId)

    // Generate Google Meet link
    const meetLink = generateMeetLink()

    // Create interview session object
    const interviewSession = {
      sessionId,
      userId,
      userName,
      userEmail,
      topic,
      difficulty,
      duration: parseInt(duration),
      meetLink,
      status: 'waiting', // waiting, accepted, in-progress, completed
      createdAt: new Date(),
      acceptedAt: null,
      startedAt: null,
      completedAt: null,
      rating: null,
    }

    // Store the session in memory (in production, save to database)
    activeInterviews.set(sessionId, interviewSession)

    // Send email notification to admin/interviewer
    const emailContent = `
      <h2>New Interview Request</h2>
      <p>A user has requested a mock interview session.</p>
      <h3>Interview Details:</h3>
      <ul>
        <li><strong>User Name:</strong> ${userName}</li>
        <li><strong>User Email:</strong> ${userEmail}</li>
        <li><strong>Topic:</strong> ${topic}</li>
        <li><strong>Difficulty Level:</strong> ${difficulty}</li>
        <li><strong>Duration:</strong> ${duration} minutes</li>
        <li><strong>Session ID:</strong> ${sessionId}</li>
      </ul>
      <h3>Meet Link:</h3>
      <p><a href="${meetLink}" target="_blank">${meetLink}</a></p>
      <p>
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/api/interview/accept?sessionId=${sessionId}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Accept Interview
        </a>
      </p>
      <p>This request will expire in 5 minutes if not accepted.</p>
    `

    // Send email to admin (graceful error handling)
    try {
      await transporter.sendMail({
        from: process.env.SUPPORT_FROM_EMAIL || process.env.SMTP_USER || 'algoview@example.com',
        to: 'arerajendhar33@gmail.com',
        subject: `New Interview Request - ${topic} (${difficulty})`,
        html: emailContent,
      })
      console.log(`✅ Interview request email sent for session ${sessionId}`)
    } catch (emailError) {
      console.warn(
        `⚠️ Failed to send interview request email: ${emailError.message}`
      )
      // Don't fail the interview request if email fails - continue anyway
    }

    // Also send confirmation email to user
    const userEmailContent = `
      <h2>Interview Request Received</h2>
      <p>Hi ${userName},</p>
      <p>Your interview request has been received. We're looking for a professional interviewer for you.</p>
      <h3>Your Interview Details:</h3>
      <ul>
        <li><strong>Topic:</strong> ${topic}</li>
        <li><strong>Difficulty:</strong> ${difficulty}</li>
        <li><strong>Duration:</strong> ${duration} minutes</li>
      </ul>
      <h3>Google Meet Link:</h3>
      <p><a href="${meetLink}" target="_blank">${meetLink}</a></p>
      <p>Please wait for an interviewer to accept your request. The maximum wait time is 5 minutes.</p>
      <p>Once an interviewer accepts, you'll receive another email notification and can join the Google Meet session using the link above.</p>
      <p>Best of luck with your interview!</p>
      <p>- AlgoView Team</p>
    `

    try {
      await transporter.sendMail({
        from: process.env.SUPPORT_FROM_EMAIL || process.env.SMTP_USER || 'algoview@example.com',
        to: userEmail,
        subject: 'Interview Request Confirmed - AlgoView',
        html: userEmailContent,
      })
      console.log(`✅ Confirmation email sent to user ${userEmail}`)
    } catch (emailError) {
      console.warn(
        `⚠️ Failed to send confirmation email to user: ${emailError.message}`
      )
      // Don't fail the interview request if email fails - continue anyway
    }

    // Set timeout to remove session after 5 minutes if not accepted
    setTimeout(
      () => {
        if (
          activeInterviews.has(sessionId) &&
          activeInterviews.get(sessionId).status === 'waiting'
        ) {
          activeInterviews.delete(sessionId)
          console.log(`⏰ Interview session ${sessionId} expired`)
        }
      },
      5 * 60 * 1000
    ) // 5 minutes

    const responseData = {
      success: true,
      message: 'Interview request submitted successfully',
      sessionId,
      meetLink,
    }
    
    console.log('✅ Interview request successful - sending response:', responseData)
    res.status(200).json(responseData)
  } catch (error) {
    console.error('❌ Error requesting interview:', error)
    res.status(500).json({
      success: false,
      message: 'Error processing interview request',
      error: error.message,
    })
  }
}

/**
 * Accept an interview request
 * GET /api/interview/accept?sessionId=xxx
 */
exports.acceptInterview = async (req, res) => {
  try {
    const { sessionId } = req.query

    if (!sessionId || !activeInterviews.has(sessionId)) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found or expired',
      })
    }

    const session = activeInterviews.get(sessionId)

    // Update session status
    session.status = 'accepted'
    session.acceptedAt = new Date()

    // Send email to user confirming acceptance
    const userEmailContent = `
      <h2>Interview Accepted!</h2>
      <p>Hi ${session.userName},</p>
      <p>Great news! An interviewer has accepted your interview request.</p>
      <h3>Your Interview Details:</h3>
      <ul>
        <li><strong>Topic:</strong> ${session.topic}</li>
        <li><strong>Difficulty:</strong> ${session.difficulty}</li>
        <li><strong>Duration:</strong> ${session.duration} minutes</li>
        <li><strong>Meet Link:</strong> <a href="${session.meetLink}">${session.meetLink}</a></li>
      </ul>
      <p>
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/interview?sessionId=${sessionId}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Start Interview
        </a>
      </p>
      <p>Be ready to discuss the selected topic and prepare for technical questions.</p>
      <p>Good luck!</p>
      <p>- AlgoView Team</p>
    `

    // Try to send acceptance email (don't fail if it doesn't work)
    try {
      await transporter.sendMail({
        from: process.env.SUPPORT_FROM_EMAIL || process.env.SMTP_USER || 'algoview@example.com',
        to: session.userEmail,
        subject: 'Your Interview Has Been Accepted - AlgoView',
        html: userEmailContent,
      })
      console.log(`✅ Interview acceptance email sent to ${session.userEmail}`)
    } catch (emailError) {
      console.warn(
        `⚠️ Failed to send acceptance email: ${emailError.message}`
      )
      // Continue anyway - interview is already accepted in the database
    }

    res.status(200).json({
      success: true,
      message: 'Interview accepted successfully',
      sessionId,
      meetLink: session.meetLink,
    })
  } catch (error) {
    console.error('Error accepting interview:', error)
    res.status(500).json({
      success: false,
      message: 'Error accepting interview',
      error: error.message,
    })
  }
}

/**
 * Get interview session details
 * GET /api/interview/:sessionId
 */
exports.getInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.params

    if (!sessionId || !activeInterviews.has(sessionId)) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      })
    }

    const session = activeInterviews.get(sessionId)

    res.status(200).json({
      success: true,
      session,
    })
  } catch (error) {
    console.error('Error getting interview session:', error)
    res.status(500).json({
      success: false,
      message: 'Error retrieving interview session',
      error: error.message,
    })
  }
}

/**
 * Complete interview and submit feedback
 * POST /api/interview/:sessionId/complete
 */
exports.completeInterview = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { rating, feedback } = req.body

    if (!sessionId || !activeInterviews.has(sessionId)) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      })
    }

    const session = activeInterviews.get(sessionId)

    // Update session
    session.status = 'completed'
    session.completedAt = new Date()
    session.rating = rating
    session.feedback = feedback

    // In production, save this to database

    res.status(200).json({
      success: true,
      message: 'Interview completed successfully',
      session,
    })
  } catch (error) {
    console.error('Error completing interview:', error)
    res.status(500).json({
      success: false,
      message: 'Error completing interview',
      error: error.message,
    })
  }
}

/**
 * Get all active interview sessions (admin only)
 * GET /api/interview/admin/sessions
 */
exports.getAllSessions = async (req, res) => {
  try {
    // In production, check admin authentication here
    const sessions = Array.from(activeInterviews.values())

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    })
  } catch (error) {
    console.error('Error getting sessions:', error)
    res.status(500).json({
      success: false,
      message: 'Error retrieving sessions',
      error: error.message,
    })
  }
}

/**
 * Submit review and rating for an interview
 * POST /api/interview/:sessionId/review
 */
exports.submitReview = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { userId, rating, feedback } = req.body

    console.log(`📝 Submitting review for session ${sessionId}:`, {
      userId,
      rating,
      feedback: feedback ? feedback.substring(0, 50) + '...' : 'No feedback',
    })

    // Validate inputs
    if (!sessionId || !userId || !rating) {
      console.warn('❌ Review validation failed - missing fields')
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: sessionId, userId, rating',
      })
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      console.warn('❌ Rating out of range:', rating)
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      })
    }

    // Save to in-memory storage first
    const reviewData = {
      sessionId,
      userId,
      rating: parseInt(rating),
      feedback: feedback || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Generate a unique review ID for in-memory storage
    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store in memory
    if (activeInterviews.has(sessionId)) {
      const session = activeInterviews.get(sessionId)
      session.rating = parseInt(rating)
      session.feedback = feedback || ''
      session.reviewSubmitted = true
      session.reviewId = reviewId
    }

    console.log(`✅ Review stored in memory with ID: ${reviewId}`)

    // Try to also save to Firestore via REST API
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID || 'algorithm-visualizer-b963c'
      const apiKey = process.env.FIREBASE_API_KEY

      if (!apiKey) {
        throw new Error('FIREBASE_API_KEY not set in environment')
      }

      // Firestore REST API URL with authentication
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/interviewReviews?key=${apiKey}`

      // Convert to Firestore document format
      const firestoreDoc = {
        fields: {
          sessionId: { stringValue: sessionId },
          userId: { stringValue: userId },
          rating: { integerValue: parseInt(rating) },
          feedback: { stringValue: feedback || '' },
          createdAt: { timestampValue: new Date().toISOString() },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      }

      console.log('🔥 Attempting to save to Firestore REST API...')
      console.log('   Collection: interviewReviews')
      console.log('   Project:', projectId)
      console.log('   Using API Key authentication')

      const response = await fetch(firestoreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firestoreDoc),
      })

      if (response.status === 200 || response.status === 201) {
        const data = await response.json()
        const firebaseDocId = data.name?.split('/').pop() || reviewId
        console.log(`✅✅✅ SUCCESS! Review saved to Firebase with ID: ${firebaseDocId}`)
        console.log(`✅ View in Firestore: https://console.firebase.google.com/firestore/data/interviewReviews`)

        return res.status(200).json({
          success: true,
          message: 'Review submitted successfully to Firebase',
          reviewId: firebaseDocId,
          data: reviewData,
        })
      } else {
        const errorData = await response.text()
        console.warn(`⚠️ Firestore API warning: ${response.status}`)
        console.warn('Response:', errorData)
        
        // Still return success since we have in-memory backup
        return res.status(200).json({
          success: true,
          message: 'Review recorded (Firestore sync pending)',
          reviewId,
          data: reviewData,
        })
      }
    } catch (firestoreError) {
      console.warn(`⚠️ Firestore sync warning: ${firestoreError.message}`)
      // Still return success since we have in-memory backup
      return res.status(200).json({
        success: true,
        message: 'Review recorded (Firestore sync pending)',
        reviewId,
        data: reviewData,
      })
    }
  } catch (error) {
    console.error('❌ Error submitting review:', error)
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message,
    })
  }
}

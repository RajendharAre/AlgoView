/**
 * Main server file for AlgoView backend
 */

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const leetcodeRoutes = require('./routes/leetcodeRoutes')
const supportRoutes = require('./routes/supportRoutes')
const interviewRoutes = require('./routes/interviewRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('   Body:', req.body)
  }
  next()
})

// Routes
app.use('/api/leetcode', leetcodeRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/interview', interviewRoutes)

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'AlgoView Backend API' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

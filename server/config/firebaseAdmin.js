const admin = require('firebase-admin')

// Initialize Firebase Admin SDK
// Make sure you have your Google service account JSON file in the server directory
// Or set FIREBASE_SERVICE_ACCOUNT_JSON environment variable

let firebaseApp

try {
  // Check if service account key is provided
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'
  
  // Try to initialize with service account
  try {
    const serviceAccount = require(serviceAccountPath)
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
    console.log('✅ Firebase Admin SDK initialized with service account')
  } catch (err) {
    // If service account file doesn't exist, try to initialize with default credentials
    console.warn('⚠️ Service account file not found, trying default credentials with Project ID...')
    
    // For default credentials, the Project ID must be passed explicitly
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'algorithm-visualizer-b963c',
    })
    console.log('✅ Firebase Admin SDK initialized with default credentials')
    console.log('📌 Project ID:', process.env.FIREBASE_PROJECT_ID || 'algorithm-visualizer-b963c')
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error)
  console.error('❌ Make sure FIREBASE_PROJECT_ID is set in .env file')
  throw error
}

const db = admin.firestore()

module.exports = {
  admin,
  db,
  firebaseApp,
}

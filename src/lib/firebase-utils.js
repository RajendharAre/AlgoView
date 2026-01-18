// src/lib/firebase-utils.js
// Utility file to handle Firebase operations with fallback to mock when real Firebase is not configured

// Check if we have Firebase environment variables configured
const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID;

let firebaseExports;

if (hasFirebaseConfig) {
  // Use real Firebase
  console.log('✅ Using real Firebase configuration');
  firebaseExports = {
    ...(await import('./firebase')),
    isMock: false
  };
} else {
  // Use mock Firebase
  console.log('⚠️ No Firebase config found, using mock services for development');
  console.log('💡 To use real Firebase, set up your .env file with proper credentials');
  firebaseExports = {
    ...(await import('./firebase-mock')),
    isMock: true
  };
}

export const { auth, db } = firebaseExports;
export { doc, setDoc, getDoc, onSnapshot, deleteField } from hasFirebaseConfig ? 'firebase/firestore' : './firebase-mock';
export { onAuthStateChanged, signOut } from hasFirebaseConfig ? 'firebase/auth' : './firebase-mock';

export default firebaseExports;
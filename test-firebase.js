// Test script to verify Firebase connection and data structure
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Firebase configuration (same as in your lib/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyBQJ1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8",
  authDomain: "algorithm-visualizer.firebaseapp.com",
  projectId: "algorithm-visualizer",
  storageBucket: "algorithm-visualizer.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebaseConnection() {
  console.log('=== FIREBASE CONNECTION TEST ===');
  
  try {
    // Test user ID (using a test user)
    const testUserId = 'test-user-123';
    const testProblemId = 'two-sum';
    
    // Test data
    const testData = {
      sessions: {
        [testProblemId]: {
          problemId: testProblemId,
          leetcodeSlug: 'two-sum',
          clickedAt: Date.now()
        }
      },
      completedProblems: {},
      leetcodeUsername: 'testuser'
    };
    
    console.log('Writing test data to Firebase...');
    await setDoc(doc(db, 'users', testUserId), testData, { merge: true });
    console.log('✅ Test data written successfully');
    
    console.log('Reading test data back from Firebase...');
    const userDoc = await getDoc(doc(db, 'users', testUserId));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log('✅ Test data read successfully:', data);
      
      // Check specific fields
      console.log('Sessions field exists:', !!data.sessions);
      console.log('Test problem session exists:', !!data.sessions?.[testProblemId]);
      if (data.sessions?.[testProblemId]) {
        console.log('Test session data:', data.sessions[testProblemId]);
      }
      
      console.log('✅ FIREBASE CONNECTION WORKING PROPERLY');
    } else {
      console.log('❌ User document not found after writing');
    }
    
  } catch (error) {
    console.error('❌ FIREBASE CONNECTION FAILED:', error);
    console.error('Error details:', error.message);
  }
  
  console.log('=== TEST COMPLETE ===');
}

// Run the test
testFirebaseConnection();
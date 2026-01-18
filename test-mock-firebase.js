// Quick test to verify mock Firebase is working
import { db, auth, doc, setDoc, getDoc, onAuthStateChanged } from './firebase-mock';

async function testMockFirebase() {
  console.log('=== MOCK FIREBASE TEST ===');
  
  try {
    // Test authentication
    console.log('Testing authentication...');
    let currentUser = null;
    onAuthStateChanged(auth, user => {
      currentUser = user;
      console.log('Current user:', user?.uid, user?.email);
    });
    
    // Test database operations
    console.log('Testing database operations...');
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
    
    console.log('Writing test data...');
    await setDoc(doc(db, 'users', testUserId), testData, { merge: true });
    console.log('✅ Data written successfully');
    
    console.log('Reading test data back...');
    const userDoc = await getDoc(doc(db, 'users', testUserId));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log('✅ Data read successfully:', data);
      
      // Check specific fields
      console.log('Sessions field exists:', !!data.sessions);
      console.log('Test problem session exists:', !!data.sessions?.[testProblemId]);
      if (data.sessions?.[testProblemId]) {
        console.log('Test session data:', data.sessions[testProblemId]);
      }
      
      console.log('✅ MOCK FIREBASE WORKING PROPERLY');
    } else {
      console.log('❌ User document not found after writing');
    }
    
  } catch (error) {
    console.error('❌ MOCK FIREBASE TEST FAILED:', error);
    console.error('Error details:', error.message);
  }
  
  console.log('=== TEST COMPLETE ===');
}

// Run the test
testMockFirebase();
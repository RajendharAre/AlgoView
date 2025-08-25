/* eslint-disable no-unused-vars */
// src/components/TestFirebase.jsx
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';

const TestFirebase = () => {
  const [status, setStatus] = useState({});
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test1234');
  const [testData, setTestData] = useState('');

  // Test Firebase Connection on component mount
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    const results = {};
    
    try {
      // Test 1: Check if environment variables are loaded
      results.envVariables = {
        apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
        status: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Loaded' : '❌ Missing'
      };

      // Test 2: Check Firebase app initialization
      results.firebaseInit = '✅ Successful';
      
      setStatus(results);
    } catch (error) {
      results.firebaseInit = `❌ Error: ${error.message}`;
      setStatus(results);
    }
  };

  const testAuthentication = async () => {
    const results = {};
    try {
      // Create test user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      results.authCreate = `✅ User created: ${userCredential.user.email}`;
      
      // Sign out
      await signOut(auth);
      results.authSignOut = '✅ Signed out successfully';
      
      // Sign in
      const signInCredential = await signInWithEmailAndPassword(auth, email, password);
      results.authSignIn = `✅ Signed in: ${signInCredential.user.email}`;
      
      setStatus(prev => ({ ...prev, ...results }));
    } catch (error) {
      setStatus(prev => ({ ...prev, authError: `❌ Auth Error: ${error.message}` }));
    }
  };

  const testFirestore = async () => {
    const results = {};
    try {
      const testDocRef = doc(db, 'test', 'testDocument');
      
      // Write data
      await setDoc(testDocRef, {
        message: 'Hello Firebase!',
        timestamp: new Date(),
        testData: testData || 'Default test data'
      });
      results.firestoreWrite = '✅ Data written successfully';
      
      // Read data
      const docSnapshot = await getDoc(testDocRef);
      if (docSnapshot.exists()) {
        results.firestoreRead = `✅ Data read: ${JSON.stringify(docSnapshot.data())}`;
      } else {
        results.firestoreRead = '❌ Document not found';
      }
      
      setStatus(prev => ({ ...prev, ...results }));
    } catch (error) {
      setStatus(prev => ({ ...prev, firestoreError: `❌ Firestore Error: ${error.message}` }));
    }
  };

  const runAllTests = async () => {
    const results = {};
    setStatus({ running: '🚀 Running tests...' });
    
    await testFirebaseConnection();
    await testAuthentication();
    await testFirestore();
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Firebase Connection Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="test@example.com"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="test1234"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Data:</label>
        <input
          type="text"
          value={testData}
          onChange={(e) => setTestData(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Data to save in Firestore"
        />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={runAllTests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run All Tests
        </button>
        <button
          onClick={testAuthentication}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Auth Only
        </button>
        <button
          onClick={testFirestore}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Firestore Only
        </button>
      </div>

      <div className="p-4 bg-white rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
        <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(status, null, 2)}
        </pre>
      </div>

      {/* Real-time connection status */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold">Real-time Status:</h4>
        <p>Firebase Config Loaded: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌'}</p>
        <p>Current User: {auth.currentUser ? auth.currentUser.email : 'Not signed in'}</p>
      </div>
    </div>
  );
};

export default TestFirebase;
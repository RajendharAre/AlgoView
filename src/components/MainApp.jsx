// src/components/MainApp.jsx
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const MainApp = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Algorithm Visualizer</h1>
            <p className="text-gray-600">Welcome! You are logged in. 🎉</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Success! Your app is working!</h2>
          <p className="text-gray-700 mb-4">
            You are currently logged in. Click the logout button to see the login interface.
          </p>
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">✅ <strong>Logged In Successfully</strong></p>
            <p className="text-green-800">✅ <strong>Firebase Connected</strong></p>
            <p className="text-green-800">✅ <strong>Authentication Working</strong></p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Click "Logout" to see the login/register interface</li>
              <li>Then you can test creating new accounts</li>
              <li>After that, we'll build the algorithm visualizers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
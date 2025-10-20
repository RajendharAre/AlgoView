import { useSelector, useDispatch } from 'react-redux';
import { setAlgorithm, play, pause, reset } from '../store/slices/algorithmSlice';
import { toggleTheme, addNotification } from '../store/slices/uiSlice';
import { registerUser, loginUser, loginWithGoogle, loginWithGitHub, signOut, clearError } from '../store/slices/userSlice';

const TestRedux = () => {
  const dispatch = useDispatch();
  
  // Algorithm state
  const { selectedAlgorithm, isRunning, speed, currentStep, inputData } = useSelector(state => state.algorithm);
  
  // UI state
  const { theme } = useSelector(state => state.ui);
  
  // User state
  const { currentUser, loading, error } = useSelector(state => state.user);
  
  // Handle algorithm controls
  const handleAlgorithmChange = (e) => {
    dispatch(setAlgorithm(e.target.value));
  };
  
  const handlePlay = () => {
    dispatch(play());
  };
  
  const handlePause = () => {
    dispatch(pause());
  };
  
  const handleReset = () => {
    dispatch(reset());
  };
  
  // Handle UI controls
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  // Handle user actions (simulated)
  const handleRegister = () => {
    dispatch(registerUser({ email: 'test@example.com', password: 'password123' }));
  };
  
  const handleLogin = () => {
    dispatch(loginUser({ email: 'test@example.com', password: 'password123' }));
  };
  
  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };
  
  const handleGitHubLogin = () => {
    dispatch(loginWithGitHub());
  };
  
  const handleSignOut = () => {
    dispatch(signOut());
  };
  
  const handleClearError = () => {
    dispatch(clearError());
  };
  
  const handleAddNotification = () => {
    dispatch(addNotification({
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info'
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Redux Store Test</h2>
      
      {/* Algorithm Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Algorithm State</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Selected Algorithm</label>
            <select 
              value={selectedAlgorithm} 
              onChange={handleAlgorithmChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="bubbleSort">Bubble Sort</option>
              <option value="quickSort">Quick Sort</option>
              <option value="mergeSort">Merge Sort</option>
              <option value="binarySearch">Binary Search</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Speed: {speed}ms</label>
            <input 
              type="range" 
              min="100" 
              max="1000" 
              step="100" 
              value={speed} 
              onChange={(e) => dispatch(setAlgorithm(parseInt(e.target.value)))}
              className="mt-1 block w-full"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handlePlay}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Play
          </button>
          <button 
            onClick={handlePause}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Pause
          </button>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p>Current Step: {currentStep}</p>
          <p>Is Running: {isRunning ? 'Yes' : 'No'}</p>
          <p>Input Data: [{inputData.join(', ')}]</p>
        </div>
      </div>
      
      {/* UI Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">UI State</h3>
        <div className="flex space-x-2">
          <button 
            onClick={handleToggleTheme}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Theme (Current: {theme})
          </button>
          <button 
            onClick={handleAddNotification}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add Notification
          </button>
        </div>
      </div>
      
      {/* User Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">User State</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={handleRegister}
            disabled={loading}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Google Login'}
          </button>
          <button 
            onClick={handleGitHubLogin}
            disabled={loading}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'GitHub Login'}
          </button>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
          <button 
            onClick={handleClearError}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Error
          </button>
        </div>
        
        <div className="p-3 bg-gray-100 rounded">
          {error && (
            <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
              Error: {error}
              <button 
                onClick={handleClearError}
                className="ml-2 text-sm underline"
              >
                Clear
              </button>
            </div>
          )}
          <p>Current User: {currentUser ? currentUser.email || 'Logged in' : 'Not logged in'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestRedux;
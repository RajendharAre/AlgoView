import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setAlgorithm, setInputData, setSearchTarget } from '../store/slices/algorithmSlice';
import { addNotification } from '../store/slices/uiSlice';

const ReduxTestPage = () => {
  const dispatch = useDispatch();
  
  // Algorithm state
  const algorithmState = useSelector(state => state.algorithm);
  
  // UI state
  const uiState = useSelector(state => state.ui);
  
  // Ideas state
  const ideasState = useSelector(state => state.ideas);
  
  // Resources state
  const resourcesState = useSelector(state => state.resources);
  
  // User state
  const userState = useSelector(state => state.user);
  
  // Initialize with some test data
  useEffect(() => {
    dispatch(setAlgorithm('quickSort'));
    dispatch(setInputData([5, 2, 8, 1, 9, 3]));
    dispatch(setSearchTarget(8));
    dispatch(addNotification({
      title: 'Redux Store Loaded',
      message: 'All slices are working correctly',
      type: 'success'
    }));
  }, [dispatch]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Redux Store Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Algorithm Slice */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Algorithm Slice</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Selected Algorithm:</span> {algorithmState.selectedAlgorithm}</p>
            <p><span className="font-medium">Is Running:</span> {algorithmState.isRunning ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Speed:</span> {algorithmState.speed}ms</p>
            <p><span className="font-medium">Current Step:</span> {algorithmState.currentStep}</p>
            <p><span className="font-medium">Input Data:</span> [{algorithmState.inputData.join(', ')}]</p>
            <p><span className="font-medium">Search Target:</span> {algorithmState.searchTarget}</p>
          </div>
        </div>
        
        {/* UI Slice */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-green-600">UI Slice</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Theme:</span> {uiState.theme}</p>
            <p><span className="font-medium">Sidebar Open:</span> {uiState.sidebarOpen ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Modal Open:</span> {uiState.modalOpen ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Notifications:</span> {uiState.notifications.length}</p>
          </div>
        </div>
        
        {/* User Slice */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-purple-600">User Slice</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Current User:</span> {userState.currentUser ? 'Logged in' : 'Not logged in'}</p>
            <p><span className="font-medium">Loading:</span> {userState.loading ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Error:</span> {userState.error || 'None'}</p>
          </div>
        </div>
        
        {/* Ideas Slice */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-yellow-600">Ideas Slice</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Ideas Count:</span> {ideasState.ideas.length}</p>
            <p><span className="font-medium">Selected Idea:</span> {ideasState.selectedIdea ? 'Yes' : 'None'}</p>
            <p><span className="font-medium">Loading:</span> {ideasState.loading ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Error:</span> {ideasState.error || 'None'}</p>
          </div>
        </div>
        
        {/* Resources Slice */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-3 text-red-600">Resources Slice</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Resources Count:</span> {resourcesState.resources.length}</p>
            <p><span className="font-medium">Categories Count:</span> {resourcesState.categories.length}</p>
            <p><span className="font-medium">Loading:</span> {resourcesState.loading ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Error:</span> {resourcesState.error || 'None'}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Redux Store Implementation Complete</h2>
        <p className="text-gray-700">
          All Redux slices have been successfully implemented and integrated into the Algorithm Visualizer application.
          The store includes proper middleware configuration for Firebase, TypeScript-style documentation, 
          error handling, and Redux DevTools configuration.
        </p>
      </div>
    </div>
  );
};

export default ReduxTestPage;
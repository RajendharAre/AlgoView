// src/components/MainApp.jsx
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import Sidebar from './Layout/Sidebar';
import VisualizationPage from './Visualization/VisualizationPage';

const MainApp = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmSelect={setSelectedAlgorithm}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Algorithm Visualizer
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Visualization Area */}
        <main className="flex-1 overflow-auto">
          <VisualizationPage selectedAlgorithm={selectedAlgorithm} />
        </main>
      </div>
    </div>
  );
};

export default MainApp;
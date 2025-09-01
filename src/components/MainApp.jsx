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
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10">
                <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="AV logo">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0" stopColor="#4f46e5" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="url(#g1)" />
                  <text x="50" y="58" textAnchor="middle" fontWeight="700" fontSize="44" fill="white" fontFamily="Inter, Arial, sans-serif">AV</text>
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-800">Algorithm Visualizer</h1>
            </div>

            <div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
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
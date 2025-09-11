// src/components/MainApp.jsx
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';
import VisualizationPage from './Visualisation/VisualizationPage';

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
        <Header 
          onLogout={handleLogout}
          user={auth.currentUser}
        />


        {/* Visualization Area */}
        <main className="flex-1 overflow-auto">
          <VisualizationPage selectedAlgorithm={selectedAlgorithm} />
        </main>
      </div>
    </div>
  );
};

export default MainApp;
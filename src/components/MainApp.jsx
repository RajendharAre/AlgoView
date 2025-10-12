import { useState } from 'react';
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';
import VisualizationPage from './Visualisation/VisualizationPage';

const MainApp = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmSelect={setSelectedAlgorithm}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* Visualization Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <VisualizationPage selectedAlgorithm={selectedAlgorithm} />
        </main>
      </div>
    </div>
  );
};

export default MainApp;
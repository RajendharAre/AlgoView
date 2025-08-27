import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import AlgorithmVisualizer from './components/visualization/AlgorithmVisualizer';
import Auth from './components/Auth/Auth';
import Loader from './components/Common/Loader';

function App() {
  const { user, loading } = useAuth();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="flex">
        <Sidebar 
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmSelect={setSelectedAlgorithm}
        />
        
        <main className="flex-1 p-6">
          <AlgorithmVisualizer algorithm={selectedAlgorithm} />
        </main>
      </div>
    </div>
  );
}

export default App;
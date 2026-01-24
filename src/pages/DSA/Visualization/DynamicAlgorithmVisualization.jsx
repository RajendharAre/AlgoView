import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SortingVisualization from '../../../components/Visualisation/SortingVisualization';
import { ALGORITHMS } from '../../../utils/algorithmConstants';

/**
 * Dynamic Algorithm Visualization Component
 * Dynamically loads and visualizes any available algorithm
 */
const DynamicAlgorithmVisualization = () => {
  const { algorithmId } = useParams();
  const [algorithmData, setAlgorithmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlgorithm = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Look up the algorithm in our registry
        const algorithmInfo = ALGORITHMS[algorithmId];
        
        if (!algorithmInfo) {
          throw new Error(`Algorithm "${algorithmId}" not found`);
        }

        // Get the algorithm generator function
        const algorithmModule = await algorithmInfo.importFn();
        const algorithmGenerator = typeof algorithmModule === 'function' 
          ? algorithmModule 
          : algorithmModule[algorithmId.replace(/([A-Z])/g, '_$1').toLowerCase()] || 
            algorithmModule[algorithmId];

        // Set up the algorithm data
        setAlgorithmData({
          generator: algorithmGenerator,
          name: algorithmInfo.name,
          category: algorithmInfo.category
        });
      } catch (err) {
        console.error(`Error loading algorithm ${algorithmId}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAlgorithm();
  }, [algorithmId]);

  // Default color palette for algorithms
  const getDefaultColors = (category) => {
    switch (category) {
      case 'sorting':
        return {
          unsorted: '#ced4daff',
          comparing: '#495057ff',
          swapping: '#212529ff',
          sorted: '#6c757dff',
          background: '#f8f9faff'
        };
      case 'searching':
        return {
          unsorted: '#d1ecf1ff',
          comparing: '#0c5460ff',
          swapping: '#042124ff',
          sorted: '#207a8eff',
          background: '#f8f9faff'
        };
      case 'graph':
        return {
          unsorted: '#f1ecdcff',
          comparing: '#8a6d3bff',
          swapping: '#3c2e17ff',
          sorted: '#5e4e2cff',
          background: '#f8f9faff'
        };
      default:
        return {
          unsorted: '#ced4daff',
          comparing: '#495057ff',
          swapping: '#212529ff',
          sorted: '#6c757dff',
          background: '#f8f9faff'
        };
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {algorithmId} visualization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Algorithm Not Available</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">This algorithm visualization is not currently implemented.</p>
        </div>
      </div>
    );
  }

  if (algorithmData) {
    // For now, we'll use the SortingVisualization component for all algorithms
    // In the future, we could have different visualization components for different algorithm types
    return (
      <div className="h-screen w-full">
        <SortingVisualization
          algorithmGenerator={algorithmData.generator}
          algorithmName={algorithmData.name}
          customColors={getDefaultColors(algorithmData.category)}
          allowUserInput={true}
          onComplete={(results) => {
            console.log(`${algorithmData.name} completed:`, results);
          }}
        />
      </div>
    );
  }

  return null;
};

export default DynamicAlgorithmVisualization;
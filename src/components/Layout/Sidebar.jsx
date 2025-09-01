// src/components/Layout/Sidebar.jsx
import { ALGORITHMS } from '../../utils/algorithmConstants';

const Sidebar = ({ selectedAlgorithm, onAlgorithmSelect }) => {
  const algorithmGroups = {
    'Sorting Algorithms': ['bubbleSort', 'quickSort', 'mergeSort'],
    'Searching Algorithms': ['linearSearch']
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Algorithms</h2>
      
      {Object.entries(algorithmGroups).map(([category, algorithms]) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {category}
          </h3>
          <div className="space-y-1">
            {algorithms.map(algoId => (
              <button
                key={algoId}
                onClick={() => onAlgorithmSelect(algoId)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedAlgorithm === algoId
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {ALGORITHMS[algoId.toUpperCase()]?.name || algoId}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
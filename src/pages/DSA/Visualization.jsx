import { useParams } from 'react-router-dom'
import VisualizationPage from '../../components/Visualisation/VisualizationPage'
import { getAlgorithmInfoById } from '../../utils/algorithmConstants'

const DSAVisualization = () => {
  const { algorithmId } = useParams()
  
  // Check if algorithm exists
  const algorithmInfo = getAlgorithmInfoById(algorithmId)
  
  // Debug information
  console.log('Algorithm ID from URL:', algorithmId)
  console.log('Algorithm info found:', algorithmInfo)
  
  if (!algorithmInfo) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Algorithm Not Found</h2>
          <p className="text-gray-600 mb-6">The requested algorithm visualization is not available.</p>
          <p className="text-gray-500 text-sm mb-4">Requested ID: {algorithmId}</p>
          <a 
            href="/dsa" 
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Algorithms
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto h-full">
      <VisualizationPage selectedAlgorithm={algorithmInfo.id} />
    </div>
  )
}

export default DSAVisualization
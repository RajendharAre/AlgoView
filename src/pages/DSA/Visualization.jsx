import { useParams } from 'react-router-dom'
import VisualizationPage from '../../components/Visualisation/VisualizationPage'

const DSAVisualization = () => {
  const { algorithmId } = useParams()
  
  console.log('DSAVisualization rendered with algorithmId:', algorithmId);
  
  return (
    <div className="h-full">
      <VisualizationPage selectedAlgorithm={algorithmId} />
    </div>
  )
}

export default DSAVisualization
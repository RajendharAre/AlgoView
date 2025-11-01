import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAlgorithm } from '../../hooks/useAlgorithm'
import ArrayVisualizer from './ArrayVisualizer'
import AlgorithmController from './AlgorithmController'
import { getAlgorithmInfoById } from '../../utils/algorithmConstants'
import { RefreshCcw, Play, Dice5, Settings, Info } from 'lucide-react'
import { layoutNodesCircle } from '../../utils/graphUtils'
import GraphVisualizer from './GraphVisualizer'
import AlgorithmVisualizer from './AlgorithmVisualizer'

const VisualizationPage = ({ selectedAlgorithm }) => {
  return (
    <AlgorithmVisualizer selectedAlgorithm={selectedAlgorithm} />
  )
}

export default VisualizationPage
